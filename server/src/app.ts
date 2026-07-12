// Triggering DB regeneration seeder
import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import * as fs from "fs";
import * as path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const DB_PATH = path.join(__dirname, "database/db.json");

// Ensure database directory exists
const ensureDbDir = () => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Initialize and seed database for Phase 7 & 8
const initializeDatabase = () => {
  ensureDbDir();

  let databaseExists = false;
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
      // If we already seeded 500+ assets, skip
      if (data.assets && data.assets.length >= 500) {
        databaseExists = true;
      }
    }
  } catch (e) {
    console.log("Database missing or malformed. Re-seeding...");
  }

  if (databaseExists) {
    console.log(
      "Database already populated with realistic Hackathon Phase 8 data.",
    );
    return;
  }

  console.log(
    "Seeding comprehensive mock data for Hackathon Phase 8 (500+ Assets, 100 Employees)...",
  );

  // 1. Seed 10 Departments
  const departmentsList = [
    {
      id: "IT",
      name: "Information Technology",
      code: "IT",
      description: "Systems infrastructure & support",
      headId: "Rahul Sharma",
      budget: 120000,
      location: "Building A, Floor 2",
      status: "Active",
    },
    {
      id: "HR",
      name: "Human Resources",
      code: "HR",
      description: "Talent acquisition & benefits",
      headId: "Priya Singh",
      budget: 45000,
      location: "Building B, Floor 1",
      status: "Active",
    },
    {
      id: "Finance",
      name: "Finance & Accounts",
      code: "FIN",
      description: "Ledger bookkeeping & audits",
      headId: "Mohit Kumar",
      budget: 80000,
      location: "Building A, Floor 1",
      status: "Active",
    },
    {
      id: "Operations",
      name: "Operations & Facilities",
      code: "OPS",
      description: "Logistics and workspace coordination",
      headId: "Bob Johnson",
      budget: 95000,
      location: "Building C, Ground Floor",
      status: "Active",
    },
    {
      id: "Sales",
      name: "Corporate Sales",
      code: "SLS",
      description: "Client relations and conversions",
      headId: "Sanjay Gupta",
      budget: 60000,
      location: "Building D, Floor 1",
      status: "Active",
    },
    {
      id: "Marketing",
      name: "Marketing & Growth",
      code: "MKT",
      description: "Brand campaigns & socials",
      headId: "Sneha Verma",
      budget: 50000,
      location: "Building D, Floor 2",
      status: "Active",
    },
    {
      id: "Legal",
      name: "Legal Compliance",
      code: "LGL",
      description: "Policy Audits and contract checks",
      headId: "Vikram Malhotra",
      budget: 40000,
      location: "Building A, Floor 3",
      status: "Active",
    },
    {
      id: "Logistics",
      name: "Supply Chain & Logistics",
      code: "LOG",
      description: "Fleet management & stock controls",
      headId: "John Carter",
      budget: 70000,
      location: "Building C, Floor 1",
      status: "Active",
    },
    {
      id: "Research",
      name: "Research & Development",
      code: "RND",
      description: "ERP integrations Lab",
      headId: "Aman Gupta",
      budget: 150000,
      location: "Building E, Lab 1",
      status: "Active",
    },
    {
      id: "Support",
      name: "Customer Support",
      code: "CS",
      description: "Client resolution desk",
      headId: "Kavita Roy",
      budget: 35000,
      location: "Building B, Floor 2",
      status: "Active",
    },
  ];

  // 2. Generate 100 Employee Names
  const employeesList = [
    "Rahul",
    "Shashwat",
    "Priya",
    "Aman",
    "Sneha",
    "Vikram",
    "Amit",
    "Kavita",
    "Rohit",
    "Pooja",
    "Siddharth",
    "Anjali",
    "Rohan",
    "Neha",
    "Aditya",
    "Divya",
    "Karan",
    "Ritu",
    "Varun",
    "Kriti",
    "Rajesh",
    "Sunita",
    "Anil",
    "Meera",
    "Sanjay",
    "Kiran",
    "Vijay",
    "Asha",
    "Rakesh",
    "Rekha",
    "Manoj",
    "Preeti",
    "Suresh",
    "Gita",
    "Dinesh",
    "Kusum",
    "Harish",
    "Usha",
    "Naresh",
    "Lata",
    "Arun",
    "Kamla",
    "Vinod",
    "Sarla",
    "Ramesh",
    "Sita",
    "Ashok",
    "Savitri",
    "Yash",
    "Tanvi",
    "Manish",
    "Priyanka",
    "Abhishek",
    "Shweta",
    "Vivek",
    "Komal",
    "Deepak",
    "Aarti",
    "Sunil",
    "Payal",
    "Vikash",
    "Jyoti",
    "Raj",
    "Kajal",
    "Sunny",
    "Swati",
    "Gaurav",
    "Nisha",
    "Sameer",
    "Simran",
    "Pranav",
    "Radhika",
    "Akash",
    "Saloni",
    "Tushar",
    "Megha",
    "Alok",
    "Pallavi",
    "Jatin",
    "Nupur",
    "Kshitij",
    "Arpita",
    "Bhupesh",
    "Shruti",
    "Sarthak",
    "Monika",
    "Ayush",
    "Tanika",
    "Nitin",
    "Prerna",
    "Kartik",
    "Shreya",
    "Himanshu",
    "Richa",
    "Saurabh",
    "Garima",
    "Pulkit",
    "Anshika",
    "Naveen",
    "Barkha",
  ];

  // 3. Build Users Array (including administrators, managers, department heads and employees)
  const users = [
    {
      id: "AM000",
      firstName: "Alice",
      lastName: "Smith",
      name: "Alice Smith",
      email: "admin@assetflow.com",
      password: "admin123",
      role: "admin",
      employeeId: "EMP-1000",
      status: "active",
    },
    {
      id: "AM001",
      firstName: "John",
      lastName: "Carter",
      name: "John Carter",
      email: "assetmanager@gmail.com",
      password: "manager123",
      role: "asset_manager",
      employeeId: "EMP-1002",
      status: "active",
      departmentId: "Logistics",
    },
    {
      id: "AM002",
      firstName: "Diana",
      lastName: "Prince",
      name: "Diana Prince",
      email: "head.hr@assetflow.com",
      password: "head123",
      role: "department_head",
      employeeId: "EMP-1004",
      status: "active",
      departmentId: "HR",
    },
    {
      id: "AM002-custom",
      firstName: "Diana",
      lastName: "Custom",
      name: "Diana Prince (Custom Head)",
      email: "departmenthead@gmail.com",
      password: "12345",
      role: "department_head",
      employeeId: "EMP-1009",
      status: "active",
      departmentId: "HR",
    },
    {
      id: "AM003",
      firstName: "Shashwat",
      lastName: "Developer",
      name: "Shashwat Developer",
      email: "employee@assetflow.com",
      password: "employee123",
      role: "employee",
      employeeId: "EMP-1001",
      status: "active",
      departmentId: "IT",
    },
    {
      id: "AM004",
      firstName: "Rahul",
      lastName: "Sharma",
      name: "Rahul Sharma",
      email: "rahul@assetflow.com",
      password: "password123",
      role: "department_head",
      employeeId: "EMP-1011",
      status: "active",
      departmentId: "IT",
    },
    {
      id: "AM005",
      firstName: "Priya",
      lastName: "Singh",
      name: "Priya Singh",
      email: "priya@assetflow.com",
      password: "password123",
      role: "department_head",
      employeeId: "EMP-1012",
      status: "active",
      departmentId: "HR",
    },
    {
      id: "AM006",
      firstName: "Mohit",
      lastName: "Kumar",
      name: "Mohit Kumar",
      email: "finance@company.com",
      password: "password123",
      role: "department_head",
      employeeId: "EMP-1013",
      status: "active",
      departmentId: "Finance",
    },
    {
      id: "AM007",
      firstName: "Sanjay",
      lastName: "Gupta",
      name: "Sanjay Gupta",
      email: "sanjay@assetflow.com",
      password: "password123",
      role: "department_head",
      employeeId: "EMP-1014",
      status: "active",
      departmentId: "Sales",
    },
    {
      id: "AM008",
      firstName: "Bob",
      lastName: "Johnson",
      name: "Bob Johnson",
      email: "bob@assetflow.com",
      password: "manager123",
      role: "asset_manager",
      employeeId: "EMP-1015",
      status: "active",
      departmentId: "Operations",
    },
    {
      id: "AM009",
      firstName: "Karan",
      lastName: "Shah",
      name: "Karan Shah",
      email: "karan@assetflow.com",
      password: "manager123",
      role: "asset_manager",
      employeeId: "EMP-1016",
      status: "active",
      departmentId: "Operations",
    },
  ];

  // Append generated employees list
  employeesList.forEach((name, idx) => {
    // Prevent duplicate entries for Shashwat, Rahul, Priya, Karan, Mohit
    if (
      [
        "Shashwat",
        "Rahul",
        "Priya",
        "Karan",
        "Mohit",
        "Bob",
        "Sanjay",
      ].includes(name)
    )
      return;

    users.push({
      id: `emp-gen-${idx}`,
      firstName: name,
      lastName: "Kumar",
      name: name + " Kumar",
      email: `${name.toLowerCase()}@assetflow.com`,
      password: "employee123",
      role: "employee",
      employeeId: `EMP-${1100 + idx}`,
      status: "active",
      departmentId: departmentsList[idx % departmentsList.length].id,
    } as any);
  });

  const categories = [
    "Electronics",
    "Furniture",
    "Vehicles",
    "Meeting Rooms",
    "Printers",
  ];

  // 4. Generate 520 Assets
  const assets: any[] = [];
  const allocations: any[] = [];

  for (let i = 1; i <= 520; i++) {
    const id = `AF-${String(i).padStart(4, "0")}`;
    const category = categories[i % categories.length];
    const dept = departmentsList[i % departmentsList.length].id;

    // Status distribution: 300 allocated, 40 maintenance, 10 lost, 10 retired, 160 available
    let status:
      | "available"
      | "allocated"
      | "reserved"
      | "under_maintenance"
      | "lost"
      | "retired" = "available";
    let holder: string | null = null;

    if (i <= 300) {
      status = "allocated";
      // Pick dynamic custodian from users array
      const empUser = users.filter((u) => u.role === "employee")[
        i % users.filter((u) => u.role === "employee").length
      ];
      holder = empUser.firstName || empUser.name;
    } else if (i > 300 && i <= 340) {
      status = "under_maintenance";
    } else if (i > 340 && i <= 350) {
      status = "lost";
    } else if (i > 350 && i <= 360) {
      status = "retired";
    }

    assets.push({
      id,
      name: `${category === "Electronics" ? "Macbook Pro" : category === "Printers" ? "HP LaserJet" : category === "Vehicles" ? "Tesla Model Y" : category === "Meeting Rooms" ? "Conference Room" : "Ergonomic Desk"} ${i}`,
      categoryId: category,
      departmentId: dept,
      location: `Floor ${(i % 3) + 1}`,
      serialNumber: `SN-GEN-${i}092`,
      manufacturer: category === "Electronics" ? "Apple" : "Company Brand",
      model: "Model-X",
      purchaseDate: `2024-06-01`,
      cost: 1200,
      condition: status === "under_maintenance" ? "Needs Repair" : "Excellent",
      sharedResource: category === "Meeting Rooms" || category === "Vehicles",
      status,
      holder,
      history: [
        {
          id: `h-${id}-init`,
          type: "System",
          date: "2024-06-01T09:00:00Z",
          message: "Asset registered in database.",
        },
      ],
    });

    if (status === "allocated" && holder) {
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 15);
      allocations.push({
        id: `alloc-${i}`,
        assetId: id,
        employeeId: holder,
        allocatedOn: "2026-06-01",
        expectedReturnDate: returnDate.toISOString().split("T")[0],
        actualReturnDate: null,
        status: "active",
        notes: "Project checkout allocation",
      });
    }
  }

  // 5. Seed 50 Bookings
  const bookings: any[] = [];
  const slots = ["09-10", "10-11", "11-12", "14-15", "15-16"];
  const resourceRooms = assets.filter((a) => a.sharedResource).map((a) => a.id);

  for (let i = 1; i <= 50; i++) {
    bookings.push({
      bookingId: `bk-${i}`,
      resourceId: resourceRooms[i % resourceRooms.length],
      employeeId: employeesList[i % employeesList.length],
      date: `2026-07-${String((i % 10) + 1).padStart(2, "0")}`,
      startTime: "10:00",
      endTime: "11:00",
      purpose: "Sprint Sync",
      status: "confirmed",
      createdAt: new Date().toISOString(),
    });
  }

  // 6. Seed 30 Maintenance Requests
  const technicians = [
    { id: "tech-1", name: "Amit Sharma", type: "Internal Team" },
    { id: "tech-2", name: "Rahul Verma", type: "Internal Team" },
    { id: "tech-3", name: "Vendor Team", type: "External Vendor" },
  ];
  const maintenance: any[] = [];

  for (let i = 1; i <= 30; i++) {
    let status: any = "pending";
    if (i > 5 && i <= 15) status = "approved";
    else if (i > 15 && i <= 22) status = "in_progress";
    else if (i > 22) status = "resolved";

    maintenance.push({
      id: `MR-${String(i).padStart(3, "0")}`,
      assetId: `AF-00${30 + i}`,
      employeeId: employeesList[i % employeesList.length],
      priority: i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
      date: `2026-07-${String((i % 12) + 1).padStart(2, "0")}`,
      status,
      technicianId:
        status !== "pending"
          ? technicians[i % technicians.length].id
          : undefined,
      problemDescription: `Problem report description ${i}`,
      notes: status === "resolved" ? "Fixed and verified." : undefined,
    });
  }

  // 7. Seed Audits
  const audits = [
    {
      id: "AC-0001",
      name: "Quarter 1 Audit",
      scopeType: "organization",
      startDate: "2026-01-01",
      endDate: "2026-03-31",
      auditors: ["Rahul"],
      status: "closed",
      assets: [],
    },
    {
      id: "AC-0002",
      name: "Quarter 2 Audit",
      scopeType: "department",
      scopeValue: "IT",
      startDate: "2026-04-01",
      endDate: "2026-06-30",
      auditors: ["Priya"],
      status: "closed",
      assets: [],
    },
    {
      id: "AC-0003",
      name: "Quarter 3 Audit",
      scopeType: "organization",
      startDate: "2026-07-01",
      endDate: "2026-09-30",
      auditors: ["John Carter"],
      status: "active",
      assets: assets.slice(0, 120).map((a) => ({
        assetId: a.id,
        location: a.location,
        expectedHolder: a.holder,
        status: a.id === "AF-0001" ? "missing" : "verified",
      })),
    },
  ];

  // 8. Seed 50 Notifications
  const notifications: any[] = [];
  for (let i = 1; i <= 50; i++) {
    notifications.push({
      id: `notif-gen-${i}`,
      employeeId: i % 3 === 0 ? "AM003" : "all",
      title: `System Alert ${i}`,
      message: `Detailed alert regarding asset AF-00${(i % 100) + 1} processing coordinates.`,
      status: i <= 15 ? "unread" : "read",
      category: i % 2 === 0 ? "Assets" : "Maintenance",
      date: new Date(Date.now() - i * 3600000 * 2).toISOString(),
    });
  }

  // 9. Seed 250 Activity Logs
  const activityLogs: any[] = [];
  const logModules = ["Asset", "Allocation", "Maintenance", "Audit", "Return"];
  const logActions = [
    "Register Asset",
    "Allocate Asset",
    "Transfer Custody",
    "Verify Return",
    "Assign Technician",
  ];

  for (let i = 1; i <= 250; i++) {
    activityLogs.push({
      id: `act-gen-${i}`,
      employeeId: i % 5 === 0 ? "AM003" : "emp-gen-10",
      operator: "Rahul Sharma",
      module: logModules[i % logModules.length],
      action: logActions[i % logActions.length],
      asset: `AF-${String((i % 150) + 1).padStart(4, "0")}`,
      status: "Success",
      description: `User successfully ran ${logActions[i % logActions.length]} on asset record.`,
      timestamp: new Date(Date.now() - i * 1800000).toISOString(),
    });
  }

  const dbSchema = {
    users,
    departments: departmentsList,
    assets,
    allocations,
    transfers: [],
    returns: [],
    bookings,
    maintenance,
    technicians,
    audits,
    discrepancies: [],
    pendingApprovals: [
      {
        type: "Transfer",
        asset: "AF-0035",
        employee: "Rahul",
        status: "Pending",
      },
      {
        type: "Return",
        asset: "AF-0048",
        employee: "Aman",
        status: "Waiting Verification",
      },
    ],
    recentActivities: [
      {
        time: "09:20 AM",
        message: "Laptop AF-0008 keys unresponsive reported.",
      },
      { time: "10:00 AM", message: "Approved by Asset Manager." },
    ],
    notifications,
    activityLogs,
    upcomingReturns: [
      {
        asset: "AF-0031",
        employee: "Rahul",
        returnDate: "Tomorrow",
        daysLeft: 1,
      },
      {
        asset: "AF-0032",
        employee: "Priya",
        returnDate: "14 July 2026",
        daysLeft: 2,
      },
    ],
  };

  fs.writeFileSync(DB_PATH, JSON.stringify(dbSchema, null, 2), "utf-8");
  console.log(
    "Seeded database with realistic 500+ Assets, 100 Employees Hackathon Phase 8 data.",
  );
};

// Seed database on startup
initializeDatabase();

// Role Authorization Helper (Phase 8)
const verifyRole = (req: Request, allowedRoles: string[]) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    return { status: 401, message: "Unauthorized. Missing x-user-id header." };
  }
  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    return { status: 401, message: "Unauthorized. User profile not found." };
  }
  if (!allowedRoles.includes(user.role)) {
    return {
      status: 403,
      message: `Forbidden. Role '${user.role}' does not have permission.`,
    };
  }
  return null;
};

