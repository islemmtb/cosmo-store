import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-32 text-center">
        <p className="font-display text-9xl text-cream-200 select-none">404</p>
        <h1 className="font-display text-3xl text-espresso-900 -mt-4 mb-4">Page introuvable</h1>
        <p className="font-body text-espresso-700 mb-8">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn-primary">Retour à l'accueil</Link>
          <Link href="/catalogue" className="btn-outline">Voir le catalogue</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
