"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Clock, Truck, Coins, TrendingUp } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Order } from "@/lib/types";

type Stats = {
  total: number;
  pending: number;
  shipped: number;
  revenue: number;
};

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  pending:   { label: "En attente",  class: "bg-amber-50 text-amber-700 border border-amber-200" },
  confirmed: { label: "Confirmée",   class: "bg-green-50 text-green-700 border border-green-200" },
  shipped:   { label: "Expédiée",    class: "bg-blue-50 text-blue-700 border border-blue-200" },
  delivered: { label: "Livrée",      class: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  cancelled: { label: "Annulée",     class: "bg-red-50 text-red-700 border border-red-200" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, shipped: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("orders").select("status, total"),
      supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).limit(5),
    ]).then(([{ data: all }, { data: recent }]) => {
      if (all) {
        const month = new Date();
        month.setDate(1); month.setHours(0, 0, 0, 0);
        setStats({
          total: all.length,
          pending: all.filter((o) => o.status === "pending").length,
          shipped: all.filter((o) => o.status === "shipped").length,
          revenue: all.filter((o) => o.status !== "cancelled").reduce((s, o) => s + (o.total || 0), 0),
        });
      }
      setRecentOrders(recent || []);
    });
  }, []);

  const STAT_CARDS = [
    { icon: ShoppingCart, label: "Total commandes", value: stats.total, sub: "toutes statuts" },
    { icon: Clock,        label: "En attente",      value: stats.pending, sub: "à confirmer", warn: stats.pending > 0 },
    { icon: Truck,        label: "Expédiées",       value: stats.shipped, sub: "en cours de livraison" },
    { icon: Coins,        label: "Revenus COD",     value: `${stats.revenue.toLocaleString()} DA`, sub: "commandes actives" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STAT_CARDS.map(({ icon: Icon, label, value, sub, warn }) => (
          <div key={label} className={`bg-white border rounded-lg p-4 ${warn ? "border-amber-200" : "border-hr-border"}`}>
            <div className="flex items-center gap-2 text-[10px] text-hr-hint tracking-wide mb-2">
              <Icon size={13} className={warn ? "text-amber-600" : ""} />
              {label.toUpperCase()}
            </div>
            <p className={`text-2xl font-medium ${warn ? "text-amber-700" : "text-hr-dark"}`}>{value}</p>
            <p className="text-[10px] text-hr-hint mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-hr-border rounded-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-hr-border">
          <h2 className="text-xs font-medium text-hr-dark tracking-widest">DERNIÈRES COMMANDES</h2>
          <Link href="/admin/commandes" className="text-[11px] text-hr-muted hover:text-hr-dark">
            Voir tout →
          </Link>
        </div>
        <div className="divide-y divide-hr-border">
          {recentOrders.length === 0 ? (
            <p className="px-5 py-8 text-xs text-hr-hint text-center">Aucune commande pour l&apos;instant.</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="px-5 py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-hr-dark">#{order.order_number}</span>
                    <span className="text-xs text-hr-muted">· {order.customer_name}</span>
                  </div>
                  <div className="text-[11px] text-hr-hint mt-0.5">{order.wilaya_name} · COD {order.total.toLocaleString()} DA</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-sm font-medium ${STATUS_LABELS[order.status]?.class ?? ""}`}>
                  {STATUS_LABELS[order.status]?.label ?? order.status}
                </span>
                <Link
                  href={`/admin/commandes?id=${order.id}`}
                  className="text-[11px] text-hr-muted hover:text-hr-dark border border-hr-border px-2 py-1 rounded text-center shrink-0"
                >
                  Voir
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
