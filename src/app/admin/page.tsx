'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Verify against admin products endpoint
    const res = await fetch('/api/admin/products', {
      headers: { Authorization: `Bearer ${password}` },
    });

    if (res.ok) {
      localStorage.setItem('admin-token', password);
      router.push('/admin/dashboard');
    } else {
      setError('Mot de passe incorrect');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-espresso-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-4xl text-cream-50 inline-block hover:text-rose-blush transition-colors">
            Cosmo<span className="text-rose-blush">.</span>
          </Link>
          <p className="font-body text-cream-200/60 text-sm mt-2">Administration</p>
        </div>

        <form onSubmit={handleLogin} className="bg-cream-50 p-8">
          <h1 className="font-display text-2xl text-espresso-900 mb-6">Connexion Admin</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block font-body text-sm font-medium text-espresso-900 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field pr-12"
                placeholder="••••••••"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-700 hover:text-rose-deep transition-colors"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Se connecter
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="font-body text-sm text-cream-200/50 hover:text-cream-200 transition-colors">
            ← Retour à Cosmo Grossiste
          </Link>
        </div>
      </div>
    </div>
  );
}
