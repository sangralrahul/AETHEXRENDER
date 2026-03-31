import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Package, CheckCircle2, Truck, MapPin, Clock, AlertCircle, XCircle,
  ChevronRight, Search, Copy, ExternalLink, RotateCcw, ArrowLeft
} from "lucide-react";
import { useSession } from "@/hooks/use-session";

interface OrderItem { name: string; quantity: number; price: string; imageUrl?: string; }
interface DeliveryAddress { line1: string; line2?: string; city: string; state: string; pincode: string; }
interface StatusHistoryEntry { status: string; timestamp: string; note?: string; }

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: string;
  tax: string;
  deliveryFee: string;
  total: string;
  deliveryAddress: DeliveryAddress;
  status: string;
  estimatedDelivery?: string;
  courierName?: string;
  trackingNumber?: string;
  courierUrl?: string;
  cancellationReason?: string;
  refundStatus?: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
}

const STATUS_STEPS = [
  { key: "placed", label: "Order Placed", icon: Package, desc: "Your order has been received" },
  { key: "payment_confirmed", label: "Payment Confirmed", icon: CheckCircle2, desc: "Payment verified" },
  { key: "processing", label: "Processing", icon: RotateCcw, desc: "Being prepared for dispatch" },
  { key: "shipped", label: "Shipped", icon: Truck, desc: "On the way to you" },
  { key: "out_for_delivery", label: "Out for Delivery", icon: MapPin, desc: "Your delivery agent is nearby" },
  { key: "delivered", label: "Delivered", icon: CheckCircle2, desc: "Successfully delivered" },
];

const STATUS_ORDER: Record<string, number> = {
  placed: 0, payment_failed: 0.5, payment_confirmed: 1,
  processing: 2, shipped: 3, out_for_delivery: 4, delivered: 5, cancelled: -1,
};

