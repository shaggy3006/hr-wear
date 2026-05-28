import { MapPin, Truck } from "lucide-react";
import { WILAYAS } from "@/lib/wilayas";

export default function LivraisonPage() {
  const available = WILAYAS.filter((w) => w.domicile !== null);
  const unavailable = WILAYAS.filter((w) => w.domicile === null);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-[10px] text-hr-hint tracking-[0.4em] mb-2">TAWSSILGO</p>
        <h1 className="text-2xl font-medium text-hr-dark tracking-wide">Livraison</h1>
      </div>

      {/* Info block */}
      <div className="bg-hr-warm border border-[#D4C5A9] rounded-lg p-6 flex gap-5 mb-10">
        <Truck size={28} strokeWidth={1.5} className="text-hr-muted shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-hr-dark mb-1">Livraison à domicile partout en Algérie</p>
          <p className="text-xs text-hr-muted leading-relaxed">
            HR WEAR livre via <strong>TawssilGo</strong>. Le paiement se fait uniquement en espèces à la réception du colis (COD). Aucune avance n&apos;est requise.
          </p>
        </div>
      </div>

      {/* Pricing table */}
      <h2 className="text-xs font-medium text-hr-dark tracking-widest mb-4 flex items-center gap-2">
        <MapPin size={13} /> TARIFS PAR WILAYA
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
        {available.map((w) => (
          <div key={w.id} className="flex items-center justify-between px-4 py-2.5 bg-white border border-hr-border rounded text-xs">
            <span className="text-hr-dark">
              <span className="text-hr-hint mr-2">{String(w.id).padStart(2, "0")}</span>
              {w.name}
            </span>
            <span className="font-medium text-hr-dark">{w.domicile?.toLocaleString()} DA</span>
          </div>
        ))}
      </div>

      {unavailable.length > 0 && (
        <div className="text-xs text-hr-hint border-t border-hr-border pt-5">
          <p className="mb-2 font-medium text-hr-muted tracking-wide">WILAYAS NON DESSERVIES</p>
          <p>{unavailable.map((w) => w.name).join(" · ")}</p>
        </div>
      )}
    </div>
  );
}
