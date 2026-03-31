import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { User, MapPin, Heart, Crown, Settings, LogOut, Plus, Trash2, CheckCircle2, Star, Bell, ShieldCheck, ChevronRight, Edit3, Package, Camera } from "lucide-react";
import { useUserAuth, type Address } from "@/hooks/use-user-auth";
import { formatINR } from "@/lib/utils";

const INDIA_STATES = [
  "Andhra Pradesh","Assam","Bihar","Delhi","Goa","Gujarat","Haryana","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana",
  "Uttar Pradesh","Uttarakhand","West Bengal","Jammu & Kashmir",
];

type Tab = "profile" | "addresses" | "wishlist" | "subscription" | "notifications";

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "subscription", label: "Subscription", icon: Crown },
  { id: "notifications", label: "Notifications", icon: Bell },
];

function AddressCard({ addr, onDelete, onSetDefault }: { addr: Address; onDelete: (id: string) => void; onSetDefault: (id: string) => void }) {
  return (
    <div className={`p-5 border rounded-2xl transition-all ${addr.isDefault ? "border-[#00C2A8]/40 bg-[#00C2A8]/5" : "border-black/[0.08] bg-white"}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-black/[0.08] text-[#3c3c43] text-xs font-medium">{addr.label}</span>
          {addr.isDefault && <span className="px-2.5 py-0.5 rounded-lg bg-[#00C2A8]/20 text-[#00C2A8] text-xs font-bold">Default</span>}
        </div>
        <div className="flex items-center gap-2">
          {!addr.isDefault && (
            <button onClick={() => onSetDefault(addr.id)} className="text-xs text-[#6c6c70] hover:text-[#00C2A8] transition-colors">Set Default</button>
          )}
          <button onClick={() => onDelete(addr.id)} className="p-1.5 text-[#aeaeb2] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <p className="text-sm text-[#1c1c1e] font-medium">{addr.line1}</p>
      {addr.line2 && <p className="text-sm text-[#3c3c43]">{addr.line2}</p>}
      <p className="text-sm text-[#3c3c43]">{addr.city}, {addr.state} — {addr.pincode}</p>
    </div>
  );
}

function AddAddressForm({ onSave }: { onSave: (addr: Omit<Address, "id">) => void }) {
  const [form, setForm] = useState({ label: "Home", line1: "", line2: "", city: "", state: "Maharashtra", pincode: "", isDefault: false });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };
  return (
    <form onSubmit={handleSubmit} className="p-5 border border-[#00C2A8]/30 bg-[#00C2A8]/5 rounded-2xl space-y-4">
      <h4 className="font-semibold text-[#1c1c1e] text-sm">Add New Address</h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#6c6c70] mb-1">Label</label>
          <select value={form.label} onChange={e => setForm(f => ({...f, label: e.target.value}))}
            className="w-full px-3 py-2.5 bg-black/5 border border-black/10 rounded-xl text-[#1c1c1e] text-sm focus:outline-none focus:border-[#00C2A8]/50">
            {["Home", "Work", "Hospital", "Clinic", "Other"].map(l => <option key={l} value={l} className="bg-white">{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[#6c6c70] mb-1">PIN Code *</label>
          <input value={form.pincode} onChange={e => setForm(f => ({...f, pincode: e.target.value}))} required maxLength={6}
            placeholder="400001"
            className="w-full px-3 py-2.5 bg-black/5 border border-black/10 rounded-xl text-[#1c1c1e] text-sm placeholder-black/30 focus:outline-none focus:border-[#00C2A8]/50" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-[#6c6c70] mb-1">Address Line 1 *</label>
          <input value={form.line1} onChange={e => setForm(f => ({...f, line1: e.target.value}))} required
            placeholder="House/Flat No., Street"
            className="w-full px-3 py-2.5 bg-black/5 border border-black/10 rounded-xl text-[#1c1c1e] text-sm placeholder-black/30 focus:outline-none focus:border-[#00C2A8]/50" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-[#6c6c70] mb-1">Address Line 2</label>
          <input value={form.line2} onChange={e => setForm(f => ({...f, line2: e.target.value}))}
            placeholder="Landmark, Area (optional)"
            className="w-full px-3 py-2.5 bg-black/5 border border-black/10 rounded-xl text-[#1c1c1e] text-sm placeholder-black/30 focus:outline-none focus:border-[#00C2A8]/50" />
        </div>
        <div>
          <label className="block text-xs text-[#6c6c70] mb-1">City *</label>
          <input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} required
            placeholder="Mumbai"
            className="w-full px-3 py-2.5 bg-black/5 border border-black/10 rounded-xl text-[#1c1c1e] text-sm placeholder-black/30 focus:outline-none focus:border-[#00C2A8]/50" />
        </div>
        <div>
          <label className="block text-xs text-[#6c6c70] mb-1">State *</label>
          <select value={form.state} onChange={e => setForm(f => ({...f, state: e.target.value}))}
            className="w-full px-3 py-2.5 bg-black/5 border border-black/10 rounded-xl text-[#1c1c1e] text-sm focus:outline-none focus:border-[#00C2A8]/50">
            {INDIA_STATES.map(s => <option key={s} value={s} className="bg-white">{s}</option>)}
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.isDefault} onChange={e => setForm(f => ({...f, isDefault: e.target.checked}))} className="rounded" />
        <span className="text-sm text-[#3c3c43]">Set as default address</span>
      </label>
      <div className="flex gap-3">
        <button type="submit" className="px-5 py-2.5 bg-[#00C2A8] text-[#0D1117] font-bold rounded-xl text-sm hover:bg-[#00D4B8] transition-colors">Save Address</button>
      </div>
    </form>
  );
}

export default function Account() {
  const { user, isLoggedIn, logout, updateProfile, activatePro, activateProAnnual } = useUserAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [phoneInput, setPhoneInput] = useState(user?.phone || "");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [proLoading, setProLoading] = useState(false);
  const [notifToggles, setNotifToggles] = useState([true, true, false, true, false]);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showAvatarMenu) return;
    const handler = (e: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target as Node)) {
        setShowAvatarMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showAvatarMenu]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setPhotoUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ avatar: reader.result as string });
      setPhotoUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen  bg-[#F2F2F7] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center mx-auto mb-5">
            <User className="w-8 h-8 text-[#8e8e93]" />
          </div>
          <h2 className="text-xl font-display font-bold text-[#1c1c1e] mb-2">Sign in to access your account</h2>
          <p className="text-[#6c6c70] text-sm mb-6">Manage your profile, addresses, orders, and Cadus AI Pro subscription.</p>
          <Link href="/" className="px-6 py-3 bg-[#00C2A8] text-[#0D1117] font-bold rounded-xl hover:bg-[#00D4B8] transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    updateProfile({ name: nameInput, phone: phoneInput });
    setEditName(false);
  };

  const handleAddAddress = (addr: Omit<Address, "id">) => {
    const newAddr: Address = { ...addr, id: Date.now().toString() };
    const newAddresses = addr.isDefault
      ? [newAddr, ...user.addresses.map(a => ({ ...a, isDefault: false }))]
      : [...user.addresses, newAddr];
    updateProfile({ addresses: newAddresses });
    setShowAddAddress(false);
  };

  const handleDeleteAddress = (id: string) => {
    updateProfile({ addresses: user.addresses.filter(a => a.id !== id) });
  };

  const handleSetDefault = (id: string) => {
    updateProfile({ addresses: user.addresses.map(a => ({ ...a, isDefault: a.id === id })) });
  };

  const handleActivatePro = async (plan: "monthly" | "annual") => {
    setProLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    if (plan === "monthly") activatePro();
    else activateProAnnual();
    setProLoading(false);
  };

  return (
    <div className="min-h-screen  bg-[#F2F2F7] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 text-sm text-[#6c6c70] mb-6">
          <Link href="/" className="hover:text-[#1c1c1e]">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1c1c1e]">My Account</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-black/[0.08] rounded-2xl p-5 mb-4">
              <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              <div className="flex items-center gap-4 mb-5">
                <div ref={avatarMenuRef} className="relative flex-shrink-0">
                  <button
                    onClick={() => setShowAvatarMenu(v => !v)}
                    className="relative w-14 h-14 rounded-2xl overflow-hidden group"
                    title="Profile photo options"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#00C2A8]/20 border border-[#00C2A8]/30 flex items-center justify-center text-[#00C2A8] font-bold text-xl">
                        {user.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {photoUploading ? (
                        <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4 text-[#1c1c1e]" />
                      )}
                    </div>
                  </button>
                  {showAvatarMenu && (
                    <div className="absolute top-full left-0 mt-2 w-40 bg-[#1C2128] border border-black/10 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden">
                      <button
                        onClick={() => { setShowAvatarMenu(false); photoInputRef.current?.click(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#1c1c1e] hover:bg-black/[0.08] hover:text-[#1c1c1e] transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#00C2A8]" />
                        {user.avatar ? "Change photo" : "Upload photo"}
                      </button>
                      {user.avatar && (
                        <button
                          onClick={() => { updateProfile({ avatar: undefined }); setShowAvatarMenu(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove photo
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#1c1c1e] truncate">{user.name}</p>
                  <p className="text-xs text-[#6c6c70] truncate">{user.email}</p>
                  {user.isPro && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-[#00C2A8]/15 border border-[#00C2A8]/30 rounded-full text-[#00C2A8] text-xs font-bold">
                      <Crown className="w-3 h-3" />PRO
                    </span>
                  )}
                </div>
              </div>
              <nav className="space-y-1">
                {TABS.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      tab === t.id ? "bg-[#00C2A8]/15 text-[#00C2A8]" : "text-[#3c3c43] hover:text-[#1c1c1e] hover:bg-black/5"
                    }`}>
                    <t.icon className="w-4 h-4" />
                    {t.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="space-y-2">
              <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 bg-white border border-black/[0.08] rounded-xl text-sm text-[#3c3c43] hover:text-[#1c1c1e] hover:bg-black/5 transition-all">
                <Package className="w-4 h-4" />My Orders
              </Link>
              <button onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 bg-white border border-black/[0.08] rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
                <LogOut className="w-4 h-4" />Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-5">
            {/* Profile Tab */}
            {tab === "profile" && (
              <div className="bg-white border border-black/[0.08] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-display font-bold text-[#1c1c1e] flex items-center gap-2">
                    <User className="w-5 h-5 text-[#00C2A8]" />
                    Profile Details
                  </h2>
                  <button onClick={() => setEditName(!editName)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#3c3c43] hover:text-[#1c1c1e] bg-black/5 hover:bg-black/10 rounded-xl transition-all">
                    <Edit3 className="w-3.5 h-3.5" />
                    {editName ? "Cancel" : "Edit"}
                  </button>
                </div>

                {/* Profile Photo */}
                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-black/[0.08]">
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="relative w-20 h-20 rounded-2xl overflow-hidden group flex-shrink-0"
                    title="Change profile photo"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#00C2A8]/20 border-2 border-[#00C2A8]/30 flex items-center justify-center text-[#00C2A8] font-bold text-3xl">
                        {user.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {photoUploading ? (
                        <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-5 h-5 text-[#1c1c1e]" />
                      )}
                    </div>
                  </button>
                  <div>
                    <p className="text-sm font-semibold text-[#1c1c1e] mb-1">Profile Photo</p>
                    <p className="text-xs text-[#6c6c70] mb-3">JPG, PNG or GIF · Max 5 MB</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => photoInputRef.current?.click()}
                        disabled={photoUploading}
                        className="px-3 py-1.5 text-xs font-semibold bg-[#00C2A8]/15 border border-[#00C2A8]/30 text-[#00C2A8] rounded-lg hover:bg-[#00C2A8]/25 transition-all disabled:opacity-50"
                      >
                        {photoUploading ? "Uploading…" : user.avatar ? "Change Photo" : "Upload Photo"}
                      </button>
                      {user.avatar && (
                        <button
                          onClick={() => updateProfile({ avatar: undefined })}
                          className="px-3 py-1.5 text-xs font-semibold text-[#6c6c70] hover:text-red-400 bg-black/5 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {editName ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#3c3c43] mb-1.5">Full Name</label>
                      <input value={nameInput} onChange={e => setNameInput(e.target.value)}
                        className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl text-[#1c1c1e] focus:outline-none focus:border-[#00C2A8]/50" />
                    </div>
                    <div>
                      <label className="block text-sm text-[#3c3c43] mb-1.5">Phone Number</label>
                      <input value={phoneInput} onChange={e => setPhoneInput(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl text-[#1c1c1e] placeholder-black/30 focus:outline-none focus:border-[#00C2A8]/50" />
                    </div>
                    <button onClick={handleSaveProfile}
                      className="px-5 py-2.5 bg-[#00C2A8] text-[#0D1117] font-bold rounded-xl hover:bg-[#00D4B8] transition-colors text-sm">
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { label: "Full Name", value: user.name },
                      { label: "Email Address", value: user.email },
                      { label: "Phone", value: user.phone || "Not set" },
                      { label: "Account Type", value: user.isPro ? "Cadus AI Pro Member" : "Free Account" },
                    ].map((field, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <span className="text-sm text-[#6c6c70]">{field.label}</span>
                        <span className={`text-sm font-medium ${field.label === "Account Type" && user.isPro ? "text-[#00C2A8]" : "text-[#1c1c1e]"}`}>
                          {field.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {tab === "addresses" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-display font-bold text-[#1c1c1e] flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#00C2A8]" />
                    Saved Addresses
                  </h2>
                  <button onClick={() => setShowAddAddress(!showAddAddress)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00C2A8]/15 border border-[#00C2A8]/30 text-[#00C2A8] text-sm font-semibold rounded-xl hover:bg-[#00C2A8]/25 transition-all">
                    <Plus className="w-4 h-4" />
                    Add Address
                  </button>
                </div>
                {showAddAddress && <AddAddressForm onSave={handleAddAddress} />}
                {user.addresses.length === 0 ? (
                  <div className="text-center py-12 bg-white border border-black/[0.08] rounded-2xl">
                    <MapPin className="w-10 h-10 text-[#aeaeb2] mx-auto mb-3" />
                    <p className="text-[#6c6c70] text-sm">No saved addresses yet.</p>
                    <button onClick={() => setShowAddAddress(true)} className="mt-3 text-sm text-[#00C2A8] hover:underline">Add your first address</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {user.addresses.map(addr => (
                      <AddressCard key={addr.id} addr={addr} onDelete={handleDeleteAddress} onSetDefault={handleSetDefault} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {tab === "wishlist" && (
              <div className="bg-white border border-black/[0.08] rounded-2xl p-6">
                <h2 className="text-lg font-display font-bold text-[#1c1c1e] flex items-center gap-2 mb-6">
                  <Heart className="w-5 h-5 text-[#00C2A8]" />
                  Wishlist
                </h2>
                {user.wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-10 h-10 text-[#aeaeb2] mx-auto mb-3" />
                    <p className="text-[#6c6c70] text-sm">Your wishlist is empty.</p>
                    <Link href="/shop" className="mt-3 inline-block text-sm text-[#00C2A8] hover:underline">Browse products</Link>
                  </div>
                ) : (
                  <p className="text-sm text-[#6c6c70]">{user.wishlist.length} items saved</p>
                )}
              </div>
            )}

            {/* Subscription Tab */}
            {tab === "subscription" && (
              <div className="space-y-5">
                <h2 className="text-lg font-display font-bold text-[#1c1c1e] flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#00C2A8]" />
                  Cadus AI Subscription
                </h2>

                {/* Current Plan */}
                <div className={`p-6 rounded-2xl border ${user.isPro ? "border-[#00C2A8]/40 bg-[#00C2A8]/5" : "border-black/[0.08] bg-white"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-[#1c1c1e]">{user.isPro ? "Cadus AI Pro" : "Free Plan"}</h3>
                      <p className="text-sm text-[#6c6c70]">
                        {user.isPro
                          ? `Active until ${user.proExpiry ? new Date(user.proExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}`
                          : "10 AI queries/day"}
                      </p>
                    </div>
                    {user.isPro && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-[#00C2A8]/20 border border-[#00C2A8]/40 rounded-full text-[#00C2A8] text-sm font-bold">
                        <Crown className="w-3.5 h-3.5" />ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Daily queries", value: user.isPro ? "Unlimited" : "10" },
                      { label: "Image analysis", value: user.isPro ? "✓" : "✗" },
                      { label: "PDF export", value: user.isPro ? "✓" : "✗" },
                      { label: "Priority response", value: user.isPro ? "✓" : "✗" },
                    ].map((item, i) => (
                      <div key={i} className="text-center p-3 bg-white/4 rounded-xl">
                        <div className={`text-sm font-bold ${user.isPro ? "text-[#00C2A8]" : "text-[#1c1c1e]"}`}>{item.value}</div>
                        <div className="text-xs text-[#6c6c70] mt-0.5">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {!user.isPro && (
                  <>
                    <p className="text-sm text-[#3c3c43]">Upgrade to Cadus AI Pro for unlimited AI queries, advanced features, and priority access.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { plan: "monthly" as const, label: "Monthly", price: 299, period: "/month", saving: null },
                        { plan: "annual" as const, label: "Annual", price: 1999, period: "/year", saving: "Save ₹1,589" },
                      ].map(option => (
                        <div key={option.plan} className={`p-6 border rounded-2xl ${option.plan === "annual" ? "border-[#00C2A8]/40 bg-[#00C2A8]/5 relative" : "border-black/[0.08] bg-white"}`}>
                          {option.plan === "annual" && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#00C2A8] text-[#0D1117] text-xs font-bold rounded-full whitespace-nowrap">
                              Best Value
                            </div>
                          )}
                          <h4 className="font-bold text-[#1c1c1e] mb-1">{option.label}</h4>
                          <div className="flex items-end gap-1 mb-1">
                            <span className="text-3xl font-display font-extrabold text-[#1c1c1e]">₹{option.price.toLocaleString()}</span>
                            <span className="text-sm text-[#6c6c70] mb-1">{option.period}</span>
                          </div>
                          {option.saving && <p className="text-xs text-[#00C2A8] mb-4">{option.saving}</p>}
                          {!option.saving && <p className="text-xs text-[#6c6c70] mb-4">Cancel anytime</p>}
                          <ul className="space-y-2 mb-5">
                            {["Unlimited Cadus AI queries", "Image & lab analysis", "PDF export", "Drug interaction checker", "SOAP notes generator", "MCQ generator"].map((feat, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-[#3c3c43]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#00C2A8] shrink-0" />
                                {feat}
                              </li>
                            ))}
                          </ul>
                          <button onClick={() => handleActivatePro(option.plan)} disabled={proLoading}
                            className={`w-full py-3 font-bold rounded-xl transition-all text-sm disabled:opacity-60 ${
                              option.plan === "annual"
                                ? "bg-[#00C2A8] text-[#0D1117] hover:bg-[#00D4B8]"
                                : "bg-black/10 border border-black/15 text-[#1c1c1e] hover:bg-white/20"
                            }`}>
                            {proLoading ? "Processing..." : `Subscribe ${option.label} — ₹${option.price.toLocaleString()}`}
                          </button>
                          <p className="text-center text-xs text-[#aeaeb2] mt-2">Demo: no real payment</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {tab === "notifications" && (
              <div className="bg-white border border-black/[0.08] rounded-2xl p-6">
                <h2 className="text-lg font-display font-bold text-[#1c1c1e] flex items-center gap-2 mb-6">
                  <Bell className="w-5 h-5 text-[#00C2A8]" />
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Order updates & tracking", desc: "Get notified about your order status", defaultOn: true },
                    { label: "Cadus AI updates", desc: "New features and model updates", defaultOn: true },
                    { label: "Exclusive deals & offers", desc: "Personalized discounts on medical supplies", defaultOn: false },
                    { label: "Medical news digest", desc: "Weekly curated medical news", defaultOn: true },
                    { label: "Blog & study tips", desc: "New blog posts and exam tips", defaultOn: false },
                  ].map((pref, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-[#1c1c1e]">{pref.label}</p>
                        <p className="text-xs text-[#6c6c70]">{pref.desc}</p>
                      </div>
                      <button onClick={() => setNotifToggles(prev => prev.map((v, j) => j === i ? !v : v))}
                        className={`w-12 h-6 rounded-full transition-all relative ${notifToggles[i] ? "bg-[#00C2A8]" : "bg-black/15"}`}>
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifToggles[i] ? "left-7" : "left-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="mt-5 w-full py-3 bg-black/5 border border-black/10 text-[#1c1c1e] font-semibold rounded-xl hover:bg-black/10 transition-colors text-sm">
                  Save Preferences
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
