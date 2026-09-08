import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '@/lib/api';
import type { Brand } from '@/lib/types';

type BrandFormProps = {
  brand?: Brand | null;
};

type BrandFormState = {
  name: string;
  slug: string;
  isActive: boolean;
};

const initialForm: BrandFormState = {
  name: '',
  slug: '',
  isActive: true
};

const inputClass = 'w-full rounded-2xl border border-cocoa/15 bg-white px-4 py-3 outline-none focus:border-cocoa';

export function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<BrandFormState>(initialForm);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!brand) return;
    setForm({
      name: brand.name,
      slug: brand.slug,
      isActive: brand.isActive ?? true
    });
  }, [brand]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Le nom de la marque est obligatoire.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || null,
        isActive: form.isActive
      };

      if (brand?.id) {
        await apiFetch<Brand>(`/api/admin/metadata/brands/${brand.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        }, true);
      } else {
        await apiFetch<Brand>('/api/admin/metadata/brands', {
          method: 'POST',
          body: JSON.stringify(payload)
        }, true);
      }

      router.push('/admin/brands');
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Impossible d’enregistrer la marque.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-2xl rounded-[1.75rem] bg-white/80 p-6 shadow-soft">
      {error ? <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-ink">Nom de la marque</span>
          <input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} className={inputClass} placeholder="Ex : Balea" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-ink">Slug URL</span>
          <input value={form.slug} onChange={event => setForm({ ...form, slug: event.target.value })} className={inputClass} placeholder="Auto si vide" />
          <span className="text-xs leading-5 text-ink/50">Optionnel. Utilisé dans les filtres du catalogue.</span>
        </label>

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-cocoa/15 bg-white px-4 py-3">
          <span>
            <span className="block text-sm font-semibold text-ink">Marque active</span>
            <span className="text-xs text-ink/50">Visible dans le catalogue et le formulaire produit.</span>
          </span>
          <input type="checkbox" checked={form.isActive} onChange={event => setForm({ ...form, isActive: event.target.checked })} className="h-5 w-5 accent-cocoa" />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button disabled={isSaving} className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream disabled:opacity-60">
          {isSaving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button type="button" onClick={() => router.push('/admin/brands')} className="rounded-full border border-cocoa/20 px-6 py-3 text-sm font-semibold text-cocoa">
          Annuler
        </button>
      </div>
    </form>
  );
}