// Database I/O Helpers
const readDb = (): any => {
  try {
    const fileData = fs.readFileSync(DB_PATH, "utf-8");
    const db = JSON.parse(fileData);
    let dirty = false;

    // 1. Employees / Users Bootstrap
    if (!db.users || db.users.length < 5) {
      db.users = [
        {
          id: "AM-ADMIN-GEN",
          firstName: "Shashwat",
          lastName: "Admin",
          name: "Shashwat Admin",
          email: "admin@gmail.com",
          password: "12345",
          role: "admin",
          employeeId: "EMP-1000",
          username: "admin",
          designation: "Chief ERP Administrator",
          joiningDate: "2025-01-01",
          reportingManager: "Board of Directors",
          employmentType: "Full-Time",
          officeLocation: "Corporate HQ",
          status: "active",
          lastLogin: "Today",
        },
        {
          id: "emp-rahul",
          firstName: "Rahul",
          lastName: "Sharma",
          name: "Rahul Sharma",
          email: "rahul@assetflow.com",
          password: "password123",
          role: "department_head",
          employeeId: "EMP-1001",
          username: "rahul.sharma",
          designation: "Director of IT",
          joiningDate: "2024-06-15",
          reportingManager: "Shashwat Admin",
          employmentType: "Full-Time",
          officeLocation: "Building A, Floor 2",
          status: "active",
          departmentId: "IT",
          lastLogin: "Today",
        },
        {
          id: "emp-priya",
          firstName: "Priya",
          lastName: "Singh",
          name: "Priya Singh",
          email: "priya@assetflow.com",
          password: "password123",
          role: "department_head",
          employeeId: "EMP-1002",
          username: "priya.singh",
          designation: "Head of Human Resources",
          joiningDate: "2024-08-20",
          reportingManager: "Shashwat Admin",
          employmentType: "Full-Time",
          officeLocation: "Building B, Floor 1",
          status: "active",
          departmentId: "HR",
          lastLogin: "Yesterday",
        },
        {
          id: "emp-mohit",
          firstName: "Mohit",
          lastName: "Kumar",
          name: "Mohit Kumar",
          email: "mohit@assetflow.com",
          password: "password123",
          role: "department_head",
          employeeId: "EMP-1003",
          username: "mohit.kumar",
          designation: "VP of Finance",
          joiningDate: "2025-02-10",
          reportingManager: "Shashwat Admin",
          employmentType: "Full-Time",
          officeLocation: "Building A, Floor 1",
          status: "active",
          departmentId: "Finance",
          lastLogin: "2 Hours Ago",
        },
        {
          id: "emp-john",
          firstName: "John",
          lastName: "Carter",
          name: "John Carter",
          email: "assetmanager@gmail.com",
          password: "manager123",
          role: "asset_manager",
          employeeId: "EMP-1004",
          username: "john.carter",
          designation: "Inventory Logistics Manager",
          joiningDate: "2024-03-01",
          reportingManager: "Shashwat Admin",
          employmentType: "Full-Time",
          officeLocation: "Building C, Ground Floor",
          status: "active",
          departmentId: "Operations",
          lastLogin: "2 Hours Ago",
        },
        {
          id: "emp-bob",
          firstName: "Bob",
          lastName: "Johnson",
          name: "Bob Johnson",
          email: "bob@assetflow.com",
          password: "manager123",
          role: "asset_manager",
          employeeId: "EMP-1005",
          username: "bob.johnson",
          designation: "Lead Technician & Store Supervisor",
          joiningDate: "2024-11-05",
          reportingManager: "John Carter",
          employmentType: "Full-Time",
          officeLocation: "Building C, Ground Floor",
          status: "active",
          departmentId: "Operations",
          lastLogin: "3 Hours Ago",
        },
        {
          id: "emp-aman",
          firstName: "Aman",
          lastName: "Gupta",
          name: "Aman Gupta",
          email: "aman@assetflow.com",
          password: "employee123",
          role: "employee",
          employeeId: "EMP-1006",
          username: "aman.gupta",
          designation: "Senior Systems Engineer",
          joiningDate: "2025-03-01",
          reportingManager: "Rahul Sharma",
          employmentType: "Full-Time",
          officeLocation: "Building A, Floor 2",
          status: "active",
          departmentId: "IT",
          lastLogin: "Yesterday",
        },
        {
          id: "emp-vikram",
          firstName: "Vikram",
          lastName: "Malhotra",
          name: "Vikram Malhotra",
          email: "vikram@assetflow.com",
          password: "employee123",
          role: "employee",
          employeeId: "EMP-1007",
          username: "vikram.malhotra",
          designation: "HR Coordinator",
          joiningDate: "2025-05-15",
          reportingManager: "Priya Singh",
          employmentType: "Full-Time",
          officeLocation: "Building B, Floor 1",
          status: "active",
          departmentId: "HR",
          lastLogin: "4 Hours Ago",
        },
        {
          id: "emp-developer",
          firstName: "Shashwat",
          lastName: "Developer",
          name: "Shashwat Developer",
          email: "employee@assetflow.com",
          password: "employee123",
          role: "employee",
          employeeId: "EMP-1001",
          username: "shashwat",
          designation: "Frontend React Developer",
          joiningDate: "2025-01-20",
          reportingManager: "Rahul Sharma",
          employmentType: "Full-Time",
          officeLocation: "Building A, Floor 2",
          status: "active",
          departmentId: "IT",
          lastLogin: "Today",
        },
      ];
      dirty = true;
    }

    // 2. Departments Bootstrap
    if (!db.departments || db.departments.length < 2) {
      db.departments = [
        {
          id: "IT",
          name: "IT Department",
          code: "IT",
          description: "Information Technology and systems support",
          parentDepartmentId: "Corporate",
          headId: "Rahul Sharma",
          email: "it@company.com",
          phone: "1001",
          location: "Building A, Floor 2",
          budget: 120000,
          status: "Active",
          notes: "Main IT infrastructure division",
        },
        {
          id: "HR",
          name: "Human Resources",
          code: "HR",
          description: "Personnel and talent acquisition",
          parentDepartmentId: "Corporate",
          headId: "Priya Singh",
          email: "hr@company.com",
          phone: "1002",
          location: "Building B, Floor 1",
          budget: 45000,
          status: "Active",
          notes: "Onboarding and benefits",
        },
        {
          id: "Finance",
          name: "Finance & Analytics",
          code: "FIN",
          description: "Accounting and ledger auditing",
          parentDepartmentId: "Corporate",
          headId: "Mohit Kumar",
          email: "finance@company.com",
          phone: "1003",
          location: "Building A, Floor 1",
          budget: 80000,
          status: "Active",
          notes: "Corporate accounts",
        },
        {
          id: "Operations",
          name: "Operations",
          code: "OPS",
          description: "Logistics and facilities management",
          parentDepartmentId: "Corporate",
          headId: "Bob Johnson",
          email: "ops@company.com",
          phone: "1004",
          location: "Building C, Ground Floor",
          budget: 95000,
          status: "Active",
          notes: "ERP hardware store control",
        },
      ];
      dirty = true;
    }

    // 3. Categories Bootstrap
    if (!db.categories || db.categories.length < 2) {
      db.categories = [
        {
          id: "Electronics",
          name: "Electronics",
          code: "ELC",
          icon: "Laptop",
          themeColor: "Blue",
          description: "Company work laptops, screens and tablets",
          defaultWarranty: 24,
          maintenanceCycle: 180,
          sharedResource: false,
          qrEnabled: true,
          status: "Active",
        },
        {
          id: "Furniture",
          name: "Furniture",
          code: "FUR",
          icon: "Armchair",
          themeColor: "Green",
          description: "Ergonomic desks and office chairs",
          defaultWarranty: 12,
          maintenanceCycle: 360,
          sharedResource: false,
          qrEnabled: true,
          status: "Active",
        },
        {
          id: "Vehicles",
          name: "Vehicles",
          code: "VEH",
          icon: "Car",
          themeColor: "Orange",
          description: "Corporate shared cars and transport",
          defaultWarranty: 36,
          maintenanceCycle: 90,
          sharedResource: true,
          qrEnabled: false,
          status: "Active",
        },
        {
          id: "Meeting Rooms",
          name: "Meeting Rooms",
          code: "ROM",
          icon: "Video",
          themeColor: "Purple",
          description: "Conference halls and video rooms",
          defaultWarranty: 0,
          maintenanceCycle: 30,
          sharedResource: true,
          qrEnabled: false,
          status: "Active",
        },
        {
          id: "Printers",
          name: "Printers",
          code: "PRN",
          icon: "Printer",
          themeColor: "Red",
          description: "Central hallway laser printers",
          defaultWarranty: 24,
          maintenanceCycle: 180,
          sharedResource: false,
          qrEnabled: true,
          status: "Active",
        },
      ];
      dirty = true;
    }

    // 4. Locations Bootstrap
    if (!db.locations || db.locations.length === 0) {
      db.locations = [
        {
          id: "loc-hq",
          name: "Corporate HQ",
          code: "HQ",
          parentId: null,
          manager: "John Carter",
          address: "123 Business Way",
          capacity: 500,
          description: "Main corporate headquarters",
          status: "Active",
        },
        {
          id: "loc-bldga",
          name: "Building A",
          code: "BLDG-A",
          parentId: "loc-hq",
          manager: "John Carter",
          address: "123 Business Way, Wing A",
          capacity: 200,
          description: "IT and Finance Wing",
          status: "Active",
        },
        {
          id: "loc-bldgb",
          name: "Building B",
          code: "BLDG-B",
          parentId: "loc-hq",
          manager: "Priya Singh",
          address: "123 Business Way, Wing B",
          capacity: 150,
          description: "HR and Talent Wing",
          status: "Active",
        },
        {
          id: "loc-fl1",
          name: "Floor 1",
          code: "FLR-1",
          parentId: "loc-bldga",
          manager: "Mohit Kumar",
          address: "Building A, 1st Floor",
          capacity: 100,
          description: "Finance desks",
          status: "Active",
        },
        {
          id: "loc-fl2",
          name: "Floor 2",
          code: "FLR-2",
          parentId: "loc-bldga",
          manager: "Rahul Sharma",
          address: "Building A, 2nd Floor",
          capacity: 100,
          description: "IT and systems support desk",
          status: "Active",
        },
        {
          id: "loc-itwing",
          name: "IT Wing",
          code: "IT-WNG",
          parentId: "loc-fl2",
          manager: "Rahul Sharma",
          address: "Floor 2, North Wing",
          capacity: 50,
          description: "Main IT developer hub",
          status: "Active",
        },
        {
          id: "loc-rm204",
          name: "Room 204",
          code: "RM-204",
          parentId: "loc-itwing",
          manager: "Rahul Sharma",
          address: "Floor 2, North Wing, Room 204",
          capacity: 12,
          description: "IT Server Room",
          status: "Active",
        },
      ];
      dirty = true;
    }

    // 5. Calendar & Booking Rules Bootstrap
    if (!db.calendar) {
      db.calendar = {
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        officeHoursStart: "09:00 AM",
        officeHoursEnd: "06:00 PM",
        lunchStart: "01:00 PM",
        lunchEnd: "02:00 PM",
        bookingRules: {
          maxHours: 4,
          advanceDays: 30,
          cancelTime: 1,
          bufferTime: 15,
          weekendBooking: false,
          holidayBooking: false,
        },
      };
      dirty = true;
    }

    // 6. Holidays Bootstrap
    if (!db.holidays || db.holidays.length === 0) {
      db.holidays = [
        {
          id: "hol-1",
          date: "2026-01-01",
          holiday: "New Year's Day",
          type: "National",
        },
        {
          id: "hol-2",
          date: "2026-07-04",
          holiday: "Independence Day",
          type: "National",
        },
        {
          id: "hol-3",
          date: "2026-12-25",
          holiday: "Christmas Day",
          type: "National",
        },
        {
          id: "hol-4",
          date: "2026-11-26",
          holiday: "Thanksgiving",
          type: "National",
        },
      ];
      dirty = true;
    }
    // 7. RBAC Roles & Permissions Bootstrap
    if (!db.roles) {
      db.roles = [
        {
          id: "admin",
          name: "Administrator",
          usersCount: 2,
          permissionCount: 78,
          lastModified: "2026-07-12",
          permissions: [
            "dashboard",
            "assets:register",
            "assets:edit",
            "assets:delete",
            "assets:view",
            "assets:allocate",
            "assets:transfer",
            "assets:return",
            "assets:maintenance",
            "assets:booking",
            "reports:view",
            "audit:full",
            "notifications:manage",
            "logs:view",
            "settings:write",
          ],
        },
        {
          id: "asset_manager",
          name: "Asset Manager",
          usersCount: 6,
          permissionCount: 54,
          lastModified: "2026-07-11",
          permissions: [
            "dashboard",
            "assets:register",
            "assets:edit",
            "assets:view",
            "assets:allocate",
            "assets:transfer",
            "assets:return",
            "assets:maintenance",
            "assets:booking",
            "reports:view",
            "audit:manage",
            "notifications:manage",
            "logs:view",
          ],
        },
        {
          id: "department_head",
          name: "Department Head",
          usersCount: 18,
          permissionCount: 37,
          lastModified: "2026-07-10",
          permissions: [
            "dashboard",
            "assets:view",
            "assets:allocate",
            "assets:transfer",
            "assets:return",
            "assets:booking",
            "reports:view",
            "audit:view",
            "notifications:manage",
            "logs:view",
          ],
        },
        {
          id: "employee",
          name: "Employee",
          usersCount: 302,
          permissionCount: 18,
          lastModified: "2026-07-09",
          permissions: [
            "dashboard",
            "assets:view",
            "assets:booking",
            "reports:view",
            "logs:view",
          ],
        },
      ];
      dirty = true;
    }

    // 8. Workflows Bootstrap
    if (!db.workflows) {
      db.workflows = [
        {
          id: "wf-allocation",
          name: "Asset Allocation Workflow",
          steps: ["Employee", "Department Head", "Asset Manager", "Completed"],
        },
        {
          id: "wf-transfer",
          name: "Asset Transfer Workflow",
          steps: ["Employee", "Department Head", "Asset Manager", "Completed"],
        },
        {
          id: "wf-maintenance",
          name: "Asset Maintenance Workflow",
          steps: ["Employee", "Asset Manager", "Technician", "Completed"],
        },
        {
          id: "wf-return",
          name: "Asset Return Workflow",
          steps: ["Employee", "Department Head", "Asset Manager", "Available"],
        },
        {
          id: "wf-audit",
          name: "Audit Workflow",
          steps: ["Admin", "Assign Auditor", "Audit", "Review", "Close Cycle"],
        },
      ];
      dirty = true;
    }

    // 9. Access Policies Bootstrap
    if (!db.accessPolicies) {
      db.accessPolicies = {
        passwordPolicy: {
          minLength: 8,
          uppercaseRequired: true,
          numbersRequired: true,
          specialCharactersRequired: true,
          expiryDays: 90,
        },
        sessionRules: {
          autoLogoutMinutes: 30,
          rememberDays: 7,
          multipleSessions: true,
        },
      };
      dirty = true;
    }

    // 10. Permission Audits Bootstrap
    if (!db.permissionAudits) {
      db.permissionAudits = [
        {
          id: "aud-1",
          date: "2026-07-12",
          admin: "Shashwat Admin",
          user: "Mohit Kumar",
          action: "Changed Role: Employee → Department Head",
        },
        {
          id: "aud-2",
          date: "2026-07-11",
          admin: "Shashwat Admin",
          user: "All",
          action: "Updated Asset Transfer Workflow steps",
        },
        {
          id: "aud-3",
          date: "2026-07-10",
          admin: "Shashwat Admin",
          user: "Employee",
          action: "Granted View Assets permission",
        },
      ];
      dirty = true;
    }

    // 11. Phase 6 Audits Bootstrap
    if (!db.audits || db.audits.length === 0) {
      db.audits = [
        {
          id: "AUD-001",
          name: "Quarterly IT Audit",
          code: "IT-Q3",
          scope: { type: "Department", departmentId: "IT" },
          startDate: "2026-07-10",
          endDate: "2026-07-14",
          deadline: "2026-07-15",
          priority: "High",
          auditors: ["emp-priya"],
          status: "running",
          progress: 72,
          verifiedCount: 214,
          pendingCount: 48,
          missingCount: 5,
          damagedCount: 8,
          timeline: ["Created on 2026-07-09", "Started on 2026-07-10"],
          assets: [],
        },
        {
          id: "AUD-002",
          name: "HR Compliance Verification",
          code: "HR-A1",
          scope: { type: "Department", departmentId: "HR" },
          startDate: "2026-07-20",
          endDate: "2026-07-25",
          deadline: "2026-07-26",
          priority: "Medium",
          auditors: ["emp-mohit"],
          status: "scheduled",
          progress: 0,
          verifiedCount: 0,
          pendingCount: 50,
          missingCount: 0,
          damagedCount: 0,
          timeline: ["Created on 2026-07-11"],
          assets: [],
        },
        {
          id: "AUD-003",
          name: "Annual Warehouse Inventory",
          code: "WH-ANN",
          scope: { type: "Location", locationId: "loc-rm204" },
          startDate: "2026-06-01",
          endDate: "2026-06-05",
          deadline: "2026-06-06",
          priority: "Critical",
          auditors: ["emp-rahul"],
          status: "completed",
          progress: 100,
          verifiedCount: 300,
          pendingCount: 0,
          missingCount: 2,
          damagedCount: 5,
          timeline: [
            "Created on 2026-05-28",
            "Started on 2026-06-01",
            "Closed on 2026-06-05",
          ],
          assets: [],
        },
      ];
      dirty = true;
    }

    // 12. Phase 6 Discrepancies Bootstrap
    if (!db.discrepancies || db.discrepancies.length === 0) {
      db.discrepancies = [
        {
          id: "disc-1",
          auditId: "AUD-001",
          assetId: "AF-0089",
          issue: "Missing Asset",
          departmentId: "IT",
          severity: "Critical",
          status: "investigating",
        },
        {
          id: "disc-2",
          auditId: "AUD-001",
          assetId: "AF-0112",
          issue: "Damaged Screen",
          departmentId: "IT",
          severity: "High",
          status: "open",
        },
        {
          id: "disc-3",
          auditId: "AUD-001",
          assetId: "AF-0019",
          issue: "Location Mismatch",
          departmentId: "IT",
          severity: "Medium",
          status: "resolved",
        },
      ];
      dirty = true;
    }

    // 13. Phase 7 Announcements Bootstrap
    if (!db.announcements || db.announcements.length === 0) {
      db.announcements = [
        {
          id: "ann-1",
          title: "System Maintenance Window",
          description:
            "The corporate ERP will undergo maintenance this Sunday from 8 PM to 10 PM. All services will be briefly offline.",
          audience: "Entire Organization",
          priority: "High",
          expiryDate: "2026-07-18",
          type: "System Update",
          date: "2026-07-12",
        },
        {
          id: "ann-2",
          title: "Summer Corporate Holidays Announcement",
          description:
            "National Independence Day holiday schedule is published in the Calendar tab. Office closed on July 4th.",
          audience: "Entire Organization",
          priority: "Medium",
          expiryDate: "2026-07-06",
          type: "Holiday",
          date: "2026-07-01",
        },
      ];
      dirty = true;
    }

    // 14. Phase 7 Scheduled Notifications Bootstrap
    if (!db.scheduledNotifications || db.scheduledNotifications.length === 0) {
      db.scheduledNotifications = [
        {
          id: "sch-1",
          message: "Send reminder email for Q3 IT Asset Verification",
          audience: "Asset Managers",
          date: "2026-07-15",
          time: "09:00 AM",
          repeat: "Weekly",
          priority: "High",
        },
      ];
      dirty = true;
    }

    // 15. Phase 7 Templates Bootstrap
    if (!db.notificationTemplates || db.notificationTemplates.length === 0) {
      db.notificationTemplates = [
        {
          id: "temp-1",
          title: "Asset Assigned Notice",
          subject: "Asset Allocated: {{Asset}}",
          message:
            "Hello {{Employee}}, the asset {{Asset}} has been allocated to you in department {{Department}} by {{Manager}}.",
          variables: ["Employee", "Asset", "Department", "Manager"],
        },
        {
          id: "temp-2",
          title: "Maintenance Request Approved",
          subject: "Repair Dispatched: {{Asset}}",
          message:
            "Asset {{Asset}} maintenance request has been approved. The assigned technician is scheduling diagnostics.",
          variables: ["Asset", "Date"],
        },
      ];
      dirty = true;
    }

    // 16. Notifications Inbox Seed
    if (!db.notifications || db.notifications.length === 0) {
      db.notifications = [
        {
          id: "notif-1",
          priority: "Critical",
          title: "Overdue Laptop Return Warning",
          message:
            "Vikram Singh has overdue custody for MacBook Pro AF-0189. Return deadline was July 5th.",
          recipient: "admin@gmail.com",
          time: "11:42 AM",
          status: "unread",
          category: "Assets",
          relatedModule: "Assets",
          relatedAsset: "AF-0189",
        },
        {
          id: "notif-2",
          priority: "High",
          title: "Critical Maintenance Request Opened",
          message: "Server Room Room 204 Air Conditioning unit failure logged.",
          recipient: "admin@gmail.com",
          time: "11:35 AM",
          status: "unread",
          category: "Maintenance",
          relatedModule: "Maintenance",
          relatedAsset: "AC-204",
        },
        {
          id: "notif-3",
          priority: "Medium",
          title: "Quarterly IT Audit Started",
          message: "Auditor Priya Singh started verification cycle AUD-001.",
          recipient: "admin@gmail.com",
          time: "11:20 AM",
          status: "read",
          category: "Audit",
          relatedModule: "Audit",
          relatedAsset: "",
        },
        {
          id: "notif-4",
          priority: "Low",
          title: "Conference Room A Booking Confirmed",
          message: "Operations team booked Room A for Q3 Strategy meeting.",
          recipient: "admin@gmail.com",
          time: "10:58 AM",
          status: "read",
          category: "Bookings",
          relatedModule: "Bookings",
          relatedAsset: "Room A",
        },
      ];
      dirty = true;
    }
    // 17. Phase 8 Security Logs Bootstrap
    if (!db.securityLogs || db.securityLogs.length === 0) {
      db.securityLogs = [
        {
          id: "sec-1",
          date: "2026-07-12",
          user: "admin@gmail.com",
          event: "Password Reset",
          device: "Windows PC",
          ip: "192.168.1.1",
          status: "Success",
          riskLevel: "Low",
        },
        {
          id: "sec-2",
          date: "2026-07-12",
          user: "unknown@gmail.com",
          event: "Failed Login",
          device: "iPhone",
          ip: "192.168.1.45",
          status: "Failed",
          riskLevel: "High",
        },
        {
          id: "sec-3",
          date: "2026-07-11",
          user: "admin@gmail.com",
          event: "Permission Changed",
          device: "MacBook",
          ip: "192.168.1.2",
          status: "Success",
          riskLevel: "Critical",
        },
      ];
      dirty = true;
    }

    // 18. Phase 8 System Logs Bootstrap
    if (!db.systemLogs || db.systemLogs.length === 0) {
      db.systemLogs = [
        {
          id: "sys-1",
          service: "API Router",
          event: "Database Connected",
          time: "12 Jul, 09:00 AM",
          status: "Success",
        },
        {
          id: "sys-2",
          service: "Backup Service",
          event: "Database Backup Completed",
          time: "12 Jul, 02:00 AM",
          status: "Success",
        },
        {
          id: "sys-3",
          service: "Cache Provider",
          event: "Memory Cache Cleared",
          time: "11 Jul, 10:15 PM",
          status: "Success",
        },
      ];
      dirty = true;
    }

    // 19. Phase 8 Login History Bootstrap
    if (!db.loginHistory || db.loginHistory.length === 0) {
      db.loginHistory = [
        {
          id: "log-1",
          user: "Shashwat Admin",
          login: "12 Jul, 09:15 AM",
          logout: "12 Jul, 12:30 PM",
          device: "Windows",
          browser: "Chrome",
          ip: "192.168.1.1",
          status: "Successful",
        },
        {
          id: "log-2",
          user: "Priya Singh",
          login: "12 Jul, 10:00 AM",
          logout: "Active",
          device: "MacBook",
          browser: "Safari",
          ip: "192.168.1.25",
          status: "Successful",
        },
        {
          id: "log-3",
          user: "Unknown User",
          login: "12 Jul, 08:30 AM",
          logout: "Blocked",
          device: "Linux Desktop",
          browser: "Firefox",
          ip: "192.168.1.99",
          status: "Failed Login",
        },
      ];
      dirty = true;
    }

    // 20. Phase 8 Export Logs Bootstrap
    if (!db.exportLogs || db.exportLogs.length === 0) {
      db.exportLogs = [
        {
          id: "exp-1",
          user: "Shashwat Admin",
          report: "Department Health Report",
          format: "CSV",
          time: "12 Jul, 11:20 AM",
        },
        {
          id: "exp-2",
          user: "Rahul Sharma",
          report: "Asset Register Ledger",
          format: "Excel",
          time: "11 Jul, 04:15 PM",
        },
        {
          id: "exp-3",
          user: "Priya Singh",
          report: "Employee Allocations Timeline",
          format: "PDF",
          time: "10 Jul, 09:30 AM",
        },
      ];
      dirty = true;
    }

    // 21. Phase 9 System Settings Bootstrap
    if (!db.systemSettings) {
      db.systemSettings = {
        general: {
          orgName: "AssetFlow Corp",
          orgCode: "AFC",
          website: "https://assetflow.com",
          email: "support@assetflow.com",
          phone: "+1234567890",
          address: "123 Enterprise Blvd",
          timezone: "IST (UTC+5:30)",
          language: "English",
          currency: "INR (₹)",
          branding: {
            primaryColor: "#4F46E5",
            secondaryColor: "#10B981",
            theme: "light",
          },
          dateFormat: "DD/MM/YYYY",
          timeFormat: "12 Hours",
        },
        organization: {
          multipleBranches: true,
          deptHierarchy: "Standard",
          employeeIdFormat: "EMP-XXXX",
          financialYear: "Apr - Mar",
          workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
        assetPolicies: {
          allowDuplicateSerial: false,
          qrCodeRequired: true,
          photoMandatory: true,
          warrantyTracking: true,
          returnRules: {
            maxDelayDays: 15,
            autoOverdue: true,
            reminderDaysBefore: 7,
          },
        },
        bookingRules: {
          maxBookingHours: 8,
          advanceBookingDays: 30,
          minNoticeMinutes: 30,
          bufferMinutes: 15,
          doubleBookingRestricted: true,
        },
        maintenanceRules: { slas: { Low: 7, Medium: 5, High: 2, Critical: 1 } },
        backupSettings: {
          schedule: "Daily",
          includeData: ["users", "assets", "bookings", "maintenance", "logs"],
        },
        integrations: {
          googleCalendar: false,
          outlook: false,
          cloudStorage: true,
          smtpConfigured: true,
        },
      };
      dirty = true;
    }

    // 22. Phase 9 Configuration History Bootstrap
    if (!db.configurationHistory || db.configurationHistory.length === 0) {
      db.configurationHistory = [
        {
          id: "cfg-1",
          timestamp: "12 Jul, 11:30 AM",
          setting: "Auto Overdue Returns",
          changedBy: "Shashwat Admin",
          from: "Disabled",
          to: "Enabled",
        },
        {
          id: "cfg-2",
          timestamp: "11 Jul, 02:15 PM",
          setting: "Password Expiry Duration",
          changedBy: "Shashwat Admin",
          from: "30 Days",
          to: "90 Days",
        },
      ];
      dirty = true;
    }

    // 23. Feedback Seed
    if (!db.feedback) {
      db.feedback = [];
      dirty = true;
    }

    // 24. Shared Resources Bootstrap (Phase 5)
    if (!db.resources || db.resources.length === 0) {
      db.resources = [
        {
          resourceId: "RS-001",
          resourceName: "Meeting Room A",
          category: "Meeting Rooms",
          location: "Building A, Floor 2",
          capacity: 8,
          status: "available",
          isBookable: true,
        },
        {
          resourceId: "RS-002",
          resourceName: "Meeting Room B",
          category: "Meeting Rooms",
          location: "Building A, Floor 2",
          capacity: 12,
          status: "available",
          isBookable: true,
        },
        {
          resourceId: "RS-003",
          resourceName: "Conference Hall A",
          category: "Conference Halls",
          location: "Building B, Floor 1",
          capacity: 50,
          status: "available",
          isBookable: true,
        },
        {
          resourceId: "RS-004",
          resourceName: "Tesla Model Y",
          category: "Vehicles",
          location: "Basement Garage",
          capacity: 5,
          status: "available",
          isBookable: true,
        },
        {
          resourceId: "RS-005",
          resourceName: "Training Room 1",
          category: "Training Rooms",
          location: "Building A, Floor 3",
          capacity: 25,
          status: "available",
          isBookable: true,
        },
        {
          resourceId: "RS-006",
          resourceName: "Sony Alpha 7 Camera",
          category: "Cameras",
          location: "Media Studio Room 10",
          capacity: 1,
          status: "available",
          isBookable: true,
        },
        {
          resourceId: "RS-007",
          resourceName: "HDMI Projector Pro",
          category: "Projectors",
          location: "IT Helpdesk Room 204",
          capacity: 1,
          status: "available",
          isBookable: true,
        },
      ];
      dirty = true;
    }

    // 25. Announcements Bootstrap (Phase 6)
    if (!db.announcements || db.announcements.length === 0) {
      db.announcements = [
        {
          announcementId: "ann-101",
          title: "Annual Fire Safety Drill",
          description:
            "All building occupants must evacuate to assembly points on Friday at 2:00 PM. Elevators will be disabled during the drill.",
          departmentId: "all",
          priority: "High",
          createdBy: "Diana Prince",
          createdAt: new Date().toISOString(),
        },
        {
          announcementId: "ann-102",
          title: "New Flexible Work Hours Policy",
          description:
            "We are introducing a revised flexible core hours framework starting next month. Please check the attachment folder or contact HR for guidelines.",
          departmentId: "all",
          priority: "Medium",
          createdBy: "Diana Prince",
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          announcementId: "ann-103",
          title: "IT Security Compliance Self-Audit",
          description:
            "All employees must perform the self-audit questionnaire on their workstation configurations to maintain global compliance logs.",
          departmentId: "IT",
          priority: "High",
          createdBy: "Rahul Sharma",
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        },
      ];
      dirty = true;
    }

    // 26. Notification Preferences Bootstrap (Phase 6)
    if (!db.notificationPreferences) {
      db.notificationPreferences = {
        AM003: {
          employeeId: "AM003",
          emailNotifications: true,
          assetNotifications: true,
          maintenanceNotifications: true,
          bookingNotifications: true,
          announcementNotifications: true,
        },
      };
      dirty = true;
    }

    // 27. Login Sessions Bootstrap (Phase 7)
    if (!db.loginSessions || db.loginSessions.length === 0) {
      db.loginSessions = [
        {
          sessionId: "sess-1",
          employeeId: "AM003",
          device: "Windows PC",
          browser: "Chrome",
          ipAddress: "192.168.1.10",
          location: "Ahmedabad, India",
          loginTime: new Date().toISOString(),
        },
        {
          sessionId: "sess-2",
          employeeId: "AM003",
          device: "Samsung S24 (Mobile)",
          browser: "AssetFlow Android",
          ipAddress: "192.168.1.45",
          location: "Ahmedabad, India",
          loginTime: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          sessionId: "sess-3",
          employeeId: "emp-developer",
          device: "Windows PC",
          browser: "Chrome",
          ipAddress: "192.168.1.10",
          location: "Ahmedabad, India",
          loginTime: new Date().toISOString(),
        },
      ];
      dirty = true;
    }

    // 28. Login History Bootstrap (Phase 7)
    if (!db.loginHistory || db.loginHistory.length === 0) {
      db.loginHistory = [
        {
          historyId: "log-h-1",
          employeeId: "AM003",
          device: "Windows PC",
          browser: "Chrome",
          status: "Successful",
          timestamp: new Date().toISOString(),
        },
        {
          historyId: "log-h-2",
          employeeId: "AM003",
          device: "Samsung S24",
          browser: "AssetFlow Android",
          status: "Successful",
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          historyId: "log-h-3",
          employeeId: "AM003",
          device: "MacBook Pro",
          browser: "Safari",
          status: "Failed Login",
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          historyId: "log-h-4",
          employeeId: "emp-developer",
          device: "Windows PC",
          browser: "Chrome",
          status: "Successful",
          timestamp: new Date().toISOString(),
        },
      ];
      dirty = true;
    }

    if (dirty) {
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
    }
    return db;
  } catch (err) {
    console.error("Failed to read db.json:", err);
    return {};
  }
};

const writeDb = (data: any) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write db.json:", err);
  }
};

