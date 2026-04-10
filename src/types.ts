// Shared TypeScript types for SIE Yosakoi Shop

export interface Batch {
  id: string;
  name: string;
  status: 'draft' | 'open' | 'closed';
  open_at: number | null;
  close_at: number | null;
  created_at: number;
}

export interface VariantsConfig {
  type: 'color_size';
  colors: Array<{ name: string; slug: string; label: string; images: string[] }>;
  sizes: string[];
  base_price: number;
  price_overrides: Record<string, number>;
  size_chart_image?: string;
}

export interface Product {
  id: string;
  batch_id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  images: string[];
  has_variants: boolean;
  variants_config: VariantsConfig | null;
  active: boolean;
  sort_order: number;
}

export interface OrderItem {
  product_id: string;
  name: string;
  color?: string;
  color_slug?: string;
  size?: string;
  qty: number;
  unit_price: number;
}

export interface CartItem extends OrderItem {
  total_price: number;
}

export type DeliveryMethod =
  | 'pickup_practice'
  | 'pickup_festival_sat'
  | 'pickup_festival_sun'
  | 'ship_after_27apr';

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'done' | 'cancelled';
export type PaymentStatus = 'awaiting' | 'verified' | 'refunded';

export interface Order {
  id: string;
  batch_id: string;
  customer_name: string;
  phone: string;
  delivery_method: DeliveryMethod;
  address: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  notes: string | null;
  email: string | null;
  facebook_url: string | null;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  created_at: number;
}

export interface DashboardStats {
  total_orders: number;
  confirmed_orders: number;
  pending_payment: number;
  total_revenue: number;
  pending_revenue: number;
}

export interface CreateOrderInput {
  batch_id: string;
  customer_name: string;
  phone: string;
  delivery_method: DeliveryMethod;
  address: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  notes: string | null;
  email: string;
  facebook_url: string | null;
}

export interface SalesSummaryRow {
  product_name: string;
  color: string | null;
  size: string | null;
  total_qty: number;
  verified_qty: number;
  awaiting_qty: number;
  cancelled_qty: number;
}

export interface OrderFilters {
  batch_id?: string;
  order_status?: string;
  payment_status?: string;
  page?: number;
}
