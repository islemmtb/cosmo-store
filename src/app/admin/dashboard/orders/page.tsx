'use client';
import { useEffect, useState } from 'react';
import { Loader2, ChevronDown, Phone, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const fmt = (n: number) => new Intl.NumberFormat('fr-DZ').format(n) + ' DZD';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'confirmed', label: 'Confirmée', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'delivered', label: 'Livrée', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'cancelled', label: 'Annulée', color: 'bg-red-100 text-red-800 border-red-200' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const token = () => localStorage.getItem('admin-token');

  const load = async () => {
    const res = await fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token()}` } });
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) { await load(); toast.success('Statut mis à jour'); }
    else toast.error('Erreur');
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[{ value: 'all', label: 'Toutes' }, ...STATUS_OPTIONS].map(s => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`px-4 py-2 text-sm font-body whitespace-nowrap transition-colors border ${
              filter === s.value ? 'bg-espresso-900 text-cream-50 border-espresso-900' : 'border-cream-200 text-espresso-700 hover:border-espresso-900'
            }`}
          >
            {s.label}
            {s.value !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">({orders.filter(o => o.status === s.value).length})</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-rose-deep" size={32} /></div>
      ) : filtered.length === 0 ? (
        <p className="text-center py-16 font-body text-espresso-700">Aucune commande dans cette catégorie.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const statusInfo = STATUS_OPTIONS.find(s => s.value === order.status);
            const isExpanded = expanded === order.id;
            return (
              <div key={order.id} className="bg-white border border-cream-200">
                {/* Header */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-cream-50 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-body font-semibold text-espresso-900">{order.customer_name}</p>
                      <p className="font-body text-xs text-espresso-700 flex items-center gap-1 mt-0.5">
                        <Phone size={11} /> {order.customer_phone}
                      </p>
                    </div>
                    <span className={`text-xs font-body px-2.5 py-1 border ${statusInfo?.color}`}>
                      {statusInfo?.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="font-body font-semibold text-espresso-900">{fmt(order.total)}</p>
                      <p className="font-body text-xs text-espresso-700">
                        {new Date(order.created_at).toLocaleDateString('fr-DZ')}
                      </p>
                    </div>
                    <ChevronDown size={18} className={`text-espresso-700 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t border-cream-200 px-5 py-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Items */}
                      <div>
                        <p className="font-body text-xs uppercase tracking-wide text-espresso-700 mb-3">Articles commandés</p>
                        <div className="space-y-2">
                          {order.items?.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between text-sm font-body">
                              <span className="text-espresso-900">
                                {item.product_name} ×{item.quantity}
                                <span className="text-espresso-700 ml-1">({item.unit_type})</span>
                              </span>
                              <span className="font-medium">{fmt(item.subtotal)}</span>
                            </div>
                          ))}
                          <div className="border-t border-cream-200 pt-2 flex justify-between font-body font-semibold">
                            <span>Total</span>
                            <span>{fmt(order.total)}</span>
                          </div>
                        </div>
                        {order.notes && (
                          <div className="mt-3 bg-cream-100 p-3 text-sm font-body text-espresso-700">
                            <strong>Notes:</strong> {order.notes}
                          </div>
                        )}
                      </div>

                      {/* Status change */}
                      <div>
                        <p className="font-body text-xs uppercase tracking-wide text-espresso-700 mb-3">Changer le statut</p>
                        <div className="grid grid-cols-2 gap-2">
                          {STATUS_OPTIONS.map(s => (
                            <button
                              key={s.value}
                              onClick={() => updateStatus(order.id, s.value)}
                              className={`px-3 py-2 text-xs font-body border transition-colors ${
                                order.status === s.value
                                  ? s.color + ' font-semibold'
                                  : 'border-cream-200 text-espresso-700 hover:border-espresso-900'
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                        <a
                          href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 flex items-center justify-center gap-2 bg-[#25D366] text-white font-body text-sm py-2 w-full hover:opacity-90 transition-opacity"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          Contacter le client
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
