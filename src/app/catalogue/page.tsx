import { supabase, Product } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CatalogueFilters from '@/components/CatalogueFilters';

async function getProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });
  return data || [];
}

export default async function CataloguePage() {
  const products = await getProducts();
const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="font-body text-rose-deep tracking-widest text-xs uppercase mb-2">Tous les produits</p>
          <h1 className="font-display text-4xl text-espresso-900">Notre Catalogue</h1>
          <p className="font-body text-espresso-700 mt-2">{products.length} produits disponibles</p>
        </div>
        <CatalogueFilters products={products} categories={categories} brands={brands} />
      </main>
      <Footer />
    </>
  );
}
