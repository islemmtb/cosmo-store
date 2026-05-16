'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Package, ChevronLeft, ZoomIn } from 'lucide-react';
import { Product } from '@/lib/supabase';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

const fmt = (n: number) => new Intl.NumberFormat('fr-DZ').format(n) + ' DZD';

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [unitType, setUnitType] = useState<'unite' | 'boite'>('unite');
  const [qty, setQty] = useState(product.min_units || 1);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const price = unitType === 'boite' ? product.price_box : product.price_unit;

  const handleAdd = () => {
    if (qty < (product.min_units || 1)) {
      toast.error(`Minimum ${product.min_units} unités requis`);
      return;
    }
    addItem(product, qty, unitType);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <div>
      <Link href="/catalogue" className="inline-flex items-center gap-1 text-sm font-body text-espresso-700 hover:text-rose-deep transition-colors mb-8">
        <ChevronLeft size={16} /> Retour au catalogue
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div
            className="relative aspect-square bg-cream-100 overflow-hidden cursor-zoom-in mb-4"
            onClick={() => setLightbox(true)}
          >
            {product.images?.[activeImg] ? (
              <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={64} className="text-cream-200" />
              </div>
            )}
            <div className="absolute bottom-3 right-3 bg-espresso-900/70 text-cream-50 p-1.5">
              <ZoomIn size={14} />
            </div>
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 border-2 overflow-hidden transition-colors ${i === activeImg ? 'border-espresso-900' : 'border-cream-200 hover:border-rose-muted'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.brand && (
            <p className="font-body text-rose-deep tracking-widest text-xs uppercase mb-2">{product.brand}</p>
          )}
          <h1 className="font-display text-3xl md:text-4xl text-espresso-900 leading-tight mb-4">{product.name}</h1>

          {product.category && (
            <span className="inline-block bg-cream-100 text-espresso-700 text-xs font-body px-3 py-1 mb-4">{product.category}</span>
          )}

          {product.description && (
            <p className="font-body text-espresso-700 leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 10 ? (
              <span className="text-sm font-body text-green-700 bg-green-50 px-3 py-1">En stock ({product.stock} unités)</span>
            ) : product.stock > 0 ? (
              <span className="text-sm font-body text-orange-700 bg-orange-50 px-3 py-1">Stock limité ({product.stock} unités)</span>
            ) : (
              <span className="text-sm font-body text-red-700 bg-red-50 px-3 py-1">Rupture de stock</span>
            )}
          </div>

          {/* Pricing toggle */}
          <div className="border border-cream-200 p-5 mb-6 bg-white">
            <p className="font-body text-xs text-espresso-700 uppercase tracking-wide mb-3">Type d'achat</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setUnitType('unite')}
                className={`p-4 border-2 text-left transition-colors ${unitType === 'unite' ? 'border-espresso-900 bg-espresso-900 text-cream-50' : 'border-cream-200 hover:border-espresso-900'}`}
              >
                <p className="font-body text-xs uppercase tracking-wide mb-1 opacity-70">Par unité</p>
                <p className="font-display text-xl">{fmt(product.price_unit)}</p>
              </button>
              <button
                onClick={() => setUnitType('boite')}
                className={`p-4 border-2 text-left transition-colors ${unitType === 'boite' ? 'border-espresso-900 bg-espresso-900 text-cream-50' : 'border-cream-200 hover:border-espresso-900'}`}
              >
                <p className="font-body text-xs uppercase tracking-wide mb-1 opacity-70">Par boîte ({product.units_per_box} u.)</p>
                <p className="font-display text-xl">{fmt(product.price_box)}</p>
              </button>
            </div>

            {product.min_units > 1 && (
              <p className="text-xs font-body text-espresso-700 bg-cream-100 px-3 py-2 mb-4">
                ⚠ Commande minimum: {product.min_units} unités
              </p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-4">
              <p className="font-body text-sm font-medium text-espresso-900">Quantité:</p>
              <div className="flex border border-cream-200">
                <button onClick={() => setQty(Math.max(product.min_units || 1, qty - 1))} className="px-4 py-2 text-sm hover:bg-cream-100 transition-colors font-medium">−</button>
                <input
                  type="number"
                  value={qty}
                  onChange={e => setQty(Math.max(product.min_units || 1, Number(e.target.value)))}
                  className="w-16 text-center text-sm font-body border-x border-cream-200 focus:outline-none bg-white py-2"
                />
                <button onClick={() => setQty(qty + 1)} className="px-4 py-2 text-sm hover:bg-cream-100 transition-colors font-medium">+</button>
              </div>
            </div>

            <div className="flex justify-between font-body font-semibold text-lg mb-4 text-espresso-900">
              <span>Total estimé:</span>
              <span>{fmt(price * qty)}</span>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} /> Ajouter au panier
            </button>
          </div>

          {/* Units info */}
          <div className="text-xs font-body text-espresso-700 space-y-1">
            <p>• 1 boîte = {product.units_per_box} unités</p>
            <p>• Livraison disponible — appelez le +213 562 256 189</p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && product.images?.[activeImg] && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <img src={product.images[activeImg]} alt={product.name} className="max-h-[90vh] max-w-full object-contain" />
        </div>
      )}
    </div>
  );
}
