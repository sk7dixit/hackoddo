import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import {
  HelpCircle,
  FileText,
  MessageSquare,
  Search,
  Download,
  BookOpen,
  ChevronRight,
  X,
  Play,
} from "lucide-react";

interface FAQArticle {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface ReleaseNote {
  version: string;
  date: string;
  features: string[];
}

export const AdminHelpCenter: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    "help" | "docs" | "feedback"
  >("help");
  const [faqSearch, setFaqSearch] = useState("");
  const [selectedFAQ, setSelectedFAQ] = useState<FAQArticle | null>(null);

  // Feedback form state
  const [feedbackCategory, setFeedbackCategory] = useState("Bug");
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackDesc, setFeedbackDesc] = useState("");
  const [feedbackPriority, setFeedbackPriority] = useState("Medium");
  const [feedbackHistory, setFeedbackHistory] = useState<any[]>([]);

  // FAQ Articles
  const faqArticles: FAQArticle[] = [
    {
      id: "faq-1",
      category: "Assets",
      question: "How do I register assets?",
      answer:
        "Navigate to Organization Setup -> Categories, verify standard category configurations, then go to Assets to add serial identifiers.",
    },
    {
      id: "faq-2",
      category: "Departments",
      question: "How do I create departments?",
      answer:
        'Go to Organization Setup -> Departments card, click "Manage", and select the "Add Department" button.',
    },
    {
      id: "faq-3",
      category: "Audits",
      question: "How do I start an audit cycle?",
      answer:
        'Open Audit Management -> Manage Cycles tab, click "Create Audit", input scope details, and click Start on the active row.',
    },
    {
      id: "faq-4",
      category: "Reports",
      question: "How do I export CSV files?",
      answer:
        "Access Reports & Analytics, configure export category filters, and click the Download CSV button in the Export Center.",
    },
  ];

  // Release Notes
  const releaseNotes: ReleaseNote[] = [
    {
      version: "Version 1.0 (Current Stable)",
      date: "July 12, 2026",
      features: [
        "Central Admin Dashboard with organization-wide KPIs",
        "Master data controllers for Departments and Locations",
        "Centralized Role-Based Access Control (RBAC) matrix",
        "Audit Cycle scheduler and discrepancy tracking",
        "Notification broadcasters and timed alarms",
      ],
    },
    {
      version: "Upcoming Version 1.1 (Roadmap)",
      date: "Q3 2026",
      features: [
        "Mobile application companion client",
        "Native barcode scanner integration",
        "Predictive AI replacement purchase schedules",
      ],
    },
  ];

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        category: feedbackCategory,
        subject: feedbackSubject,
        description: feedbackDesc,
        priority: feedbackPriority,
      };
      await api.post("/admin/feedback", payload);
      toast.success(
        "Thank you! Your feedback has been queued in the support portal.",
      );

      setFeedbackSubject("");
      setFeedbackDesc("");

      setFeedbackHistory((prev) => [
        {
          id: `fb-${Date.now()}`,
          date: "Today",
          subject: feedbackSubject,
          category: feedbackCategory,
          status: "Open",
        },
        ...prev,
      ]);
    } catch (e) {
      toast.error("Failed to submit feedback.");
    }
  };

  const filteredFAQs = faqArticles.filter(
    (f) =>
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase()),
  );

  return (
    <div className="p-8 space-y-6 animate-fade-in bg-[#F5F7FB] min-h-screen text-xs font-semibold text-slate-750">
      {/* Breadcrumb Header */}
      <div className="space-y-1.5 bg-white border border-[#E7ECF3] p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
          <Link to="/admin" className="hover:text-[#4F46E5] transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#4F46E5]">Help Center</span>
        </div>
        <div className="pt-2">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">
            Help & Documentation Center
          </h2>
          <p className="text-xs text-slate-455 font-semibold mt-1">
            Browse FAQ guides, view release logs, and submit bug reports or
            feedback tickets.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 font-semibold text-xs text-slate-500">
        <button
          onClick={() => setActiveSubTab("help")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeSubTab === "help" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>FAQ Center</span>
          {activeSubTab === "help" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("docs")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeSubTab === "docs" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <FileText className="w-4 h-4" />
          <span>Guides & Releases</span>
          {activeSubTab === "docs" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("feedback")}
          className={`pb-3 flex items-center gap-2 relative cursor-pointer ${activeSubTab === "feedback" ? "text-[#4F46E5]" : "hover:text-slate-700"}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Feedback Portal</span>
          {activeSubTab === "feedback" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5]" />
          )}
        </button>
      </div>

      {/* SUB-TAB PANELS */}

      {/* FAQ Center */}
      {activeSubTab === "help" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fade-in">
          <div className="glass-card lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search FAQ topics..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="glass-input pl-9 text-xs w-full"
              />
            </div>

            <div className="space-y-3 pt-2">
              {filteredFAQs.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFAQ(f)}
                  className="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer flex justify-between items-center transition-all"
                >
                  <div>
                    <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono text-[9px] text-slate-500 uppercase">
                      {f.category}
                    </span>
                    <span className="font-bold text-slate-900 block mt-1.5">
                      {f.question}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Details Preview FAQ */}
          <div className="glass-card space-y-4">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
              Article Preview
            </h4>
            {selectedFAQ ? (
              <div className="space-y-3">
                <span className="font-bold text-slate-900 block text-xs">
                  {selectedFAQ.question}
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  {selectedFAQ.answer}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <span>Select a topic to read details</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Guides & Release Notes */}
      {activeSubTab === "docs" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fade-in">
          <div className="glass-card lg:col-span-2 space-y-6">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
              Release Notes
            </h4>

            <div className="relative border-l border-slate-200 ml-4 space-y-6 pt-1">
              {releaseNotes.map((note, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-1 top-1.5 w-2.5 h-2.5 rounded-full bg-[#4F46E5]" />
                  <span className="font-extrabold text-slate-800 block">
                    {note.version} •{" "}
                    <span className="text-slate-400 font-semibold">
                      {note.date}
                    </span>
                  </span>
                  <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-500 font-semibold">
                    {note.features.map((feat, fIdx) => (
                      <li key={fIdx}>{feat}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Downloads Card */}
          <div className="glass-card space-y-4">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
              Documentation Center
            </h4>
            <div className="space-y-2.5">
              <button
                onClick={() =>
                  toast.success("Downloading Administrator PDF Guide.")
                }
                className="w-full text-left p-3 hover:bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center cursor-pointer transition-all"
              >
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-450" /> Administrator
                  Guide
                </span>
                <Download className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() =>
                  toast.success("Downloading ERP Workflow Schema.")
                }
                className="w-full text-left p-3 hover:bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center cursor-pointer transition-all"
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-455" /> Workflow SLA
                  Schemes
                </span>
                <Download className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Board */}
      {activeSubTab === "feedback" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fade-in">
          <div className="glass-card lg:col-span-2">
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">
                Submit System Feedback
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Feedback Category
                  </label>
                  <select
                    value={feedbackCategory}
                    onChange={(e) => setFeedbackCategory(e.target.value)}
                    className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none w-full"
                  >
                    <option value="Bug">Bug Report</option>
                    <option value="Suggestion">User Suggestion</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Priority Level
                  </label>
                  <select
                    value={feedbackPriority}
                    onChange={(e) => setFeedbackPriority(e.target.value)}
                    className="bg-white border border-[#E5E7EB] rounded-[14px] px-3.5 h-12 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none w-full"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={feedbackSubject}
                  onChange={(e) => setFeedbackSubject(e.target.value)}
                  placeholder="e.g. Broken QR scanner modal on Mobile Safari"
                  className="glass-input text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Event Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedbackDesc}
                  onChange={(e) => setFeedbackDesc(e.target.value)}
                  placeholder="Provide logs or reproduction steps..."
                  className="glass-input text-xs p-3 font-semibold w-full"
                />
              </div>

              <button
                type="submit"
                className="btn-primary text-white py-2.5 px-5 font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_4px_14px_rgba(79,70,229,.25)]"
              >
                <MessageSquare className="w-4 h-4" /> Send Feedback
              </button>
            </form>
          </div>

          {/* Feedback Queue history */}
          <div className="glass-card space-y-4">
            <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider font-bold">
              Feedback Ticket Queue
            </h4>
            <div className="space-y-3.5">
              {feedbackHistory.length === 0 ? (
                <div className="text-center py-6 text-slate-405 italic">
                  No feedback tickets logged.
                </div>
              ) : (
                feedbackHistory.map((f) => (
                  <div
                    key={f.id}
                    className="p-3 bg-slate-50 border rounded-xl leading-relaxed"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">
                        {f.subject}
                      </span>
                      <span className="bg-white border px-1.5 py-0.5 rounded font-mono text-[8px] uppercase">
                        {f.category}
                      </span>
                    </div>
                    <span className="text-[9.5px] text-slate-400 block mt-1.5">
                      Status: {f.status} • {f.date}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHelpCenter;
