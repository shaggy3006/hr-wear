"use client";

import Link from "next/link";
import { Plus, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const hasPromo = product.original_price && product.original_price > product.price;
  const discountPct = hasPromo
    ? Math.round((1 - product.price / product.original_price!) * 100)
    : null;

  return (
    <div className="bg-white border border-hr-border rounded-lg overflow-hidden group">
      <Link href={`/produit?slug=${product.slug}`}>
        {/* Image */}
        <div className="relative h-48 bg-hr-warm flex items-center justify-center overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-5xl">🧢</span>
          )}
          {/* Badges */}
          {discountPct && (
            <span className="absolute top-2 left-2 bg-hr-promo text-white text-[10px] font-medium px-2 py-0.5 rounded-sm tracking-wide">
              -{discountPct}%
            </span>
          )}
          {!hasPromo && product.stock <= 3 && product.stock > 0 && (
            <span className="absolute top-2 left-2 bg-hr-dark text-white text-[10px] font-medium px-2 py-0.5 rounded-sm tracking-wide">
              STOCK LIMITÉ
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-xs text-hr-muted font-medium tracking-widest">ÉPUISÉ</span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <Link href={`/produit?slug=${product.slug}`}>
          <p className="text-xs font-medium text-hr-dark tracking-wide hover:text-hr-brown truncate">
            {product.name}
          </p>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-medium text-hr-dark">
              {product.price.toLocaleString()} DA
            </span>
            {hasPromo && (
              <span className="text-[11px] text-hr-hint line-through">
                {product.original_price!.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={() => product.stock > 0 && addItem(product)}
            disabled={product.stock === 0}
            className="w-7 h-7 bg-hr-dark text-white rounded flex items-center justify-center hover:bg-hr-brown disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
