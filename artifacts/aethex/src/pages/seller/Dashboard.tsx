import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Package, AlertTriangle, TrendingUp, IndianRupee, ShoppingBag, Clock, BadgeCheck, Eye } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SellerLayout, SellerPageHeader, StatCard } from "@/components/seller/SellerLayout";
import { formatINR } from "@/lib/utils";

interface SellerDashboardProps { seller: any; onLogout: () => void; }

const COMMISSION = 0.10;

export default function SellerDashboard({ seller, onLogout }: SellerDashboardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");
  const sellerCode = seller?.sellerCode;

  useEffect(() => {
    fetch(`${apiBase}/api/seller/dashboard`, { headers: { "x-seller-code": sellerCode } })
      .then(r => r.json()).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [sellerCode]);

  if (loading) return (
    <SellerLayout seller={seller} onLogout={onLogout}>
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    </SellerLayout>
  );

  const stats = data?.stats ?? {};
  const topProducts = data?.topProducts ?? [];
  const monthlyRevenue = data?.monthlyRevenue ?? [];

  const chartData = monthlyRevenue.length > 0 ? monthlyRevenue.map((m: any) => ({
    name: m.month, revenue: parseFloat(m.revenue || "0"), orders: parseInt(m.orders || "0"),
  })) : [
    { name: "Oct 25", revenue: 18400, orders: 22 },
    { name: "Nov 25", revenue: 24700, orders: 31 },
    { name: "Dec 25", revenue: 42100, orders: 54 },
    { name: "Jan 26", revenue: 38500, orders: 47 },
    { name: "Feb 26", revenue: 53200, orders: 68 },
    { name: "Mar 26", revenue: 61500, orders: 78 },
  ];

  return (
    <SellerLayout seller={seller} onLogout={onLogout}>
      <div className="p-8">
        <SellerPageHeader title={`Welcome, ${seller?.ownerName?.split(" ")[0]} 👋`} subtitle="Here's your store performance at a glance" />

        {/* Vacation Mode Banner */}
        {data?.seller?.vacationMode && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-amber-300 font-semibold text-sm">Vacation Mode is ON</p>
              <p className="text-amber-400/70 text-xs">Your products are hidden from the store. Disable in Settings to resume selling.</p>
            </div>
          </div>
        )}

        {/* Commission Notice */}
        <div className="mb-6 bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3 text-sm">
          <IndianRupee className="w-4 h-4 text-primary shrink-0" />
          <span className="text-slate-300">Aethex charges <strong className="text-primary">10% commission</strong> per sale. You receive <strong className="text-primary">90%</strong> of each transaction, paid every 7 days (min. ₹500 threshold).</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Revenue" value={formatINR(stats.totalRevenue ?? 0)} sub={`Net: ${formatINR(stats.netRevenue ?? 0)}`} color="emerald" />
          <StatCard label="Total Orders" value={stats.totalOrders ?? 0} sub={`${stats.deliveredOrders ?? 0} delivered`} color="primary" />
          <StatCard label="Live Products" value={stats.liveProducts ?? 0} sub={`${stats.pendingProducts ?? 0} pending approval`} color="violet" />
          <StatCard label="Pending Payout" value={formatINR(stats.pendingPayout ?? 0)} sub="Next: in 7 days" color="amber" />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Pending Orders", val: stats.pendingOrders ?? 0, icon: Clock, color: "text-amber-400" },
            { label: "Shipped", val: stats.shippedOrders ?? 0, icon: ShoppingBag, color: "text-blue-400" },
            { label: "Commission Paid", val: formatINR(stats.commissionPaid ?? 0), icon: IndianRupee, color: "text-rose-400" },
            { label: "Low Stock Items", val: stats.lowStockProducts ?? 0, icon: AlertTriangle, color: "text-orange-400" },
          ].map(({ label, val, icon: Icon, color }) => (
            <div key={label} className="bg-[#141821] border border-white/5 rounded-xl p-4">
              <div className={`flex items-center gap-2 mb-1 ${color}`}>
                <Icon className="w-4 h-4" />
                <span className="text-xs font-semibold">{label}</span>
              </div>
              <div className="text-xl font-bold text-white">{val}</div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-[#141821] border border-white/5 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-white mb-6">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ backgroundColor: "#1e2533", border: "1px solid #ffffff10", borderRadius: "12px" }} labelStyle={{ color: "#e2e8f0" }} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        {topProducts.length > 0 && (
          <div className="bg-[#141821] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">Top Performing Products</h3>
              <Link href="/seller/products" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {topProducts.map((p: any, i: number) => (
                <div key={p.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                  <span className="w-6 text-slate-500 text-sm font-bold text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{p.name}</div>
                    <div className="text-xs text-slate-400">{p.sales} sold · {p.stock} in stock</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-emerald-400 text-sm">{formatINR(parseFloat(p.revenue || 0))}</div>
                    <div className="text-xs text-slate-500">{formatINR(parseFloat(p.price))} / unit</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
