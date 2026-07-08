"use client";

import { useState } from "react";
import { useLang } from "@/app/providers";
import { SHOP } from "@/lib/shop";

const C = {
  fr: { title: "Contact", lead: "Une question ? Nous répondons sous 24 h.", email: "Email", phone: "Téléphone", name: "Nom", msg: "Message", send: "Envoyer", ok: "Merci ! Votre message a bien été envoyé.", reach: "Nous joindre" },
  en: { title: "Contact", lead: "A question? We reply within 24 hours.", email: "Email", phone: "Phone", name: "Name", msg: "Message", send: "Send", ok: "Thank you! Your message has been sent.", reach: "Reach us" },
  ar: { title: "اتصل بنا", lead: "لديك سؤال؟ نردّ خلال 24 ساعة.", email: "البريد الإلكتروني", phone: "الهاتف", name: "الاسم", msg: "الرسالة", send: "إرسال", ok: "شكراً لك! تم إرسال رسالتك.", reach: "تواصل معنا" },
};

export default function ContactPage() {
  const { locale } = useLang();
  const c = C[locale] || C.fr;
  const [sent, setSent] = useState(false);

  return (
    <section className="section wrap">
      <div className="section-head">
        <div className="eyebrow">ONYX</div>
        <h1 className="page-title">{c.title}</h1>
        <p style={{ color: "var(--muted)", marginTop: 12 }}>{c.lead}</p>
      </div>

      <div className="contact-grid">
        <div className="contact-card">
          <h3>{c.reach}</h3>
          <p style={{ margin: "0 0 10px", color: "var(--muted)" }}>
            {c.email} : <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
          </p>
          {SHOP.phone && (
            <p style={{ margin: "0 0 10px", color: "var(--muted)" }}>
              {c.phone} : <a href={`tel:${SHOP.phone}`}>{SHOP.phone}</a>
            </p>
          )}
        </div>

        <div>
          {sent ? (
            <div className="notice"><p style={{ color: "var(--gold)" }}>{c.ok}</p></div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="form-grid">
                <div className="field full"><label>{c.name}</label><input required /></div>
                <div className="field full"><label>{c.email}</label><input type="email" required /></div>
                <div className="field full">
                  <label>{c.msg}</label>
                  <textarea required rows={4} style={{ background: "var(--ink-3)", border: "1px solid var(--line)", borderRadius: 3, padding: "12px 14px", color: "var(--ivory)", fontFamily: "var(--sans)", fontSize: 15, resize: "vertical" }} />
                </div>
              </div>
              <button className="btn btn-primary btn-block" style={{ marginTop: 18 }} type="submit">{c.send}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
