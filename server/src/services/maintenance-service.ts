import dbClient from '../db/db-client';
import { Maintenance, Asset, Notification } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class MaintenanceService {
  static async getMaintenanceTickets(): Promise<Maintenance[]> {
    return dbClient.getMaintenance();
  }

  static async reportIssue(data: { assetId: string; reportedBy: string; issueDescription: string }): Promise<Maintenance> {
    const assets = await dbClient.getAssets();
    const asset = assets.find(a => a.id === data.assetId);

    if (!asset) {
      throw new Error('Asset not found.');
    }

    const newTicket: Maintenance = {
      id: uuidv4(),
      assetId: data.assetId,
      reportedBy: data.reportedBy,
      approvedBy: null,
      technician: '',
      issueDescription: data.issueDescription,
      cost: 0,
      status: 'reported',
      reportedDate: new Date().toISOString(),
      resolvedDate: null
    };

    const tickets = await dbClient.getMaintenance();
    tickets.push(newTicket);
    await dbClient.saveMaintenance(tickets);

    // Update asset history
    asset.history.push({
      id: uuidv4(),
      action: 'Issue Reported',
      date: new Date().toISOString(),
      performedBy: data.reportedBy,
      notes: data.issueDescription
    });
    await dbClient.saveAssets(assets);

    // Notify Asset Managers
    const employees = await dbClient.getEmployees();
    const managers = employees.filter(e => e.role === 'asset_manager');
    const reporter = employees.find(e => e.id === data.reportedBy);

    const notifications = await dbClient.getNotifications();
    for (const manager of managers) {
      notifications.push({
        id: uuidv4(),
        employeeId: manager.id,
        title: 'New Maintenance Ticket',
        message: `${reporter?.name} reported an issue with "${asset.name}": "${data.issueDescription}"`,
        date: new Date().toISOString(),
        read: false
      });
    }
    await dbClient.saveNotifications(notifications);

    return newTicket;
  }

  static async approveMaintenance(id: string, managerId: string, technician: string, estimatedCost: number): Promise<Maintenance> {
    const tickets = await dbClient.getMaintenance();
    const ticket = tickets.find(t => t.id === id);

    if (!ticket) {
      throw new Error('Maintenance ticket not found.');
    }
    if (ticket.status !== 'reported') {
      throw new Error('Ticket is already processed.');
    }

    const assets = await dbClient.getAssets();
    const asset = assets.find(a => a.id === ticket.assetId);
    if (!asset) {
      throw new Error('Asset not found.');
    }

    ticket.status = 'approved';
    ticket.approvedBy = managerId;
    ticket.technician = technician;
    ticket.cost = estimatedCost;

    // Transition asset status to under_maintenance
    asset.status = 'under_maintenance';
    asset.history.push({
      id: uuidv4(),
      action: 'Maintenance Started',
      date: new Date().toISOString(),
      performedBy: managerId,
      notes: `Sent to technician: ${technician}. Est. Cost: $${estimatedCost}`
    });

    await dbClient.saveMaintenance(tickets);
    await dbClient.saveAssets(assets);

    // Notify employee who reported it
    const notifications = await dbClient.getNotifications();
    notifications.push({
      id: uuidv4(),
      employeeId: ticket.reportedBy,
      title: 'Maintenance Approved',
      message: `Your maintenance request for "${asset.name}" has been approved and assigned to ${technician}.`,
      date: new Date().toISOString(),
      read: false
    });
    await dbClient.saveNotifications(notifications);

    return ticket;
  }

  static async resolveMaintenance(id: string, technicianName: string, actualCost: number, notes?: string): Promise<Maintenance> {
    const tickets = await dbClient.getMaintenance();
    const ticket = tickets.find(t => t.id === id);

    if (!ticket) {
      throw new Error('Maintenance ticket not found.');
    }
    if (ticket.status !== 'approved') {
      throw new Error('Ticket is not in active approved maintenance.');
    }

    const assets = await dbClient.getAssets();
    const asset = assets.find(a => a.id === ticket.assetId);
    if (!asset) {
      throw new Error('Asset not found.');
    }

    ticket.status = 'resolved';
    ticket.cost = actualCost;
    ticket.resolvedDate = new Date().toISOString();
    ticket.notes = notes;
    ticket.technician = technicianName || ticket.technician;

    // Transition asset status back to available
    asset.status = 'available';
    asset.history.push({
      id: uuidv4(),
      action: 'Maintenance Resolved',
      date: new Date().toISOString(),
      performedBy: ticket.approvedBy || 'System',
      notes: `Repair finished. Cost: $${actualCost}. Details: ${notes || 'N/A'}`
    });

    await dbClient.saveMaintenance(tickets);
    await dbClient.saveAssets(assets);

    // Notify employee who reported it
    const notifications = await dbClient.getNotifications();
    notifications.push({
      id: uuidv4(),
      employeeId: ticket.reportedBy,
      title: 'Maintenance Resolved',
      message: `Repair on "${asset.name}" is complete. The asset is available again.`,
      date: new Date().toISOString(),
      read: false
    });
    await dbClient.saveNotifications(notifications);

    return ticket;
  }
}
export default MaintenanceService;
