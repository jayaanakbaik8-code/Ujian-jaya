import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/app';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        alert('Pendaftaran berhasil! Silakan login.');
        setIsRegister(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg relative overflow-hidden p-6">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-50 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3 opacity-80"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-50 rounded-full blur-[80px] -z-10 -translate-x-1/3 translate-y-1/3 opacity-50"></div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px]"
      >
        <div className="card shadow-subtle bg-white/90 backdrop-blur-md border border-border-subtle p-10 md:p-12">
          <div className="mb-10 text-center">
            <Link to="/" className="inline-flex items-center gap-3 mb-8 hover:opacity-80 transition-all">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg italic shadow-subtle">PU</div>
              <span className="font-bold text-lg tracking-tight text-text-main border-r border-border-subtle pr-4 leading-none h-4 flex items-center">SMK PRIMA UNGGUL</span>
              <span className="text-text-dim font-bold text-[9px] uppercase tracking-widest pl-1">CBT Portal</span>
            </Link>
            <h2 className="text-2xl font-bold text-text-main tracking-tight uppercase">
               {isRegister ? 'Create Account' : 'Portal Login'}
            </h2>
            <p className="text-text-dim mt-2 font-medium text-xs uppercase tracking-widest italic">
               {isRegister ? 'Pendaftaran Admin Baru' : 'Computer Based Test System'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-1.5"
                >
                  <label className="text-[10px] font-bold text-text-dim ml-1 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                      type="text"
                      className="input-field pl-11 h-12 text-sm font-medium"
                      placeholder="Masukkan nama lengkap..."
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={isRegister}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
               <label className="text-[10px] font-bold text-text-dim ml-1 uppercase tracking-widest">Email Address</label>
               <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  type="email"
                  className="input-field pl-11 h-12 text-sm font-medium"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-bold text-text-dim ml-1 uppercase tracking-widest">Password</label>
               <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  type="password"
                  className="input-field pl-11 h-12 text-sm font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-600 text-[10px] font-bold uppercase tracking-tight italic"
              >
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 btn-primary flex justify-center items-center gap-2 group text-xs uppercase tracking-widest font-bold shadow-subtle active:scale-95 transition-all mt-4"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Daftar Sekarang' : 'Masuk Dashboard'}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-text-dim font-bold hover:text-primary transition-colors text-[10px] uppercase tracking-widest italic"
            >
              {isRegister ? 'Sudah punya akun? Login' : 'Belum punya akun? Registrasi Admin'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
