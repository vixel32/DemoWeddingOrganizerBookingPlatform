import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X, Heart, MessageCircle } from 'lucide-react';
import { useStoreSettings } from '@/lib/hooks';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useStoreSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/', label: 'Beranda' },
    { to: '/paket', label: 'Paket & Layanan' },
    { to: '/booking', label: 'Cek Tanggal & Booking' },
    { to: '/galeri', label: 'Galeri' },
    { to: '/testimoni', label: 'Testimoni' },
    { to: '/tentang', label: 'Tentang Kami' },
    { to: '/kontak', label: 'Kontak' },
  ];

  const waLink = settings
    ? `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent('Halo Vixel Wedding Organizer, saya ingin konsultasi tentang paket pernikahan.')}`
    : '#';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'bg-cream-50/95 backdrop-blur-md shadow-md shadow-ink-900/5'
          : 'bg-transparent'
      }`}
    >
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-md transition-transform group-hover:scale-105">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className={`font-serif text-xl font-bold transition-colors ${scrolled || mobileOpen ? 'text-ink-900' : 'text-white'}`}>
                Vixel
              </span>
              <span className={`text-[10px] tracking-[0.2em] uppercase transition-colors ${scrolled || mobileOpen ? 'text-gold-600' : 'text-gold-200'}`}>
                Wedding Organizer
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    scrolled || mobileOpen
                      ? isActive
                        ? 'text-gold-700 bg-gold-50'
                        : 'text-ink-600 hover:text-gold-700 hover:bg-gold-50/50'
                      : isActive
                        ? 'text-white bg-white/15'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                scrolled || mobileOpen
                  ? 'bg-gold-600 text-white hover:bg-gold-700 hover:shadow-lg hover:shadow-gold-600/20'
                  : 'bg-white/15 text-white backdrop-blur-sm border border-white/30 hover:bg-white/25'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Konsultasi
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled || mobileOpen ? 'text-ink-800' : 'text-white'}`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden pb-6 pt-2 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      isActive
                        ? 'text-gold-700 bg-gold-50'
                        : 'text-ink-600 hover:bg-ink-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gold-600 px-4 py-3 text-sm font-medium text-white"
              >
                <MessageCircle className="w-4 h-4" />
                Konsultasi via WhatsApp
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
