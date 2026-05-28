"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Truck, MapPin, CreditCard, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => {
        setFeatured(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-hr-warm">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <p className="text-[10px] text-hr-hint tracking-[0.4em] mb-4">BOUTIQUE · ALGÉRIE</p>
            <h1 className="text-4xl md:text-5xl font-medium text-hr-dark leading-[1.1] mb-4">
              L&apos;art de<br />
              <em className="not-italic text-[#7A6252]">porter.</em>
            </h1>
            <p className="text-sm text-hr-muted leading-relaxed mb-8 max-w-xs">
              Sélection premium livrée partout en Algérie. Paiement à la livraison sur les 58 wilayas.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/catalogue"
                className="bg-hr-dark text-white text-xs tracking-widest px-6 py-3 rounded-sm hover:bg-hr-brown"
              >
                VOIR LA COLLECTION
              </Link>
              <Link
                href="/livraison"
                className="border border-[#B8AA9C] text-hr-brown text-xs tracking-widest px-6 py-3 rounded-sm hover:bg-hr-warm"
              >
                LIVRAISON
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            {/* Logo HR */}
            <div className="w-28 h-28 rounded-full bg-hr-dark flex items-center justify-center shadow-md">
              <span
                className="text-white font-bold tracking-[0.15em]"
                style={{ fontSize: "2.6rem", fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: "0.12em" }}
              >
                HR
              </span>
            </div>
            <div className="flex gap-6">
              {[
                { num: "58", label: "WILAYAS" },
                { num: "COD", label: "PAIEMENT" },
                { num: "24-72h", label: "LIVRAISON" },
              ].map(({ num, label }) => (
                <div key={label} className="text-center">
                  <p className="text-lg font-medium text-hr-dark">{num}</p>
                  <p className="text-[9px] text-hr-hint tracking-[0.2em] mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      <div className="bg-hr-dark py-3 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-8">
          {[
            { icon: <CreditCard size={13} />, text: "Paiement à la livraison — aucune avance" },
            { icon: <Truck size={13} />, text: "Via TawssilGo · Alger & 58 wilayas" },
            { icon: <MapPin size={13} />, text: "Qualité garantie à réception" },
          ].map(({ icon, text }, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-[#D4C5A9]">
              <span className="text-white/80">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-base font-medium text-hr-dark tracking-widest">NOUVEAUTÉS</h2>
          <Link href="/catalogue" className="flex items-center gap-1 text-xs text-hr-muted hover:text-hr-dark">
            Voir tout <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-hr-border rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-hr-warm" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-hr-border rounded w-3/4" />
                  <div className="h-3 bg-hr-border rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-hr-hint text-sm">
            La collection arrive bientôt...
          </div>
        )}
      </section>

      {/* Delivery section */}
      <section className="bg-hr-warm">
        <div className="max-w-6xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <p className="text-[10px] text-hr-hint tracking-[0.3em] mb-3">TAWSSILGO</p>
            <h2 className="text-xl font-medium text-hr-dark mb-3">
              Livraison partout<br />en Algérie
            </h2>
            <p className="text-sm text-hr-muted leading-relaxed max-w-xs">
              Les frais de livraison sont calculés automatiquement selon votre wilaya au moment de la commande.
            </p>
          </div>

          <div className="bg-white border border-[#D4C5A9] rounded-lg p-6 text-center min-w-[180px]">
            <div className="text-3xl mb-3">🏠</div>
            <p className="text-sm font-medium text-hr-dark tracking-wide mb-1">Livraison à domicile</p>
            <p className="text-[11px] text-hr-hint leading-relaxed mb-3">
              Livraison directement<br />à votre adresse
            </p>
            <p className="text-xs font-medium text-hr-dark">
              À partir de <span className="text-sm">400 DA</span>
            </p>
            <p className="text-[10px] text-hr-hint mt-0.5">varie selon la wilaya</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-6">
          <div className="border-t border-[#D4C5A9] pt-4 flex items-center gap-2 text-[11px] text-hr-muted">
            <MapPin size={13} className="text-hr-hint" />
            Le tarif exact est affiché lors de la commande selon votre wilaya.
          </div>
        </div>
      </section>
    </>
  );
}
