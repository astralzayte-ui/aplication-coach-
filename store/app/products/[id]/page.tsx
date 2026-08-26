'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { ShoppingBag, ArrowLeft, Minus, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/components/CartContext';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        if (data.colors?.length) setSelectedColor(data.colors[0]);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAdd() {
    if (!product) return;
    addItem(product, qty, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Produit introuvable.</p>
        <Link href="/products" className="text-amber-400 hover:underline">← Retour</Link>
      </div>
    );
  }

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Back */}
        <Link href="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} />
          Retour à la collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700">
                <ShoppingBag size={80} />
              </div>
            )}
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                -{discount}%
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-amber-400 text-sm font-medium uppercase tracking-wider mb-2">
                {product.category}
                {product.supplier_name && ` · ${product.supplier_name}`}
              </p>
              <h1 className="text-3xl font-black text-white leading-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-white">{product.price.toFixed(2)}€</span>
                {product.original_price && (
                  <span className="text-gray-500 text-xl line-through">{product.original_price.toFixed(2)}€</span>
                )}
              </div>
            </div>

            {product.description && (
              <p className="text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-6">
                {product.description}
              </p>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">
                  Taille: <span className="text-amber-400">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg text-sm font-bold border transition-all ${
                        selectedSize === size
                          ? 'bg-amber-400 text-black border-amber-400'
                          : 'border-white/20 text-gray-400 hover:border-amber-400/50 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">
                  Couleur: <span className="text-amber-400">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        selectedColor === color
                          ? 'bg-amber-400 text-black border-amber-400'
                          : 'border-white/20 text-gray-400 hover:border-amber-400/50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-white text-sm font-semibold uppercase tracking-wider">Quantité</span>
              <div className="flex items-center gap-3 bg-zinc-900 border border-white/10 rounded-xl px-3 py-2">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-gray-400 hover:text-white">
                  <Minus size={16} />
                </button>
                <span className="text-white font-bold w-6 text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="text-gray-400 hover:text-white">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              className={`btn-primary flex items-center justify-center gap-3 ${added ? '!bg-green-500' : ''}`}
            >
              <ShoppingBag size={18} />
              {added ? '✓ Ajouté au panier !' : 'Ajouter au panier'}
            </button>

            {/* Supplier link */}
            {product.supplier_url && (
              <a
                href={product.supplier_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-400 text-xs transition-colors"
              >
                <ExternalLink size={12} />
                Voir chez le fournisseur
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
