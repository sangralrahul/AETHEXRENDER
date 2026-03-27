import { Link, useLocation } from "wouter";
import { Heart, ShieldCheck, Truck, Twitter, Linkedin, Send } from "lucide-react";

export function Footer() {
  const [location] = useLocation();
  if (location === "/ai-assistant") return null;
  return (
    <footer className="bg-slate-900 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Newsletter Section */}
        <div className="bg-slate-800/50 rounded-2xl p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-700/50">
          <div className="text-center md:text-left flex-1">
            <h3 className="text-2xl font-display font-bold text-white mb-2">Get exclusive deals for doctors</h3>
            <p className="text-slate-400">Subscribe to our newsletter for the latest medical equipment and offers.</p>
          </div>
          <form className="flex w-full md:w-auto gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary flex-1 md:w-64"
            />
            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
              Subscribe <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src={`${import.meta.env.BASE_URL}aethex-logo.jpg`}
                alt="aethex logo"
                className="w-10 h-10 object-contain"
              />
              <span className="font-display font-bold text-2xl tracking-tight text-white leading-none">
                aethex
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              India's #1 premier destination for medical professionals and students. Elevating healthcare practice with top-tier equipment, books, scrubs, and AI assistance.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-6">Shop Categories</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/category/stethoscopes" className="hover:text-primary transition-colors">Premium Stethoscopes</Link></li>
              <li><Link href="/category/scrubs" className="hover:text-primary transition-colors">Medical Scrubs & Aprons</Link></li>
              <li><Link href="/category/books" className="hover:text-primary transition-colors">Books & Study Material</Link></li>
              <li><Link href="/category/surgical" className="hover:text-primary transition-colors">Surgical Instruments</Link></li>
              <li><Link href="/category/equipment" className="hover:text-primary transition-colors">Medical Equipment</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-6">Support</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/ai-assistant" className="hover:text-primary transition-colors">SYNAPSE AI Agents</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQs for Doctors</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-6">Why aethex?</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>100% Genuine Products</span>
              </li>
              <li className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" />
                <span>Pan-India Fast Delivery</span>
              </li>
              <li className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-primary" />
                <span>Trusted by 50k+ Doctors</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm flex flex-col sm:flex-row gap-2 sm:gap-6 text-center sm:text-left">
            <span>© {new Date().getFullYear()} aethex. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span>Registered in India</span>
            <span className="hidden sm:inline">•</span>
            <span>GSTIN: 07AAAAA0000A1Z5</span>
          </div>

          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-600">
          Accepted Payments: VisaCard • Mastercard • UPI • Net Banking • COD
        </div>
      </div>
    </footer>
  );
}
