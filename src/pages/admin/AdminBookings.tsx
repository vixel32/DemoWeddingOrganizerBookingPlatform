import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Lock, Check, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDate, formatCurrency, BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS, PAYMENT_STATUS_LABELS, PAYMENT_TYPE_LABELS } from '@/lib/utils';
import type { Booking, Package, Payment, BookingStatus } from '@/lib/types';

const MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const DAY_NAMES = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];

function toDateStr(d: Date) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [bookingDates, setBookingDates] = useState<Map<string, Booking[]>>(new Map());

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('*, packages(*), payments(*)')
      .order('event_date', { ascending: true });
    if (data) {
      const bks = data as Booking[];
      setBookings(bks);
      const dateMap = new Map<string, Booking[]>();
      bks.forEach((b) => {
        const arr = dateMap.get(b.event_date) || [];
        arr.push(b);
        dateMap.set(b.event_date, arr);
      });
      setBookingDates(dateMap);
    }
    setLoading(false);
  }

  const daysInMonth = (() => {
    const first = new Date(calYear, calMonth, 1);
    const last = new Date(calYear, calMonth + 1, 0);
    const startWd = first.getDay();
    const total = last.getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWd; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(new Date(calYear, calMonth, d));
    return cells;
  })();

  const goPrev = () => { if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); } else setCalMonth(m => m - 1); };
  const goNext = () => { if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); } else setCalMonth(m => m + 1); };

  async function updateStatus(bookingId: string, status: BookingStatus) {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
      setSelectedBooking(prev => prev ? { ...prev, status } : null);
      loadBookings();
    }
  }

  async function verifyPayment(paymentId: string, status: 'diverifikasi' | 'ditolak') {
    const { error } = await supabase.from('payments').update({ status, verified_at: new Date().toISOString() }).eq('id', paymentId);
    if (!error) {
      loadBookings();
    }
  }

  async function updateAdminNotes(bookingId: string, notes: string) {
    const { error } = await supabase.from('bookings').update({ admin_notes: notes }).eq('id', bookingId);
    if (!error) {
      setSelectedBooking(prev => prev ? { ...prev, admin_notes: notes } : null);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink-900 mb-1">Booking & Kalender</h1>
        <p className="text-sm text-ink-500">Kelola semua booking dan verifikasi pembayaran.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-ink-100 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={goPrev} className="flex items-center justify-center w-9 h-9 rounded-full border border-ink-200 text-ink-600 hover:bg-gold-50 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="font-serif text-lg text-ink-900">{MONTH_NAMES[calMonth]} {calYear}</h3>
              <button onClick={goNext} className="flex items-center justify-center w-9 h-9 rounded-full border border-ink-200 text-ink-600 hover:bg-gold-50 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAY_NAMES.map(d => <div key={d} className="text-center text-xs text-ink-400 py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((date, idx) => {
                if (!date) return <div key={idx} />;
                const dateStr = toDateStr(date);
                const dayBookings = bookingDates.get(dateStr) || [];
                const hasBookings = dayBookings.length > 0;
                return (
                  <button
                    key={idx}
                    onClick={() => hasBookings && setSelectedBooking(dayBookings[0])}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-all relative
                      ${hasBookings ? 'bg-gold-50 text-gold-700 hover:bg-gold-100 cursor-pointer' : 'text-ink-400'}
                    `}
                  >
                    {date.getDate()}
                    {hasBookings && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-gold-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="lg:col-span-3">
          <div className="card p-5">
            <h2 className="font-serif text-lg text-ink-900 mb-4">Semua Booking ({bookings.length})</h2>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-6 h-6 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : bookings.length === 0 ? (
              <p className="text-center text-ink-400 py-10">Belum ada booking.</p>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {bookings.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className="w-full text-left p-3 rounded-xl border border-ink-100 hover:border-gold-300 hover:bg-gold-50/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-ink-800">{b.groom_name} & {b.bride_name}</p>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium border ${BOOKING_STATUS_COLORS[b.status]}`}>
                        {BOOKING_STATUS_LABELS[b.status]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-ink-400">
                      <span>{formatDate(b.event_date)}</span>
                      <span>{b.packages?.name || '-'}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-ink-900/60 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-ink-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-serif text-xl text-ink-900">Detail Booking</h2>
              <button onClick={() => setSelectedBooking(null)} className="p-2 rounded-lg text-ink-400 hover:bg-ink-50">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Couple Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-ink-400 mb-1">Mempelai Pria</p>
                  <p className="text-sm font-medium text-ink-800">{selectedBooking.groom_name}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400 mb-1">Mempelai Wanita</p>
                  <p className="text-sm font-medium text-ink-800">{selectedBooking.bride_name}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400 mb-1">WhatsApp</p>
                  <p className="text-sm font-medium text-ink-800">{selectedBooking.whatsapp_number}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400 mb-1">Tanggal Acara</p>
                  <p className="text-sm font-medium text-ink-800">{formatDate(selectedBooking.event_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400 mb-1">Paket</p>
                  <p className="text-sm font-medium text-ink-800">{selectedBooking.packages?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400 mb-1">Harga Paket</p>
                  <p className="text-sm font-medium text-ink-800">{selectedBooking.packages ? formatCurrency(selectedBooking.packages.price_from) : '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400 mb-1">Lokasi</p>
                  <p className="text-sm font-medium text-ink-800">{selectedBooking.location}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400 mb-1">Jumlah Tamu</p>
                  <p className="text-sm font-medium text-ink-800">{selectedBooking.guest_count} orang</p>
                </div>
              </div>
              {selectedBooking.notes && (
                <div>
                  <p className="text-xs text-ink-400 mb-1">Catatan Klien</p>
                  <p className="text-sm text-ink-600 bg-ink-50 rounded-xl p-3">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Payments */}
              <div>
                <h3 className="text-sm font-medium text-ink-800 mb-3">Riwayat Pembayaran</h3>
                {selectedBooking.payments && selectedBooking.payments.length > 0 ? (
                  <div className="space-y-3">
                    {selectedBooking.payments.map((p: Payment) => (
                      <div key={p.id} className="border border-ink-100 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-ink-800">{PAYMENT_TYPE_LABELS[p.payment_type]}</span>
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                            p.status === 'diverifikasi' ? 'bg-success-50 text-success-600' :
                            p.status === 'ditolak' ? 'bg-error-50 text-error-600' :
                            'bg-warning-50 text-warning-600'
                          }`}>
                            {PAYMENT_STATUS_LABELS[p.status]}
                          </span>
                        </div>
                        <p className="text-sm text-ink-600 mb-2">{formatCurrency(p.amount)}</p>
                        {p.proof_image_url && (
                          <a href={p.proof_image_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-gold-700 hover:underline">
                            <Eye className="w-3.5 h-3.5" /> Lihat Bukti Transfer
                          </a>
                        )}
                        {p.status === 'menunggu_verifikasi' && (
                          <div className="flex gap-2 mt-3">
                            <button onClick={() => verifyPayment(p.id, 'diverifikasi')} className="inline-flex items-center gap-1 rounded-lg bg-success-500 text-white px-3 py-1.5 text-xs font-medium hover:bg-success-600 transition-colors">
                              <Check className="w-3.5 h-3.5" /> Verifikasi
                            </button>
                            <button onClick={() => verifyPayment(p.id, 'ditolak')} className="inline-flex items-center gap-1 rounded-lg bg-error-50 text-error-600 border border-error-200 px-3 py-1.5 text-xs font-medium hover:bg-error-100 transition-colors">
                              <X className="w-3.5 h-3.5" /> Tolak
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-ink-400">Belum ada pembayaran.</p>
                )}
              </div>

              {/* Admin Notes */}
              <div>
                <label className="label-field">Catatan Internal Admin</label>
                <textarea
                  rows={2}
                  defaultValue={selectedBooking.admin_notes || ''}
                  onBlur={(e) => updateAdminNotes(selectedBooking.id, e.target.value)}
                  className="input-field resize-none"
                  placeholder="Catatan internal (tidak terlihat oleh klien)..."
                />
              </div>

              {/* Status Actions */}
              <div>
                <p className="text-xs text-ink-400 mb-2">Ubah Status Booking</p>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'dp_diverifikasi', 'dikonfirmasi', 'lunas', 'dibatalkan'] as BookingStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedBooking.id, s)}
                      className={`rounded-lg px-3 py-2 text-xs font-medium border transition-colors ${
                        selectedBooking.status === s
                          ? `${BOOKING_STATUS_COLORS[s]} border-transparent`
                          : 'bg-white border-ink-200 text-ink-500 hover:border-gold-300'
                      }`}
                    >
                      {BOOKING_STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
