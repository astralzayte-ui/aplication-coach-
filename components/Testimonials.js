"use client";

import { useLang } from "@/app/providers";
import { field } from "@/lib/i18n";
import { TESTIMONIALS } from "@/lib/content";
import Stars from "./Stars";

export default function Testimonials() {
  const { locale, t } = useLang();
  return (
    <section className="section wrap">
      <div className="section-head">
        <div className="eyebrow">{t("reviews_eb")}</div>
        <h2>{t("reviews_t")}</h2>
      </div>
      <div className="tstack">
        {TESTIMONIALS.map((r, i) => (
          <div className="tcard" key={i}>
            <Stars value={r.rating} />
            <p>“{field(r.text, locale)}”</p>
            <div className="who">— {r.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
