"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, Truck, Phone } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Order } from "@/lib/types";

export default function ConfirmationClient() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .single()
      .then(({ data }: { data: any }) => setOrder(data));
  }, [id]);

  return (
    <div className="max-w-lg mx-auto px-6 py-16 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle size={56} strokeWidth={1.5} className="text-hr-success" />
      </div>
      <p className="text-[10px] text-hr-hint tracking-[0.4em] mb-2">COMMANDE REÇUE</p>
      <h1 className="text-2xl font-medium text-hr-dark mb-3">Merci !</h1>
      <p className="text-sm text-hr-muted leading-relaxed mb-8">
        Votre commande a bien été enregistrée. Vous serez contacté(e) par notre équipe pour confirmer la livraison.
      </p>

      {order && (
        <div className="bg-hr-warm border border-[#D4C5A9] rounded-lg p-6 text-left mb-8 space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-hr-hint tracking-wide">COMMANDE N°</span>
            <span className="font-medium text-hr-dark">{order.order_number}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-hr-hint tracking-wide">NOM</span>
            <span className="text-hr-dark">{order.customer_name}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-hr-hint tracking-wide">WILAYA</span>
            <span className="text-hr-dark">{order.wilaya_name}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-hr-hint tracking-wide">TÉLÉPHONE</span>
            <span className="text-hr-dark">{order.customer_phone}</span>
          </div>
          <div className="border-t border-[#D4C5A9] pt-3 flex justify-between text-sm font-medium text-hr-dark">
            <span>Total COD</span>
            <span>{order.total.toLocaleString()} DA</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 text-xs text-hr-muted mb-8">
        <div className="flex items-center justify-center gap-2">
          <Truck size={13} /> Livraison via TawssilGo · paiement à la réception
        </div>
        <div className="flex items-center justify-center gap-2">
          <Phone size={13} /> Notre équipe vous contactera sous 24h
        </div>
      </div>

      <Link
        href="/catalogue"
        className="inline-block border border-hr-border text-hr-dark text-xs tracking-widest px-8 py-3 rounded-sm hover:bg-hr-warm"
      >
        CONTINUER LES ACHATS
      </Link>
    </div>
  );
}
