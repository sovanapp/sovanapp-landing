/*
  # Phase 1 MVP Schema — Artists, Tracks, Orders
  
  1. New Tables
    - `artists` — artist profiles linked to Supabase Auth
    - `tracks` — music products (digital + physical)
    - `orders` — purchases with download tokens
  
  2. Security
    - Artists can CRUD their own profiles and tracks
    - Anyone (anon) can read published tracks
    - Orders: anon INSERT (guest checkout), artist can SELECT own orders
*/

-- Artists table (linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  bio text DEFAULT '',
  photo_url text,
  location text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Tracks/products table
CREATE TABLE IF NOT EXISTS tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  title text NOT NULL,
  genre text DEFAULT '',
  description text DEFAULT '',
  cover_art_url text,
  audio_mp3_url text,
  audio_flac_url text,
  price_myr integer NOT NULL, -- price in sen (e.g., 1000 = RM10.00)
  is_physical boolean DEFAULT false,
  physical_type text, -- 'cassette', 'vinyl', 'cd', or null
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Orders table
-- hitpay_payment_id is UNIQUE — ensures webhook idempotency.
-- HitPay retries webhooks on timeout; the edge function must no-op
-- if the payment_id already has status = 'paid'.
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL REFERENCES tracks(id) ON DELETE SET NULL,
  buyer_email text NOT NULL,
  amount_myr integer NOT NULL, -- price in sen (e.g., 1000 = RM10.00)
  status text DEFAULT 'pending', -- 'pending', 'paid', 'shipped', 'completed'
  hitpay_payment_id text UNIQUE,
  shipping_address text,
  download_token text UNIQUE DEFAULT gen_random_uuid()::text,
  download_expires_at timestamptz DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Artists: owner can read/write, public can read
CREATE POLICY "Artists can manage own profile"
  ON artists
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view artist profiles"
  ON artists
  FOR SELECT
  TO public
  USING (true);

-- Tracks: owner can manage, public can read published
CREATE POLICY "Artists can manage own tracks"
  ON tracks
  FOR ALL
  TO authenticated
  USING (artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can view published tracks"
  ON tracks
  FOR SELECT
  TO public
  USING (is_published = true);

-- Orders: anon can INSERT (guest checkout), anon CANNOT read (buyer emails).
-- Artist can SELECT + UPDATE their own orders (view sales, mark shipped).
CREATE POLICY "Anyone can create an order"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- IMPORTANT: No public SELECT on orders. Buyer emails must not leak.
-- Kasetape's static site only reads from tracks table.

CREATE POLICY "Artists can view own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (track_id IN (
    SELECT t.id FROM tracks t
    JOIN artists a ON t.artist_id = a.id
    WHERE a.user_id = auth.uid()
  ));

CREATE POLICY "Artists can update own orders (mark shipped)"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (track_id IN (
    SELECT t.id FROM tracks t
    JOIN artists a ON t.artist_id = a.id
    WHERE a.user_id = auth.uid()
  ))
  WITH CHECK (status IN ('shipped', 'completed'));
