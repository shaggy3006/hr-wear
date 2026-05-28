"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { Plus, Minus, ShoppingBag, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single()
      .then(({ data }) => {
        setProduct(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-square bg-hr-warm rounded-lg" />
        <div className="space-y-4">
          <div className="h-6 bg-hr-border rounded w-2/3" />
          <div className="h-4 bg-hr-border rounded w-1/3" />
          <div className="h-20 bg-hr-border rounded" />
        </div>
      </div>
    );
  }

  if (!product) return notFound();

  const hasPromo = product.original_price && product.original_price > product.price;
  const discountPct = hasPromo
    ? Math.round((1 - product.price / product.original_price!) * 100)
    : null;

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link href="/catalogue" className="flex items-center gap-2 text-xs text-hr-muted hover:text-hr-dark mb-8">
        <ArrowLeft size={14} /> Retour au catalogue
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square bg-hr-warm rounded-lg flex items-center justify-center relative overflow-hidden">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-8xl">🧢</span>
          )}
          {discountPct && (
            <span className="absolute top-4 left-4 bg-hr-promo text-white text-xs font-medium px-2.5 py-1 rounded-sm">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-[10px] text-hr-hint tracking-[0.3em] mb-2">HR WEAR</p>
          <h1 className="text-2xl font-medium text-hr-dark mb-1">{product.name}</h1>

          <div className="flex items-baseline gap-3 mt-3 mb-5">
            <span className="text-2xl font-medium text-hr-dark">{product.price.toLocaleString()} DA</span>
            {hasPromo && (
              <span className="text-base text-hr-hint line-through">{product.original_price!.toLocaleString()} DA</span>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-hr-muted leading-relaxed mb-6 border-t border-hr-border pt-5">
              {product.description}
            </p>
          )}

          {/* Stock */}
          {product.stock === 0 ? (
            <div className="mb-6 py-3 px-4 bg-hr-warm border border-hr-border-soft rounded text-xs text-hr-muted text-center tracking-wide">
              ARTICLE ÉPUISÉ
            </div>
          ) : (
            <>
              {/* Qty */}
              <div className="flex items-center gap-4 mb-5">
                <span className="text-xs text-hr-muted tracking-wide">QUANTITÉ</span>
                <div className="flex items-center border border-hr-border rounded overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-9 h-9 flex items-center justify-center text-hr-muted hover:bg-hr-warm"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-hr-dark">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-9 h-9 flex items-center justify-center text-hr-muted hover:bg-hr-warm"
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <span className="text-[11px] text-hr-hint">{product.stock} en stock</span>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAdd}
                className="flex items-center justify-center gap-3 w-full bg-hr-dark text-white text-xs tracking-widest py-3.5 rounded-sm hover:bg-hr-brown mb-3"
              >
                <ShoppingBag size={15} />
                {added ? "AJOUTÉ !" : "AJOUTER AU PANIER"}
              </button>

              <Link
                href="/commande"
                className="flex items-center justify-center w-full border border-hr-border text-hr-dark text-xs tracking-widest py-3.5 rounded-sm hover:bg-hr-warm"
              >
                COMMANDER MAINTENANT
              </Link>
            </>
          )}

          {/* Delivery info */}
          <div className="mt-6 p-4 bg-hr-warm rounded flex items-start gap-3">
            <Truck size={15} className="text-hr-muted mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-hr-dark">Livraison à domicile</p>
              <p className="text-[11px] text-hr-muted mt-0.5">
                Partout en Algérie via TawssilGo · Paiement à la livraison (COD)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
