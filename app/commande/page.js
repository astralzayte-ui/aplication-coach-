"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang, useCart } from "@/app/providers";
import { formatPrice } from "@/lib/i18n";

export default function CheckoutPage() {
  const { locale, t } = useLang();
  const { items, total, clear, ready } = useCart();
  const currency = items[0]?.currency || "EUR";

  const [status, setStatus] = useState("form"); // form | loading | pending | error
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", zip: "", country: "",
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const valid = form.name && form.email && form.phone && form.address && form.city;

  async function submit(e) {
    e.preventDefault();
    if (!valid || items.length === 0) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items, total, currency, locale }),
      });
      const data = await res.json();
      if (data.mode === "redirect" && data.url) {
        window.location.href = data.url; // paiement YouCan Pay
        return;
      }
      // Pas encore de paiement en ligne : commande enregistrée.
      clear();
      setStatus("pending");
    } catch {
      setStatus("error");
    }
  }

  if (!ready) return <section className="wrap section" />;

  if (status === "pending") {
    return (
      <section className="wrap section">
        <div className="notice">
          <h2>{t("pay_pending_title")}</h2>
          <p style={{ color: "var(--muted)", maxWidth: "42ch", margin: "10px auto 24px" }}>
            {t("pay_pending_msg")}
          </p>
          <Link className="btn btn-primary" href="/">{t("back_home")}</Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="wrap section">
        <div className="empty">
          <p>{t("cart_empty")}</p>
          <Link className="btn btn-ghost" href="/" style={{ marginTop: 16 }}>{t("continue_shopping")}</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="wrap section">
      <div className="section-head" style={{ textAlign: "start", marginBottom: 20 }}>
        <h1 className="page-title">{t("order_title")}</h1>
      </div>

      <div className="two-col">
        <form onSubmit={submit}>
          <div className="opt-label" style={{ marginTop: 0 }}>{t("contact")}</div>
          <div className="form-grid">
            <div className="field full">
              <label>{t("full_name")}</label>
              <input value={form.name} onChange={set("name")} required />
            </div>
            <div className="field">
              <label>{t("email")}</label>
              <input type="email" value={form.email} onChange={set("email")} required />
            </div>
            <div className="field">
              <label>{t("phone")}</label>
              <input value={form.phone} onChange={set("phone")} required />
            </div>
            <div className="field full">
              <label>{t("address")}</label>
              <input value={form.address} onChange={set("address")} required />
            </div>
            <div className="field">
              <label>{t("city")}</label>
              <input value={form.city} onChange={set("city")} required />
            </div>
            <div className="field">
              <label>{t("zip")}</label>
              <input value={form.zip} onChange={set("zip")} />
            </div>
            <div className="field full">
              <label>{t("country")}</label>
              <input value={form.country} onChange={set("country")} />
            </div>
          </div>

          {status === "error" && (
            <p style={{ color: "#FF7A59", marginTop: 16 }}>{t("pay_error")}</p>
          )}

          <button
            className="btn btn-primary btn-block"
            style={{ marginTop: 24 }}
            disabled={!valid || status === "loading"}
          >
            {status === "loading" ? "…" : t("pay_now")}
          </button>
        </form>

        <div className="summary">
          <h3>{t("order_summary")}</h3>
          {items.map((it, i) => (
            <div className="srow" key={i}>
              <span>
                {it.name} × {it.qty}
                <br />
                <small style={{ color: "var(--muted-2)" }}>
                  {it.colorLabel}{it.size ? ` · ${it.size}` : ""}
                </small>
              </span>
              <span>{formatPrice(it.price * it.qty, it.currency, locale)}</span>
            </div>
          ))}
          <div className="srow total">
            <span>{t("total")}</span>
            <span>{formatPrice(total, currency, locale)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
