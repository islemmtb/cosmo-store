'use client';
import { useState, useMemo } from 'react';
import { Product } from '@/lib/supabase';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function CatalogueFilters({
  products,
  categories,
  brands,
}: {
  products: Product[];
  categories: string[];
  brands: string[];
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [sort, setSort] = useState('default');

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()));
    if (category) result = result.filter(p => p.category === category);
    if (brand) result = result.filter(p => p.brand === brand);
    if (sort === 'price-asc') result.sort((a, b) => a.price_unit - b.price_unit);
    if (sort === 'price-desc') result.sort((a, b) => b.price_unit - a.price_unit);
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, search, category, brand, sort]);

  const hasFilters = search || category || brand || sort !== 'default';

  return (
    <div>
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-700" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="input-field sm:w-44">
          <option value="">Toutes catégories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={brand} onChange={e => setBrand(e.target.value)} className="input-field sm:w-44">
          <option value="">Toutes marques</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="input-field sm:w-44">
          <option value="default">Tri par défaut</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="name">Nom A–Z</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setCategory(''); setBrand(''); setSort('default'); }}
            className="flex items-center gap-1 px-4 border border-rose-deep text-rose-deep text-sm font-body hover:bg-rose-deep hover:text-white transition-colors whitespace-nowrap"
          >
            <X size={14} /> Réinitialiser
          </button>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-espresso-700 font-body">
          <p className="text-lg">Aucun produit trouvé.</p>
          <p className="text-sm mt-2 text-espresso-700/60">Essayez d'autres filtres.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
