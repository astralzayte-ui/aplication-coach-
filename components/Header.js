"use client";

import Link from "next/link";
import { useLang, useCart } from "@/app/providers";
import { LOCALES, LANG_LABEL } from "@/lib/i18n";

export default function Header() {
  const { locale, setLocale, t } = useLang();
  const { count } = useCart();

  return (
    <header className="site">
      <div className="wrap bar">
        <Link className="brand" href="/">ONYX</Link>
        <nav className="main">
          <Link href="/montres">{t("nav_watches")}</Link>
          <Link href="/bijoux">{t("nav_jewelry")}</Link>
        </nav>
        <div className="spacer" />
        <div className="tools">
          <div className="lang" role="group" aria-label="Langue">
            {LOCALES.map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                aria-pressed={l === locale}
              >
                {LANG_LABEL[l]}
              </button>
            ))}
          </div>
          <Link className="cart-link" href="/panier" title={t("cart")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M6 7h12l-1 13H7L6 7z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <span>{t("cart")}</span>
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
