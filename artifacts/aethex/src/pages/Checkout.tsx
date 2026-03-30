import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetCart } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { formatINR } from "@/lib/utils";
import { ChevronRight, MapPin, CreditCard, Smartphone, Landmark, PackageCheck, ShieldCheck, Truck, CheckCircle2, Lock } from "lucide-react";

type Step = "address" | "payment" | "confirm";

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI / QR Code", icon: Smartphone, desc: "Google Pay, PhonePe, BHIM, Paytm" },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: Landmark, desc: "All major Indian banks" },
  { id: "cod", label: "Cash on Delivery", icon: PackageCheck, desc: "Pay when you receive your order" },
];

function StepIndicator({ current, step, label, index }: { current: Step; step: Step; label: string; index: number }) {
  const steps: Step[] = ["address", "payment", "confirm"];
  const currentIdx = steps.indexOf(current);
  const stepIdx = steps.indexOf(step);
  const done = currentIdx > stepIdx;
  const active = current === step;

  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
        done ? "bg-[#00C2A8] text-[#0D1117]"
             : active ? "bg-[#00C2A8]/20 border-2 border-[#00C2A8] text-[#00C2A8]"
             : "bg-white/5 border border-white/15 text-white/30"
      }`}>
        {done ? <CheckCircle2 className="w-4 h-4" /> : index}
      </div>
      <span className={`text-sm font-medium ${active ? "text-white" : done ? "text-[#00C2A8]" : "text-white/30"}`}>{label}</span>
    </div>
  );
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const sessionId = useSession();
  const { data: cart } = useGetCart({ sessionId }, { query: { enabled: !!sessionId } });
  const [step, setStep] = useState<Step>("address");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId] = useState(() => "AX" + Date.now().toString().slice(-8));

  const [addr, setAddr] = useState({
    fullName: "", phone: "", email: "",
    line1: "", line2: "", city: "", state: "Maharashtra", pincode: "",
    saveAddress: false,
  });

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const gst = Math.round(subtotal * 0.18);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + gst + shipping;

  const handleAddressNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setProcessing(false);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-[72px] bg-[#0D1117] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-full bg-[#00C2A8]/20 border-2 border-[#00C2A8] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-[#00C2A8]" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-3">Order Placed!</h1>
          <p className="text-white/60 mb-2">Thank you for your order. You'll receive a confirmation email shortly.</p>
          <p className="text-sm text-[#00C2A8] font-semibold mb-8">Order ID: {orderId}</p>
          <div className="bg-[#161B22] border border-white/8 rounded-2xl p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Items</span>
              <span className="text-white">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">GST (18%)</span>
              <span className="text-white">{formatINR(gst)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Shipping</span>
              <span className="text-white">{shipping === 0 ? "Free" : formatINR(shipping)}</span>
            </div>
            <div className="border-t border-white/8 pt-3 flex justify-between font-bold">
              <span className="text-white">Total Paid</span>
              <span className="text-[#00C2A8]">{formatINR(total)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/orders"
              className="block py-3 bg-[#00C2A8] text-[#0D1117] font-bold rounded-xl hover:bg-[#00D4B8] transition-colors">
              Track Your Order
            </Link>
            <Link href="/shop"
              className="block py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen pt-[72px] bg-[#0D1117] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-white/50 mb-6">Add some products before checking out.</p>
          <Link href="/shop" className="px-6 py-3 bg-[#00C2A8] text-[#0D1117] font-bold rounded-xl">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[72px] bg-[#0D1117] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/cart" className="hover:text-white transition-colors">Cart</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Checkout</span>
        </div>

        <h1 className="text-3xl font-display font-bold text-white mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-2">
          <StepIndicator current={step} step="address" label="Delivery Address" index={1} />
          <div className="flex-1 h-px bg-white/10 min-w-8" />
          <StepIndicator current={step} step="payment" label="Payment" index={2} />
          <div className="flex-1 h-px bg-white/10 min-w-8" />
          <StepIndicator current={step} step="confirm" label="Confirm" index={3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address */}
            {step === "address" && (
              <form onSubmit={handleAddressNext} className="bg-[#161B22] border border-white/8 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-[#00C2A8]" />
                  <h2 className="text-lg font-display font-bold text-white">Delivery Address</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Full Name *</label>
                    <input value={addr.fullName} onChange={e => setAddr(a => ({...a, fullName: e.target.value}))} required
                      placeholder="Dr. Priya Sharma"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#00C2A8]/50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Phone Number *</label>
                    <input value={addr.phone} onChange={e => setAddr(a => ({...a, phone: e.target.value}))} required
                      placeholder="+91 98765 43210" type="tel"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#00C2A8]/50 text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-white/60 mb-1.5">Email Address *</label>
                    <input value={addr.email} onChange={e => setAddr(a => ({...a, email: e.target.value}))} required
                      placeholder="doctor@hospital.in" type="email"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#00C2A8]/50 text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-white/60 mb-1.5">Address Line 1 *</label>
                    <input value={addr.line1} onChange={e => setAddr(a => ({...a, line1: e.target.value}))} required
                      placeholder="House / Flat / Block No., Street Name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#00C2A8]/50 text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-white/60 mb-1.5">Address Line 2</label>
                    <input value={addr.line2} onChange={e => setAddr(a => ({...a, line2: e.target.value}))}
                      placeholder="Landmark, Area (optional)"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#00C2A8]/50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">City *</label>
                    <input value={addr.city} onChange={e => setAddr(a => ({...a, city: e.target.value}))} required
                      placeholder="Mumbai"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#00C2A8]/50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">PIN Code *</label>
                    <input value={addr.pincode} onChange={e => setAddr(a => ({...a, pincode: e.target.value}))} required
                      placeholder="400001" maxLength={6} pattern="[0-9]{6}"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#00C2A8]/50 text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-white/60 mb-1.5">State *</label>
                    <select value={addr.state} onChange={e => setAddr(a => ({...a, state: e.target.value}))} required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00C2A8]/50 text-sm">
                      {INDIA_STATES.map(s => <option key={s} value={s} className="bg-[#161B22]">{s}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit"
                  className="w-full py-3.5 bg-[#00C2A8] text-[#0D1117] font-bold rounded-xl hover:bg-[#00D4B8] transition-colors">
                  Continue to Payment →
                </button>
              </form>
            )}

            {/* Step 2: Payment */}
            {step === "payment" && (
              <div className="bg-[#161B22] border border-white/8 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-5 h-5 text-[#00C2A8]" />
                  <h2 className="text-lg font-display font-bold text-white">Payment Method</h2>
                  <div className="ml-auto flex items-center gap-1.5 text-xs text-white/40">
                    <Lock className="w-3 h-3" />
                    <span>Secured by Razorpay</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map(method => (
                    <label key={method.id} className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? "border-[#00C2A8]/60 bg-[#00C2A8]/8"
                        : "border-white/8 hover:border-white/20"
                    }`}>
                      <input type="radio" name="payment" value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="sr-only" />
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        paymentMethod === method.id ? "bg-[#00C2A8]/20" : "bg-white/5"
                      }`}>
                        <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? "text-[#00C2A8]" : "text-white/40"}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{method.label}</p>
                        <p className="text-xs text-white/40">{method.desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                        paymentMethod === method.id ? "border-[#00C2A8] bg-[#00C2A8]" : "border-white/20"
                      }`}>
                        {paymentMethod === method.id && <div className="w-full h-full rounded-full bg-[#0D1117] scale-[0.4]" />}
                      </div>
                    </label>
                  ))}
                </div>

                {paymentMethod === "upi" && (
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Enter UPI ID</label>
                    <input value={upiId} onChange={e => setUpiId(e.target.value)}
                      placeholder="name@upi or number@paytm"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#00C2A8]/50 text-sm" />
                  </div>
                )}

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-300/80 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>This is a demo checkout. No actual payment will be processed. Razorpay integration is configured for production.</span>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep("address")}
                    className="flex-none px-5 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-sm">
                    ← Back
                  </button>
                  <button onClick={() => setStep("confirm")}
                    className="flex-1 py-3 bg-[#00C2A8] text-[#0D1117] font-bold rounded-xl hover:bg-[#00D4B8] transition-colors">
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === "confirm" && (
              <div className="space-y-5">
                {/* Address Summary */}
                <div className="bg-[#161B22] border border-white/8 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white flex items-center gap-2"><MapPin className="w-4 h-4 text-[#00C2A8]" /> Delivering to</h3>
                    <button onClick={() => setStep("address")} className="text-xs text-[#00C2A8] hover:underline">Edit</button>
                  </div>
                  <p className="text-sm text-white/80 font-medium">{addr.fullName}</p>
                  <p className="text-sm text-white/50">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                  <p className="text-sm text-white/50">{addr.city}, {addr.state} — {addr.pincode}</p>
                  <p className="text-sm text-white/50">{addr.phone}</p>
                </div>

                {/* Payment Summary */}
                <div className="bg-[#161B22] border border-white/8 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white flex items-center gap-2"><CreditCard className="w-4 h-4 text-[#00C2A8]" /> Payment</h3>
                    <button onClick={() => setStep("payment")} className="text-xs text-[#00C2A8] hover:underline">Edit</button>
                  </div>
                  <p className="text-sm text-white/80">{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}</p>
                  {paymentMethod === "upi" && upiId && <p className="text-xs text-white/40 mt-1">{upiId}</p>}
                </div>

                {/* Order Items */}
                <div className="bg-[#161B22] border border-white/8 rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-4">Items ({items.length})</h3>
                  <div className="space-y-3">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex-1 min-w-0">
                          <p className="text-white/80 truncate">{item.productName}</p>
                          <p className="text-white/40 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-white font-medium shrink-0 ml-4">{formatINR(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/8 mt-4 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-white/60">
                      <span>GST Invoice included (18%)</span>
                      <span>{formatINR(gst)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "FREE" : formatINR(shipping)}</span>
                    </div>
                  </div>
                </div>

                <button onClick={handlePlaceOrder} disabled={processing}
                  className="w-full py-4 bg-[#00C2A8] text-[#0D1117] font-bold rounded-xl hover:bg-[#00D4B8] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-lg">
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-[#0D1117]/30 border-t-[#0D1117] rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Place Order — ${formatINR(total)}`
                  )}
                </button>
                <p className="text-center text-xs text-white/30 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  SSL encrypted · Powered by Razorpay
                </p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#161B22] border border-white/8 rounded-2xl p-6 sticky top-24">
              <h3 className="font-display font-bold text-white mb-5">Order Summary</h3>
              <div className="space-y-3 mb-5">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-white/60 truncate flex-1">{item.productName} <span className="text-white/30">×{item.quantity}</span></span>
                    <span className="text-white shrink-0 ml-2">{formatINR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/8 pt-4 space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal</span>
                  <span className="text-white">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">GST (18%)</span>
                  <span className="text-white">{formatINR(gst)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Shipping</span>
                  <span className={shipping === 0 ? "text-[#00C2A8]" : "text-white"}>{shipping === 0 ? "FREE" : formatINR(shipping)}</span>
                </div>
              </div>
              <div className="border-t border-white/8 pt-4 flex justify-between font-bold text-lg">
                <span className="text-white">Total</span>
                <span className="text-[#00C2A8]">{formatINR(total)}</span>
              </div>
              <div className="mt-5 pt-5 border-t border-white/8 space-y-3">
                {[
                  { icon: ShieldCheck, label: "GST Invoice included" },
                  { icon: Truck, label: "Fast delivery pan India" },
                  { icon: PackageCheck, label: "Easy 7-day returns" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/40">
                    <item.icon className="w-3.5 h-3.5 text-[#00C2A8]" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
