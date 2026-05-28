"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, ShoppingCart, Package, BarChart3,
  Truck, LogOut, Menu, X
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/stock", label: "Stock", icon: BarChart3 },
  { href: "/admin/livraison", label: "Livraison TawssilGo", icon: Truck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
      setChecking(false);
    });
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (checking) return (
    <div className="min-h-screen bg-hr-warm flex items-center justify-center">
      <div className="text-xs text-hr-hint tracking-widest animate-pulse">CHARGEMENT...</div>
    </div>
  );

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex" style={{ fontFamily: "inherit" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-48 bg-hr-dark z-50 flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}>
        <div className="px-5 py-5 border-b border-white/8">
          <p className="text-white text-xs font-medium tracking-[0.3em]">HR WEAR</p>
          <p className="text-white/30 text-[9px] tracking-widest mt-0.5">ESPACE GÉRANT</p>
        </div>

        <nav className="flex-1 py-3">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-5 py-2.5 text-xs transition-colors
                  ${active
                    ? "bg-white/8 text-white border-r-2 border-[#D4C5A9]"
                    : "text-white/50 hover:text-white/80"
                  }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-white/8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 w-full"
          >
            <LogOut size={13} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-hr-border px-6 h-12 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-hr-muted hover:text-hr-dark"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <span className="text-xs font-medium text-hr-dark tracking-wide hidden md:block">
            {NAV.find((n) => n.href === pathname)?.label ?? "Admin"}
          </span>
          <span className="text-[11px] text-hr-hint">
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </span>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
