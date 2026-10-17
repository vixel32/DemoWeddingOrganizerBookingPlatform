import { Heart, Sparkles, Award, Users, Calendar, Check } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { icon: Calendar, value: '200+', label: 'Pernikahan Ditangani' },
    { icon: Users, value: '15+', label: 'Tim Profesional' },
    { icon: Award, value: '8', label: 'Tahun Pengalaman' },
    { icon: Heart, value: '100%', label: 'Klien Puas' },
  ];

  const team = [
    { name: 'Sarah Wijaya', role: 'Lead Wedding Organizer', photo: 'https://images.pexels.com/photos/16529712/pexels-photo-16529712.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
    { name: 'Dimas Pratama', role: 'Head of Decoration', photo: 'https://images.pexels.com/photos/17019886/pexels-photo-17019886.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
    { name: 'Rina Kusuma', role: 'Catering Manager', photo: 'https://images.pexels.com/photos/6609708/pexels-photo-6609708.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
  ];

  return (
    <div className="pt-20">
      <section className="relative py-20 bg-ink-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.pexels.com/photos/7317745/pexels-photo-7317745.jpeg?auto=compress&cs=tinysrgb&h=600&w=1600" alt="" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative z-10 container-max px-4 text-center">
          <p className="text-gold-400 text-sm tracking-[0.2em] uppercase mb-3">Tentang Kami</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">Cerita di Balik Vixel</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Mengubah momen berharga menjadi kenangan yang tak terlupakan.</p>
        </div>
      </section>

      <section className="section-padding bg-cream-50">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-2xl">
                    <img src="https://images.pexels.com/photos/19024679/pexels-photo-19024679.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="w-full h-64 object-cover" />
                  </div>
                  <div className="overflow-hidden rounded-2xl">
                    <img src="https://images.pexels.com/photos/29502060/pexels-photo-29502060.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="w-full h-48 object-cover" />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="overflow-hidden rounded-2xl">
                    <img src="https://images.pexels.com/photos/17022991/pexels-photo-17022991.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="w-full h-48 object-cover" />
                  </div>
                  <div className="overflow-hidden rounded-2xl">
                    <img src="https://images.pexels.com/photos/37828118/pexels-photo-37828118.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="w-full h-64 object-cover" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-gold-600 text-sm tracking-[0.2em] uppercase mb-3">Profil Kami</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink-900 mb-6">Vixel Wedding Organizer</h2>
              <p className="text-ink-500 leading-relaxed mb-4">
                Vixel Wedding Organizer hadir dari kecintaan kami pada momen-momen indah pernikahan. Berawal dari studio kecil pada tahun 2017, kini kami telah berkembang menjadi salah satu wedding organizer terpercaya di Jakarta dan sekitarnya.
              </p>
              <p className="text-ink-500 leading-relaxed mb-4">
                Kami percaya bahwa setiap pernikahan adalah unik dan setiap couple berhak mendapatkan hari terbaik mereka. Dengan tim profesional dan berpengalaman, kami siap mewujudkan konsep pernikahan impian Anda, dari dekorasi yang memukau hingga katering yang memanjakan lidah tamu.
              </p>
              <div className="space-y-2 mb-6">
                {['Tim profesional dan berpengalaman', 'Konsep yang disesuaikan dengan keinginan Anda', 'Sistem booking online yang transparan', 'Harga bersahabat dengan kualitas premium'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-ink-600">
                    <Check className="w-4 h-4 text-gold-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-50 text-gold-600 mx-auto mb-4">
                  <s.icon className="w-8 h-8" />
                </div>
                <p className="font-serif text-3xl text-ink-900 mb-1">{s.value}</p>
                <p className="text-sm text-ink-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="text-gold-600 text-sm tracking-[0.2em] uppercase mb-3">Tim Kami</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink-900">Orang-Orang di Balik Kesuksesan Anda</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="text-center group">
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img src={member.photo} alt={member.name} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/30 to-transparent" />
                </div>
                <h3 className="font-serif text-xl text-ink-900 mb-1">{member.name}</h3>
                <p className="text-sm text-gold-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
