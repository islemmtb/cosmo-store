export const revalidate = 0;
'use client';
import { useEffect, useState } from 'react';
import { Package, ShoppingBag, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

const fmt = (n: number) => new Intl.NumberFormat('fr-DZ').format(n) + ' DZD';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch('/api/admin/orders', { headers }).then(r => r.json()),
      fetch('/api/admin/products', { headers }).then(r => r.json()),
    ]).then(([o, p]) => {
      setOrders(Array.isArray(o) ? o : []);
      setProducts(Array.isArray(p) ? p : []);
      setLoading(false);
    });
  }, []);

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter(p => p.stock < 10 && p.stock >= 0);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Produits actifs', value: products.filter(p => p.active).length, icon: Package, color: 'text-rose-deep', link: '/admin/dashboard/products' },
          { label: 'Commandes totales', value: orders.length, icon: ShoppingBag, color: 'text-blue-600', link: '/admin/dashboard/orders' },
          { label: 'En attente', value: pendingOrders.length, icon: Clock, color: 'text-orange-600', link: '/admin/dashboard/orders' },
          { label: 'CA livré', value: fmt(totalRevenue), icon: TrendingUp, color: 'text-green-600', link: '/admin/dashboard/orders' },
        ].map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} href={link} className="bg-white border border-cream-200 p-5 hover:shadow-md transition-shadow">
            <div className={`${color} mb-3`}><Icon size={22} /></div>
            <p className="font-display text-2xl text-espresso-900">{loading ? '…' : value}</p>
            <p className="font-body text-xs text-espresso-700 mt-1">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white border border-cream-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-body font-semibold text-espresso-900">Dernières commandes</h2>
            <Link href="/admin/dashboard/orders" className="text-xs font-body text-rose-deep hover:underline">Voir tout</Link>
          </div>
          {loading ? (
            <p className="font-body text-sm text-espresso-700">Chargement…</p>
          ) : orders.length === 0 ? (
            <p className="font-body text-sm text-espresso-700">Aucune commande pour l'instant.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-cream-100 last:border-0">
                  <div>
                    <p className="font-body text-sm font-medium text-espresso-900">{order.customer_name}</p>
                    <p className="font-body text-xs text-espresso-700">{order.customer_phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-sm font-semibold text-espresso-900">{fmt(order.total)}</p>
                    <span className={`text-xs font-body px-2 py-0.5 ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock */}
        <div className="bg-white border border-cream-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-body font-semibold text-espresso-900">Stock faible</h2>
            <Link href="/admin/dashboard/products" className="text-xs font-body text-rose-deep hover:underline">Gérer</Link>
          </div>
          {loading ? (
            <p className="font-body text-sm text-espresso-700">Chargement…</p>
          ) : lowStock.length === 0 ? (
            <p className="font-body text-sm text-green-700">✓ Tous les stocks sont suffisants</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-cream-100 last:border-0">
                  <p className="font-body text-sm text-espresso-900">{p.name}</p>
                  <span className={`text-xs font-body px-2 py-0.5 ${p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {p.stock === 0 ? 'Rupture' : `${p.stock} restants`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
