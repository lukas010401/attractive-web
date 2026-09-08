import { AdminGuard } from '@/components/AdminGuard';
import { AdminShell } from '@/components/AdminShell';
import { BrandForm } from '@/components/BrandForm';

export default function NewBrandPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <h1 className="mb-6 font-display text-4xl">Nouvelle marque</h1>
        <BrandForm />
      </AdminShell>
    </AdminGuard>
  );
}
