"use client";

import Link from "next/link";
import { useLang } from "./providers";
import Assurances from "@/components/Assurances";
import ProductCard from "@/components/ProductCard";
import WhyOnyx from "@/components/WhyOnyx";
import Testimonials from "@/components/Testimonials";
import { getFeatured, getByCategory } from "@/data/products";

export default function Home() {
  const { t } = useLang();
  const featured = getFeatured();
  const watches = getByCategory("montres");
  const jewelry = getByCategory("bijoux");
  const highlights = [...jewelry, ...watches].slice(0, 3);

  return (
    <>
      <section className="hero wrap">
        <div className="eyebrow">{t("hero_eyebrow")}</div>
        <h1>ONYX</h1>
        <div className="rule" />
        <p className="lead">{t("hero_lead")}</p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/montres">{t("cta_discover")}</Link>
          {featured && (
            <Link className="btn btn-ghost" href={`/produit/${featured.slug}`}>
              {t("cta_configure")}
            </Link>
          )}
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <div className="eyebrow">{t("uni_eyebrow")}</div>
          <h2>{t("uni_title")}</h2>
        </div>
        <div className="univers">
          <Link className="u-card" href="/montres">
            <div className="u-art">
              <svg viewBox="0 0 200 200" fill="none" stroke="url(#g1)" strokeWidth="3">
                <defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#EBD59C" /><stop offset="1" stopColor="#8A6D34" /></linearGradient></defs>
                <circle cx="100" cy="100" r="52" /><circle cx="100" cy="100" r="60" />
                <rect x="88" y="18" width="24" height="24" rx="4" /><rect x="88" y="158" width="24" height="24" rx="4" />
                <path d="M100 100V66M100 100l22 14" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <h3>{t("nav_watches")}</h3>
            <div className="link">{t("uni_explore")} →</div>
          </Link>
          <Link className="u-card" href="/bijoux">
            <div className="u-art">
              <svg viewBox="0 0 200 200" fill="none" stroke="url(#g2)" strokeWidth="3">
                <defs><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#EBD59C" /><stop offset="1" stopColor="#8A6D34" /></linearGradient></defs>
                <ellipse cx="100" cy="118" rx="46" ry="46" /><ellipse cx="100" cy="118" rx="38" ry="38" />
                <path d="M84 66l16-24 16 24-16 14z" fill="rgba(235,213,156,.25)" />
              </svg>
            </div>
            <h3>{t("nav_jewelry")}</h3>
            <div className="link">{t("uni_explore")} →</div>
          </Link>
        </div>
      </section>

      {highlights.length > 0 && (
        <section className="section wrap">
          <div className="section-head">
            <div className="eyebrow">{t("featured_eyebrow")}</div>
            <h2>{t("collection")}</h2>
          </div>
          <div className="grid">
            {highlights.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      <Assurances />
      <WhyOnyx />
      <Testimonials />
    </>
  );
}
