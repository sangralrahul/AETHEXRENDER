import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronRight, Upload, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

const CATEGORIES = ["Surgical", "Diagnostics", "Pharma", "PPE", "Equipment", "Dental", "Lab Supplies", "Nursing", "Optics", "Orthopaedics", "Other"];

function FileField({ label, onChange }: { label: string; onChange: (v: string) => void }) {
  const [name, setName] = useState("");
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <label className="flex items-center gap-3 p-3 border border-white/10 rounded-xl cursor-pointer hover:border-primary/50 transition-all bg-white/5">
      <Upload className="w-4 h-4 text-slate-400 shrink-0" />
      <span className="text-sm text-slate-400 truncate flex-1">{name || label}</span>
      <input type="file" accept="image/*,application/pdf" hidden onChange={handleFile} />
    </label>
  );
}

export default function SellerRegister() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    businessName: "", ownerName: "", email: "", phone: "", gstNumber: "",
    businessCategory: "Surgical", address: "", pincode: "",
    bankAccount: "", bankIfsc: "", accountHolder: "",
    gstCertificate: "", panCard: "", businessProof: "",
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/api/seller/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Registration failed"); return; }
      setSubmitted(true);
    } catch { setError("Network error. Please try again."); }
    finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Application Submitted!</h2>
          <p className="text-slate-400 mb-6">Your seller application is under review. We will contact you within 48 hours at <strong className="text-white">{form.email}</strong></p>
          <Link href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all inline-block">
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const Input = ({ label, field, type = "text", placeholder = "" }: { label: string; field: string; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-1.5">{label}</label>
      <input type={type} value={(form as any)[field]} onChange={e => set(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold">A</div>
          <div>
            <h1 className="text-2xl font-bold">Become an Aethex Seller</h1>
            <p className="text-slate-400 text-sm">Reach 50,000+ medical professionals across India</p>
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center gap-2 my-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "bg-primary text-white" : "bg-white/10 text-slate-400"}`}>{s}</div>
              {s < 3 && <div className={`flex-1 h-0.5 w-12 transition-all ${step > s ? "bg-primary" : "bg-white/10"}`} />}
            </div>
          ))}
          <div className="ml-4 text-sm text-slate-400">
            {step === 1 ? "Business Info" : step === 2 ? "Bank Details" : "Documents"}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-[#141821] rounded-2xl border border-white/5 p-6 space-y-5">
            {step === 1 && (
              <>
                <h3 className="font-bold text-lg text-white">Business Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Business Name *" field="businessName" placeholder="MedTech Solutions India" />
                  <Input label="Owner Name *" field="ownerName" placeholder="Dr. Rajesh Kumar" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Business Email *" field="email" type="email" placeholder="contact@yourbusiness.com" />
                  <Input label="Phone Number *" field="phone" placeholder="9876543210" />
                </div>
                <Input label="GST Number *" field="gstNumber" placeholder="27AABCU9603R1ZX" />
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Business Category *</label>
                  <select value={form.businessCategory} onChange={e => set("businessCategory", e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all">
                    {CATEGORIES.map(c => <option key={c} className="bg-[#141821]">{c}</option>)}
                  </select>
                </div>
                <Input label="Business Address *" field="address" placeholder="Plot 42, MIDC Industrial Area, Andheri East" />
                <Input label="Pincode *" field="pincode" placeholder="400093" />
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="font-bold text-lg text-white">Bank Account Details</h3>
                <p className="text-slate-400 text-sm">Your payouts will be sent to this account. Aethex charges 10% commission per sale.</p>
                <Input label="Account Holder Name *" field="accountHolder" placeholder="Rajesh Kumar" />
                <Input label="Bank Account Number *" field="bankAccount" placeholder="50200012345678" />
                <Input label="IFSC Code *" field="bankIfsc" placeholder="HDFC0001234" />
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="font-bold text-lg text-white">Document Upload</h3>
                <p className="text-slate-400 text-sm">Upload clear photos or PDFs of your documents. All documents are securely encrypted.</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">GST Certificate *</label>
                    <FileField label="Upload GST Certificate (PDF/Image)" onChange={v => set("gstCertificate", v)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">PAN Card *</label>
                    <FileField label="Upload PAN Card (PDF/Image)" onChange={v => set("panCard", v)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Business Registration Proof *</label>
                    <FileField label="Upload Certificate of Incorporation / MSME / Trade Licence" onChange={v => set("businessProof", v)} />
                  </div>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-primary">
                  By submitting, you agree to Aethex Seller Terms & Conditions. You will hear from us within 48 hours.
                </div>
              </>
            )}
          </div>

          {error && <p className="text-rose-400 text-sm mt-3 font-medium">{error}</p>}

          <div className="flex items-center gap-3 mt-6">
            {step > 1 && (
              <button type="button" onClick={() => setStep(s => s - 1)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white border border-white/10 rounded-xl transition-all">
                Back
              </button>
            )}
            <div className="flex-1" />
            {step < 3 ? (
              <button type="button" onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-60">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Application
              </button>
            )}
          </div>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already a seller? <Link href="/seller/login" className="text-primary hover:underline">Sign in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
