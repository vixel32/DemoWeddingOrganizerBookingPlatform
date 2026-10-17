import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Heart, LayoutDashboard, CalendarDays, CreditCard, Package, Images, Star, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/bookings', label: 'Booking & Kalender', icon: CalendarDays },
  { to: '/admin/payments', label: 'Pembayaran', icon: CreditCard },
  { to: '/admin/packages', label: 'Paket & Layanan', icon: Package },
  { to: '/admin/galleries', label: 'Galeri', icon: Images },
  { to: '/admin/testimonials', label: 'Testimoni', icon: Star },
  { to: '/admin/settings', label: 'Pengaturan', icon: Settings },
];

export default function AdminLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="w-8 h-8 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const closeSidebar = () => {
    setClosing(true);
    setTimeout(() => {
      setSidebarOpen(false);
      setClosing(false);
    }, 280);
  };

  const handleNavigate = (to: string) => {
    navigate(to);
    closeSidebar();
  };

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-ink-900 text-ink-200 fixed inset-y-0 left-0 z-30">
        <div className="flex items-center gap-2 px-6 h-20 border-b border-ink-800">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-lg font-bold text-white">Vixel</span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-gold-400">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-gold-600 text-white' : 'text-ink-300 hover:bg-ink-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-ink-800">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-900/30 transition-colors">
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className={`absolute inset-0 bg-ink-900/60 backdrop-blur-sm ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}
            onClick={closeSidebar}
          />
          <aside className={`absolute inset-y-0 left-0 w-64 bg-ink-900 text-ink-200 flex flex-col shadow-2xl ${closing ? 'animate-slide-out' : 'animate-slide-in'}`}>
            <div className="flex items-center justify-between px-6 h-20 border-b border-ink-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600">
                  <Heart className="w-5 h-5 text-white" fill="white" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-serif text-lg font-bold text-white">Vixel</span>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-gold-400">Admin Panel</span>
                </div>
              </div>
              <button onClick={closeSidebar} className="p-1.5 rounded-lg text-ink-400 hover:text-white hover:bg-ink-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <button
                    key={item.to}
                    onClick={() => handleNavigate(item.to)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-gold-600 text-white' : 'text-ink-300 hover:bg-ink-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="p-3 border-t border-ink-800">
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-900/30 transition-colors">
                <LogOut className="w-5 h-5" />
                Keluar
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-ink-100 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-ink-600 hover:bg-ink-50 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-serif text-sm font-bold text-ink-900">Vixel Admin</span>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
