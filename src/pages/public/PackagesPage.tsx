import { Link } from 'react-router-dom';
import { Check, ArrowRight, Calendar, Sparkles, UtensilsCrossed, Camera, Heart } from 'lucide-react';
import { usePackages } from '@/lib/hooks';
import { formatCurrency } from '@/lib/utils';

export default function PackagesPage() {
  const { packages, loading } = usePackages();

  const packageImages: Record<string, string[]> = {
    'a0000000-0000-0000-0000-000000000001': [
      'https://images.pexels.com/photos/19024679/pexels-photo-19024679.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/17315417/pexels-photo-17315417.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    'a0000000-0000-0000-0000-000000000002': [
      'https://images.pexels.com/photos/6028500/pexels-photo-6028500.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/17001844/pexels-photo-17001844.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    'a0000000-0000-0000-0000-000000000003': [
      'https://images.pexels.com/photos/38583659/pexels-photo-38583659.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/28613086/pexels-photo-28613086.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
  };

  const serviceIcons = [Heart, Sparkles, UtensilsCrossed, Camera];

  return (
    <div className="pt-20">
      <section className="relative py-20 bg-ink-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.pexels.com/photos/29502060/pexels-photo-29502060.jpeg?auto=compress&cs=tinysrgb&h=600&w=1600" alt="" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative z-10 container-max px-4 text-center">
          <p className="text-gold-400 text-sm tracking-[0.2em] uppercase mb-3">Paket & Layanan</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">Pilih Paket Pernikahan Anda</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Beragam pilihan paket dengan layanan lengkap, disesuaikan dengan kebutuhan dan budget Anda.</p>
        </div>
      </section>

      <section className="section-padding bg-cream-50">
        <div className="container-max">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-12">
              {packages.map((pkg, idx) => (
                <div key={pkg.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${idx % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                  <div className={`relative ${idx % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="grid grid-cols-2 gap-3">
                      {(packageImages[pkg.id] || []).map((url, i) => (
                        <div key={i} className={`overflow-hidden rounded-2xl ${i === 0 ? 'row-span-2 h-full' : 'h-48'}`}>
                          <img src={url} alt={`${pkg.name} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={idx % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gold-100 text-gold-600">
                        {(() => {
                          const Icon = serviceIcons[idx % serviceIcons.length];
                          return <Icon className="w-6 h-6" />;
                        })()}
                      </div>
                      <div>
                        <h2 className="font-serif text-2xl sm:text-3xl text-ink-900">{pkg.name}</h2>
                        <p className="text-gold-600 text-sm font-medium">Mulai {formatCurrency(pkg.price_from)}</p>
                      </div>
                    </div>
                    <p className="text-ink-500 mb-6 leading-relaxed">{pkg.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                      {pkg.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-ink-600">
                          <Check className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/booking" className="btn-primary">
                      <Calendar className="w-4 h-4" />
                      Booking Paket Ini
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
