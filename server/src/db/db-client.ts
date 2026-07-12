import * as fs from 'fs/promises';
import * as path from 'path';
import { DatabaseSchema, Employee, Department, Category, Asset, Allocation, Booking, Maintenance, AuditLog, Notification } from '../types';

const DB_FILE = path.join(__dirname, '../../data/db.json');

class JsonDbClient {
  private data: DatabaseSchema | null = null;
  private writePromise: Promise<void> = Promise.resolve();

  // Load database from file
  private async load(): Promise<DatabaseSchema> {
    if (this.data) return this.data;

    try {
      // Ensure the data directory exists
      await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
      
      const fileContent = await fs.readFile(DB_FILE, 'utf-8');
      this.data = JSON.parse(fileContent);
      return this.data!;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File does not exist, initialize empty schema
        this.data = {
          departments: [],
          employees: [],
          categories: [],
          assets: [],
          allocations: [],
          bookings: [],
          maintenance: [],
          auditLogs: [],
          notifications: []
        };
        await this.saveDirect(this.data);
        return this.data;
      }
      throw error;
    }
  }

  // Queue writing to file to prevent concurrent write corruptions
  private async save(data: DatabaseSchema): Promise<void> {
    this.data = data;
    this.writePromise = this.writePromise.then(() => this.saveDirect(data));
    return this.writePromise;
  }

  private async saveDirect(data: DatabaseSchema): Promise<void> {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      const jsonContent = JSON.stringify(data, null, 2);
      await fs.writeFile(tempPath, jsonContent, 'utf-8');
      await fs.rename(tempPath, DB_FILE);
    } catch (error) {
      console.error('Failed to write JSON database:', error);
      throw error;
    }
  }

  // --- Collection Queries ---

  // Employees
  async getEmployees(): Promise<Employee[]> {
    const db = await this.load();
    return db.employees;
  }

  async saveEmployees(employees: Employee[]): Promise<void> {
    const db = await this.load();
    db.employees = employees;
    await this.save(db);
  }

  // Departments
  async getDepartments(): Promise<Department[]> {
    const db = await this.load();
    return db.departments;
  }

  async saveDepartments(departments: Department[]): Promise<void> {
    const db = await this.load();
    db.departments = departments;
    await this.save(db);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const db = await this.load();
    return db.categories;
  }

  async saveCategories(categories: Category[]): Promise<void> {
    const db = await this.load();
    db.categories = categories;
    await this.save(db);
  }

  // Assets
  async getAssets(): Promise<Asset[]> {
    const db = await this.load();
    return db.assets;
  }

  async saveAssets(assets: Asset[]): Promise<void> {
    const db = await this.load();
    db.assets = assets;
    await this.save(db);
  }

  // Allocations
  async getAllocations(): Promise<Allocation[]> {
    const db = await this.load();
    return db.allocations;
  }

  async saveAllocations(allocations: Allocation[]): Promise<void> {
    const db = await this.load();
    db.allocations = allocations;
    await this.save(db);
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    const db = await this.load();
    return db.bookings;
  }

  async saveBookings(bookings: Booking[]): Promise<void> {
    const db = await this.load();
    db.bookings = bookings;
    await this.save(db);
  }

  // Maintenance
  async getMaintenance(): Promise<Maintenance[]> {
    const db = await this.load();
    return db.maintenance;
  }

  async saveMaintenance(maintenance: Maintenance[]): Promise<void> {
    const db = await this.load();
    db.maintenance = maintenance;
    await this.save(db);
  }

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    const db = await this.load();
    return db.auditLogs;
  }

  async saveAuditLogs(auditLogs: AuditLog[]): Promise<void> {
    const db = await this.load();
    db.auditLogs = auditLogs;
    await this.save(db);
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    const db = await this.load();
    return db.notifications;
  }

  async saveNotifications(notifications: Notification[]): Promise<void> {
    const db = await this.load();
    db.notifications = notifications;
    await this.save(db);
  }

  // Trigger manual reset / seed
  async resetDb(seedData: DatabaseSchema): Promise<void> {
    this.data = seedData;
    await this.saveDirect(seedData);
  }
}

export const dbClient = new JsonDbClient();
export default dbClient;
