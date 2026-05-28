-- ============================================================
-- HR WEAR — Schéma Supabase
-- À exécuter dans l'éditeur SQL de votre projet Supabase
-- ============================================================

-- Products
CREATE TABLE products (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  price         INTEGER NOT NULL,
  original_price INTEGER,
  stock         INTEGER DEFAULT 0,
  images        TEXT[] DEFAULT '{}',
  is_active     BOOLEAN DEFAULT true,
  is_featured   BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number    SERIAL,
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  wilaya_id       INTEGER NOT NULL,
  wilaya_name     TEXT NOT NULL,
  address         TEXT NOT NULL,
  delivery_cost   INTEGER NOT NULL,
  subtotal        INTEGER NOT NULL,
  total           INTEGER NOT NULL,
  status          TEXT DEFAULT 'pending',
  tracking_number TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE order_items (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id      UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name  TEXT NOT NULL,
  product_price INTEGER NOT NULL,
  quantity      INTEGER NOT NULL
);

-- Function: decrease stock on order
CREATE OR REPLACE FUNCTION decrement_stock(p_id UUID, qty INTEGER)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  UPDATE products SET stock = GREATEST(0, stock - qty) WHERE id = p_id;
END;
$$;

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products: lecture publique, écriture admin seulement
CREATE POLICY "products_public_read"
  ON products FOR SELECT USING (is_active = true);

CREATE POLICY "products_admin_all"
  ON products FOR ALL USING (auth.role() = 'authenticated');

-- Orders: insertion publique (passage de commande), lecture/modification admin
CREATE POLICY "orders_public_insert"
  ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_admin_all"
  ON orders FOR ALL USING (auth.role() = 'authenticated');

-- Order items: insertion publique, lecture admin
CREATE POLICY "order_items_public_insert"
  ON order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "order_items_admin_all"
  ON order_items FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Données de test (optionnel)
-- ============================================================

INSERT INTO products (name, slug, description, price, original_price, stock, is_active, is_featured)
VALUES
  ('Snapback Premium', 'snapback-premium', 'Casquette snapback ajustable de haute qualité.', 2500, NULL, 20, true, true),
  ('Vintage Dad Cap', 'vintage-dad-cap', 'Dad cap vintage au style intemporel.', 1800, 2200, 15, true, true),
  ('Fitted Classic', 'fitted-classic', 'Casquette fitted taille unique, look classique.', 3000, NULL, 8, true, true),
  ('Trucker Stone', 'trucker-stone', 'Trucker cap coloris stone, filet respirant.', 2200, NULL, 12, true, true);
