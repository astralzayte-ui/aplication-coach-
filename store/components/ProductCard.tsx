'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart } from 'lucide-react';
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
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 hover:border-amber-400/30 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-zinc-800">
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

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
            {product.featured === 1 && (
              <span className="bg-amber-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                TOP
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-red-400 hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100">
            <Heart size={14} />
          </button>

          {/* Quick add */}
          <button
            onClick={handleAdd}
            className={`absolute bottom-3 left-3 right-3 py-2.5 rounded-xl text-sm font-bold tracking-wider uppercase transition-all duration-300 opacity-0 group-hover:opacity-100 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-amber-400 text-black hover:bg-amber-300'
            }`}
          >
            {added ? '✓ Ajouté' : 'Ajouter'}
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-amber-400 uppercase tracking-wider font-medium mb-1">
            {product.category}
          </p>
          <h3 className="text-white font-semibold text-sm leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg">{product.price.toFixed(2)}€</span>
            {product.original_price && (
              <span className="text-gray-500 text-sm line-through">{product.original_price.toFixed(2)}€</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
