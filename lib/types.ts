export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  stockQuantity: number;
  categoryName: string;
  categorySlug: string;
  brandName?: string | null;
  brandSlug?: string | null;
  primaryImageUrl?: string | null;
  isFeatured: boolean;
};

export type ProductImage = {
  id: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
};

export type ProductSpecification = {
  id: string;
  name: string;
  value: string;
  displayOrder: number;
};

export type ProductDetail = ProductListItem & {
  categoryId?: string;
  brandId?: string | null;
  description: string;
  sku?: string | null;
  status?: string;
  images: ProductImage[];
  specifications: ProductSpecification[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  displayOrder?: number;
  isActive?: boolean;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  isActive?: boolean;
};

export type Metadata = {
  categories: Category[];
  brands: Brand[];
};

export type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  stockQuantity: number;
  status: string;
  categoryName: string;
  brandName?: string | null;
  primaryImageUrl?: string | null;
  isFeatured: boolean;
};

export type OrderListItem = {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: string;
  paymentMethod: string;
  itemCount: number;
  createdAt: string;
};

export type OrderDetail = OrderListItem & {
  deliveryAddress: string;
  customerNote?: string | null;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productSku?: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }>;
};

export type AdminDashboard = {
  orders: {
    pendingCount: number;
    preparingCount: number;
    outForDeliveryCount: number;
    outForDeliveryTotal: number;
    deliveredCount: number;
    deliveredTotal: number;
    cancelledCount: number;
    cancelledTotal: number;
    todayCount: number;
    todayTotal: number;
    totalCount: number;
    totalAmount: number;
  };
  products: {
    totalCount: number;
    publishedCount: number;
    draftCount: number;
    hiddenCount: number;
    outOfStockCount: number;
    lowStockCount: number;
    featuredCount: number;
  };
  recentOrders: OrderListItem[];
};
