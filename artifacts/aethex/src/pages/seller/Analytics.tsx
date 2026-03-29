import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { SellerLayout, SellerPageHeader } from "@/components/seller/SellerLayout";
import { formatINR } from "@/lib/utils";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function SellerAnalytics({ seller, onLogout }: { seller: any; onLogout: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"daily" | "monthly">("monthly");
  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    fetch(`${apiBase}/api/seller/analytics`, { headers: { "x-seller-code": seller?.sellerCode } })
      .then(r => r.json()).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const demoMonthly = [
    { name: "Oct 25", revenue: 18400, orders: 22 },
    { name: "Nov 25", revenue: 24700, orders: 31 },
    { name: "Dec 25", revenue: 42100, orders: 54 },
    { name: "Jan 26", revenue: 38500, orders: 47 },
    { name: "Feb 26", revenue: 53200, orders: 68 },
    { name: "Mar 26", revenue: 61500, orders: 78 },
  ];

  const chartData = period === "monthly"
    ? (data?.monthlyRevenue?.length > 0 ? data.monthlyRevenue.map((m: any) => ({ name: m.month, revenue: parseFloat(m.revenue), orders: parseInt(m.orders) })) : demoMonthly)
    : (data?.dailyRevenue?.length > 0 ? data.dailyRevenue.map((m: any) => ({ name: m.day, revenue: parseFloat(m.revenue), orders: parseInt(m.orders) })) : demoMonthly.map(m => ({ ...m, revenue: m.revenue / 30 })));

  const orderBreakdown = data?.orderBreakdown?.length > 0
    ? data.orderBreakdown.map((o: any) => ({ name: o.status, value: parseInt(o.count) }))
    : [{ name: "delivered", value: 54 }, { name: "shipped", value: 8 }, { name: "accepted", value: 4 }, { name: "pending", value: 2 }, { name: "rejected", value: 1 }];

  const topProducts = data?.topByRevenue?.length > 0 ? data.topByRevenue : [];

  if (loading) return (
    <SellerLayout seller={seller} onLogout={onLogout}>
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    </SellerLayout>
  );

  return (
    <SellerLayout seller={seller} onLogout={onLogout}>
      <div className="p-8">
        <SellerPageHeader title="Analytics" subtitle="Understand your store performance"
          action={
            <div className="flex bg-[#141821] border border-white/5 rounded-xl p-1">
              {(["monthly", "daily"] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${period === p ? "bg-primary text-white" : "text-slate-400 hover:text-white"}`}>
                  {p}
                </button>
              ))}
            </div>
          }
        />

        {/* Revenue + Orders Chart */}
        <div className="bg-[#141821] border border-white/5 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-white mb-1">Revenue & Orders</h3>
          <p className="text-slate-500 text-xs mb-5">{period === "monthly" ? "Last 6 months" : "Last 30 days"}</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e2533", border: "1px solid #ffffff10", borderRadius: "12px" }} labelStyle={{ color: "#e2e8f0" }} />
              <Legend wrapperStyle={{ color: "#94a3b8", fontSize: "12px" }} />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} name="Revenue (₹)" />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} dot={false} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Order Breakdown Pie */}
          <div className="bg-[#141821] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-5">Order Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={orderBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={10}>
                  {orderBreakdown.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1e2533", border: "1px solid #ffffff10", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products by Revenue Bar */}
          {topProducts.length > 0 ? (
            <div className="bg-[#141821] border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-5">Top Products by Revenue</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topProducts.map((p: any) => ({ name: p.name.slice(0, 20), revenue: parseFloat(p.revenue || 0) }))} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} width={120} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e2533", border: "1px solid #ffffff10", borderRadius: "8px" }} formatter={(v: number) => [formatINR(v), "Revenue"]} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-[#141821] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <p className="text-slate-400 font-semibold">Product data will appear</p>
              <p className="text-slate-500 text-sm mt-1">After your first confirmed sales</p>
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
}
