"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useLang, useCart } from "@/app/providers";
import { field, formatPrice } from "@/lib/i18n";
import { getProduct } from "@/data/products";
import Assurances from "@/components/Assurances";

export default function ProductPage({ params }) {
  const product = getProduct(params.slug);
  if (!product) return notFound();

  const { locale, t } = useLang();
  const { add } = useCart();
  const router = useRouter();

  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0] || null);
  const hasSizes = product.sizes.length > 0;

  const canAdd = !hasSizes || !!size;

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
        qty: 1,
      },
      t("added")
    );
  }

  return (
    <>
      <section className="wrap pdp">
        <div className="stage">
          <img src={color.image} alt={`${field(product.name, locale)} — ${field(color.label, locale)}`} />
        </div>

        <div>
          <div className="eyebrow">{t(product.category === "montres" ? "nav_watches" : "nav_jewelry")}</div>
          <h1>{field(product.name, locale)}</h1>
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
                  <button
                    key={s}
                    className="size"
                    aria-pressed={s === size}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          <button
            className="btn btn-primary btn-block"
            style={{ marginTop: 30 }}
            disabled={!canAdd}
            onClick={handleAdd}
          >
            {t("add_to_cart")}
          </button>
          {hasSizes && !size && <div className="hint">{t("choose_size")}</div>}
        </div>
      </section>

      <Assurances />
    </>
  );
}
