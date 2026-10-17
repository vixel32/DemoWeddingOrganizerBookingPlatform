import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, CreditCard, Package, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate, BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '@/lib/utils';
import type { Booking } from '@/lib/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ pending: 0, thisMonth: 0, packages: 0, totalRevenue: 0 });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [pendingRes, monthRes, pkgRes, paymentsRes, bookingsRes] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('event_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase.from('packages').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('payments').select('amount').eq('status', 'diverifikasi'),
        supabase.from('bookings').select('*, packages(*)').order('created_at', { ascending: false }).limit(5),
      ]);

      const totalRev = paymentsRes.data?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;

      setStats({
        pending: pendingRes.count || 0,
        thisMonth: monthRes.count || 0,
        packages: pkgRes.count || 0,
        totalRevenue: totalRev,
      });
      setRecentBookings((bookingsRes.data as Booking[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: 'Booking Pending', value: stats.pending, icon: Clock, color: 'bg-warning-50 text-warning-600' },
    { label: 'Booking Bulan Ini', value: stats.thisMonth, icon: CalendarDays, color: 'bg-blue-50 text-blue-600' },
    { label: 'Paket Aktif', value: stats.packages, icon: Package, color: 'bg-success-50 text-success-600' },
    { label: 'Total Pendapatan', value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'bg-gold-50 text-gold-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink-900 mb-1">Dashboard</h1>
        <p className="text-sm text-ink-500">Selamat datang kembali, Admin.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <div key={i} className="card p-5">
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${s.color} mb-3`}>
              <s.icon className="w-6 h-6" />
            </div>
            <p className="text-sm text-ink-500 mb-1">{s.label}</p>
            <p className="font-serif text-2xl text-ink-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl text-ink-900">Booking Terbaru</h2>
          <Link to="/admin/bookings" className="inline-flex items-center gap-1 text-sm text-gold-700 hover:text-gold-800">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recentBookings.length === 0 ? (
          <p className="text-center text-ink-400 py-10">Belum ada booking.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100">
                  <th className="text-left text-xs font-medium text-ink-400 uppercase tracking-wider pb-3 px-2">Mempelai</th>
                  <th className="text-left text-xs font-medium text-ink-400 uppercase tracking-wider pb-3 px-2 hidden sm:table-cell">Tanggal Acara</th>
                  <th className="text-left text-xs font-medium text-ink-400 uppercase tracking-wider pb-3 px-2 hidden md:table-cell">Paket</th>
                  <th className="text-left text-xs font-medium text-ink-400 uppercase tracking-wider pb-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-ink-50 hover:bg-ink-50/50 transition-colors">
                    <td className="py-3 px-2">
                      <p className="text-sm font-medium text-ink-800">{b.groom_name} & {b.bride_name}</p>
                      <p className="text-xs text-ink-400">{b.whatsapp_number}</p>
                    </td>
                    <td className="py-3 px-2 hidden sm:table-cell">
                      <p className="text-sm text-ink-600">{formatDate(b.event_date)}</p>
                    </td>
                    <td className="py-3 px-2 hidden md:table-cell">
                      <p className="text-sm text-ink-600">{b.packages?.name || '-'}</p>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium border ${BOOKING_STATUS_COLORS[b.status as keyof typeof BOOKING_STATUS_COLORS]}`}>
                        {BOOKING_STATUS_LABELS[b.status as keyof typeof BOOKING_STATUS_LABELS]}
                      </span>
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
