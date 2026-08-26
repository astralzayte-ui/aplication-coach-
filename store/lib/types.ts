export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  image_url: string;
  supplier_url: string;
  supplier_name?: string;
  stock: number;
  sizes: string[];
  colors: string[];
  featured: number;
  active: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal: string;
  shipping_country: string;
  items: CartItem[];
  total: number;
  status: string;
  payment_status: string;
  payment_intent?: string;
  fulfillment_status: string;
  fulfillment_log: string[];
  created_at: string;
  updated_at: string;
}

export type Category = 'all' | 'sneakers' | 'bags' | 't-shirts' | 'hoodies' | 'pants';
