"use client";

import { useLang } from "@/app/providers";
import { field } from "@/lib/i18n";
import { FAQ } from "@/lib/content";

export default function FaqPage() {
  const { locale, t } = useLang();
  return (
    <section className="section wrap">
      <div className="section-head">
        <div className="eyebrow">{t("faq")}</div>
        <h1 className="page-title">FAQ</h1>
      </div>
      <div className="prose" style={{ maxWidth: 760 }}>
        {FAQ.map((item, i) => (
          <details key={i} className="faq-item">
            <summary>{field(item.q, locale)}</summary>
            <p>{field(item.a, locale)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