// --- CENTRAL EVENT SERVICE (PHASE 7 ENGINE) ---
const recordEvent = (
  db: any,
  user: string,
  module: string,
  action: string,
  asset: string,
  status: "Success" | "Failed",
  notifMessage?: string,
  notifType?: string,
  notifPriority?: string,
) => {
  // 1. Create Activity Log (Rule 1)
  const logId = `L${String((db.activityLogs || []).length + 1).padStart(3, "0")}`;
  const newLog = {
    id: logId,
    user,
    module,
    action,
    asset,
    status,
    timestamp: new Date().toISOString(),
  };
  db.activityLogs = [newLog, ...(db.activityLogs || [])];

  // 2. Log in dashboard recent activities
  const timeStr = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  db.recentActivities = [
    { time: timeStr, message: `${action} on ${asset} by ${user}` },
    ...(db.recentActivities || []),
  ].slice(0, 10);

  // 3. Create Notification if important (Rule 2)
  if (notifMessage) {
    const notifId = `N${String((db.notifications || []).length + 1).padStart(3, "0")}`;
    const newNotif = {
      id: notifId,
      title: action,
      message: notifMessage,
      type: notifType || "system",
      priority: notifPriority || "normal",
      read: false,
      createdAt: new Date().toISOString(),
    };
    db.notifications = [newNotif, ...(db.notifications || [])];
  }
};

// --- AUTH ROUTER ---

app.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (
    !email ||
    !password ||
    !String(email).trim() ||
    !String(password).trim()
  ) {
    res.status(400).json({
      success: false,
      error: "Email/Employee ID and password are required.",
    });
    return;
  }

  const identifier = String(email).trim().toLowerCase();
  const cleanPassword = String(password).trim();

  const db = readDb();
  const user = (db.users || []).find((u: any) => {
    const emailMatch = u.email && u.email.toLowerCase() === identifier;
    const empIdMatch =
      u.employeeId && u.employeeId.toLowerCase() === identifier;
    return (emailMatch || empIdMatch) && u.password === cleanPassword;
  });

  if (!user) {
    res.status(401).json({ success: false, error: "Invalid credentials" });
    return;
  }

  if (user.status === "disabled") {
    res
      .status(403)
      .json({ success: false, error: "Account has been disabled" });
    return;
  }

  res.json({
    success: true,
    token: "mock-token",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    },
  });
});

app.get("/api/profile", (req: Request, res: Response) => {
  const db = readDb();
  const manager = (db.users || []).find((u: any) => u.role === "ASSET_MANAGER");

  if (!manager) {
    res.status(404).json({ error: "Asset Manager profile not found" });
    return;
  }

  res.json(manager);
});

// --- DASHBOARD ROUTER ---

app.get("/api/dashboard", (req: Request, res: Response) => {
  const db = readDb();
  const assets = db.assets || [];

  const availableAssets = assets.filter(
    (a: any) => a.status === "available",
  ).length;
  const allocatedAssets = assets.filter(
    (a: any) => a.status === "allocated",
  ).length;
  const maintenanceAssets = assets.filter(
    (a: any) => a.status === "under_maintenance",
  ).length;

  const pendingTransfers = (db.transfers || []).filter(
    (t: any) => t.status === "requested",
  ).length;
  const pendingReturns = (db.returns || []).filter(
    (r: any) => r.status === "pending",
  ).length;
  const auditPending = (db.audits || []).filter(
    (a: any) => a.status === "active",
  ).length;

  res.json({
    availableAssets,
    allocatedAssets,
    maintenanceAssets,
    pendingTransfers,
    pendingReturns,
    auditPending,
  });
});

app.get("/api/dashboard/pending", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.pendingApprovals || []);
});

app.get("/api/dashboard/activity", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.recentActivities || []);
});

app.get("/api/dashboard/status", (req: Request, res: Response) => {
  const db = readDb();
  const assets = db.assets || [];
  const statuses = [
    "available",
    "allocated",
    "reserved",
    "under_maintenance",
    "lost",
    "retired",
  ];

  const statusCounts = statuses.map((status) => {
    const count = assets.filter((a: any) => a.status === status).length;
    return {
      label: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
      value: count,
    };
  });

  res.json(statusCounts);
});

app.get("/api/dashboard/notifications", (req: Request, res: Response) => {
  const db = readDb();
  res.json((db.notifications || []).slice(0, 5));
});

app.get("/api/dashboard/returns", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.upcomingReturns || []);
});

// --- ASSETS CRUD ROUTER ---

app.get("/api/assets", (req: Request, res: Response) => {
  const db = readDb();
  let list = db.assets || [];

  const { search, category, status, department } = req.query;

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (a: any) =>
        a.id.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        (a.serialNumber && a.serialNumber.toLowerCase().includes(q)),
    );
  }

  if (category) {
    list = list.filter((a: any) => a.categoryId === String(category));
  }

  if (status) {
    list = list.filter((a: any) => a.status === String(status));
  }

  if (department) {
    list = list.filter((a: any) => a.departmentId === String(department));
  }

  res.json(list);
});

app.get("/api/assets/:id", (req: Request, res: Response) => {
  const db = readDb();
  const asset = (db.assets || []).find((a: any) => a.id === req.params.id);

  if (!asset) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }

  if (asset.status === "allocated") {
    const alloc = (db.allocations || []).find(
      (a: any) => a.assetId === asset.id && a.status === "active",
    );
    if (alloc) {
      asset.allocationDetail = {
        employeeName: alloc.employeeId,
        department: asset.departmentId || "General",
        allocationDate: alloc.allocatedOn,
        expectedReturn: alloc.expectedReturnDate,
      };
    }
  }

  res.json(asset);
});

app.post("/api/assets", (req: Request, res: Response) => {
  const authError = verifyRole(req, ["admin", "asset_manager"]);
  if (authError) {
    res.status(authError.status).json({ error: authError.message });
    return;
  }
  const db = readDb();
  const assets = db.assets || [];

  let nextIdNum = 1;
  if (assets.length > 0) {
    const ids = assets
      .map((a: any) => {
        const match = a.id.match(/^AF-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n: number) => n > 0);
    if (ids.length > 0) {
      nextIdNum = Math.max(...ids) + 1;
    }
  }
  const nextId = `AF-${String(nextIdNum).padStart(4, "0")}`;

  const {
    name,
    categoryId,
    departmentId,
    location,
    serialNumber,
    manufacturer,
    model,
    purchaseDate,
    cost,
    condition,
    sharedResource,
  } = req.body;

  if (!name || !String(name).trim()) {
    res.status(400).json({ error: "Asset Name is required." });
    return;
  }

  if (String(name).length > 100) {
    res.status(400).json({ error: "Asset Name cannot exceed 100 characters." });
    return;
  }

  if (!serialNumber || !String(serialNumber).trim()) {
    res.status(400).json({ error: "Serial Number is required." });
    return;
  }

  const dupSerial = assets.some(
    (a: any) =>
      a.serialNumber.toLowerCase() ===
      String(serialNumber).trim().toLowerCase(),
  );
  if (dupSerial) {
    res.status(400).json({
      error: `Asset with Serial Number "${serialNumber}" already exists.`,
    });
    return;
  }

  const costNum = Number(cost);
  if (isNaN(costNum) || costNum < 0) {
    res
      .status(400)
      .json({ error: "Purchase Cost cannot be negative or invalid." });
    return;
  }

  if (costNum > 10000000) {
    res.status(400).json({
      error: "Purchase Cost exceeds maximum allowed limit ($10,000,000).",
    });
    return;
  }

  if (purchaseDate) {
    const buyDate = new Date(purchaseDate);
    if (isNaN(buyDate.getTime())) {
      res.status(400).json({ error: "Invalid Purchase Date format." });
      return;
    }
    if (buyDate > new Date()) {
      res.status(400).json({ error: "Purchase Date cannot be in the future." });
      return;
    }
  }

  const newAsset = {
    id: nextId,
    name: String(name).trim(),
    categoryId: categoryId || "Electronics",
    departmentId: departmentId || "IT",
    location: location || "Floor 1",
    serialNumber: serialNumber || `SN-${nextId}`,
    manufacturer: manufacturer || "Generic",
    model: model || "v1",
    purchaseDate: purchaseDate || new Date().toISOString().split("T")[0],
    cost: Number(cost) || 0,
    condition: condition || "Excellent",
    sharedResource: !!sharedResource,
    status: "available",
    holder: null,
    history: [
      {
        id: `h-${nextId}-init`,
        type: "System",
        date: new Date().toISOString(),
        message: "Asset registered in database as Available.",
      },
    ],
  };

  assets.push(newAsset);

  // Rule 1 & Rule 2: Central Event log
  recordEvent(
    db,
    "John Carter",
    "Asset",
    "Register Asset",
    newAsset.id,
    "Success",
    `Asset ${newAsset.name} (${newAsset.id}) registered successfully.`,
    "system",
  );

  writeDb(db);
  res.status(201).json(newAsset);
});

app.patch("/api/assets/:id", (req: Request, res: Response) => {
  const authError = verifyRole(req, ["admin", "asset_manager"]);
  if (authError) {
    res.status(authError.status).json({ error: authError.message });
    return;
  }
  const db = readDb();
  const assets = db.assets || [];
  const idx = assets.findIndex((a: any) => a.id === req.params.id);

  if (idx === -1) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }

  const asset = assets[idx];
  const { location, condition, departmentId, categoryId, status } = req.body;

  if (location !== undefined) asset.location = location;
  if (condition !== undefined) asset.condition = condition;
  if (departmentId !== undefined) asset.departmentId = departmentId;
  if (categoryId !== undefined) asset.categoryId = categoryId;

  if (status !== undefined && status !== asset.status) {
    asset.history.push({
      id: `h-man-${Date.now()}`,
      type: "System",
      date: new Date().toISOString(),
      message: `Status manually changed from ${asset.status} to ${status}`,
    });
    asset.status = status;
  }

  // Event service logging
  recordEvent(
    db,
    "John Carter",
    "Asset",
    "Update Asset details",
    asset.id,
    "Success",
  );

  writeDb(db);
  res.json(asset);
});

app.delete("/api/assets/:id", (req: Request, res: Response) => {
  const authError = verifyRole(req, ["admin", "asset_manager"]);
  if (authError) {
    res.status(authError.status).json({ error: authError.message });
    return;
  }
  const db = readDb();
  const assets = db.assets || [];
  const asset = assets.find((a: any) => a.id === req.params.id);

  if (!asset) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }

  // Soft delete: change status to retired
  asset.status = "retired";
  asset.history.push({
    id: `h-del-${Date.now()}`,
    type: "System",
    date: new Date().toISOString(),
    message: "Asset soft deleted (retired from active inventory).",
  });

  recordEvent(
    db,
    "John Carter",
    "Asset",
    "Soft Delete Asset",
    req.params.id,
    "Success",
  );

  writeDb(db);
  res.json({
    success: true,
    message: "Asset soft deleted successfully (retired).",
  });
});

app.get("/api/assets/:id/history", (req: Request, res: Response) => {
  const db = readDb();
  const asset = (db.assets || []).find((a: any) => a.id === req.params.id);

  if (!asset) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }

  res.json(asset.history || []);
});

// --- ALLOCATIONS ROUTER ---

app.get("/api/allocations", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.allocations || []);
});

app.post("/api/allocations", (req: Request, res: Response) => {
  const db = readDb();
  const { assetId, employeeId, expectedReturnDate, notes } = req.body;

  const assets = db.assets || [];
  const asset = assets.find((a: any) => a.id === assetId);

  if (!asset) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }

  if (asset.status === "allocated") {
    res.status(400).json({
      error: `This asset is already allocated to ${asset.holder || "another employee"}.`,
      alreadyAllocated: true,
      holder: asset.holder,
    });
    return;
  }

  if (asset.status !== "available") {
    res.status(400).json({
      error: `Asset is currently unavailable (Status: ${asset.status})`,
    });
    return;
  }

  const newAlloc = {
    id: `alloc-${Date.now()}`,
    assetId,
    employeeId,
    allocatedOn: new Date().toISOString().split("T")[0],
    expectedReturnDate: expectedReturnDate || "",
    actualReturnDate: null,
    status: "active",
    notes: notes || "",
  };

  db.allocations = [newAlloc, ...(db.allocations || [])];

  asset.status = "allocated";
  asset.holder = employeeId;
  asset.history.push({
    id: `h-alloc-${Date.now()}`,
    type: "Allocation",
    date: new Date().toISOString(),
    message: `Allocated to employee ${employeeId}. Expected return: ${expectedReturnDate || "N/A"}`,
  });

  // Call Centralized Event Service
  recordEvent(
    db,
    "John Carter",
    "Allocation",
    "Allocate Asset",
    assetId,
    "Success",
    `Asset ${assetId} allocated to ${employeeId}.`,
    "allocation",
  );

  writeDb(db);
  res.status(201).json(newAlloc);
});

app.get("/api/allocations/:id", (req: Request, res: Response) => {
  const db = readDb();
  const alloc = (db.allocations || []).find((a: any) => a.id === req.params.id);

  if (!alloc) {
    res.status(404).json({ error: "Allocation not found" });
    return;
  }

  res.json(alloc);
});

// --- TRANSFERS ROUTER ---

app.get("/api/transfers", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.transfers || []);
});

app.post("/api/transfers", (req: Request, res: Response) => {
  const db = readDb();
  const { assetId, fromEmployeeId, toEmployeeId, reason } = req.body;

  const newTrf = {
    id: `trf-${Date.now()}`,
    assetId,
    fromEmployeeId,
    toEmployeeId,
    reason,
    status: "requested",
    date: new Date().toISOString(),
  };

  db.transfers = [newTrf, ...(db.transfers || [])];

  const asset = (db.assets || []).find((a: any) => a.id === assetId);
  if (asset) {
    asset.history.push({
      id: `h-trfrq-${Date.now()}`,
      type: "Transfer",
      date: new Date().toISOString(),
      message: `Transfer requested from ${fromEmployeeId} to ${toEmployeeId}`,
    });
  }

  db.pendingApprovals = [
    {
      type: "Transfer",
      asset: assetId,
      employee: fromEmployeeId,
      status: "Pending",
    },
    ...(db.pendingApprovals || []),
  ];

  recordEvent(
    db,
    fromEmployeeId,
    "Allocation",
    "Request Transfer",
    assetId,
    "Success",
    `Transfer requested from ${fromEmployeeId} to ${toEmployeeId}.`,
    "allocation",
  );

  writeDb(db);
  res.status(201).json(newTrf);
});

app.patch("/api/transfers/:id", (req: Request, res: Response) => {
  const db = readDb();
  const transfers = db.transfers || [];
  const trf = transfers.find((t: any) => t.id === req.params.id);

  if (!trf) {
    res.status(404).json({ error: "Transfer request not found" });
    return;
  }

  const { status } = req.body;
  trf.status = status;

  const assets = db.assets || [];
  const asset = assets.find((a: any) => a.id === trf.assetId);

  if (status === "approved" && asset) {
    const oldHolder = trf.fromEmployeeId;
    const newHolder = trf.toEmployeeId;

    const oldAlloc = (db.allocations || []).find(
      (a: any) =>
        a.assetId === trf.assetId &&
        a.employeeId === oldHolder &&
        a.status === "active",
    );
    if (oldAlloc) {
      oldAlloc.status = "returned";
      oldAlloc.actualReturnDate = new Date().toISOString().split("T")[0];
    }

    const newAlloc = {
      id: `alloc-${Date.now()}`,
      assetId: trf.assetId,
      employeeId: newHolder,
      allocatedOn: new Date().toISOString().split("T")[0],
      expectedReturnDate: oldAlloc ? oldAlloc.expectedReturnDate : "",
      actualReturnDate: null,
      status: "active",
      notes: `Transferred custody from ${oldHolder}`,
    };
    db.allocations = [newAlloc, ...(db.allocations || [])];

    asset.holder = newHolder;
    asset.history.push({
      id: `h-trfap-${Date.now()}`,
      type: "Transfer",
      date: new Date().toISOString(),
      message: `Custody transferred from ${oldHolder} to ${newHolder}`,
    });

    db.pendingApprovals = (db.pendingApprovals || []).filter(
      (p: any) => !(p.type === "Transfer" && p.asset === trf.assetId),
    );

    recordEvent(
      db,
      "John Carter",
      "Allocation",
      "Approve Transfer",
      trf.assetId,
      "Success",
      `Transfer of ${trf.assetId} to ${newHolder} approved.`,
      "allocation",
    );
  }

  writeDb(db);
  res.json(trf);
});

// --- RETURNS ROUTER ---

app.get("/api/returns", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.returns || []);
});

app.post("/api/returns", (req: Request, res: Response) => {
  const db = readDb();
  const { assetId, employeeId, condition } = req.body;

  const newReturn = {
    id: `ret-${Date.now()}`,
    assetId,
    employeeId,
    status: "pending",
    reportedCondition: condition || "Good",
    date: new Date().toISOString(),
  };

  db.returns = [newReturn, ...(db.returns || [])];

  const asset = (db.assets || []).find((a: any) => a.id === assetId);
  if (asset) {
    asset.history.push({
      id: `h-retrq-${Date.now()}`,
      type: "Allocation",
      date: new Date().toISOString(),
      message: `Return request submitted by ${employeeId}`,
    });
  }

  db.pendingApprovals = [
    {
      type: "Return",
      asset: assetId,
      employee: employeeId,
      status: "Waiting Verification",
    },
    ...(db.pendingApprovals || []),
  ];

  recordEvent(
    db,
    employeeId,
    "Return",
    "Request Return",
    assetId,
    "Success",
    `Return requested by ${employeeId}.`,
    "return",
  );

  writeDb(db);
  res.status(201).json(newReturn);
});

app.patch("/api/returns/:id", (req: Request, res: Response) => {
  const db = readDb();
  const returnsList = db.returns || [];
  const ret = returnsList.find((r: any) => r.id === req.params.id);

  if (!ret) {
    res.status(404).json({ error: "Return request not found" });
    return;
  }

  const { status, verifiedCondition, notes } = req.body;
  ret.status = status;
  ret.verifiedCondition = verifiedCondition;
  ret.notes = notes;

  const assets = db.assets || [];
  const asset = assets.find((a: any) => a.id === ret.assetId);

  if (status === "approved" && asset) {
    const alloc = (db.allocations || []).find(
      (a: any) =>
        a.assetId === ret.assetId &&
        a.employeeId === ret.employeeId &&
        a.status === "active",
    );
    if (alloc) {
      alloc.status = "returned";
      alloc.actualReturnDate = new Date().toISOString().split("T")[0];
    }

    asset.condition = verifiedCondition;
    asset.holder = null;

    if (
      verifiedCondition === "Needs Repair" ||
      verifiedCondition === "Damaged"
    ) {
      asset.status = "under_maintenance";
      asset.history.push({
        id: `h-retmnt-${Date.now()}`,
        type: "Maintenance",
        date: new Date().toISOString(),
        message: `Returned by ${ret.employeeId} in ${verifiedCondition} condition. Automatically routed to Repair Lab.`,
      });
    } else {
      asset.status = "available";
      asset.history.push({
        id: `h-retok-${Date.now()}`,
        type: "Allocation",
        date: new Date().toISOString(),
        message: `Returned by ${ret.employeeId} in ${verifiedCondition} condition. Released back to stock.`,
      });
    }

    db.pendingApprovals = (db.pendingApprovals || []).filter(
      (p: any) => !(p.type === "Return" && p.asset === ret.assetId),
    );

    recordEvent(
      db,
      "John Carter",
      "Return",
      "Approve Return",
      ret.assetId,
      "Success",
      `Return of asset ${ret.assetId} approved. Condition: ${verifiedCondition}.`,
      "return",
    );
  }

  writeDb(db);
  res.json(ret);
});

// --- MAINTENANCE ROUTER ---

app.get("/api/maintenance", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.maintenance || []);
});

app.get("/api/maintenance/technicians", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.technicians || []);
});

app.post("/api/maintenance", (req: Request, res: Response) => {
  const db = readDb();
  const { assetId, employeeId, problemDescription, priority } = req.body;

  const assets = db.assets || [];
  const asset = assets.find((a: any) => a.id === assetId);

  if (!asset) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }

  if (asset.status !== "allocated") {
    res.status(400).json({
      error:
        "Only allocated assets currently in custody can raise repair requests.",
    });
    return;
  }

  const newRequest = {
    id: `MR-${String((db.maintenance || []).length + 1).padStart(3, "0")}`,
    assetId,
    employeeId,
    priority: priority || "Medium",
    date: new Date().toISOString().split("T")[0],
    status: "pending",
    problemDescription,
  };

  db.maintenance = [newRequest, ...(db.maintenance || [])];

  asset.history.push({
    id: `h-mntrq-${Date.now()}`,
    type: "Maintenance",
    date: new Date().toISOString(),
    message: `Maintenance requested: ${problemDescription} (${priority} priority)`,
  });

  recordEvent(
    db,
    employeeId,
    "Maintenance",
    "Raise Repair Ticket",
    assetId,
    "Success",
    `Repair requested: ${problemDescription}`,
    "maintenance",
  );

  writeDb(db);
  res.status(201).json(newRequest);
});

app.patch("/api/maintenance/:id/approve", (req: Request, res: Response) => {
  const db = readDb();
  const mnt = (db.maintenance || []).find((m: any) => m.id === req.params.id);

  if (!mnt) {
    res.status(404).json({ error: "Maintenance request not found" });
    return;
  }

  mnt.status = "approved";

  const asset = (db.assets || []).find((a: any) => a.id === mnt.assetId);
  if (asset) {
    asset.status = "under_maintenance";
    asset.history.push({
      id: `h-mntap-${Date.now()}`,
      type: "Maintenance",
      date: new Date().toISOString(),
      message: `Repair request approved. Status transitioned to Under Maintenance.`,
    });
  }

  recordEvent(
    db,
    "John Carter",
    "Maintenance",
    "Approve Repair Ticket",
    mnt.assetId,
    "Success",
    `Repair request ${mnt.id} approved.`,
    "maintenance",
  );

  writeDb(db);
  res.json(mnt);
});

app.patch("/api/maintenance/:id/reject", (req: Request, res: Response) => {
  const db = readDb();
  const mnt = (db.maintenance || []).find((m: any) => m.id === req.params.id);

  if (!mnt) {
    res.status(404).json({ error: "Maintenance request not found" });
    return;
  }

  mnt.status = "rejected";

  const asset = (db.assets || []).find((a: any) => a.id === mnt.assetId);
  if (asset) {
    asset.history.push({
      id: `h-mntrj-${Date.now()}`,
      type: "Maintenance",
      date: new Date().toISOString(),
      message: `Repair request rejected by Asset Manager.`,
    });
  }

  recordEvent(
    db,
    "John Carter",
    "Maintenance",
    "Reject Repair Ticket",
    mnt.assetId,
    "Success",
    `Repair request ${mnt.id} was rejected.`,
    "maintenance",
  );

  writeDb(db);
  res.json(mnt);
});

app.patch("/api/maintenance/:id/assign", (req: Request, res: Response) => {
  const db = readDb();
  const mnt = (db.maintenance || []).find((m: any) => m.id === req.params.id);

  if (!mnt) {
    res.status(404).json({ error: "Maintenance request not found" });
    return;
  }

  const { technicianId } = req.body;
  mnt.status = "assigned";
  mnt.technicianId = technicianId;

  const tech = (db.technicians || []).find((t: any) => t.id === technicianId);
  const techName = tech ? tech.name : "assigned technician";

  const asset = (db.assets || []).find((a: any) => a.id === mnt.assetId);
  if (asset) {
    asset.history.push({
      id: `h-mntas-${Date.now()}`,
      type: "Maintenance",
      date: new Date().toISOString(),
      message: `Technician assigned: ${techName}.`,
    });
  }

  recordEvent(
    db,
    "John Carter",
    "Maintenance",
    "Assign Technician",
    mnt.assetId,
    "Success",
    `Technician ${techName} assigned to repair ${mnt.id}.`,
    "maintenance",
  );

  writeDb(db);
  res.json(mnt);
});

app.patch("/api/maintenance/:id/progress", (req: Request, res: Response) => {
  const db = readDb();
  const mnt = (db.maintenance || []).find((m: any) => m.id === req.params.id);

  if (!mnt) {
    res.status(404).json({ error: "Maintenance request not found" });
    return;
  }

  const { status } = req.body;
  mnt.status = status;

  const asset = (db.assets || []).find((a: any) => a.id === mnt.assetId);
  if (asset) {
    asset.history.push({
      id: `h-mntpr-${Date.now()}`,
      type: "Maintenance",
      date: new Date().toISOString(),
      message: `Repair progress updated: ${status.replace("_", " ")}.`,
    });
  }

  recordEvent(
    db,
    "John Carter",
    "Maintenance",
    "Update Repair Progress",
    mnt.assetId,
    "Success",
  );

  writeDb(db);
  res.json(mnt);
});

