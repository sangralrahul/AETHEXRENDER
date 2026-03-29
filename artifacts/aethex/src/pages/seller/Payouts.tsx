import { useState, useEffect } from "react";
import { CreditCard, CheckCircle2, Clock, IndianRupee, Info } from "lucide-react";
import { SellerLayout, SellerPageHeader } from "@/components/seller/SellerLayout";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function SellerPayouts({ seller, onLogout }: { seller: any; onLogout: () => void }) {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    fetch(`${apiBase}/api/seller/payouts`, { headers: { "x-seller-code": seller?.sellerCode } })
      .then(r => r.json()).then(d => setPayouts(d.payouts ?? [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalPaid = payouts.filter(p => p.status === "paid").reduce((s, p) => s + parseFloat(p.netAmount), 0);
  const pendingAmount = payouts.filter(p => p.status === "pending").reduce((s, p) => s + parseFloat(p.netAmount), 0);

  return (
    <SellerLayout seller={seller} onLogout={onLogout}>
      <div className="p-8">
        <SellerPageHeader title="Payouts" subtitle="Track your earnings and payout history" />

        {/* Info Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-slate-300">
            <p className="font-semibold text-white mb-1">Payout Policy</p>
            <p>Aethex charges <strong className="text-primary">10% commission</strong> on each sale. Your <strong className="text-white">90%</strong> is processed every 7 days automatically to your registered bank account. Minimum payout threshold: <strong className="text-white">₹500</strong>.</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Paid Out", value: formatINR(totalPaid), icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
            { label: "Pending Amount", value: formatINR(pendingAmount), icon: Clock, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
            { label: "Total Payouts", value: payouts.length, icon: CreditCard, color: "text-primary bg-primary/10 border-primary/20" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={cn("rounded-2xl border p-5 bg-[#141821]", color)}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
            </div>
          ))}
        </div>

        {/* Payout History */}
        <div className="bg-[#141821] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h3 className="font-bold text-white">Payout History</h3>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl" />)}</div>
          ) : payouts.length === 0 ? (
            <div className="p-10 text-center">
              <IndianRupee className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-semibold">No payouts yet</p>
              <p className="text-slate-500 text-sm mt-1">Your first payout will appear here after 7 days of confirmed sales</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {payouts.map(payout => (
                <div key={payout.id} className="p-5 flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", payout.status === "paid" ? "bg-emerald-500/10" : "bg-amber-500/10")}>
                    {payout.status === "paid" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Clock className="w-5 h-5 text-amber-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm">
                      {new Date(payout.periodStart).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – {new Date(payout.periodEnd).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <div className="text-xs text-slate-500">
                      Gross: {formatINR(parseFloat(payout.amount))} · Commission: {formatINR(parseFloat(payout.commissionDeducted))}
                      {payout.transactionRef && ` · Ref: ${payout.transactionRef}`}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-white">{formatINR(parseFloat(payout.netAmount))}</div>
                    <div className={cn("text-xs font-semibold capitalize", payout.status === "paid" ? "text-emerald-400" : "text-amber-400")}>{payout.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
}
