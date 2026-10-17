-- Fix booking_dates view to use SECURITY INVOKER so RLS policies on bookings are respected
ALTER VIEW public.booking_dates SET (security_invoker = true);

-- Add SELECT policy for anon on bookings so the public booking calendar works
CREATE POLICY "public_read_bookings" ON public.bookings
  FOR SELECT TO anon, authenticated USING (true);

-- Add INSERT policy for store_settings (needed if admin creates new settings)
CREATE POLICY "admin_insert_store_settings" ON public.store_settings
  FOR INSERT TO authenticated WITH CHECK (true);