app.patch("/api/maintenance/:id/resolve", (req: Request, res: Response) => {
  const db = readDb();
  const mnt = (db.maintenance || []).find((m: any) => m.id === req.params.id);

  if (!mnt) {
    res.status(404).json({ error: "Maintenance request not found" });
    return;
  }

  const { reopen, notes } = req.body;

  if (reopen) {
    mnt.status = "in_progress";
    const asset = (db.assets || []).find((a: any) => a.id === mnt.assetId);
    if (asset) {
      asset.history.push({
        id: `h-mntre-${Date.now()}`,
        type: "Maintenance",
        date: new Date().toISOString(),
        message: "Repair request re-opened. Investigation restarted.",
      });
    }
    recordEvent(
      db,
      "John Carter",
      "Maintenance",
      "Reopen Repair Ticket",
      mnt.assetId,
      "Success",
    );
  } else {
    mnt.status = "resolved";
    mnt.notes = notes || "";

    const asset = (db.assets || []).find((a: any) => a.id === mnt.assetId);
    if (asset) {
      const oldAlloc = (db.allocations || []).find(
        (a: any) => a.assetId === mnt.assetId && a.status === "active",
      );
      if (oldAlloc) {
        oldAlloc.status = "returned";
        oldAlloc.actualReturnDate = new Date().toISOString().split("T")[0];
      }

      asset.status = "available";
      asset.holder = null;
      asset.condition = "Good";
      asset.history.push({
        id: `h-mntres-${Date.now()}`,
        type: "Maintenance",
        date: new Date().toISOString(),
        message: `Repair completed successfully. Asset condition restored and released back to Stock.`,
      });
    }

    recordEvent(
      db,
      "John Carter",
      "Maintenance",
      "Resolve Repair Ticket",
      mnt.assetId,
      "Success",
      `Repair completed on asset ${mnt.assetId}. Returned to stock.`,
      "maintenance",
    );
  }

  writeDb(db);
  res.json(mnt);
});

// --- AUDIT ROUTER ---

app.get("/api/audits", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.audits || []);
});

app.post("/api/audits", (req: Request, res: Response) => {
  const db = readDb();
  const { name, scopeType, scopeValue, startDate, endDate, auditors } =
    req.body;

  const assets = db.assets || [];
  let scopeAssets = assets;

  if (scopeType === "department") {
    scopeAssets = assets.filter((a: any) => a.departmentId === scopeValue);
  } else if (scopeType === "location") {
    scopeAssets = assets.filter((a: any) =>
      a.location.toLowerCase().includes(scopeValue.toLowerCase()),
    );
  }

  const auditId = `AC-${String((db.audits || []).length + 1).padStart(4, "0")}`;

  const mappedAssets = scopeAssets.map((a: any) => ({
    assetId: a.id,
    location: a.location,
    expectedHolder: a.holder,
    status: "unverified",
  }));

  const newAudit = {
    id: auditId,
    name: name || `Quarterly Audit ${auditId}`,
    scopeType,
    scopeValue: scopeValue || "Entire Organization",
    startDate: startDate || new Date().toISOString().split("T")[0],
    endDate: endDate || "",
    auditors: auditors || ["John Carter"],
    status: "active",
    assets: mappedAssets,
  };

  db.audits = [newAudit, ...(db.audits || [])];

  recordEvent(
    db,
    "John Carter",
    "Audit",
    "Create Audit Cycle",
    auditId,
    "Success",
    `Audit Cycle ${newAudit.name} created.`,
    "audit",
  );

  writeDb(db);
  res.status(201).json(newAudit);
});

app.get("/api/audits/:id", (req: Request, res: Response) => {
  const db = readDb();
  const audit = (db.audits || []).find((a: any) => a.id === req.params.id);

  if (!audit) {
    res.status(404).json({ error: "Audit cycle not found" });
    return;
  }

  res.json(audit);
});

app.patch("/api/audits/:id/verify", (req: Request, res: Response) => {
  const db = readDb();
  const auditsList = db.audits || [];
  const audit = auditsList.find((a: any) => a.id === req.params.id);

  if (!audit) {
    res.status(404).json({ error: "Audit cycle not found" });
    return;
  }

  if (audit.status !== "active") {
    res
      .status(400)
      .json({ error: "Cannot verify assets in a closed audit cycle." });
    return;
  }

  const { assetId, verificationResult, notes } = req.body;
  const targetAsset = audit.assets.find((a: any) => a.assetId === assetId);

  if (!targetAsset) {
    res.status(404).json({ error: "Asset not found in audit scope." });
    return;
  }

  targetAsset.status = verificationResult;
  targetAsset.notes = notes || "";

  const assetDetails = (db.assets || []).find((a: any) => a.id === assetId);
  if (assetDetails) {
    assetDetails.history.push({
      id: `h-aud-${Date.now()}`,
      type: "Audit",
      date: new Date().toISOString(),
      message: `Audit verification [${audit.name}]: Marked as ${verificationResult}. Notes: ${notes || "None"}`,
    });
  }

  if (verificationResult === "missing") {
    const discrepancyId = `disc-${Date.now()}`;
    db.discrepancies = [
      {
        id: discrepancyId,
        auditCycleId: audit.id,
        assetId,
        issue: "Missing",
        departmentId: assetDetails ? assetDetails.departmentId : "IT",
        holder: assetDetails ? assetDetails.holder : null,
        status: "pending",
      },
      ...(db.discrepancies || []),
    ];
    recordEvent(
      db,
      "John Carter",
      "Audit",
      "Discrepancy Found (Missing)",
      assetId,
      "Success",
      `Asset ${assetId} reported missing in audit ${audit.id}.`,
      "audit",
      "critical",
    );
  }

  if (verificationResult === "damaged") {
    const discrepancyId = `disc-${Date.now()}`;
    db.discrepancies = [
      {
        id: discrepancyId,
        auditCycleId: audit.id,
        assetId,
        issue: "Damaged",
        departmentId: assetDetails ? assetDetails.departmentId : "IT",
        holder: assetDetails ? assetDetails.holder : null,
        status: "pending",
      },
      ...(db.discrepancies || []),
    ];
    recordEvent(
      db,
      "John Carter",
      "Audit",
      "Discrepancy Found (Damaged)",
      assetId,
      "Success",
      `Asset ${assetId} reported damaged in audit ${audit.id}.`,
      "audit",
      "normal",
    );
  }

  recordEvent(
    db,
    "John Carter",
    "Audit",
    "Verify Asset in Audit",
    assetId,
    "Success",
  );

  writeDb(db);
  res.json(audit);
});

app.get("/api/discrepancies", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.discrepancies || []);
});

app.patch("/api/audits/:id/resolve", (req: Request, res: Response) => {
  const db = readDb();
  const { discrepancyId, resolution } = req.body;

  const disc = (db.discrepancies || []).find(
    (d: any) => d.id === discrepancyId,
  );
  if (!disc) {
    res.status(404).json({ error: "Discrepancy record not found" });
    return;
  }

  disc.status = "resolved";
  disc.resolution = resolution;

  const assets = db.assets || [];
  const asset = assets.find((a: any) => a.id === disc.assetId);

  if (asset) {
    if (resolution === "Found") {
      asset.status = "available";
      asset.holder = null;
      asset.history.push({
        id: `h-disc-${Date.now()}`,
        type: "Audit",
        date: new Date().toISOString(),
        message:
          "Discrepancy resolved: Asset found. Status restored to Available.",
      });
    } else if (resolution === "Mark Lost") {
      asset.status = "lost";
      asset.holder = null;
      asset.history.push({
        id: `h-disc-${Date.now()}`,
        type: "Audit",
        date: new Date().toISOString(),
        message: "Discrepancy resolved: Asset written off as Lost.",
      });
    } else if (resolution === "Send to Maintenance") {
      asset.status = "under_maintenance";
      asset.history.push({
        id: `h-disc-${Date.now()}`,
        type: "Maintenance",
        date: new Date().toISOString(),
        message: "Discrepancy resolved: Damaged asset routed to Maintenance.",
      });

      const newMnt = {
        id: `MR-${String((db.maintenance || []).length + 1).padStart(3, "0")}`,
        assetId: disc.assetId,
        employeeId: "Audit Resolution",
        priority: "High",
        date: new Date().toISOString().split("T")[0],
        status: "pending",
        problemDescription: `Reported damaged during audit cycle ${disc.auditCycleId}.`,
      };
      db.maintenance = [newMnt, ...(db.maintenance || [])];
    }
  }

  recordEvent(
    db,
    "John Carter",
    "Audit",
    "Resolve Discrepancy",
    disc.assetId,
    "Success",
  );

  writeDb(db);
  res.json(disc);
});

app.patch("/api/audits/:id/close", (req: Request, res: Response) => {
  const db = readDb();
  const auditsList = db.audits || [];
  const audit = auditsList.find((a: any) => a.id === req.params.id);

  if (!audit) {
    res.status(404).json({ error: "Audit cycle not found" });
    return;
  }

  const unverified = audit.assets.filter((a: any) => a.status === "unverified");
  if (unverified.length > 0) {
    res.status(400).json({
      error: `Cannot close audit cycle. There are still ${unverified.length} assets unverified in the scope.`,
      unverifiedCount: unverified.length,
    });
    return;
  }

  audit.status = "closed";

  recordEvent(
    db,
    "John Carter",
    "Audit",
    "Close Audit Cycle",
    audit.id,
    "Success",
    `Audit Cycle ${audit.name} closed and locked.`,
    "audit",
  );

  writeDb(db);
  res.json(audit);
});

// --- EVENT ENGINE ROUTER (PHASE 7 APIs) ---

// 1. GET /api/notifications
app.get("/api/notifications", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.notifications || []);
});

// 2. PATCH /api/notifications/:id/read - Mark notification read
app.patch("/api/notifications/:id/read", (req: Request, res: Response) => {
  const db = readDb();
  const notif = (db.notifications || []).find(
    (n: any) => n.id === req.params.id,
  );

  if (!notif) {
    res.status(404).json({ error: "Notification not found" });
    return;
  }

  notif.read = true;
  writeDb(db);
  res.json(notif);
});

// 3. PATCH /api/notifications/read-all - Mark all read
app.patch("/api/notifications/read-all", (req: Request, res: Response) => {
  const db = readDb();
  const list = db.notifications || [];

  list.forEach((n: any) => {
    n.read = true;
  });
  writeDb(db);
  res.json({ success: true, count: list.length });
});

// 4. DELETE /api/notifications/:id - Delete notification
app.delete("/api/notifications/:id", (req: Request, res: Response) => {
  const db = readDb();
  let list = db.notifications || [];

  db.notifications = list.filter((n: any) => n.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// 5. GET /api/activity-logs - Fetch activity logs
app.get("/api/activity-logs", (req: Request, res: Response) => {
  const db = readDb();
  let list = db.activityLogs || [];
  res.json(list);
});

// --- ANALYTICS ROUTER (PHASE 8 REPORTS) ---

app.get("/api/reports/overview", (req: Request, res: Response) => {
  const db = readDb();
  const assets = db.assets || [];
  const allocs = db.allocations || [];
  const mnts = db.maintenance || [];

  const totalAssets = assets.length;
  const availableAssets = assets.filter(
    (a: any) => a.status === "available",
  ).length;

  // Idle assets: available status for more than 30 days (mock count)
  const idleAssets = Math.floor(availableAssets * 0.4);

  // Maintenance total cost mock
  const totalMntCost =
    mnts.filter((m: any) => m.status === "resolved").length * 150;

  // Assets near retirement
  const nearRetirement = assets.filter((a: any) => {
    const buyYear = new Date(a.purchaseDate).getFullYear();
    return 2026 - buyYear >= 4;
  }).length;

  const today = new Date();
  const overdueReturns = allocs.filter(
    (a: any) => a.status === "active" && new Date(a.expectedReturnDate) < today,
  ).length;

  res.json({
    totalAssets,
    availableAssets,
    idleAssets,
    totalMntCost,
    nearRetirement,
    overdueReturns,
  });
});

// --- DEDICATED ADMIN PORTAL APIs ---

// 1. GET /api/admin/dashboard - Executive ERP Command Center data
app.get("/api/admin/dashboard", (req: Request, res: Response) => {
  const db = readDb();

  // Safeguards
  if (!db.users) db.users = [];
  if (!db.assets) db.assets = [];
  if (!db.allocations) db.allocations = [];
  if (!db.bookings) db.bookings = [];
  if (!db.maintenance) db.maintenance = [];
  if (!db.audits) db.audits = [];
  if (!db.pendingApprovals) db.pendingApprovals = [];
  if (!db.recentActivities) db.recentActivities = [];
  if (!db.notifications) db.notifications = [];
  if (!db.departments) db.departments = [];
  if (!db.categories) db.categories = [];
  if (!db.locations) db.locations = [];
  if (!db.holidays) db.holidays = [];

  // Dynamic calculations relative to user database updates
  const totalAssets = 1250 - 160 + db.assets.length;
  const employees = 324 - 9 + db.users.length;
  const departmentsCount = db.departments.length || 12;
  const assetManagers =
    db.users.filter((u: any) => u.role === "asset_manager").length || 6;
  const onlineAssetManagers = Math.max(1, Math.min(assetManagers, 5));
  const departmentHeads =
    db.users.filter((u: any) => u.role === "department_head").length || 18;
  const onlineDepartmentHeads = Math.max(1, Math.min(departmentHeads, 13));
  const bookingsToday = 42 - 3 + db.bookings.length;
  const activeBookings = 5;
  const pendingApprovalsCount = db.pendingApprovals.length || 17;

  const activeMnt = db.maintenance.filter((m: any) => m.status !== "resolved");
  const maintenanceCount = Math.max(21, 19 + activeMnt.length);
  const highPriorityMaintenance =
    activeMnt.filter((m: any) => m.priority === "High").length || 6;

  // Highlights
  const newEmployeesHighlight = 4;
  const pendingApprovalsHighlight = db.pendingApprovals.length || 3;
  const maintenanceHighlight = activeMnt.length || 2;
  const auditsHighlight =
    db.audits.filter((a: any) => a.status === "active").length || 1;

  // Donut chart Asset Distribution shares
  const availableCount = db.assets.filter(
    (a: any) => a.status === "available",
  ).length;
  const allocatedCount = db.assets.filter(
    (a: any) => a.status === "allocated",
  ).length;
  const underMaintCount = db.assets.filter(
    (a: any) => a.status === "under_maintenance",
  ).length;
  const reservedCount = db.assets.filter(
    (a: any) => a.status === "reserved",
  ).length;
  const lostCount = db.assets.filter((a: any) => a.status === "lost").length;
  const disposedCount = db.assets.filter(
    (a: any) => a.status === "retired",
  ).length;

  const totalDbAssets = db.assets.length || 1;
  const donutData = [
    {
      label: "Available",
      value: Math.round((availableCount / totalDbAssets) * totalAssets) || 520,
      color: "#4F46E5",
    },
    {
      label: "Allocated",
      value: Math.round((allocatedCount / totalDbAssets) * totalAssets) || 610,
      color: "#10B981",
    },
    {
      label: "Maintenance",
      value: Math.round((underMaintCount / totalDbAssets) * totalAssets) || 42,
      color: "#F59E0B",
    },
    {
      label: "Reserved",
      value: Math.round((reservedCount / totalDbAssets) * totalAssets) || 38,
      color: "#3b82f6",
    },
    {
      label: "Lost",
      value: Math.round((lostCount / totalDbAssets) * totalAssets) || 25,
      color: "#EF4444",
    },
    {
      label: "Disposed",
      value: Math.round((disposedCount / totalDbAssets) * totalAssets) || 15,
      color: "#6B7280",
    },
  ];

  // Department Bar Chart
  const deptAssets = {
    IT: db.assets.filter((a: any) => a.departmentId === "IT").length,
    HR: db.assets.filter((a: any) => a.departmentId === "HR").length,
    Finance: db.assets.filter(
      (a: any) => a.departmentId === "Finance" || a.departmentId === "Sales",
    ).length,
    Marketing: db.assets.filter((a: any) => a.departmentId === "Marketing")
      .length,
    Admin: db.assets.filter((a: any) => a.departmentId === "Admin").length,
    Operations: db.assets.filter((a: any) => a.departmentId === "Operations")
      .length,
  };
  const totalDeptDbAssets =
    Object.values(deptAssets).reduce((a, b) => a + b, 0) || 1;
  const barData = [
    {
      label: "IT",
      value:
        Math.round((deptAssets.IT / totalDeptDbAssets) * totalAssets) || 520,
    },
    {
      label: "HR",
      value:
        Math.round((deptAssets.HR / totalDeptDbAssets) * totalAssets) || 120,
    },
    {
      label: "Finance",
      value:
        Math.round((deptAssets.Finance / totalDeptDbAssets) * totalAssets) ||
        150,
    },
    {
      label: "Marketing",
      value:
        Math.round((deptAssets.Marketing / totalDeptDbAssets) * totalAssets) ||
        110,
    },
    {
      label: "Admin",
      value:
        Math.round((deptAssets.Admin / totalDeptDbAssets) * totalAssets) || 90,
    },
    {
      label: "Operations",
      value:
        Math.round((deptAssets.Operations / totalDeptDbAssets) * totalAssets) ||
        260,
    },
  ];

  // Maintenance Trend
  const trendData = [
    { label: "Jan", value: 12 },
    { label: "Feb", value: 15 },
    { label: "Mar", value: 18 },
    { label: "Apr", value: 14 },
    { label: "May", value: 22 },
    { label: "Jun", value: 21 },
  ];

  // Booking Heatmap
  const heatmapData = [
    { label: "8 AM", value: 12 },
    { label: "9 AM", value: 25 },
    { label: "10 AM", value: 42 },
    { label: "11 AM", value: 38 },
    { label: "12 PM", value: 18 },
  ];

  // Departments Overview Table
  const tableData = db.departments.map((dept: any) => {
    const deptEmployees = db.users.filter(
      (u: any) => u.departmentId === dept.id,
    ).length;
    const deptAssetsCount = db.assets.filter(
      (a: any) => a.departmentId === dept.id,
    ).length;
    const deptMaintenance = db.maintenance.filter(
      (m: any) =>
        m.status !== "resolved" &&
        db.assets.find(
          (a: any) => a.id === m.assetId && a.departmentId === dept.id,
        ),
    ).length;
    let health = "🟢";
    if (deptMaintenance > 5) health = "🔴";
    else if (deptMaintenance > 2) health = "🟡";

    return {
      id: dept.id,
      department: dept.name,
      code: dept.code,
      employees: Math.max(15, deptEmployees * 8),
      assets: Math.max(30, deptAssetsCount * 12),
      bookings: Math.max(2, deptEmployees * 3),
      maintenance: deptMaintenance || 2,
      health,
      manager: dept.headId || "Unassigned",
    };
  });

  // Pending Work Queue Widget
  const workQueue = [
    {
      type: "Pending User Approval",
      priority: "High",
      assignedTo: "Admin",
      time: "10 mins ago",
      detail: "Employee EMP-1009 requested ERP role change to Department Head.",
    },
    {
      type: "Pending Maintenance",
      priority: "Critical",
      assignedTo: "Amit Sharma",
      time: "1 hr ago",
      detail: "Laptop AF-0044 battery swelling reported.",
    },
    {
      type: "Pending Transfers",
      priority: "Medium",
      assignedTo: "Admin",
      time: "2 hrs ago",
      detail: "Asset AF-0035 transfer request from Rahul to Priya.",
    },
    {
      type: "Pending Returns",
      priority: "High",
      assignedTo: "Admin",
      time: "3 hrs ago",
      detail: "Asset AF-0048 return verification pending from Aman.",
    },
    {
      type: "Audit Due",
      priority: "Medium",
      assignedTo: "John Carter",
      time: "1 day ago",
      detail: "Q3 Annual Asset Verification is overdue for submission.",
    },
    {
      type: "Inactive Departments",
      priority: "Low",
      assignedTo: "Admin",
      time: "2 days ago",
      detail: "Sales & Marketing department head assignment is vacant.",
    },
    {
      type: "Expired Assets",
      priority: "Critical",
      assignedTo: "Bob Johnson",
      time: "3 days ago",
      detail: "5 Laptops have passed their 4-year lifecycle retirement date.",
    },
  ];

  // Recent Activities
  const recentActivities = [
    {
      time: "10:35 AM",
      message: "Employee EMP-1011 (Sneha) Created in HR Directory",
      type: "Employee Created",
      status: "Success",
    },
    {
      time: "10:20 AM",
      message: "Department IT Office Location updated to Building A, Floor 3",
      type: "Department Updated",
      status: "Success",
    },
    {
      time: "10:05 AM",
      message: "New Asset Macbook Pro (AF-0161) Registered",
      type: "Asset Registered",
      status: "Success",
    },
    {
      time: "09:42 AM",
      message: "Q2 Department IT Audit Cycle Closed and Locked",
      type: "Audit Closed",
      status: "Success",
    },
    {
      time: "09:25 AM",
      message: "Transfer of Laptop AF-0012 to Priya Approved",
      type: "Transfer Approved",
      status: "Success",
    },
  ];

  // Critical Alerts
  const alerts = [
    {
      message:
        "3 Overdue Returns: Laptop AF-0031 (Rahul), Printer AF-0089 (Aman), Laptop AF-0010 (Vikram)",
      priority: "Critical",
    },
    {
      message: "2 Audit Deadlines: Q3 Org Audit closes in 5 days",
      priority: "High",
    },
    {
      message:
        "1 Department Without Head: Sales & Marketing has no assigned leader",
      priority: "Medium",
    },
    {
      message: "5 Assets Need Maintenance: Repair requests pending dispatch",
      priority: "High",
    },
  ];

  // Radial health indexes
  const healthIndices = db.departments.map((dept: any) => {
    const activeMnts = db.maintenance.filter(
      (m: any) =>
        m.status !== "resolved" &&
        db.assets.find(
          (a: any) => a.id === m.assetId && a.departmentId === dept.id,
        ),
    ).length;
    const score = Math.max(70, 95 - activeMnts * 5);
    return {
      id: dept.id,
      name: dept.name.replace(" Department", ""),
      score,
      color: score >= 90 ? "#10B981" : score >= 80 ? "#3b82f6" : "#F59E0B",
    };
  });

  // Small bottom stats
  const orgStats = {
    mostUsedCategory: "Electronics",
    mostActiveDepartment: "Operations",
    highestBookingResource: "Conference Room A",
    idleAssets: 34,
  };

  res.json({
    kpis: {
      totalAssets,
      employees,
      departments: departmentsCount,
      assetManagers,
      onlineAssetManagers,
      departmentHeads,
      onlineDepartmentHeads,
      bookingsToday,
      activeBookings,
      pendingApprovals: pendingApprovalsCount,
      assetsUnderMaintenance: maintenanceCount,
      highPriorityMaintenance,
    },
    highlights: {
      newEmployees: newEmployeesHighlight,
      pendingApprovals: pendingApprovalsHighlight,
      maintenanceAssets: maintenanceHighlight,
      auditsToday: auditsHighlight,
      healthScore: 92,
    },
    analytics: {
      donutData,
      barData,
      trendData,
      heatmapData,
    },
    departmentsTable: tableData,
    pendingWorkQueue: workQueue,
    recentActivities,
    alerts,
    healthIndex: healthIndices,
    stats: orgStats,
  });
});

// --- DEPARTMENTS CRUD & VALIDATIONS ---
app.get("/api/departments", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.departments || []);
});

app.post("/api/departments", (req: Request, res: Response) => {
  const authError = verifyRole(req, ["admin"]);
  if (authError) {
    res.status(authError.status).json({ error: authError.message });
    return;
  }
  const db = readDb();
  if (!db.departments) db.departments = [];
  const {
    name,
    code,
    description,
    parentDepartmentId,
    headId,
    email,
    phone,
    location,
    budget,
    status,
    notes,
  } = req.body;

  // Enforce unique department code
  const dupCode = db.departments.some(
    (d: any) =>
      d.code && d.code.toLowerCase() === String(code).trim().toLowerCase(),
  );
  if (dupCode) {
    res
      .status(400)
      .json({ error: `Department with code "${code}" already exists.` });
    return;
  }

  // Enforce unique department name
  const dupName = db.departments.some(
    (d: any) =>
      d.name && d.name.toLowerCase() === String(name).trim().toLowerCase(),
  );
  if (dupName) {
    res
      .status(400)
      .json({ error: `Department with name "${name}" already exists.` });
    return;
  }

  const newDept = {
    id: `dept-${Date.now()}`,
    name: String(name).trim(),
    code: String(code).trim(),
    description: description || "",
    parentDepartmentId: parentDepartmentId || "Corporate",
    headId: headId || null,
    email: email || "",
    phone: phone || "",
    location: location || "",
    budget: Number(budget) || 0,
    status: status || "Active",
    notes: notes || "",
  };

  db.departments.push(newDept);

  // Update employee role if headId is assigned HOD
  if (headId) {
    const user = (db.users || []).find((u: any) => u.name === headId);
    if (user) {
      user.role = "department_head";
      user.departmentId = newDept.id;
    }
  }

  recordEvent(
    db,
    "System Admin",
    "Setup",
    `Create Department: ${newDept.name}`,
    newDept.id,
    "Success",
  );
  writeDb(db);
  res.status(201).json(newDept);
});

app.patch("/api/departments/:id", (req: Request, res: Response) => {
  const authError = verifyRole(req, ["admin"]);
  if (authError) {
    res.status(authError.status).json({ error: authError.message });
    return;
  }
  const db = readDb();
  const departmentsList = db.departments || [];
  const dept = departmentsList.find((d: any) => d.id === req.params.id);

  if (!dept) {
    res.status(404).json({ error: "Department not found" });
    return;
  }

  const {
    name,
    code,
    description,
    parentDepartmentId,
    headId,
    email,
    phone,
    location,
    budget,
    status,
    notes,
  } = req.body;

  // Validation: Code must be unique
  if (code !== undefined && code !== dept.code) {
    const dup = departmentsList.some(
      (d: any) =>
        d.id !== dept.id &&
        d.code &&
        d.code.toLowerCase() === String(code).trim().toLowerCase(),
    );
    if (dup) {
      res
        .status(400)
        .json({ error: `Department with code "${code}" already exists.` });
      return;
    }
    dept.code = String(code).trim();
  }

  // Validation: Name must be unique
  if (name !== undefined && name !== dept.name) {
    const dup = departmentsList.some(
      (d: any) =>
        d.id !== dept.id &&
        d.name &&
        d.name.toLowerCase() === String(name).trim().toLowerCase(),
    );
    if (dup) {
      res
        .status(400)
        .json({ error: `Department with name "${name}" already exists.` });
      return;
    }
    dept.name = String(name).trim();
  }

  // Validation: Status check (deactivating)
  if (
    status !== undefined &&
    status === "Inactive" &&
    dept.status === "Active"
  ) {
    const activeEmps = (db.users || []).some(
      (u: any) => u.departmentId === dept.id && u.status === "active",
    );
    const activeAssets = (db.assets || []).some(
      (a: any) => a.departmentId === dept.id && a.status !== "retired",
    );
    if (activeEmps || activeAssets) {
      res.status(400).json({
        error:
          "Cannot deactivate department. Department contains active employees or assets.",
      });
      return;
    }
    dept.status = "Inactive";
  } else if (status !== undefined) {
    dept.status = status;
  }

  if (description !== undefined) dept.description = description;
  if (parentDepartmentId !== undefined)
    dept.parentDepartmentId = parentDepartmentId;
  if (email !== undefined) dept.email = email;
  if (phone !== undefined) dept.phone = phone;
  if (location !== undefined) dept.location = location;
  if (budget !== undefined) dept.budget = Number(budget) || 0;
  if (notes !== undefined) dept.notes = notes;

  if (headId !== undefined && headId !== dept.headId) {
    // Demote old head if they are no longer head of any other dept
    if (dept.headId) {
      const oldHead = (db.users || []).find((u: any) => u.name === dept.headId);
      const isStillHead = departmentsList.some(
        (d: any) => d.id !== dept.id && d.headId === dept.headId,
      );
      if (oldHead && !isStillHead) {
        oldHead.role = "employee";
      }
    }

    dept.headId = headId || null;

    // Promote new head
    if (headId) {
      const newHead = (db.users || []).find((u: any) => u.name === headId);
      if (newHead) {
        newHead.role = "department_head";
        newHead.departmentId = dept.id;
      }
    }
  }

  recordEvent(
    db,
    "System Admin",
    "Setup",
    `Update Department Details: ${dept.name}`,
    dept.id,
    "Success",
  );
  writeDb(db);
  res.json(dept);
});

app.delete("/api/departments/:id", (req: Request, res: Response) => {
  const authError = verifyRole(req, ["admin"]);
  if (authError) {
    res.status(authError.status).json({ error: authError.message });
    return;
  }
  const db = readDb();
  if (!db.departments) db.departments = [];
  const dept = db.departments.find((d: any) => d.id === req.params.id);

  if (!dept) {
    res.status(404).json({ error: "Department not found" });
    return;
  }

  // Enforce delete rules: no employees, no assets
  const hasEmployees = (db.users || []).some(
    (u: any) => u.departmentId === dept.id,
  );
  const hasAssets = (db.assets || []).some(
    (a: any) => a.departmentId === dept.id && a.status !== "retired",
  );

  if (hasEmployees || hasAssets) {
    res.status(400).json({
      error:
        "Cannot delete department. Department contains active employees or assets.",
    });
    return;
  }

  db.departments = db.departments.filter((d: any) => d.id !== req.params.id);

  recordEvent(
    db,
    "System Admin",
    "Setup",
    `Delete Department: ${dept.name}`,
    req.params.id,
    "Success",
  );
  writeDb(db);
  res.json({ success: true });
});

// --- CATEGORIES CRUD & VALIDATIONS ---
app.get("/api/categories", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.categories || []);
});

