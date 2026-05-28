"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export default function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProducts(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] text-hr-hint tracking-[0.4em] mb-2">HR WEAR</p>
        <h1 className="text-2xl font-medium text-hr-dark tracking-wide">Catalogue</h1>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-hr-hint" />
        <input
          type="text"
          placeholder="Rechercher un modèle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-hr-border rounded bg-white text-hr-dark placeholder-hr-hint focus:outline-none focus:border-hr-brown"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border border-hr-border rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-hr-warm" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-hr-border rounded w-3/4" />
                <div className="h-3 bg-hr-border rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <>
          <p className="text-xs text-hr-hint mb-5">{filtered.length} article{filtered.length > 1 ? "s" : ""}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-hr-hint text-sm">
          {search ? `Aucun résultat pour "${search}"` : "Aucun produit disponible pour l'instant."}
        </div>
      )}
    </div>
  );
}
