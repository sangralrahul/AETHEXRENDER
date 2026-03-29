import { useState, useEffect } from "react";
import { Save, Loader2, Moon, Sun, Building2, CreditCard, Truck, Plus, X } from "lucide-react";
import { SellerLayout, SellerPageHeader } from "@/components/seller/SellerLayout";

const INPUT_CLASS = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all";

export default function SellerSettings({ seller, onLogout }: { seller: any; onLogout: () => void }) {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newPincode, setNewPincode] = useState("");
  const [tab, setTab] = useState<"profile" | "bank" | "shipping">("profile");
  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");
  const headers = { "Content-Type": "application/json", "x-seller-code": seller?.sellerCode };

  useEffect(() => {
    fetch(`${apiBase}/api/seller/settings`, { headers })
      .then(r => r.json()).then(d => setSettings(d.seller)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: any) => setSettings((s: any) => ({ ...s, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/seller/settings`, { method: "PUT", headers, body: JSON.stringify(settings) });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } finally { setSaving(false); }
  };

  const addPincode = () => {
    if (!newPincode.trim() || newPincode.length !== 6) return;
    const existing = settings?.deliveryPincodes ?? [];
    if (!existing.includes(newPincode)) set("deliveryPincodes", [...existing, newPincode]);
    setNewPincode("");
  };

  if (loading) return (
    <SellerLayout seller={seller} onLogout={onLogout}>
      <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
    </SellerLayout>
  );

  const TABS = [
    { id: "profile", label: "Business Profile", icon: Building2 },
    { id: "bank", label: "Bank Details", icon: CreditCard },
    { id: "shipping", label: "Shipping", icon: Truck },
  ] as const;

  return (
    <SellerLayout seller={seller} onLogout={onLogout}>
      <div className="p-8">
        <SellerPageHeader title="Settings" subtitle="Manage your seller profile and preferences" />

        {/* Vacation Mode */}
        <div className="bg-[#141821] border border-white/5 rounded-2xl p-5 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings?.vacationMode ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-emerald-400" />}
            <div>
              <p className="font-semibold text-white text-sm">Vacation Mode</p>
              <p className="text-xs text-slate-400">{settings?.vacationMode ? "Your products are hidden from the store" : "Your products are live and visible to buyers"}</p>
            </div>
          </div>
          <button onClick={() => set("vacationMode", !settings?.vacationMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${settings?.vacationMode ? "bg-amber-500" : "bg-emerald-500"}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings?.vacationMode ? "left-7" : "left-1"}`} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#141821] border border-white/5 rounded-xl p-1 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === id ? "bg-primary text-white" : "text-slate-400 hover:text-white"}`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        <div className="bg-[#141821] border border-white/5 rounded-2xl p-6 space-y-4">
          {tab === "profile" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Business Name</label>
                  <input value={settings?.businessName ?? ""} onChange={e => set("businessName", e.target.value)} className={INPUT_CLASS} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Owner Name</label>
                  <input value={settings?.ownerName ?? ""} onChange={e => set("ownerName", e.target.value)} className={INPUT_CLASS} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Phone</label>
                  <input value={settings?.phone ?? ""} onChange={e => set("phone", e.target.value)} className={INPUT_CLASS} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Pincode</label>
                  <input value={settings?.pincode ?? ""} onChange={e => set("pincode", e.target.value)} className={INPUT_CLASS} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Address</label>
                <textarea value={settings?.address ?? ""} onChange={e => set("address", e.target.value)} rows={2} className={INPUT_CLASS + " resize-none"} />
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-sm text-slate-400">
                <strong className="text-slate-300">GST:</strong> {settings?.gstNumber} &nbsp;·&nbsp; <strong className="text-slate-300">Seller Code:</strong> <span className="font-mono text-primary">{settings?.sellerCode}</span>
              </div>
            </>
          )}

          {tab === "bank" && (
            <>
              <p className="text-slate-400 text-sm bg-primary/5 border border-primary/20 rounded-xl p-3">For security, your full account number is hidden. Contact support to update bank details.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Account Number</label>
                  <input value={settings?.bankAccount ?? ""} readOnly className={INPUT_CLASS + " opacity-50 cursor-not-allowed"} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">IFSC Code</label>
                  <input value={settings?.bankIfsc ?? ""} onChange={e => set("bankIfsc", e.target.value)} className={INPUT_CLASS} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Account Holder Name</label>
                  <input value={settings?.accountHolder ?? ""} onChange={e => set("accountHolder", e.target.value)} className={INPUT_CLASS} />
                </div>
              </div>
            </>
          )}

          {tab === "shipping" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Estimated Delivery Days</label>
                <select value={settings?.deliveryDays ?? 5} onChange={e => set("deliveryDays", parseInt(e.target.value))}
                  className={INPUT_CLASS}>
                  {[1,2,3,4,5,7,10,14].map(d => <option key={d} value={d} className="bg-[#141821]">{d} day{d !== 1 ? "s" : ""}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Delivery Pincodes (leave empty to deliver anywhere)</label>
                <div className="flex gap-2 mb-2">
                  <input value={newPincode} onChange={e => setNewPincode(e.target.value)} maxLength={6} placeholder="e.g. 400001"
                    className={INPUT_CLASS + " flex-1"} onKeyDown={e => e.key === "Enter" && addPincode()} />
                  <button type="button" onClick={addPincode}
                    className="flex items-center gap-1 px-3 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(settings?.deliveryPincodes ?? []).map((pin: string) => (
                    <span key={pin} className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-slate-300 font-mono">
                      {pin}
                      <button onClick={() => set("deliveryPincodes", (settings?.deliveryPincodes ?? []).filter((p: string) => p !== pin))}
                        className="text-slate-500 hover:text-rose-400 ml-1"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  {(settings?.deliveryPincodes ?? []).length === 0 && <p className="text-slate-500 text-sm">No pincodes added — delivering pan-India</p>}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
          {saved && <span className="text-emerald-400 text-sm font-semibold">✓ Saved successfully</span>}
        </div>
      </div>
    </SellerLayout>
  );
}
