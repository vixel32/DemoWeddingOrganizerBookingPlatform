import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { StoreSettings, Package, PackageImage, Gallery, GalleryMedia, Testimonial, BookingDateInfo } from '@/lib/types';

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('store_settings')
      .select('*')
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setSettings(data as StoreSettings);
        setLoading(false);
      });
  }, []);

  return { settings, loading };
}

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('packages')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setPackages(data as Package[]);
        setLoading(false);
      });
  }, []);

  return { packages, loading };
}

export function usePackageWithImages(packageId: string | undefined) {
  const [pkg, setPkg] = useState<Package | null>(null);
  const [images, setImages] = useState<PackageImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!packageId) {
      setLoading(false);
      return;
    }
    Promise.all([
      supabase.from('packages').select('*').eq('id', packageId).maybeSingle(),
      supabase.from('package_images').select('*').eq('package_id', packageId).order('sort_order', { ascending: true }),
    ]).then(([pkgRes, imgRes]) => {
      if (pkgRes.data) setPkg(pkgRes.data as Package);
      if (imgRes.data) setImages(imgRes.data as PackageImage[]);
      setLoading(false);
    });
  }, [packageId]);

  return { pkg, images, loading };
}

export function useGalleries() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('galleries')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setGalleries(data as Gallery[]);
        setLoading(false);
      });
  }, []);

  return { galleries, loading };
}

export function useGalleryMedia(galleryId: string | undefined) {
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!galleryId) {
      setLoading(false);
      return;
    }
    supabase
      .from('gallery_media')
      .select('*')
      .eq('gallery_id', galleryId)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setMedia(data as GalleryMedia[]);
        setLoading(false);
      });
  }, [galleryId]);

  return { media, loading };
}

export function useApprovedTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'disetujui')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setTestimonials(data as Testimonial[]);
        setLoading(false);
      });
  }, []);

  return { testimonials, loading };
}

export function useBookingDates() {
  const [lockedDates, setLockedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('booking_dates')
      .select('*')
      .then(({ data, error }) => {
        if (!error && data) {
          const locked = new Set<string>();
          (data as BookingDateInfo[]).forEach((d) => {
            if (d.is_locked) locked.add(d.event_date);
          });
          setLockedDates(locked);
        }
        setLoading(false);
      });
  }, []);

  return { lockedDates, loading };
}
