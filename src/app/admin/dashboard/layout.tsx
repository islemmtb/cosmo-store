'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, Upload, LogOut, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/dashboard/products', label: 'Produits', icon: Package },
  { href: '/admin/dashboard/orders', label: 'Commandes', icon: ShoppingBag },
  { href: '/admin/dashboard/import', label: 'Import Excel', icon: Upload },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (!token) router.push('/admin');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-espresso-900 text-cream-100 flex flex-col z-40 transform transition-transform lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="font-display text-2xl text-white">
            Cosmo<span className="text-rose-blush">.</span>
          </Link>
          <p className="font-body text-xs text-cream-200/50 mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 font-body text-sm transition-colors ${
                pathname === href
                  ? 'bg-rose-deep text-white'
                  : 'text-cream-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 font-body text-sm text-cream-200 hover:text-red-300 transition-colors w-full"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 font-body text-xs text-cream-200/40 hover:text-cream-200/70 transition-colors"
          >
            ← Voir le site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-cream-200 px-4 sm:px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden p-1" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <h1 className="font-body font-semibold text-espresso-900">
            {navItems.find(n => n.href === pathname)?.label || 'Dashboard'}
          </h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
