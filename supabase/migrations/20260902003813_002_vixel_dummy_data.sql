/*
# Vixel Wedding Organizer - Dummy Data

## Overview
Inserts sample data for packages, package images, galleries, gallery media, testimonials,
bookings with different statuses, and payments for those bookings.
Also seeds store_settings with default configuration.

## Data Inserted
1. 1 store_settings row (singleton)
2. 3 packages with different tiers
3. 6 package_images (2 per package)
4. 3 galleries (albums)
5. 15 gallery_media items (5 per album)
6. 5 testimonials (all approved)
7. 3 bookings with different statuses (pending, dp_diverifikasi, lunas)
8. 3 payments (one DP per booking)
*/

-- ============ STORE SETTINGS ============
INSERT INTO store_settings (whatsapp_number, email, address, instagram_url, facebook_url, tiktok_url, youtube_url, hero_image_url, bank_name, bank_account_name, bank_account_number, qris_image_url, dp_percentage)
VALUES (
  '6281234567890',
  'info@vixelwedding.com',
  'Jl. Mawar Melati No. 123, Jakarta Selatan, DKI Jakarta 12345',
  'https://instagram.com/vixelwedding',
  'https://facebook.com/vixelwedding',
  'https://tiktok.com/@vixelwedding',
  'https://youtube.com/@vixelwedding',
  'https://images.pexels.com/photos/6028500/pexels-photo-6028500.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600',
  'Bank BCA',
  'Vixel Wedding Organizer',
  '1234567890',
  '',
  30
) ON CONFLICT DO NOTHING;

-- ============ PACKAGES ============
INSERT INTO packages (id, name, description, price_from, video_url, is_active, sort_order, features) VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'Paket Elegance',
    'Paket pernikahan lengkap dengan dekorasi elegan dan katering premium. Cocok untuk couples yang menginginkan acara intim namun berkesan dengan sentuhan mewah di setiap detailnya.',
    35000000,
    '',
    true,
    1,
    ARRAY['Wedding Organizer profesional (2 orang)', 'Dekorasi pelaminan tema elegan', 'Katering untuk 150 tamu', 'Tata cahaya & sound system', 'MC profesional', 'Dokumentasi foto 2 fotografer', 'Makeup bride & makeup bridesmaid', 'Korsage & boutonniere', 'Buku tamu & plang nama']
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'Paket Royal',
    'Paket premium dengan dekorasi mewah, katering lengkap, dan hiburan live music. Sempurna untuk pernikahan grand dengan jumlah tamu lebih banyak dan pengalaman tak terlupakan.',
    75000000,
    '',
    true,
    2,
    ARRAY['Wedding Organizer profesional (4 orang)', 'Dekorasi pelaminan tema royal mewah', 'Katering untuk 300 tamu', 'Live band performance (3 set)', 'Tata cahaya premium & LED screen', 'MC + 2 host profesional', 'Dokumentasi foto 3 fotografer + videografi sinematik', 'Makeup bride + 3 makeup bridesmaid', 'Bunga segar premium untuk dekorasi', 'Korsage & boutonniere premium', 'Guest book digital + photobooth', 'Transportasi bridal party']
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    'Paket Intimate',
    'Paket hemat untuk pernikahan intim dengan dekorasi simpel dan katering sesuai kebutuhan. Ideal untuk couples yang ingin acara kecil yang hangat dan personal.',
    18000000,
    '',
    true,
    3,
    ARRAY['Wedding Organizer (1 orang)', 'Dekorasi pelaminan simpel & cantik', 'Katering untuk 75 tamu', 'Sound system dasar', 'MC profesional', 'Dokumentasi foto 1 fotografer', 'Makeup bride', 'Korsage & boutonniere']
  )
ON CONFLICT (id) DO NOTHING;

