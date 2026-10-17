export type BookingStatus = 'pending' | 'dp_diverifikasi' | 'dikonfirmasi' | 'lunas' | 'dibatalkan';
export type PaymentType = 'dp' | 'pelunasan';
export type PaymentStatus = 'menunggu_verifikasi' | 'diverifikasi' | 'ditolak';
export type TestimonialStatus = 'menunggu_review' | 'disetujui' | 'ditolak';

export interface Package {
  id: string;
  name: string;
  description: string;
  price_from: number;
  video_url: string | null;
  is_active: boolean;
  sort_order: number;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface PackageImage {
  id: string;
  package_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface PackageWithImages extends Package {
  package_images: PackageImage[];
}

export interface Booking {
  id: string;
  groom_name: string;
  bride_name: string;
  whatsapp_number: string;
  package_id: string | null;
  event_date: string;
  location: string;
  guest_count: number;
  notes: string;
  status: BookingStatus;
  admin_notes: string;
  created_at: string;
  updated_at: string;
  packages?: Package | null;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  booking_id: string;
  payment_type: PaymentType;
  amount: number;
  proof_image_url: string;
  status: PaymentStatus;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Gallery {
  id: string;
  title: string;
  description: string;
  event_date: string | null;
  cover_image_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryMedia {
  id: string;
  gallery_id: string;
  media_url: string;
  media_type: 'photo' | 'video';
  sort_order: number;
  created_at: string;
}

export interface GalleryWithMedia extends Gallery {
  gallery_media: GalleryMedia[];
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  photo_url: string;
  status: TestimonialStatus;
  created_at: string;
  updated_at: string;
}

export interface StoreSettings {
  id: string;
  whatsapp_number: string;
  email: string;
  address: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  youtube_url: string;
  hero_image_url: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  qris_image_url: string;
  dp_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface BookingDateInfo {
  event_date: string;
  status_summary: string;
  is_locked: boolean;
}
