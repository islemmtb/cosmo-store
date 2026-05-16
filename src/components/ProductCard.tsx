'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Package, ChevronDown } from 'lucide-react';
import { Product } from '@/lib/supabase';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

const fmt = (n: number) => new Intl.NumberFormat('fr-DZ').format(n) + ' DZD';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [unitType, setUnitType] = useState<'unite' | 'boite'>('unite');
  const [qty, setQty] = useState(product.min_units || 1);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (qty < (product.min_units || 1)) {
      toast.error(`Minimum ${product.min_units} unités requis`);
      return;
    }
    addItem(product, qty, unitType);
    toast.success(`${product.name} ajouté au panier`);
  };

  const price = unitType === 'boite' ? product.price_box : product.price_unit;

  return (
    <Link href={`/${product.slug}`} className="group block bg-white border border-cream-200 card-hover">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={40} className="text-cream-200" />
          </div>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 bg-espresso-900 text-cream-50 text-xs font-body font-medium px-2.5 py-1 tracking-wide">
            VEDETTE
          </span>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-rose-deep text-white text-xs font-body px-2 py-1">
            Stock limité
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs font-body text-rose-deep uppercase tracking-widest mb-1">{product.brand || product.category}</p>
        <h3 className="font-display text-base text-espresso-900 leading-snug mb-3 line-clamp-2">{product.name}</h3>

        {/* Unit toggle */}
        <div className="flex gap-2 mb-3" onClick={e => e.preventDefault()}>
          <button
            onClick={() => setUnitType('unite')}
            className={`flex-1 text-xs font-body py-1.5 border transition-colors ${unitType === 'unite' ? 'bg-espresso-900 text-cream-50 border-espresso-900' : 'border-cream-200 text-espresso-700 hover:border-espresso-900'}`}
          >
            Unité — {fmt(product.price_unit)}
          </button>
          <button
            onClick={() => setUnitType('boite')}
            className={`flex-1 text-xs font-body py-1.5 border transition-colors ${unitType === 'boite' ? 'bg-espresso-900 text-cream-50 border-espresso-900' : 'border-cream-200 text-espresso-700 hover:border-espresso-900'}`}
          >
            Boîte ({product.units_per_box}) — {fmt(product.price_box)}
          </button>
        </div>

        {product.min_units > 1 && (
          <p className="text-xs text-espresso-700 font-body mb-2">Min: {product.min_units} unités</p>
        )}

        {/* Qty + Add */}
        <div className="flex gap-2" onClick={e => e.preventDefault()}>
          <div className="flex border border-cream-200">
            <button onClick={() => setQty(Math.max(product.min_units || 1, qty - 1))} className="px-3 text-sm hover:bg-cream-100 transition-colors">−</button>
            <input
              type="number"
              value={qty}
              onChange={e => setQty(Math.max(product.min_units || 1, Number(e.target.value)))}
              className="w-12 text-center text-sm font-body border-x border-cream-200 focus:outline-none bg-white"
            />
            <button onClick={() => setQty(qty + 1)} className="px-3 text-sm hover:bg-cream-100 transition-colors">+</button>
          </div>
          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-2 bg-espresso-900 text-cream-50 text-sm font-body font-medium hover:bg-espresso-800 transition-colors active:scale-95"
          >
            <ShoppingCart size={14} />
            Ajouter
          </button>
        </div>
      </div>
    </Link>
  );
}
