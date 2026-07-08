"use client";

import { useLang } from "@/app/providers";

export default function Assurances() {
  const { t } = useLang();
  return (
    <section className="section wrap">
      <div className="assur">
        <div className="item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="3" y="7" width="15" height="10" rx="1" />
            <path d="M18 10h3l-1 7h-2" />
            <circle cx="7" cy="19" r="1.6" />
            <circle cx="16" cy="19" r="1.6" />
          </svg>
          <h4>{t("a1_t")}</h4>
          <p>{t("a1_d")}</p>
        </div>
        <div className="item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <h4>{t("a2_t")}</h4>
          <p>{t("a2_d")}</p>
        </div>
        <div className="item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="12" cy="9" r="5" />
            <path d="M8.5 13L7 21l5-2.5L17 21l-1.5-8" />
          </svg>
          <h4>{t("a3_t")}</h4>
          <p>{t("a3_d")}</p>
        </div>
      </div>
    </section>
  );
}
