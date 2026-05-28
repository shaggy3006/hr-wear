"use client";

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

type Props = { open: boolean; onClose: () => void };

export default function CartSidebar({ open, onClose }: Props) {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart();

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-50"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-hr-bg z-50 flex flex-col shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-hr-border bg-white">
          <span className="text-sm font-medium text-hr-dark tracking-widest">
            PANIER ({totalItems})
          </span>
          <button onClick={onClose} className="text-hr-muted hover:text-hr-dark">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-hr-hint">
              <ShoppingBag size={40} strokeWidth={1} />
              <p className="text-sm">Votre panier est vide</p>
              <button onClick={onClose} className="text-xs underline underline-offset-4 text-hr-muted hover:text-hr-dark">
                Continuer les achats
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 border-b border-hr-border pb-4">
                  {/* Image placeholder */}
                  <div className="w-16 h-16 bg-hr-warm rounded flex items-center justify-center text-2xl shrink-0">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded" />
                    ) : "🧢"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-hr-dark truncate">{product.name}</p>
                    <p className="text-xs text-hr-muted mt-0.5">{product.price.toLocaleString()} DA</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-6 h-6 border border-hr-border-soft rounded flex items-center justify-center text-hr-muted hover:bg-hr-warm"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-medium text-hr-dark w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-6 h-6 border border-hr-border-soft rounded flex items-center justify-center text-hr-muted hover:bg-hr-warm"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="ml-auto text-hr-hint hover:text-hr-promo"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-hr-border bg-white px-6 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-hr-muted">Sous-total</span>
              <span className="font-medium text-hr-dark">{subtotal.toLocaleString()} DA</span>
            </div>
            <p className="text-[11px] text-hr-hint">+ frais de livraison calculés à la commande</p>
            <Link
              href="/commande"
              onClick={onClose}
              className="block w-full bg-hr-dark text-white text-center text-xs tracking-widest py-3 rounded hover:bg-hr-brown"
            >
              COMMANDER
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
