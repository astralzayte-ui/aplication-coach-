"use client";

import Link from "next/link";
import { useLang } from "@/app/providers";
import { field, formatPrice } from "@/lib/i18n";

export default function ProductCard({ product }) {
  const { locale } = useLang();
  const cover = product.colors[0]?.image;
  return (
    <Link className="card" href={`/produit/${product.slug}`}>
      <div className="thumb">
        {cover && <img src={cover} alt={field(product.name, locale)} loading="lazy" />}
      </div>
      <div className="meta">
        <h3>{field(product.name, locale)}</h3>
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
