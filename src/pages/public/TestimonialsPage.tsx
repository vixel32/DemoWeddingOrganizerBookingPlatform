import { useState } from 'react';
import { Star, Quote, Send } from 'lucide-react';
import { useApprovedTestimonials } from '@/lib/hooks';
import { supabase } from '@/lib/supabase';

export default function TestimonialsPage() {
  const { testimonials, loading } = useApprovedTestimonials();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', content: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg(null);

    const { error } = await supabase.from('testimonials').insert({
      name: formData.name,
      content: formData.content,
      rating: formData.rating,
      status: 'menunggu_review',
    });

    setSubmitting(false);
    if (error) {
      setSubmitMsg({ type: 'error', text: 'Gagal mengirim testimoni. Silakan coba lagi.' });
    } else {
      setSubmitMsg({ type: 'success', text: 'Terima kasih! Testimoni Anda akan ditampilkan setelah disetujui admin.' });
      setFormData({ name: '', content: '', rating: 5 });
      setTimeout(() => setShowForm(false), 3000);
    }
  };

  return (
    <div className="pt-20">
      <section className="relative py-20 bg-ink-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.pexels.com/photos/27008972/pexels-photo-27008972.jpeg?auto=compress&cs=tinysrgb&h=600&w=1600" alt="" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative z-10 container-max px-4 text-center">
          <p className="text-gold-400 text-sm tracking-[0.2em] uppercase mb-3">Testimoni</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">Kata Mereka Tentang Vixel</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Cerita bahagia dari couples yang telah mempercayakan hari istimewanya kepada kami.</p>
        </div>
      </section>

      <section className="section-padding bg-cream-50">
        <div className="container-max">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : testimonials.length === 0 ? (
            <p className="text-center text-ink-400 py-20">Belum ada testimoni.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="card p-6 hover:shadow-lg hover:shadow-gold-600/5 transition-all duration-300">
                  <Quote className="w-8 h-8 text-gold-300 mb-4" />
                  <p className="text-sm text-ink-600 leading-relaxed mb-6 italic">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    {t.photo_url ? (
                      <img src={t.photo_url} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-medium text-sm">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-ink-800">{t.name}</p>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'text-gold-500 fill-gold-500' : 'text-ink-200'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-outline"
            >
              {showForm ? 'Tutup Form' : 'Bagikan Testimoni Anda'}
            </button>
          </div>

          {showForm && (
            <div className="max-w-2xl mx-auto mt-8 animate-fade-in-up">
              <div className="card p-8">
                <h3 className="font-serif text-2xl text-ink-900 mb-2">Bagikan Pengalaman Anda</h3>
                <p className="text-sm text-ink-500 mb-6">Testimoni Anda akan tampil setelah disetujui oleh admin.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label-field">Nama</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="Nama Anda"
                    />
                  </div>
                  <div>
                    <label className="label-field">Testimoni</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="input-field resize-none"
                      placeholder="Bagikan pengalaman Anda dengan Vixel Wedding Organizer..."
                    />
                  </div>
                  <div>
                    <label className="label-field">Rating</label>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: i + 1 })}
                          className="p-1"
                        >
                          <Star className={`w-7 h-7 transition-colors ${i < formData.rating ? 'text-gold-500 fill-gold-500' : 'text-ink-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  {submitMsg && (
                    <div className={`rounded-xl p-4 text-sm ${submitMsg.type === 'success' ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-600'}`}>
                      {submitMsg.text}
                    </div>
                  )}
                  <button type="submit" disabled={submitting} className="btn-primary w-full">
                    <Send className="w-4 h-4" />
                    {submitting ? 'Mengirim...' : 'Kirim Testimoni'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
