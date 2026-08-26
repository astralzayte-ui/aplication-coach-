'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Truck, Star, Package } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';

const CATEGORIES = [
  { name: 'Sneakers', emoji: '👟', href: '/products?cat=sneakers' },
  { name: 'Bags', emoji: '👜', href: '/products?cat=bags' },
  { name: 'T-Shirts', emoji: '👕', href: '/products?cat=t-shirts' },
  { name: 'Hoodies', emoji: '🧥', href: '/products?cat=hoodies' },
  { name: 'Pants', emoji: '👖', href: '/products?cat=pants' },
];

function CountdownTimer() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    function getSecondsUntilMidnight() {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      return Math.floor((midnight.getTime() - now.getTime()) / 1000);
    }

    function update() {
      const total = getSecondsUntilMidnight();
      setTime({
        h: Math.floor(total / 3600),
        m: Math.floor((total % 3600) / 60),
        s: total % 60,
      });
    }

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <span className="font-mono font-bold text-amber-400">
      {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
    </span>
  );
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [latest, setLatest] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then(r => r.json())
      .then(data => setFeatured(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => {});

    fetch('/api/products')
      .then(r => r.json())
      .then(data => setLatest(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* ── Urgency announcement bar ── */}
      <div className="bg-amber-400 text-black text-xs sm:text-sm font-bold text-center py-2.5 px-4 sticky top-0 z-[60]">
        <span className="inline-flex items-center gap-2 flex-wrap justify-center">
          <span>🔥 LIVRAISON OFFERTE AUJOURD&apos;HUI</span>
          <span className="opacity-60">—</span>
          <span>Offre expire dans&nbsp;<CountdownTimer /></span>
          <span className="opacity-60">—</span>
          <Link href="/products" className="underline underline-offset-2 hover:opacity-80 transition-opacity">
            Profiter maintenant →
          </Link>
        </span>
      </div>

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(rgba(251,191,36,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.12) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        {/* Amber glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 65%)' }}
        />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-8">
          {/* Social proof pill */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 text-sm">
            <span className="flex items-center gap-1 text-amber-400">
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
            </span>
            <span className="text-gray-300 text-xs font-medium">
              <strong className="text-white">1 247</strong> clients satisfaits ce mois
            </span>
          </div>

          {/* Headline — benefit first */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-none mb-4">
            STYLE PREMIUM<br />
            <span className="text-amber-400">PRIX MINI.</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-3 leading-relaxed">
            Sneakers, sacs, hoodies — les pièces qui font le look, sans se ruiner.
          </p>
          <p className="text-amber-400/70 text-sm font-semibold uppercase tracking-widest mb-8">
            ✦ Collection 2025 ✦
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link href="/products" className="btn-primary inline-flex items-center justify-center gap-2 group text-base py-4 px-10">
              Voir la collection
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/products?cat=sneakers" className="border border-white/20 text-white font-bold py-4 px-8 rounded-xl uppercase tracking-wider text-sm hover:border-amber-400/50 hover:bg-white/5 transition-all">
              Sneakers →
            </Link>
          </div>

          {/* Above-fold trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-xs font-medium uppercase tracking-wider border-t border-white/5 pt-8">
            <span className="flex items-center gap-1.5">
              <Truck size={14} className="text-amber-400" /> Livraison 5-10j
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <Shield size={14} className="text-amber-400" /> Paiement sécurisé
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <Package size={14} className="text-amber-400" /> Retours 30 jours
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" /> Support 7j/7
            </span>
          </div>
        </div>
      </section>

      {/* ── Social proof ticker ── */}
      <div className="bg-zinc-900/80 border-y border-white/5 py-3 overflow-hidden">
        <div className="flex items-center gap-16 animate-ticker whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="flex items-center gap-16 text-xs text-gray-400 uppercase tracking-wider font-medium">
              <span>⭐ Pierre (Lyon) vient d&apos;acheter un Hoodie</span>
              <span>⭐ Karim (Paris) vient d&apos;acheter des Sneakers</span>
              <span>⭐ Sofia (Marseille) vient d&apos;acheter un Sac</span>
              <span>⭐ Lucas (Bordeaux) vient d&apos;acheter un T-Shirt</span>
              <span>⭐ Emma (Lille) vient d&apos;acheter un Hoodie</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Categories ── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-black text-white mb-8 text-center uppercase tracking-wider">
          Choisir ma catégorie
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative overflow-hidden rounded-2xl border border-white/5 hover:border-amber-400/40 bg-zinc-900/60 hover:bg-zinc-900 p-5 flex flex-col items-center gap-2.5 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(251,191,36,0.08)]"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-white font-semibold text-xs tracking-wider uppercase">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      {featured.length > 0 && (
        <section className="py-10 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                Top Picks <span className="text-amber-400">⚡</span>
              </h2>
              <p className="text-gray-500 text-xs mt-1">Les plus commandés cette semaine</p>
            </div>
            <Link href="/products?featured=true" className="text-amber-400 text-sm font-semibold hover:underline underline-offset-2">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── Latest Products ── */}
      {latest.length > 0 && (
        <section className="py-10 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wide">Nouveautés</h2>
              <p className="text-gray-500 text-xs mt-1">Ajoutés cette semaine</p>
            </div>
            <Link href="/products" className="text-amber-400 text-sm font-semibold hover:underline underline-offset-2">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {latest.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {featured.length === 0 && latest.length === 0 && (
        <section className="py-32 px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-6">🛍️</div>
            <h2 className="text-2xl font-bold text-white mb-3">La boutique se prépare</h2>
            <p className="text-gray-500 mb-8">Les produits arrivent bientôt. Revenez vite !</p>
            <Link href="/admin" className="text-amber-400 text-sm font-medium border border-amber-400/30 px-6 py-3 rounded-xl hover:bg-amber-400/10 transition-all">
              Panneau Admin →
            </Link>
          </div>
        </section>
      )}

      {/* ── CTA banner ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-amber-400/10 to-amber-600/5 border border-amber-400/20 p-10 text-center">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">Offre limitée</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Livraison gratuite sur<br />toute la boutique aujourd&apos;hui
          </h2>
          <p className="text-gray-400 mb-8 text-sm max-w-md mx-auto">
            Sans minimum d&apos;achat. Profite maintenant — l&apos;offre se termine à minuit.
          </p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            Commander maintenant <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Trust badges ── */}
      <section className="py-14 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { icon: <Truck size={26} className="text-amber-400" />, title: 'Livraison rapide', desc: '5-10 jours ouvrés' },
            { icon: <Shield size={26} className="text-amber-400" />, title: 'Paiement sécurisé', desc: 'Cryptage SSL 256-bit' },
            { icon: <Package size={26} className="text-amber-400" />, title: 'Retours faciles', desc: '30 jours pour changer d\'avis' },
            { icon: <Zap size={26} className="text-amber-400" />, title: 'Support client', desc: '7j/7, réponse rapide' },
          ].map(item => (
            <div key={item.title} className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl border border-white/5 bg-zinc-900/40">
              {item.icon}
              <div>
                <div className="text-white font-bold text-sm">{item.title}</div>
                <div className="text-gray-500 text-xs mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
