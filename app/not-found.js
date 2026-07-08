"use client";

import Link from "next/link";
import { useLang } from "@/app/providers";

const M = {
  fr: { t: "Page introuvable", d: "La page que vous cherchez n'existe pas ou a été déplacée.", b: "Retour à l'accueil" },
  en: { t: "Page not found", d: "The page you're looking for doesn't exist or has moved.", b: "Back to home" },
  ar: { t: "الصفحة غير موجودة", d: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.", b: "العودة إلى الرئيسية" },
};

export default function NotFound() {
  const { locale } = useLang();
  const m = M[locale] || M.fr;
  return (
    <section className="section wrap" style={{ textAlign: "center", padding: "110px 0" }}>
      <div className="eyebrow">404</div>
      <h1 className="page-title" style={{ marginTop: 12 }}>{m.t}</h1>
      <p style={{ color: "var(--muted)", margin: "14px auto 28px", maxWidth: "40ch" }}>{m.d}</p>
      <Link className="btn btn-primary" href="/">{m.b}</Link>
    </section>
  );
}