function getStepStatus(stepKey: string, currentStatus: string): "completed" | "active" | "pending" {
  if (currentStatus === "cancelled") return "pending";
  const currentIdx = STATUS_ORDER[currentStatus] ?? 0;
  const stepIdx = STATUS_ORDER[stepKey] ?? 0;
  if (stepIdx < currentIdx) return "completed";
  if (stepIdx === currentIdx) return "active";
  return "pending";
}

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function formatDateTime(ts: string): string {
  return new Date(ts).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
function formatCurrency(v: string | number): string { return `₹${Number(v).toFixed(2)}`; }

export default function OrderTracking() {
  const [location] = useLocation();
  const sessionId = useSession();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"track" | "my-orders">("track");

  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qOrderId = params.get("orderId");
    const qEmail = params.get("email") ?? "";
    if (qOrderId) {
      setOrderId(qOrderId);
      if (qEmail) setEmail(qEmail);
      setLoading(true);
      setError("");
      setOrder(null);
      const url = new URL(`${apiBase}/api/orders/track`, window.location.origin);
      url.searchParams.set("orderId", qOrderId);
      if (qEmail) url.searchParams.set("email", qEmail);
      fetch(url.toString())
        .then(r => r.json())
        .then(data => { if (data.order) setOrder(data.order); else setError(data.error ?? "Order not found"); })
        .catch(() => setError("Network error. Please try again."))
        .finally(() => setLoading(false));
    }
  }, [location]);

  useEffect(() => {
    if (sessionId && activeTab === "my-orders") fetchMyOrders();
  }, [sessionId, activeTab]);

  const handleTrack = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true); setError(""); setOrder(null);
    try {
      const params = new URLSearchParams({ orderId: orderId.trim() });
      if (email.trim()) params.set("email", email.trim());
      const res = await fetch(`${apiBase}/api/orders/track?${params}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Order not found"); return; }
      setOrder(data.order);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const fetchMyOrders = async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`${apiBase}/api/orders/my?sessionId=${sessionId}`);
      const data = await res.json();
      if (res.ok) setMyOrders(data.orders ?? []);
    } catch {}
  };

  const copyTracking = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isCancelled = order?.status === "cancelled";

  return (
    <div className="min-h-screen" style={{ background: "#F2F2F7", color: "#1C1C1E" }}>
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <a href="/products" className="inline-flex items-center gap-1 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: "#636366" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </a>
          <h1 className="text-2xl font-bold" style={{ color: "#1C1C1E" }}>Track Your Order</h1>
          <p className="text-sm mt-1" style={{ color: "#636366" }}>Enter your order details to see live status</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["track", "my-orders"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab ? "rgba(0,122,255,0.1)" : "rgba(60,60,67,0.06)",
                color: activeTab === tab ? "#007AFF" : "#636366",
                border: `1px solid ${activeTab === tab ? "rgba(0,122,255,0.25)" : "rgba(60,60,67,0.15)"}`,
              }}>
              {tab === "track" ? "Track by Order ID" : "My Orders"}
            </button>
          ))}
        </div>

        {activeTab === "track" && (
          <>
            {/* Search Form */}
            <form onSubmit={handleTrack} className="rounded-xl p-5 mb-6" style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.12)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#636366" }}>Order ID *</label>
                  <input
                    value={orderId} onChange={e => setOrderId(e.target.value)}
                    placeholder="e.g. AX-2025-4821"
                    className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
                    style={{ background: "#F2F2F7", border: "1px solid rgba(60,60,67,0.15)", color: "#1C1C1E" }}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#636366" }}>Email (optional)</label>
                  <input
                    value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Registered email"
                    type="email"
                    className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
                    style={{ background: "#F2F2F7", border: "1px solid rgba(60,60,67,0.15)", color: "#1C1C1E" }}
                  />
                </div>
                <div className="flex items-end">
                  <button type="submit" disabled={loading || !orderId.trim()}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                    style={{ background: "#007AFF", color: "#FFFFFF" }}>
                    {loading ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    {loading ? "Searching..." : "Track"}
                  </button>
                </div>
              </div>
              {error && (
                <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: "#FF3B30" }}>
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}
            </form>

            {/* Order Card */}
            {order && (
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(60,60,67,0.12)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                {/* Order Header */}
                <div className="px-5 py-4 flex flex-wrap items-start justify-between gap-3" style={{ background: "#FFFFFF", borderBottom: "1px solid rgba(60,60,67,0.1)" }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg" style={{ color: "#1C1C1E" }}>#{order.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: isCancelled ? "rgba(255,59,48,0.1)" : order.status === "delivered" ? "rgba(52,199,89,0.12)" : "rgba(0,122,255,0.1)",
                          color: isCancelled ? "#FF3B30" : order.status === "delivered" ? "#34C759" : "#007AFF",
                          border: `1px solid ${isCancelled ? "rgba(255,59,48,0.25)" : order.status === "delivered" ? "rgba(52,199,89,0.25)" : "rgba(0,122,255,0.2)"}`,
                        }}>
                        {order.status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#636366" }}>Placed on {formatDate(order.createdAt)}</div>
                  </div>
                  {order.estimatedDelivery && !isCancelled && (
                    <div className="text-right">
                      <div className="text-xs" style={{ color: "#636366" }}>
                        {order.status === "delivered" ? "Delivered on" : "Est. Delivery"}
                      </div>
                      <div className="font-semibold text-sm" style={{ color: "#007AFF" }}>{formatDate(order.estimatedDelivery)}</div>
                    </div>
                  )}
                </div>

                {/* Cancelled Banner */}
                {isCancelled && (
                  <div className="px-5 py-3 flex items-start gap-3" style={{ background: "rgba(255,59,48,0.06)", borderBottom: "1px solid rgba(255,59,48,0.15)" }}>
                    <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#FF3B30" }} />
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "#FF3B30" }}>Order Cancelled</div>
                      {order.cancellationReason && <div className="text-xs mt-0.5" style={{ color: "#636366" }}>{order.cancellationReason}</div>}
                      {order.refundStatus && <div className="text-xs mt-1" style={{ color: "#636366" }}>Refund: {order.refundStatus} (5-7 business days)</div>}
                    </div>
                  </div>
                )}

                {/* Progress Stepper */}
                {!isCancelled && (
                  <div className="px-5 py-6" style={{ background: "#F9F9FB", borderBottom: "1px solid rgba(60,60,67,0.1)" }}>
                    <div className="relative">
                      <div className="absolute left-4 top-4 bottom-4 w-0.5" style={{ background: "rgba(60,60,67,0.12)" }} />
                      <div className="space-y-0">
                        {STATUS_STEPS.map((step, i) => {
                          const stepStatus = getStepStatus(step.key, order.status);
                          const historyEntry = order.statusHistory?.find(h => h.status === step.key);
                          const Icon = step.icon;
                          return (
                            <div key={step.key} className="flex gap-4 relative pb-0">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all"
                                style={{
                                  background: stepStatus === "completed" ? "#00A893" : stepStatus === "active" ? "#007AFF" : "#E5E5EA",
                                  border: `2px solid ${stepStatus === "completed" ? "#00A893" : stepStatus === "active" ? "#007AFF" : "#E5E5EA"}`,
                                }}>
                                <Icon className="w-4 h-4" style={{ color: stepStatus === "pending" ? "#AEAEB2" : "#fff" }} />
                              </div>
                              <div className={`flex-1 pb-6 ${i === STATUS_STEPS.length - 1 ? "pb-0" : ""}`}>
                                <div className="flex items-center justify-between">
                                  <div className="font-medium text-sm" style={{ color: stepStatus === "pending" ? "#AEAEB2" : "#1C1C1E" }}>
                                    {step.label}
                                  </div>
                                  {historyEntry && (
                                    <div className="text-xs" style={{ color: "#AEAEB2" }}>{formatDateTime(historyEntry.timestamp)}</div>
                                  )}
                                </div>
                                <div className="text-xs mt-0.5" style={{ color: "#AEAEB2" }}>{step.desc}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Courier Info */}
                {order.courierName && order.trackingNumber && (
                  <div className="px-5 py-4" style={{ background: "#FFFFFF", borderBottom: "1px solid rgba(60,60,67,0.1)" }}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#AEAEB2" }}>Shipping Details</div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium" style={{ color: "#1C1C1E" }}>{order.courierName}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono" style={{ color: "#007AFF" }}>{order.trackingNumber}</span>
                          <button onClick={copyTracking} className="p-0.5 rounded hover:opacity-80 transition-opacity">
                            {copied ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#34C759" }} /> : <Copy className="w-3.5 h-3.5" style={{ color: "#AEAEB2" }} />}
                          </button>
                        </div>
                      </div>
                      {order.courierUrl && (
                        <a href={order.courierUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                          style={{ background: "rgba(0,122,255,0.1)", color: "#007AFF", border: "1px solid rgba(0,122,255,0.2)" }}>
                          <ExternalLink className="w-3.5 h-3.5" /> Track on Courier Site
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="px-5 py-4" style={{ background: "#FFFFFF", borderBottom: "1px solid rgba(60,60,67,0.1)" }}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#AEAEB2" }}>Items Ordered</div>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium" style={{ color: "#1C1C1E" }}>{item.name}</div>
                          <div className="text-xs" style={{ color: "#636366" }}>Qty: {item.quantity}</div>
                        </div>
                        <div className="text-sm font-semibold" style={{ color: "#007AFF" }}>{formatCurrency(Number(item.price) * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bill Summary */}
                <div className="px-5 py-4" style={{ background: "#F9F9FB", borderBottom: "1px solid rgba(60,60,67,0.1)" }}>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm" style={{ color: "#636366" }}>
                      <span>Subtotal</span><span style={{ color: "#1C1C1E" }}>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm" style={{ color: "#636366" }}>
                      <span>Tax</span><span style={{ color: "#1C1C1E" }}>{formatCurrency(order.tax)}</span>
                    </div>
                    <div className="flex justify-between text-sm" style={{ color: "#636366" }}>
                      <span>Delivery</span><span style={{ color: "#1C1C1E" }}>{formatCurrency(order.deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-1.5" style={{ borderTop: "1px solid rgba(60,60,67,0.12)" }}>
                      <span style={{ color: "#1C1C1E" }}>Total</span><span style={{ color: "#007AFF", fontSize: "16px" }}>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="px-5 py-4" style={{ background: "#FFFFFF" }}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#AEAEB2" }}>Delivery Address</div>
                  <div className="text-sm" style={{ color: "#1C1C1E" }}>
                    <div className="font-medium">{order.customerName}</div>
                    <div style={{ color: "#636366" }}>
                      {order.deliveryAddress.line1}{order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : ""},
                      {" "}{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                    </div>
                    {order.customerPhone && <div style={{ color: "#636366" }}>{order.customerPhone}</div>}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* My Orders Tab */}
        {activeTab === "my-orders" && (
          <div className="space-y-3">
            {myOrders.length === 0 ? (
              <div className="text-center py-16 rounded-xl" style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.12)" }}>
                <Package className="w-12 h-12 mx-auto mb-3" style={{ color: "#AEAEB2" }} />
                <div className="font-semibold" style={{ color: "#1C1C1E" }}>No orders yet</div>
                <div className="text-sm mt-1" style={{ color: "#636366" }}>Your orders will appear here once placed.</div>
                <a href="/products" className="inline-block mt-4 px-5 py-2 rounded-lg text-sm font-semibold" style={{ background: "#007AFF", color: "#FFFFFF" }}>
                  Browse Products
                </a>
              </div>
            ) : myOrders.map(o => (
              <button key={o.id} onClick={() => { setOrderId(o.id); setEmail(o.customerEmail); setActiveTab("track"); setTimeout(handleTrack, 100); }}
                className="w-full text-left rounded-xl px-5 py-4 transition-all hover:shadow-md"
                style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.12)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "#1C1C1E" }}>#{o.id}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#636366" }}>{o.items.length} item{o.items.length !== 1 ? "s" : ""} · {formatDate(o.createdAt)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: "#007AFF" }}>{formatCurrency(o.total)}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,122,255,0.08)", color: "#007AFF", border: "1px solid rgba(0,122,255,0.15)" }}>
                      {o.status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                    <ChevronRight className="w-4 h-4" style={{ color: "#AEAEB2" }} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
