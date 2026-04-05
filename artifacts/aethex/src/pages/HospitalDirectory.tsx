import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, MapPin, Phone, Star, Bed, Shield, Building2, ChevronRight, Briefcase, FileText, X } from "lucide-react";

const CITIES = ["All Cities", "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];
const TYPES = ["All Types", "Government", "Private", "Teaching / Medical College", "Corporate"];
const SPECIALTIES_F = ["All Specialties", "Cardiology", "Oncology", "Neurology", "Orthopaedics", "Gastroenterology", "Nephrology", "Pulmonology"];

const HOSPITALS = [
  { id: 1, name: "All India Institute of Medical Sciences (AIIMS)", city: "Delhi", type: "Government", address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi — 110029", beds: 2478, specialties: ["Cardiology", "Neurology", "Oncology", "Orthopaedics"], phone: "011-2658-8500", rating: 4.8, reviews: 1240, empanelment: ["CGHS", "ECHS", "Ayushman"], jobs: 18 },
  { id: 2, name: "Tata Memorial Hospital", city: "Mumbai", type: "Government", address: "Dr. E Borges Road, Parel, Mumbai — 400012", beds: 629, specialties: ["Oncology", "Haematology", "Palliative Care"], phone: "022-2417-7000", rating: 4.9, reviews: 980, empanelment: ["CGHS", "Ayushman"], jobs: 7 },
  { id: 3, name: "Apollo Hospitals", city: "Chennai", type: "Private", address: "21 Greams Lane, Off Greams Road, Chennai — 600006", beds: 710, specialties: ["Cardiology", "Neurology", "Oncology", "Orthopaedics", "Nephrology"], phone: "044-2829-3333", rating: 4.7, reviews: 876, empanelment: ["CGHS", "ECHS"], jobs: 24 },
  { id: 4, name: "Christian Medical College (CMC)", city: "Chennai", type: "Teaching / Medical College", address: "Ida Scudder Road, Vellore, Tamil Nadu — 632004", beds: 2800, specialties: ["All Specialties"], phone: "0416-228-1000", rating: 4.9, reviews: 1100, empanelment: ["CGHS", "Ayushman"], jobs: 15 },
  { id: 5, name: "Fortis Hospital Mulund", city: "Mumbai", type: "Private", address: "Mulund-Goregaon Link Road, Mumbai — 400078", beds: 316, specialties: ["Cardiology", "Oncology", "Neurology", "Orthopaedics"], phone: "022-6767-8888", rating: 4.5, reviews: 560, empanelment: ["CGHS", "ECHS"], jobs: 12 },
  { id: 6, name: "NIMHANS (National Institute of Mental Health)", city: "Bangalore", type: "Government", address: "Hosur Road, Bangalore — 560029", beds: 1000, specialties: ["Psychiatry", "Neurology", "Neurosurgery"], phone: "080-4611-0007", rating: 4.7, reviews: 430, empanelment: ["CGHS", "Ayushman"], jobs: 5 },
  { id: 7, name: "Narayana Health City", city: "Bangalore", type: "Private", address: "258/A, Bommasandra Industrial Area, Bangalore — 560099", beds: 5000, specialties: ["Cardiology", "Oncology", "Neurology", "Nephrology", "Gastroenterology"], phone: "080-7122-2222", rating: 4.6, reviews: 892, empanelment: ["CGHS", "Ayushman", "ECHS"], jobs: 31 },
  { id: 8, name: "King George's Medical University (KGMU)", city: "Lucknow", type: "Teaching / Medical College", address: "Shah Mina Rd, Chowk, Lucknow — 226003", beds: 3500, specialties: ["All Specialties"], phone: "0522-225-7450", rating: 4.4, reviews: 670, empanelment: ["CGHS", "Ayushman"], jobs: 22 },
  { id: 9, name: "Max Super Speciality Hospital", city: "Delhi", type: "Private", address: "1, Press Enclave Road, Saket, New Delhi — 110017", beds: 500, specialties: ["Cardiology", "Oncology", "Orthopaedics", "Gastroenterology"], phone: "011-6770-1234", rating: 4.6, reviews: 742, empanelment: ["CGHS", "ECHS"], jobs: 19 },
  { id: 10, name: "Hyderabad Government General Hospital", city: "Hyderabad", type: "Government", address: "Gandhi Hospital Rd, Musheerabad, Hyderabad — 500003", beds: 1200, specialties: ["General Medicine", "Surgery", "Orthopaedics"], phone: "040-2749-0000", rating: 4.0, reviews: 320, empanelment: ["Ayushman", "CGHS"], jobs: 8 },
  { id: 11, name: "Bombay Hospital & Medical Research Centre", city: "Mumbai", type: "Private", address: "12 New Marine Lines, Mumbai — 400020", beds: 650, specialties: ["Cardiology", "Gastroenterology", "Pulmonology"], phone: "022-2206-7676", rating: 4.5, reviews: 414, empanelment: ["CGHS"], jobs: 6 },
  { id: 12, name: "Postgraduate Institute (PGI)", city: "Chandigarh", type: "Teaching / Medical College", address: "Sector 12, Chandigarh — 160012", beds: 2500, specialties: ["All Specialties"], phone: "0172-274-6018", rating: 4.8, reviews: 940, empanelment: ["CGHS", "ECHS", "Ayushman"], jobs: 13 },
];

const typeColors: Record<string, string> = { Government: "#007AFF", Private: "#8B5CF6", "Teaching / Medical College": "#00C2A8", "Corporate": "#F59E0B" };
const empColors: Record<string, string> = { CGHS: "#007AFF", ECHS: "#10B981", Ayushman: "#F59E0B" };

export default function HospitalDirectory() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All Cities");
  const [type, setType] = useState("All Types");

  const filtered = useMemo(() => HOSPITALS.filter(h => {
    const q = query.toLowerCase();
    return (!q || h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q) || h.specialties.some(s => s.toLowerCase().includes(q)))
      && (city === "All Cities" || h.city === city)
      && (type === "All Types" || h.type === type);
  }), [query, city, type]);

  return (
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>
      {/* Hero */}
      <div className="relative overflow-hidden pt-14 pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(8,18,36,0.93) 0%,rgba(10,26,50,0.88) 100%)" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5" style={{ background: "rgba(0,122,255,0.15)", border: "1px solid rgba(0,122,255,0.25)", color: "#60A5FA" }}>
            <Building2 className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Indian Hospital Directory</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3" style={{ letterSpacing: "-1px" }}>
            Find Hospitals <span style={{ background: "linear-gradient(135deg,#00C2A8,#007AFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Across India</span>
          </h1>
          <p className="text-base max-w-xl mx-auto mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>Search by city, specialty, or empanelment. Find jobs, refer patients, and rate hospitals.</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
            <input type="text" placeholder="Search hospitals, cities, specialties..." value={query} onChange={e => setQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#FFFFFF" }} />
            {query && <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="w-4 h-4" style={{ color: "rgba(255,255,255,0.5)" }} /></button>}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select value={city} onChange={e => setCity(e.target.value)} className="px-4 py-2 rounded-xl text-sm outline-none" style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.15)", color: "#1C1C1E" }}>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={type} onChange={e => setType(e.target.value)} className="px-4 py-2 rounded-xl text-sm outline-none" style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.15)", color: "#1C1C1E" }}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <span className="ml-auto self-center text-sm" style={{ color: "#AEAEB2" }}>{filtered.length} hospital{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(h => (
            <div key={h.id} className="rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-3">
                  <h3 className="font-bold text-base leading-snug mb-1" style={{ color: "#1C1C1E" }}>{h.name}</h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${typeColors[h.type]}18`, color: typeColors[h.type] }}>{h.type}</span>
                    {h.empanelment.map(e => (
                      <span key={e} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${empColors[e]}18`, color: empColors[e] }}>{e}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Star className="w-3.5 h-3.5" style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                    <span className="font-bold text-sm" style={{ color: "#1C1C1E" }}>{h.rating}</span>
                  </div>
                  <span className="text-[11px]" style={{ color: "#AEAEB2" }}>{h.reviews} reviews</span>
                </div>
              </div>

              <div className="space-y-1.5 mb-3">
                <div className="flex items-start gap-2 text-xs" style={{ color: "#636366" }}>
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#AEAEB2" }} />{h.address}
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: "#636366" }}>
                  <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: "#AEAEB2" }} />{h.phone}
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: "#636366" }}>
                  <Bed className="w-3.5 h-3.5 shrink-0" style={{ color: "#AEAEB2" }} />{h.beds.toLocaleString()} beds
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {h.specialties.slice(0, 4).map(s => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#F2F2F7", color: "#636366" }}>{s}</span>
                ))}
                {h.specialties.length > 4 && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#F2F2F7", color: "#AEAEB2" }}>+{h.specialties.length - 4} more</span>}
              </div>

              <div className="flex gap-2">
                <Link href="/jobs" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold flex-1 justify-center" style={{ background: "rgba(0,122,255,0.08)", color: "#007AFF" }}>
                  <Briefcase className="w-3.5 h-3.5" /> {h.jobs} Jobs
                </Link>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold flex-1 justify-center" style={{ background: "rgba(0,194,168,0.08)", color: "#00C2A8" }}>
                  <FileText className="w-3.5 h-3.5" /> Refer Patient
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: "#F2F2F7", color: "#636366" }}>
                  <Star className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 mx-auto mb-3" style={{ color: "#AEAEB2" }} />
            <p className="font-semibold mb-1" style={{ color: "#1C1C1E" }}>No hospitals found</p>
            <button onClick={() => { setQuery(""); setCity("All Cities"); setType("All Types"); }} className="text-sm" style={{ color: "#007AFF" }}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
