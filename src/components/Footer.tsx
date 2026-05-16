import Link from 'next/link';
import { Phone, MapPin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-espresso-900 text-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-display text-2xl text-white mb-4">Cosmo<span className="text-rose-blush">.</span></h3>
          <p className="font-body text-sm text-cream-200 leading-relaxed">
            Grossiste en cosmétiques — fournisseur de confiance pour les magasins locaux depuis des années.
            Qualité garantie, prix compétitifs.
          </p>
        </div>
        <div>
          <h4 className="font-body font-semibold text-white mb-4 tracking-wide text-sm uppercase">Liens rapides</h4>
          <ul className="space-y-2 font-body text-sm">
            <li><Link href="/" className="text-cream-200 hover:text-rose-blush transition-colors">Accueil</Link></li>
            <li><Link href="/catalogue" className="text-cream-200 hover:text-rose-blush transition-colors">Catalogue</Link></li>
            <li><Link href="/contact" className="text-cream-200 hover:text-rose-blush transition-colors">Contact & Livraison</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-body font-semibold text-white mb-4 tracking-wide text-sm uppercase">Contact</h4>
          <ul className="space-y-3 font-body text-sm text-cream-200">
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-rose-blush flex-shrink-0" />
              <span>+213 562 256 189</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-rose-blush flex-shrink-0" />
              <span>Sétif, Algérie</span>
            </li>
          </ul>
          <div className="flex gap-3 mt-4">
            <a href="#" className="p-2 border border-cream-200/30 hover:border-rose-blush hover:text-rose-blush transition-colors"><Instagram size={16} /></a>
            <a href="#" className="p-2 border border-cream-200/30 hover:border-rose-blush hover:text-rose-blush transition-colors"><Facebook size={16} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs text-cream-200/60">© {new Date().getFullYear()} Cosmo Grossiste. Tous droits réservés.</p>
          <Link href="/admin" className="font-body text-xs text-cream-200/30 hover:text-cream-200/60 transition-colors">
            Administration
          </Link>
        </div>
      </div>
    </footer>
  );
}
