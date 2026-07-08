"use client";

import { useLang } from "@/app/providers";
import ProductCard from "@/components/ProductCard";
import { getByCategory } from "@/data/products";

export default function CategoryView({ category, titleKey }) {
  const { t } = useLang();
  const products = getByCategory(category);

  return (
    <section className="section wrap">
      <div className="section-head">
        <div className="eyebrow">{t("collection")}</div>
        <h1 className="page-title">{t(titleKey)}</h1>
      </div>
      {products.length === 0 ? (
        <p className="empty">{t("empty_category")}</p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
