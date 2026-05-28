"use client";

import { useEffect, useState } from "react";
import { Check, Truck, Eye, X as XIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Order, OrderStatus } from "@/lib/types";

const STATUSES: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all",       label: "Toutes" },
  { value: "pending",   label: "En attente" },
  { value: "confirmed", label: "Confirmées" },
  { value: "shipped",   label: "Expédiées" },
  { value: "delivered", label: "Livrées" },
  { value: "cancelled", label: "Annulées" },
];

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-700",
  confirmed: "bg-green-50 text-green-700",
  shipped:   "bg-blue-50 text-blue-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  pending:   "En attente",
  confirmed: "Confirmée",
  shipped:   "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export default function AdminCommandes() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [tracking, setTracking] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    const supabase = createClient();
    let q = supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setOrders(data || []);
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (selected?.id === id) setSelected((p) => p ? { ...p, status } : p);
    await fetchOrders();
    setSaving(false);
  };

  const saveTracking = async () => {
    if (!selected) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("orders").update({ tracking_number: tracking, status: "shipped", updated_at: new Date().toISOString() }).eq("id", selected.id);
    setSelected((p) => p ? { ...p, tracking_number: tracking, status: "shipped" } : p);
    await fetchOrders();
    setSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
        {STATUSES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1.5 text-[11px] rounded-sm whitespace-nowrap transition-colors ${
              filter === value
                ? "bg-hr-dark text-white"
                : "bg-white border border-hr-border text-hr-muted hover:text-hr-dark"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Orders list */}
        <div className="bg-white border border-hr-border rounded-lg overflow-hidden">
          <div className="divide-y divide-hr-border">
            {orders.length === 0 ? (
              <p className="px-5 py-10 text-xs text-hr-hint text-center">Aucune commande.</p>
            ) : orders.map((order) => (
              <div
                key={order.id}
                onClick={() => { setSelected(order); setTracking(order.tracking_number || ""); }}
                className={`px-4 py-3 cursor-pointer hover:bg-hr-bg transition-colors ${selected?.id === order.id ? "bg-hr-warm" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-hr-dark">#{order.order_number}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${STATUS_STYLES[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <p className="text-[11px] text-hr-muted mt-0.5 truncate">{order.customer_name} · {order.wilaya_name}</p>
                  </div>
                  <span className="text-xs font-medium text-hr-dark shrink-0">{order.total.toLocaleString()} DA</span>
                </div>
                {/* Quick actions for pending */}
                {order.status === "pending" && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); updateStatus(order.id, "confirmed"); }}
                      className="flex items-center gap-1 text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-sm hover:bg-green-100"
                    >
                      <Check size={11} /> Confirmer
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); updateStatus(order.id, "cancelled"); }}
                      className="flex items-center gap-1 text-[10px] bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded-sm hover:bg-red-100"
                    >
                      <XIcon size={11} /> Annuler
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="bg-white border border-hr-border rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-hr-dark tracking-widest">COMMANDE #{selected.order_number}</h3>
              <button onClick={() => setSelected(null)} className="text-hr-hint hover:text-hr-dark"><XIcon size={15} /></button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                ["Client", selected.customer_name],
                ["Téléphone", selected.customer_phone],
                ["Wilaya", selected.wilaya_name],
                ["Adresse", selected.address],
                ["Livraison", `${selected.delivery_cost.toLocaleString()} DA`],
                ["Total COD", `${selected.total.toLocaleString()} DA`],
                ...(selected.notes ? [["Notes", selected.notes]] : []),
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-hr-hint w-20 shrink-0">{k}</span>
                  <span className="text-hr-dark">{v}</span>
                </div>
              ))}
            </div>

            {/* Articles */}
            {selected.order_items && selected.order_items.length > 0 && (
              <div className="border-t border-hr-border pt-3">
                <p className="text-[10px] text-hr-hint tracking-widest mb-2">ARTICLES</p>
                {selected.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs py-1">
                    <span className="text-hr-dark">{item.product_name} ×{item.quantity}</span>
                    <span className="text-hr-muted">{(item.product_price * item.quantity).toLocaleString()} DA</span>
                  </div>
                ))}
              </div>
            )}

            {/* Status change */}
            <div className="border-t border-hr-border pt-3 space-y-2">
              <p className="text-[10px] text-hr-hint tracking-widests">CHANGER LE STATUT</p>
              <div className="grid grid-cols-2 gap-2">
                {(["confirmed", "shipped", "delivered", "cancelled"] as OrderStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    disabled={selected.status === s || saving}
                    className={`text-[10px] py-1.5 px-2 rounded-sm border transition-colors disabled:opacity-40
                      ${selected.status === s
                        ? "bg-hr-dark text-white border-hr-dark"
                        : "bg-white text-hr-muted border-hr-border hover:border-hr-brown"
                      }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* Tracking */}
            <div className="border-t border-hr-border pt-3 space-y-2">
              <p className="text-[10px] text-hr-hint tracking-widests">N° SUIVI TAWSSILGO</p>
              <div className="flex gap-2">
                <input
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder="Numéro de tracking..."
                  className="flex-1 border border-hr-border rounded px-2.5 py-1.5 text-xs text-hr-dark focus:outline-none focus:border-hr-brown"
                />
                <button
                  onClick={saveTracking}
                  disabled={saving || !tracking}
                  className="flex items-center gap-1 bg-hr-dark text-white text-[10px] px-3 py-1.5 rounded-sm hover:bg-hr-brown disabled:opacity-50"
                >
                  <Truck size={11} /> Sauvegarder
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-hr-border rounded-lg flex items-center justify-center text-hr-hint text-xs p-10">
            <div className="text-center">
              <Eye size={28} strokeWidth={1} className="mx-auto mb-3 text-hr-border" />
              Cliquez sur une commande pour voir les détails
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
