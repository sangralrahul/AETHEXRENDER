import { useState, useEffect } from "react";
import { Check, X, Truck, MapPin, Package, Loader2, Download, Phone } from "lucide-react";
import { SellerLayout, SellerPageHeader } from "@/components/seller/SellerLayout";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-amber-400 bg-amber-500/10" },
  accepted: { label: "Accepted", color: "text-blue-400 bg-blue-500/10" },
  shipped: { label: "Shipped", color: "text-violet-400 bg-violet-500/10" },
  delivered: { label: "Delivered", color: "text-emerald-400 bg-emerald-500/10" },
  rejected: { label: "Rejected", color: "text-rose-400 bg-rose-500/10" },
};

const TABS = ["all", "pending", "accepted", "shipped", "delivered"];

export default function SellerOrders({ seller, onLogout }: { seller: any; onLogout: () => void }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [shippingModal, setShippingModal] = useState<any | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierName, setCourierName] = useState("");
  const [actioning, setActioning] = useState<number | null>(null);
  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");
  const headers = { "Content-Type": "application/json", "x-seller-code": seller?.sellerCode };

  const fetchOrders = () => {
    const params = tab !== "all" ? `?status=${tab}` : "";
    fetch(`${apiBase}/api/seller/orders${params}`, { headers }).then(r => r.json()).then(d => setOrders(d.orders ?? [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { setLoading(true); fetchOrders(); }, [tab]);

  const doAction = async (id: number, action: string, extra?: any) => {
    setActioning(id);
    try {
      const res = await fetch(`${apiBase}/api/seller/orders/${id}`, {
        method: "PUT", headers, body: JSON.stringify({ action, ...extra }),
      });
      if (res.ok) fetchOrders();
    } finally { setActioning(null); setShippingModal(null); setTrackingNumber(""); setCourierName(""); }
  };

  const downloadPackingSlip = (order: any) => {
    const content = `
AETHEX PACKING SLIP
===================
Order ID: ${order.orderId}
Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}
Seller: ${seller.businessName} (${seller.sellerCode})

ITEMS:
- ${order.productName} x${order.quantity} @ ${formatINR(parseFloat(order.unitPrice))} = ${formatINR(parseFloat(order.totalPrice))}

DELIVER TO:
${order.customerName}
${order.customerAddress}
Ph: ${order.customerPhone}

Commission (10%): ${formatINR(parseFloat(order.commissionAmount))}
Your Earnings: ${formatINR(parseFloat(order.netAmount))}
    `.trim();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `packing-slip-${order.orderId}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SellerLayout seller={seller} onLogout={onLogout}>
      <div className="p-8">
        <SellerPageHeader title="Orders" subtitle={`${orders.length} orders${tab !== "all" ? ` (${tab})` : ""}`} />

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#141821] border border-white/5 rounded-xl p-1 w-fit">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all", tab === t ? "bg-primary text-[#1c1c1e]" : "text-slate-400 hover:text-[#1c1c1e]")}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-28 bg-[#141821] animate-pulse rounded-xl" />)}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-[#141821] rounded-2xl border border-white/5">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-semibold">No {tab !== "all" ? tab : ""} orders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const sc = STATUS_CONFIG[order.status] ?? { label: order.status, color: "text-slate-400 bg-black/5" };
              return (
                <div key={order.id} className="bg-[#141821] border border-white/5 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#1c1c1e] text-sm">#{order.orderId}</span>
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", sc.color)}>{sc.label}</span>
                      </div>
                      <div className="font-semibold text-[#1c1c1e]">{order.productName} × {order.quantity}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-emerald-400">{formatINR(parseFloat(order.netAmount))}</div>
                      <div className="text-xs text-slate-500">Your share (90%)</div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-black/5 rounded-xl p-3 mb-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-sm text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {order.customerName}, {order.customerAddress}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {order.customerPhone}
                    </div>
                    {order.trackingNumber && (
                      <div className="flex items-center gap-1.5 text-xs text-primary font-mono">
                        <Truck className="w-3 h-3 shrink-0" /> {order.courierName} · {order.trackingNumber}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {order.status === "pending" && (
                      <>
                        <button onClick={() => doAction(order.id, "accept")} disabled={actioning === order.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 rounded-lg hover:bg-emerald-500/20 transition-all">
                          {actioning === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Accept
                        </button>
                        <button onClick={() => doAction(order.id, "reject")} disabled={actioning === order.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 rounded-lg hover:bg-rose-500/20 transition-all">
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </>
                    )}
                    {order.status === "accepted" && (
                      <button onClick={() => setShippingModal(order)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-all">
                        <Truck className="w-3 h-3" /> Mark as Shipped
                      </button>
                    )}
                    {order.status === "shipped" && (
                      <button onClick={() => doAction(order.id, "deliver")}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 rounded-lg hover:bg-emerald-500/20 transition-all">
                        <Check className="w-3 h-3" /> Mark Delivered
                      </button>
                    )}
                    <button onClick={() => downloadPackingSlip(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 bg-black/5 rounded-lg hover:bg-black/10 transition-all">
                      <Download className="w-3 h-3" /> Packing Slip
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Ship Modal */}
        {shippingModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#141821] border border-black/10 rounded-2xl p-6 w-full max-w-sm">
              <h3 className="font-bold text-[#1c1c1e] mb-4">Mark as Shipped</h3>
              <div className="space-y-3 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Courier Name</label>
                  <input value={courierName} onChange={e => setCourierName(e.target.value)} placeholder="e.g. Delhivery, Blue Dart"
                    className="w-full px-4 py-2.5 bg-black/5 border border-black/10 rounded-xl text-[#1c1c1e] text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Tracking Number</label>
                  <input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="AWB / Tracking ID"
                    className="w-full px-4 py-2.5 bg-black/5 border border-black/10 rounded-xl text-[#1c1c1e] text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => doAction(shippingModal.id, "ship", { trackingNumber, courierName })}
                  className="flex-1 py-2.5 bg-primary text-[#1c1c1e] rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all">Confirm Shipment</button>
                <button onClick={() => setShippingModal(null)} className="px-4 py-2.5 text-slate-400 border border-black/10 rounded-xl text-sm">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
