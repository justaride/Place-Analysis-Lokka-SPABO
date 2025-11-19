'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [returnUrl, setReturnUrl] = useState('/');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = searchParams.get('returnUrl') || '/';
    setReturnUrl(url);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // Redirect to the original page or home
        router.push(returnUrl);
        router.refresh();
      } else {
        setError('Feil passord. Vennligst prøv igjen.');
        setPassword('');
      }
    } catch (err) {
      setError('En feil oppstod. Vennligst prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-lokka-primary to-lokka-secondary px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-large">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/natural-state-logo.png"
              alt="Natural State"
              width={200}
              height={50}
              className="h-[50px] w-auto"
            />
          </div>

          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-lokka-primary">
              Grünerløkka Eiendomsanalyse
            </h1>
            <p className="text-sm text-lokka-secondary">
              by Natural State, for Spabo Eiendom
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Passord
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-lokka-primary focus:outline-none focus:ring-2 focus:ring-lokka-primary/20"
                placeholder="Skriv inn passord"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-lokka-primary px-4 py-3 font-medium text-white transition-all hover:bg-lokka-secondary disabled:opacity-50"
            >
              {loading ? 'Logger inn...' : 'Logg inn'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            nature, human, society
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-lokka-primary to-lokka-secondary">
        <div className="text-white">Laster...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
