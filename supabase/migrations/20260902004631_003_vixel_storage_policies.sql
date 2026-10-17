/*
# Storage bucket policies for Vixel

## Overview
Sets up RLS policies on the storage.objects table for the 'vixel' bucket.
- Public can upload files (for payment proofs, testimonial photos, etc.)
- Public can read all files (images need to be visible)
- Authenticated (admin) can do everything
*/

-- Allow public to read files in the vixel bucket
DROP POLICY IF EXISTS "Public read vixel bucket" ON storage.objects;
CREATE POLICY "Public read vixel bucket" ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'vixel');

-- Allow public to upload files to the vixel bucket
DROP POLICY IF EXISTS "Public upload vixel bucket" ON storage.objects;
CREATE POLICY "Public upload vixel bucket" ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'vixel');

-- Allow authenticated (admin) to update files in the vixel bucket
DROP POLICY IF EXISTS "Admin update vixel bucket" ON storage.objects;
CREATE POLICY "Admin update vixel bucket" ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'vixel') WITH CHECK (bucket_id = 'vixel');

-- Allow authenticated (admin) to delete files in the vixel bucket
DROP POLICY IF EXISTS "Admin delete vixel bucket" ON storage.objects;
CREATE POLICY "Admin delete vixel bucket" ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'vixel');
