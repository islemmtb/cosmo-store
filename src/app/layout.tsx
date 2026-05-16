import type { Metadata } from 'next';
import '@/styles/globals.css';
import { CartProvider } from '@/hooks/useCart';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Cosmo Grossiste — Cosmétiques en Gros',
  description: 'Grossiste cosmétiques — prix de gros, livraison disponible, vente aux magasins locaux.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: 'var(--font-dm-sans)',
                borderRadius: '0',
                background: '#1a1008',
                color: '#fdfaf5',
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