app.post("/api/categories", (req: Request, res: Response) => {
  const db = readDb();
  if (!db.categories) db.categories = [];
  const {
    name,
    code,
    icon,
    themeColor,
    description,
    defaultWarranty,
    maintenanceCycle,
    sharedResource,
    qrEnabled,
    status,
  } = req.body;

  // Validation: Unique Name
  const dup = db.categories.some(
    (c: any) => c.name.toLowerCase() === String(name).trim().toLowerCase(),
  );
  if (dup) {
    res
      .status(400)
      .json({ error: `Category with name "${name}" already exists.` });
    return;
  }

  // Validation: Warranty non-negative
  const warrantyNum = Number(defaultWarranty);
  if (isNaN(warrantyNum) || warrantyNum < 0) {
    res.status(400).json({ error: "Default warranty cannot be negative." });
    return;
  }

  // Validation: Maintenance cycle required and positive
  const maintCycleNum = Number(maintenanceCycle);
  if (isNaN(maintCycleNum) || maintCycleNum <= 0) {
    res
      .status(400)
      .json({ error: "Maintenance cycle is required and must be positive." });
    return;
  }

  const newCat = {
    id: `cat-${Date.now()}`,
    name: String(name).trim(),
    code: String(code || "GEN")
      .trim()
      .toUpperCase(),
    icon: icon || "Laptop",
    themeColor: themeColor || "Blue",
    description: description || "",
    defaultWarranty: warrantyNum,
    maintenanceCycle: maintCycleNum,
    sharedResource: !!sharedResource,
    qrEnabled: !!qrEnabled,
    status: status || "Active",
  };

  db.categories.push(newCat);
  recordEvent(
    db,
    "System Admin",
    "Setup",
    `Create Category: ${newCat.name}`,
    newCat.id,
    "Success",
  );
  writeDb(db);
  res.status(201).json(newCat);
});

app.delete("/api/categories/:id", (req: Request, res: Response) => {
  const db = readDb();
  if (!db.categories) db.categories = [];
  const cat = db.categories.find((c: any) => c.id === req.params.id);

  if (!cat) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  // Prevent deleting category if assets are registered to it
  const hasAssets = (db.assets || []).some(
    (a: any) => a.categoryId === cat.id && a.status !== "retired",
  );
  if (hasAssets) {
    res.status(400).json({
      error:
        "Cannot delete category. There are active assets registered to this category.",
    });
    return;
  }

  db.categories = db.categories.filter((c: any) => c.id !== req.params.id);
  recordEvent(
    db,
    "System Admin",
    "Setup",
    `Delete Category: ${cat.name}`,
    req.params.id,
    "Success",
  );
  writeDb(db);
  res.json({ success: true });
});

// --- LOCATIONS CRUD & VALIDATIONS ---
app.get("/api/locations", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.locations || []);
});

app.post("/api/locations", (req: Request, res: Response) => {
  const db = readDb();
  if (!db.locations) db.locations = [];
  const {
    name,
    code,
    parentId,
    manager,
    address,
    capacity,
    description,
    status,
  } = req.body;

  const newLoc = {
    id: `loc-${Date.now()}`,
    name: String(name).trim(),
    code: String(code || "LOC")
      .trim()
      .toUpperCase(),
    parentId: parentId || null,
    manager: manager || "",
    address: address || "",
    capacity: Number(capacity) || 0,
    description: description || "",
    status: status || "Active",
  };

  // Validation: Parent cannot reference itself
  if (newLoc.parentId === newLoc.id) {
    res
      .status(400)
      .json({ error: "Location parent reference cannot point to itself." });
    return;
  }

  db.locations.push(newLoc);
  recordEvent(
    db,
    "System Admin",
    "Setup",
    `Location Added: ${newLoc.name}`,
    newLoc.id,
    "Success",
  );
  writeDb(db);
  res.status(201).json(newLoc);
});

app.patch("/api/locations/:id", (req: Request, res: Response) => {
  const db = readDb();
  const locationsList = db.locations || [];
  const loc = locationsList.find((l: any) => l.id === req.params.id);

  if (!loc) {
    res.status(404).json({ error: "Location not found" });
    return;
  }

  const {
    name,
    code,
    parentId,
    manager,
    address,
    capacity,
    description,
    status,
  } = req.body;

  if (name !== undefined) loc.name = name;
  if (code !== undefined) loc.code = code;
  if (manager !== undefined) loc.manager = manager;
  if (address !== undefined) loc.address = address;
  if (capacity !== undefined) loc.capacity = Number(capacity) || 0;
  if (description !== undefined) loc.description = description;
  if (status !== undefined) loc.status = status;

  if (parentId !== undefined) {
    if (parentId === loc.id) {
      res
        .status(400)
        .json({ error: "Location parent reference cannot point to itself." });
      return;
    }
    loc.parentId = parentId || null;
  }

  recordEvent(
    db,
    "System Admin",
    "Setup",
    `Location Updated: ${loc.name}`,
    loc.id,
    "Success",
  );
  writeDb(db);
  res.json(loc);
});

app.delete("/api/locations/:id", (req: Request, res: Response) => {
  const db = readDb();
  if (!db.locations) db.locations = [];
  const loc = db.locations.find((l: any) => l.id === req.params.id);

  if (!loc) {
    res.status(404).json({ error: "Location not found" });
    return;
  }

  // Validation: Cannot delete location with assets
  const hasAssets = (db.assets || []).some(
    (a: any) => a.location === loc.name && a.status !== "retired",
  );
  if (hasAssets) {
    res.status(400).json({
      error:
        "Cannot delete location. There are assets registered to this office location.",
    });
    return;
  }

  db.locations = db.locations.filter((l: any) => l.id !== req.params.id);
  recordEvent(
    db,
    "System Admin",
    "Setup",
    `Location Deleted: ${loc.name}`,
    req.params.id,
    "Success",
  );
  writeDb(db);
  res.json({ success: true });
});

// --- BUSINESS CALENDAR & HOLIDAYS ---
app.get("/api/calendar", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.calendar || {});
});

app.post("/api/calendar", (req: Request, res: Response) => {
  const db = readDb();
  const {
    workingDays,
    officeHoursStart,
    officeHoursEnd,
    lunchStart,
    lunchEnd,
    bookingRules,
  } = req.body;

  // Validation: Office start time before end time
  // Basic time parser helper (e.g. "09:00 AM" -> 900, "06:00 PM" -> 1800)
  const parseTime = (tStr: string): number => {
    if (!tStr) return 0;
    const match = tStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return 0;
    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return hour * 60 + minute;
  };

  const startMin = parseTime(officeHoursStart);
  const endMin = parseTime(officeHoursEnd);

  if (startMin >= endMin) {
    res.status(400).json({
      error: "Office opening time must be configured before closing time.",
    });
    return;
  }

  db.calendar = {
    workingDays: workingDays || [],
    officeHoursStart,
    officeHoursEnd,
    lunchStart: lunchStart || "",
    lunchEnd: lunchEnd || "",
    bookingRules: bookingRules || {},
  };

  recordEvent(
    db,
    "System Admin",
    "Setup",
    "Business Hours & Calendar Updated",
    "CalendarSettings",
    "Success",
  );
  writeDb(db);
  res.json(db.calendar);
});

app.get("/api/holidays", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.holidays || []);
});

app.post("/api/holidays", (req: Request, res: Response) => {
  const db = readDb();
  if (!db.holidays) db.holidays = [];
  const { date, holiday, type } = req.body;

  // Validation: No duplicates
  const dup = db.holidays.some((h: any) => h.date === date);
  if (dup) {
    res.status(400).json({
      error: `Holiday calendar already has an event registered on date: ${date}`,
    });
    return;
  }

  const newHol = {
    id: `hol-${Date.now()}`,
    date,
    holiday: String(holiday).trim(),
    type: type || "National",
  };

  db.holidays.push(newHol);
  recordEvent(
    db,
    "System Admin",
    "Setup",
    `Holiday Added: ${newHol.holiday}`,
    newHol.id,
    "Success",
  );
  writeDb(db);
  res.status(201).json(newHol);
});

app.delete("/api/holidays/:id", (req: Request, res: Response) => {
  const db = readDb();
  if (!db.holidays) db.holidays = [];
  const hol = db.holidays.find((h: any) => h.id === req.params.id);

  if (!hol) {
    res.status(404).json({ error: "Holiday not found" });
    return;
  }

  db.holidays = db.holidays.filter((h: any) => h.id !== req.params.id);
  recordEvent(
    db,
    "System Admin",
    "Setup",
    `Holiday Removed: ${hol.holiday}`,
    req.params.id,
    "Success",
  );
  writeDb(db);
  res.json({ success: true });
});

// --- EMPLOYEE DIRECTORY & SECURITY LIFECYCLE ---
app.get("/api/employees", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.users || []);
});

app.post("/api/employees", (req: Request, res: Response) => {
  const authError = verifyRole(req, ["admin"]);
  if (authError) {
    res.status(authError.status).json({ error: authError.message });
    return;
  }
  const db = readDb();
  if (!db.users) db.users = [];

  const {
    firstName,
    lastName,
    email,
    role,
    departmentId,
    designation,
    joiningDate,
    reportingManager,
    employmentType,
    officeLocation,
    username,
    password,
  } = req.body;

  // Validation: Email unique
  const dupEmail = db.users.some(
    (u: any) =>
      u.email && u.email.toLowerCase() === String(email).trim().toLowerCase(),
  );
  if (dupEmail) {
    res
      .status(400)
      .json({ error: `Employee email "${email}" is already registered.` });
    return;
  }

  // Username auto generation
  let genUsername = String(username || "")
    .trim()
    .toLowerCase();
  if (!genUsername) {
    const baseUser = `${String(firstName || "user").toLowerCase()}.${String(lastName || "name").toLowerCase()}`;
    // check uniqueness, suffix if needed
    let suffix = 0;
    genUsername = baseUser;
    while (db.users.some((u: any) => u.username === genUsername)) {
      suffix++;
      genUsername = `${baseUser}${suffix}`;
    }
  } else {
    // Validation: Username unique
    const dupUser = db.users.some((u: any) => u.username === genUsername);
    if (dupUser) {
      res
        .status(400)
        .json({ error: `Username "${genUsername}" is already taken.` });
      return;
    }
  }

  // Incremental ID generator
  const lastEmp = db.users
    .filter((u: any) => u.employeeId && u.employeeId.startsWith("EMP-"))
    .map((u: any) => parseInt(u.employeeId.replace("EMP-", ""), 10))
    .sort((a: number, b: number) => b - a)[0];
  const nextIdNum = lastEmp ? lastEmp + 1 : 1008;
  const employeeId = `EMP-${String(nextIdNum).padStart(4, "0")}`;

  // Generate temporary password
  const tempPassword =
    password || `Temp#${Math.floor(10 + Math.random() * 89)}@L`;

  const newEmp = {
    id: `emp-${Date.now()}`,
    firstName: String(firstName || "").trim(),
    lastName: String(lastName || "").trim(),
    name: `${String(firstName || "").trim()} ${String(lastName || "").trim()}`.trim(),
    email: String(email).trim(),
    role: role || "employee",
    departmentId: departmentId || null,
    designation: designation || "Associate",
    joiningDate: joiningDate || new Date().toISOString().split("T")[0],
    reportingManager: reportingManager || "John Carter",
    employmentType: employmentType || "Full-Time",
    officeLocation: officeLocation || "Corporate HQ",
    username: genUsername,
    password: tempPassword,
    employeeId,
    status: "active",
    lastLogin: "Never",
    forcePasswordChange: true,
  };

  db.users.push(newEmp);

  // If role is HOD, handle single head assignment
  if (role === "department_head" && departmentId) {
    const dept = (db.departments || []).find((d: any) => d.id === departmentId);
    if (dept) {
      // Demote previous head
      if (dept.headId) {
        const oldHead = db.users.find((u: any) => u.name === dept.headId);
        if (oldHead && oldHead.id !== newEmp.id) {
          oldHead.role = "employee";
        }
      }
      dept.headId = newEmp.name;
    }
  }

  recordEvent(
    db,
    "System Admin",
    "User Management",
    `User Created: ${newEmp.name} (${newEmp.employeeId})`,
    newEmp.id,
    "Success",
  );
  writeDb(db);

  // Output generated credentials
  res.status(201).json({
    success: true,
    user: newEmp,
    credentials: {
      employeeId,
      username: genUsername,
      tempPassword,
    },
  });
});

app.patch("/api/employees/:id", (req: Request, res: Response) => {
  const authError = verifyRole(req, ["admin"]);
  if (authError) {
    res.status(authError.status).json({ error: authError.message });
    return;
  }
  const db = readDb();
  const users = db.users || [];
  const user = users.find((u: any) => u.id === req.params.id);

  if (!user) {
    res.status(404).json({ error: "Employee record not found." });
    return;
  }

  const {
    firstName,
    lastName,
    email,
    role,
    departmentId,
    designation,
    joiningDate,
    reportingManager,
    employmentType,
    officeLocation,
    username,
    password,
    status,
    forcePasswordChange,
  } = req.body;

  if (email !== undefined && email !== user.email) {
    const dup = users.some(
      (u: any) =>
        u.id !== user.id &&
        u.email &&
        u.email.toLowerCase() === String(email).toLowerCase(),
    );
    if (dup) {
      res
        .status(400)
        .json({ error: `Email address "${email}" is already registered.` });
      return;
    }
    user.email = email;
  }

  if (username !== undefined && username !== user.username) {
    const dup = users.some(
      (u: any) =>
        u.id !== user.id &&
        u.username === String(username).trim().toLowerCase(),
    );
    if (dup) {
      res
        .status(400)
        .json({ error: `Username "${username}" is already taken.` });
      return;
    }
    user.username = String(username).trim().toLowerCase();
  }

  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (firstName !== undefined || lastName !== undefined) {
    user.name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  }

  if (designation !== undefined) user.designation = designation;
  if (joiningDate !== undefined) user.joiningDate = joiningDate;
  if (reportingManager !== undefined) user.reportingManager = reportingManager;
  if (employmentType !== undefined) user.employmentType = employmentType;
  if (officeLocation !== undefined) user.officeLocation = officeLocation;
  if (password !== undefined) user.password = password;
  if (status !== undefined) user.status = status;
  if (forcePasswordChange !== undefined)
    user.forcePasswordChange = !!forcePasswordChange;

  if (departmentId !== undefined) {
    user.departmentId = departmentId || null;
  }

  if (role !== undefined && role !== user.role) {
    // If setting to department_head, demote old head of that department
    if (role === "department_head" && user.departmentId) {
      const dept = (db.departments || []).find(
        (d: any) => d.id === user.departmentId,
      );
      if (dept) {
        if (dept.headId && dept.headId !== user.name) {
          const oldHead = users.find((u: any) => u.name === dept.headId);
          if (oldHead) oldHead.role = "employee";
        }
        dept.headId = user.name;
      }
    }
    user.role = role;
  }

  recordEvent(
    db,
    "System Admin",
    "User Management",
    `Update Employee Profile: ${user.name}`,
    user.id,
    "Success",
  );
  writeDb(db);
  res.json(user);
});

app.delete("/api/employees/:id", (req: Request, res: Response) => {
  const authError = verifyRole(req, ["admin"]);
  if (authError) {
    res.status(authError.status).json({ error: authError.message });
    return;
  }
  const db = readDb();
  if (!db.users) db.users = [];
  const user = db.users.find((u: any) => u.id === req.params.id);

  if (!user) {
    res.status(404).json({ error: "Employee not found." });
    return;
  }

  // Deletion Rules: no assets, no bookings, no pending approvals
  const hasAssets = (db.assets || []).some(
    (a: any) => a.holder === user.name || a.holder === user.employeeId,
  );
  const hasBookings = (db.bookings || []).some(
    (b: any) => b.employeeId === user.id || b.employeeId === user.employeeId,
  );
  const hasApprovals = (db.pendingApprovals || []).some(
    (p: any) => p.employee === user.name || p.employee === user.firstName,
  );

  if (hasAssets || hasBookings || hasApprovals) {
    res.status(400).json({
      error:
        "Cannot delete employee. User owns active assets, bookings, or pending approvals.",
    });
    return;
  }

  db.users = db.users.filter((u: any) => u.id !== req.params.id);

  recordEvent(
    db,
    "System Admin",
    "User Management",
    `Delete User Account: ${user.name}`,
    req.params.id,
    "Success",
  );
  writeDb(db);
  res.json({ success: true });
});

// --- BULK OPERATIONS FOR EMPLOYEES ---
app.post("/api/admin/employees/bulk", (req: Request, res: Response) => {
  const db = readDb();
  if (!db.users) db.users = [];

  const { action, payload } = req.body;

  if (action === "import") {
    const list = payload || [];
    let count = 0;
    list.forEach((item: any) => {
      const { firstName, lastName, email, role, departmentId } = item;
      // Skip if email duplicate
      const exists = db.users.some(
        (u: any) => u.email.toLowerCase() === String(email).toLowerCase(),
      );
      if (exists) return;

      const baseUser = `${String(firstName || "user").toLowerCase()}.${String(lastName || "name").toLowerCase()}`;
      let genUsername = baseUser;
      let suffix = 0;
      while (db.users.some((u: any) => u.username === genUsername)) {
        suffix++;
        genUsername = `${baseUser}${suffix}`;
      }

      const nextIdNum = 1008 + db.users.length;
      const employeeId = `EMP-${String(nextIdNum).padStart(4, "0")}`;
      const tempPassword = `Temp#${Math.floor(10 + Math.random() * 89)}@L`;

      db.users.push({
        id: `emp-${Date.now()}-${count}`,
        firstName: String(firstName || "").trim(),
        lastName: String(lastName || "").trim(),
        name: `${String(firstName || "").trim()} ${String(lastName || "").trim()}`.trim(),
        email: String(email).trim(),
        role: role || "employee",
        departmentId: departmentId || null,
        designation: "Associate",
        joiningDate: new Date().toISOString().split("T")[0],
        reportingManager: "John Carter",
        employmentType: "Full-Time",
        officeLocation: "Corporate HQ",
        username: genUsername,
        password: tempPassword,
        employeeId,
        status: "active",
        lastLogin: "Never",
        forcePasswordChange: true,
      });
      count++;
    });

    recordEvent(
      db,
      "System Admin",
      "User Management",
      `Bulk Import: ${count} Employees`,
      "BulkImport",
      "Success",
    );
    writeDb(db);
    res.json({ success: true, count });
    return;
  }

  const employeeIds = payload?.employeeIds || [];
  if (employeeIds.length === 0) {
    res.status(400).json({ error: "No employee IDs selected." });
    return;
  }

  const selectedUsers = db.users.filter((u: any) => employeeIds.includes(u.id));

  if (action === "role") {
    const { role } = payload;
    selectedUsers.forEach((u: any) => {
      u.role = role;
    });
    recordEvent(
      db,
      "System Admin",
      "User Management",
      `Bulk Role Update to: ${role}`,
      "BulkRole",
      "Success",
    );
  } else if (action === "transfer") {
    const { departmentId } = payload;
    selectedUsers.forEach((u: any) => {
      u.departmentId = departmentId;
    });
    recordEvent(
      db,
      "System Admin",
      "User Management",
      `Bulk Dept Transfer to: ${departmentId}`,
      "BulkTransfer",
      "Success",
    );
  } else if (action === "reset") {
    selectedUsers.forEach((u: any) => {
      u.password = `Temp#${Math.floor(10 + Math.random() * 89)}@L`;
      u.forcePasswordChange = true;
    });
    recordEvent(
      db,
      "System Admin",
      "User Management",
      "Bulk Password Reset Triggered",
      "BulkReset",
      "Success",
    );
  } else if (action === "activate") {
    selectedUsers.forEach((u: any) => {
      u.status = "active";
    });
    recordEvent(
      db,
      "System Admin",
      "User Management",
      "Bulk Activate Employees",
      "BulkActivate",
      "Success",
    );
  } else if (action === "deactivate") {
    selectedUsers.forEach((u: any) => {
      u.status = "disabled";
    });
    recordEvent(
      db,
      "System Admin",
      "User Management",
      "Bulk Deactivate Employees",
      "BulkDeactivate",
      "Success",
    );
  }

  writeDb(db);
  res.json({ success: true, count: selectedUsers.length });
});

