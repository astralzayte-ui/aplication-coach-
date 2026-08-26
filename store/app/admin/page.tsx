'use client';

import { useState, useEffect, useRef } from 'react';
import { Product, Order } from '@/lib/types';
import Image from 'next/image';
import {
  Plus, Pencil, Trash2, Package, ShoppingBag, Eye, EyeOff,
  RefreshCw, CheckCircle, XCircle, AlertCircle, Loader2, ExternalLink,
  Upload
} from 'lucide-react';

type Tab = 'products' | 'orders';

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-400 border-green-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    fulfillment_failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    in_progress: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colors[status] || 'bg-zinc-800 text-gray-400 border-zinc-700'}`}>
      {status}
    </span>
  );
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  original_price: string;
  category: string;
  supplier_url: string;
  supplier_name: string;
  stock: string;
  sizes: string;
  colors: string;
  featured: boolean;
  image_url: string;
}

const defaultForm: ProductFormData = {
  name: '', description: '', price: '', original_price: '',
  category: 'sneakers', supplier_url: '', supplier_name: '',
  stock: '100', sizes: '', colors: '', featured: false, image_url: '',
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormData>(defaultForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [fulfillingOrder, setFulfillingOrder] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Simple admin auth
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  function handleAuth() {
    if (password === 'admin123') {
      setAuthed(true);
    } else {
      setAuthError('Mot de passe incorrect');
    }
  }

  useEffect(() => {
    if (authed) {
      fetchProducts();
      fetchOrders();
    }
  }, [authed]);

  async function fetchProducts() {
    setLoading(true);
    const data = await fetch('/api/products?active=all').then(r => r.json()).catch(() => []);
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function fetchOrders() {
    const data = await fetch('/api/orders').then(r => r.json()).catch(() => []);
    setOrders(Array.isArray(data) ? data : []);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      category: product.category,
      supplier_url: product.supplier_url || '',
      supplier_name: product.supplier_name || '',
      stock: product.stock.toString(),
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
      featured: product.featured === 1,
      image_url: product.image_url || '',
    });
    setImagePreview(product.image_url || '');
    setImageFile(null);
    setShowForm(true);
    setFormError('');
  }

  function startAdd() {
    setEditingId(null);
    setForm(defaultForm);
    setImageFile(null);
    setImagePreview('');
    setShowForm(true);
    setFormError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        fd.append(k, v.toString());
      });

      // Sizes & colors as JSON
      const sizesArr = form.sizes.split(',').map(s => s.trim()).filter(Boolean);
      const colorsArr = form.colors.split(',').map(s => s.trim()).filter(Boolean);
      fd.set('sizes', JSON.stringify(sizesArr));
      fd.set('colors', JSON.stringify(colorsArr));
      fd.set('featured', form.featured ? 'true' : 'false');

      if (imageFile) {
        fd.append('image', imageFile);
      }

      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error('Erreur serveur');

      await fetchProducts();
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setFormLoading(false);
    }
  }

  async function toggleActive(product: Product) {
    const fd = new FormData();
    fd.append('active', product.active === 1 ? '0' : '1');
    await fetch(`/api/products/${product.id}`, { method: 'PUT', body: fd });
    fetchProducts();
  }

  async function deleteProduct(id: number) {
    if (!confirm('Supprimer ce produit ?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  }

  async function fulfillNow(order: Order) {
    setFulfillingOrder(order.order_number);
    try {
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      const supplierUrl = items[0]?.product?.supplier_url || '';
      const res = await fetch('/api/fulfill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.order_number, supplierUrl }),
      });
      const data = await res.json();
      alert(data.message || 'Fulfillment lancé');
      fetchOrders();
    } catch {
      alert('Erreur lors du fulfillment');
    } finally {
      setFulfillingOrder(null);
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-3xl font-black text-white mb-1">DRIP<span className="text-amber-400">.</span></div>
              <p className="text-gray-500 text-sm">Panneau Administration</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAuth()}
                  className="input-dark"
                  placeholder="••••••••"
                />
              </div>
              {authError && <p className="text-red-400 text-sm">{authError}</p>}
              <button onClick={handleAuth} className="btn-primary w-full">
                Accéder
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Admin <span className="text-amber-400">Panel</span></h1>
            <p className="text-gray-500 text-sm mt-1">{products.length} produits · {orders.length} commandes</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10">
          {(['products', 'orders'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all border-b-2 ${
                tab === t
                  ? 'text-amber-400 border-amber-400'
                  : 'text-gray-500 border-transparent hover:text-white'
              }`}
            >
              {t === 'products' ? <><Package className="inline mr-2 mb-0.5" size={14} />Produits</> : <><ShoppingBag className="inline mr-2 mb-0.5" size={14} />Commandes</>}
            </button>
          ))}
        </div>

        {/* Products tab */}
        {tab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-bold text-lg">Tous les produits</h2>
              <button onClick={startAdd} className="btn-primary flex items-center gap-2 text-sm py-2 px-5">
                <Plus size={16} /> Ajouter un produit
              </button>
            </div>

            {/* Product Form */}
            {showForm && (
              <div className="bg-zinc-900 border border-amber-400/20 rounded-2xl p-6 mb-6">
                <h3 className="text-white font-bold text-lg mb-6">
                  {editingId ? 'Modifier le produit' : 'Nouveau produit'}
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Nom du produit *</label>
                    <input required className="input-dark" placeholder="Air Max 90..." value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Prix (€) *</label>
                    <input required type="number" step="0.01" className="input-dark" placeholder="59.99" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Prix barré (€)</label>
                    <input type="number" step="0.01" className="input-dark" placeholder="89.99" value={form.original_price} onChange={e => setForm(f => ({...f, original_price: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Catégorie *</label>
                    <select required className="input-dark" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                      <option value="sneakers">Sneakers</option>
                      <option value="bags">Bags</option>
                      <option value="t-shirts">T-Shirts</option>
                      <option value="hoodies">Hoodies</option>
                      <option value="pants">Pants</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Stock</label>
                    <input type="number" className="input-dark" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Lien fournisseur *</label>
                    <input required className="input-dark" placeholder="https://aliexpress.com/item/..." value={form.supplier_url} onChange={e => setForm(f => ({...f, supplier_url: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Nom fournisseur</label>
                    <input className="input-dark" placeholder="AliExpress, Temu..." value={form.supplier_name} onChange={e => setForm(f => ({...f, supplier_name: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Tailles (séparées par virgule)</label>
                    <input className="input-dark" placeholder="XS, S, M, L, XL ou 38, 39, 40..." value={form.sizes} onChange={e => setForm(f => ({...f, sizes: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Couleurs (séparées par virgule)</label>
                    <input className="input-dark" placeholder="Noir, Blanc, Rouge..." value={form.colors} onChange={e => setForm(f => ({...f, colors: e.target.value}))} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Description</label>
                    <input className="input-dark" placeholder="Description du produit..." value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
                  </div>

                  {/* Image upload */}
                  <div className="sm:col-span-2">
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Photo du produit</label>
                    <div className="flex items-start gap-4">
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-amber-400/50 transition-all text-sm"
                      >
                        <Upload size={16} />
                        Uploader une photo
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      <input
                        className="input-dark flex-1"
                        placeholder="Ou URL de l'image..."
                        value={imageFile ? '' : form.image_url}
                        onChange={e => { setForm(f => ({...f, image_url: e.target.value})); setImagePreview(e.target.value); setImageFile(null); }}
                      />
                    </div>
                    {imagePreview && (
                      <div className="mt-3 relative w-24 h-24 rounded-xl overflow-hidden border border-white/10">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-3">
                    <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({...f, featured: e.target.checked}))} className="w-4 h-4 accent-amber-400" />
                    <label htmlFor="featured" className="text-gray-400 text-sm">Mettre en avant (TOP)</label>
                  </div>

                  {formError && <p className="sm:col-span-2 text-red-400 text-sm">{formError}</p>}

                  <div className="sm:col-span-2 flex gap-3">
                    <button type="submit" disabled={formLoading} className="btn-primary flex items-center gap-2">
                      {formLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                      {editingId ? 'Modifier' : 'Ajouter'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-white/10 text-gray-400 rounded-xl hover:text-white transition-all text-sm font-medium">
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products table */}
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="animate-spin text-amber-400" size={32} />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Package size={48} className="mx-auto mb-4 opacity-30" />
                <p>Aucun produit. Ajoutes-en un !</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
                      <th className="pb-3 pr-4">Produit</th>
                      <th className="pb-3 pr-4">Catégorie</th>
                      <th className="pb-3 pr-4">Prix</th>
                      <th className="pb-3 pr-4">Fournisseur</th>
                      <th className="pb-3 pr-4">Statut</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map(p => (
                      <tr key={p.id} className={`${p.active === 0 ? 'opacity-40' : ''}`}>
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                              {p.image_url ? (
                                <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">IMG</div>
                              )}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium line-clamp-1 max-w-[200px]">{p.name}</p>
                              {p.featured === 1 && <span className="text-xs text-amber-400">⭐ Featured</span>}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <span className="text-xs text-gray-400 capitalize">{p.category}</span>
                        </td>
                        <td className="py-4 pr-4">
                          <span className="text-white font-medium">{p.price.toFixed(2)}€</span>
                          {p.original_price && <span className="text-gray-600 text-xs ml-1 line-through">{p.original_price.toFixed(2)}€</span>}
                        </td>
                        <td className="py-4 pr-4">
                          {p.supplier_url ? (
                            <a href={p.supplier_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:underline flex items-center gap-1">
                              {p.supplier_name || 'Lien'} <ExternalLink size={10} />
                            </a>
                          ) : <span className="text-gray-600 text-xs">—</span>}
                        </td>
                        <td className="py-4 pr-4">
                          <StatusBadge status={p.active === 1 ? 'active' : 'inactive'} />
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEdit(p)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-amber-400 transition-colors rounded-lg hover:bg-amber-400/10">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => toggleActive(p)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                              {p.active === 1 ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button onClick={() => deleteProduct(p.id)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders tab */}
        {tab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-bold text-lg">Toutes les commandes</h2>
              <button onClick={fetchOrders} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                <RefreshCw size={14} /> Actualiser
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
                <p>Aucune commande pour l&apos;instant.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => {
                  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                  const logs = typeof order.fulfillment_log === 'string' ? JSON.parse(order.fulfillment_log) : (order.fulfillment_log || []);

                  return (
                    <div key={order.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-amber-400 font-bold text-sm">{order.order_number}</span>
                            <StatusBadge status={order.status} />
                            <StatusBadge status={`fulfill: ${order.fulfillment_status}`} />
                          </div>
                          <p className="text-white font-semibold">{order.customer_name}</p>
                          <p className="text-gray-500 text-sm">{order.customer_email} · {order.shipping_city}, {order.shipping_country}</p>
                          <p className="text-gray-600 text-xs mt-1">{order.created_at}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-xl">{order.total.toFixed(2)}€</p>
                          <p className="text-gray-500 text-xs">{items.length} article{items.length > 1 ? 's' : ''}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {items.map((item: { product: Product; quantity: number; size?: string }, i: number) => (
                          <div key={i} className="bg-zinc-800 rounded-lg px-3 py-1.5 text-xs text-gray-300">
                            {item.product.name} × {item.quantity}
                            {item.size && ` (${item.size})`}
                            {item.product.supplier_url && (
                              <a href={item.product.supplier_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-400">
                                <ExternalLink size={10} className="inline" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Fulfillment log */}
                      {logs.length > 0 && (
                        <div className="bg-black/30 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
                          {logs.slice(-5).map((log: string, i: number) => (
                            <p key={i} className="text-xs text-gray-600 font-mono">{log}</p>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => fulfillNow(order)}
                          disabled={fulfillingOrder === order.order_number}
                          className="flex items-center gap-2 px-4 py-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-400/20 transition-all disabled:opacity-50"
                        >
                          {fulfillingOrder === order.order_number ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <RefreshCw size={12} />
                          )}
                          Fulfillment auto
                        </button>

                        {order.fulfillment_status === 'completed' && (
                          <span className="flex items-center gap-1 text-green-400 text-xs">
                            <CheckCircle size={12} /> Fulfillé
                          </span>
                        )}
                        {order.fulfillment_status === 'failed' && (
                          <span className="flex items-center gap-1 text-red-400 text-xs">
                            <XCircle size={12} /> Échec — fulfillment manuel requis
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
