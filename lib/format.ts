export function formatPrice(value: number, currency = 'MGA') {
  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(value);
}
