import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Upload, Images } from 'lucide-react';
import { supabase, STORAGE_BUCKET } from '@/lib/supabase';
import type { Gallery, GalleryMedia } from '@/lib/types';

export default function AdminGalleries() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [media, setMedia] = useState<GalleryMedia[]>([]);

  useEffect(() => { loadGalleries(); }, []);

  async function loadGalleries() {
    setLoading(true);
    const { data } = await supabase.from('galleries').select('*').order('sort_order', { ascending: true });
    if (data) setGalleries(data as Gallery[]);
    setLoading(false);
  }

  useEffect(() => {
    if (selectedGallery) {
      supabase.from('gallery_media').select('*').eq('gallery_id', selectedGallery.id).order('sort_order').then(({ data }) => {
        if (data) setMedia(data as GalleryMedia[]);
      });
    }
  }, [selectedGallery]);

  async function deleteGallery(id: string) {
    if (!confirm('Hapus album ini? Semua foto akan ikut terhapus.')) return;
    await supabase.from('galleries').delete().eq('id', id);
    setSelectedGallery(null);
    loadGalleries();
  }

  async function deleteMedia(id: string) {
    await supabase.from('gallery_media').delete().eq('id', id);
    if (selectedGallery) {
      const { data } = await supabase.from('gallery_media').select('*').eq('gallery_id', selectedGallery.id).order('sort_order');
      if (data) setMedia(data as GalleryMedia[]);
    }
  }

  async function uploadMedia(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !selectedGallery) return;
    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `galleries/${selectedGallery.id}_${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
        await supabase.from('gallery_media').insert({ gallery_id: selectedGallery.id, media_url: urlData.publicUrl, media_type: 'photo' });
      }
    }
    const { data } = await supabase.from('gallery_media').select('*').eq('gallery_id', selectedGallery.id).order('sort_order');
    if (data) setMedia(data as GalleryMedia[]);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ink-900 mb-1">Galeri</h1>
          <p className="text-sm text-ink-500">Kelola album dan foto dokumentasi.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Tambah Album
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : galleries.length === 0 ? (
        <div className="card p-12 text-center">
          <Images className="w-12 h-12 text-ink-200 mx-auto mb-3" />
          <p className="text-ink-400">Belum ada album. Klik "Tambah Album" untuk membuat baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((g) => (
            <div key={g.id} className="card overflow-hidden">
              <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => setSelectedGallery(g)}>
                {g.cover_image_url ? (
                  <img src={g.cover_image_url} alt={g.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-ink-100 flex items-center justify-center">
                    <Images className="w-10 h-10 text-ink-300" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg text-ink-900 mb-1">{g.title}</h3>
                <p className="text-xs text-ink-400 line-clamp-1 mb-3">{g.description}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedGallery(g)} className="btn-ghost text-xs">Kelola Foto</button>
                  <button onClick={() => deleteGallery(g.id)} className="btn-ghost text-xs text-error-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery Form Modal */}
      {showForm && (
        <GalleryForm onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); loadGalleries(); }} />
      )}

      {/* Media Manager Modal */}
      {selectedGallery && (
        <div className="fixed inset-0 z-50 bg-ink-900/60 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedGallery(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-ink-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-serif text-xl text-ink-900">{selectedGallery.title}</h2>
              <button onClick={() => setSelectedGallery(null)} className="p-2 rounded-lg text-ink-400 hover:bg-ink-50"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <label className="flex items-center justify-center border-2 border-dashed border-ink-200 rounded-xl py-6 cursor-pointer hover:border-gold-400 mb-4">
                <Upload className="w-6 h-6 text-ink-300 mr-2" />
                <span className="text-sm text-ink-500">Upload foto baru</span>
                <input type="file" accept="image/*" multiple onChange={uploadMedia} className="hidden" />
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {media.map((m) => (
                  <div key={m.id} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={m.media_url} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => deleteMedia(m.id)} className="absolute top-1 right-1 bg-error-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {media.length === 0 && <p className="text-sm text-ink-400 col-span-full text-center py-8">Belum ada foto.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GalleryForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `galleries/cover_${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file);
    if (!error) {
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
      setCoverUrl(data.publicUrl);
    }
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.from('galleries').insert({
      title,
      description,
      event_date: eventDate || null,
      cover_image_url: coverUrl,
    });
    setSaving(false);
    if (!error) onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/60 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-ink-100 px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-ink-900">Tambah Album</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-ink-400 hover:bg-ink-50"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="label-field">Judul Album</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Contoh: Andini & Reza Wedding" />
          </div>
          <div>
            <label className="label-field">Deskripsi</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="input-field resize-none" placeholder="Deskripsi singkat..." />
          </div>
          <div>
            <label className="label-field">Tanggal Acara</label>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label-field">Cover Album</label>
            {coverUrl ? (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                <button onClick={() => setCoverUrl('')} className="absolute top-2 right-2 bg-error-600 text-white rounded-full p-1.5"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <label className="flex items-center justify-center border-2 border-dashed border-ink-200 rounded-xl py-4 cursor-pointer hover:border-gold-400">
                <Upload className="w-5 h-5 text-ink-300 mr-2" />
                <span className="text-sm text-ink-500">Upload cover</span>
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              </label>
            )}
          </div>
          <button onClick={handleSave} disabled={saving || !title} className="btn-primary w-full">
            {saving ? 'Menyimpan...' : 'Simpan Album'}
          </button>
        </div>
      </div>
    </div>
  );
}
