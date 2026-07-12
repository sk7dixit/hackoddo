import { dbClient } from './db-client';
import { DatabaseSchema, Employee, Department, Category, Asset, Allocation, Booking, Maintenance, AuditLog, Notification } from '../types';
import { v4 as uuidv4 } from 'uuid';

const now = new Date();
const formatDate = (daysOffset: number = 0, hoursOffset: number = 0): string => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(d.getHours() + hoursOffset);
  return d.toISOString();
};

export async function seed() {
  console.log('Seeding database...');

  // 1. Departments
  const deptEngId = 'dept-eng';
  const deptHrId = 'dept-hr';
  const deptSalesId = 'dept-sales';
  const deptOpsId = 'dept-ops';

  const departments: Department[] = [
    { id: deptEngId, name: 'Engineering', headId: null, location: 'Building A, 3rd Floor' },
    { id: deptHrId, name: 'Human Resources', headId: null, location: 'Building B, 1st Floor' },
    { id: deptSalesId, name: 'Sales & Marketing', headId: null, location: 'Building A, 2nd Floor' },
    { id: deptOpsId, name: 'Operations', headId: null, location: 'Building C, Ground Floor' },
  ];

  // 2. Employees
  const employees: Employee[] = [
    { id: 'emp-admin', name: 'Alice Smith (Admin)', email: 'admin@assetflow.com', role: 'admin', departmentId: null, password: 'admin123', employeeId: 'EMP-1000', status: 'active' },
    { id: 'emp-manager', name: 'Bob Johnson (Manager)', email: 'manager@assetflow.com', role: 'asset_manager', departmentId: deptOpsId, password: 'manager123', employeeId: 'EMP-1002', status: 'active' },
    { id: 'emp-head-eng', name: 'Charlie Brown (Eng Head)', email: 'head.eng@assetflow.com', role: 'department_head', departmentId: deptEngId, password: 'head123', employeeId: 'EMP-1003', status: 'active' },
    { id: 'emp-head-hr', name: 'Diana Prince (HR Head)', email: 'head.hr@assetflow.com', role: 'department_head', departmentId: deptHrId, password: 'head123', employeeId: 'EMP-1004', status: 'active' },
    { id: 'emp-developer', name: 'Shashwat Developer', email: 'employee@assetflow.com', role: 'employee', departmentId: deptEngId, password: 'employee123', employeeId: 'EMP-1001', status: 'active' },
    { id: 'emp-dev2', name: 'Sarah Connor', email: 'sarah@assetflow.com', role: 'employee', departmentId: deptEngId, password: 'password123', employeeId: 'EMP-1005', status: 'active' },
    { id: 'emp-sales1', name: 'John Doe', email: 'john@assetflow.com', role: 'employee', departmentId: deptSalesId, password: 'password123', employeeId: 'EMP-1006', status: 'active' },
    { id: 'emp-hr1', name: 'Emma Watson', email: 'emma@assetflow.com', role: 'employee', departmentId: deptHrId, password: 'password123', employeeId: 'EMP-1007', status: 'active' },
  ];

  // Link department heads
  departments[0].headId = 'emp-head-eng';
  departments[1].headId = 'emp-head-hr';

  // 3. Categories
  const catLaptop = 'cat-laptop';
  const catCar = 'cat-car';
  const catRoom = 'cat-room';
  const catPrinter = 'cat-printer';
  const catProjector = 'cat-projector';

  const categories: Category[] = [
    { id: catLaptop, name: 'Laptops', type: 'asset', description: 'Company issued work laptops' },
    { id: catCar, name: 'Company Cars', type: 'resource', description: 'Shared utility vehicles' },
    { id: catRoom, name: 'Meeting Rooms', type: 'resource', description: 'Shared meeting rooms' },
    { id: catPrinter, name: 'Printers', type: 'asset', description: 'Office printers and scanners' },
    { id: catProjector, name: 'Projectors', type: 'asset', description: 'Portable presentation projectors' },
  ];

  // 4. Assets & Resources
  const assets: Asset[] = [
    // Physical Assets (Laptops)
    {
      id: 'ast-laptop-101',
      name: 'MacBook Pro 16" (M3 Max)',
      categoryId: catLaptop,
      serialNumber: 'C02F1234Q05D',
      qrCode: 'AF-LPT-101',
      purchaseDate: '2025-01-15',
      cost: 3499,
      departmentId: deptEngId,
      location: 'Engineering Lab',
      status: 'allocated',
      history: [
        { id: uuidv4(), action: 'Registered', date: '2025-01-15T09:00:00Z', performedBy: 'Bob Johnson (Manager)', notes: 'Initial setup' },
        { id: uuidv4(), action: 'Allocated', date: '2025-01-20T10:00:00Z', performedBy: 'Bob Johnson (Manager)', notes: 'Assigned to Shashwat' }
      ]
    },
    {
      id: 'ast-laptop-143',
      name: 'Lenovo ThinkPad X1 Carbon',
      categoryId: catLaptop,
      serialNumber: 'L3N98765X1CC',
      qrCode: 'AF-LPT-143',
      purchaseDate: '2024-06-10',
      cost: 1899,
      departmentId: deptSalesId,
      location: 'Sales Area',
      status: 'available',
      history: [
        { id: uuidv4(), action: 'Registered', date: '2024-06-10T11:00:00Z', performedBy: 'Bob Johnson (Manager)' },
        { id: uuidv4(), action: 'Allocated', date: '2024-06-12T14:00:00Z', performedBy: 'Bob Johnson (Manager)', notes: 'Temp assignment' },
        { id: uuidv4(), action: 'Returned', date: '2025-06-12T10:00:00Z', performedBy: 'Bob Johnson (Manager)', notes: 'Returned in good condition' }
      ]
    },
    {
      id: 'ast-laptop-144',
      name: 'Dell XPS 15',
      categoryId: catLaptop,
      serialNumber: 'DL789012XP15',
      qrCode: 'AF-LPT-144',
      purchaseDate: '2024-08-20',
      cost: 2199,
      departmentId: deptHrId,
      location: 'HR Cabinet',
      status: 'under_maintenance',
      history: [
        { id: uuidv4(), action: 'Registered', date: '2024-08-20T10:00:00Z', performedBy: 'Bob Johnson (Manager)' },
        { id: uuidv4(), action: 'Maintenance Started', date: formatDate(-2), performedBy: 'Bob Johnson (Manager)', notes: 'Battery swelling reported' }
      ]
    },
    {
      id: 'ast-laptop-145',
      name: 'ASUS ROG Zephyrus G14',
      categoryId: catLaptop,
      serialNumber: 'AS981273ZG14',
      qrCode: 'AF-LPT-145',
      purchaseDate: '2025-03-01',
      cost: 1599,
      departmentId: deptEngId,
      location: 'Engineering Lab',
      status: 'available',
      history: [
        { id: uuidv4(), action: 'Registered', date: '2025-03-01T09:30:00Z', performedBy: 'Bob Johnson (Manager)' }
      ]
    },
    // Printers
    {
      id: 'ast-print-1',
      name: 'HP LaserJet Enterprise Color',
      categoryId: catPrinter,
      serialNumber: 'HP456123PRNT',
      qrCode: 'AF-PRN-001',
      purchaseDate: '2023-11-12',
      cost: 1200,
      departmentId: deptOpsId,
      location: 'Building A, Central Hallway',
      status: 'available',
      history: [
        { id: uuidv4(), action: 'Registered', date: '2023-11-12T10:00:00Z', performedBy: 'Bob Johnson (Manager)' }
      ]
    },
    // Projectors
    {
      id: 'ast-proj-1',
      name: 'Epson Pro Presentation Projector',
      categoryId: catProjector,
      serialNumber: 'EP888999PRJC',
      qrCode: 'AF-PRJ-001',
      purchaseDate: '2024-02-15',
      cost: 850,
      departmentId: deptOpsId,
      location: 'Operations Store Room',
      status: 'allocated',
      history: [
        { id: uuidv4(), action: 'Registered', date: '2024-02-15T09:00:00Z', performedBy: 'Bob Johnson (Manager)' },
        { id: uuidv4(), action: 'Allocated', date: formatDate(-5), performedBy: 'Bob Johnson (Manager)', notes: 'Assigned to Sales for Expo' }
      ]
    },
    // Shared Resources (Rooms & Cars)
    {
      id: 'res-room-alpha',
      name: 'Meeting Room Alpha (12-Seater)',
      categoryId: catRoom,
      serialNumber: 'ROOM-ALPHA',
      qrCode: 'AF-ROM-ALP',
      purchaseDate: '2022-01-01',
      cost: 0,
      departmentId: null,
      location: 'Building A, 3rd Floor, Room 302',
      status: 'available',
      history: []
    },
    {
      id: 'res-room-beta',
      name: 'Meeting Room Beta (6-Seater)',
      categoryId: catRoom,
      serialNumber: 'ROOM-BETA',
      qrCode: 'AF-ROM-BET',
      purchaseDate: '2022-01-01',
      cost: 0,
      departmentId: null,
      location: 'Building A, 2nd Floor, Room 205',
      status: 'available',
      history: []
    },
    {
      id: 'res-car-tesla',
      name: 'Tesla Model Y (White)',
      categoryId: catCar,
      serialNumber: '5YJYGCDE1234',
      qrCode: 'AF-CAR-TES',
      purchaseDate: '2023-05-18',
      cost: 49990,
      departmentId: deptOpsId,
      location: 'Building A, Reserved Slot #4',
      status: 'available',
      history: []
    },
    {
      id: 'res-car-sedan',
      name: 'Toyota Camry Hybrid',
      categoryId: catCar,
      serialNumber: '4T1BF1FK5678',
      qrCode: 'AF-CAR-TOY',
      purchaseDate: '2022-09-10',
      cost: 29500,
      departmentId: deptOpsId,
      location: 'Building A, Slot #12',
      status: 'available',
      history: []
    }
  ];

  // 5. Allocations
  const allocations: Allocation[] = [
    {
      id: 'alloc-1',
      assetId: 'ast-laptop-101',
      employeeId: 'emp-developer',
      requestedBy: 'emp-developer',
      approvedBy: 'emp-manager',
      requestDate: formatDate(-30),
      allocationDate: formatDate(-29),
      expectedReturnDate: formatDate(180),
      actualReturnDate: null,
      status: 'approved',
      notes: 'Initial developer system'
    },
    {
      id: 'alloc-2',
      assetId: 'ast-proj-1',
      employeeId: 'emp-sales1',
      requestedBy: 'emp-sales1',
      approvedBy: 'emp-manager',
      requestDate: formatDate(-6),
      allocationDate: formatDate(-5),
      expectedReturnDate: formatDate(-1), // OVERDUE RETURN!
      actualReturnDate: null,
      status: 'approved',
      notes: 'Sales pitch expo'
    },
    {
      id: 'alloc-3',
      assetId: 'ast-laptop-143',
      employeeId: 'emp-dev2',
      requestedBy: 'emp-dev2',
      approvedBy: null,
      requestDate: formatDate(-1),
      allocationDate: null,
      expectedReturnDate: formatDate(90),
      actualReturnDate: null,
      status: 'requested',
      notes: 'Need machine for testing'
    }
  ];

  // 6. Bookings
  const bookings: Booking[] = [
    {
      id: 'book-1',
      resourceId: 'res-room-alpha',
      employeeId: 'emp-head-eng',
      startTime: formatDate(0, 1),  // Starts in 1 hour
      endTime: formatDate(0, 3),    // Ends in 3 hours
      title: 'Sprint Planning',
      status: 'confirmed'
    },
    {
      id: 'book-2',
      resourceId: 'res-room-alpha',
      employeeId: 'emp-developer',
      startTime: formatDate(0, 4),  // Starts in 4 hours
      endTime: formatDate(0, 5),    // Ends in 5 hours
      title: 'Dev Sync Call',
      status: 'confirmed'
    },
    {
      id: 'book-3',
      resourceId: 'res-car-tesla',
      employeeId: 'emp-head-hr',
      startTime: formatDate(1, -2),  // Tomorrow morning
      endTime: formatDate(1, 4),     // Tomorrow afternoon
      title: 'HR Recruiting Fair Visit',
      status: 'confirmed'
    }
  ];

  // 7. Maintenance Tickets
  const maintenance: Maintenance[] = [
    {
      id: 'maint-1',
      assetId: 'ast-laptop-144',
      reportedBy: 'emp-hr1',
      approvedBy: 'emp-manager',
      technician: 'Apple Authorized Service Provider',
      issueDescription: 'Battery swelling up causing keyboard warp',
      cost: 250,
      status: 'approved',
      reportedDate: formatDate(-2),
      resolvedDate: null,
      notes: 'Waiting for parts delivery'
    },
    {
      id: 'maint-2',
      assetId: 'ast-laptop-143',
      reportedBy: 'emp-sales1',
      approvedBy: 'emp-manager',
      technician: 'Lenovo Service Depot',
      issueDescription: 'Screen flickering occasionally',
      cost: 120,
      status: 'resolved',
      reportedDate: formatDate(-15),
      resolvedDate: formatDate(-10),
      notes: 'Display cable replaced. Screen tested okay.'
    }
  ];

  // 8. Audit Logs
  const auditLogs: AuditLog[] = [
    {
      id: 'audit-1',
      title: 'Q1 Annual Asset Verification',
      performedBy: 'Bob Johnson (Manager)',
      date: formatDate(-90),
      status: 'completed',
      checkedCount: 5,
      totalAssetsCount: 5,
      discrepancies: []
    },
    {
      id: 'audit-2',
      title: 'Mid-Year Random IT Audit',
      performedBy: 'Alice Smith (Admin)',
      date: formatDate(-10),
      status: 'completed',
      checkedCount: 6,
      totalAssetsCount: 6,
      discrepancies: [
        {
          assetId: 'ast-laptop-144',
          assetName: 'Dell XPS 15',
          expectedStatus: 'available',
          actualStatus: 'missing',
          notes: 'Not found in HR Cabinet during check.',
          resolved: true // marked resolved later
        }
      ]
    }
  ];

  // 9. Notifications
  const notifications: Notification[] = [
    {
      id: 'notif-1',
      employeeId: 'emp-developer',
      title: 'Asset Allocated',
      message: 'MacBook Pro 16" (M3 Max) has been allocated to you. Expected return date: ' + new Date(formatDate(180)).toLocaleDateString(),
      date: formatDate(-29),
      read: true
    },
    {
      id: 'notif-2',
      employeeId: 'emp-manager',
      title: 'Allocation Request',
      message: 'Sarah Connor has requested allocation for Lenovo ThinkPad X1 Carbon.',
      date: formatDate(-1),
      read: false
    },
    {
      id: 'notif-3',
      employeeId: 'emp-sales1',
      title: 'Asset Overdue Alert',
      message: 'Epson Pro Presentation Projector was scheduled for return on ' + new Date(formatDate(-1)).toLocaleDateString() + '. Please return it immediately.',
      date: formatDate(0, -1),
      read: false
    }
  ];

  const dbSchema: DatabaseSchema = {
    departments,
    employees,
    categories,
    assets,
    allocations,
    bookings,
    maintenance,
    auditLogs,
    notifications
  };

  await dbClient.resetDb(dbSchema);
  console.log('Seeding finished successfully!');
}

if (require.main === module) {
  seed().catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });
}
