"use client";

import { useLang } from "@/app/providers";

export default function WhyOnyx() {
  const { t } = useLang();
  const items = [
    {
      icon: <path d="M12 3l3 6 6 .9-4.5 4.2 1 6-5.5-3-5.5 3 1-6L3 9.9 9 9z" />,
      t: t("why1_t"), d: t("why1_d"),
    },
    {
      icon: <><path d="M4 13l7-9 9 7-9 9z" /><circle cx="14.5" cy="8.5" r="1.3" /></>,
      t: t("why2_t"), d: t("why2_d"),
    },
    {
      icon: <path d="M4 5h16v11H8l-4 4z" />,
      t: t("why3_t"), d: t("why3_d"),
    },
  ];
  return (
    <section className="section wrap">
      <div className="section-head">
        <div className="eyebrow">{t("why_eb")}</div>
        <h2>{t("why_t")}</h2>
      </div>
      <div className="why">
        {items.map((it, i) => (
          <div className="it" key={i}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.3" style={{ width: 34, height: 34 }}>
              {it.icon}
            </svg>
            <h4>{it.t}</h4>
            <p>{it.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
