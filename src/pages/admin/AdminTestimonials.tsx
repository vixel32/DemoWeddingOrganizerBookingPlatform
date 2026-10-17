import { useEffect, useState } from 'react';
import { Check, X, Plus, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDate, TESTIMONIAL_STATUS_LABELS } from '@/lib/utils';
import type { Testimonial, TestimonialStatus } from '@/lib/types';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadTestimonials(); }, []);

  async function loadTestimonials() {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (data) setTestimonials(data as Testimonial[]);
    setLoading(false);
  }

  async function updateStatus(id: string, status: TestimonialStatus) {
    await supabase.from('testimonials').update({ status }).eq('id', id);
    loadTestimonials();
  }

  async function deleteTestimonial(id: string) {
    if (!confirm('Hapus testimoni ini?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    loadTestimonials();
  }

  const filtered = filter === 'all' ? testimonials : testimonials.filter(t => t.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ink-900 mb-1">Testimoni</h1>
          <p className="text-sm text-ink-500">Kelola testimoni dari klien.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Tambah Manual
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'menunggu_review', 'disetujui', 'ditolak'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f ? 'bg-gold-600 text-white' : 'bg-white border border-ink-200 text-ink-500 hover:border-gold-300'
            }`}
          >
            {f === 'all' ? 'Semua' : TESTIMONIAL_STATUS_LABELS[f as keyof typeof TESTIMONIAL_STATUS_LABELS]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-ink-400 py-20">Belum ada testimoni.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <div key={t.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {t.photo_url ? (
                    <img src={t.photo_url} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-medium text-sm">{t.name.charAt(0)}</div>
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
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  t.status === 'disetujui' ? 'bg-success-50 text-success-600' :
                  t.status === 'ditolak' ? 'bg-error-50 text-error-600' :
                  'bg-warning-50 text-warning-600'
                }`}>
                  {TESTIMONIAL_STATUS_LABELS[t.status]}
                </span>
              </div>
              <p className="text-sm text-ink-600 mb-3 italic">"{t.content}"</p>
              <p className="text-xs text-ink-400 mb-3">{formatDate(t.created_at)}</p>
              <div className="flex items-center gap-2">
                {t.status !== 'disetujui' && (
                  <button onClick={() => updateStatus(t.id, 'disetujui')} className="inline-flex items-center gap-1 rounded-lg bg-success-500 text-white px-3 py-1.5 text-xs font-medium hover:bg-success-600">
                    <Check className="w-3.5 h-3.5" /> Setujui
                  </button>
                )}
                {t.status !== 'ditolak' && (
                  <button onClick={() => updateStatus(t.id, 'ditolak')} className="inline-flex items-center gap-1 rounded-lg bg-error-50 text-error-600 border border-error-200 px-3 py-1.5 text-xs font-medium hover:bg-error-100">
                    <X className="w-3.5 h-3.5" /> Tolak
                  </button>
                )}
                <button onClick={() => deleteTestimonial(t.id)} className="btn-ghost text-xs text-error-600 ml-auto">
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <TestimonialForm onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); loadTestimonials(); }} />
      )}
    </div>
  );
}

function TestimonialForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.from('testimonials').insert({ name, content, rating, status: 'disetujui' });
    setSaving(false);
    if (!error) onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/60 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-ink-100 px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-ink-900">Tambah Testimoni</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-ink-400 hover:bg-ink-50"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="label-field">Nama</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label-field">Testimoni</label>
            <textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} className="input-field resize-none" />
          </div>
          <div>
            <label className="label-field">Rating</label>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button" onClick={() => setRating(i + 1)} className="p-1">
                  <Star className={`w-7 h-7 ${i < rating ? 'text-gold-500 fill-gold-500' : 'text-ink-200'}`} />
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleSave} disabled={saving || !name || !content} className="btn-primary w-full">
            {saving ? 'Menyimpan...' : 'Simpan & Setujui'}
          </button>
        </div>
      </div>
    </div>
  );
}
