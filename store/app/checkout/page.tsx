'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

type Step = 'info' | 'confirm' | 'success';

interface FormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal: string;
  shipping_country: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>('info');
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState<FormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_postal: '',
    shipping_country: 'France',
  });

  const shipping = totalPrice >= 50 ? 0 : 4.99;
  const total = totalPrice + shipping;

  if (items.length === 0 && step !== 'success') {
    router.push('/cart');
    return null;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleOrder() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items,
          total,
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de la commande');
      const order = await res.json();
      setOrderNumber(order.order_number);
      setStep('success');
      clearCart();

      // Auto-trigger fulfillment for each unique supplier URL
      const supplierUrls = [...new Set(
        items
          .filter(i => i.product.supplier_url)
          .map(i => i.product.supplier_url)
      )];

      for (const supplierUrl of supplierUrls) {
        fetch('/api/fulfill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.order_number, supplierUrl }),
        }).catch(() => {});
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <CheckCircle className="text-green-400 mx-auto mb-6" size={64} />
          <h1 className="text-3xl font-black text-white mb-3">Commande confirmée ! 🎉</h1>
          <p className="text-gray-400 mb-6">
            Ta commande <span className="text-amber-400 font-bold">{orderNumber}</span> a bien été enregistrée.
            Tu recevras une confirmation à {form.customer_email}.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Livraison estimée : 5-10 jours ouvrés
          </p>
          <Link href="/" className="btn-primary inline-block">
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link href="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-8">
          <ArrowLeft size={16} /> Retour au panier
        </Link>

        <h1 className="text-3xl font-black text-white mb-10">Finaliser la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-6">Informations de livraison</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Nom complet *</label>
                  <input
                    name="customer_name"
                    value={form.customer_name}
                    onChange={handleChange}
                    placeholder="Jean Dupont"
                    className="input-dark"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Email *</label>
                  <input
                    name="customer_email"
                    type="email"
                    value={form.customer_email}
                    onChange={handleChange}
                    placeholder="jean@exemple.fr"
                    className="input-dark"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Téléphone</label>
                  <input
                    name="customer_phone"
                    type="tel"
                    value={form.customer_phone}
                    onChange={handleChange}
                    placeholder="+33 6 12 34 56 78"
                    className="input-dark"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Adresse *</label>
                  <input
                    name="shipping_address"
                    value={form.shipping_address}
                    onChange={handleChange}
                    placeholder="12 rue de la Paix"
                    className="input-dark"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Ville *</label>
                  <input
                    name="shipping_city"
                    value={form.shipping_city}
                    onChange={handleChange}
                    placeholder="Paris"
                    className="input-dark"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Code postal *</label>
                  <input
                    name="shipping_postal"
                    value={form.shipping_postal}
                    onChange={handleChange}
                    placeholder="75001"
                    className="input-dark"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Pays</label>
                  <select name="shipping_country" value={form.shipping_country} onChange={handleChange} className="input-dark">
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Canada">Canada</option>
                    <option value="Luxembourg">Luxembourg</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="mt-6 p-4 bg-amber-400/5 border border-amber-400/20 rounded-xl">
                <p className="text-amber-400/80 text-xs">
                  🔒 Paiement sécurisé — Tes données sont protégées. La commande sera traitée et expédiée sous 1-3 jours ouvrés.
                </p>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 h-fit">
            <h2 className="text-white font-bold text-lg mb-6">Ta commande</h2>

            <div className="space-y-3 mb-6">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-400 flex-1 mr-2 line-clamp-1">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="text-white">{(item.product.price * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 text-sm mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Livraison</span>
                <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                  {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)}€`}
                </span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={loading || !form.customer_name || !form.customer_email || !form.shipping_address || !form.shipping_city || !form.shipping_postal}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Traitement...
                </>
              ) : (
                'Confirmer la commande'
              )}
            </button>

            <p className="text-xs text-gray-600 text-center mt-3">
              En commandant, tu acceptes nos conditions générales de vente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