-- ============ PACKAGE IMAGES ============
INSERT INTO package_images (package_id, image_url, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'https://images.pexels.com/photos/19024679/pexels-photo-19024679.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 1),
  ('a0000000-0000-0000-0000-000000000001', 'https://images.pexels.com/photos/17315417/pexels-photo-17315417.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 2),
  ('a0000000-0000-0000-0000-000000000002', 'https://images.pexels.com/photos/6028500/pexels-photo-6028500.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 1),
  ('a0000000-0000-0000-0000-000000000002', 'https://images.pexels.com/photos/17001844/pexels-photo-17001844.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 2),
  ('a0000000-0000-0000-0000-000000000003', 'https://images.pexels.com/photos/38583659/pexels-photo-38583659.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 1),
  ('a0000000-0000-0000-0000-000000000003', 'https://images.pexels.com/photos/28613086/pexels-photo-28613086.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 2)
ON CONFLICT DO NOTHING;

-- ============ GALLERIES ============
INSERT INTO galleries (id, title, description, event_date, cover_image_url, sort_order) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Andini & Reza Wedding', 'Pernikahan elegan dengan tema garden party di outdoor venue.', '2025-06-15', 'https://images.pexels.com/photos/37828118/pexels-photo-37828118.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 1),
  ('b0000000-0000-0000-0000-000000000002', 'Salsa & Bagas Grand Celebration', 'Pernikahan mewah dengan dekorasi royal di ballroom hotel berbintang.', '2025-04-22', 'https://images.pexels.com/photos/20499528/pexels-photo-20499528.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 2),
  ('b0000000-0000-0000-0000-000000000003', 'Kania & Dimas Intimate Wedding', 'Pernikahan hangat dan intim dengan dekorasi boho chic.', '2025-08-10', 'https://images.pexels.com/photos/28613086/pexels-photo-28613086.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 3)
ON CONFLICT (id) DO NOTHING;

-- ============ GALLERY MEDIA ============
INSERT INTO gallery_media (gallery_id, media_url, media_type, sort_order) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'https://images.pexels.com/photos/37828118/pexels-photo-37828118.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'photo', 1),
  ('b0000000-0000-0000-0000-000000000001', 'https://images.pexels.com/photos/31517332/pexels-photo-31517332.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'photo', 2),
  ('b0000000-0000-0000-0000-000000000001', 'https://images.pexels.com/photos/38583659/pexels-photo-38583659.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'photo', 3),
  ('b0000000-0000-0000-0000-000000000001', 'https://images.pexels.com/photos/17315420/pexels-photo-17315420.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'photo', 4),
  ('b0000000-0000-0000-0000-000000000001', 'https://images.pexels.com/photos/27008972/pexels-photo-27008972.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'photo', 5),
  ('b0000000-0000-0000-0000-000000000002', 'https://images.pexels.com/photos/20499528/pexels-photo-20499528.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'photo', 1),
  ('b0000000-0000-0000-0000-000000000002', 'https://images.pexels.com/photos/17001844/pexels-photo-17001844.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'photo', 2),
  ('b0000000-0000-0000-0000-000000000002', 'https://images.pexels.com/photos/16120247/pexels-photo-16120247.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'photo', 3),
  ('b0000000-0000-0000-0000-000000000002', 'https://images.pexels.com/photos/17022991/pexels-photo-17022991.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'photo', 4),
  ('b0000000-0000-0000-0000-000000000002', 'https://images.pexels.com/photos/4717555/pexels-photo-4717555.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'photo', 5),
  ('b0000000-0000-0000-0000-000000000003', 'https://images.pexels.com/photos/28613086/pexels-photo-28613086.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'photo', 1),
  ('b0000000-0000-0000-0000-000000000003', 'https://images.pexels.com/photos/20199360/pexels-photo-20199360.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'photo', 2),
  ('b0000000-0000-0000-0000-000000000003', 'https://images.pexels.com/photos/35225227/pexels-photo-35225227.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'photo', 3),
  ('b0000000-0000-0000-0000-000000000003', 'https://images.pexels.com/photos/29502060/pexels-photo-29502060.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'photo', 4),
  ('b0000000-0000-0000-0000-000000000003', 'https://images.pexels.com/photos/32994468/pexels-photo-32994468.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'photo', 5)
ON CONFLICT DO NOTHING;

-- ============ TESTIMONIALS ============
INSERT INTO testimonials (name, content, rating, photo_url, status) VALUES
  ('Ibu Sri Rahayu', 'Tim Vixel sangat profesional dan ramah. Dari awal konsultasi sampai hari H, semua berjalan sempurna. Dekorasinya cantik banget, tamu-tamu saya semua puas. Recommended!', 5, 'https://images.pexels.com/photos/752805/pexels-photo-752805.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'disetujui'),
  ('Pak Hendra Wijaya', 'Pelayanan mantap! Kateringnya enak-enak, dekorasi sesuai ekspektasi. Anak saya sampe nangis bahagia lihat hasilnya. Terima kasih Vixel!', 5, 'https://images.pexels.com/photos/6609708/pexels-photo-6609708.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'disetujui'),
  ('Ibu Dewi Lestari', 'Awalnya ragu karena budget terbatas, tapi paket Intimate ternyata sangat worth it. Hasilnya tidak murahan, elegan, dan rapi. Tim Vixel sabar membantu kami.', 5, 'https://images.pexels.com/photos/16542567/pexels-photo-16542567.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'disetujui'),
  ('Pak Budi Santoso', 'Sistem booking online-nya memudahkan kami. Tinggal pilih tanggal yang kosong, isi form, transfer DP, selesai. Tidak perlu bolak-balik ke kantor. Mantap!', 4, 'https://images.pexels.com/photos/17019886/pexels-photo-17019886.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'disetujui'),
  ('Ibu Rina Marlina', 'Tim Vixel membuat hari pernikahan kami menjadi tak terlupakan. Detail dekorasi sangat diperhatikan, MC-nya entertaining, dan semua tamu betah. Pasti rekomendasi ke teman-teman!', 5, 'https://images.pexels.com/photos/37380420/pexels-photo-37380420.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'disetujui')
ON CONFLICT DO NOTHING;

-- ============ BOOKINGS ============
INSERT INTO bookings (id, groom_name, bride_name, whatsapp_number, package_id, event_date, location, guest_count, notes, status) VALUES
  (
    'c0000000-0000-0000-0000-000000000001',
    'Rangga Pratama',
    'Indah Permata',
    '628123450001',
    'a0000000-0000-0000-0000-000000000001',
    (CURRENT_DATE + INTERVAL '14 days')::date,
    'Ballroom Hotel Grand Hyatt, Jakarta',
    180,
    'Tema garden wedding dengan dominasi warna putih dan gold.',
    'pending'
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'Fajar Nugroho',
    'Sari Melati',
    '628123450002',
    'a0000000-0000-0000-0000-000000000002',
    (CURRENT_DATE + INTERVAL '30 days')::date,
    'Convention Center BSD, Tangerang',
    320,
    'Pernikahan grand dengan live band, LED screen, dan dekorasi royal.',
    'dp_diverifikasi'
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'Andi Kurniawan',
    'Maya Sari',
    '628123450003',
    'a0000000-0000-0000-0000-000000000003',
    (CURRENT_DATE + INTERVAL '7 days')::date,
    'Garden Venue, Bogor',
    80,
    'Pernikahan intim outdoor dengan dekorasi boho chic.',
    'lunas'
  )
ON CONFLICT (id) DO NOTHING;

-- ============ PAYMENTS ============
INSERT INTO payments (booking_id, payment_type, amount, proof_image_url, status) VALUES
  (
    'c0000000-0000-0000-0000-000000000001',
    'dp',
    10500000,
    'https://images.pexels.com/photos/7317745/pexels-photo-7317745.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'menunggu_verifikasi'
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'dp',
    22500000,
    'https://images.pexels.com/photos/7317745/pexels-photo-7317745.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'diverifikasi'
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'dp',
    5400000,
    'https://images.pexels.com/photos/7317745/pexels-photo-7317745.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'diverifikasi'
  )
ON CONFLICT DO NOTHING;

-- Also insert a pelunasan (final payment) for the lunas booking
INSERT INTO payments (booking_id, payment_type, amount, proof_image_url, status) VALUES
  (
    'c0000000-0000-0000-0000-000000000003',
    'pelunasan',
    12600000,
    'https://images.pexels.com/photos/7317745/pexels-photo-7317745.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'diverifikasi'
  )
ON CONFLICT DO NOTHING;
