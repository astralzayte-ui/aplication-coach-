'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';

const CATEGORIES = [
  { name: 'Sneakers', emoji: '👟', href: '/products?cat=sneakers', color: 'from-blue-900/30 to-blue-800/10' },
  { name: 'Bags', emoji: '👜', href: '/products?cat=bags', color: 'from-purple-900/30 to-purple-800/10' },
  { name: 'T-Shirts', emoji: '👕', href: '/products?cat=t-shirts', color: 'from-green-900/30 to-green-800/10' },
  { name: 'Hoodies', emoji: '🧥', href: '/products?cat=hoodies', color: 'from-orange-900/30 to-orange-800/10' },
  { name: 'Pants', emoji: '👖', href: '/products?cat=pants', color: 'from-red-900/30 to-red-800/10' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [latest, setLatest] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch featured products
    fetch('/api/products?featured=true')
      .then(r => r.json())
      .then(data => setFeatured(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => {});

    // Fetch latest
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setLatest(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(251,191,36,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)' }}
        />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <p className="text-amber-400 text-sm font-bold tracking-[0.4em] uppercase mb-6 opacity-80">
            ✦ Collection 2025 ✦
          </p>
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white leading-none mb-6">
            DRIP<span className="text-amber-400">.</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Le streetwear qui te définit. Sneakers, sacs, hoodies — tout ce qu&apos;il faut pour sortir avec style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary inline-flex items-center gap-2 group">
              Voir la collection
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/products?cat=sneakers" className="border border-white/20 text-white font-bold py-3 px-8 rounded-xl uppercase tracking-wider text-sm hover:border-amber-400/50 hover:bg-white/5 transition-all">
              Sneakers
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-amber-400/50" />
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-white mb-10 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`group relative overflow-hidden rounded-2xl border border-white/5 hover:border-amber-400/30 bg-gradient-to-br ${cat.color} p-6 flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105`}
            >
              <span className="text-4xl">{cat.emoji}</span>
              <span className="text-white font-semibold text-sm tracking-wider uppercase">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-white">
              Top Picks <span className="text-amber-400">⚡</span>
            </h2>
            <Link href="/products?featured=true" className="text-amber-400 text-sm font-medium hover:underline">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Products */}
      {latest.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-white">Nouveautés</h2>
            <Link href="/products" className="text-amber-400 text-sm font-medium hover:underline">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
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

      {/* Trust badges */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Truck className="text-amber-400" size={28} />, title: 'Livraison rapide', desc: '5-10 jours ouvrés' },
            { icon: <Shield className="text-amber-400" size={28} />, title: 'Paiement sécurisé', desc: 'Cryptage SSL 256-bit' },
            { icon: <Zap className="text-amber-400" size={28} />, title: 'Retours faciles', desc: '30 jours pour changer d\'avis' },
          ].map(item => (
            <div key={item.title} className="flex items-center gap-4 p-6 rounded-2xl border border-white/5 bg-zinc-900/30">
              {item.icon}
              <div>
                <div className="text-white font-semibold text-sm">{item.title}</div>
                <div className="text-gray-500 text-sm">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
