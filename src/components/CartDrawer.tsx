'use client';
import { useState } from 'react';
import { X, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

const fmt = (n: number) => new Intl.NumberFormat('fr-DZ').format(n) + ' DZD';

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateItem, clearCart, total } = useCart();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [form, setForm] = useState({ name: '', phone: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Veuillez remplir votre nom et téléphone');
      return;
    }
    setLoading(true);
    try {
      const orderItems = items.map(i => ({
        product_id: i.product.id,
        product_name: i.product.name,
        product_slug: i.product.slug,
        quantity: i.quantity,
        unit_type: i.unit_type,
        price_per_unit: i.unit_type === 'boite' ? i.product.price_box : i.product.price_unit,
        subtotal: (i.unit_type === 'boite' ? i.product.price_box : i.product.price_unit) * i.quantity,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          customer_phone: form.phone,
          items: orderItems,
          total,
          notes: form.notes,
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de la commande');
      clearCart();
      setStep('cart');
      setForm({ name: '', phone: '', notes: '' });
      onClose();
      toast.success('Commande envoyée! Nous vous contacterons bientôt.');
    } catch {
      toast.error("Erreur. Réessayez ou appelez-nous.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-cream-50 z-50 shadow-2xl flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
          <h2 className="font-display text-xl text-espresso-900">
            {step === 'cart' ? 'Votre Panier' : 'Finaliser la commande'}
          </h2>
          <button onClick={onClose} className="p-1 hover:text-rose-deep transition-colors">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-espresso-700">
            <ShoppingBag size={48} className="opacity-30" />
            <p className="font-body text-lg">Votre panier est vide</p>
          </div>
        ) : (
          <>
            {step === 'cart' ? (
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.map(item => {
                  const price = item.unit_type === 'boite' ? item.product.price_box : item.product.price_unit;
                  return (
                    <div key={`${item.product.id}-${item.unit_type}`} className="flex gap-4 py-4 border-b border-cream-200">
                      {item.product.images?.[0] && (
                        <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-medium text-espresso-900 truncate">{item.product.name}</p>
                        <p className="text-xs text-espresso-700 mt-0.5 capitalize">
                          {item.unit_type === 'boite' ? `Boîte (${item.product.units_per_box} unités)` : 'Unité'}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => updateItem(item.product.id, item.quantity - 1, item.unit_type)} className="w-7 h-7 border border-cream-200 flex items-center justify-center hover:bg-cream-200 transition-colors text-sm font-medium">−</button>
                          <span className="font-body font-medium w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateItem(item.product.id, item.quantity + 1, item.unit_type)} className="w-7 h-7 border border-cream-200 flex items-center justify-center hover:bg-cream-200 transition-colors text-sm font-medium">+</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button onClick={() => removeItem(item.product.id)} className="text-rose-deep hover:opacity-70 transition-opacity">
                          <Trash2 size={16} />
                        </button>
                        <p className="font-body font-semibold text-espresso-900 text-sm">{fmt(price * item.quantity)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <div className="bg-cream-100 p-4 text-sm font-body space-y-1">
                  <p className="font-medium text-espresso-900 mb-2">Résumé ({items.length} article{items.length > 1 ? 's' : ''})</p>
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between text-espresso-700">
                      <span>{item.product.name} ×{item.quantity} ({item.unit_type})</span>
                      <span>{fmt((item.unit_type === 'boite' ? item.product.price_box : item.product.price_unit) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-body font-medium mb-1 text-espresso-900">Nom complet *</label>
                  <input className="input-field" placeholder="Votre nom" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium mb-1 text-espresso-900">Téléphone *</label>
                  <input className="input-field" placeholder="+213 xxx xxx xxx" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium mb-1 text-espresso-900">Notes (adresse, remarques…)</label>
                  <textarea className="input-field resize-none" rows={3} placeholder="Adresse de livraison, remarques..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-5 border-t border-cream-200 bg-white">
              <div className="flex justify-between font-body font-semibold text-lg mb-4 text-espresso-900">
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>
              {step === 'cart' ? (
                <button onClick={() => setStep('checkout')} className="btn-primary w-full text-center">
                  Passer la commande →
                </button>
              ) : (
                <div className="space-y-2">
                  <button onClick={handleOrder} disabled={loading} className="btn-primary w-full text-center flex items-center justify-center gap-2">
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    Confirmer la commande
                  </button>
                  <button onClick={() => setStep('cart')} className="btn-outline w-full text-center text-sm">
                    ← Retour au panier
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
