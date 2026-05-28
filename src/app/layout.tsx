import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "HR WEAR — Boutique Casquettes Algérie",
  description: "Casquettes premium livrées partout en Algérie. Paiement à la livraison sur les 58 wilayas via TawssilGo.",
  keywords: ["casquette", "algérie", "hrwear", "livraison", "snapback"],
  openGraph: {
    title: "HR WEAR",
    description: "Casquettes premium — Livraison sur 58 wilayas · COD",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
