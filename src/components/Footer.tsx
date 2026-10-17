import { Link } from 'react-router-dom';
import { Heart, Instagram, Facebook, MessageCircle, Mail, MapPin, Youtube } from 'lucide-react';
import { useStoreSettings } from '@/lib/hooks';
import { buildWhatsAppLink } from '@/lib/utils';

export default function Footer() {
  const { settings } = useStoreSettings();

  const waLink = settings
    ? buildWhatsAppLink(settings.whatsapp_number, 'Halo Vixel Wedding Organizer, saya ingin konsultasi tentang paket pernikahan.')
    : '#';

  return (
    <footer className="bg-ink-900 text-ink-200">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl font-bold text-white">Vixel</span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-gold-400">Wedding Organizer</span>
              </div>
            </Link>
            <p className="text-sm text-ink-300 leading-relaxed mb-6">
              Vendor jasa pernikahan paket lengkap. Wedding Organizer, dekorasi, katering, dan layanan pendukung dengan sistem booking tanggal acara.
            </p>
            <div className="flex items-center gap-3">
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-ink-800 hover:bg-gold-600 transition-colors" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-ink-800 hover:bg-gold-600 transition-colors" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-ink-800 hover:bg-gold-600 transition-colors" aria-label="YouTube">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-ink-800 hover:bg-gold-600 transition-colors" aria-label="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg text-white mb-4">Navigasi</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-gold-400 transition-colors">Beranda</Link></li>
              <li><Link to="/paket" className="hover:text-gold-400 transition-colors">Paket & Layanan</Link></li>
              <li><Link to="/booking" className="hover:text-gold-400 transition-colors">Cek Tanggal & Booking</Link></li>
              <li><Link to="/galeri" className="hover:text-gold-400 transition-colors">Galeri</Link></li>
              <li><Link to="/testimoni" className="hover:text-gold-400 transition-colors">Testimoni</Link></li>
              <li><Link to="/tentang" className="hover:text-gold-400 transition-colors">Tentang Kami</Link></li>
              <li><Link to="/kontak" className="hover:text-gold-400 transition-colors">Kontak</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg text-white mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              {settings?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-gold-400 flex-shrink-0" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 text-gold-400 flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-gold-400 transition-colors">{settings.email}</a>
                </li>
              )}
              {settings?.whatsapp_number && (
                <li className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 mt-0.5 text-gold-400 flex-shrink-0" />
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">
                    +{settings.whatsapp_number}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg text-white mb-4">Konsultasi Gratis</h3>
            <p className="text-sm text-ink-300 mb-4 leading-relaxed">
              Butuh bantuan memilih paket atau ingin konsultasi langsung? Tim kami siap membantu.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-gold-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Hubungi Kami
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-400">
            &copy; {new Date().getFullYear()} Vixel Wedding Organizer. All rights reserved.
          </p>
          <Link to="/admin/login" className="text-xs text-ink-500 hover:text-gold-400 transition-colors">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
