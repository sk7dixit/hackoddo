import dbClient from '../db/db-client';
import { Allocation, Asset, Employee, Notification } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class AllocationService {
  static async getAllocations(): Promise<Allocation[]> {
    return dbClient.getAllocations();
  }

  static async requestAllocation(data: { assetId: string; employeeId: string; expectedReturnDate?: string; notes?: string }): Promise<Allocation> {
    const assets = await dbClient.getAssets();
    const asset = assets.find(a => a.id === data.assetId);

    if (!asset) {
      throw new Error('Asset not found.');
    }
    if (asset.status !== 'available') {
      throw new Error(`Asset is not available for allocation. Current status: ${asset.status}`);
    }

    const categories = await dbClient.getCategories();
    const category = categories.find(c => c.id === asset.categoryId);
    if (!category || category.type !== 'asset') {
      throw new Error('Only physical assets can be allocated. Resources must be booked.');
    }

    const newAllocation: Allocation = {
      id: uuidv4(),
      assetId: data.assetId,
      employeeId: data.employeeId,
      requestedBy: data.employeeId,
      approvedBy: null,
      requestDate: new Date().toISOString(),
      allocationDate: null,
      expectedReturnDate: data.expectedReturnDate || null,
      actualReturnDate: null,
      status: 'requested',
      notes: data.notes
    };

    const allocations = await dbClient.getAllocations();
    allocations.push(newAllocation);
    await dbClient.saveAllocations(allocations);

    // Update asset status to 'reserved' to prevent duplicate requests
    asset.status = 'reserved';
    asset.history.push({
      id: uuidv4(),
      action: 'Allocation Requested',
      date: new Date().toISOString(),
      performedBy: data.employeeId,
      notes: `Requested by employee. Expected return: ${data.expectedReturnDate || 'N/A'}`
    });
    await dbClient.saveAssets(assets);

    // Notify Asset Managers
    const employees = await dbClient.getEmployees();
    const managers = employees.filter(e => e.role === 'asset_manager');
    const requester = employees.find(e => e.id === data.employeeId);
    
    const notifications = await dbClient.getNotifications();
    for (const manager of managers) {
      notifications.push({
        id: uuidv4(),
        employeeId: manager.id,
        title: 'New Allocation Request',
        message: `${requester?.name || 'An employee'} has requested allocation of "${asset.name}".`,
        date: new Date().toISOString(),
        read: false
      });
    }
    await dbClient.saveNotifications(notifications);

    return newAllocation;
  }

  static async approveAllocation(id: string, managerId: string): Promise<Allocation> {
    const allocations = await dbClient.getAllocations();
    const alloc = allocations.find(a => a.id === id);
    if (!alloc) {
      throw new Error('Allocation request not found.');
    }
    if (alloc.status !== 'requested') {
      throw new Error(`Cannot approve allocation in status: ${alloc.status}`);
    }

    const assets = await dbClient.getAssets();
    const asset = assets.find(a => a.id === alloc.assetId);
    if (!asset) {
      throw new Error('Asset not found.');
    }

    // Set states
    alloc.status = 'approved';
    alloc.approvedBy = managerId;
    alloc.allocationDate = new Date().toISOString();

    asset.status = 'allocated';
    asset.history.push({
      id: uuidv4(),
      action: 'Allocation Approved',
      date: new Date().toISOString(),
      performedBy: managerId,
      notes: `Approved for employee ID: ${alloc.employeeId}`
    });

    await dbClient.saveAllocations(allocations);
    await dbClient.saveAssets(assets);

    // Notify requester
    const notifications = await dbClient.getNotifications();
    notifications.push({
      id: uuidv4(),
      employeeId: alloc.employeeId,
      title: 'Allocation Approved',
      message: `Your request for "${asset.name}" has been approved.`,
      date: new Date().toISOString(),
      read: false
    });
    await dbClient.saveNotifications(notifications);

    return alloc;
  }

  static async rejectAllocation(id: string, managerId: string, reason?: string): Promise<Allocation> {
    const allocations = await dbClient.getAllocations();
    const alloc = allocations.find(a => a.id === id);
    if (!alloc) {
      throw new Error('Allocation request not found.');
    }
    if (alloc.status !== 'requested') {
      throw new Error('Allocation is already processed.');
    }

    const assets = await dbClient.getAssets();
    const asset = assets.find(a => a.id === alloc.assetId);
    if (!asset) {
      throw new Error('Asset not found.');
    }

    alloc.status = 'rejected';
    alloc.approvedBy = managerId;
    alloc.notes = reason ? `${alloc.notes || ''} | Rejection Reason: ${reason}` : alloc.notes;

    // Release asset back to available
    asset.status = 'available';
    asset.history.push({
      id: uuidv4(),
      action: 'Allocation Rejected',
      date: new Date().toISOString(),
      performedBy: managerId,
      notes: reason || 'Rejected by Manager'
    });

    await dbClient.saveAllocations(allocations);
    await dbClient.saveAssets(assets);

    // Notify employee
    const notifications = await dbClient.getNotifications();
    notifications.push({
      id: uuidv4(),
      employeeId: alloc.employeeId,
      title: 'Allocation Request Rejected',
      message: `Your request for "${asset.name}" was rejected. Reason: ${reason || 'Not specified'}.`,
      date: new Date().toISOString(),
      read: false
    });
    await dbClient.saveNotifications(notifications);

    return alloc;
  }

  static async returnAsset(id: string, managerId: string): Promise<Allocation> {
    const allocations = await dbClient.getAllocations();
    const alloc = allocations.find(a => a.id === id);
    if (!alloc) {
      throw new Error('Allocation record not found.');
    }
    if (alloc.status !== 'approved') {
      throw new Error('This asset is not currently allocated.');
    }

    const assets = await dbClient.getAssets();
    const asset = assets.find(a => a.id === alloc.assetId);
    if (!asset) {
      throw new Error('Asset not found.');
    }

    alloc.status = 'returned';
    alloc.actualReturnDate = new Date().toISOString();

    asset.status = 'available';
    asset.history.push({
      id: uuidv4(),
      action: 'Returned',
      date: new Date().toISOString(),
      performedBy: managerId,
      notes: `Returned by employee ID: ${alloc.employeeId}`
    });

    await dbClient.saveAllocations(allocations);
    await dbClient.saveAssets(assets);

    // Notify employee
    const notifications = await dbClient.getNotifications();
    notifications.push({
      id: uuidv4(),
      employeeId: alloc.employeeId,
      title: 'Asset Return Verified',
      message: `The return of "${asset.name}" has been verified by the Asset Manager.`,
      date: new Date().toISOString(),
      read: false
    });
    await dbClient.saveNotifications(notifications);

    return alloc;
  }

  static async requestTransfer(assetId: string, currentEmployeeId: string, targetEmployeeId: string): Promise<Allocation> {
    const allocations = await dbClient.getAllocations();
    const alloc = allocations.find(a => a.assetId === assetId && a.employeeId === currentEmployeeId && a.status === 'approved');
    if (!alloc) {
      throw new Error('Active allocation not found for this asset and employee.');
    }

    alloc.status = 'transfer_pending';
    alloc.transferToEmployeeId = targetEmployeeId;

    await dbClient.saveAllocations(allocations);

    // Update asset history
    const assets = await dbClient.getAssets();
    const asset = assets.find(a => a.id === assetId);
    
    const employees = await dbClient.getEmployees();
    const targetEmployee = employees.find(e => e.id === targetEmployeeId);

    if (asset) {
      asset.history.push({
        id: uuidv4(),
        action: 'Transfer Requested',
        date: new Date().toISOString(),
        performedBy: currentEmployeeId,
        notes: `Requested transfer to ${targetEmployee?.name || targetEmployeeId}`
      });
      await dbClient.saveAssets(assets);
    }

    // Notify Asset Managers
    const managers = employees.filter(e => e.role === 'asset_manager');
    const notifications = await dbClient.getNotifications();
    for (const manager of managers) {
      notifications.push({
        id: uuidv4(),
        employeeId: manager.id,
        title: 'Asset Transfer Request',
        message: `Transfer requested for "${asset?.name}" from ${employees.find(e => e.id === currentEmployeeId)?.name} to ${targetEmployee?.name}.`,
        date: new Date().toISOString(),
        read: false
      });
    }
    await dbClient.saveNotifications(notifications);

    return alloc;
  }

  static async approveTransfer(id: string, managerId: string): Promise<Allocation> {
    const allocations = await dbClient.getAllocations();
    const alloc = allocations.find(a => a.id === id);
    if (!alloc || alloc.status !== 'transfer_pending' || !alloc.transferToEmployeeId) {
      throw new Error('Valid pending transfer request not found.');
    }

    const assets = await dbClient.getAssets();
    const asset = assets.find(a => a.id === alloc.assetId);
    if (!asset) {
      throw new Error('Asset not found.');
    }

    const originalEmployeeId = alloc.employeeId;
    const newEmployeeId = alloc.transferToEmployeeId;

    // 1. Terminate old allocation
    alloc.status = 'returned';
    alloc.actualReturnDate = new Date().toISOString();

    // 2. Create new allocation
    const newAlloc: Allocation = {
      id: uuidv4(),
      assetId: alloc.assetId,
      employeeId: newEmployeeId,
      requestedBy: originalEmployeeId, // Initiated transfer
      approvedBy: managerId,
      requestDate: alloc.requestDate,
      allocationDate: new Date().toISOString(),
      expectedReturnDate: alloc.expectedReturnDate,
      actualReturnDate: null,
      status: 'approved',
      notes: `Transferred from employee ID: ${originalEmployeeId}`
    };
    allocations.push(newAlloc);
    await dbClient.saveAllocations(allocations);

    // 3. Update asset log
    const employees = await dbClient.getEmployees();
    const newEmp = employees.find(e => e.id === newEmployeeId);
    const origEmp = employees.find(e => e.id === originalEmployeeId);

    asset.history.push({
      id: uuidv4(),
      action: 'Transfer Approved',
      date: new Date().toISOString(),
      performedBy: managerId,
      notes: `Transferred from ${origEmp?.name} to ${newEmp?.name}`
    });
    await dbClient.saveAssets(assets);

    // 4. Notifications
    const notifications = await dbClient.getNotifications();
    // Notify original employee
    notifications.push({
      id: uuidv4(),
      employeeId: originalEmployeeId,
      title: 'Transfer Approved',
      message: `Your transfer of "${asset.name}" to ${newEmp?.name} has been approved.`,
      date: new Date().toISOString(),
      read: false
    });
    // Notify target employee
    notifications.push({
      id: uuidv4(),
      employeeId: newEmployeeId,
      title: 'Asset Transferred to You',
      message: `"${asset.name}" has been transferred to your custody by ${origEmp?.name}.`,
      date: new Date().toISOString(),
      read: false
    });
    await dbClient.saveNotifications(notifications);

    return alloc;
  }
}
export default AllocationService;
