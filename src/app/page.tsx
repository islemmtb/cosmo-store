export const revalidate = 0;
import { supabase, Product } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowRight, Truck, Shield, Package, Phone } from 'lucide-react';

async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(8);
  return data || [];
}

async function getLatestProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(8);
  return data || [];
}

export default async function HomePage() {
  const [featured, latest] = await Promise.all([getFeaturedProducts(), getLatestProducts()]);

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative bg-espresso-900 text-cream-50 overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #e8b4a0 0%, transparent 60%), radial-gradient(circle at 80% 20%, #8a9e8a 0%, transparent 50%)' }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-36">
            <div className="max-w-2xl">
              <p className="font-body text-rose-blush tracking-widest text-sm uppercase mb-6">Grossiste Cosmétiques — Sétif, Algérie</p>
              <h1 className="font-display text-5xl md:text-7xl leading-none mb-6">
                La beauté<br />
                <em className="text-rose-blush not-italic">en gros.</em>
              </h1>
              <p className="font-body text-cream-200 text-lg leading-relaxed mb-8 max-w-lg">
                Fournisseur de confiance pour les commerces locaux. Prix de gros, livraison disponible, qualité garantie.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/catalogue" className="inline-flex items-center gap-2 bg-rose-deep text-white font-body font-medium px-8 py-4 hover:bg-rose-muted transition-colors">
                  Voir le catalogue <ArrowRight size={16} />
                </Link>
                <a href="tel:+213562256189" className="inline-flex items-center gap-2 border border-cream-200/40 text-cream-100 font-body font-medium px-8 py-4 hover:bg-white/10 transition-colors">
                  <Phone size={16} /> Appeler
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* AVANTAGES */}
        <section className="border-b border-cream-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-cream-200">
            {[
              { icon: Truck, title: 'Livraison disponible', desc: 'Livraison directe chez vous ou en magasin' },
              { icon: Package, title: 'Vente par unité ou boîte', desc: 'Flexibilité totale selon vos besoins' },
              { icon: Shield, title: 'Produits authentiques', desc: 'Qualité garantie, marques vérifiées' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 py-6 px-8">
                <div className="p-3 bg-cream-100 text-rose-deep flex-shrink-0">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-body font-semibold text-espresso-900 text-sm">{title}</p>
                  <p className="font-body text-xs text-espresso-700 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED */}
        {featured.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="font-body text-rose-deep tracking-widest text-xs uppercase mb-2">Sélection</p>
                <h2 className="font-display text-3xl md:text-4xl text-espresso-900">Produits vedettes</h2>
              </div>
              <Link href="/catalogue" className="hidden md:flex items-center gap-1 font-body text-sm text-espresso-700 hover:text-rose-deep transition-colors">
                Tout voir <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* LATEST */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-cream-200">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-body text-rose-deep tracking-widest text-xs uppercase mb-2">Nouveautés</p>
              <h2 className="font-display text-3xl md:text-4xl text-espresso-900">Derniers arrivages</h2>
            </div>
            <Link href="/catalogue" className="hidden md:flex items-center gap-1 font-body text-sm text-espresso-700 hover:text-rose-deep transition-colors">
              Tout voir <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {latest.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-10 text-center">
            <Link href="/catalogue" className="btn-outline inline-flex items-center gap-2">
              Voir tout le catalogue <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-cream-100 border-t border-cream-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
            <h2 className="font-display text-4xl text-espresso-900 mb-4">Vous êtes commerçant?</h2>
            <p className="font-body text-espresso-700 text-lg mb-8 leading-relaxed">
              Contactez-nous pour des tarifs spéciaux grossiste, des commandes groupées et la livraison directe.
            </p>
            <a
              href="https://wa.me/213562256189"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-body font-medium px-8 py-4 hover:opacity-90 transition-opacity"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Commander via WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
