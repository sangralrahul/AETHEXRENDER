import { useState, useEffect, useRef } from "react";
import { Plus, Edit3, Trash2, AlertTriangle, Eye, ShoppingCart, CheckCircle2, Clock, XCircle, Camera, Loader2 } from "lucide-react";
import { SellerLayout, SellerPageHeader } from "@/components/seller/SellerLayout";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { slug: "scrubs", name: "Scrubs & Uniforms" },
  { slug: "aprons", name: "Aprons & PPE" },
  { slug: "books", name: "Books & Study" },
  { slug: "stethoscopes", name: "Stethoscopes" },
  { slug: "surgical", name: "Surgical Instruments" },
  { slug: "dental", name: "Dental Supplies" },
  { slug: "lab", name: "Lab Supplies" },
  { slug: "equipment", name: "Equipment" },
];

const STATUS_COLORS: Record<string, string> = {
  live: "text-emerald-400 bg-emerald-500/10",
  pending: "text-amber-400 bg-amber-500/10",
  rejected: "text-rose-400 bg-rose-500/10",
};

function resizeImage(file: File, maxPx = 800): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(maxPx / img.width, maxPx / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale; canvas.height = img.height * scale;
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

interface ProductFormProps {
  initial?: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

function ProductForm({ initial, onSave, onCancel, saving }: ProductFormProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? "", description: initial?.description ?? "",
    categorySlug: initial?.categorySlug ?? "equipment", price: initial?.price ?? "",
    mrp: initial?.mrp ?? "", gstPercent: initial?.gstPercent ?? 12,
    stock: initial?.stock ?? "", shippingWeight: initial?.shippingWeight ?? "0.5",
    brand: initial?.brand ?? "", images: (initial?.images as string[]) ?? [],
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5 - form.images.length);
    const resized = await Promise.all(files.map(f => resizeImage(f)));
    setForm(f => ({ ...f, images: [...f.images, ...resized].slice(0, 5) }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const cat = CATEGORIES.find(c => c.slug === form.categorySlug);

  return (
    <div className="bg-[#141821] border border-white/5 rounded-2xl p-6">
      <h3 className="font-bold text-white text-lg mb-5">{initial ? "Edit Product" : "Add New Product"}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">Product Name *</label>
          <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Nitrile Examination Gloves Box/100"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">Category *</label>
          <select value={form.categorySlug} onChange={e => set("categorySlug", e.target.value)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all">
            {CATEGORIES.map(c => <option key={c.slug} value={c.slug} className="bg-[#141821]">{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">Brand</label>
          <input value={form.brand} onChange={e => set("brand", e.target.value)} placeholder="Your brand name"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">Selling Price (₹) *</label>
          <input type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="349"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">MRP (₹) *</label>
          <input type="number" value={form.mrp} onChange={e => set("mrp", e.target.value)} placeholder="449"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">GST %</label>
          <select value={form.gstPercent} onChange={e => set("gstPercent", parseInt(e.target.value))}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all">
            {[0, 5, 12, 18, 28].map(g => <option key={g} value={g} className="bg-[#141821]">{g}%</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">Stock Quantity *</label>
          <input type="number" value={form.stock} onChange={e => set("stock", e.target.value)} placeholder="100"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">Shipping Weight (kg)</label>
          <input type="number" step="0.1" value={form.shippingWeight} onChange={e => set("shippingWeight", e.target.value)} placeholder="0.5"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">Description *</label>
          <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3}
            placeholder="Detailed product description including key features, certifications, etc."
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none" />
        </div>
      </div>

      {/* Images */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-slate-300 mb-2">Product Images (up to 5)</label>
        <div className="flex gap-2 flex-wrap">
          {form.images.map((src, i) => (
            <div key={i} className="relative w-20 h-20">
              <img src={src} className="w-full h-full object-cover rounded-xl border border-white/10" alt="" />
              <button type="button" onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs">×</button>
            </div>
          ))}
          {form.images.length < 5 && (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-20 h-20 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-primary/50 hover:text-primary transition-all">
              <Camera className="w-5 h-5" />
              <span className="text-[10px]">Add Photo</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleImages} />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => onSave(form)} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-60">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {initial ? "Save Changes" : "Submit for Review"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm text-slate-400 hover:text-white border border-white/10 rounded-xl transition-all">Cancel</button>
      </div>
    </div>
  );
}

export default function SellerProducts({ seller, onLogout }: { seller: any; onLogout: () => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");
  const headers = { "Content-Type": "application/json", "x-seller-code": seller?.sellerCode };

  const fetchProducts = () => {
    fetch(`${apiBase}/api/seller/products`, { headers }).then(r => r.json()).then(d => setProducts(d.products ?? [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(fetchProducts, []);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      const url = editingProduct ? `${apiBase}/api/seller/products/${editingProduct.id}` : `${apiBase}/api/seller/products`;
      const method = editingProduct ? "PUT" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify({ ...data, category: CATEGORIES.find(c => c.slug === data.categorySlug)?.name ?? data.categorySlug }) });
      if (res.ok) { fetchProducts(); setShowForm(false); setEditingProduct(null); }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await fetch(`${apiBase}/api/seller/products/${id}`, { method: "DELETE", headers });
    setProducts(p => p.filter(x => x.id !== id));
  };

  return (
    <SellerLayout seller={seller} onLogout={onLogout}>
      <div className="p-8">
        <SellerPageHeader title="My Products" subtitle={`${products.length} products listed`}
          action={!showForm && !editingProduct ? (
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          ) : undefined}
        />

        {(showForm || editingProduct) && (
          <div className="mb-6">
            <ProductForm initial={editingProduct} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingProduct(null); }} saving={saving} />
          </div>
        )}

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-[#141821] animate-pulse rounded-xl" />)}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-[#141821] rounded-2xl border border-white/5">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-semibold">No products yet</p>
            <p className="text-slate-500 text-sm mt-1 mb-5">Add your first product to start selling</p>
            <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm">Add Product</button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map(p => (
              <div key={p.id} className={cn("bg-[#141821] border rounded-xl p-4 flex items-center gap-4", p.stock < 10 && p.status === "live" ? "border-orange-500/30" : "border-white/5")}>
                {p.images?.[0] ? (
                  <img src={p.images[0]} className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0" alt="" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center shrink-0"><Package className="w-6 h-6 text-slate-600" /></div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-white text-sm truncate">{p.name}</span>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", STATUS_COLORS[p.status] ?? "text-slate-400 bg-white/5")}>{p.status.toUpperCase()}</span>
                    {p.stock < 10 && p.status === "live" && <span className="flex items-center gap-0.5 text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full"><AlertTriangle className="w-2.5 h-2.5" /> LOW STOCK</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-bold text-white">{formatINR(parseFloat(p.price))}</span>
                    <span className="line-through">{formatINR(parseFloat(p.mrp))}</span>
                    <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{p.views}</span>
                    <span className="flex items-center gap-0.5"><ShoppingCart className="w-3 h-3" />{p.cartCount}</span>
                    <span>Stock: {p.stock}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-emerald-400">{formatINR(parseFloat(p.revenue || 0))}</div>
                  <div className="text-xs text-slate-500">{p.sales} sold</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => { setEditingProduct(p); setShowForm(false); }}
                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
