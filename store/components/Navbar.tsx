'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/components/CartContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { label: 'Sneakers', href: '/products?cat=sneakers' },
    { label: 'Bags', href: '/products?cat=bags' },
    { label: 'T-Shirts', href: '/products?cat=t-shirts' },
    { label: 'Hoodies', href: '/products?cat=hoodies' },
    { label: 'Pants', href: '/products?cat=pants' },
  ];

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'top-0 bg-black/95 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.05)]'
          : 'top-[42px] bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="text-xl font-black text-white tracking-widest hover:text-amber-400 transition-colors">
            DRIP<span className="text-amber-400">.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {categories.map(cat => (
              <Link
                key={cat.label}
                href={cat.href}
                className="text-gray-400 hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors hover:text-amber-400"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/products" className="hidden sm:block text-xs text-gray-400 font-semibold uppercase tracking-widest hover:text-white transition-colors">
              Boutique
            </Link>
            <Link href="/cart" className="relative text-gray-300 hover:text-amber-400 transition-colors">
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-xs font-black w-5 h-5 rounded-full flex items-center justify-center leading-none shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-gray-300 hover:text-white transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/97 backdrop-blur-md border-t border-white/8">
          <div className="px-4 py-5 space-y-1">
            {categories.map(cat => (
              <Link
                key={cat.label}
                href={cat.href}
                className="block text-gray-300 hover:text-amber-400 text-sm font-semibold tracking-widest uppercase py-3 border-b border-white/5 last:border-0 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {cat.label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="flex items-center justify-between text-amber-400 font-bold text-sm uppercase tracking-wider pt-4"
              onClick={() => setMenuOpen(false)}
            >
              <span>Mon panier</span>
              {totalItems > 0 && (
                <span className="bg-amber-400 text-black text-xs font-black px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
