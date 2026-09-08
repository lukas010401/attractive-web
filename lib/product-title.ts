export function productDisplayName(product: { name: string; brandName?: string | null }) {
  return product.brandName ? `${product.brandName} - ${product.name}` : product.name;
}
