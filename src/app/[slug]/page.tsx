import { notFound } from 'next/navigation';
import { supabase, Product } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetail from '@/components/ProductDetail';
import type { Metadata } from 'next';

type Props = { params: { slug: string } };

async function getProduct(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Produit introuvable' };
  return {
    title: `${product.name} — Cosmo Grossiste`,
    description: product.description || `Achetez ${product.name} en gros chez Cosmo Grossiste.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <ProductDetail product={product} />
      </main>
      <Footer />
    </>
  );
}
