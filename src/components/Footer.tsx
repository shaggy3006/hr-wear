import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-hr-dark mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="text-white font-medium tracking-[0.3em] text-sm">HR WEAR</span>

        <div className="flex items-center gap-6">
          <Link href="/livraison" className="text-[11px] text-white/40 hover:text-white/70 tracking-wide">
            Livraison
          </Link>
          <Link href="/contact" className="text-[11px] text-white/40 hover:text-white/70 tracking-wide">
            Contact
          </Link>
          <Link href="/conditions" className="text-[11px] text-white/40 hover:text-white/70 tracking-wide">
            Conditions
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/hrwear.dz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white"
            aria-label="Instagram HR WEAR"
          >
            <Instagram size={17} />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white"
            aria-label="Facebook HR WEAR"
          >
            <Facebook size={17} />
          </a>
        </div>
      </div>
      <div className="border-t border-white/5 py-3 text-center">
        <p className="text-[10px] text-white/20 tracking-widest">
          © {new Date().getFullYear()} HR WEAR · Algérie
        </p>
      </div>
    </footer>
  );
}
