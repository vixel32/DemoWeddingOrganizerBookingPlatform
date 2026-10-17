import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGalleries, useGalleryMedia } from '@/lib/hooks';
import { formatDate } from '@/lib/utils';

export default function GalleryPage() {
  const { galleries, loading } = useGalleries();
  const [selectedGallery, setSelectedGallery] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ galleryId: string; index: number } | null>(null);

  const activeGalleryId = selectedGallery ?? galleries[0]?.id ?? null;
  const { media, loading: mediaLoading } = useGalleryMedia(activeGalleryId);

  const openLightbox = (galleryId: string, index: number) => setLightbox({ galleryId, index });
  const closeLightbox = () => setLightbox(null);
  const nextImage = () => {
    if (!lightbox) return;
    setLightbox({ ...lightbox, index: (lightbox.index + 1) % media.length });
  };
  const prevImage = () => {
    if (!lightbox) return;
    setLightbox({ ...lightbox, index: (lightbox.index - 1 + media.length) % media.length });
  };

  return (
    <div className="pt-20">
      <section className="relative py-20 bg-ink-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.pexels.com/photos/17315420/pexels-photo-17315420.jpeg?auto=compress&cs=tinysrgb&h=600&w=1600" alt="" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative z-10 container-max px-4 text-center">
          <p className="text-gold-400 text-sm tracking-[0.2em] uppercase mb-3">Galeri</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">Dokumentasi Acara Kami</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Setiap acara adalah cerita yang layak dikenang. Berikut dokumentasi acara-acara yang telah kami tangani.</p>
        </div>
      </section>

      <section className="section-padding bg-cream-50">
        <div className="container-max">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : galleries.length === 0 ? (
            <p className="text-center text-ink-400 py-20">Belum ada galeri.</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                {galleries.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGallery(g.id)}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      activeGalleryId === g.id
                        ? 'bg-gold-600 text-white shadow-md'
                        : 'bg-white text-ink-600 border border-ink-200 hover:border-gold-300 hover:text-gold-700'
                    }`}
                  >
                    {g.title}
                  </button>
                ))}
              </div>

              {mediaLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {media.map((m, i) => (
                    <div
                      key={m.id}
                      onClick={() => openLightbox(activeGalleryId!, i)}
                      className="relative overflow-hidden rounded-2xl cursor-pointer group aspect-square"
                    >
                      <img src={m.media_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/20 transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {lightbox && media[lightbox.index] && (
        <div className="fixed inset-0 z-[100] bg-ink-900/90 flex items-center justify-center p-4 animate-fade-in" onClick={closeLightbox}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white p-2" onClick={closeLightbox}>
            <X className="w-8 h-8" />
          </button>
          <button className="absolute left-4 text-white/80 hover:text-white p-2" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
            <ChevronLeft className="w-10 h-10" />
          </button>
          <img src={media[lightbox.index].media_url} alt="" className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-4 text-white/80 hover:text-white p-2" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
            <ChevronRight className="w-10 h-10" />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightbox.index + 1} / {media.length}
          </p>
        </div>
      )}
    </div>
  );
}
