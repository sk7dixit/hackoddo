import * as fs from "fs";

const BASE_URL = "http://localhost:5000/api";

const runTests = async () => {
  console.log("====================================================");
  console.log("🚀 STARTING ASSETFLOW WORKFLOW INTEGRATION TESTS");
  console.log("====================================================");

  // Helper for requests
  const request = async (endpoint: string, method: string, userId: string, body?: any): Promise<{status: number, ok: boolean, data: any}> => {
    const url = `${BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-user-id": userId,
    };
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : null;
    
    return { status: response.status, ok: response.ok, data };
  };

  try {
    // 0. RESET DATABASE
    console.log("\n🧹 Resetting database to clean seeder state...");
    const reset = await request("/demo/reset", "POST", "AM000");
    if (!reset.ok) throw new Error("Failed to reset database");
    console.log("✅ Database reset complete.");

    // 1. ADMIN SETS UP DEPARTMENTS & PROMOTES USERS
    console.log("\n👥 Test Step 1: Admin creates department and checks permissions...");
    
    // Create Department
    const newDept = {
      name: "Quality Assurance",
      code: "QA",
      description: "Software testing and release audits",
      budget: 80000,
      location: "Building E, Floor 3",
      status: "Active"
    };
    
    const deptRes = await request("/departments", "POST", "AM000", newDept);
    if (deptRes.status === 201) {
      console.log(`✅ Admin successfully created department 'Quality Assurance' (${deptRes.data.id})`);
    } else {
      throw new Error(`Failed to create department: ${JSON.stringify(deptRes.data)}`);
    }

    // Role-authorization test: Try creating department as Employee (AM003)
    const badDeptRes = await request("/departments", "POST", "AM003", newDept);
    if (badDeptRes.status === 403) {
      console.log("✅ Role Authorization Guard blocked Employee from creating department (403 Forbidden)");
    } else {
      throw new Error("Role Authorization Guard failed: allowed employee to write admin resource");
    }

    // 2. ASSET MANAGER REGISTERS A NEW ASSET (Starts as Available)
    console.log("\n📦 Test Step 2: Asset Manager registers new hardware...");
    
    const newAsset = {
      name: "Cisco Catalyst Switch 999",
      categoryId: "Electronics",
      departmentId: "IT",
      serialNumber: "SN-TEST-CISCO-999",
      condition: "Excellent",
      cost: 2500,
      location: "Floor 2"
    };

    const assetRes = await request("/assets", "POST", "AM001", newAsset);
    if (assetRes.status === 201) {
      console.log(`✅ Asset Manager registered asset: '${assetRes.data.name}' (${assetRes.data.id})`);
      console.log(`   Initial Status: ${assetRes.data.status} (Expected: available)`);
      if (assetRes.data.status !== "available") throw new Error("Asset status was not 'available' on registration");
    } else {
      throw new Error(`Failed to register asset: ${JSON.stringify(assetRes.data)}`);
    }

    const testAssetId = assetRes.data.id;

    // 3. ALLOCATION & TRANSFER CONFLICTS
    console.log("\n🔗 Test Step 3: Allocation and double-allocation prevention...");

    // Allocate to employee AM003 (Shashwat Developer)
    const alloc = {
      assetId: testAssetId,
      employeeId: "Shashwat Developer",
      notes: "Project staging setup"
    };

    const allocRes = await request("/allocations", "POST", "AM001", alloc);
    if (allocRes.status === 201) {
      console.log(`✅ Successfully allocated switch '${testAssetId}' to custodian 'Shashwat Developer'`);
    } else {
      throw new Error(`Failed to allocate asset: ${JSON.stringify(allocRes.data)}`);
    }

    // Attempt to double-allocate the same asset
    const doubleAlloc = {
      assetId: testAssetId,
      employeeId: "Rahul Sharma",
      notes: "Concurrent allocation attempt"
    };
    
    const badAllocRes = await request("/allocations", "POST", "AM001", doubleAlloc);
    if (badAllocRes.status === 400) {
      console.log("✅ Blocked double-allocation attempt (400 Bad Request)");
      console.log(`   Message: "${badAllocRes.data.error || badAllocRes.data.message}"`);
    } else {
      throw new Error("Double-allocation prevention failed: allowed asset to be allocated twice!");
    }

    // 4. SHARED BOOKABLE RESOURCE CALENDAR CONFLICTS
    console.log("\n📅 Test Step 4: Shared resource booking & calendar conflict validation...");

    // Find a shared resource in database
    const dbData = JSON.parse(fs.readFileSync("./src/database/db.json", "utf-8"));
    const sharedRoom = dbData.resources.find((r: any) => r.isBookable || r.status === "available");
    if (!sharedRoom) throw new Error("No shared bookable resources seeded in database");

    console.log(`   Using Shared Resource: '${sharedRoom.resourceName}' (${sharedRoom.resourceId})`);

    // Create a confirmed booking
    const bookingDate = "2026-07-20";
    const timeSlot = "10:00-11:00";
    
    const newBooking = {
      resourceId: sharedRoom.resourceId,
      date: bookingDate,
      startTime: "10:00",
      endTime: "11:00",
      purpose: "Sprint Sync Meeting"
    };

    const bookingRes = await request("/employee/bookings", "POST", "AM003", newBooking);
    if (bookingRes.status === 201) {
      console.log(`✅ Booking confirmed for resource '${sharedRoom.resourceId}' on ${bookingDate} [${timeSlot}]`);
    } else {
      throw new Error(`Failed to create booking: ${JSON.stringify(bookingRes.data)}`);
    }

    // Try creating an overlapping booking for the same resource, date, and timeslot
    const overlapBooking = {
      resourceId: sharedRoom.resourceId,
      date: bookingDate,
      startTime: "10:00",
      endTime: "11:00",
      purpose: "Overlapping Team Sync"
    };

    const badBookingRes = await request("/employee/bookings", "POST", "AM003", overlapBooking);
    if (badBookingRes.status === 400) {
      console.log("✅ Overlapping request rejected automatically (400 Bad Request)");
      console.log(`   Message: "${badBookingRes.data.error}"`);
    } else {
      throw new Error("Overlapping booking conflict validation failed: allowed double booking!");
    }

    // 5. MAINTENANCE LIFE-CYCLE: Raise Request -> Approve -> status flip
    console.log("\n🔧 Test Step 5: Maintenance Lifecycle (Raise -> Approve -> Status Transition)...");

    // Retrieve Shashwat's assigned asset ID (which is testAssetId)
    // Raise request
    const maintReq = {
      assetId: testAssetId,
      issueCategory: "Hardware",
      priority: "High",
      description: "Port 5 LED indicator is dead, connection drops sporadically."
    };

    const maintRes = await request("/employee/maintenance", "POST", "AM003", maintReq);
    if (maintRes.status === 201) {
      console.log(`✅ Employee raised maintenance request ticket '${maintRes.data.id}'`);
    } else {
      throw new Error(`Failed to raise maintenance request: ${JSON.stringify(maintRes.data)}`);
    }

    const ticketId = maintRes.data.id;

    // Check status of asset - should still be 'allocated' before work begins
    const checkAllocAsset = await request(`/assets/${testAssetId}`, "GET", "AM001");
    console.log(`   Asset Status before approval: '${checkAllocAsset.data.status}' (Expected: allocated)`);
    if (checkAllocAsset.data.status !== "allocated") throw new Error("Asset status flipped prematurely!");

    // Asset Manager approves maintenance request
    const approveRes = await request(`/maintenance/${ticketId}/approve`, "PATCH", "AM001");
    if (approveRes.status === 200) {
      console.log(`✅ Asset Manager approved maintenance request ticket '${ticketId}'`);
    } else {
      throw new Error(`Failed to approve maintenance request: ${JSON.stringify(approveRes.data)}`);
    }

    // Verify asset status has automatically transitioned to 'under_maintenance'
    const checkMaintAsset = await request(`/assets/${testAssetId}`, "GET", "AM001");
    console.log(`   Asset Status after approval: '${checkMaintAsset.data.status}' (Expected: under_maintenance)`);
    if (checkMaintAsset.data.status !== "under_maintenance") {
      throw new Error(`Asset status failed to flip! Current status: ${checkMaintAsset.data.status}`);
    }
    console.log("✅ Asset status successfully flipped to 'Under Maintenance'.");

    // 6. PERIODIC AUDIT CYCLES
    console.log("\n📋 Test Step 6: Audit cycles & discrepancies reports...");

    // Create Audit Cycle
    const newAudit = {
      name: "Q3 Router Compliance Audit",
      code: "AUD-Q3-2026",
      scope: { type: "organization" },
      startDate: "2026-07-12",
      endDate: "2026-07-30",
      deadline: "2026-07-28",
      priority: "Medium",
      auditors: ["AM001"]
    };

    const auditRes = await request("/admin/audits", "POST", "AM000", newAudit);
    if (auditRes.status === 201) {
      console.log(`✅ Admin launched audit cycle '${auditRes.data.name}' (${auditRes.data.id})`);
    } else {
      throw new Error(`Failed to create audit cycle: Status ${auditRes.status}, Data: ${JSON.stringify(auditRes.data)}`);
    }

    // 7. GLOBAL SEARCH INDEX SCANS
    console.log("\n🔍 Test Step 7: Global unified search index scanning...");
    
    const searchRes = await request("/global/search?query=Cisco", "GET", "AM003");
    if (searchRes.status === 200) {
      const matchCount = (searchRes.data.assets || []).length;
      console.log(`✅ Global search scanned indexes and returned ${matchCount} assets matching 'Cisco'`);
      if (matchCount === 0) throw new Error("Global search failed to locate registered Cisco asset!");
    } else {
      throw new Error(`Failed to query global search: ${JSON.stringify(searchRes.data)}`);
    }

    console.log("\n====================================================");
    console.log("🏆 ALL INTEGRATION WORKFLOW TESTS PASSED SUCCESSFULLY!");
    console.log("====================================================");

  } catch (err: any) {
    console.error("\n❌ TEST RUN ENCOUNTERED AN ERROR:");
    console.error(err.message || err);
    process.exit(1);
  }
};

runTests();
