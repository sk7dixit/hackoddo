export type UserRole = 'admin' | 'asset_manager' | 'department_head' | 'employee';

export type AssetStatus = 
  | 'available' 
  | 'allocated' 
  | 'reserved' 
  | 'under_maintenance' 
  | 'retired' 
  | 'disposed' 
  | 'lost';

export interface Department {
  id: string;
  name: string;
  headId: string | null; // Employee ID of the head
  location: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string | null;
  password?: string; // Stored in plain text for simple hackathon mock authentication
  employeeId?: string; // e.g. "EMP-1001"
  status?: 'active' | 'disabled'; // Account status (active/disabled)
}

export interface Category {
  id: string;
  name: string;
  type: 'asset' | 'resource'; // 'asset' = allocated exclusively, 'resource' = booked by time slots
  description: string;
}

export interface AssetHistoryEntry {
  id: string;
  action: string; // e.g., 'Registered', 'Allocated', 'Returned', 'Maintenance Started', 'Maintenance Resolved', 'Audit - Missing', 'Audit - Verified'
  date: string;
  performedBy: string; // Employee Name/ID
  notes?: string;
}

export interface Asset {
  id: string;
  name: string;
  categoryId: string;
  serialNumber: string; // N/A for rooms/venues
  qrCode: string; // e.g., "AF-0101"
  purchaseDate: string;
  cost: number;
  departmentId: string | null; // Department that owns/manages the asset
  location: string;
  status: AssetStatus;
  history: AssetHistoryEntry[];
}

export interface Allocation {
  id: string;
  assetId: string;
  employeeId: string;
  requestedBy: string; // Employee ID
  approvedBy: string | null; // Asset Manager Employee ID
  requestDate: string;
  allocationDate: string | null;
  expectedReturnDate: string | null;
  actualReturnDate: string | null;
  status: 'requested' | 'approved' | 'rejected' | 'returned' | 'transfer_pending';
  transferToEmployeeId?: string; // Used for asset transfer requests
  notes?: string;
}

export interface Booking {
  id: string;
  resourceId: string; // Asset/Resource ID
  employeeId: string;
  startTime: string; // ISO String or YYYY-MM-DD THH:mm
  endTime: string;   // ISO String or YYYY-MM-DD THH:mm
  title: string;     // e.g. "Weekly Sync Meeting"
  status: 'confirmed' | 'cancelled';
  notes?: string;
}

export interface Maintenance {
  id: string;
  assetId: string;
  reportedBy: string; // Employee ID
  approvedBy: string | null; // Asset Manager ID
  technician: string; // Name of technician/vendor
  issueDescription: string;
  cost: number;
  status: 'reported' | 'approved' | 'resolved';
  reportedDate: string;
  resolvedDate: string | null;
  notes?: string;
}

export interface AuditDiscrepancy {
  assetId: string;
  assetName: string;
  expectedStatus: AssetStatus;
  actualStatus: AssetStatus | 'missing';
  notes: string;
  resolved: boolean;
}

export interface AuditLog {
  id: string;
  title: string;
  performedBy: string; // Auditor Name/ID
  date: string;
  status: 'pending' | 'completed';
  checkedCount: number;
  totalAssetsCount: number;
  discrepancies: AuditDiscrepancy[];
}

export interface Notification {
  id: string;
  employeeId: string; // Target employee
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface DatabaseSchema {
  departments: Department[];
  employees: Employee[];
  categories: Category[];
  assets: Asset[];
  allocations: Allocation[];
  bookings: Booking[];
  maintenance: Maintenance[];
  auditLogs: AuditLog[];
  notifications: Notification[];
}
