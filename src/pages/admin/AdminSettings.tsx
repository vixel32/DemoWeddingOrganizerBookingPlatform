import { useEffect, useState } from 'react';
import { Save, Upload, Check } from 'lucide-react';
import { supabase, STORAGE_BUCKET } from '@/lib/supabase';
import type { StoreSettings } from '@/lib/types';

export default function AdminSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('store_settings').select('*').maybeSingle().then(({ data }) => {
      if (data) setSettings(data as StoreSettings);
      setLoading(false);
    });
  }, []);

  function update<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    await supabase.from('store_settings').update({
      whatsapp_number: settings.whatsapp_number,
      email: settings.email,
      address: settings.address,
      instagram_url: settings.instagram_url,
      facebook_url: settings.facebook_url,
      tiktok_url: settings.tiktok_url,
      youtube_url: settings.youtube_url,
      hero_image_url: settings.hero_image_url,
      bank_name: settings.bank_name,
      bank_account_name: settings.bank_account_name,
      bank_account_number: settings.bank_account_number,
      qris_image_url: settings.qris_image_url,
      dp_percentage: settings.dp_percentage,
    }).neq('id', '00000000-0000-0000-0000-000000000000');
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `settings/hero_${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file);
    if (!error) {
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
      update('hero_image_url', data.publicUrl);
    }
  }

  async function handleQrisUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `settings/qris_${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file);
    if (!error) {
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
      update('qris_image_url', data.publicUrl);
    }
  }

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ink-900 mb-1">Pengaturan</h1>
          <p className="text-sm text-ink-500">Konfigurasi informasi toko dan pembayaran.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Menyimpan...' : saved ? <><Check className="w-4 h-4" /> Tersimpan</> : <><Save className="w-4 h-4" /> Simpan</>}
        </button>
      </div>

      <div className="space-y-6">
        {/* Contact Info */}
        <div className="card p-6">
          <h2 className="font-serif text-lg text-ink-900 mb-4">Informasi Kontak</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Nomor WhatsApp</label>
              <input type="text" value={settings.whatsapp_number} onChange={(e) => update('whatsapp_number', e.target.value)} className="input-field" placeholder="6281234567890" />
            </div>
            <div>
              <label className="label-field">Email</label>
              <input type="email" value={settings.email} onChange={(e) => update('email', e.target.value)} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="label-field">Alamat</label>
              <input type="text" value={settings.address} onChange={(e) => update('address', e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="card p-6">
          <h2 className="font-serif text-lg text-ink-900 mb-4">Sosial Media</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Instagram URL</label>
              <input type="text" value={settings.instagram_url} onChange={(e) => update('instagram_url', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">Facebook URL</label>
              <input type="text" value={settings.facebook_url} onChange={(e) => update('facebook_url', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">TikTok URL</label>
              <input type="text" value={settings.tiktok_url} onChange={(e) => update('tiktok_url', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">YouTube URL</label>
              <input type="text" value={settings.youtube_url} onChange={(e) => update('youtube_url', e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="card p-6">
          <h2 className="font-serif text-lg text-ink-900 mb-4">Banner Beranda</h2>
          {settings.hero_image_url && (
            <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
              <img src={settings.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="flex items-center justify-center border-2 border-dashed border-ink-200 rounded-xl py-4 cursor-pointer hover:border-gold-400">
            <Upload className="w-5 h-5 text-ink-300 mr-2" />
            <span className="text-sm text-ink-500">Upload banner beranda</span>
            <input type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" />
          </label>
        </div>

        {/* Payment Info */}
        <div className="card p-6">
          <h2 className="font-serif text-lg text-ink-900 mb-4">Informasi Pembayaran</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label-field">Nama Bank</label>
              <input type="text" value={settings.bank_name} onChange={(e) => update('bank_name', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">No. Rekening</label>
              <input type="text" value={settings.bank_account_number} onChange={(e) => update('bank_account_number', e.target.value)} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="label-field">Atas Nama</label>
              <input type="text" value={settings.bank_account_name} onChange={(e) => update('bank_account_name', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">Persentase DP Default (%)</label>
              <input type="number" min="1" max="100" value={settings.dp_percentage} onChange={(e) => update('dp_percentage', parseInt(e.target.value) || 0)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label-field">QRIS Image</label>
            {settings.qris_image_url ? (
              <div className="relative w-48 aspect-square rounded-lg overflow-hidden">
                <img src={settings.qris_image_url} alt="QRIS" className="w-full h-full object-cover" />
                <button onClick={() => update('qris_image_url', '')} className="absolute top-1 right-1 bg-error-600 text-white rounded-full p-1 text-xs">Hapus</button>
              </div>
            ) : (
              <label className="flex items-center justify-center border-2 border-dashed border-ink-200 rounded-xl py-4 cursor-pointer hover:border-gold-400">
                <Upload className="w-5 h-5 text-ink-300 mr-2" />
                <span className="text-sm text-ink-500">Upload QRIS</span>
                <input type="file" accept="image/*" onChange={handleQrisUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan...' : saved ? <><Check className="w-4 h-4" /> Tersimpan</> : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
          </button>
        </div>
      </div>
    </div>
  );
}