// GET /api/admin/employees/export - Export directory as mock CSV
app.get("/api/admin/employees/export", (req: Request, res: Response) => {
  const db = readDb();
  const users = db.users || [];

  if (!db.exportLogs) db.exportLogs = [];
  db.exportLogs.push({
    id: `exp-${Date.now()}`,
    user: "Shashwat Admin",
    report: "Employee Directory",
    format: "CSV",
    time: new Date().toLocaleString(),
  });
  writeDb(db);

  let csv = "Employee ID,Name,Role,Department,Status,Email,Username\n";
  users.forEach((u: any) => {
    csv += `"${u.employeeId}","${u.name}","${u.role}","${u.departmentId || ""}","${u.status}","${u.email}","${u.username}"\n`;
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=employees_directory.csv",
  );
  res.send(csv);
});

// --- RBAC APIs (PHASE 4) ---
app.get("/api/rbac/roles", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.roles || []);
});

app.patch("/api/rbac/roles/:id", (req: Request, res: Response) => {
  const db = readDb();
  const roles = db.roles || [];
  const role = roles.find((r: any) => r.id === req.params.id);

  if (!role) {
    res.status(404).json({ error: "Role not found" });
    return;
  }

  const { permissions } = req.body;
  if (permissions !== undefined) {
    role.permissions = permissions;
    role.permissionCount = permissions.length;
    role.lastModified = new Date().toISOString().split("T")[0];

    // Log permission audit
    if (!db.permissionAudits) db.permissionAudits = [];
    db.permissionAudits.push({
      id: `aud-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      admin: "Shashwat Admin",
      user: role.name,
      action: `Modified permissions matrix: set to ${role.permissionCount} rules.`,
    });
  }

  recordEvent(
    db,
    "System Admin",
    "RBAC",
    `Update Role Matrix: ${role.name}`,
    role.id,
    "Success",
  );
  writeDb(db);
  res.json(role);
});

app.get("/api/rbac/workflows", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.workflows || []);
});

app.patch("/api/rbac/workflows/:id", (req: Request, res: Response) => {
  const db = readDb();
  const workflows = db.workflows || [];
  const wf = workflows.find((w: any) => w.id === req.params.id);

  if (!wf) {
    res.status(404).json({ error: "Workflow not found" });
    return;
  }

  const { steps } = req.body;
  if (steps !== undefined) {
    wf.steps = steps;
    // Log audit
    if (!db.permissionAudits) db.permissionAudits = [];
    db.permissionAudits.push({
      id: `aud-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      admin: "Shashwat Admin",
      user: wf.name,
      action: `Updated approval workflow steps to: [${steps.join(" → ")}]`,
    });
  }

  recordEvent(
    db,
    "System Admin",
    "RBAC",
    `Update Workflow: ${wf.name}`,
    wf.id,
    "Success",
  );
  writeDb(db);
  res.json(wf);
});

app.get("/api/rbac/policies", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.accessPolicies || {});
});

app.post("/api/rbac/policies", (req: Request, res: Response) => {
  const db = readDb();
  const { passwordPolicy, sessionRules } = req.body;

  db.accessPolicies = {
    passwordPolicy: passwordPolicy || db.accessPolicies.passwordPolicy,
    sessionRules: sessionRules || db.accessPolicies.sessionRules,
  };

  recordEvent(
    db,
    "System Admin",
    "RBAC",
    "Update Access Policies",
    "AccessPolicies",
    "Success",
  );
  writeDb(db);
  res.json(db.accessPolicies);
});

app.get("/api/rbac/audits", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.permissionAudits || []);
});

// --- EXECUTIVE REPORTS & ANALYTICS APIs (PHASE 5) ---
app.get("/api/admin/reports/dashboard", (req: Request, res: Response) => {
  const db = readDb();

  if (!db.users) db.users = [];
  if (!db.assets) db.assets = [];
  if (!db.bookings) db.bookings = [];
  if (!db.maintenance) db.maintenance = [];
  if (!db.audits) db.audits = [];
  if (!db.departments) db.departments = [];
  if (!db.categories) db.categories = [];

  // Dynamic calculations relative to live data
  const totalAssets = 1284 - 160 + db.assets.length;
  const assetUtilization = 91;
  const maintenanceCostVal = Math.max(
    12000,
    245000 - 5000 * db.maintenance.length,
  );
  const healthScore = 94;
  const employees = 328 - 9 + db.users.length;
  const bookings = 482 - 3 + db.bookings.length;
  const auditCompliance = 96;
  const overdueAssets = 9;

  // Donut chart status
  const donutData = [
    {
      label: "Available",
      value: Math.round(totalAssets * 0.41),
      color: "#4F46E5",
    },
    {
      label: "Allocated",
      value: Math.round(totalAssets * 0.49),
      color: "#10B981",
    },
    {
      label: "Reserved",
      value: Math.round(totalAssets * 0.04),
      color: "#3b82f6",
    },
    {
      label: "Maintenance",
      value: Math.round(totalAssets * 0.03),
      color: "#F59E0B",
    },
    { label: "Lost", value: Math.round(totalAssets * 0.02), color: "#EF4444" },
    {
      label: "Retired",
      value: Math.round(totalAssets * 0.01),
      color: "#6B7280",
    },
  ];

  // Horizontal bar departments assets
  const barData = db.departments.map((d: any) => ({
    label: d.name.replace(" Department", ""),
    value: Math.max(
      25,
      db.assets.filter((a: any) => a.departmentId === d.id).length * 15 + 40,
    ),
  }));

  // Line trends
  const trendData = [
    {
      label: "Jan",
      assets: 1100,
      employees: 300,
      bookings: 320,
      maintenance: 8,
    },
    {
      label: "Feb",
      assets: 1150,
      employees: 305,
      bookings: 350,
      maintenance: 10,
    },
    {
      label: "Mar",
      assets: 1200,
      employees: 310,
      bookings: 390,
      maintenance: 12,
    },
    {
      label: "Apr",
      assets: 1220,
      employees: 315,
      bookings: 410,
      maintenance: 11,
    },
    {
      label: "May",
      assets: 1250,
      employees: 322,
      bookings: 450,
      maintenance: 14,
    },
    {
      label: "Jun",
      assets: totalAssets,
      employees,
      bookings,
      maintenance: Math.max(12, db.maintenance.length),
    },
  ];

  // Lifecycle Funnel
  const funnelData = [
    { stage: "Purchased", count: totalAssets + 80 },
    { stage: "Registered", count: totalAssets },
    { stage: "Allocated", count: Math.round(totalAssets * 0.88) },
    { stage: "Transferred", count: Math.round(totalAssets * 0.12) },
    { stage: "Maintenance", count: Math.max(12, db.maintenance.length) },
    { stage: "Returned", count: Math.round(totalAssets * 0.08) },
    { stage: "Retired", count: 18 },
  ];

  // Category Distribution
  const categoryData = db.categories.map((c: any) => ({
    label: c.name,
    value: Math.max(
      15,
      db.assets.filter((a: any) => a.categoryId === c.id).length * 20 + 25,
    ),
  }));

  // Age analysis
  const ageData = [
    { label: "0-1 Year", value: Math.round(totalAssets * 0.35) },
    { label: "1-3 Years", value: Math.round(totalAssets * 0.45) },
    { label: "3-5 Years", value: Math.round(totalAssets * 0.15) },
    { label: "5+ Years", value: Math.round(totalAssets * 0.05) },
  ];

  // Top active used resources
  const topResources = [
    {
      name: "Conference Room A (Meeting Room)",
      usage: "135 hrs",
      department: "Operations",
    },
    { name: "Vehicle 02 (Company Car)", usage: "98 hrs", department: "IT" },
    { name: "Laptop Pool A (Electronics)", usage: "82 hrs", department: "HR" },
    {
      name: 'Macbook Pro 16" (Electronics)',
      usage: "74 hrs",
      department: "Finance",
    },
    {
      name: "Projector 4 (Printers)",
      usage: "45 hrs",
      department: "Marketing",
    },
  ];

  // Idle assets
  const idleAssets = [
    { name: "Dell Monitor (AF-0089)", idleDays: 45, department: "HR" },
    { name: "Epson Projector (AF-0112)", idleDays: 32, department: "Finance" },
    { name: "Conference Chair (AF-0250)", idleDays: 28, department: "IT" },
    {
      name: "iPad Air Test Device (AF-0019)",
      idleDays: 25,
      department: "Marketing",
    },
    {
      name: "Lenovo ThinkPad (AF-0004)",
      idleDays: 18,
      department: "Operations",
    },
  ];

  // Department health summary list
  const departmentAnalyticsList = db.departments.map((d: any) => {
    const deptEmps = db.users.filter(
      (u: any) => u.departmentId === d.id,
    ).length;
    const deptAssets = db.assets.filter(
      (a: any) => a.departmentId === d.id,
    ).length;
    const deptMaintenance = db.maintenance.filter(
      (m: any) =>
        m.status !== "resolved" &&
        db.assets.find(
          (a: any) => a.id === m.assetId && a.departmentId === d.id,
        ),
    ).length;
    const score = Math.max(70, 98 - deptMaintenance * 5);
    return {
      department: d.name,
      employees: Math.max(12, deptEmps * 7),
      assets: Math.max(20, deptAssets * 10),
      bookings: Math.max(5, deptEmps * 2),
      health:
        score >= 90
          ? "🟢 Excellent"
          : score >= 80
            ? "🟡 Attention"
            : "🔴 Critical",
      score,
    };
  });

  // Maintenance Leaderboard
  const maintenanceStats = {
    open:
      db.maintenance.filter((m: any) => m.status !== "resolved").length || 12,
    resolved:
      db.maintenance.filter((m: any) => m.status === "resolved").length || 186,
    highPriority:
      db.maintenance.filter(
        (m: any) => m.status !== "resolved" && m.priority === "High",
      ).length || 5,
    avgResolution: "2.6 Days",
  };

  // Resource Bookings summary
  const resourceStats = {
    total: bookings,
    completed: Math.round(bookings * 0.93),
    cancelled: Math.round(bookings * 0.04),
    upcoming: Math.round(bookings * 0.03),
  };

  // Audit compliance dashboard summaries
  const auditStats = {
    cycles: db.audits.length || 18,
    completed: db.audits.filter((a: any) => a.status === "closed").length || 16,
    open: db.audits.filter((a: any) => a.status === "active").length || 2,
    compliance: "96%",
  };

  // Financial values
  const financialStats = {
    totalValue: "₹2.8 Cr",
    maintenanceCost: `₹${(maintenanceCostVal / 100000).toFixed(2)} Lakh`,
    depreciation: "₹18 Lakh",
    replacementDue: 12,
  };

  // AI Suggestions
  const aiSuggestions = [
    {
      type: "Overbooked Resource",
      title: "Conference Room A",
      detail:
        "Usage frequency exceeds 85%. Recommended to establish Conference Room B to balance booking traffic.",
    },
    {
      type: "High Utilization Pool",
      title: "Laptop Pool",
      detail:
        "Current utilization at 95%. Recommended to purchase 5 additional standard developer workstations.",
    },
    {
      type: "High Repair Cycle",
      title: "Vehicle 02 (Company Car)",
      detail:
        "Maintenance checks have triggered 4 times in the past 60 days. Recommended to schedule preventive maintenance.",
    },
  ];

  res.json({
    kpis: {
      totalAssets,
      assetUtilization,
      maintenanceCost: `₹${(maintenanceCostVal / 100000).toFixed(2)} Lakh`,
      healthScore,
      employees,
      bookings,
      auditCompliance,
      overdueAssets,
    },
    analytics: {
      donutData,
      barData,
      trendData,
      funnelData,
      categoryData,
      ageData,
    },
    topResources,
    idleAssets,
    departmentAnalytics: departmentAnalyticsList,
    maintenanceStats,
    resourceStats,
    auditStats,
    financialStats,
    aiSuggestions,
  });
});

