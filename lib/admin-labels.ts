export const orderStatuses = ['New', 'Confirmed', 'Preparing', 'OutForDelivery', 'Delivered', 'Cancelled'] as const;
export const productStatuses = ['Draft', 'Published', 'Hidden', 'OutOfStock'] as const;

export function orderStatusLabel(status: string) {
  const labels: Record<string, string> = {
    New: 'Nouvelle',
    Confirmed: 'Confirmée',
    Preparing: 'En préparation',
    OutForDelivery: 'En livraison',
    Delivered: 'Livrée',
    Cancelled: 'Annulée'
  };
  return labels[status] || status;
}

export function productStatusLabel(status: string) {
  const labels: Record<string, string> = {
    Draft: 'Brouillon',
    Published: 'Publié',
    Hidden: 'Masqué',
    OutOfStock: 'Rupture'
  };
  return labels[status] || status;
}

export function statusBadgeClass(status: string) {
  const classes: Record<string, string> = {
    New: 'bg-blue-50 text-blue-700 border-blue-200',
    Confirmed: 'bg-violet-50 text-violet-700 border-violet-200',
    Preparing: 'bg-amber-50 text-amber-800 border-amber-200',
    OutForDelivery: 'bg-orange-50 text-orange-700 border-orange-200',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
    Draft: 'bg-slate-50 text-slate-700 border-slate-200',
    Published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Hidden: 'bg-zinc-50 text-zinc-700 border-zinc-200',
    OutOfStock: 'bg-red-50 text-red-700 border-red-200'
  };
  return classes[status] || 'bg-sand text-cocoa border-cocoa/20';
}
