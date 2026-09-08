import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '@/lib/auth';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/admin/login');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return <div className="p-8 text-sm text-ink/60">Chargement...</div>;
  return <>{children}</>;
}
