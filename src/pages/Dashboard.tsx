import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  FileText, 
  GraduationCap, 
  Activity, 
  TrendingUp, 
  Clock,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

const Dashboard = () => {
  const { profile } = useAuth();

  const stats = [
    { label: 'Total Siswa', value: '1,248' },
    { label: 'Ujian Aktif', value: '42' },
    { label: 'Guru Pengampu', value: '12' },
    { label: 'Avg. Partisipasi', value: '98.2%' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-main m-0">Ringkasan Aktivitas</h1>
        <button className="btn-primary">
           + Tambah User
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="stat-card card bg-white p-5 shadow-subtle border border-border-subtle"
          >
            <div className="text-2xl font-bold text-text-main mb-1 tracking-tight">{stat.value}</div>
            <div className="text-[11px] font-bold text-text-dim uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="bg-white border border-border-subtle rounded-xl flex flex-col overflow-hidden h-[420px]">
            <div className="p-5 border-b border-border-subtle flex justify-between items-center">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider italic">Berita & Informasi Terbaru</h3>
              <span className="text-primary text-[13px] font-semibold cursor-pointer hover:underline">Lihat Semua</span>
            </div>
            
            <div className="flex-1 p-8 bg-slate-50/30">
               <div className="card p-8 bg-slate-900 text-white relative overflow-hidden h-full flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[64px] -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative z-10">
                    <div className="inline-block px-2.5 py-1 bg-primary text-[10px] font-bold uppercase tracking-widest rounded mb-4">Urgent</div>
                    <h3 className="text-2xl font-bold tracking-tight mb-3">Pengumuman Kelulusan Siswa Kelas XII 2025/2026</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-lg mb-6">
                        Seluruh rangkaian ujian nasional berbasis komputer telah selesai dilaksanakan dengan sukses. Hasil akhir dapat diunduh melalui panel masing-masing siswa.
                    </p>
                    <button className="px-5 py-2.5 bg-white text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-100 transition-all flex items-center gap-2 w-fit">
                        Detail Informasi
                        <ArrowRight size={14} />
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
           <div className="card p-6 bg-primary text-white border-none shadow-lg shadow-primary/20">
              <h4 className="text-lg font-bold mb-2 uppercase tracking-tighter">Support Center</h4>
              <p className="text-sm font-medium text-white/80 mb-6 leading-relaxed">
                 Mengalami kendala teknis? Hubungi tim IT SMK Prima Unggul segera.
              </p>
              <a href="#" className="block w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur text-center text-xs font-bold rounded-lg transition-all border border-white/20 uppercase tracking-widest">
                 Hubungi Chat Support
              </a>
           </div>

           <div className="card bg-white border border-border-subtle">
              <div className="p-4 border-b border-border-subtle bg-app-bg/50">
                <h4 className="font-bold text-text-main uppercase tracking-widest text-[10px]">Visi Misi Sekolah</h4>
              </div>
              <div className="p-5">
                <p className="text-xs text-text-dim leading-relaxed font-medium">
                  Menjadi lembaga pendidikan kejuruan yang unggul, kompetitif, dan berkarakter serta menghasilkan lulusan yang siap bersaing di era digital global.
                </p>
                <div className="mt-6 space-y-2">
                  {['TKJ', 'DKV', 'AK', 'BC', 'MPLB', 'BD'].map(j => (
                      <div key={j} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <span className="text-[10px] font-bold text-slate-400 capitalize">{j} Program</span>
                        <span className="badge-base bg-red-50 text-primary">Accr. A</span>
                      </div>
                  ))}
                </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
