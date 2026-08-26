'use client';

import { useCart } from '@/components/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, totalPrice, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-6 px-4">
        <ShoppingBag size={64} className="text-zinc-700" />
        <h1 className="text-2xl font-bold text-white">Ton panier est vide</h1>
        <p className="text-gray-500">Ajoute des articles pour commencer à shopper !</p>
        <Link href="/products" className="btn-primary inline-flex items-center gap-2">
          Voir la collection <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const shipping = totalPrice >= 50 ? 0 : 4.99;
  const total = totalPrice + shipping;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-white mb-10">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-4 bg-zinc-900 border border-white/5 rounded-2xl p-4">
                {/* Image */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-800">
                  {item.product.image_url ? (
                    <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">
                    {item.product.name}
                  </h3>
                  <div className="flex gap-2 text-xs text-gray-500 mb-3">
                    {item.size && <span>Taille: {item.size}</span>}
                    {item.color && <span>Couleur: {item.color}</span>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size, item.color)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white text-sm font-bold w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-white font-bold">
                        {(item.product.price * item.quantity).toFixed(2)}€
                      </span>
                      <button
                        onClick={() => removeItem(item.product.id, item.size, item.color)}
                        className="text-zinc-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 h-fit">
            <h2 className="text-white font-bold text-lg mb-6">Récapitulatif</h2>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Sous-total</span>
                <span className="text-white">{totalPrice.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Livraison</span>
                <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                  {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)}€`}
                </span>
              </div>
              {totalPrice < 50 && (
                <p className="text-xs text-amber-400/70">
                  Plus que {(50 - totalPrice).toFixed(2)}€ pour la livraison gratuite !
                </p>
              )}
              <div className="border-t border-white/10 pt-3 flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary flex items-center justify-center gap-2 w-full">
              Commander <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
