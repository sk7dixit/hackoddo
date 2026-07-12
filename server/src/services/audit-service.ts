import dbClient from '../db/db-client';
import { AuditLog, AuditDiscrepancy, Asset, AssetStatus, Notification } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class AuditService {
  static async getAuditLogs(): Promise<AuditLog[]> {
    return dbClient.getAuditLogs();
  }

  static async startAudit(title: string, performedBy: string): Promise<AuditLog> {
    const assets = await dbClient.getAssets();
    
    // Filter physical assets (exclude shared resources since resources are stationary / location-locked like rooms)
    const categories = await dbClient.getCategories();
    const physicalAssets = assets.filter(a => {
      const cat = categories.find(c => c.id === a.categoryId);
      return cat?.type === 'asset';
    });

    const newAudit: AuditLog = {
      id: uuidv4(),
      title,
      performedBy,
      date: new Date().toISOString(),
      status: 'pending',
      checkedCount: 0,
      totalAssetsCount: physicalAssets.length,
      discrepancies: []
    };

    const audits = await dbClient.getAuditLogs();
    audits.push(newAudit);
    await dbClient.saveAuditLogs(audits);

    return newAudit;
  }

  static async verifyAssetInAudit(
    auditId: string,
    assetId: string,
    status: 'verified' | 'missing',
    notes: string,
    performedBy: string
  ): Promise<AuditLog> {
    const audits = await dbClient.getAuditLogs();
    const audit = audits.find(a => a.id === auditId);
    if (!audit) {
      throw new Error('Audit not found.');
    }
    if (audit.status === 'completed') {
      throw new Error('Audit is already completed.');
    }

    const assets = await dbClient.getAssets();
    const asset = assets.find(a => a.id === assetId);
    if (!asset) {
      throw new Error('Asset not found.');
    }

    // Check if asset was already audited in this run
    const existingDiscIndex = audit.discrepancies.findIndex(d => d.assetId === assetId);

    if (status === 'missing') {
      const discrepancy: AuditDiscrepancy = {
        assetId,
        assetName: asset.name,
        expectedStatus: asset.status,
        actualStatus: 'missing',
        notes,
        resolved: false
      };

      if (existingDiscIndex >= 0) {
        audit.discrepancies[existingDiscIndex] = discrepancy;
      } else {
        audit.discrepancies.push(discrepancy);
      }
    } else {
      // Verified (Matches status)
      // If it was marked missing previously, remove or mark resolved
      if (existingDiscIndex >= 0) {
        audit.discrepancies.splice(existingDiscIndex, 1);
      }
    }

    // Increment checked counter if this is the first time checking it
    // Wait, let's keep a list of checked asset IDs in a set or similar. 
    // To make it simple, we can compute checked count as unique assets checked.
    // Let's count discrepancies + we can track verified items.
    // Let's store checked assets list. Actually, we can add a list of checkedAssetIds to audit log or calculate it.
    // Let's store checkedAssetIds inside the audit log metadata, or we can just increment the checkedCount if not checked before.
    // To keep the DB model simple, we will increment checkedCount if we haven't checked this asset yet.
    // Let's implement that:
    const checkedAssetsCookie = (audit as any).checkedAssetIds || [];
    if (!checkedAssetsCookie.includes(assetId)) {
      checkedAssetsCookie.push(assetId);
      (audit as any).checkedAssetIds = checkedAssetsCookie;
      audit.checkedCount = checkedAssetsCookie.length;
    }

    // Log in asset history
    asset.history.push({
      id: uuidv4(),
      action: status === 'verified' ? 'Audit Verified' : 'Audit - Marked Missing',
      date: new Date().toISOString(),
      performedBy,
      notes: `Audit "${audit.title}": ${notes || 'Verified'}`
    });

    await dbClient.saveAuditLogs(audits);
    await dbClient.saveAssets(assets);

    return audit;
  }

  static async completeAudit(auditId: string, performedBy: string): Promise<AuditLog> {
    const audits = await dbClient.getAuditLogs();
    const audit = audits.find(a => a.id === auditId);
    if (!audit) {
      throw new Error('Audit not found.');
    }
    if (audit.status === 'completed') {
      throw new Error('Audit is already completed.');
    }

    audit.status = 'completed';

    // Apply outcomes: any unresolved missing asset becomes 'lost'
    const assets = await dbClient.getAssets();
    let updatedAssets = false;

    for (const discrepancy of audit.discrepancies) {
      if (!discrepancy.resolved && discrepancy.actualStatus === 'missing') {
        const asset = assets.find(a => a.id === discrepancy.assetId);
        if (asset && asset.status !== 'lost') {
          asset.status = 'lost';
          asset.history.push({
            id: uuidv4(),
            action: 'Marked Lost',
            date: new Date().toISOString(),
            performedBy,
            notes: `Auto-updated to Lost following Audit discrepancy: ${discrepancy.notes}`
          });
          updatedAssets = true;
        }
      }
    }

    if (updatedAssets) {
      await dbClient.saveAssets(assets);
    }

    await dbClient.saveAuditLogs(audits);

    // Notify Admin and Asset Manager
    const employees = await dbClient.getEmployees();
    const adminsAndManagers = employees.filter(e => e.role === 'admin' || e.role === 'asset_manager');
    const notifications = await dbClient.getNotifications();
    
    for (const user of adminsAndManagers) {
      notifications.push({
        id: uuidv4(),
        employeeId: user.id,
        title: 'Audit Cycle Completed',
        message: `Audit "${audit.title}" is complete. Checked ${audit.checkedCount}/${audit.totalAssetsCount} assets. Discrepancies found: ${audit.discrepancies.length}.`,
        date: new Date().toISOString(),
        read: false
      });
    }
    await dbClient.saveNotifications(notifications);

    return audit;
  }

  static async resolveDiscrepancy(auditId: string, assetId: string, notes: string, performedBy: string): Promise<AuditLog> {
    const audits = await dbClient.getAuditLogs();
    const audit = audits.find(a => a.id === auditId);
    if (!audit) {
      throw new Error('Audit not found.');
    }

    const discrepancy = audit.discrepancies.find(d => d.assetId === assetId);
    if (!discrepancy) {
      throw new Error('Discrepancy not found for this asset in this audit.');
    }

    discrepancy.resolved = true;
    discrepancy.notes += ` | Resolved: ${notes}`;

    // Return asset status back to available if it was lost
    const assets = await dbClient.getAssets();
    const asset = assets.find(a => a.id === assetId);
    if (asset && asset.status === 'lost') {
      asset.status = 'available';
      asset.history.push({
        id: uuidv4(),
        action: 'Found & Re-integrated',
        date: new Date().toISOString(),
        performedBy,
        notes: `Discrepancy resolved: ${notes}`
      });
      await dbClient.saveAssets(assets);
    }

    await dbClient.saveAuditLogs(audits);
    return audit;
  }
}
export default AuditService;
