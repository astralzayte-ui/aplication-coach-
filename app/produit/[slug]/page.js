"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useLang, useCart } from "@/app/providers";
import { field, formatPrice } from "@/lib/i18n";
import { getProduct, getByCategory } from "@/data/products";
import Assurances from "@/components/Assurances";
import ProductCard from "@/components/ProductCard";
import Stars from "@/components/Stars";

export default function ProductPage({ params }) {
  const product = getProduct(params.slug);
  if (!product) return notFound();

  const { locale, t } = useLang();
  const { add } = useCart();

  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0] || null);
  const [qty, setQty] = useState(1);
  const hasSizes = product.sizes.length > 0;
  const canAdd = !hasSizes || !!size;
  const catKey = product.category === "montres" ? "nav_watches" : "nav_jewelry";
  const related = getByCategory(product.category).filter((p) => p.slug !== product.slug);

  function handleAdd() {
    if (!canAdd) return;
    add(
      {
        slug: product.slug,
        name: field(product.name, locale),
        color: color.id,
        colorLabel: field(color.label, locale),
        size: size || "",
        price: product.price,
        currency: product.currency,
        image: color.image,
        qty,
      },
      t("added")
    );
  }

  return (
    <>
      <div className="wrap">
        <nav className="crumb" aria-label="fil d'Ariane">
          <Link href="/">{t("home_bc")}</Link><span>/</span>
          <Link href={`/${product.category}`}>{t(catKey)}</Link><span>/</span>
          <span>{field(product.name, locale)}</span>
        </nav>
      </div>

      <section className="wrap pdp">
        <div className="stage">
          <img src={color.image} alt={`${field(product.name, locale)} — ${field(color.label, locale)}`} />
        </div>

        <div>
          <div className="eyebrow">{t(catKey)}</div>
          <h1>{field(product.name, locale)}</h1>
          {product.rating && (
            <div className="pdp-top">
              <Stars value={product.rating} />
              <span className="rcount">{product.rating.toFixed(1)} · {product.reviews} {t("avis")}</span>
              <span className="stock">{t("in_stock")}</span>
            </div>
          )}
          <div className="price">{formatPrice(product.price, product.currency, locale)}</div>
          <p className="desc">{field(product.description, locale)}</p>

          <div className="opt-label">
            {t("finish")} · <span className="val">{field(color.label, locale)}</span>
          </div>
          <div className="swatches" role="group" aria-label={t("finish")}>
            {product.colors.map((c) => (
              <button
                key={c.id}
                className="sw"
                style={{ background: c.swatch }}
                aria-pressed={c.id === color.id}
                aria-label={field(c.label, locale)}
                title={field(c.label, locale)}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          {hasSizes && (
            <>
              <div className="opt-label">{t("size")}</div>
              <div className="sizes" role="group" aria-label={t("size")}>
                {product.sizes.map((s) => (
                  <button key={s} className="size" aria-pressed={s === size} onClick={() => setSize(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="buy-row">
            <div className="qtybox" aria-label={t("quantity")}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="-">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="+">+</button>
            </div>
            <button className="btn btn-primary" disabled={!canAdd} onClick={handleAdd}>
              {t("add_to_cart")}
            </button>
          </div>
          {hasSizes && !size && <div className="hint">{t("choose_size")}</div>}

          <div className="deliv">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="7" width="15" height="10" rx="1" /><path d="M18 10h3l-1 7h-2" /><circle cx="7" cy="19" r="1.6" /><circle cx="16" cy="19" r="1.6" /></svg>
            {t("delivery_est")}
          </div>

          <div className="reassure">
            <div className="r"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>{t("reassure_pay")}</div>
            <div className="r"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 12a9 9 0 1 0 9-9" /><path d="M3 5v4h4" /></svg>{t("reassure_ret")}</div>
            <div className="r"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" /><circle cx="12" cy="12" r="10" /></svg>{t("reassure_ship")}</div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section wrap related">
          <div className="section-head"><h2>{t("related_t")}</h2></div>
          <div className="grid">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}

      <Assurances />
    </>
  );
}
