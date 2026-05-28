"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/lib/types";

export default function AdminStock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [edits, setEdits] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("products").select("*").eq("is_active", true).order("name").then(({ data }) => {
      setProducts(data || []);
    });
  }, []);

  const getQty = (id: string, original: number) =>
    edits[id] !== undefined ? edits[id] : original;

  const change = (id: string, original: number, delta: number) => {
    const current = getQty(id, original);
    setEdits({ ...edits, [id]: Math.max(0, current + delta) });
  };

  const setDirect = (id: string, val: string) => {
    setEdits({ ...edits, [id]: parseInt(val) || 0 });
  };

  const save = async (p: Product) => {
    const qty = getQty(p.id, p.stock);
    setSaving(p.id);
    const supabase = createClient();
    await supabase.from("products").update({ stock: qty, updated_at: new Date().toISOString() }).eq("id", p.id);
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, stock: qty } : x));
    setEdits((prev) => { const n = { ...prev }; delete n[p.id]; return n; });
    setSaving(null);
  };

  const getStockColor = (qty: number) => {
    if (qty === 0) return "text-red-600";
    if (qty <= 3) return "text-amber-600";
    return "text-green-700";
  };

  const getStockLabel = (qty: number) => {
    if (qty === 0) return { text: "ÉPUISÉ", class: "bg-red-50 text-red-600" };
    if (qty <= 3) return { text: "FAIBLE", class: "bg-amber-50 text-amber-600" };
    return { text: "OK", class: "bg-green-50 text-green-700" };
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xs font-medium text-hr-dark tracking-widest mb-1">GESTION DU STOCK</h2>
        <p className="text-[11px] text-hr-hint">Modifiez les quantités puis sauvegardez article par article.</p>
      </div>

      <div className="bg-white border border-hr-border rounded-lg overflow-hidden">
        <div className="divide-y divide-hr-border">
          {products.length === 0 ? (
            <p className="px-5 py-10 text-xs text-hr-hint text-center">Aucun produit actif.</p>
          ) : products.map((p) => {
            const qty = getQty(p.id, p.stock);
            const modified = edits[p.id] !== undefined;
            const label = getStockLabel(qty);

            return (
              <div key={p.id} className="flex items-center gap-4 px-5 py-3">
                {/* Product info */}
                <div className="w-10 h-10 bg-hr-warm rounded flex items-center justify-center text-lg shrink-0">
                  {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover rounded" /> : "🧢"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-hr-dark truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-medium ${label.class}`}>
                      {label.text}
                    </span>
                    <span className="text-[11px] text-hr-hint">{p.price.toLocaleString()} DA</span>
                  </div>
                </div>

                {/* Stock bar */}
                <div className="hidden md:block w-24">
                  <div className="h-1.5 bg-hr-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${qty === 0 ? "bg-red-400" : qty <= 3 ? "bg-amber-400" : "bg-green-500"}`}
                      style={{ width: `${Math.min(100, (qty / 30) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => change(p.id, p.stock, -1)} className="w-7 h-7 border border-hr-border rounded flex items-center justify-center text-hr-muted hover:bg-hr-warm">
                    <Minus size={12} />
                  </button>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setDirect(p.id, e.target.value)}
                    className={`w-12 text-center border rounded py-1 text-sm font-medium focus:outline-none
                      ${modified ? "border-hr-brown text-hr-dark" : "border-hr-border text-hr-dark"}`}
                  />
                  <button onClick={() => change(p.id, p.stock, 1)} className="w-7 h-7 border border-hr-border rounded flex items-center justify-center text-hr-muted hover:bg-hr-warm">
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={() => save(p)}
                    disabled={!modified || saving === p.id}
                    className="flex items-center gap-1 text-[10px] bg-hr-dark text-white px-2.5 py-1.5 rounded-sm hover:bg-hr-brown disabled:opacity-30"
                  >
                    <Save size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
