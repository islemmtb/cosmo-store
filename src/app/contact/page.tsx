import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Phone, MapPin, Clock, Truck } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <p className="font-body text-rose-deep tracking-widest text-xs uppercase mb-2">Nous joindre</p>
          <h1 className="font-display text-4xl text-espresso-900">Contact & Livraison</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="p-3 bg-cream-100 text-rose-deep h-fit"><Phone size={20} /></div>
              <div>
                <h3 className="font-body font-semibold text-espresso-900 mb-1">Téléphone / WhatsApp</h3>
                <a href="tel:+213562256189" className="font-body text-espresso-700 hover:text-rose-deep transition-colors">+213 562 256 189</a>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-3 bg-cream-100 text-rose-deep h-fit"><MapPin size={20} /></div>
              <div>
                <h3 className="font-body font-semibold text-espresso-900 mb-1">Localisation</h3>
                <p className="font-body text-espresso-700">Sétif, Algérie</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-3 bg-cream-100 text-rose-deep h-fit"><Truck size={20} /></div>
              <div>
                <h3 className="font-body font-semibold text-espresso-900 mb-1">Livraison</h3>
                <p className="font-body text-espresso-700 leading-relaxed">
                  Livraison disponible sur toute la région de Sétif et environs. Contactez-nous pour les tarifs et délais.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-3 bg-cream-100 text-rose-deep h-fit"><Clock size={20} /></div>
              <div>
                <h3 className="font-body font-semibold text-espresso-900 mb-1">Horaires</h3>
                <p className="font-body text-espresso-700">Samedi – Jeudi: 8h00 – 18h00</p>
                <p className="font-body text-espresso-700">Vendredi: Fermé</p>
              </div>
            </div>
          </div>
          <div className="bg-espresso-900 text-cream-50 p-8">
            <h2 className="font-display text-2xl mb-2">Commander via WhatsApp</h2>
            <p className="font-body text-cream-200 text-sm leading-relaxed mb-6">
              Envoyez-nous un message WhatsApp pour des commandes en gros, des demandes de prix ou toute question.
            </p>
            <a
              href="https://wa.me/213562256189"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white font-body font-medium px-6 py-3 w-full justify-center hover:opacity-90 transition-opacity"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Ouvrir WhatsApp
            </a>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="font-body text-cream-200/70 text-xs">
                Vous pouvez aussi passer votre commande directement sur le site et nous vous contacterons pour confirmation.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
