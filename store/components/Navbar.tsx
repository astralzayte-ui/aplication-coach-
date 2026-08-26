'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/components/CartContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black text-white tracking-widest hover:text-amber-400 transition-colors">
            DRIP<span className="text-amber-400">.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {categories.map(cat => (
              <Link
                key={cat.label}
                href={cat.href}
                className="text-gray-300 hover:text-white text-sm font-medium tracking-wider uppercase transition-colors hover:text-amber-400"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
              <Search size={20} />
            </Link>
            <Link href="/cart" className="relative text-gray-300 hover:text-white transition-colors">
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {categories.map(cat => (
              <Link
                key={cat.label}
                href={cat.href}
                className="block text-gray-300 hover:text-amber-400 text-sm font-medium tracking-wider uppercase py-2"
                onClick={() => setMenuOpen(false)}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
