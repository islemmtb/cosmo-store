'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Menu, X, Phone } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { count } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-cream-50 border-b border-cream-200">
        {/* Top bar */}
        <div className="bg-espresso-900 text-cream-100 text-xs py-2 text-center tracking-widest font-body">
          <span className="flex items-center justify-center gap-2">
            <Phone size={11} />
            Livraison disponible — Appelez: +213 562 256 189
          </span>
        </div>
        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl text-espresso-900 tracking-tight">
            Cosmo<span className="text-rose-deep">.</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 font-body text-sm font-medium text-espresso-800">
            <Link href="/" className="hover:text-rose-deep transition-colors">Accueil</Link>
            <Link href="/catalogue" className="hover:text-rose-deep transition-colors">Catalogue</Link>
            <Link href="/contact" className="hover:text-rose-deep transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:text-rose-deep transition-colors"
              aria-label="Panier"
            >
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-deep text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-body font-medium">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile menu btn */}
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-cream-50 border-t border-cream-200 px-4 pb-4 font-body text-sm font-medium">
            <Link href="/" className="block py-3 border-b border-cream-200 hover:text-rose-deep" onClick={() => setMenuOpen(false)}>Accueil</Link>
            <Link href="/catalogue" className="block py-3 border-b border-cream-200 hover:text-rose-deep" onClick={() => setMenuOpen(false)}>Catalogue</Link>
            <Link href="/contact" className="block py-3 hover:text-rose-deep" onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
