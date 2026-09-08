export function productStockLabel(stockQuantity: number) {
  if (stockQuantity <= 0) return 'Rupture';
  if (stockQuantity <= 2) return `Plus que ${stockQuantity} en stock`;
  return 'Disponible';
}

export function isLowStock(stockQuantity: number) {
  return stockQuantity > 0 && stockQuantity <= 2;
}
