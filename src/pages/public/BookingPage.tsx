import { useState, useEffect } from 'react';
import { Calendar, Check, Lock, Upload, ArrowRight, ArrowLeft, MessageCircle, FileText, Sparkles } from 'lucide-react';
import CalendarComponent from '@/components/Calendar';
import { useBookingDates, usePackages, useStoreSettings } from '@/lib/hooks';
import { supabase, STORAGE_BUCKET } from '@/lib/supabase';
import { formatCurrency, calculateDP, buildWhatsAppLink, formatDate } from '@/lib/utils';
import type { Package } from '@/lib/types';

type Step = 'date' | 'form' | 'payment' | 'done';

export default function BookingPage() {
  const { lockedDates, loading: datesLoading } = useBookingDates();
  const { packages } = usePackages();
  const { settings } = useStoreSettings();

  const [step, setStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [formData, setFormData] = useState({
    groom_name: '',
    bride_name: '',
    whatsapp_number: '',
    location: '',
    guest_count: '',
    notes: '',
  });
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPkg = packages.find((p) => p.id === selectedPackage) || null;
  const dpAmount = selectedPkg && settings ? calculateDP(selectedPkg.price_from, settings.dp_percentage) : 0;

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedPackage) return;
    setSubmitting(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from('bookings')
      .insert({
        groom_name: formData.groom_name,
        bride_name: formData.bride_name,
        whatsapp_number: formData.whatsapp_number,
        package_id: selectedPackage,
        event_date: selectedDate,
        location: formData.location,
        guest_count: parseInt(formData.guest_count) || 0,
        notes: formData.notes,
        status: 'pending',
      })
      .select()
      .single();

    setSubmitting(false);
    if (insertError) {
      setError('Gagal membuat booking. Silakan coba lagi.');
      return;
    }
    setBookingId(data.id);
    setStep('payment');
  };

  const handlePaymentUpload = async () => {
    if (!paymentFile || !bookingId || !selectedPkg || !settings) return;
    setSubmitting(true);
    setError(null);

    try {
      const fileExt = paymentFile.name.split('.').pop();
      const fileName = `payments/${bookingId}_dp_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, paymentFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
      setPaymentUrl(urlData.publicUrl);

      await supabase.from('payments').insert({
        booking_id: bookingId,
        payment_type: 'dp',
        amount: dpAmount,
        proof_image_url: urlData.publicUrl,
        status: 'menunggu_verifikasi',
      });

      setSubmitting(false);
      setStep('done');
    } catch (err) {
      setSubmitting(false);
      setError('Gagal upload bukti pembayaran. Silakan coba lagi.');
    }
  };

  const openWhatsApp = () => {
    if (!settings || !selectedPkg) return;
    const msg = `Halo Vixel Wedding Organizer, saya baru saja melakukan booking dengan detail berikut:%0A%0A` +
      `Nama Mempelai: ${formData.groom_name} & ${formData.bride_name}%0A` +
      `Tanggal Acara: ${formatDate(selectedDate!)}%0A` +
      `Paket: ${selectedPkg.name}%0A` +
      `Lokasi: ${formData.location}%0A` +
      `Jumlah Tamu: ${formData.guest_count}%0A` +
      `DP (${settings.dp_percentage}%): ${formatCurrency(dpAmount)}%0A%0A` +
      `Saya sudah mengupload bukti transfer DP. Mohon segera diverifikasi. Terima kasih!`;
    window.open(buildWhatsAppLink(settings.whatsapp_number, decodeURIComponent(msg)), '_blank');
  };

  return (
    <div className="pt-20">
      <section className="relative py-20 bg-ink-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.pexels.com/photos/17315417/pexels-photo-17315417.jpeg?auto=compress&cs=tinysrgb&h=600&w=1600" alt="" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative z-10 container-max px-4 text-center">
          <p className="text-gold-400 text-sm tracking-[0.2em] uppercase mb-3">Booking Tanggal Acara</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">Cek Ketersediaan & Booking</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Pilih tanggal yang tersedia, isi data booking, dan upload bukti transfer DP untuk mengunci tanggal acara Anda.</p>
        </div>
      </section>

      <section className="section-padding bg-cream-50">
        <div className="container-max">
          {/* Stepper */}
          <div className="flex items-center justify-center mb-12">
            {[
              { key: 'date', label: 'Pilih Tanggal', num: 1 },
              { key: 'form', label: 'Isi Data', num: 2 },
              { key: 'payment', label: 'Bayar DP', num: 3 },
              { key: 'done', label: 'Selesai', num: 4 },
            ].map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className={`flex flex-col items-center ${step === s.key ? 'text-gold-700' : ['date', 'form', 'payment', 'done'].indexOf(step) > i ? 'text-success-600' : 'text-ink-300'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm border-2 transition-colors ${
                    step === s.key ? 'border-gold-600 bg-gold-50' : ['date', 'form', 'payment', 'done'].indexOf(step) > i ? 'border-success-500 bg-success-50' : 'border-ink-200 bg-white'
                  }`}>
                    {['date', 'form', 'payment', 'done'].indexOf(step) > i ? <Check className="w-5 h-5" /> : s.num}
                  </div>
                  <span className="text-xs mt-1.5 hidden sm:block">{s.label}</span>
                </div>
                {i < 3 && <div className={`w-8 sm:w-16 h-px mx-1 ${['date', 'form', 'payment', 'done'].indexOf(step) > i ? 'bg-success-500' : 'bg-ink-200'}`} />}
              </div>
            ))}
          </div>

          {/* Step: Date Selection */}
          {step === 'date' && (
            <div className="max-w-3xl mx-auto animate-fade-in">
              {datesLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <CalendarComponent
                    lockedDates={lockedDates}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    minDate={new Date()}
                  />
                  {selectedDate && (
                    <div className="mt-6 card p-6 animate-fade-in-up">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success-50 text-success-600">
                          <Check className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink-800">Tanggal Terpilih</p>
                          <p className="text-lg font-serif text-gold-700">{formatDate(selectedDate)}</p>
                        </div>
                      </div>
                      <button onClick={() => setStep('form')} className="btn-primary w-full">
                        Lanjut Isi Data Booking
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step: Form */}
          {step === 'form' && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setStep('date')} className="btn-ghost">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                  </button>
                </div>
                <h2 className="font-serif text-2xl text-ink-900 mb-2">Data Booking</h2>
                <p className="text-sm text-ink-500 mb-6">Tanggal acara: <span className="font-medium text-gold-700">{selectedDate && formatDate(selectedDate)}</span></p>
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-field">Nama Mempelai Pria</label>
                      <input type="text" required value={formData.groom_name} onChange={(e) => setFormData({ ...formData, groom_name: e.target.value })} className="input-field" placeholder="Nama mempelai pria" />
                    </div>
                    <div>
                      <label className="label-field">Nama Mempelai Wanita</label>
                      <input type="text" required value={formData.bride_name} onChange={(e) => setFormData({ ...formData, bride_name: e.target.value })} className="input-field" placeholder="Nama mempelai wanita" />
                    </div>
                  </div>
                  <div>
                    <label className="label-field">Nomor WhatsApp Pemesan</label>
                    <input type="tel" required value={formData.whatsapp_number} onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })} className="input-field" placeholder="08xxxxxxxxxx" />
                  </div>
                  <div>
                    <label className="label-field">Paket Layanan</label>
                    <select required value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)} className="input-field">
                      <option value="">Pilih paket...</option>
                      {packages.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} - {formatCurrency(p.price_from)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-field">Lokasi Acara (Kota/Venue)</label>
                    <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="input-field" placeholder="Contoh: Ballroom Hotel X, Jakarta" />
                  </div>
                  <div>
                    <label className="label-field">Perkiraan Jumlah Tamu</label>
                    <input type="number" required min="1" value={formData.guest_count} onChange={(e) => setFormData({ ...formData, guest_count: e.target.value })} className="input-field" placeholder="Contoh: 150" />
                  </div>
                  <div>
                    <label className="label-field">Catatan Tambahan (Opsional)</label>
                    <textarea rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="input-field resize-none" placeholder="Tema, preferensi, atau permintaan khusus..." />
                  </div>
                  {error && <div className="rounded-xl p-4 text-sm bg-error-50 text-error-600">{error}</div>}
                  <button type="submit" disabled={submitting} className="btn-primary w-full">
                    {submitting ? 'Menyimpan...' : 'Lanjut ke Pembayaran DP'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Step: Payment */}
          {step === 'payment' && selectedPkg && settings && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="card p-8">
                <button onClick={() => setStep('form')} className="btn-ghost mb-4">
                  <ArrowLeft className="w-4 h-4" />
                  Kembali
                </button>
                <h2 className="font-serif text-2xl text-ink-900 mb-2">Pembayaran DP</h2>
                <p className="text-sm text-ink-500 mb-6">Transfer DP sebesar {settings.dp_percentage}% dari harga paket, lalu upload bukti transfer di bawah ini.</p>

                {/* Payment Summary */}
                <div className="rounded-xl bg-gold-50 border border-gold-200 p-5 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-ink-600">Paket</span>
                    <span className="text-sm font-medium text-ink-800">{selectedPkg.name}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-ink-600">Harga Paket</span>
                    <span className="text-sm font-medium text-ink-800">{formatCurrency(selectedPkg.price_from)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-ink-600">DP ({settings.dp_percentage}%)</span>
                    <span className="text-lg font-serif text-gold-700">{formatCurrency(dpAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gold-200">
                    <span className="text-sm text-ink-600">Sisa Pelunasan</span>
                    <span className="text-sm font-medium text-ink-800">{formatCurrency(selectedPkg.price_from - dpAmount)}</span>
                  </div>
                </div>

                {/* Bank Info */}
                <div className="rounded-xl border border-ink-200 p-5 mb-6">
                  <h3 className="text-sm font-medium text-ink-800 mb-3">Informasi Rekening</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink-500">Bank</span>
                      <span className="text-sm font-medium text-ink-800">{settings.bank_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink-500">No. Rekening</span>
                      <span className="text-sm font-medium text-ink-800 font-mono">{settings.bank_account_number}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink-500">Atas Nama</span>
                      <span className="text-sm font-medium text-ink-800">{settings.bank_account_name}</span>
                    </div>
                  </div>
                </div>

                {/* Upload Proof */}
                <div>
                  <label className="label-field">Upload Bukti Transfer DP</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPaymentFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="payment-upload"
                    />
                    <label
                      htmlFor="payment-upload"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-ink-200 rounded-xl py-8 px-4 cursor-pointer hover:border-gold-400 hover:bg-gold-50/30 transition-colors"
                    >
                      {paymentFile ? (
                        <div className="text-center">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success-50 text-success-600 mx-auto mb-2">
                            <Check className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-medium text-ink-800">{paymentFile.name}</p>
                          <p className="text-xs text-ink-400 mt-1">Klik untuk ganti file</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-10 h-10 text-ink-300 mx-auto mb-2" />
                          <p className="text-sm text-ink-500">Klik untuk upload bukti transfer</p>
                          <p className="text-xs text-ink-400 mt-1">JPG, PNG, atau PDF (max 5MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {error && <div className="rounded-xl p-4 text-sm bg-error-50 text-error-600 mt-4">{error}</div>}

                <button onClick={handlePaymentUpload} disabled={!paymentFile || submitting} className="btn-primary w-full mt-6">
                  {submitting ? 'Mengupload...' : 'Upload & Konfirmasi Pembayaran'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step: Done */}
          {step === 'done' && selectedPkg && settings && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="card p-8 text-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-success-50 text-success-600 mx-auto mb-6">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="font-serif text-3xl text-ink-900 mb-3">Booking Berhasil!</h2>
                <p className="text-ink-500 mb-2">Tanggal acara Anda telah dikunci sementara menunggu verifikasi admin.</p>
                <p className="text-sm text-ink-400 mb-8">Admin akan memverifikasi bukti transfer DP Anda dalam 1x24 jam.</p>

                <div className="rounded-xl bg-cream-100 border border-gold-200 p-5 mb-6 text-left">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink-500">Mempelai</span>
                      <span className="text-sm font-medium text-ink-800">{formData.groom_name} & {formData.bride_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink-500">Tanggal Acara</span>
                      <span className="text-sm font-medium text-ink-800">{selectedDate && formatDate(selectedDate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink-500">Paket</span>
                      <span className="text-sm font-medium text-ink-800">{selectedPkg.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink-500">DP Dibayar</span>
                      <span className="text-sm font-medium text-gold-700">{formatCurrency(dpAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink-500">Status</span>
                      <span className="text-sm font-medium text-warning-600">Menunggu Verifikasi</span>
                    </div>
                  </div>
                </div>

                <button onClick={openWhatsApp} className="btn-primary w-full mb-3">
                  <MessageCircle className="w-4 h-4" />
                  Kirim Ringkasan ke Admin via WhatsApp
                </button>
                <button onClick={() => { setStep('date'); setSelectedDate(null); setSelectedPackage(''); setFormData({ groom_name: '', bride_name: '', whatsapp_number: '', location: '', guest_count: '', notes: '' }); }} className="btn-outline w-full">
                  Buat Booking Lain
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
