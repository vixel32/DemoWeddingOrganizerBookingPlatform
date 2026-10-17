import { useState } from 'react';
import { MapPin, Mail, MessageCircle, Instagram, Facebook, Youtube, Send } from 'lucide-react';
import { useStoreSettings } from '@/lib/hooks';
import { buildWhatsAppLink } from '@/lib/utils';

export default function ContactPage() {
  const { settings } = useStoreSettings();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    const msg = `Halo Vixel Wedding Organizer,%0A%0ANama: ${formData.name}%0AEmail: ${formData.email}%0A%0APesan:%0A${formData.message}`;
    window.open(buildWhatsAppLink(settings.whatsapp_number, decodeURIComponent(msg)), '_blank');
    setSent(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  const waLink = settings
    ? buildWhatsAppLink(settings.whatsapp_number, 'Halo Vixel Wedding Organizer, saya ingin konsultasi.')
    : '#';

  return (
    <div className="pt-20">
      <section className="relative py-20 bg-ink-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.pexels.com/photos/35225227/pexels-photo-35225227.jpeg?auto=compress&cs=tinysrgb&h=600&w=1600" alt="" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative z-10 container-max px-4 text-center">
          <p className="text-gold-400 text-sm tracking-[0.2em] uppercase mb-3">Kontak</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">Hubungi Kami</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Kami siap membantu mewujudkan pernikahan impian Anda. Jangan ragu untuk menghubungi kami.</p>
        </div>
      </section>

      <section className="section-padding bg-cream-50">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-2xl text-ink-900 mb-6">Informasi Kontak</h2>
              <div className="space-y-4 mb-8">
                {settings?.address && (
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gold-50 text-gold-600 flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-800 mb-1">Alamat</p>
                      <p className="text-sm text-ink-500">{settings.address}</p>
                    </div>
                  </div>
                )}
                {settings?.email && (
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gold-50 text-gold-600 flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-800 mb-1">Email</p>
                      <a href={`mailto:${settings.email}`} className="text-sm text-ink-500 hover:text-gold-600 transition-colors">{settings.email}</a>
                    </div>
                  </div>
                )}
                {settings?.whatsapp_number && (
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gold-50 text-gold-600 flex-shrink-0">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-800 mb-1">WhatsApp</p>
                      <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-sm text-ink-500 hover:text-gold-600 transition-colors">
                        +{settings.whatsapp_number}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mb-8">
                {settings?.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 rounded-full bg-white border border-ink-200 text-ink-600 hover:bg-gold-600 hover:text-white hover:border-gold-600 transition-all" aria-label="Instagram">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {settings?.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 rounded-full bg-white border border-ink-200 text-ink-600 hover:bg-gold-600 hover:text-white hover:border-gold-600 transition-all" aria-label="Facebook">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {settings?.youtube_url && (
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 rounded-full bg-white border border-ink-200 text-ink-600 hover:bg-gold-600 hover:text-white hover:border-gold-600 transition-all" aria-label="YouTube">
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
              </div>

              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <MessageCircle className="w-4 h-4" />
                Chat via WhatsApp
              </a>
            </div>

            <div>
              <div className="card p-8">
                <h2 className="font-serif text-2xl text-ink-900 mb-2">Kirim Pesan</h2>
                <p className="text-sm text-ink-500 mb-6">Isi form di bawah ini, pesan akan diteruskan ke WhatsApp admin kami.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label-field">Nama Lengkap</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="Nama Anda" />
                  </div>
                  <div>
                    <label className="label-field">Email</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="label-field">Pesan</label>
                    <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="input-field resize-none" placeholder="Tulis pesan Anda..." />
                  </div>
                  {sent && (
                    <div className="rounded-xl p-4 text-sm bg-success-50 text-success-700">
                      Pesan Anda akan diteruskan ke WhatsApp admin. Terima kasih!
                    </div>
                  )}
                  <button type="submit" className="btn-primary w-full">
                    <Send className="w-4 h-4" />
                    Kirim Pesan
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
