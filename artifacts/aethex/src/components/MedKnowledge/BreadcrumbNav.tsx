import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export function BreadcrumbNav({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center flex-wrap gap-1 text-sm" aria-label="breadcrumb">
      <Link href="/" className="flex items-center gap-1 transition-colors hover:opacity-80" style={{ color: "#8B949E" }}>
        <Home className="w-3.5 h-3.5" />
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5" style={{ color: "#21262D" }} />
          {crumb.href ? (
            <Link href={crumb.href} className="transition-colors hover:opacity-80" style={{ color: "#8B949E" }}>
              {crumb.label}
            </Link>
          ) : (
            <span style={{ color: "#E6EDF3" }}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
