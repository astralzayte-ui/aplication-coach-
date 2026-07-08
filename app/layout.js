import "./globals.css";
import { Providers } from "./providers";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL("https://onyx-store.vercel.app"),
  title: {
    default: "ONYX — Montres & Bijoux de luxe pour Homme",
    template: "%s — ONYX",
  },
  description:
    "ONYX — boutique de montres et bijoux de luxe pour homme. Livraison mondiale, paiement 100% sécurisé, retours sous 14 jours.",
  keywords: ["montre homme", "bijoux homme", "bague homme", "montre de luxe", "ONYX"],
  openGraph: {
    title: "ONYX — Montres & Bijoux de luxe pour Homme",
    description: "L'élégance masculine, façonnée dans le détail.",
    type: "website",
    siteName: "ONYX",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" dir="ltr">
      <body>
        <Providers>
          <AnnouncementBar />
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
