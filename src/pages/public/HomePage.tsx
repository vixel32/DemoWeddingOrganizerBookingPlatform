import { Link } from 'react-router-dom';
import {
  Heart, Calendar, UtensilsCrossed, Sparkles, Camera, MessageCircle,
  ArrowRight, Star, Check, Quote, Clock, Users, MapPin
} from 'lucide-react';
import { useStoreSettings, usePackages, useApprovedTestimonials, useGalleries } from '@/lib/hooks';
import { formatCurrency, buildWhatsAppLink } from '@/lib/utils';

export default function HomePage() {
  const { settings } = useStoreSettings();
  const { packages } = usePackages();
  const { testimonials } = useApprovedTestimonials();
  const { galleries } = useGalleries();

  const heroImage = settings?.hero_image_url || 'https://images.pexels.com/photos/6028500/pexels-photo-6028500.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

  const waLink = settings
    ? buildWhatsAppLink(settings.whatsapp_number, 'Halo Vixel Wedding Organizer, saya ingin konsultasi tentang paket pernikahan.')
    : '#';

  const services = [
    { icon: Heart, title: 'Wedding Organizer', desc: 'Tim profesional yang mendampingi Anda dari awal perencanaan hingga hari H.' },
    { icon: Sparkles, title: 'Dekorasi', desc: 'Dekorasi pelaminan dan venue dengan konsep elegan yang disesuaikan dengan tema impian Anda.' },
    { icon: UtensilsCrossed, title: 'Katering', desc: 'Menu katering lezat dengan berbagai pilihan untuk memanjakan tamu undangan Anda.' },
    { icon: Camera, title: 'Dokumentasi', desc: 'Foto dan video sinematik untuk mengabadikan setiap momen berharga di hari bahagia.' },
  ];

  const steps = [
    { number: '01', title: 'Pilih Paket', desc: 'Lihat pilihan paket layanan kami dan pilih yang paling sesuai dengan kebutuhan dan budget Anda.' },
    { number: '02', title: 'Cek Tanggal', desc: 'Gunakan kalender ketersediaan untuk mengecek tanggal acara yang masih kosong.' },
    { number: '03', title: 'Isi Form & Bayar DP', desc: 'Lengkapi data booking dan transfer DP sesuai persentase yang ditentukan, lalu upload bukti transfer.' },
    { number: '04', title: 'Terkonfirmasi', desc: 'Admin akan memverifikasi pembayaran Anda. Setelah dikonfirmasi, tanggal acara Anda terkunci.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Wedding decoration" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-gold-200 text-sm tracking-[0.3em] uppercase mb-4 animate-fade-in-up">Vixel Wedding Organizer</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-white mb-6 leading-tight animate-fade-in-up animate-delay-100">
            Wujudkan Pernikahan<br />Impian Anda
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up animate-delay-200">
            Vendor jasa pernikahan paket lengkap. Wedding Organizer, dekorasi, katering, dan layanan pendukung dengan sistem booking tanggal acara yang mudah dan transparan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-300">
            <Link to="/booking" className="inline-flex items-center gap-2 rounded-full bg-gold-600 px-8 py-4 text-sm font-medium text-white hover:bg-gold-700 hover:shadow-2xl hover:shadow-gold-600/30 transition-all duration-300 active:scale-95">
              <Calendar className="w-5 h-5" />
              Cek Ketersediaan Tanggal
            </Link>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 px-8 py-4 text-sm font-medium text-white hover:bg-white/20 transition-all duration-300">
              <MessageCircle className="w-5 h-5" />
              Konsultasi Gratis
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-cream-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="text-gold-600 text-sm tracking-[0.2em] uppercase mb-3">Layanan Kami</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink-900 mb-4">Paket Lengkap untuk Hari Bahagia</h2>
            <p className="text-ink-500 max-w-2xl mx-auto">Kami menyediakan semua yang Anda butuhkan untuk pernikahan yang sempurna, dari A sampai Z.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div key={i} className="card p-6 hover:shadow-lg hover:shadow-gold-600/5 hover:-translate-y-1 group">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gold-50 text-gold-600 mb-4 group-hover:bg-gold-600 group-hover:text-white transition-colors duration-300">
                  <s.icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg text-ink-900 mb-2">{s.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-gold-600 text-sm tracking-[0.2em] uppercase mb-3">Paket Unggulan</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink-900">Pilih Paket Impian Anda</h2>
            </div>
            <Link to="/paket" className="inline-flex items-center gap-2 text-gold-700 hover:text-gold-800 text-sm font-medium transition-colors">
              Lihat Semua Paket <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.slice(0, 3).map((pkg) => (
              <div key={pkg.id} className="card overflow-hidden hover:shadow-xl hover:shadow-gold-600/5 hover:-translate-y-1 transition-all duration-300 group">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={`https://images.pexels.com/photos/${pkg.id === 'a0000000-0000-0000-0000-000000000001' ? '19024679' : pkg.id === 'a0000000-0000-0000-0000-000000000002' ? '6028500' : '38583659'}/pexels-photo-${pkg.id === 'a0000000-0000-0000-0000-000000000001' ? '19024679' : pkg.id === 'a0000000-0000-0000-0000-000000000002' ? '6028500' : '38583659'}.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium text-gold-700">
                    Mulai {formatCurrency(pkg.price_from)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-ink-900 mb-2">{pkg.name}</h3>
                  <p className="text-sm text-ink-500 mb-4 line-clamp-2 leading-relaxed">{pkg.description}</p>
                  <div className="space-y-1.5 mb-5">
                    {pkg.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-ink-600">
                        <Check className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                    {pkg.features.length > 3 && (
                      <p className="text-xs text-ink-400 pl-5">+{pkg.features.length - 3} layanan lainnya</p>
                    )}
                  </div>
                  <Link to="/paket" className="inline-flex items-center gap-2 text-sm font-medium text-gold-700 hover:text-gold-800 transition-colors">
                    Lihat Detail <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Book */}
      <section className="section-padding bg-ink-900">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="text-gold-400 text-sm tracking-[0.2em] uppercase mb-3">Cara Booking</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">Booking Tanggal Acara dalam 4 Langkah</h2>
            <p className="text-ink-300 max-w-2xl mx-auto">Sistem booking online yang mudah dan transparan. Pastikan tanggal acara Anda tidak bentrok dengan klien lain.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-ink-800 rounded-2xl p-6 h-full border border-ink-700 hover:border-gold-600 transition-colors duration-300">
                  <div className="font-serif text-4xl text-gold-600/40 mb-3">{step.number}</div>
                  <h3 className="font-serif text-lg text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-ink-300 leading-relaxed">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gold-600/30" />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/booking" className="inline-flex items-center gap-2 rounded-full bg-gold-600 px-8 py-4 text-sm font-medium text-white hover:bg-gold-700 hover:shadow-xl hover:shadow-gold-600/20 transition-all duration-300">
              <Calendar className="w-5 h-5" />
              Mulai Booking Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Highlight */}
      <section className="section-padding bg-cream-50">
        <div className="container-max">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-gold-600 text-sm tracking-[0.2em] uppercase mb-3">Galeri Highlight</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink-900">Momen Indah yang Kami Wujudkan</h2>
            </div>
            <Link to="/galeri" className="inline-flex items-center gap-2 text-gold-700 hover:text-gold-800 text-sm font-medium transition-colors">
              Lihat Semua Galeri <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {galleries.slice(0, 3).map((g, i) => (
              <Link
                key={g.id}
                to="/galeri"
                className={`relative overflow-hidden rounded-2xl group ${i === 0 ? 'col-span-2 lg:col-span-1' : ''}`}
              >
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <img src={g.cover_image_url} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent rounded-2xl flex items-end p-4">
                  <div>
                    <h3 className="font-serif text-white text-lg">{g.title}</h3>
                    {g.event_date && <p className="text-white/70 text-xs">{new Date(g.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="text-gold-600 text-sm tracking-[0.2em] uppercase mb-3">Testimoni Klien</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink-900 mb-4">Apa Kata Mereka</h2>
            <p className="text-ink-500 max-w-2xl mx-auto">Kepuasan klien adalah prioritas utama kami. Berikut beberapa testimoni dari couples yang telah mempercayakan hari bahagianya kepada Vixel.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t) => (
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
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.pexels.com/photos/37828118/pexels-photo-37828118.jpeg?auto=compress&cs=tinysrgb&h=800&w=1600" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-ink-900/70" />
        </div>
        <div className="relative z-10 container-max px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">Siap Mengunci Tanggal Bahagia Anda?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">Jangan tunggu sampai tanggal impian Anda diambil orang lain. Cek ketersediaan dan booking sekarang.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking" className="inline-flex items-center gap-2 rounded-full bg-gold-600 px-8 py-4 text-sm font-medium text-white hover:bg-gold-700 hover:shadow-xl hover:shadow-gold-600/30 transition-all duration-300">
              <Calendar className="w-5 h-5" />
              Cek Ketersediaan Tanggal
            </Link>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 px-8 py-4 text-sm font-medium text-white hover:bg-white/20 transition-all duration-300">
              <MessageCircle className="w-5 h-5" />
              Konsultasi via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
