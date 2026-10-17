import type { BookingStatus, PaymentStatus, PaymentType, TestimonialStatus } from '@/lib/types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Menunggu Verifikasi DP',
  dp_diverifikasi: 'DP Diverifikasi',
  dikonfirmasi: 'Dikonfirmasi',
  lunas: 'Lunas',
  dibatalkan: 'Dibatalkan',
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  pending: 'bg-warning-100 text-warning-600 border-warning-500/20',
  dp_diverifikasi: 'bg-blue-100 text-blue-700 border-blue-500/20',
  dikonfirmasi: 'bg-success-100 text-success-600 border-success-500/20',
  lunas: 'bg-gold-100 text-gold-700 border-gold-500/20',
  dibatalkan: 'bg-error-100 text-error-600 border-error-500/20',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  menunggu_verifikasi: 'Menunggu Verifikasi',
  diverifikasi: 'Diverifikasi',
  ditolak: 'Ditolak',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  menunggu_verifikasi: 'bg-warning-50 text-warning-600',
  diverifikasi: 'bg-success-50 text-success-600',
  ditolak: 'bg-error-50 text-error-600',
};

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  dp: 'Down Payment (DP)',
  pelunasan: 'Pelunasan',
};

export const TESTIMONIAL_STATUS_LABELS: Record<TestimonialStatus, string> = {
  menunggu_review: 'Menunggu Review',
  disetujui: 'Disetujui',
  ditolak: 'Ditolak',
};

export function calculateDP(price: number, dpPercentage: number): number {
  return Math.round((price * dpPercentage) / 100);
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
