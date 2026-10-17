/*
# Vixel Wedding Organizer - Complete Database Schema

## Overview
Full schema for a wedding organizer booking platform with public frontend and admin dashboard.

## New Tables
1. `store_settings` - Singleton table for site-wide configuration (WhatsApp number, address, social media, bank accounts, QRIS, DP percentage)
2. `packages` - Wedding service packages with name, description, starting price, video URL, active status
3. `package_images` - Photo gallery per package (multiple images per package)
4. `bookings` - Customer booking records with couple names, WhatsApp, package, event date, location, guest count, notes, status
5. `payments` - Payment records per booking (DP or pelunasan/final payment), amount, proof of transfer, verification status
6. `galleries` - Album grouping for event documentation
7. `gallery_media` - Photos/videos per gallery album
8. `testimonials` - Customer testimonials with name, content, rating, photo, approval status

## Security (RLS)
- `store_settings`: Public read, admin-only write
- `packages`: Public read (active only), admin write
- `package_images`: Public read, admin write
- `bookings`: Public insert (new bookings), admin-only read/update/delete. Public can check date availability via a view.
- `payments`: Public insert (upload proof), admin-only read/update/delete
- `galleries`: Public read, admin write
- `gallery_media`: Public read, admin write
- `testimonials`: Public read (approved only) + public insert, admin update/delete

## Booking Status Flow
pending → dp_diverifikasi → dikonfirmasi → lunas
                ↓
           dibatalkan (cancelled at any stage)

## Date Availability
A security definer view `booking_dates` exposes only dates and their booking status to the public,
without leaking customer details. Dates with status pending/dp_diverifikasi/dikonfirmasi/lunas are locked.
*/

-- ============ STORE SETTINGS ============
CREATE TABLE IF NOT EXISTS store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number text NOT NULL DEFAULT '6281234567890',
  email text NOT NULL DEFAULT 'info@vixelwedding.com',
  address text NOT NULL DEFAULT 'Jl. Mawar No. 123, Jakarta Selatan, DKI Jakarta',
  instagram_url text NOT NULL DEFAULT 'https://instagram.com/vixelwedding',
  facebook_url text NOT NULL DEFAULT 'https://facebook.com/vixelwedding',
  tiktok_url text NOT NULL DEFAULT 'https://tiktok.com/@vixelwedding',
  youtube_url text NOT NULL DEFAULT 'https://youtube.com/@vixelwedding',
  hero_image_url text NOT NULL DEFAULT '',
  bank_name text NOT NULL DEFAULT 'Bank BCA',
  bank_account_name text NOT NULL DEFAULT 'Vixel Wedding Organizer',
  bank_account_number text NOT NULL DEFAULT '1234567890',
  qris_image_url text NOT NULL DEFAULT '',
  dp_percentage integer NOT NULL DEFAULT 30,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_store_settings" ON store_settings;
CREATE POLICY "public_read_store_settings" ON store_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_store_settings" ON store_settings;
CREATE POLICY "admin_update_store_settings" ON store_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============ PACKAGES ============
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price_from bigint NOT NULL DEFAULT 0,
  video_url text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  features text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_packages" ON packages;
CREATE POLICY "public_read_packages" ON packages FOR SELECT
  TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "admin_read_all_packages" ON packages;
CREATE POLICY "admin_read_all_packages" ON packages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_packages" ON packages;
CREATE POLICY "admin_insert_packages" ON packages FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_packages" ON packages;
CREATE POLICY "admin_update_packages" ON packages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_packages" ON packages;
CREATE POLICY "admin_delete_packages" ON packages FOR DELETE
  TO authenticated USING (true);

-- ============ PACKAGE IMAGES ============
CREATE TABLE IF NOT EXISTS package_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE package_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_package_images" ON package_images;
CREATE POLICY "public_read_package_images" ON package_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_package_images" ON package_images;
CREATE POLICY "admin_insert_package_images" ON package_images FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_package_images" ON package_images;
CREATE POLICY "admin_update_package_images" ON package_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_package_images" ON package_images;
CREATE POLICY "admin_delete_package_images" ON package_images FOR DELETE
  TO authenticated USING (true);

-- ============ BOOKINGS ============
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  groom_name text NOT NULL,
  bride_name text NOT NULL,
  whatsapp_number text NOT NULL,
  package_id uuid REFERENCES packages(id) ON DELETE SET NULL,
  event_date date NOT NULL,
  location text NOT NULL DEFAULT '',
  guest_count integer NOT NULL DEFAULT 0,
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  admin_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

