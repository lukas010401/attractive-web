import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '@/lib/api';
import { saveTokens, type TokenResponse } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@attractive.mg');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const tokens = await apiFetch<TokenResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      saveTokens(tokens);
      router.push('/admin');
    } catch {
      setError('Identifiants invalides.');
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-90px)] max-w-md items-center px-4">
      <form onSubmit={submit} className="w-full rounded-[2rem] bg-white/80 p-8 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-bronze">Administration</p>
        <h1 className="mt-3 font-display text-4xl text-ink">Connexion</h1>
        <div className="mt-8 grid gap-4">
          <input value={email} onChange={event => setEmail(event.target.value)} className="rounded-2xl border border-cocoa/15 px-4 py-3" />
          <input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Mot de passe" className="rounded-2xl border border-cocoa/15 px-4 py-3" />
        </div>
        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
        <button className="mt-6 rounded-full bg-ink px-7 py-3 text-sm font-semibold text-cream">Se connecter</button>
      </form>
    </div>
  );
}
