"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, MapPin } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getAvailableWilayas, getDeliveryCost } from "@/lib/wilayas";
import { createClient } from "@/lib/supabase/client";

export default function CommandePage() {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCart();
  const router = useRouter();
  const wilayas = getAvailableWilayas();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    wilaya_id: "",
    address: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const wilayaId = parseInt(form.wilaya_id) || 0;
  const deliveryCost = wilayaId ? getDeliveryCost(wilayaId) : 0;
  const total = subtotal + deliveryCost;
  const wilayaName = wilayas.find((w) => w.id === wilayaId)?.name || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { setError("Votre panier est vide."); return; }
    if (!form.name || !form.phone || !form.wilaya_id || !form.address) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    setError("");
    const supabase = createClient();

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        customer_name: form.name,
        customer_phone: form.phone,
        wilaya_id: wilayaId,
        wilaya_name: wilayaName,
        address: form.address,
        delivery_cost: deliveryCost,
        subtotal,
        total,
        notes: form.notes || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderErr || !order) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
      return;
    }

    await supabase.from("order_items").insert(
      items.map((i) => ({
        order_id: order.id,
        product_id: i.product.id,
        product_name: i.product.name,
        product_price: i.product.price,
        quantity: i.quantity,
      }))
    );

    // Update stock
    for (const item of items) {
      await supabase.rpc("decrement_stock", {
        p_id: item.product.id,
        qty: item.quantity,
      });
    }

    clearCart();
    router.push(`/confirmation?id=${order.id}`);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-hr-hint text-sm mb-4">Votre panier est vide.</p>
        <a href="/catalogue" className="text-xs underline underline-offset-4 text-hr-muted hover:text-hr-dark">
          Parcourir le catalogue
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-[10px] text-hr-hint tracking-[0.4em] mb-2">HR WEAR</p>
        <h1 className="text-2xl font-medium text-hr-dark tracking-wide">Commander</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10">
        {/* Left: form */}
        <div className="space-y-5">
          <h2 className="text-xs font-medium text-hr-dark tracking-widest border-b border-hr-border pb-3">
            VOS INFORMATIONS
          </h2>

          <div>
            <label className="block text-[10px] text-hr-hint tracking-widest mb-1.5">NOM COMPLET *</label>
            <input
              name="name" value={form.name} onChange={handleChange} required
              placeholder="Ahmed Benali"
              className="w-full border border-hr-border rounded px-3 py-2.5 text-sm text-hr-dark bg-white placeholder-hr-hint focus:outline-none focus:border-hr-brown"
            />
          </div>

          <div>
            <label className="block text-[10px] text-hr-hint tracking-widest mb-1.5">TÉLÉPHONE *</label>
            <input
              name="phone" value={form.phone} onChange={handleChange} required
              placeholder="0770 000 000"
              className="w-full border border-hr-border rounded px-3 py-2.5 text-sm text-hr-dark bg-white placeholder-hr-hint focus:outline-none focus:border-hr-brown"
            />
          </div>

          <div>
            <label className="block text-[10px] text-hr-hint tracking-widest mb-1.5">WILAYA *</label>
            <select
              name="wilaya_id" value={form.wilaya_id} onChange={handleChange} required
              className="w-full border border-hr-border rounded px-3 py-2.5 text-sm text-hr-dark bg-white focus:outline-none focus:border-hr-brown"
            >
              <option value="">Sélectionner votre wilaya</option>
              {wilayas.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.id.toString().padStart(2, "0")} — {w.name} ({w.domicile?.toLocaleString()} DA)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-hr-hint tracking-widest mb-1.5">ADRESSE DE LIVRAISON *</label>
            <textarea
              name="address" value={form.address} onChange={handleChange} required
              placeholder="Rue, quartier, commune..."
              rows={3}
              className="w-full border border-hr-border rounded px-3 py-2.5 text-sm text-hr-dark bg-white placeholder-hr-hint focus:outline-none focus:border-hr-brown resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-hr-hint tracking-widest mb-1.5">NOTES (optionnel)</label>
            <textarea
              name="notes" value={form.notes} onChange={handleChange}
              placeholder="Instructions particulières..."
              rows={2}
              className="w-full border border-hr-border rounded px-3 py-2.5 text-sm text-hr-dark bg-white placeholder-hr-hint focus:outline-none focus:border-hr-brown resize-none"
            />
          </div>
        </div>

        {/* Right: summary */}
        <div>
          <h2 className="text-xs font-medium text-hr-dark tracking-widest border-b border-hr-border pb-3 mb-5">
            RÉCAPITULATIF
          </h2>

          {/* Items */}
          <div className="space-y-3 mb-6">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-3 py-3 border-b border-hr-border">
                <div className="w-12 h-12 bg-hr-warm rounded flex items-center justify-center text-xl shrink-0">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded" />
                  ) : "🧢"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-hr-dark truncate">{product.name}</p>
                  <p className="text-xs text-hr-muted">{product.price.toLocaleString()} DA</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => updateQuantity(product.id, quantity - 1)} className="w-5 h-5 border border-hr-border rounded text-hr-muted hover:bg-hr-warm flex items-center justify-center">
                    <Minus size={10} />
                  </button>
                  <span className="text-xs text-hr-dark w-4 text-center">{quantity}</span>
                  <button type="button" onClick={() => updateQuantity(product.id, quantity + 1)} className="w-5 h-5 border border-hr-border rounded text-hr-muted hover:bg-hr-warm flex items-center justify-center">
                    <Plus size={10} />
                  </button>
                  <button type="button" onClick={() => removeItem(product.id)} className="text-hr-hint hover:text-hr-promo ml-1">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="bg-hr-warm rounded p-4 space-y-2 mb-4">
            <div className="flex justify-between text-xs text-hr-muted">
              <span>Sous-total</span>
              <span>{subtotal.toLocaleString()} DA</span>
            </div>
            <div className="flex justify-between text-xs text-hr-muted">
              <span className="flex items-center gap-1">
                <MapPin size={11} /> Livraison {wilayaName && `· ${wilayaName}`}
              </span>
              <span>{wilayaId ? `${deliveryCost.toLocaleString()} DA` : "—"}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-hr-dark border-t border-[#D4C5A9] pt-2 mt-2">
              <span>Total COD</span>
              <span>{wilayaId ? `${total.toLocaleString()} DA` : "—"}</span>
            </div>
          </div>

          {/* COD notice */}
          <div className="flex items-center gap-2 text-[11px] text-hr-muted bg-hr-warm border border-[#D4C5A9] rounded px-3 py-2.5 mb-5">
            <span className="text-hr-success text-base">💵</span>
            Paiement en espèces à la réception du colis
          </div>

          {error && (
            <p className="text-xs text-hr-promo mb-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-hr-dark text-white text-xs tracking-widest py-3.5 rounded-sm hover:bg-hr-brown disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "ENVOI EN COURS..." : "CONFIRMER LA COMMANDE"}
          </button>
        </div>
      </form>
    </div>
  );
}
