"use client";

import Link from "next/link";
import { useLang } from "@/app/providers";
import { field, formatPrice } from "@/lib/i18n";
import Stars from "./Stars";

export default function ProductCard({ product }) {
  const { locale, t } = useLang();
  const cover = product.colors[0]?.image;
  return (
    <Link className="card" href={`/produit/${product.slug}`}>
      <div className="thumb">
        {cover && <img src={cover} alt={field(product.name, locale)} loading="lazy" />}
      </div>
      <div className="meta">
        <h3>{field(product.name, locale)}</h3>
        {product.rating && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, margin: "2px 0 8px" }}>
            <Stars value={product.rating} />
            <span className="rcount">{product.reviews} {t("avis")}</span>
          </div>
        )}
        <div className="price">{formatPrice(product.price, product.currency, locale)}</div>
        <div className="dot-row">
          {product.colors.map((c) => (
            <span key={c.id} className="dot" style={{ background: c.swatch }} title={field(c.label, locale)} />
          ))}
        </div>
      </div>
    </Link>
  );
}