DROP POLICY IF EXISTS "public_insert_bookings" ON bookings;
CREATE POLICY "public_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_bookings" ON bookings;
CREATE POLICY "admin_read_bookings" ON bookings FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_bookings" ON bookings;
CREATE POLICY "admin_update_bookings" ON bookings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_bookings" ON bookings;
CREATE POLICY "admin_delete_bookings" ON bookings FOR DELETE
  TO authenticated USING (true);

-- ============ PAYMENTS ============
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  payment_type text NOT NULL DEFAULT 'dp',
  amount bigint NOT NULL DEFAULT 0,
  proof_image_url text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'menunggu_verifikasi',
  verified_by uuid REFERENCES auth.users(id),
  verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

DROP POLICY IF EXISTS "public_insert_payments" ON payments;
CREATE POLICY "public_insert_payments" ON payments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_payments" ON payments;
CREATE POLICY "admin_read_payments" ON payments FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_payments" ON payments;
CREATE POLICY "admin_update_payments" ON payments FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_payments" ON payments;
CREATE POLICY "admin_delete_payments" ON payments FOR DELETE
  TO authenticated USING (true);

-- ============ GALLERIES ============
CREATE TABLE IF NOT EXISTS galleries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  event_date date,
  cover_image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_galleries" ON galleries;
CREATE POLICY "public_read_galleries" ON galleries FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_galleries" ON galleries;
CREATE POLICY "admin_insert_galleries" ON galleries FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_galleries" ON galleries;
CREATE POLICY "admin_update_galleries" ON galleries FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_galleries" ON galleries;
CREATE POLICY "admin_delete_galleries" ON galleries FOR DELETE
  TO authenticated USING (true);

-- ============ GALLERY MEDIA ============
CREATE TABLE IF NOT EXISTS gallery_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id uuid NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  media_url text NOT NULL,
  media_type text NOT NULL DEFAULT 'photo',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery_media" ON gallery_media;
CREATE POLICY "public_read_gallery_media" ON gallery_media FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_gallery_media" ON gallery_media;
CREATE POLICY "admin_insert_gallery_media" ON gallery_media FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_gallery_media" ON gallery_media;
CREATE POLICY "admin_update_gallery_media" ON gallery_media FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_gallery_media" ON gallery_media;
CREATE POLICY "admin_delete_gallery_media" ON gallery_media FOR DELETE
  TO authenticated USING (true);

-- ============ TESTIMONIALS ============
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  content text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  photo_url text DEFAULT '',
  status text NOT NULL DEFAULT 'menunggu_review',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);

DROP POLICY IF EXISTS "public_read_approved_testimonials" ON testimonials;
CREATE POLICY "public_read_approved_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (status = 'disetujui');

DROP POLICY IF EXISTS "public_insert_testimonials" ON testimonials;
CREATE POLICY "public_insert_testimonials" ON testimonials FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_all_testimonials" ON testimonials;
CREATE POLICY "admin_read_all_testimonials" ON testimonials FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_testimonials" ON testimonials;
CREATE POLICY "admin_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_testimonials" ON testimonials;
CREATE POLICY "admin_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

-- ============ BOOKING DATES VIEW (Public, no customer details) ============
-- SECURITY DEFINER so the public can check date availability without seeing booking details
CREATE OR REPLACE VIEW booking_dates AS
SELECT
  event_date,
  string_agg(DISTINCT status, ',') AS status_summary,
  bool_or(status IN ('pending', 'dp_diverifikasi', 'dikonfirmasi', 'lunas')) AS is_locked
FROM bookings
GROUP BY event_date;

ALTER VIEW booking_dates OWNER TO postgres;
GRANT SELECT ON booking_dates TO anon, authenticated;

-- ============ UPDATED_AT TRIGGER ============
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_store_settings_updated ON store_settings;
CREATE TRIGGER trg_store_settings_updated BEFORE UPDATE ON store_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_packages_updated ON packages;
CREATE TRIGGER trg_packages_updated BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_bookings_updated ON bookings;
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_payments_updated ON payments;
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_galleries_updated ON galleries;
CREATE TRIGGER trg_galleries_updated BEFORE UPDATE ON galleries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_testimonials_updated ON testimonials;
CREATE TRIGGER trg_testimonials_updated BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
