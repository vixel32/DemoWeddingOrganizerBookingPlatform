import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Heart, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function AdminLogin() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@vixelwedding.com');
  const [password, setPassword] = useState('Vixel@Admin2026!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) {
      setError(signInError);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <img src="https://images.pexels.com/photos/6028500/pexels-photo-6028500.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600" alt="" className="w-full h-full object-cover opacity-20" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 mb-4 shadow-lg shadow-gold-600/30">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
          <h1 className="font-serif text-3xl text-white mb-2">Vixel Admin</h1>
          <p className="text-ink-400 text-sm">Masuk untuk mengelola dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-field">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-300" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="admin@vixelwedding.com"
                />
              </div>
            </div>
            <div>
              <label className="label-field">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-300" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11"
                  placeholder="••••••••"
                />
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-xl p-3 text-sm bg-error-50 text-error-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-ink-100 text-center">
            <p className="text-xs text-ink-400">
              Default: admin@vixelwedding.com / Vixel@Admin2026!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
