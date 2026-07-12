# AssetFlow – Enterprise Asset & Resource ERP

AssetFlow is a professional web-based Enterprise Resource Planning (ERP) application designed to automate physical asset allocation and shared resource booking workflows. Built with a unified corporate glassmorphic layout, AssetFlow solves the chaos of spreadsheets, emails, and paper logs for organizations managing complex inventory lifecycles.

---

## 🚀 Key Features

### 1. Unified Control Center
- Live clock banner greets the active manager.
- Real-time KPI summaries showing total stock availability, active maintenance repairs, and audit status.
- Interactive donut charts detailing asset utilization and department inventories.

### 2. Physical Assets Inventory Lifecycle
- **Metadata Registration**: Track item name, model, serial codes, cost, location, and condition.
- **Visual QR Grid**: Auto-generates unique QR identifiers dynamically.
- **Audit Trails**: Complete historical timeline logs detailing checkouts, repair actions, and status updates.

### 3. Allocation & Peer Custody Transfers
- **Double-Allocation Blocker**: Restricts checkouts if an asset is already allocated or undergoing repair.
- **Peer-to-Peer Transfers**: Route custody transfers from one department holder to another.
- **Condition-aware Returns**: Returns flagged as "Needs Repair" or "Damaged" are automatically decommissioned and routed directly to the Repair Lab.

### 4. End-to-End Maintenance Requests
- Employees raise issues that route directly to the Manager's dashboard.
- Select and assign technicians (Amit Sharma, Rahul Verma, or Vendor Team).
- Progression tracker: `assigned` ➔ `in_progress` ➔ `waiting_parts` ➔ `completed` ➔ `resolved` (releases assets back to stock).

### 5. Scope Audits & Discrepancies
- Create audit cycles scoped by Entire Organization, Department, or Location.
- Verifiers verify expected holder vs physical existence (Verified, Missing, Damaged).
- Discrepancy reconciler resolving missing items (Found ➔ available, Mark Lost ➔ lost) and damaged items (Send to Maintenance ➔ routes to Repair Lab).
- Validation locking prevents closing audits if unverified assets remain in scope.

### 6. Event Notification & Analytics Engine
- Reusable `EventService` records activity logs and publishes notification alerts.
- Reports dashboard compiling statistics, peak hourly booking heatmaps, and local CSV exports.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite, TypeScript, Tailwind CSS, Lucide icons, Custom Chart elements).
- **Backend**: Node.js (Express, TypeScript, Morgan logger).
- **Database**: File-system based JSON database (`db.json`) for speed and instant re-seeding.

---

## 📁 Folder Structure

```
assetflow/
├── client/                     # React Front-end
│   ├── src/
│   │   ├── components/         # Custom GlassCards, Toast alerts, Skeletons
│   │   ├── layouts/            # Dashboard sidebar shell layouts
│   │   ├── modules/            # Domain submodules (assets, audit, allocation)
│   │   ├── pages/              # Analytics reports, settings, help center
│   │   ├── routes/             # Protected route configurations
│   │   └── store/              # Session authentication store
├── server/                     # Node.js Express Back-end
│   ├── src/
│   │   ├── database/           # db.json storage files
│   │   └── app.ts              # Controllers, routes, and EventService seeding
```

---

## 💻 Installation & Quickstart

### Prerequisites
- Node.js (v18+)

### Setup Backend Server
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the watch-reload development server:
   ```bash
   npm run dev
   ```
   *The backend will automatically create `server/src/database/db.json` and seed it with 160 assets, 80 checkouts, 30 repairs, and 250 activity logs.*

### Setup Client Frontend
1. Navigate to the client folder in a new terminal window:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open your browser to [http://localhost:5173](http://localhost:5173).

---

## 🔑 Demo Credentials

- **Role**: L3 Asset Manager
- **Email**: `assetmanager@gmail.com`
- **Password**: `12345`
