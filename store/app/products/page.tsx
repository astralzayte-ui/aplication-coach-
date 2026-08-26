'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/lib/types';
import { SlidersHorizontal } from 'lucide-react';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all', label: 'Tout' },
  { value: 'sneakers', label: 'Sneakers' },
  { value: 'bags', label: 'Bags' },
  { value: 't-shirts', label: 'T-Shirts' },
  { value: 'hoodies', label: 'Hoodies' },
  { value: 'pants', label: 'Pants' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat') as Category || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>(catParam);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    setActiveCategory(catParam);
  }, [catParam]);

  useEffect(() => {
    setLoading(true);
    const url = activeCategory !== 'all'
      ? `/api/products?category=${activeCategory}`
      : '/api/products';

    fetch(url)
      .then(r => r.json())
      .then(data => {
        let sorted = Array.isArray(data) ? data : [];
        if (sortBy === 'price-asc') sorted = sorted.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-desc') sorted = sorted.sort((a, b) => b.price - a.price);
        setProducts(sorted);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory, sortBy]);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Collection</h1>
          <p className="text-gray-500">{products.length} produit{products.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium tracking-wider uppercase transition-all ${
                  activeCategory === cat.value
                    ? 'bg-amber-400 text-black'
                    : 'bg-zinc-900 text-gray-400 hover:text-white border border-white/10 hover:border-amber-400/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-zinc-900 border border-white/10 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400/50"
            >
              <option value="newest">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-32 text-center">
            <div className="text-5xl mb-4">😮</div>
            <p className="text-gray-500 text-lg">Aucun produit dans cette catégorie pour l&apos;instant.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20 flex items-center justify-center"><div className="text-gray-500">Chargement...</div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
