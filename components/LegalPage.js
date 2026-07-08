"use client";

import Link from "next/link";
import { useLang } from "@/app/providers";
import { field } from "@/lib/i18n";
import { LEGAL } from "@/lib/content";

export default function LegalPage({ slug }) {
  const { locale, t } = useLang();
  const page = LEGAL[slug];
  if (!page) return null;

  const note =
    locale === "ar"
      ? "النسخة الفرنسية هي المرجع القانوني."
      : "The French version is the legally authoritative one.";

  return (
    <section className="section wrap">
      <div className="section-head">
        <h1 className="page-title">{field(page.title, locale)}</h1>
      </div>
      {locale !== "fr" && <div className="info-note">{note}</div>}
      <div className="prose" dangerouslySetInnerHTML={{ __html: page.html }} />
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <Link className="btn" href="/">{t("back_home")}</Link>
      </div>
    </section>
  );
}
