import { Link } from "wouter";
import { Stethoscope, Heart, ShieldCheck, Truck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                AETHEX
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              India's #1 premier destination for medical professionals and students. Elevating healthcare practice with top-tier equipment and AI assistance.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-4">Shop Categories</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/category/stethoscopes" className="hover:text-primary transition-colors">Premium Stethoscopes</Link></li>
              <li><Link href="/category/scrubs" className="hover:text-primary transition-colors">Medical Scrubs & Aprons</Link></li>
              <li><Link href="/category/books" className="hover:text-primary transition-colors">Books & Study Material</Link></li>
              <li><Link href="/category/surgical" className="hover:text-primary transition-colors">Surgical Instruments</Link></li>
              <li><Link href="/category/equipment" className="hover:text-primary transition-colors">BP Machines & Equipment</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/ai-assistant" className="hover:text-primary transition-colors">AI Medical Assistant</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQs for Doctors</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-4">Why AETHEX?</h3>
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

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} AETHEX Medical Technologies. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
