import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Monitor, 
  Palette, 
  Calculator, 
  Video, 
  Briefcase, 
  BarChart3,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';

const LandingPage = () => {
  const courses = [
    { name: 'TKJ', desc: 'Teknik Komputer & Jaringan', icon: Monitor, color: 'bg-blue-500' },
    { name: 'DKV', desc: 'Desain Komunikasi Visual', icon: Palette, color: 'bg-purple-500' },
    { name: 'AK', desc: 'Akuntansi', icon: Calculator, color: 'bg-green-500' },
    { name: 'BC', desc: 'Broadcasting', icon: Video, color: 'bg-red-500' },
    { name: 'MPLB', desc: 'Manajemen Perkantoran', icon: Briefcase, color: 'bg-orange-500' },
    { name: 'BD', desc: 'Bisnis Digital', icon: BarChart3, color: 'bg-teal-500' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border-subtle px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl italic">PU</div>
          <span className="font-bold text-xl tracking-tight text-text-main">SMK PRIMA UNGGUL</span>
        </div>
        <div className="flex items-center gap-8">
          <Link to="/login" className="px-6 py-2.5 bg-primary hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-subtle active:scale-95 text-xs uppercase tracking-widest">
            Portal Ujian
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 sm:px-12 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-primary/10 rounded text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-8">
            <Zap size={12} className="fill-current" />
            Empowering Innovation in Education
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-text-main leading-none tracking-tight mb-8">
            Wujudkan <span className="text-primary italic">Masa Depan</span> Gemilang Disini.
          </h1>
          <p className="text-lg text-text-dim font-medium leading-relaxed mb-10 max-w-lg italic">
            SMK Prima Unggul merupakan sekolah mitra industri yang berfokus pada pengembangan skill praktis siswa untuk siap kerja maupun wirausaha.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/login" className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 group text-xs uppercase tracking-widest">
              Get Started
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-3 px-8 py-4 border border-border-subtle text-text-dim font-bold rounded-xl text-xs uppercase tracking-widest">
              <Globe size={18} />
              Portal Utama
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="aspect-square bg-slate-50 border border-border-subtle rounded-3xl overflow-hidden relative shadow-subtle p-8 flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
             <div className="relative text-center">
                <div className="text-primary font-bold text-[120px] leading-none select-none italic opacity-20">SMK</div>
                <div className="bg-white/80 backdrop-blur-sm border border-border-subtle p-6 rounded-2xl shadow-subtle -mt-12 inline-block">
                   <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1 italic">Tahun Ajaran</p>
                   <p className="text-2xl font-bold text-text-main">2026/2027</p>
                </div>
             </div>
             
             {/* Geometric Elements */}
             <div className="absolute top-10 left-10 w-16 h-16 border border-primary/20 rounded-xl rotate-12"></div>
             <div className="absolute bottom-10 right-10 w-24 h-24 border border-slate-200 rounded-3xl -rotate-12"></div>
             <div className="absolute top-20 right-10 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </section>

      {/* Courses Grid */}
      <section className="py-24 bg-slate-50 border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-text-main tracking-tight sm:text-4xl">6 Jurusan Pilihan</h2>
            <p className="text-text-dim font-medium italic">Program keahlian unggulan sesuai kebutuhan industri.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <motion.div
                key={course.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 bg-white border border-border-subtle rounded-2xl hover:border-primary/30 transition-all hover:shadow-subtle cursor-default"
              >
                <div className={`${course.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/10`}>
                  <course.icon size={22} />
                </div>
                <h3 className="text-xl font-bold text-text-main mb-2 tracking-tight uppercase italic">{course.name}</h3>
                <p className="text-text-dim font-medium leading-relaxed text-sm italic">{course.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid lg:grid-cols-3 gap-12">
           <div className="flex flex-col gap-4">
              <div className="w-10 h-10 bg-red-100 text-primary rounded-lg flex items-center justify-center border border-primary/10">
                 <ShieldCheck size={20} />
              </div>
              <h4 className="text-lg font-bold text-text-main italic uppercase tracking-tight">Terakreditasi A</h4>
              <p className="text-text-dim font-medium leading-relaxed text-sm italic">Memiliki kurikulum nasional berkualitas tinggi dengan standar industri global.</p>
           </div>
           <div className="flex flex-col gap-4">
              <div className="w-10 h-10 bg-red-100 text-primary rounded-lg flex items-center justify-center border border-primary/10">
                 <Zap size={20} />
              </div>
              <h4 className="text-lg font-bold text-text-main italic uppercase tracking-tight">Fast-Track Learning</h4>
              <p className="text-text-dim font-medium leading-relaxed text-sm italic">Pembelajaran intensif yang mengutamakan 80% praktek dan 20% teori.</p>
           </div>
           <div className="flex flex-col gap-4">
              <div className="w-10 h-10 bg-red-100 text-primary rounded-lg flex items-center justify-center border border-primary/10">
                 <Globe size={20} />
              </div>
              <h4 className="text-lg font-bold text-text-main italic uppercase tracking-tight">Koneksi Industri</h4>
              <p className="text-text-dim font-medium leading-relaxed text-sm italic">Bekerjasama dengan lebih dari 50 perusahaan ternama untuk program PKL & Rekrutmen.</p>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border-subtle bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold italic text-sm">PU</div>
              <span className="font-bold text-lg tracking-tight text-text-main uppercase">SMK Prima Unggul</span>
           </div>
           <p className="text-text-dim font-medium text-[10px] uppercase tracking-widest italic">© 2026 SMK Prima Unggul. Built for Excellence.</p>
           <div className="flex gap-6">
              <a href="#" className="text-text-dim hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest italic">Instagram</a>
              <a href="#" className="text-text-dim hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest italic">Facebook</a>
              <a href="#" className="text-text-dim hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest italic">Twitter</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
