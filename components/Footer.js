"use client";

import { useLang } from "@/app/providers";

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer className="site">
      <div className="wrap foot">
        <div className="brand">ONYX</div>
        <small>© {year} ONYX — {t("footer_tagline")}.</small>
      </div>
    </footer>
  );
}
