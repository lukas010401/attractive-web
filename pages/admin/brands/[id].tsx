import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/AdminGuard';
import { AdminShell } from '@/components/AdminShell';
import { BrandForm } from '@/components/BrandForm';
import { apiFetch } from '@/lib/api';
import type { Brand, Metadata } from '@/lib/types';

export default function EditBrandPage() {
  const router = useRouter();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!router.query.id) return;
    const brandId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    apiFetch<Metadata>('/api/admin/metadata', {}, true)
      .then(metadata => {
        const foundBrand = metadata.brands.find(item => item.id === brandId);
        if (foundBrand) {
          setBrand(foundBrand);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true));
  }, [router.query.id]);

  return (
    <AdminGuard>
      <AdminShell>
        <h1 className="mb-6 font-display text-4xl">Modifier marque</h1>
        {notFound ? (
          <div className="rounded-[1.5rem] bg-white/80 p-6 text-ink/60 shadow-soft">Marque introuvable.</div>
        ) : !brand ? (
          <div className="rounded-[1.5rem] bg-white/80 p-6 text-ink/60 shadow-soft">Chargement...</div>
        ) : (
          <BrandForm brand={brand} />
        )}
      </AdminShell>
    </AdminGuard>
  );
}
