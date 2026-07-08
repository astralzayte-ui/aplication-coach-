"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/app/providers";
import { SHOP } from "@/lib/shop";

export default function Footer() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const year = new Date().getFullYear();

  function subscribe(e) {
    e.preventDefault();
    if (email.includes("@")) {
      setOk(true);
      setEmail("");
    }
  }

  return (
    <footer className="site">
      <div className="wrap">
        <div className="foot-cols">
          <div className="foot-col">
            <div className="brand">ONYX</div>
            <p>{t("foot_about_txt")}</p>
            <div className="socials">
              {SHOP.instagram && (
                <a href={SHOP.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                </a>
              )}
              {SHOP.tiktok && (
                <a href={SHOP.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 3c.3 2.1 1.6 3.6 3.7 3.9v2.4c-1.3.1-2.6-.3-3.7-1v5.6a5.3 5.3 0 1 1-5.3-5.3c.3 0 .5 0 .8.1v2.5a2.8 2.8 0 1 0 2 2.7V3z" /></svg>
                </a>
              )}
            </div>
          </div>

          <div className="foot-col">
            <h5>{t("foot_shop")}</h5>
            <div className="foot-links">
              <Link href="/montres">{t("nav_watches")}</Link>
              <Link href="/bijoux">{t("nav_jewelry")}</Link>
            </div>
          </div>

          <div className="foot-col">
            <h5>{t("foot_help")}</h5>
            <div className="foot-links">
              <Link href="/contact">{t("contact")}</Link>
              <Link href="/faq">{t("faq")}</Link>
              <Link href="/livraison-retours">{t("shipping_returns")}</Link>
            </div>
          </div>

          <div className="foot-col">
            <h5>{t("nl_t")}</h5>
            <p>{t("nl_d")}</p>
            {ok ? (
              <div className="nl-ok">{t("nl_ok")}</div>
            ) : (
              <form className="nl-form" onSubmit={subscribe}>
                <input
                  type="email"
                  placeholder={t("nl_ph")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label={t("nl_ph")}
                  required
                />
                <button className="btn btn-primary" type="submit">{t("nl_btn")}</button>
              </form>
            )}
          </div>
        </div>

        <div className="foot-bottom">
          <div className="foot-links" style={{ flexDirection: "row", gap: 18, flexWrap: "wrap" }}>
            <Link href="/mentions-legales">{t("legal_notice")}</Link>
            <Link href="/cgv">{t("terms")}</Link>
            <Link href="/confidentialite">{t("privacy")}</Link>
          </div>
          <div className="pay-icons" title={t("payment_methods")}>
            <span className="pill">VISA</span>
            <span className="pill">MASTERCARD</span>
            <span className="pill">YOUCAN PAY</span>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <small style={{ color: "var(--muted-2)", letterSpacing: "0.05em" }}>
            © {year} ONYX. {t("rights")}
          </small>
        </div>
      </div>
    </footer>
  );
}
