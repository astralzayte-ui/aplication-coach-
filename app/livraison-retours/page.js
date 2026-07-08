"use client";

import { useLang } from "@/app/providers";
import { field } from "@/lib/i18n";
import { SHIPPING } from "@/lib/content";

export default function ShippingPage() {
  const { locale } = useLang();
  return (
    <section className="section wrap">
      <div className="section-head">
        <h1 className="page-title">{field(SHIPPING.title, locale)}</h1>
      </div>
      <div className="prose">
        {SHIPPING.blocks.map((b, i) => (
          <div key={i}>
            <h3>{field(b.h, locale)}</h3>
            <p>{field(b.p, locale)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
