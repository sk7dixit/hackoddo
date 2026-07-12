import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "../store/authStore";
import {
  Lock,
  User,
  AlertCircle,
  Hexagon,
  ShieldAlert,
  Laptop,
  Wrench,
  Handshake,
} from "lucide-react";
import GlassCard from "../components/GlassCard";

export const Login: React.FC = () => {
  const navigate = useNavigate();

  // Login credentials state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (data.success && data.user) {
        authStore.setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          employeeId: data.user.employeeId,
          token: data.token,
        });

        // Redirect based on role
        if (data.user.role === "department_head") {
          navigate("/department-head");
        } else if (data.user.role === "admin") {
          navigate("/admin");
        } else if (data.user.role === "employee") {
          navigate("/employee");
        } else {
          navigate("/dashboard");
        }
      } else {
        throw new Error("Missing user data from server response");
      }
    } catch (e: any) {
      setError(e.message || "Connecting to server failed.");
    } finally {
      setLoading(false);
    }
  };

  // Quick fill handler
  const handleQuickFill = (emailVal: string, passVal: string) => {
    setEmail(emailVal);
    setPassword(passVal);
    setError(null);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-[#F5F7FB] text-slate-800 font-sans">
      {/* LEFT SIDE: Enterprise Stats & Illustration Panel (col-span-5) */}
      <div className="hidden md:flex md:col-span-5 bg-[#5B5BD6] text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Glow vector shapes */}
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />

        {/* Brand details */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
            <Hexagon className="w-5 h-5 text-white fill-white/10" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-white leading-none">
              AssetFlow
            </h1>
            <span className="text-[9px] font-bold text-indigo-200 mt-1 block uppercase tracking-wider">
              Enterprise Asset Ledger
            </span>
          </div>
        </div>

        {/* Statistics metrics card */}
        <div className="space-y-8 relative z-10 my-auto">
          <div className="space-y-2">
            <h2 className="text-3xl font-black leading-tight">
              Orchestrate Hardware Assets at Scale
            </h2>
            <p className="text-xs text-indigo-150 font-semibold leading-relaxed">
              Live updates on device availability, employee checkout limits, and
              active compliance audits.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/10 border border-white/10 rounded-2xl space-y-1">
              <Laptop className="w-4 h-4 text-indigo-200" />
              <span className="text-[10px] text-indigo-150 font-bold uppercase block">
                160 Total Assets
              </span>
              <p className="text-xs text-slate-200 font-semibold">
                Tracked hardware items
              </p>
            </div>

            <div className="p-4 bg-white/10 border border-white/10 rounded-2xl space-y-1">
              <Handshake className="w-4 h-4 text-indigo-200" />
              <span className="text-[10px] text-indigo-150 font-bold uppercase block">
                80 Allocated
              </span>
              <p className="text-xs text-slate-200 font-semibold">
                Active employee custody
              </p>
            </div>

            <div className="p-4 bg-white/10 border border-white/10 rounded-2xl space-y-1 col-span-2">
              <Wrench className="w-4 h-4 text-indigo-200" />
              <span className="text-[10px] text-indigo-150 font-bold uppercase block">
                12 Under Maintenance
              </span>
              <p className="text-xs text-slate-200 font-semibold">
                Repairs & external technician diagnostic tickets
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-indigo-200 font-semibold relative z-10">
          <span>Enterprise Asset Lifecycle Platform • Odoo Hackathon 2026</span>
        </div>
      </div>

      {/* RIGHT SIDE: Login form & Demo Credentials filler (col-span-7) */}
      <div className="col-span-1 md:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Brand Header */}
          <div className="flex md:hidden flex-col items-center text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#5B5BD6] flex items-center justify-center shadow-lg shadow-[#5B5BD6]/20">
              <span className="font-extrabold text-white text-xl">AF</span>
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight text-slate-900">
                AssetFlow
              </h1>
              <p className="text-[10px] text-[#5B5BD6] font-bold uppercase tracking-wider mt-0.5">
                Enterprise Portal Gateway
              </p>
            </div>
          </div>

          {/* Main Card */}
          <GlassCard className="border-slate-200 bg-white p-8 shadow-sm rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#5B5BD6]" />

            <div className="space-y-1 mb-6">
              <h3 className="font-black text-xl text-slate-900">
                Welcome Back
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Sign in using email or assigned Employee ID
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl flex items-center gap-2 text-xs font-semibold">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 font-semibold text-xs text-slate-700"
            >
              {/* Email / Employee ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Employee ID / Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="EMP-1001 or email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input pl-10 text-xs w-full font-semibold"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input pl-10 text-xs w-full font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-xs py-3.5 mt-6 flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-40 disabled:pointer-events-none"
              >
                {loading ? "Authenticating..." : "Sign In"}
              </button>
            </form>
          </GlassCard>

          {/* Quick-Fill Demo Credentials Panel */}
          <GlassCard className="border-slate-200 bg-white p-5 shadow-sm rounded-2xl space-y-3.5">
            <h4 className="font-extrabold text-[10.5px] uppercase tracking-wider text-slate-450 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <ShieldAlert className="w-4 h-4 text-[#5B5BD6]" />
              Quick-Fill Demo Credentials
            </h4>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {/* Admin Button */}
              <button
                onClick={() =>
                  handleQuickFill("admin@assetflow.com", "admin123")
                }
                className="p-2 border border-slate-150 hover:border-[#5B5BD6]/40 rounded-xl bg-slate-50 hover:bg-[#5B5BD6]/5 transition-colors text-left space-y-0.5"
              >
                <span className="font-extrabold text-slate-800 block">
                  👑 Administrator
                </span>
                <span className="text-[9.5px] font-mono text-slate-450 block">
                  admin@assetflow.com
                </span>
              </button>

              {/* Asset Manager Button */}
              <button
                onClick={() =>
                  handleQuickFill("manager@assetflow.com", "manager123")
                }
                className="p-2 border border-slate-150 hover:border-[#5B5BD6]/40 rounded-xl bg-slate-50 hover:bg-[#5B5BD6]/5 transition-colors text-left space-y-0.5"
              >
                <span className="font-extrabold text-slate-800 block">
                  📦 Asset Manager
                </span>
                <span className="text-[9.5px] font-mono text-slate-450 block">
                  manager@assetflow.com
                </span>
              </button>

              {/* Department Head Button */}
              <button
                onClick={() =>
                  handleQuickFill("departmenthead@gmail.com", "12345")
                }
                className="p-2 border border-slate-150 hover:border-[#5B5BD6]/40 rounded-xl bg-slate-50 hover:bg-[#5B5BD6]/5 transition-colors text-left space-y-0.5"
              >
                <span className="font-extrabold text-slate-800 block">
                  💼 Department Head
                </span>
                <span className="text-[9.5px] font-mono text-slate-450 block">
                  departmenthead@gmail.com
                </span>
              </button>

              {/* Employee Button */}
              <button
                onClick={() => handleQuickFill("EMP-1001", "employee123")}
                className="p-2 border border-slate-150 hover:border-[#5B5BD6]/40 rounded-xl bg-slate-50 hover:bg-[#5B5BD6]/5 transition-colors text-left space-y-0.5"
              >
                <span className="font-extrabold text-slate-800 block">
                  👤 Employee ID
                </span>
                <span className="text-[9.5px] font-mono text-slate-450 block">
                  EMP-1001
                </span>
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Login;
