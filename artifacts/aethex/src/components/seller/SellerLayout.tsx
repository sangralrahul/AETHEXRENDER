import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, ShoppingBag, CreditCard, BarChart3, Settings, LogOut, Store, ChevronRight, BadgeCheck, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface SellerInfo {
  businessName: string;
  ownerName: string;
  sellerCode: string;
  verified?: boolean;
  rating?: string | number;
}

interface SellerLayoutProps {
  children: React.ReactNode;
  seller: SellerInfo;
  onLogout: () => void;
}

const NAV = [
  { href: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/products", label: "Products", icon: Package },
  { href: "/seller/orders", label: "Orders", icon: ShoppingBag },
  { href: "/seller/payouts", label: "Payouts", icon: CreditCard },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/seller/settings", label: "Settings", icon: Settings },
];

export function SellerLayout({ children, seller, onLogout }: SellerLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141821] border-r border-white/5 flex flex-col fixed top-0 left-0 h-full z-40">
        {/* Brand */}
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-sm text-white">A</div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">Aethex</div>
              <div className="text-xs text-primary font-semibold">Seller Hub</div>
            </div>
          </Link>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {seller.businessName?.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-white truncate">{seller.businessName}</div>
                <div className="text-xs text-slate-400 truncate">{seller.sellerCode}</div>
              </div>
            </div>
            {seller.verified && (
              <div className="flex items-center gap-1 mt-1.5">
                <BadgeCheck className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-primary font-semibold">Verified Seller</span>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = location === href || location.startsWith(href + "/");
            return (
              <Link key={href} href={href}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  active ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-400 hover:text-white hover:bg-white/5")}>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Store className="w-4 h-4" /> View Store
          </Link>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

export function SellerPageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, sub, color = "primary" }: { label: string; value: string | number; sub?: string; color?: string }) {
  const colorMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary border-primary/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  };
  return (
    <div className={cn("rounded-2xl border p-5 bg-[#141821]", colorMap[color] ?? colorMap.primary)}>
      <div className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">{label}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      {sub && <div className="text-xs opacity-60">{sub}</div>}
    </div>
  );
}