app.get("/api/admin/reports/export", (req: Request, res: Response) => {
  const db = readDb();
  const type = req.query.type || "assets";

  if (!db.exportLogs) db.exportLogs = [];
  db.exportLogs.push({
    id: `exp-${Date.now()}`,
    user: "Shashwat Admin",
    report: `${type.toString().charAt(0).toUpperCase() + type.toString().slice(1)} Analytics Data`,
    format: "CSV",
    time: new Date().toLocaleString(),
  });
  writeDb(db);

  let csv = "";
  if (type === "assets") {
    csv = "Asset ID,Name,Category,Department,Status,Purchase Date\n";
    (db.assets || []).forEach((a: any) => {
      csv += `"${a.id}","${a.name}","${a.categoryId}","${a.departmentId || ""}","${a.status}","${a.purchaseDate}"\n`;
    });
  } else if (type === "departments") {
    csv = "Department,Code,HOD Head,Budget,Status\n";
    (db.departments || []).forEach((d: any) => {
      csv += `"${d.name}","${d.code}","${d.headId || ""}","${d.budget}","${d.status}"\n`;
    });
  } else {
    csv = "Employee ID,Name,Role,Email,Status\n";
    (db.users || []).forEach((u: any) => {
      csv += `"${u.employeeId}","${u.name}","${u.role}","${u.email}","${u.status}"\n`;
    });
  }

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=report_${type}.csv`,
  );
  res.send(csv);
});

// --- AUDIT MANAGEMENT APIs (PHASE 6) ---
app.get("/api/admin/audits", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.audits || []);
});

app.post("/api/admin/audits", (req: Request, res: Response) => {
  try {
    const db = readDb();
    const {
      name,
      code,
      scope,
      startDate,
      endDate,
      deadline,
      priority,
      auditors,
    } = req.body;

    if (
      !name ||
      !code ||
      !scope ||
      !startDate ||
      !endDate ||
      !deadline ||
      !priority ||
      !auditors ||
      auditors.length === 0
    ) {
      res.status(400).json({
        error: "All fields, including at least one auditor, are required.",
      });
      return;
    }

    // Code must be unique
    const exists = (db.audits || []).some(
      (a: any) => a.code && a.code.toLowerCase() === code.toLowerCase(),
    );
    if (exists) {
      res.status(400).json({ error: `Audit code "${code}" already exists.` });
      return;
    }

    // End date cannot precede start date
    if (new Date(endDate) < new Date(startDate)) {
      res.status(400).json({ error: "End date cannot precede the start date." });
      return;
    }

    // Conflict of Interest check: Auditor cannot audit a department they directly manage
    if (scope.type === "Department" && scope.departmentId) {
      const dept = (db.departments || []).find(
        (d: any) => d.id === scope.departmentId,
      );
      if (dept && dept.headId) {
        const isManagerAuditing = auditors.includes(dept.headId);
        if (isManagerAuditing) {
          res.status(400).json({
            error:
              "Conflict of Interest: A department head cannot audit their own department.",
          });
          return;
        }
      }
    }

    // Workload validation: Max 2 active/running audits per auditor
    for (const audId of auditors) {
      const activeAuditsCount = (db.audits || []).filter(
        (a: any) => a.status === "running" && a.auditors && a.auditors.includes(audId),
      ).length;
      if (activeAuditsCount >= 2) {
        const userObj = (db.users || []).find((u: any) => u.id === audId);
        res.status(400).json({
          error: `Workload Limit: Auditor "${userObj?.name || audId}" is already assigned to 2 running audits.`,
        });
        return;
      }
    }

    const newAudit = {
      id: `AUD-${String((db.audits || []).length + 1).padStart(3, "0")}`,
      name,
      code,
      scope,
      startDate,
      endDate,
      deadline,
      priority,
      auditors,
      status: "scheduled",
      progress: 0,
      verifiedCount: 0,
      pendingCount: 50,
      missingCount: 0,
      damagedCount: 0,
      timeline: [`Created on ${new Date().toISOString().split("T")[0]}`],
      assets: [],
    };

    if (!db.audits) db.audits = [];
    db.audits.push(newAudit);
    recordEvent(
      db,
      "System Admin",
      "Audit",
      `Create Audit Cycle: ${name}`,
      newAudit.id,
      "Success",
    );
    writeDb(db);
    res.status(201).json(newAudit);
  } catch (err: any) {
    console.error("Error in POST /api/admin/audits:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.patch("/api/admin/audits/:id", (req: Request, res: Response) => {
  const db = readDb();
  const audits = db.audits || [];
  const audit = audits.find((a: any) => a.id === req.params.id);

  if (!audit) {
    res.status(404).json({ error: "Audit cycle not found." });
    return;
  }

  const { status, assetVerification } = req.body;

  // Handle individual asset verification inside the running audit
  if (assetVerification) {
    const { assetId, verificationStatus, notes, photo } = assetVerification;
    if (!audit.assets) audit.assets = [];

    // Check if already verified
    const existingIdx = audit.assets.findIndex(
      (av: any) => av.assetId === assetId,
    );
    const prevStatus =
      existingIdx >= 0 ? audit.assets[existingIdx].status : null;

    const verificationRecord = {
      assetId,
      status: verificationStatus,
      notes,
      photo,
    };
    if (existingIdx >= 0) {
      audit.assets[existingIdx] = verificationRecord;
    } else {
      audit.assets.push(verificationRecord);
    }

    // Update counts dynamically
    if (prevStatus === null) {
      audit.pendingCount = Math.max(0, audit.pendingCount - 1);
    } else {
      if (prevStatus === "verified")
        audit.verifiedCount = Math.max(0, audit.verifiedCount - 1);
      if (prevStatus === "missing")
        audit.missingCount = Math.max(0, audit.missingCount - 1);
      if (prevStatus === "damaged")
        audit.damagedCount = Math.max(0, audit.damagedCount - 1);
    }

    if (verificationStatus === "verified") audit.verifiedCount++;
    if (verificationStatus === "missing") {
      audit.missingCount++;
      // Log discrepancy
      if (!db.discrepancies) db.discrepancies = [];
      db.discrepancies.push({
        id: `disc-${Date.now()}`,
        auditId: audit.id,
        assetId,
        issue: "Missing Asset",
        departmentId: audit.scope.departmentId || "IT",
        severity: "Critical",
        status: "open",
      });
    }
    if (verificationStatus === "damaged") {
      audit.damagedCount++;
      // Log discrepancy
      if (!db.discrepancies) db.discrepancies = [];
      db.discrepancies.push({
        id: `disc-${Date.now()}`,
        auditId: audit.id,
        assetId,
        issue: "Damaged Asset",
        departmentId: audit.scope.departmentId || "IT",
        severity: "High",
        status: "open",
      });
    }

    const totalVerified =
      audit.verifiedCount + audit.missingCount + audit.damagedCount;
    audit.progress = Math.round(
      (totalVerified / (totalVerified + audit.pendingCount)) * 100,
    );

    audit.timeline.push(
      `Verified asset ${assetId} as ${verificationStatus} on ${new Date().toISOString().split("T")[0]}`,
    );
  }

  // Handle status transitions
  if (status) {
    if (status === "closed") {
      // Closing constraint: Cannot close if pending verifications remain
      if (audit.pendingCount > 0) {
        res.status(400).json({
          error:
            "Closing Denied: Cannot close cycle with pending asset verifications.",
        });
        return;
      }
      // Closing constraint: Cannot close if open critical discrepancies exist
      const openCriticalDiscrepancies = (db.discrepancies || []).some(
        (d: any) =>
          d.auditId === audit.id &&
          d.severity === "Critical" &&
          d.status === "open",
      );
      if (openCriticalDiscrepancies) {
        res.status(400).json({
          error:
            "Closing Denied: Unresolved critical discrepancies exist for this audit.",
        });
        return;
      }
    }
    audit.status = status;
    audit.timeline.push(
      `Status changed to ${status} on ${new Date().toISOString().split("T")[0]}`,
    );
  }

  recordEvent(
    db,
    "System Admin",
    "Audit",
    `Update Audit Status: ${audit.name}`,
    audit.id,
    "Success",
  );
  writeDb(db);
  res.json(audit);
});

app.get("/api/admin/discrepancies", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.discrepancies || []);
});

app.patch("/api/admin/discrepancies/:id", (req: Request, res: Response) => {
  const db = readDb();
  const discrepancies = db.discrepancies || [];
  const disc = discrepancies.find((d: any) => d.id === req.params.id);

  if (!disc) {
    res.status(404).json({ error: "Discrepancy not found." });
    return;
  }

  const { status, severity } = req.body;
  if (status) disc.status = status;
  if (severity) disc.severity = severity;

  recordEvent(
    db,
    "System Admin",
    "Audit",
    `Update Discrepancy: ${disc.assetId}`,
    disc.id,
    "Success",
  );
  writeDb(db);
  res.json(disc);
});

// --- COMMUNICATION APIs (PHASE 7) ---
app.get("/api/admin/announcements", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.announcements || []);
});

app.post("/api/admin/announcements", (req: Request, res: Response) => {
  const db = readDb();
  const { title, description, audience, priority, expiryDate, type } = req.body;

  if (
    !title ||
    !description ||
    !audience ||
    !priority ||
    !expiryDate ||
    !type
  ) {
    res.status(400).json({
      error:
        "Title, description, audience, priority, expiry date, and type are required.",
    });
    return;
  }

  // Expiry must be after publish date
  if (new Date(expiryDate) < new Date()) {
    res.status(400).json({ error: "Expiry date must be set in the future." });
    return;
  }

  const newAnn = {
    id: `ann-${Date.now()}`,
    title,
    description,
    audience,
    priority,
    expiryDate,
    type,
    date: new Date().toISOString().split("T")[0],
  };

  if (!db.announcements) db.announcements = [];
  db.announcements.push(newAnn);

  // Send system-wide in-app notifications
  if (!db.notifications) db.notifications = [];
  db.notifications.push({
    id: `notif-${Date.now()}`,
    priority,
    title: `Announcement: ${title}`,
    message: description,
    recipient: "all",
    time: "Just Now",
    status: "unread",
    category: "Organization",
    relatedModule: "Notifications",
    relatedAsset: "",
  });

  recordEvent(
    db,
    "System Admin",
    "Communication",
    `Broadcast Announcement: ${title}`,
    newAnn.id,
    "Success",
  );
  writeDb(db);
  res.status(201).json(newAnn);
});

app.delete("/api/admin/announcements/:id", (req: Request, res: Response) => {
  const db = readDb();
  const initialLength = (db.announcements || []).length;
  db.announcements = (db.announcements || []).filter(
    (a: any) => a.id !== req.params.id,
  );

  if ((db.announcements || []).length === initialLength) {
    res.status(404).json({ error: "Announcement not found." });
    return;
  }

  recordEvent(
    db,
    "System Admin",
    "Communication",
    "Delete Announcement",
    req.params.id,
    "Success",
  );
  writeDb(db);
  res.json({ success: true });
});

app.get("/api/admin/scheduled-notifications", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.scheduledNotifications || []);
});

app.post(
  "/api/admin/scheduled-notifications",
  (req: Request, res: Response) => {
    const db = readDb();
    const { message, audience, date, time, repeat, priority } = req.body;

    if (!message || !audience || !date || !time || !repeat || !priority) {
      res.status(400).json({
        error:
          "Message, audience, date, time, repeat, and priority are required.",
      });
      return;
    }

    // Date cannot be in the past
    if (new Date(date) < new Date(new Date().toISOString().split("T")[0])) {
      res.status(400).json({ error: "Scheduled date cannot be in the past." });
      return;
    }

    const newSch = {
      id: `sch-${Date.now()}`,
      message,
      audience,
      date,
      time,
      repeat,
      priority,
    };

    if (!db.scheduledNotifications) db.scheduledNotifications = [];
    db.scheduledNotifications.push(newSch);
    recordEvent(
      db,
      "System Admin",
      "Communication",
      `Schedule Reminder: ${message}`,
      newSch.id,
      "Success",
    );
    writeDb(db);
    res.status(201).json(newSch);
  },
);

app.delete(
  "/api/admin/scheduled-notifications/:id",
  (req: Request, res: Response) => {
    const db = readDb();
    const initialLength = (db.scheduledNotifications || []).length;
    db.scheduledNotifications = (db.scheduledNotifications || []).filter(
      (s: any) => s.id !== req.params.id,
    );

    if ((db.scheduledNotifications || []).length === initialLength) {
      res.status(404).json({ error: "Scheduled reminder not found." });
      return;
    }

    recordEvent(
      db,
      "System Admin",
      "Communication",
      "Delete Scheduled Reminder",
      req.params.id,
      "Success",
    );
    writeDb(db);
    res.json({ success: true });
  },
);

app.get("/api/admin/notification-templates", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.notificationTemplates || []);
});

app.post("/api/admin/notification-templates", (req: Request, res: Response) => {
  const db = readDb();
  const { title, subject, message, variables } = req.body;

  if (!title || !subject || !message || !variables) {
    res.status(400).json({
      error: "Template title, subject, message, and variables are required.",
    });
    return;
  }

  // Duplicate template names not allowed
  const exists = (db.notificationTemplates || []).some(
    (t: any) => t.title.toLowerCase() === title.toLowerCase(),
  );
  if (exists) {
    res.status(400).json({ error: `Template "${title}" already exists.` });
    return;
  }

  const newTemp = {
    id: `temp-${Date.now()}`,
    title,
    subject,
    message,
    variables,
  };

  if (!db.notificationTemplates) db.notificationTemplates = [];
  db.notificationTemplates.push(newTemp);
  recordEvent(
    db,
    "System Admin",
    "Communication",
    `Create Template: ${title}`,
    newTemp.id,
    "Success",
  );
  writeDb(db);
  res.status(201).json(newTemp);
});

app.get("/api/admin/notifications", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.notifications || []);
});

app.patch("/api/admin/notifications/:id", (req: Request, res: Response) => {
  const db = readDb();
  const notifications = db.notifications || [];
  const notif = notifications.find((n: any) => n.id === req.params.id);

  if (!notif) {
    res.status(404).json({ error: "Notification not found." });
    return;
  }

  const { status } = req.body;
  if (status) notif.status = status;

  writeDb(db);
  res.json(notif);
});

app.delete("/api/admin/notifications/:id", (req: Request, res: Response) => {
  const db = readDb();
  const initialLength = (db.notifications || []).length;
  db.notifications = (db.notifications || []).filter(
    (n: any) => n.id !== req.params.id,
  );

  if ((db.notifications || []).length === initialLength) {
    res.status(404).json({ error: "Notification not found." });
    return;
  }

  writeDb(db);
  res.json({ success: true });
});

// --- SYSTEM MONITORING LOG ENDPOINTS (PHASE 8) ---
app.get("/api/admin/security-logs", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.securityLogs || []);
});

app.get("/api/admin/system-logs", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.systemLogs || []);
});

app.get("/api/admin/login-history", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.loginHistory || []);
});

app.get("/api/admin/export-logs", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.exportLogs || []);
});

// --- SYSTEM SETTINGS CONFIGURATION APIs (PHASE 9) ---
app.get("/api/admin/settings", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.systemSettings || {});
});

app.post("/api/admin/settings", (req: Request, res: Response) => {
  const db = readDb();
  const nextSettings = req.body;

  // Log configuration history for modified settings (Phase 9 requirement)
  if (!db.configurationHistory) db.configurationHistory = [];
  const timestamp = new Date().toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });

  if (
    nextSettings.general &&
    JSON.stringify(nextSettings.general) !==
      JSON.stringify(db.systemSettings?.general)
  ) {
    db.configurationHistory.push({
      id: `cfg-${Date.now()}-gen`,
      timestamp,
      setting: "Branding & Preferences",
      changedBy: "Shashwat Admin",
      from: db.systemSettings?.general?.orgName || "Original",
      to: nextSettings.general?.orgName || "Updated",
    });
  }
  if (
    nextSettings.bookingRules &&
    JSON.stringify(nextSettings.bookingRules) !==
      JSON.stringify(db.systemSettings?.bookingRules)
  ) {
    db.configurationHistory.push({
      id: `cfg-${Date.now()}-book`,
      timestamp,
      setting: "Booking Duration Limits",
      changedBy: "Shashwat Admin",
      from: `${db.systemSettings?.bookingRules?.maxBookingHours || 8} Hrs`,
      to: `${nextSettings.bookingRules?.maxBookingHours || 8} Hrs`,
    });
  }

  db.systemSettings = nextSettings;
  recordEvent(
    db,
    "System Admin",
    "Settings",
    "Update ERP Configurations",
    "SystemSettings",
    "Success",
  );
  writeDb(db);
  res.json(db.systemSettings);
});

app.get("/api/admin/settings/history", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.configurationHistory || []);
});

app.delete("/api/admin/sessions/:id", (req: Request, res: Response) => {
  const db = readDb();
  const sessions = db.loginHistory || [];
  const sIdx = sessions.findIndex((s: any) => s.id === req.params.id);

  if (sIdx >= 0) {
    // Revoke session (mark logout as inactive / force logout)
    sessions[sIdx].logout = new Date().toLocaleString();
    sessions[sIdx].status = "Force Logout";
    recordEvent(
      db,
      "System Admin",
      "Security",
      `Revoke Session: ${sessions[sIdx].user}`,
      req.params.id,
      "Success",
    );
    writeDb(db);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Session not found." });
  }
});

// --- FEEDBACK CENTER (PHASE 10) ---
app.post("/api/admin/feedback", (req: Request, res: Response) => {
  const db = readDb();
  const { category, subject, description, priority } = req.body;

  if (!category || !subject || !description || !priority) {
    res.status(400).json({ error: "All feedback fields are required." });
    return;
  }

  const newFeedback = {
    id: `fb-${Date.now()}`,
    category,
    subject,
    description,
    priority,
    date: new Date().toISOString().split("T")[0],
    status: "Open",
  };

  if (!db.feedback) db.feedback = [];
  db.feedback.push(newFeedback);
  recordEvent(
    db,
    "System Admin",
    "Help & Feedback",
    `Submitted feedback: ${subject}`,
    newFeedback.id,
    "Success",
  );
  writeDb(db);
  res.status(201).json(newFeedback);
});

// POST /api/demo/reset - Wipes and re-seeds database

// POST /api/demo/reset - Wipes and re-seeds database
app.post("/api/demo/reset", (req: Request, res: Response) => {
  try {
    if (fs.existsSync(DB_PATH)) {
      fs.unlinkSync(DB_PATH);
    }
    initializeDatabase();
    res.json({
      success: true,
      message: "Database reset successfully to original seed state.",
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to reset database: " + err.message });
  }
});

// --- EMPLOYEE PORTAL APIs (PHASE 1) ---

app.post("/api/employee/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (
    !email ||
    !password ||
    !String(email).trim() ||
    !String(password).trim()
  ) {
    res.status(400).json({
      success: false,
      error: "Email/Employee ID and password are required.",
    });
    return;
  }

  const identifier = String(email).trim().toLowerCase();
  const cleanPassword = String(password).trim();

  const db = readDb();
  const user = (db.users || []).find((u: any) => {
    const emailMatch = u.email && u.email.toLowerCase() === identifier;
    const empIdMatch =
      u.employeeId && u.employeeId.toLowerCase() === identifier;
    return (emailMatch || empIdMatch) && u.password === cleanPassword;
  });

  if (!user) {
    res.status(401).json({ success: false, error: "Invalid credentials" });
    return;
  }

  if (user.status === "disabled") {
    res
      .status(403)
      .json({ success: false, error: "Account has been disabled" });
    return;
  }

  // Update lastLogin
  user.lastLogin = new Date().toISOString();
  writeDb(db);

  res.json({
    success: true,
    token: "mock-jwt-employee-token",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      departmentId: user.departmentId,
      designation: user.designation,
      reportingManager: user.reportingManager,
      officeLocation: user.officeLocation,
    },
  });
});

app.post("/api/employee/logout", (req: Request, res: Response) => {
  res.json({ success: true, message: "Logged out successfully." });
});

app.post("/api/employee/refresh-token", (req: Request, res: Response) => {
  res.json({ success: true, token: "mock-jwt-employee-refreshed-token" });
});

app.get("/api/employee/dashboard/stats", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const assets = db.assets || [];
  const bookings = db.bookings || [];
  const maintenance = db.maintenance || [];

  // Filter assets assigned to employee: match by holder name or employeeId
  const userAssets = assets.filter((a: any) => {
    if (a.status !== "allocated") return false;

    const holderClean = String(a.holder || "")
      .trim()
      .toLowerCase();
    const userNameClean = String(user.name || "")
      .trim()
      .toLowerCase();
    const userFirstNameClean = String(user.name || "")
      .split(" ")[0]
      .toLowerCase();
    const userIdClean = String(user.id || "")
      .trim()
      .toLowerCase();
    const userEmpIdClean = String(user.employeeId || "")
      .trim()
      .toLowerCase();

    return (
      holderClean === userNameClean ||
      holderClean === userFirstNameClean ||
      holderClean === userIdClean ||
      holderClean === userEmpIdClean ||
      a.allocatedEmployeeId === user.id ||
      a.allocatedEmployeeId === user.employeeId
    );
  });

  // Filter bookings for user
  const userBookings = bookings.filter(
    (b: any) =>
      b.employeeId === user.name ||
      b.employeeId === user.firstName ||
      b.employeeId === user.id ||
      b.employeeId === user.employeeId,
  );

  // Filter maintenance requests
  const userRequests = maintenance.filter(
    (m: any) =>
      m.employeeId === user.name ||
      m.employeeId === user.firstName ||
      m.employeeId === user.id ||
      m.employeeId === user.employeeId,
  );

  // Upcoming returns (returns in next 7 days, or returnDate is set)
  const upcomingReturns = userAssets.filter((a: any) => a.returnDate);

  res.json({
    assignedAssets: userAssets.length,
    pendingRequests: userRequests.filter(
      (r: any) =>
        r.status === "pending" ||
        r.status === "approved" ||
        r.status === "in_progress",
    ).length,
    todayBookings: userBookings.length,
    upcomingReturns: upcomingReturns.length,
  });
});

app.get(
  "/api/employee/dashboard/assets-preview",
  (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const db = readDb();
    const user = (db.users || []).find((u: any) => u.id === userId);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const assets = db.assets || [];
    const userAssets = assets.filter((a: any) => {
      if (a.status !== "allocated") return false;

      const holderClean = String(a.holder || "")
        .trim()
        .toLowerCase();
      const userNameClean = String(user.name || "")
        .trim()
        .toLowerCase();
      const userFirstNameClean = String(user.name || "")
        .split(" ")[0]
        .toLowerCase();
      const userIdClean = String(user.id || "")
        .trim()
        .toLowerCase();
      const userEmpIdClean = String(user.employeeId || "")
        .trim()
        .toLowerCase();

      return (
        holderClean === userNameClean ||
        holderClean === userFirstNameClean ||
        holderClean === userIdClean ||
        holderClean === userEmpIdClean ||
        a.allocatedEmployeeId === user.id ||
        a.allocatedEmployeeId === user.employeeId
      );
    });

    // Return top 3 assigned assets
    res.json(userAssets.slice(0, 3));
  },
);

app.get(
  "/api/employee/dashboard/notifications",
  (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const db = readDb();
    const user = (db.users || []).find((u: any) => u.id === userId);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const notifications = db.notifications || [];
    let userNotifs = notifications.filter(
      (n: any) =>
        n.employeeId === user.id ||
        n.employeeId === user.name ||
        n.employeeId === "all" ||
        n.employeeId === user.employeeId,
    );

    if (userNotifs.length === 0) {
      // Generate some friendly starting notifications for the demo if none exist
      userNotifs = [
        {
          id: "n-1",
          employeeId: user.id,
          title: "Laptop Assigned",
          message: "Macbook Pro has been successfully allocated to you.",
          status: "unread",
          date: new Date().toISOString(),
        },
        {
          id: "n-2",
          employeeId: user.id,
          title: "Maintenance Approved",
          message:
            "Your maintenance request for HP LaserJet has been approved.",
          status: "unread",
          date: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: "n-3",
          employeeId: user.id,
          title: "Booking Confirmed",
          message:
            "Meeting Room A reservation for today at 10:00 AM is confirmed.",
          status: "read",
          date: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          id: "n-4",
          employeeId: user.id,
          title: "Return Reminder",
          message: "HP LaserJet return date is approaching in 3 days.",
          status: "read",
          date: new Date(Date.now() - 3600000 * 48).toISOString(),
        },
        {
          id: "n-5",
          employeeId: user.id,
          title: "Department Notice",
          message:
            "IT security compliance audit is scheduled for next Tuesday.",
          status: "read",
          date: new Date(Date.now() - 3600000 * 72).toISOString(),
        },
      ];
    }

    res.json(userNotifs.slice(0, 5));
  },
);

app.get("/api/employee/dashboard/activity", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const activityLogs = db.activityLogs || [];
  let userLogs = activityLogs.filter(
    (log: any) =>
      log.employeeId === user.id ||
      log.userId === user.id ||
      log.operator === user.name ||
      log.employeeId === user.employeeId,
  );

  if (userLogs.length === 0) {
    userLogs = [
      {
        id: "act-1",
        action: "Maintenance Request Submitted",
        module: "Maintenance",
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: "act-2",
        action: "Laptop Allocated",
        module: "Allocation",
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
      {
        id: "act-3",
        action: "Meeting Room Booked",
        module: "Bookings",
        timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
      },
    ];
  }

  res.json(userLogs.slice(0, 5));
});

// --- EMPLOYEE MY ASSETS ROUTER (PHASE 2) ---

function checkIsOwner(asset: any, user: any): boolean {
  if (!asset || !user) return false;
  if (asset.status !== "allocated") return false;

  const holderClean = String(asset.holder || "")
    .trim()
    .toLowerCase();
  const userNameClean = String(user.name || "")
    .trim()
    .toLowerCase();
  const userFirstNameClean = String(user.name || "")
    .split(" ")[0]
    .toLowerCase();
  const userIdClean = String(user.id || "")
    .trim()
    .toLowerCase();
  const userEmpIdClean = String(user.employeeId || "")
    .trim()
    .toLowerCase();

  return (
    holderClean === userNameClean ||
    holderClean === userFirstNameClean ||
    holderClean === userIdClean ||
    holderClean === userEmpIdClean ||
    asset.allocatedEmployeeId === user.id ||
    asset.allocatedEmployeeId === user.employeeId
  );
}

app.get("/api/employee/assets", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const assets = db.assets || [];

  // Filter only assets allocated to this employee
  let userAssets = assets.filter((a: any) => checkIsOwner(a, user));

  // Search filter
  const q = ((req.query.search as string) || "").trim().toLowerCase();
  if (q) {
    userAssets = userAssets.filter(
      (a: any) =>
        a.name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        (a.serialNumber && a.serialNumber.toLowerCase().includes(q)) ||
        (a.categoryId && a.categoryId.toLowerCase().includes(q)),
    );
  }

  // Dropdown Category Filter
  const category = (req.query.category as string) || "All";
  if (category !== "All") {
    userAssets = userAssets.filter((a: any) => a.categoryId === category);
  }

  // Dropdown Location Filter
  const location = (req.query.location as string) || "All";
  if (location !== "All") {
    userAssets = userAssets.filter((a: any) => a.location === location);
  }

  // Dropdown Status Filter (Employee context filters their allocated assets)
  const status = (req.query.status as string) || "All";
  if (status !== "All") {
    userAssets = userAssets.filter((a: any) => a.status === status);
  }

  // Sorting
  const sort = (req.query.sort as string) || "newest";
  if (sort === "newest") {
    userAssets.sort(
      (a: any, b: any) =>
        new Date(b.purchaseDate || 0).getTime() -
        new Date(a.purchaseDate || 0).getTime(),
    );
  } else if (sort === "oldest") {
    userAssets.sort(
      (a: any, b: any) =>
        new Date(a.purchaseDate || 0).getTime() -
        new Date(b.purchaseDate || 0).getTime(),
    );
  } else if (sort === "returnDate") {
    userAssets.sort(
      (a: any, b: any) =>
        new Date(a.returnDate || "9999-12-31").getTime() -
        new Date(b.returnDate || "9999-12-31").getTime(),
    );
  } else if (sort === "category") {
    userAssets.sort((a: any, b: any) =>
      (a.categoryId || "").localeCompare(b.categoryId || ""),
    );
  }

  // Pagination
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = parseInt((req.query.limit as string) || "6", 10);
  const total = userAssets.length;
  const start = (page - 1) * limit;
  const paginated = userAssets.slice(start, start + limit);

  res.json({
    assets: paginated,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
});

app.get("/api/employee/assets/:id", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const asset = (db.assets || []).find((a: any) => a.id === req.params.id);
  if (!asset) {
    res.status(404).json({ error: "Asset not found." });
    return;
  }

  // Ensure permission: only view their own allocated asset
  if (!checkIsOwner(asset, user)) {
    res
      .status(403)
      .json({ error: "Access denied. This asset is not assigned to you." });
    return;
  }

  res.json(asset);
});

app.get("/api/employee/assets/history/:id", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const asset = (db.assets || []).find((a: any) => a.id === req.params.id);
  if (!asset) {
    res.status(404).json({ error: "Asset not found." });
    return;
  }

  if (!checkIsOwner(asset, user)) {
    res.status(403).json({ error: "Access denied." });
    return;
  }

  // Return asset history, fallback to generic timeline if empty
  const history = asset.history || [
    {
      id: `h-${asset.id}-1`,
      type: "Allocation",
      date: asset.purchaseDate || "2025-01-01",
      message: `Allocated to ${user.name} by Shashwat Admin.`,
    },
    {
      id: `h-${asset.id}-2`,
      type: "Audit",
      date: "2025-06-12",
      message: "Asset status verified during IT compliance audit.",
    },
  ];

  res.json(history);
});

app.get("/api/employee/assets/documents/:id", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const asset = (db.assets || []).find((a: any) => a.id === req.params.id);
  if (!asset) {
    res.status(404).json({ error: "Asset not found." });
    return;
  }

  if (!checkIsOwner(asset, user)) {
    res.status(403).json({ error: "Access denied." });
    return;
  }

  // Dynamic document attachments
  const documents = [
    {
      id: "doc-" + asset.id + "-inv",
      name: "Purchase Invoice.pdf",
      type: "PDF",
      size: "240 KB",
      url: "#",
    },
    {
      id: "doc-" + asset.id + "-war",
      name: "Warranty Registration Card.pdf",
      type: "PDF",
      size: "1.2 MB",
      url: "#",
    },
    {
      id: "doc-" + asset.id + "-man",
      name: (asset.categoryId || "Asset") + " User Manual.pdf",
      type: "PDF",
      size: "4.8 MB",
      url: "#",
    },
  ];

  res.json(documents);
});

app.get("/api/employee/assets/warranty/:id", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const asset = (db.assets || []).find((a: any) => a.id === req.params.id);
  if (!asset) {
    res.status(404).json({ error: "Asset not found." });
    return;
  }

  if (!checkIsOwner(asset, user)) {
    res.status(403).json({ error: "Access denied." });
    return;
  }

  // Dynamic warranty calculation (e.g. 3 years from purchaseDate)
  const purchase = asset.purchaseDate
    ? new Date(asset.purchaseDate)
    : new Date("2025-01-01");
  const expiry = new Date(purchase.getTime());
  expiry.setFullYear(purchase.getFullYear() + 3);

  const now = new Date();
  const remainingTime = expiry.getTime() - now.getTime();
  const remainingDays = Math.max(
    0,
    Math.ceil(remainingTime / (1000 * 3600 * 24)),
  );

  res.json({
    status: remainingDays > 0 ? "Active" : "Expired",
    startDate: purchase.toISOString().split("T")[0],
    endDate: expiry.toISOString().split("T")[0],
    remainingDays,
    vendor: "Dell Enterprise Services",
  });
});

app.get("/api/employee/assets/location/:id", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const asset = (db.assets || []).find((a: any) => a.id === req.params.id);
  if (!asset) {
    res.status(404).json({ error: "Asset not found." });
    return;
  }

  if (!checkIsOwner(asset, user)) {
    res.status(403).json({ error: "Access denied." });
    return;
  }

  res.json({
    building: "Building A",
    floor: asset.location || "Floor 2",
    room: "Room 204",
    desk: "Workspace Desk-" + Math.floor(10 + Math.random() * 89),
  });
});

app.get("/api/employee/assets/:id/qr", (req: Request, res: Response) => {
  res.json({
    code: req.params.id,
    type: "QR_CODE",
    value: "https://assetflow.com/assets/" + req.params.id,
  });
});

app.get("/api/employee/assets/:id/barcode", (req: Request, res: Response) => {
  res.json({
    code: req.params.id,
    type: "CODE_128",
    value: "AF-" + req.params.id,
  });
});

// --- EMPLOYEE MAINTENANCE REQUESTS APIs (PHASE 3) ---

app.post("/api/employee/maintenance", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const { assetId, issueCategory, priority, description, attachments } =
    req.body;
  if (!assetId || !issueCategory || !priority || !description) {
    res.status(400).json({ error: "All request fields are required." });
    return;
  }

  const asset = (db.assets || []).find((a: any) => a.id === assetId);
  if (!asset) {
    res.status(404).json({ error: "Asset not found." });
    return;
  }

  // Verify ownership
  if (!checkIsOwner(asset, user)) {
    res.status(403).json({
      error: "Cannot raise maintenance for an asset not assigned to you.",
    });
    return;
  }

  const newRequest = {
    id: "MR-" + String((db.maintenance || []).length + 101),
    assetId,
    employeeId: user.name,
    priority,
    date: new Date().toISOString().split("T")[0],
    status: "pending",
    problemDescription: description,
    issueCategory,
    attachments: attachments || [],
  };

  db.maintenance = [newRequest, ...(db.maintenance || [])];

  if (!asset.history) asset.history = [];
  asset.history.push({
    id: "h-mnt-" + Date.now(),
    type: "Maintenance",
    date: new Date().toISOString(),
    message:
      "Maintenance raised by employee: " + description + " (" + priority + ")",
  });

  recordEvent(
    db,
    user.name,
    "Maintenance",
    "Raise Repair Ticket",
    assetId,
    "Success",
    "Repair requested: " + description,
    "maintenance",
  );

  writeDb(db);
  res.status(201).json(newRequest);
});

app.get("/api/employee/maintenance", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const list = db.maintenance || [];
  // Active means status is NOT resolved and NOT rejected
  const activeRequests = list.filter(
    (m: any) =>
      (m.employeeId === user.name ||
        m.employeeId === user.firstName ||
        m.employeeId === user.id) &&
      m.status !== "resolved" &&
      m.status !== "rejected",
  );

  res.json(activeRequests);
});

app.get("/api/employee/maintenance/history", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const list = db.maintenance || [];
  const closedRequests = list.filter(
    (m: any) =>
      (m.employeeId === user.name ||
        m.employeeId === user.firstName ||
        m.employeeId === user.id) &&
      (m.status === "resolved" || m.status === "rejected"),
  );

  res.json(closedRequests);
});

app.get("/api/employee/maintenance/:id", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const mnt = (db.maintenance || []).find((m: any) => m.id === req.params.id);
  if (!mnt) {
    res.status(404).json({ error: "Request not found." });
    return;
  }

  const isOwner =
    mnt.employeeId === user.name ||
    mnt.employeeId === user.firstName ||
    mnt.employeeId === user.id;
  if (!isOwner) {
    res.status(403).json({ error: "Access denied." });
    return;
  }

  // Populate technician details if assigned
  let technician = null;
  if (mnt.technicianId) {
    const tech = (db.technicians || []).find(
      (t: any) => t.id === mnt.technicianId,
    );
    if (tech) {
      technician = {
        name: tech.name,
        type: tech.type,
        contact: "98765" + String(10000 + Math.floor(Math.random() * 89999)),
        assignedDate: mnt.date,
      };
    }
  }

  // Build progress timeline steps based on status
  const timeline = [
    {
      status: "submitted",
      label: "Request Submitted",
      done: true,
      date: mnt.date,
    },
    {
      status: "approved",
      label: "Asset Manager Approved",
      done: mnt.status !== "pending" && mnt.status !== "rejected",
      date: mnt.date,
    },
    {
      status: "assigned",
      label: "Technician Assigned",
      done:
        mnt.status === "assigned" ||
        mnt.status === "in_progress" ||
        mnt.status === "resolved",
      date: mnt.date,
    },
    {
      status: "in_progress",
      label: "Repair In Progress",
      done: mnt.status === "in_progress" || mnt.status === "resolved",
      date: mnt.date,
    },
    {
      status: "resolved",
      label: "Resolved",
      done: mnt.status === "resolved",
      date: mnt.date,
    },
  ];

  res.json({
    request: mnt,
    technician,
    timeline,
  });
});

app.post("/api/employee/maintenance/upload", (req: Request, res: Response) => {
  const { fileName } = req.body;
  res.json({
    fileName: fileName || "attachment.png",
    fileUrl: "/attachments/mock_" + Date.now() + ".png",
    type: "Image",
  });
});

// --- EMPLOYEE RETURN & TRANSFER REQUESTS APIs (PHASE 4) ---

app.post("/api/employee/returns", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const { assetId, reason, condition, comments } = req.body;
  if (!assetId || !reason || !condition) {
    res.status(400).json({ error: "Required fields missing." });
    return;
  }

  const asset = (db.assets || []).find((a: any) => a.id === assetId);
  if (!asset) {
    res.status(404).json({ error: "Asset not found." });
    return;
  }

  if (!checkIsOwner(asset, user)) {
    res
      .status(403)
      .json({ error: "Cannot return an asset not assigned to you." });
    return;
  }

  const newReturn = {
    id: "ret-" + Date.now(),
    assetId,
    employeeId: user.name,
    reason,
    reportedCondition: condition,
    comments: comments || "",
    status: "pending",
    date: new Date().toISOString(),
  };

  db.returns = [newReturn, ...(db.returns || [])];

  if (!asset.history) asset.history = [];
  asset.history.push({
    id: "h-ret-" + Date.now(),
    type: "Allocation",
    date: new Date().toISOString(),
    message: "Return request submitted by employee. Reason: " + reason,
  });

  // Register in pendingApprovals for manager review
  db.pendingApprovals = [
    {
      type: "Return",
      asset: assetId,
      employee: user.name,
      status: "Waiting Verification",
      requestId: newReturn.id,
    },
    ...(db.pendingApprovals || []),
  ];

  recordEvent(
    db,
    user.name,
    "Return",
    "Request Return",
    assetId,
    "Success",
    "Return requested: " + reason,
    "return",
  );

  writeDb(db);
  res.status(201).json(newReturn);
});

app.get("/api/employee/returns", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const list = db.returns || [];
  const userReturns = list.filter(
    (r: any) =>
      (r.employeeId === user.name ||
        r.employeeId === user.firstName ||
        r.employeeId === user.id) &&
      r.status === "pending",
  );

  res.json(userReturns);
});

app.get("/api/employee/returns/:id", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const ret = (db.returns || []).find((r: any) => r.id === req.params.id);
  if (!ret) {
    res.status(404).json({ error: "Return request not found." });
    return;
  }

  const isOwner =
    ret.employeeId === user.name ||
    ret.employeeId === user.firstName ||
    ret.employeeId === user.id;
  if (!isOwner) {
    res.status(403).json({ error: "Access denied." });
    return;
  }

  res.json(ret);
});

app.delete("/api/employee/returns/:id", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const index = (db.returns || []).findIndex(
    (r: any) => r.id === req.params.id && r.status === "pending",
  );
  if (index === -1) {
    res.status(404).json({
      error: "Pending return request not found or already processed.",
    });
    return;
  }

  const ret = db.returns[index];
  const isOwner =
    ret.employeeId === user.name ||
    ret.employeeId === user.firstName ||
    ret.employeeId === user.id;
  if (!isOwner) {
    res.status(403).json({ error: "Access denied." });
    return;
  }

  // Remove return request
  db.returns.splice(index, 1);

  // Remove from pendingApprovals
  db.pendingApprovals = (db.pendingApprovals || []).filter(
    (p: any) => !(p.type === "Return" && p.requestId === req.params.id),
  );

  writeDb(db);
  res.json({ success: true, message: "Return request canceled successfully." });
});

app.post("/api/employee/transfers", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const {
    assetId,
    targetType,
    targetEmployeeId,
    targetDepartmentId,
    reason,
    comments,
  } = req.body;
  if (!assetId || !targetType || !reason) {
    res.status(400).json({ error: "Required fields missing." });
    return;
  }

  const asset = (db.assets || []).find((a: any) => a.id === assetId);
  if (!asset) {
    res.status(404).json({ error: "Asset not found." });
    return;
  }

  if (!checkIsOwner(asset, user)) {
    res
      .status(403)
      .json({ error: "Cannot transfer an asset not assigned to you." });
    return;
  }

  const targetName =
    targetType === "employee" ? targetEmployeeId : targetDepartmentId;

  const newTrf = {
    id: "trf-" + Date.now(),
    assetId,
    fromEmployeeId: user.name,
    toEmployeeId: targetName,
    reason,
    comments: comments || "",
    status: "requested",
    targetType,
    date: new Date().toISOString(),
  };

  db.transfers = [newTrf, ...(db.transfers || [])];

  if (!asset.history) asset.history = [];
  asset.history.push({
    id: "h-trf-" + Date.now(),
    type: "Transfer",
    date: new Date().toISOString(),
    message:
      "Transfer requested by employee to " + targetName + ". Reason: " + reason,
  });

  // Register in pendingApprovals for manager review
  db.pendingApprovals = [
    {
      type: "Transfer",
      asset: assetId,
      employee: user.name,
      status: "Pending",
      requestId: newTrf.id,
    },
    ...(db.pendingApprovals || []),
  ];

  recordEvent(
    db,
    user.name,
    "Allocation",
    "Request Transfer",
    assetId,
    "Success",
    "Transfer requested to " + targetName,
    "allocation",
  );

  writeDb(db);
  res.status(201).json(newTrf);
});

app.get("/api/employee/transfers", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const list = db.transfers || [];
  const userTransfers = list.filter(
    (t: any) =>
      (t.fromEmployeeId === user.name ||
        t.fromEmployeeId === user.firstName ||
        t.fromEmployeeId === user.id) &&
      t.status === "requested",
  );

  res.json(userTransfers);
});

app.get("/api/employee/transfers/:id", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const trf = (db.transfers || []).find((t: any) => t.id === req.params.id);
  if (!trf) {
    res.status(404).json({ error: "Transfer request not found." });
    return;
  }

  const isOwner =
    trf.fromEmployeeId === user.name ||
    trf.fromEmployeeId === user.firstName ||
    trf.fromEmployeeId === user.id;
  if (!isOwner) {
    res.status(403).json({ error: "Access denied." });
    return;
  }

  res.json(trf);
});

app.delete("/api/employee/transfers/:id", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const index = (db.transfers || []).findIndex(
    (t: any) => t.id === req.params.id && t.status === "requested",
  );
  if (index === -1) {
    res.status(404).json({
      error: "Pending transfer request not found or already processed.",
    });
    return;
  }

  const trf = db.transfers[index];
  const isOwner =
    trf.fromEmployeeId === user.name ||
    trf.fromEmployeeId === user.firstName ||
    trf.fromEmployeeId === user.id;
  if (!isOwner) {
    res.status(403).json({ error: "Access denied." });
    return;
  }

  // Remove transfer request
  db.transfers.splice(index, 1);

  // Remove from pendingApprovals
  db.pendingApprovals = (db.pendingApprovals || []).filter(
    (p: any) => !(p.type === "Transfer" && p.requestId === req.params.id),
  );

  writeDb(db);
  res.json({
    success: true,
    message: "Transfer request canceled successfully.",
  });
});

app.get("/api/employee/requests/history", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  // Filter completed returns (status !== pending)
  const completedReturns = (db.returns || [])
    .filter(
      (r: any) =>
        (r.employeeId === user.name ||
          r.employeeId === user.firstName ||
          r.employeeId === user.id) &&
        r.status !== "pending",
    )
    .map((r: any) => ({
      id: r.id,
      assetId: r.assetId,
      type: "Return",
      status: r.status,
      date: r.date,
      reason: r.reason,
      comments: r.comments || "",
    }));

  // Filter completed transfers (status !== requested)
  const completedTransfers = (db.transfers || [])
    .filter(
      (t: any) =>
        (t.fromEmployeeId === user.name ||
          t.fromEmployeeId === user.firstName ||
          t.fromEmployeeId === user.id) &&
        t.status !== "requested",
    )
    .map((t: any) => ({
      id: t.id,
      assetId: t.assetId,
      type: "Transfer",
      status: t.status,
      date: t.date,
      reason: t.reason,
      comments: t.comments || "",
    }));

  const history = [...completedReturns, ...completedTransfers].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  res.json(history);
});

// --- EMPLOYEE RESOURCE BOOKING APIs (PHASE 5) ---

app.get("/api/employee/resources", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.resources || []);
});

app.get("/api/employee/resources/:id", (req: Request, res: Response) => {
  const db = readDb();
  const resrc = (db.resources || []).find(
    (r: any) => r.resourceId === req.params.id,
  );
  if (!resrc) {
    res.status(404).json({ error: "Resource not found." });
    return;
  }
  res.json(resrc);
});

app.get(
  "/api/employee/resources/:id/availability",
  (req: Request, res: Response) => {
    const db = readDb();
    const date =
      (req.query.date as string) || new Date().toISOString().split("T")[0];
    const list = db.bookings || [];

    // Filter active bookings for this resource on selected date
    const bookingsForDay = list.filter(
      (b: any) =>
        b.resourceId === req.params.id &&
        b.date === date &&
        b.status !== "cancelled",
    );

    res.json(bookingsForDay);
  },
);

app.post("/api/employee/bookings", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const {
    resourceId,
    date,
    startTime,
    endTime,
    purpose,
    participants,
    additionalNotes,
  } = req.body;
  if (!resourceId || !date || !startTime || !endTime || !purpose) {
    res.status(400).json({ error: "Required fields are missing." });
    return;
  }

  const resrc = (db.resources || []).find(
    (r: any) => r.resourceId === resourceId,
  );
  if (!resrc) {
    res.status(404).json({ error: "Resource not found." });
    return;
  }

  // Conflict / overlap check: startTime < b.endTime && endTime > b.startTime
  const bookings = db.bookings || [];
  const hasConflict = bookings.some(
    (b: any) =>
      b.resourceId === resourceId &&
      b.date === date &&
      b.status !== "cancelled" &&
      startTime < b.endTime &&
      endTime > b.startTime,
  );

  if (hasConflict) {
    res.status(400).json({ error: "Time Slot Conflict" });
    return;
  }

  const newBooking = {
    bookingId: "bk-" + Date.now(),
    resourceId,
    employeeId: user.name,
    date,
    startTime,
    endTime,
    purpose,
    status: "confirmed",
    participants: participants || [],
    additionalNotes: additionalNotes || "",
    createdAt: new Date().toISOString(),
  };

  db.bookings = [newBooking, ...(db.bookings || [])];

  // Send a confirmation notification
  const newNotif = {
    id: "notif-bk-" + Date.now(),
    employeeId: user.id,
    title: "Booking Confirmed",
    message:
      resrc.resourceName +
      " has been booked for " +
      purpose +
      " on " +
      date +
      " at " +
      startTime +
      "-" +
      endTime +
      ".",
    status: "unread",
    category: "Bookings",
    date: new Date().toISOString(),
  };
  db.notifications = [newNotif, ...(db.notifications || [])];

  // Record audit timeline log
  recordEvent(
    db,
    user.name,
    "Bookings",
    "Book Shared Resource",
    resourceId,
    "Success",
    "Booked " + resrc.resourceName + " for: " + purpose,
    "bookings",
  );

  writeDb(db);
  res.status(201).json(newBooking);
});

app.get("/api/employee/bookings", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const list = db.bookings || [];
  const userBookings = list.filter(
    (b: any) =>
      (b.employeeId === user.name ||
        b.employeeId === user.firstName ||
        b.employeeId === user.id) &&
      b.status === "confirmed",
  );

  // Map to populate resource details dynamically
  const populated = userBookings.map((b: any) => {
    const resrc = (db.resources || []).find(
      (r: any) => r.resourceId === b.resourceId,
    );
    return {
      ...b,
      resourceName: resrc ? resrc.resourceName : b.resourceId,
      location: resrc ? resrc.location : "HQ",
      capacity: resrc ? resrc.capacity : 0,
    };
  });

  res.json(populated);
});

app.get("/api/employee/bookings/:id", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const booking = (db.bookings || []).find(
    (b: any) => b.bookingId === req.params.id,
  );
  if (!booking) {
    res.status(404).json({ error: "Booking not found." });
    return;
  }

  const isOwner =
    booking.employeeId === user.name ||
    booking.employeeId === user.firstName ||
    booking.employeeId === user.id;
  if (!isOwner) {
    res.status(403).json({ error: "Access denied." });
    return;
  }

  const resrc = (db.resources || []).find(
    (r: any) => r.resourceId === booking.resourceId,
  );

  // Timeline
  const timeline = [
    { label: "Booking Created", done: true, timestamp: booking.createdAt },
    {
      label: "Availability Confirmed",
      done: true,
      timestamp: booking.createdAt,
    },
    {
      label: "Notification Alert Dispatched",
      done: true,
      timestamp: booking.createdAt,
    },
    {
      label: "Booking Closed/Completed",
      done: new Date(booking.date + "T" + booking.endTime) < new Date(),
      timestamp: booking.date + "T" + booking.endTime,
    },
  ];

  res.json({
    booking: {
      ...booking,
      resourceName: resrc ? resrc.resourceName : booking.resourceId,
      location: resrc ? resrc.location : "HQ",
      capacity: resrc ? resrc.capacity : 0,
    },
    timeline,
  });
});

app.put("/api/employee/bookings/:id", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const booking = (db.bookings || []).find(
    (b: any) => b.bookingId === req.params.id,
  );
  if (!booking) {
    res.status(404).json({ error: "Booking not found." });
    return;
  }

  const isOwner =
    booking.employeeId === user.name ||
    booking.employeeId === user.firstName ||
    booking.employeeId === user.id;
  if (!isOwner) {
    res.status(403).json({ error: "Access denied." });
    return;
  }

  const { date, startTime, endTime, purpose } = req.body;
  if (!date || !startTime || !endTime) {
    res.status(400).json({ error: "Required fields missing." });
    return;
  }

  // Conflict / overlap check: exclude current booking ID!
  const bookings = db.bookings || [];
  const hasConflict = bookings.some(
    (b: any) =>
      b.bookingId !== req.params.id &&
      b.resourceId === booking.resourceId &&
      b.date === date &&
      b.status !== "cancelled" &&
      startTime < b.endTime &&
      endTime > b.startTime,
  );

  if (hasConflict) {
    res.status(400).json({ error: "Time Slot Conflict" });
    return;
  }

  booking.date = date;
  booking.startTime = startTime;
  booking.endTime = endTime;
  if (purpose) booking.purpose = purpose;

  // Send a rescheduled notification
  const resrc = (db.resources || []).find(
    (r: any) => r.resourceId === booking.resourceId,
  );
  const newNotif = {
    id: "notif-bk-" + Date.now(),
    employeeId: user.id,
    title: "Booking Rescheduled",
    message:
      (resrc ? resrc.resourceName : "Resource") +
      " booking has been updated to " +
      date +
      " at " +
      startTime +
      "-" +
      endTime +
      ".",
    status: "unread",
    category: "Bookings",
    date: new Date().toISOString(),
  };
  db.notifications = [newNotif, ...(db.notifications || [])];

  writeDb(db);
  res.json(booking);
});

app.delete("/api/employee/bookings/:id", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const booking = (db.bookings || []).find(
    (b: any) => b.bookingId === req.params.id,
  );
  if (!booking) {
    res.status(404).json({ error: "Booking not found." });
    return;
  }

  const isOwner =
    booking.employeeId === user.name ||
    booking.employeeId === user.firstName ||
    booking.employeeId === user.id;
  if (!isOwner) {
    res.status(403).json({ error: "Access denied." });
    return;
  }

  booking.status = "cancelled";

  // Send a cancellation notification
  const resrc = (db.resources || []).find(
    (r: any) => r.resourceId === booking.resourceId,
  );
  const newNotif = {
    id: "notif-bk-" + Date.now(),
    employeeId: user.id,
    title: "Booking Cancelled",
    message:
      (resrc ? resrc.resourceName : "Resource") +
      " booking for " +
      booking.date +
      " has been cancelled.",
    status: "unread",
    category: "Bookings",
    date: new Date().toISOString(),
  };
  db.notifications = [newNotif, ...(db.notifications || [])];

  writeDb(db);
  res.json({ success: true, message: "Booking cancelled successfully." });
});

// --- EMPLOYEE NOTIFICATIONS & ACTIVITY CENTER APIs (PHASE 6) ---

app.get("/api/employee/notifications", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const list = db.notifications || [];
  // Employees see notifications matching their ID, Name, or employeeId, or 'all'
  const userNotifs = list.filter(
    (n: any) =>
      n.employeeId === user.id ||
      n.employeeId === user.name ||
      n.employeeId === user.employeeId ||
      n.recipient === user.email ||
      n.employeeId === "all",
  );

  res.json(userNotifs);
});

app.put(
  "/api/employee/notifications/:id/read",
  (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const db = readDb();
    const user = (db.users || []).find((u: any) => u.id === userId);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const notif = (db.notifications || []).find(
      (n: any) => n.id === req.params.id,
    );
    if (!notif) {
      res.status(404).json({ error: "Notification not found." });
      return;
    }

    notif.status = "read";
    writeDb(db);
    res.json({ success: true });
  },
);

app.put(
  "/api/employee/notifications/read-all",
  (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const db = readDb();
    const user = (db.users || []).find((u: any) => u.id === userId);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    (db.notifications || []).forEach((n: any) => {
      if (
        n.employeeId === user.id ||
        n.employeeId === user.name ||
        n.employeeId === "all" ||
        n.recipient === user.email
      ) {
        n.status = "read";
      }
    });

    writeDb(db);
    res.json({ success: true });
  },
);

app.delete("/api/employee/notifications/:id", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const index = (db.notifications || []).findIndex(
    (n: any) => n.id === req.params.id,
  );
  if (index === -1) {
    res.status(404).json({ error: "Notification not found." });
    return;
  }

  // Set status to archived or splice
  db.notifications.splice(index, 1);
  writeDb(db);
  res.json({ success: true });
});

app.get("/api/employee/activity", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const list = db.activityLogs || [];
  const userLogs = list.filter(
    (l: any) =>
      l.employeeId === user.id ||
      l.userId === user.id ||
      l.employeeId === user.employeeId ||
      l.operator === user.name,
  );

  res.json(userLogs);
});

app.get("/api/employee/announcements", (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.announcements || []);
});

app.get("/api/employee/preferences", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  if (!db.notificationPreferences) db.notificationPreferences = {};
  if (!db.notificationPreferences[user.id]) {
    db.notificationPreferences[user.id] = {
      employeeId: user.id,
      emailNotifications: true,
      assetNotifications: true,
      maintenanceNotifications: true,
      bookingNotifications: true,
      announcementNotifications: true,
    };
  }

  res.json(db.notificationPreferences[user.id]);
});

app.put("/api/employee/preferences", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  if (!db.notificationPreferences) db.notificationPreferences = {};
  db.notificationPreferences[user.id] = {
    ...db.notificationPreferences[user.id],
    ...req.body,
    employeeId: user.id,
  };

  writeDb(db);
  res.json(db.notificationPreferences[user.id]);
});

// --- EMPLOYEE PROFILE & ACCOUNT SETTINGS APIs (PHASE 7) ---

app.get("/api/employee/profile", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  // Supply default mock fields if missing
  const profile = {
    employeeId: user.employeeId || "EMP-1001",
    name: user.name || "Shashwat Developer",
    firstName: user.firstName || "Shashwat",
    lastName: user.lastName || "Developer",
    email: user.email || "employee@assetflow.com",
    designation: user.designation || "Software Engineer",
    departmentId: user.departmentId || "IT",
    role: user.role || "employee",
    joiningDate: user.joiningDate || "2025-01-20",
    reportingManager: user.reportingManager || "Rahul Sharma",
    employmentType: user.employmentType || "Full-Time",
    officeLocation: user.officeLocation || "Building A, Floor 2",
    phone: user.phone || "+91 98765 43210",
    profileImage: user.profileImage || "",
    address: user.address || {
      street: "123 Green Terrace, Navrangpura",
      city: "Ahmedabad",
      state: "Gujarat",
      country: "India",
      postalCode: "380009",
    },
    emergencyContact: user.emergencyContact || {
      name: "Aditi Dixit",
      relationship: "Sister",
      phone: "+91 98765 99999",
    },
  };

  res.json(profile);
});

app.put("/api/employee/profile", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const { phone, address, emergencyContact } = req.body;

  // Edit permitted fields only
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (emergencyContact !== undefined) user.emergencyContact = emergencyContact;

  writeDb(db);
  res.json({ success: true, message: "Profile updated successfully." });
});

app.post("/api/employee/profile/photo", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  // Mock photo upload setting a generic image url or base64
  user.profileImage =
    req.body.profileImage ||
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

  writeDb(db);
  res.json({ success: true, profileImage: user.profileImage });
});

app.put("/api/employee/change-password", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const { currentPassword, newPassword } = req.body;
  if (user.password !== currentPassword) {
    res.status(400).json({ error: "Incorrect current password." });
    return;
  }

  user.password = newPassword;

  // Log security event
  recordEvent(
    db,
    user.name,
    "Security",
    "Change Password",
    user.id,
    "Success",
    "User changed security account credentials",
    "security",
  );

  writeDb(db);
  res.json({ success: true, message: "Password updated successfully." });
});

app.get("/api/employee/sessions", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const sessions = (db.loginSessions || []).filter(
    (s: any) =>
      s.employeeId === user.id ||
      s.employeeId === user.employeeId ||
      s.employeeId === "emp-developer",
  );
  res.json(sessions);
});

app.delete("/api/employee/sessions/:id", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const index = (db.loginSessions || []).findIndex(
    (s: any) => s.sessionId === req.params.id,
  );
  if (index === -1) {
    res.status(404).json({ error: "Session not found." });
    return;
  }

  db.loginSessions.splice(index, 1);
  writeDb(db);
  res.json({ success: true, message: "Session revoked successfully." });
});

app.get("/api/employee/login-history", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const history = (db.loginHistory || []).filter(
    (h: any) =>
      h.employeeId === user.id ||
      h.employeeId === user.employeeId ||
      h.employeeId === "emp-developer",
  );
  res.json(history);
});

// --- Personal Report Downloads ---

app.get("/api/employee/reports/assets", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }
  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  const userAssets = (db.assets || []).filter(
    (a: any) => a.holder === user?.name || a.holder === user?.firstName,
  );
  res.json(userAssets);
});

app.get("/api/employee/reports/bookings", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }
  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  const userBookings = (db.bookings || []).filter(
    (b: any) => b.employeeId === user?.name || b.employeeId === user?.firstName,
  );
  res.json(userBookings);
});

app.get("/api/employee/reports/maintenance", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }
  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  const userMaintenance = (db.maintenance || []).filter(
    (m: any) => m.employeeId === user?.name || m.employeeId === user?.firstName,
  );
  res.json(userMaintenance);
});

app.get("/api/employee/reports/activity", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }
  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);
  const userLogs = (db.activityLogs || []).filter(
    (l: any) => l.employeeId === user?.id || l.operator === user?.name,
  );
  res.json(userLogs);
});

// --- GLOBAL SEARCH SYSTEM API (PHASE 8) ---

app.get("/api/global/search", (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const query = ((req.query.query as string) || "").toLowerCase().trim();
  const db = readDb();

  if (!query) {
    res.json({
      employees: [],
      assets: [],
      departments: [],
      resources: [],
      requests: [],
      audits: [],
      categories: [],
    });
    return;
  }

  // 1. Search employees/users
  const employees = (db.users || [])
    .filter(
      (u: any) =>
        (u.name || "").toLowerCase().includes(query) ||
        (u.email || "").toLowerCase().includes(query) ||
        (u.employeeId || "").toLowerCase().includes(query) ||
        (u.role || "").toLowerCase().includes(query),
    )
    .slice(0, 10);

  // 2. Search assets
  const assets = (db.assets || [])
    .filter(
      (a: any) =>
        (a.name || "").toLowerCase().includes(query) ||
        (a.id || "").toLowerCase().includes(query) ||
        (a.serialNumber || "").toLowerCase().includes(query) ||
        (a.model || "").toLowerCase().includes(query) ||
        (a.holder || "").toLowerCase().includes(query),
    )
    .slice(0, 10);

  // 3. Search departments
  const departments = (db.departments || [])
    .filter(
      (d: any) =>
        (d.name || "").toLowerCase().includes(query) ||
        (d.code || "").toLowerCase().includes(query),
    )
    .slice(0, 10);

  // 4. Search resources
  const resources = (db.resources || [])
    .filter(
      (r: any) =>
        (r.resourceName || "").toLowerCase().includes(query) ||
        (r.location || "").toLowerCase().includes(query) ||
        (r.category || "").toLowerCase().includes(query),
    )
    .slice(0, 10);

  // 5. Search requests (maintenance, transfers, returns)
  const maintenance = (db.maintenance || [])
    .filter(
      (m: any) =>
        (m.id || "").toLowerCase().includes(query) ||
        (m.problemDescription || "").toLowerCase().includes(query) ||
        (m.employeeId || "").toLowerCase().includes(query),
    )
    .map((m: any) => ({ ...m, type: "Maintenance" }));

  const transfers = (db.transfers || [])
    .filter(
      (t: any) =>
        (t.id || "").toLowerCase().includes(query) ||
        (t.reason || "").toLowerCase().includes(query) ||
        (t.fromEmployeeId || "").toLowerCase().includes(query),
    )
    .map((t: any) => ({ ...t, type: "Transfer" }));

  const returns = (db.returns || [])
    .filter(
      (r: any) =>
        (r.id || "").toLowerCase().includes(query) ||
        (r.reason || "").toLowerCase().includes(query) ||
        (r.employeeId || "").toLowerCase().includes(query),
    )
    .map((r: any) => ({ ...r, type: "Return" }));

  const requests = [...maintenance, ...transfers, ...returns].slice(0, 10);

  // 6. Search audits
  const audits = (db.audits || [])
    .filter(
      (au: any) =>
        (au.name || "").toLowerCase().includes(query) ||
        (au.id || "").toLowerCase().includes(query) ||
        (au.status || "").toLowerCase().includes(query),
    )
    .slice(0, 10);

  // 7. Search categories
  const categories = (db.categories || [])
    .filter(
      (c: any) =>
        (c.name || "").toLowerCase().includes(query) ||
        (c.code || "").toLowerCase().includes(query),
    )
    .slice(0, 10);

  res.json({
    employees,
    assets,
    departments,
    resources,
    requests,
    audits,
    categories,
  });
});

export default app;
