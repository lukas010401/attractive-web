import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch, mediaUrl, uploadFiles } from '@/lib/api';
import type { Brand, Category, ProductDetail } from '@/lib/types';

type ProductFormProps = {
  product?: ProductDetail | null;
};

type ProductFormState = {
  categoryId: string;
  brandId: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice: string;
  currency: string;
  stockQuantity: number;
  sku: string;
  status: string;
  isFeatured: boolean;
  specificationsText: string;
};

const initialForm: ProductFormState = {
  categoryId: '',
  brandId: '',
  name: '',
  shortDescription: '',
  description: '',
  price: 0,
  compareAtPrice: '',
  currency: 'MGA',
  stockQuantity: 0,
  sku: '',
  status: 'Draft',
  isFeatured: false,
  specificationsText: ''
};

const inputClass = 'w-full rounded-2xl border border-cocoa/15 bg-white px-4 py-3 outline-none focus:border-cocoa';

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {children}
      {help ? <span className="whitespace-pre-line text-xs leading-5 text-ink/50">{help}</span> : null}
    </label>
  );
}

function friendlyError(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  if (!message || message.includes('Microsoft.EntityFrameworkCore') || message.length > 260) {
    return 'Enregistrement impossible. Vérifiez les champs puis réessayez.';
  }

  return message;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState<ProductFormState>(initialForm);

  useEffect(() => {
    apiFetch<{ categories: Category[]; brands: Brand[] }>('/api/admin/metadata', {}, true).then(data => {
      setCategories(data.categories);
      setBrands(data.brands);
      setForm(current => ({ ...current, categoryId: current.categoryId || product?.categoryId || data.categories[0]?.id || '' }));
    });
  }, [product?.categoryId]);

  useEffect(() => {
    if (!product) return;
    setForm({
      categoryId: product.categoryId || '',
      brandId: product.brandId || '',
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice?.toString() || '',
      currency: product.currency,
      stockQuantity: product.stockQuantity,
      sku: product.sku || '',
      status: product.status || 'Draft',
      isFeatured: product.isFeatured,
      specificationsText: product.specifications.map(spec => `${spec.name}: ${spec.value}`).join('\n')
    });
  }, [product]);

  useEffect(() => {
    const previews = files.map(file => URL.createObjectURL(file));
    setFilePreviews(previews);

    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [files]);

  function parseSpecifications() {
    const specs: Array<{ name: string; value: string; displayOrder: number }> = [];
    const lines = form.specificationsText.split('\n');

    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      const separatorIndex = trimmedLine.indexOf(':');
      if (separatorIndex <= 0 || separatorIndex === trimmedLine.length - 1) {
        return { specs: [], error: `La spécification ligne ${index + 1} doit être au format "Nom: valeur".` };
      }

      specs.push({
        name: trimmedLine.slice(0, separatorIndex).trim(),
        value: trimmedLine.slice(separatorIndex + 1).trim(),
        displayOrder: specs.length
      });
    }

    return { specs, error: '' };
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      const parsedSpecifications = parseSpecifications();
      if (parsedSpecifications.error) {
        setError(parsedSpecifications.error);
        return;
      }

      const payload = {
        categoryId: form.categoryId,
        brandId: form.brandId || null,
        name: form.name,
        slug: null,
        shortDescription: form.shortDescription,
        description: form.description,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
        currency: form.currency,
        stockQuantity: Number(form.stockQuantity),
        sku: form.sku || null,
        status: form.status,
        isFeatured: form.isFeatured,
        specifications: parsedSpecifications.specs
      };

      const saved = product
        ? await apiFetch<ProductDetail>(`/api/admin/products/${product.id}`, { method: 'PUT', body: JSON.stringify(payload) }, true)
        : await apiFetch<ProductDetail>('/api/admin/products', { method: 'POST', body: JSON.stringify(payload) }, true);

      if (files.length) await uploadFiles(`/api/admin/products/${saved.id}/images`, files);
      router.push('/admin/products');
    } catch (err) {
      setError(friendlyError(err));
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 rounded-[1.5rem] bg-white/75 p-6 shadow-soft">
      <section className="grid gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink">Informations produit</h2>
          <p className="mt-1 text-sm text-ink/55">Les informations visibles sur le catalogue public.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nom du produit" help="Exemple : Sérum éclat visage">
            <input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} className={inputClass} />
          </Field>
          <Field label="Référence / SKU" help="Optionnel, utile pour identifier le stock.">
            <input value={form.sku} onChange={event => setForm({ ...form, sku: event.target.value })} className={inputClass} />
          </Field>
          <Field label="Catégorie">
            <select required value={form.categoryId} onChange={event => setForm({ ...form, categoryId: event.target.value })} className={inputClass}>
              {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </Field>
          <Field label="Marque">
            <select value={form.brandId} onChange={event => setForm({ ...form, brandId: event.target.value })} className={inputClass}>
              <option value="">Sans marque</option>
              {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
            </select>
          </Field>
        </div>
      </section>

      <section className="grid gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink">Prix et disponibilité</h2>
          <p className="mt-1 text-sm text-ink/55">Prix affiché en Ariary et stock disponible à la commande.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Prix de vente">
            <input type="number" min="0" value={form.price} onChange={event => setForm({ ...form, price: Number(event.target.value) })} className={inputClass} />
          </Field>
          <Field label="Ancien prix" help="Optionnel, pour afficher une promotion.">
            <input type="number" min="0" value={form.compareAtPrice} onChange={event => setForm({ ...form, compareAtPrice: event.target.value })} className={inputClass} />
          </Field>
          <Field label="Devise">
            <input value={form.currency} onChange={event => setForm({ ...form, currency: event.target.value })} className={inputClass} />
          </Field>
          <Field label="Quantité en stock">
            <input type="number" min="0" value={form.stockQuantity} onChange={event => setForm({ ...form, stockQuantity: Number(event.target.value) })} className={inputClass} />
          </Field>
        </div>
      </section>

      <section className="grid gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink">Descriptions</h2>
          <p className="mt-1 text-sm text-ink/55">La description courte apparaît dans les cartes produit.</p>
        </div>
        <Field label="Description courte">
          <input value={form.shortDescription} onChange={event => setForm({ ...form, shortDescription: event.target.value })} className={inputClass} />
        </Field>
        <Field label="Description détaillée">
          <textarea value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} rows={5} className={inputClass} />
        </Field>
      </section>

      <section className="grid gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink">Spécifications</h2>
          <p className="mt-1 text-sm text-ink/55">Une spécification par ligne, au format nom : valeur.</p>
        </div>
        <Field label="Liste des spécifications" help={'Exemple :\nContenance: 50 ml\nType de peau: Tous types'}>
          <textarea
            value={form.specificationsText}
            onChange={event => setForm({ ...form, specificationsText: event.target.value })}
            rows={5}
            placeholder={'Contenance: 50 ml\nType de peau: Tous types\nTexture: Gel'}
            className={inputClass}
          />
        </Field>
      </section>

      <section className="grid gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink">Publication et images</h2>
          <p className="mt-1 text-sm text-ink/55">Publie le produit quand il doit apparaître dans le catalogue.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Statut du produit">
            <select value={form.status} onChange={event => setForm({ ...form, status: event.target.value })} className={inputClass}>
              <option value="Draft">Brouillon</option>
              <option value="Published">Publié</option>
              <option value="Hidden">Masqué</option>
              <option value="OutOfStock">Rupture de stock</option>
            </select>
          </Field>
          <Field label="Mise en avant">
            <span className="flex min-h-[50px] items-center gap-3 rounded-2xl border border-cocoa/15 bg-white px-4 py-3">
              <input type="checkbox" checked={form.isFeatured} onChange={event => setForm({ ...form, isFeatured: event.target.checked })} />
              Afficher sur l’accueil
            </span>
          </Field>
        </div>
        <Field label="Images produit" help={files.length ? `${files.length} fichier(s) sélectionné(s)` : 'JPG, PNG ou WEBP. Plusieurs images possibles.'}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={event => setFiles(Array.from(event.target.files || []))}
            className="block w-full min-w-0 rounded-2xl border border-cocoa/15 bg-white px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cream"
          />
        </Field>
        {(product?.images?.length || filePreviews.length) ? (
          <div className="grid gap-4">
            {product?.images?.length ? (
              <div>
                <h3 className="text-sm font-semibold text-ink">Images enregistrées</h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {product.images.map(image => (
                    <div key={image.id} className="overflow-hidden rounded-2xl border border-cocoa/10 bg-sand">
                      <div className="relative h-32 w-full">
                        <img src={mediaUrl(image.url)} alt="Produit" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                      </div>
                      {image.isPrimary ? <div className="bg-cocoa px-3 py-1 text-xs font-semibold text-white">Image principale</div> : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {filePreviews.length ? (
              <div>
                <h3 className="text-sm font-semibold text-ink">Nouvelles images sélectionnées</h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {filePreviews.map((preview, index) => (
                    <div key={preview} className="overflow-hidden rounded-2xl border border-cocoa/10 bg-sand">
                      <img src={preview} alt={files[index]?.name || 'Image sélectionnée'} className="h-32 w-full object-cover" />
                      <div className="truncate px-3 py-2 text-xs text-ink/60">{files[index]?.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <button className="w-fit rounded-full bg-ink px-7 py-3 text-sm font-semibold text-cream">Enregistrer le produit</button>
    </form>
  );
}
