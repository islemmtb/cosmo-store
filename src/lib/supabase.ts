import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_unit: number;
  price_box: number;
  units_per_box: number;
  min_units: number;
  stock: number;
  images: string[];
  category: string;
  brand: string;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  notes: string;
  created_at: string;
};

export type OrderItem = {
  product_id: string;
  product_name: string;
  product_slug: string;
  quantity: number;
  unit_type: 'unite' | 'boite';
  price_per_unit: number;
  subtotal: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
  unit_type: 'unite' | 'boite';
};
