export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  wilaya_id: number;
  wilaya_name: string;
  address: string;
  delivery_cost: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_price: number;
  quantity: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
