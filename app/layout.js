import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "ONYX — Montres & Bijoux pour Homme",
  description:
    "ONYX — boutique de montres et bijoux de luxe pour homme. Livraison mondiale, paiement sécurisé.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" dir="ltr">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
