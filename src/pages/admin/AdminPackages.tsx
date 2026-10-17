import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, Upload } from 'lucide-react';
import { supabase, STORAGE_BUCKET } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import type { Package, PackageImage } from '@/lib/types';

export default function AdminPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Package | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadPackages(); }, []);

  async function loadPackages() {
    setLoading(true);
    const { data } = await supabase.from('packages').select('*').order('sort_order', { ascending: true });
    if (data) setPackages(data as Package[]);
    setLoading(false);
  }

  async function toggleActive(pkg: Package) {
    await supabase.from('packages').update({ is_active: !pkg.is_active }).eq('id', pkg.id);
    loadPackages();
  }

  async function deletePackage(id: string) {
    if (!confirm('Hapus paket ini?')) return;
    await supabase.from('packages').delete().eq('id', id);
    loadPackages();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ink-900 mb-1">Paket & Layanan</h1>
          <p className="text-sm text-ink-500">Kelola paket layanan pernikahan.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
          <Plus className="w-4 h-4" /> Tambah Paket
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-serif text-lg text-ink-900">{pkg.name}</h3>
                  <p className="text-sm text-gold-600 font-medium">{formatCurrency(pkg.price_from)}</p>
                </div>
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${pkg.is_active ? 'bg-success-50 text-success-600' : 'bg-ink-100 text-ink-400'}`}>
                  {pkg.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <p className="text-xs text-ink-500 line-clamp-2 mb-3">{pkg.description}</p>
              <p className="text-xs text-ink-400 mb-3">{pkg.features.length} layanan termasuk</p>
              <div className="flex items-center gap-2">
                <button onClick={() => { setEditing(pkg); setShowForm(true); }} className="btn-ghost text-xs">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => toggleActive(pkg)} className="btn-ghost text-xs">
                  {pkg.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button onClick={() => deletePackage(pkg.id)} className="btn-ghost text-xs text-error-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <PackageForm
          editing={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); loadPackages(); }}
        />
      )}
    </div>
  );
}

function PackageForm({ editing, onClose, onSaved }: { editing: Package | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(editing?.name || '');
  const [description, setDescription] = useState(editing?.description || '');
  const [priceFrom, setPriceFrom] = useState(editing?.price_from?.toString() || '');
  const [features, setFeatures] = useState(editing?.features?.join('\n') || '');
  const [isActive, setIsActive] = useState(editing?.is_active ?? true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editing) {
      supabase.from('package_images').select('*').eq('package_id', editing.id).order('sort_order').then(({ data }) => {
        if (data) setImageUrls((data as PackageImage[]).map(d => d.image_url));
      });
    }
  }, [editing]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !editing) return;
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `packages/${editing.id}_${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error: upErr } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file);
      if (!upErr) {
        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
        newUrls.push(data.publicUrl);
      }
    }
    setImageUrls(prev => [...prev, ...newUrls]);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const featuresArr = features.split('\n').map(f => f.trim()).filter(Boolean);
      const pkgData = {
        name,
        description,
        price_from: parseInt(priceFrom) || 0,
        features: featuresArr,
        is_active: isActive,
      };

      let pkgId = editing?.id;
      if (editing) {
        await supabase.from('packages').update(pkgData).eq('id', editing.id);
      } else {
        const { data } = await supabase.from('packages').insert(pkgData).select().single();
        pkgId = data?.id;
      }

      if (pkgId && imageUrls.length > 0) {
        await supabase.from('package_images').delete().eq('package_id', pkgId);
        const imgInserts = imageUrls.map((url, i) => ({ package_id: pkgId, image_url: url, sort_order: i }));
        await supabase.from('package_images').insert(imgInserts);
      }

      setSaving(false);
      onSaved();
    } catch {
      setSaving(false);
      setError('Gagal menyimpan paket.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/60 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-ink-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="font-serif text-xl text-ink-900">{editing ? 'Edit Paket' : 'Tambah Paket'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-ink-400 hover:bg-ink-50"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="label-field">Nama Paket</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Contoh: Paket Elegance" />
          </div>
          <div>
            <label className="label-field">Deskripsi</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="input-field resize-none" placeholder="Deskripsi paket..." />
          </div>
          <div>
            <label className="label-field">Harga Mulai Dari (Rp)</label>
            <input type="number" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} className="input-field" placeholder="35000000" />
          </div>
          <div>
            <label className="label-field">Isi Layanan (satu per baris)</label>
            <textarea rows={6} value={features} onChange={(e) => setFeatures(e.target.value)} className="input-field resize-none" placeholder="Wedding Organizer profesional&#10;Dekorasi pelaminan&#10;Katering untuk 150 tamu" />
          </div>
          <div>
            <label className="label-field">Foto Paket</label>
            {editing && (
              <>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => setImageUrls(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-error-600 text-white rounded-full p-1">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="flex items-center justify-center border-2 border-dashed border-ink-200 rounded-xl py-4 cursor-pointer hover:border-gold-400">
                  <Upload className="w-5 h-5 text-ink-300 mr-2" />
                  <span className="text-sm text-ink-500">Upload foto</span>
                  <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
                </label>
              </>
            )}
            {!editing && <p className="text-xs text-ink-400">Simpan paket terlebih dahulu untuk menambah foto.</p>}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 rounded text-gold-600" />
            <span className="text-sm text-ink-600">Paket aktif (tampil di halaman publik)</span>
          </label>
          {error && <div className="rounded-xl p-3 text-sm bg-error-50 text-error-600">{error}</div>}
          <button onClick={handleSave} disabled={saving || !name} className="btn-primary w-full">
            {saving ? 'Menyimpan...' : 'Simpan Paket'}
          </button>
        </div>
      </div>
    </div>
  );
}
