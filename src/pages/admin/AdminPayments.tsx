import { useEffect, useState } from 'react';
import { Eye, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDateTime, PAYMENT_STATUS_LABELS, PAYMENT_TYPE_LABELS, PAYMENT_STATUS_COLORS } from '@/lib/utils';
import type { Payment, Booking } from '@/lib/types';

interface PaymentWithBooking extends Payment {
  bookings: Booking | null;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<PaymentWithBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [dpPercentage, setDpPercentage] = useState(30);
  const [savingDp, setSavingDp] = useState(false);

  useEffect(() => {
    loadPayments();
    loadSettings();
  }, []);

  async function loadPayments() {
    setLoading(true);
    const { data } = await supabase
      .from('payments')
      .select('*, bookings(*)')
      .order('created_at', { ascending: false });
    if (data) setPayments(data as PaymentWithBooking[]);
    setLoading(false);
  }

  async function loadSettings() {
    const { data } = await supabase.from('store_settings').select('dp_percentage').maybeSingle();
    if (data) setDpPercentage(data.dp_percentage);
  }

  async function verifyPayment(paymentId: string, status: 'diverifikasi' | 'ditolak') {
    const { error } = await supabase.from('payments').update({ status, verified_at: new Date().toISOString() }).eq('id', paymentId);
    if (!error) loadPayments();
  }

  async function saveDpPercentage() {
    setSavingDp(true);
    const { error } = await supabase.from('store_settings').update({ dp_percentage: dpPercentage }).neq('id', '00000000-0000-0000-0000-000000000000');
    setSavingDp(false);
    if (!error) loadSettings();
  }

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter);

  const summary = {
    total: payments.length,
    verified: payments.filter(p => p.status === 'diverifikasi').length,
    pending: payments.filter(p => p.status === 'menunggu_verifikasi').length,
    totalAmount: payments.filter(p => p.status === 'diverifikasi').reduce((s, p) => s + Number(p.amount), 0),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink-900 mb-1">Pembayaran</h1>
        <p className="text-sm text-ink-500">Kelola semua pembayaran DP dan pelunasan.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-xs text-ink-400 mb-1">Total Pembayaran</p>
          <p className="font-serif text-xl text-ink-900">{summary.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-ink-400 mb-1">Diverifikasi</p>
          <p className="font-serif text-xl text-success-600">{summary.verified}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-ink-400 mb-1">Menunggu Verifikasi</p>
          <p className="font-serif text-xl text-warning-600">{summary.pending}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-ink-400 mb-1">Total Nominal Diverifikasi</p>
          <p className="font-serif text-xl text-gold-700">{formatCurrency(summary.totalAmount)}</p>
        </div>
      </div>

      {/* DP Percentage Setting */}
      <div className="card p-5 mb-6">
        <h3 className="text-sm font-medium text-ink-800 mb-3">Persentase DP Default</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1"
            max="100"
            value={dpPercentage}
            onChange={(e) => setDpPercentage(parseInt(e.target.value) || 0)}
            className="input-field max-w-[100px]"
          />
          <span className="text-sm text-ink-500">%</span>
          <button onClick={saveDpPercentage} disabled={savingDp} className="btn-primary">
            {savingDp ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'menunggu_verifikasi', 'diverifikasi', 'ditolak'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f ? 'bg-gold-600 text-white' : 'bg-white border border-ink-200 text-ink-500 hover:border-gold-300'
            }`}
          >
            {f === 'all' ? 'Semua' : PAYMENT_STATUS_LABELS[f as keyof typeof PAYMENT_STATUS_LABELS]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card p-5">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-ink-400 py-10">Belum ada pembayaran.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100">
                  <th className="text-left text-xs font-medium text-ink-400 uppercase pb-3 px-2">Booking</th>
                  <th className="text-left text-xs font-medium text-ink-400 uppercase pb-3 px-2 hidden sm:table-cell">Jenis</th>
                  <th className="text-left text-xs font-medium text-ink-400 uppercase pb-3 px-2">Nominal</th>
                  <th className="text-left text-xs font-medium text-ink-400 uppercase pb-3 px-2 hidden md:table-cell">Tanggal</th>
                  <th className="text-left text-xs font-medium text-ink-400 uppercase pb-3 px-2">Status</th>
                  <th className="text-left text-xs font-medium text-ink-400 uppercase pb-3 px-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-ink-50 hover:bg-ink-50/30">
                    <td className="py-3 px-2">
                      <p className="text-sm font-medium text-ink-800">{p.bookings ? `${p.bookings.groom_name} & ${p.bookings.bride_name}` : '-'}</p>
                      <p className="text-xs text-ink-400">{p.bookings ? p.bookings.event_date : '-'}</p>
                    </td>
                    <td className="py-3 px-2 hidden sm:table-cell">
                      <span className="text-sm text-ink-600">{PAYMENT_TYPE_LABELS[p.payment_type]}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm font-medium text-ink-800">{formatCurrency(p.amount)}</span>
                    </td>
                    <td className="py-3 px-2 hidden md:table-cell">
                      <span className="text-xs text-ink-400">{formatDateTime(p.created_at)}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${PAYMENT_STATUS_COLORS[p.status]}`}>
                        {PAYMENT_STATUS_LABELS[p.status]}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        {p.proof_image_url && (
                          <a href={p.proof_image_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-ink-400 hover:bg-ink-100" title="Lihat bukti">
                            <Eye className="w-4 h-4" />
                          </a>
                        )}
                        {p.status === 'menunggu_verifikasi' && (
                          <>
                            <button onClick={() => verifyPayment(p.id, 'diverifikasi')} className="p-1.5 rounded-lg text-success-600 hover:bg-success-50" title="Verifikasi">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => verifyPayment(p.id, 'ditolak')} className="p-1.5 rounded-lg text-error-600 hover:bg-error-50" title="Tolak">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
