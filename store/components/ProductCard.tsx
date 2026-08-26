'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from './CartContext';
import { useState } from 'react';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 hover:border-amber-400/30 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(251,191,36,0.07)]">

        {/* Image */}
        <div className="relative overflow-hidden bg-zinc-800" style={{ aspectRatio: '4/5' }}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              <ShoppingBag size={48} />
            </div>
          )}

          {/* Badges top-left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-lg">
                -{discount}%
              </span>
            )}
            {product.featured === 1 && (
              <span className="bg-amber-400 text-black text-xs font-black px-2.5 py-0.5 rounded-full shadow-lg">
                ⚡ TOP
              </span>
            )}
          </div>

          {/* Stock urgency — only show sometimes for CRO effect */}
          {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-3 right-3">
              <span className="bg-black/70 backdrop-blur-sm text-red-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-red-500/30">
                Plus que {product.stock} !
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 pb-3">
          <p className="text-xs text-amber-400/70 uppercase tracking-widest font-semibold mb-1">
            {product.category}
          </p>
          <h3 className="text-white font-semibold text-sm leading-snug mb-2.5 line-clamp-2">
            {product.name}
          </h3>

          {/* Price row */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-white font-black text-xl">{product.price.toFixed(2)}€</span>
            {product.original_price && (
              <span className="text-gray-500 text-sm line-through">{product.original_price.toFixed(2)}€</span>
            )}
          </div>

          {/* CTA — always visible, not hover-only */}
          <button
            onClick={handleAdd}
            className={`w-full py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              added
                ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                : 'bg-amber-400 text-black hover:bg-amber-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.35)] active:scale-[0.98]'
            }`}
          >
            {added ? '✓ Ajouté au panier !' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </Link>
  );
}
