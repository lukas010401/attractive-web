import { AdminGuard } from '@/components/AdminGuard';
import { AdminShell } from '@/components/AdminShell';
import { ProductForm } from '@/components/ProductForm';

export default function NewProductPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <h1 className="mb-6 font-display text-4xl">Nouveau produit</h1>
        <ProductForm />
      </AdminShell>
    </AdminGuard>
  );
}
