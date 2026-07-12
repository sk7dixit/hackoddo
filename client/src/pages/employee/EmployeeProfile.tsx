import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import {
  User,
  Shield,
  Settings,
  Download,
  HelpCircle,
  Building2,
  Camera,
  Lock,
  LogOut,
  History,
  FileText,
  Clock,
  Eye,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Smartphone,
  Globe,
  RefreshCw,
  FolderDown,
  Info
} from "lucide-react";

export const EmployeeProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "personal" | "org" | "security" | "preferences" | "downloads" | "support"
  >("overview");

  // Profile data
  const [profile, setProfile] = useState<any | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit fields state
  const [phoneVal, setPhoneVal] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressCountry, setAddressCountry] = useState("");
  const [addressPostalCode, setAddressPostalCode] = useState("");
  const [emerName, setEmerName] = useState("");
  const [emerRel, setEmerRel] = useState("");
  const [emerPhone, setEmerPhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  // Security password fields
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  // System settings preferences
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("English");
  const [timeFormat, setTimeFormat] = useState("12 Hour");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [prefSaving, setPrefSaving] = useState(false);

  // Statistics summaries
  const [stats, setStats] = useState({
    assetsCount: 0,
    requestsCount: 0,
    bookingsCount: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profRes, sessRes, historyRes, assetsList, requestsList, bookingsList] = await Promise.all([
        api.get("/employee/profile"),
        api.get("/employee/sessions"),
        api.get("/employee/login-history"),
        api.get("/employee/assets"),
        api.get("/employee/maintenance"),
        api.get("/employee/bookings")
      ]);

      setProfile(profRes);
      setSessions(sessRes || []);
      setLoginHistory(historyRes || []);

      // Seed form values
      setPhoneVal(profRes.phone || "");
      if (profRes.address) {
        setAddressStreet(profRes.address.street || "");
        setAddressCity(profRes.address.city || "");
        setAddressState(profRes.address.state || "");
        setAddressCountry(profRes.address.country || "");
        setAddressPostalCode(profRes.address.postalCode || "");
      }
      if (profRes.emergencyContact) {
        setEmerName(profRes.emergencyContact.name || "");
        setEmerRel(profRes.emergencyContact.relationship || "");
        setEmerPhone(profRes.emergencyContact.phone || "");
      }

      setStats({
        assetsCount: (assetsList || []).length,
        requestsCount: (requestsList || []).length,
        bookingsCount: (bookingsList || []).length
      });
    } catch (err) {
      toast.error("Failed to load profile parameters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update profile handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await api.put("/employee/profile", {
        phone: phoneVal,
        address: {
          street: addressStreet,
          city: addressCity,
          state: addressState,
          country: addressCountry,
          postalCode: addressPostalCode
        },
        emergencyContact: {
          name: emerName,
          relationship: emerRel,
          phone: emerPhone
        }
      });
      toast.success("Profile records updated successfully!");
      fetchData();
    } catch (err) {
      toast.error("Failed to update profile settings.");
    } finally {
      setProfileSaving(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confPassword) {
      toast.error("New password confirmation mismatch.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setPasswordSaving(true);
    try {
      await api.put("/employee/change-password", {
        currentPassword: currPassword,
        newPassword
      });
      toast.success("Password updated successfully.");
      setCurrPassword("");
      setNewPassword("");
      setConfPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  // Revoke active login device session
  const handleRevokeSession = async (sessId: string) => {
    if (!window.confirm("Disconnect/Log out this active session device?")) return;
    try {
      await api.delete(`/employee/sessions/${sessId}`);
      toast.success("Session revoked successfully.");
      setSessions((prev) => prev.filter((s) => s.sessionId !== sessId));
    } catch (err) {
      toast.error("Failed to revoke session.");
    }
  };

  // Mock Avatar Upload
  const handleAvatarClick = async () => {
    try {
      const res = await api.post("/employee/profile/photo", {
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      });
      toast.success("Profile photo uploaded!");
      setProfile((prev: any) => ({ ...prev, profileImage: res.profileImage }));
    } catch (err) {
      toast.error("Failed to upload profile photo.");
    }
  };

  // Save Preferences
  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrefSaving(true);
    try {
      // Mock toggle save
      await new Promise(r => setTimeout(r, 600));
      toast.success("System configurations updated.");
    } catch (e) {
      toast.error("Failed to save settings.");
    } finally {
      setPrefSaving(false);
    }
  };

  // Client side downloader
  const handleDownloadReport = async (type: string, format: string) => {
    try {
      const data = await api.get(`/employee/reports/${type}`);
      let content = "";
      let mimeType = "text/plain";
      let filename = `${type}_report_${Date.now()}.${format.toLowerCase()}`;

      if (format === "JSON") {
        content = JSON.stringify(data, null, 2);
        mimeType = "application/json";
      } else if (format === "CSV") {
        mimeType = "text/csv";
        if (data && data.length > 0) {
          const headers = Object.keys(data[0]);
          content = headers.join(",") + "\n";
          data.forEach((row: any) => {
            content += headers.map(h => {
              const val = row[h];
              return JSON.stringify(typeof val === "object" ? JSON.stringify(val) : (val || ""));
            }).join(",") + "\n";
          });
        } else {
          content = "No data found";
        }
      } else {
        // Plain text layout export representation
        content = `=========================================\n`;
        content += `      PERSONAL ${type.toUpperCase()} REPORT      \n`;
        content += `=========================================\n`;
        content += `Generated: ${new Date().toLocaleString()}\n\n`;
        content += JSON.stringify(data, null, 2);
      }

      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${type} export ready!`);
    } catch (err) {
      toast.error("Failed to compile report download.");
    }
  };

  return (
    <div className="p-8 space-y-6">
      
      {/* Header Breadcrumb */}
      <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
            <Link to="/employee" className="hover:text-[#4F46E5] transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#4F46E5]">My Profile & Settings</span>
          </div>
          <div className="pt-2">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
              Account Control Center
            </h2>
            <p className="text-xs text-slate-450 font-semibold mt-1">
              Configure personal information, toggle theme preferences, audit sessions and trace credentials.
            </p>
          </div>
        </div>

        {/* Tab headers */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-2xl">
          {[
            { id: "overview", label: "Overview" },
            { id: "personal", label: "Personal Info" },
            { id: "org", label: "Organization" },
            { id: "security", label: "Security" },
            { id: "preferences", label: "Preferences" },
            { id: "downloads", label: "Downloads" },
            { id: "support", label: "Help & Support" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-xs font-semibold">
          <RefreshCw className="w-6 h-6 animate-spin text-[#4F46E5]" />
          <span>Synchronizing profile parameters...</span>
        </div>
      ) : profile ? (
        <div className="space-y-6">
          
          {/* TAB 1: Profile Overview */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              {/* Profile Card left */}
              <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-slate-150 border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-slate-400">
                    {profile.profileImage ? (
                      <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10" />
                    )}
                  </div>
                  <button
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 p-2 bg-[#4F46E5] text-white rounded-full border-2 border-white shadow hover:bg-indigo-700 transition-colors cursor-pointer"
                    title="Upload profile photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className="font-black text-slate-850 text-base">{profile.name}</h3>
                  <span className="text-[10px] font-mono text-slate-400 font-extrabold uppercase bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    ID: {profile.employeeId}
                  </span>
                  <p className="text-[11.5px] text-slate-450 font-semibold pt-1">
                    {profile.designation}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {profile.departmentId} Department
                  </p>
                </div>
              </div>

              {/* Counters right */}
              <div className="md:col-span-2 bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-6">
                <div className="border-b pb-3">
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    Operational custody snapshots
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">Assigned Assets</span>
                    <h3 className="text-2xl font-black text-slate-800 mt-1 font-mono">{stats.assetsCount}</h3>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">Active Requests</span>
                    <h3 className="text-2xl font-black text-[#4F46E5] mt-1 font-mono">{stats.requestsCount}</h3>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">Resource Bookings</span>
                    <h3 className="text-2xl font-black text-emerald-600 mt-1 font-mono">{stats.bookingsCount}</h3>
                  </div>
                </div>

                <div className="bg-indigo-50/30 border border-indigo-100 rounded-2xl p-4.5 flex gap-3 text-xs leading-relaxed text-[#4F46E5] font-semibold">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Self-Service Notice:</span>
                    <p className="text-[10.5px] text-slate-600 mt-0.5">
                      Need updates to department roles, manager designations, or joining coordinates? Please contact the Chief ERP Administrator directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Personal Information */}
          {activeTab === "personal" && (
            <form onSubmit={handleUpdateProfile} className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b pb-3">
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  Profile Information Settings
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Basic info (Read only) */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-wide text-slate-400">Basic Coordinates (Read-Only)</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-650">
                    <div className="space-y-1">
                      <span className="text-[9.5px] text-slate-400 uppercase">Employee ID</span>
                      <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500 font-mono select-none">{profile.employeeId}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9.5px] text-slate-400 uppercase">Official Email</span>
                      <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500 select-none truncate">{profile.email}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9.5px] text-slate-400 uppercase">Designation</span>
                      <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500 select-none">{profile.designation}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9.5px] text-slate-400 uppercase">Joining Date</span>
                      <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500 font-mono select-none">{profile.joiningDate}</div>
                    </div>
                  </div>
                </div>

                {/* Editable Personal Contact */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-wide text-slate-400">Editable Contact Settings</h4>
                  
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <span className="text-[9.5px] text-slate-400 uppercase block">Phone Number</span>
                      <input
                        type="text"
                        value={phoneVal}
                        onChange={(e) => setPhoneVal(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-slate-350 text-xs font-semibold transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9.5px] text-slate-400 uppercase block">Residential Street</span>
                      <input
                        type="text"
                        value={addressStreet}
                        onChange={(e) => setAddressStreet(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-slate-350 text-xs font-semibold transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[9.5px] text-slate-400 uppercase block">City</span>
                        <input
                          type="text"
                          value={addressCity}
                          onChange={(e) => setAddressCity(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-slate-350 text-xs font-semibold transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9.5px] text-slate-400 uppercase block">Postal Code</span>
                        <input
                          type="text"
                          value={addressPostalCode}
                          onChange={(e) => setAddressPostalCode(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-slate-350 text-xs font-semibold transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Emergency contact */}
              <div className="pt-4 border-t space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-wide text-slate-400">Emergency Contacts</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9.5px] text-slate-400 uppercase block">Contact Name</span>
                    <input
                      type="text"
                      value={emerName}
                      onChange={(e) => setEmerName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-slate-350 text-xs font-semibold transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9.5px] text-slate-400 uppercase block">Relationship</span>
                    <input
                      type="text"
                      value={emerRel}
                      onChange={(e) => setEmerRel(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-slate-350 text-xs font-semibold transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9.5px] text-slate-400 uppercase block">Emergency Phone</span>
                    <input
                      type="text"
                      value={emerPhone}
                      onChange={(e) => setEmerPhone(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-slate-350 text-xs font-semibold transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="btn-primary py-2 px-6 text-xs font-bold shadow-md cursor-pointer"
                >
                  {profileSaving ? "Saving changes..." : "Save Profile Details"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Organization Details */}
          {activeTab === "org" && (
            <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b pb-3">
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  Organization & Reporting structure
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold text-slate-650">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-wide text-[#4F46E5]">Corporate Coordinates</h4>
                  <div className="space-y-2.5">
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-slate-400 uppercase text-[9.5px]">Department</span>
                      <span className="text-slate-800 font-bold">{profile.departmentId} Department</span>
                    </div>
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-slate-400 uppercase text-[9.5px]">Employment Type</span>
                      <span className="text-slate-850">{profile.employmentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 uppercase text-[9.5px]">Office Location</span>
                      <span className="text-slate-850">{profile.officeLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-wide text-emerald-600">Reporting Structure</h4>
                  <div className="space-y-2.5">
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-slate-400 uppercase text-[9.5px]">Direct Manager</span>
                      <span className="text-slate-800 font-bold">{profile.reportingManager}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-slate-400 uppercase text-[9.5px]">Department Head</span>
                      <span className="text-slate-850">Diana Prince</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 uppercase text-[9.5px]">Office Extension</span>
                      <span className="text-slate-850">Ext. 204</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Security Center */}
          {activeTab === "security" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              {/* Change Password left */}
              <form onSubmit={handleChangePassword} className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="border-b pb-3.5 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#4F46E5]" />
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    Change Password
                  </h3>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <span className="text-[9.5px] text-slate-400 uppercase block">Current Password</span>
                    <input
                      type="password"
                      required
                      value={currPassword}
                      onChange={(e) => setCurrPassword(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus:bg-white text-xs font-semibold focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9.5px] text-slate-400 uppercase block">New Password</span>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus:bg-white text-xs font-semibold focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9.5px] text-slate-400 uppercase block">Confirm New Password</span>
                    <input
                      type="password"
                      required
                      value={confPassword}
                      onChange={(e) => setConfPassword(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus:bg-white text-xs font-semibold focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="btn-primary w-full py-2.5 text-xs font-bold shadow-md cursor-pointer mt-4"
                >
                  {passwordSaving ? "Updating password..." : "Change Security Password"}
                </button>
              </form>

              {/* Sessions right */}
              <div className="md:col-span-2 space-y-6">
                {/* Active Sessions */}
                <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="border-b pb-3">
                    <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                      Currently Logged-in Devices
                    </h3>
                  </div>

                  <div className="space-y-3.5">
                    {sessions.map((sess) => (
                      <div
                        key={sess.sessionId}
                        className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-indigo-50 text-[#4F46E5] rounded-xl">
                            <Smartphone className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-800">{sess.device}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-1">
                              <span>IP: {sess.ipAddress}</span>
                              <span>•</span>
                              <span>{sess.location}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRevokeSession(sess.sessionId)}
                          className="btn-secondary py-1.5 px-3 text-[10.5px] text-rose-600 hover:text-rose-800 font-bold hover:bg-rose-50 cursor-pointer"
                        >
                          Revoke Device
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Login History */}
                <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="border-b pb-3 flex justify-between items-center">
                    <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                      Login History Trace logs
                    </h3>
                    <div className="flex items-center gap-1 text-[#4F46E5] text-[10.5px] font-bold">
                      <History className="w-3.5 h-3.5" /> Checked
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-semibold text-slate-650">
                      <thead>
                        <tr className="border-b text-[9.5px] text-slate-400 uppercase tracking-wide">
                          <th className="pb-2 font-black">Date/Time</th>
                          <th className="pb-2 font-black">Device</th>
                          <th className="pb-2 font-black">Browser</th>
                          <th className="pb-2 font-black">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {loginHistory.slice(0, 4).map((hist) => (
                          <tr key={hist.historyId}>
                            <td className="py-2.5 font-mono text-slate-500">
                              {hist.timestamp ? hist.timestamp.replace("T", " ").substring(0, 16) : "Today"}
                            </td>
                            <td className="py-2.5 text-slate-800">{hist.device}</td>
                            <td className="py-2.5 text-slate-800">{hist.browser}</td>
                            <td className="py-2.5">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                                hist.status === "Successful" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                              }`}>
                                {hist.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Preferences */}
          {activeTab === "preferences" && (
            <form onSubmit={handleSavePreferences} className="max-w-md mx-auto bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b pb-3.5 flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#4F46E5]" />
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  ERP Interface Customizations
                </h3>
              </div>

              <div className="space-y-4">
                
                {/* Theme toggle */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Display Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 hover:border-slate-350 focus:bg-white focus:outline-none text-xs font-semibold transition-colors"
                  >
                    <option value="light">Light Theme (Default)</option>
                    <option value="dark">Dark Theme (Glassmorphism)</option>
                    <option value="system">Follow System Preferences</option>
                  </select>
                </div>

                {/* Language selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    System Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 hover:border-slate-350 focus:bg-white focus:outline-none text-xs font-semibold transition-colors"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi / हिन्दी</option>
                  </select>
                </div>

                {/* Date Format */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Preferred Date Layout
                  </label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 hover:border-slate-350 focus:bg-white focus:outline-none text-xs font-semibold transition-colors"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 12/07/2026)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 07/12/2026)</option>
                  </select>
                </div>

                {/* Time Format */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">
                    Time Clock format
                  </label>
                  <select
                    value={timeFormat}
                    onChange={(e) => setTimeFormat(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 hover:border-slate-350 focus:bg-white focus:outline-none text-xs font-semibold transition-colors"
                  >
                    <option value="12 Hour">12-Hour format (AM / PM)</option>
                    <option value="24 Hour">24-Hour format (Military clock)</option>
                  </select>
                </div>

              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  disabled={prefSaving}
                  className="btn-primary py-2 px-6 text-xs font-bold shadow-md cursor-pointer"
                >
                  {prefSaving ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 6: Downloads / Export Reports */}
          {activeTab === "downloads" && (
            <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b pb-3 flex items-center gap-2">
                <Download className="w-4 h-4 text-[#4F46E5]" />
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  Personal Report Downloads
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { type: "assets", title: "My Assigned Assets Ledger", desc: "Detailed breakdown of hardware, serial numbers, custody details, and warrantycovered models assigned to you." },
                  { type: "bookings", title: "Shared Bookings History", desc: "Consolidated records of meeting rooms, vehicles, cameras, and projectors schedules reserved by you." },
                  { type: "maintenance", title: "Maintenance Tickets History", desc: "Report tracking problem categories, assigned technicians, repair logs, and status audits." },
                  { type: "activity", title: "Audit Log Activity Report", desc: "Permanent operations log tracking session changes, profile edits, and approval confirmations." }
                ].map((rep) => (
                  <div
                    key={rep.type}
                    className="p-5 border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-slate-300 transition-colors space-y-4"
                  >
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-xs text-slate-850">{rep.title}</h4>
                      <p className="text-[10.5px] text-slate-450 leading-relaxed font-semibold">{rep.desc}</p>
                    </div>

                    <div className="flex gap-2 justify-end pt-2 border-t">
                      <button
                        onClick={() => handleDownloadReport(rep.type, "CSV")}
                        className="py-1.5 px-3 bg-slate-50 border hover:bg-slate-100 rounded-lg font-bold text-[10px] text-slate-600 flex items-center gap-1 cursor-pointer"
                      >
                        <FolderDown className="w-3.5 h-3.5" /> Export CSV
                      </button>
                      <button
                        onClick={() => handleDownloadReport(rep.type, "JSON")}
                        className="py-1.5 px-3 bg-[#EEF2FF] border border-indigo-100 hover:bg-indigo-100 rounded-lg font-bold text-[10px] text-[#4F46E5] flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" /> Export JSON
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: Help & Support FAQs */}
          {activeTab === "support" && (
            <div className="bg-white border border-[#E7ECF3] rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b pb-3.5 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#4F46E5]" />
                <h3 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
                  ERP Support & FAQ Center
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* FAQs left */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-[10.5px] font-black uppercase text-slate-450 tracking-wider">Frequently Asked Questions</h4>
                  
                  <div className="space-y-3">
                    {[
                      { q: "How can I request updates to my role or designation?", a: "Organizational attributes such as Designation, Department, Reporting Manager, and Role are administrative records. Please open an administrative ticket with the IT team or email the HR representative." },
                      { q: "What should I do if a shared booking conflict occurs?", a: "Our scheduling system operates on strict real-time calendar reservations. If a slot is unavailable, you can check the Directory directory for equivalent meeting spaces or check the calendar for adjacent times." },
                      { q: "Where can I download my warranty records?", a: "Go to the My Assets catalog tab, select your asset, open its details drawer, and click on the 'Warranty' tab to download the PDF certificate." }
                    ].map((faq, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                        <span className="font-black text-xs text-slate-800 block">Q: {faq.q}</span>
                        <p className="text-[10.5px] text-slate-450 leading-relaxed font-semibold">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contacts right */}
                <div className="space-y-4 bg-slate-50 border border-slate-100 p-5 rounded-3xl h-fit">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-[#4F46E5] block">Direct Escalations</h4>
                  
                  <div className="space-y-3 text-xs font-semibold text-slate-650">
                    <div className="flex gap-2">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-850 block">Asset Logistics Manager</span>
                        <span className="text-[10px] text-slate-450">John Carter (Ext: 1004)</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-850 block">Support Desk Email</span>
                        <span className="text-[10px] text-slate-450">support@assetflow.com</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="py-12 text-center text-xs text-slate-400 font-semibold italic bg-white border border-[#E7ECF3] rounded-3xl shadow-sm">
          Failed to retrieve profile coordinates.
        </div>
      )}

    </div>
  );
};

export default EmployeeProfile;
