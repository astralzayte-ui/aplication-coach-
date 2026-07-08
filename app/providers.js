"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { DEFAULT_LOCALE, LOCALES, DIR, tr } from "@/lib/i18n";

// ============ Langue ============
const LangCtx = createContext(null);

export function useLang() {
  return useContext(LangCtx);
}

function LangProvider({ children }) {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = localStorage.getItem("onyx_locale");
    if (saved && LOCALES.includes(saved)) setLocale(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = DIR[locale] || "ltr";
    localStorage.setItem("onyx_locale", locale);
  }, [locale]);

  const t = useCallback((key) => tr(locale, key), [locale]);

  return (
    <LangCtx.Provider value={{ locale, setLocale, t, dir: DIR[locale] || "ltr" }}>
      {children}
    </LangCtx.Provider>
  );
}

// ============ Panier ============
const CartCtx = createContext(null);

export function useCart() {
  return useContext(CartCtx);
}

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("onyx_cart") || "[]");
      if (Array.isArray(saved)) setItems(saved);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("onyx_cart", JSON.stringify(items));
  }, [items, ready]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }, []);

  const add = useCallback((item, toastMsg) => {
    setItems((prev) => {
      const i = prev.findIndex(
        (x) => x.slug === item.slug && x.color === item.color && x.size === item.size
      );
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + item.qty };
        return next;
      }
      return [...prev, item];
    });
    if (toastMsg) showToast(toastMsg);
  }, [showToast]);

  const setQty = useCallback((key, qty) => {
    setItems((prev) =>
      prev
        .map((x) => (keyOf(x) === key ? { ...x, qty: Math.max(1, qty) } : x))
        .filter((x) => x.qty > 0)
    );
  }, []);

  const remove = useCallback((key) => {
    setItems((prev) => prev.filter((x) => keyOf(x) !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((n, x) => n + x.qty, 0);
  const total = items.reduce((s, x) => s + x.price * x.qty, 0);

  return (
    <CartCtx.Provider value={{ items, add, setQty, remove, clear, count, total, ready }}>
      {children}
      <div className={"toast" + (toast ? " show" : "")}>{toast}</div>
    </CartCtx.Provider>
  );
}

export function keyOf(item) {
  return `${item.slug}|${item.color}|${item.size}`;
}

export function Providers({ children }) {
  return (
    <LangProvider>
      <CartProvider>{children}</CartProvider>
    </LangProvider>
  );
}
