import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';
import HomePage from '@/pages/public/HomePage';
import PackagesPage from '@/pages/public/PackagesPage';
import BookingPage from '@/pages/public/BookingPage';
import GalleryPage from '@/pages/public/GalleryPage';
import TestimonialsPage from '@/pages/public/TestimonialsPage';
import AboutPage from '@/pages/public/AboutPage';
import ContactPage from '@/pages/public/ContactPage';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminPayments from '@/pages/admin/AdminPayments';
import AdminPackages from '@/pages/admin/AdminPackages';
import AdminGalleries from '@/pages/admin/AdminGalleries';
import AdminTestimonials from '@/pages/admin/AdminTestimonials';
import AdminSettings from '@/pages/admin/AdminSettings';
import { AuthProvider } from '@/lib/auth';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/paket" element={<PackagesPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/galeri" element={<GalleryPage />} />
            <Route path="/testimoni" element={<TestimonialsPage />} />
            <Route path="/tentang" element={<AboutPage />} />
            <Route path="/kontak" element={<ContactPage />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="galleries" element={<AdminGalleries />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
