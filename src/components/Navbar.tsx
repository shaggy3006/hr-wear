"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import CartSidebar from "./CartSidebar";

export default function Navbar() {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-white border-b border-hr-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-[58px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-hr-dark font-medium tracking-[0.3em] text-lg">
            HR WEAR
          </Link>

          {/* Nav links desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-xs text-hr-muted hover:text-hr-dark tracking-wide">
              Accueil
            </Link>
            <Link href="/catalogue" className="text-xs text-hr-muted hover:text-hr-dark tracking-wide">
              Catalogue
            </Link>
            <Link href="/livraison" className="text-xs text-hr-muted hover:text-hr-dark tracking-wide">
              Livraison
            </Link>
            <Link href="/contact" className="text-xs text-hr-muted hover:text-hr-dark tracking-wide">
              Contact
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <Link href="/catalogue" className="text-hr-brown hover:text-hr-dark">
              <Search size={18} />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-hr-brown hover:text-hr-dark"
              aria-label="Panier"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-hr-dark text-white text-[9px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-hr-brown hover:text-hr-dark"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-hr-border px-6 py-4 flex flex-col gap-4">
            <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm text-hr-muted hover:text-hr-dark">Accueil</Link>
            <Link href="/catalogue" onClick={() => setMenuOpen(false)} className="text-sm text-hr-muted hover:text-hr-dark">Catalogue</Link>
            <Link href="/livraison" onClick={() => setMenuOpen(false)} className="text-sm text-hr-muted hover:text-hr-dark">Livraison</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-sm text-hr-muted hover:text-hr-dark">Contact</Link>
          </div>
        )}
      </nav>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
