import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/AdminGuard';
import { AdminShell } from '@/components/AdminShell';
import { ProductForm } from '@/components/ProductForm';
import { apiFetch } from '@/lib/api';
import type { ProductDetail } from '@/lib/types';

export default function EditProductPage() {
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);

  useEffect(() => {
    if (!router.query.id) return;
    apiFetch<ProductDetail>(`/api/admin/products/${router.query.id}`, {}, true).then(setProduct);
  }, [router.query.id]);

  return (
    <AdminGuard>
      <AdminShell>
        <h1 className="mb-6 font-display text-4xl">Modifier produit</h1>
        <ProductForm product={product} />
      </AdminShell>
    </AdminGuard>
  );
}
