import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Check, X, FileText, Loader2, Store, BadgeCheck, Clock, Building2, Phone, Mail, MapPin, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_TABS = ["pending", "approved", "rejected"] as const;

export default function AdminSellers() {
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState<Record<number, string>>({});
  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  const fetch_ = () => {
    setLoading(true);
    fetch(`${apiBase}/api/admin/sellers?status=${tab}`)
      .then(r => r.json()).then(d => setSellers(d.sellers ?? [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(fetch_, [tab]);

  const moderate = async (id: number, action: string, reason?: string) => {
    setActioning(id);
    try {
      const res = await fetch(`${apiBase}/api/admin/sellers/${id}/moderate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, rejectionReason: reason }),
      });
      if (res.ok) { fetch_(); setExpanded(null); }
    } finally { setActioning(null); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-[#1c1c1e] mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center"><Store className="w-5 h-5 text-[#1c1c1e]" /></div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-[#1c1c1e]">Seller Applications</h1>
            <p className="text-slate-500 text-sm">Review and manage seller onboarding</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-black/10 rounded-xl p-1 w-fit shadow-sm">
          {STATUS_TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all",
                tab === t ? "bg-primary text-[#1c1c1e] shadow" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-[#1c1c1e]")}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />)}</div>
        ) : sellers.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
            <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="font-semibold text-slate-500 dark:text-slate-400">No {tab} applications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sellers.map(s => (
              <div key={s.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary text-lg shrink-0">
                    {s.businessName?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-[#1c1c1e]">{s.businessName}</h3>
                      {s.verified && <BadgeCheck className="w-4 h-4 text-primary" />}
                      {s.sellerCode && <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{s.sellerCode}</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{s.ownerName}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{s.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{s.phone}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.pincode}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                      <span className="bg-slate-100 dark:bg-black/5 px-2 py-0.5 rounded-full font-medium">{s.businessCategory}</span>
                      <span className="font-mono">GST: {s.gstNumber}</span>
                      <span className="flex items-center gap-1 text-slate-400"><Clock className="w-3 h-3" />{new Date(s.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                    {s.rejectionReason && <p className="mt-2 text-xs text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-lg">{s.rejectionReason}</p>}
                  </div>

                  {/* Actions */}
                  {tab === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => moderate(s.id, "approve")} disabled={actioning === s.id}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all">
                        {actioning === s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Approve
                      </button>
                      <button onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all">
                        <X className="w-3 h-3" /> Reject
                      </button>
                      <button onClick={() => setExpanded(expanded === s.id ? null : s.id + 10000)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all">
                        <FileText className="w-3 h-3" /> Request Docs
                      </button>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {expanded !== null && (expanded === s.id || expanded === s.id + 10000) && (
                  <div className="border-t border-slate-100 dark:border-white/5 p-5 bg-slate-50 dark:bg-white/[0.02]">
                    <div className="flex gap-3 items-start">
                      <textarea
                        value={rejectReason[s.id] ?? ""}
                        onChange={e => setRejectReason(r => ({ ...r, [s.id]: e.target.value }))}
                        placeholder={expanded === s.id + 10000 ? "Describe what additional documents are required..." : "Provide reason for rejection..."}
                        rows={2}
                        className="flex-1 px-4 py-2.5 bg-white dark:bg-black/5 border border-slate-200 dark:border-black/10 rounded-xl text-slate-800 dark:text-[#1c1c1e] text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                      />
                      <button
                        onClick={() => moderate(s.id, expanded === s.id + 10000 ? "request_docs" : "reject", rejectReason[s.id])}
                        disabled={actioning === s.id}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-500 text-[#1c1c1e] rounded-xl text-sm font-semibold hover:bg-rose-600 transition-all disabled:opacity-60">
                        {actioning === s.id && <Loader2 className="w-3 h-3 animate-spin" />}
                        {expanded === s.id + 10000 ? "Request" : "Confirm Reject"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Bank Info (collapsed) */}
                <div className="border-t border-slate-100 dark:border-white/5 px-5 py-3 bg-slate-50/50 dark:bg-white/[0.01] flex items-center gap-2 text-xs text-slate-400">
                  <CreditCard className="w-3 h-3" />
                  <span>Bank: {s.bankIfsc}</span>
                  <span>·</span>
                  <span>Address: {s.address}, {s.pincode}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
