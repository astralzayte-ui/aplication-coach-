"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang, useCart, keyOf } from "@/app/providers";
import { formatPrice } from "@/lib/i18n";

export default function CartPage() {
  const { locale, t } = useLang();
  const { items, setQty, remove, total, ready } = useCart();
  const router = useRouter();
  const currency = items[0]?.currency || "EUR";

  if (!ready) return <section className="wrap section" />;

  return (
    <section className="wrap section">
      <div className="section-head" style={{ textAlign: "start", marginBottom: 20 }}>
        <h1 className="page-title">{t("your_cart")}</h1>
      </div>

      {items.length === 0 ? (
        <div className="empty">
          <p>{t("cart_empty")}</p>
          <Link className="btn btn-ghost" href="/" style={{ marginTop: 16 }}>
            {t("continue_shopping")}
          </Link>
        </div>
      ) : (
        <div className="two-col">
          <div>
            {items.map((it) => {
              const k = keyOf(it);
              return (
                <div className="line" key={k}>
                  <div className="lthumb">{it.image && <img src={it.image} alt={it.name} />}</div>
                  <div className="linfo">
                    <h4>{it.name}</h4>
                    <small>
                      {it.colorLabel}
                      {it.size ? ` · ${t("size")} ${it.size}` : ""}
                    </small>
                    <div>
                      <button className="rm" onClick={() => remove(k)}>{t("remove")}</button>
                    </div>
                  </div>
                  <div className="qty">
                    <button onClick={() => setQty(k, it.qty - 1)} aria-label="-">−</button>
                    <span>{it.qty}</span>
                    <button onClick={() => setQty(k, it.qty + 1)} aria-label="+">+</button>
                  </div>
                  <div className="lprice">{formatPrice(it.price * it.qty, it.currency, locale)}</div>
                </div>
              );
            })}
          </div>

          <div className="summary">
            <h3>{t("order_summary")}</h3>
            <div className="srow">
              <span>{t("subtotal")}</span>
              <span>{formatPrice(total, currency, locale)}</span>
            </div>
            <div className="srow total">
              <span>{t("total")}</span>
              <span>{formatPrice(total, currency, locale)}</span>
            </div>
            <button
              className="btn btn-primary btn-block"
              style={{ marginTop: 18 }}
              onClick={() => router.push("/commande")}
            >
              {t("checkout")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
