import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Activity, 
  Search, 
  Filter, 
  RefreshCcw, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const Monitoring = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchResults = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('results')
      .select(`
        *,
        exams:exam_id (title),
        student:student_id (name, nis, class_name)
      `)
      .order('completed_at', { ascending: false });

    if (error) console.error(error);
    else setResults(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
    // In a real app, use Supabase Realtime here
    const channel = supabase.channel('monitoring_results')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'results' }, () => {
        fetchResults();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredResults = results.filter(r => 
    r.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.exams?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Chart Data preparation
  const chartData = [
     { range: '0-20', count: results.filter(r => r.score <= 20).length },
     { range: '21-40', count: results.filter(r => r.score > 20 && r.score <= 40).length },
     { range: '41-60', count: results.filter(r => r.score > 40 && r.score <= 60).length },
     { range: '61-80', count: results.filter(r => r.score > 60 && r.score <= 80).length },
     { range: '81-100', count: results.filter(r => r.score > 80).length },
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
           <div className="w-12 h-12 bg-red-100 text-primary rounded-xl flex items-center justify-center">
              <Activity size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-text-main m-0 tracking-tight">Monitoring Real-time</h1>
              <p className="text-sm text-text-dim mt-1 font-medium italic">Pantau progres pengerjaan ujian siswa secara langsung.</p>
           </div>
        </div>
        <button 
          onClick={fetchResults}
          className="px-5 py-2.5 border border-border-subtle text-text-dim font-bold rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
        >
           <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
           <span>Refresh Feed</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         {/* Score Distribution Chart */}
         <div className="lg:col-span-1 card p-8 bg-slate-900 text-white relative overflow-hidden flex flex-col border-none shadow-subtle">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 flex-1">
               <h4 className="text-sm font-bold uppercase tracking-widest mb-1 italic">Distribusi Nilai</h4>
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">Statistik Seluruh Ujian</p>
               
               <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={chartData}>
                        <XAxis 
                           dataKey="range" 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{fill: '#475569', fontSize: 9, fontWeight: 700}} 
                        />
                        <Tooltip 
                           contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px'}}
                           itemStyle={{color: '#fff', fontSize: '10px', fontWeight: 'bold'}}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                           {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 4 ? '#ef4444' : '#ef444444'} />
                           ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
               </div>
               
               <div className="mt-8 flex justify-between items-end border-t border-white/5 pt-6">
                  <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Rata-rata</p>
                     <p className="text-3xl font-bold tracking-tight">{results.length > 0 ? (results.reduce((acc, r) => acc + r.score, 0) / results.length).toFixed(1) : '0'}</p>
                  </div>
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/5">
                     <TrendingUp className="text-primary" size={20} />
                  </div>
               </div>
            </div>
         </div>

         {/* Monitoring List */}
         <div className="lg:col-span-2 space-y-6">
            <div className="card shadow-subtle border border-border-subtle bg-white">
               <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-slate-50/30">
                  <h3 className="text-[10px] font-bold text-text-main uppercase tracking-widest italic">Aktivitas Terbaru</h3>
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                     <input 
                       type="text" 
                       className="input-field pl-9 py-1.5 h-auto text-[11px] w-64" 
                       placeholder="Cari Peserta / Ujian..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-50 border-b border-border-subtle">
                           <th className="px-6 py-4 text-[10px] font-bold text-text-dim uppercase tracking-widest">Peserta</th>
                           <th className="px-6 py-4 text-[10px] font-bold text-text-dim uppercase tracking-widest">Mata Pelajaran</th>
                           <th className="px-6 py-4 text-[10px] font-bold text-text-dim uppercase tracking-widest">Status</th>
                           <th className="px-6 py-4 text-center text-[10px] font-bold text-text-dim uppercase tracking-widest">Score</th>
                        </tr>
                     </thead>
                     <tbody>
                        {loading ? (
                           <tr>
                              <td colSpan={4} className="px-6 py-12 text-center">
                                 <Loader2 size={24} className="animate-spin mx-auto mb-2 text-primary" />
                                 <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">Sinkronisasi Feed...</span>
                              </td>
                           </tr>
                        ) : filteredResults.length === 0 ? (
                           <tr>
                              <td colSpan={4} className="px-6 py-12 text-center text-text-dim text-sm font-medium">Data hasil pengerjaan belum tersedia.</td>
                           </tr>
                        ) : filteredResults.map((r) => (
                           <tr key={r.id} className="border-b border-border-subtle last:border-0 hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 border border-border-subtle">
                                       <User size={14} />
                                    </div>
                                    <div>
                                       <p className="text-xs font-bold text-text-main uppercase tracking-tight">{r.student?.name}</p>
                                       <p className="text-[9px] text-text-dim font-bold tracking-widest">{r.student?.nis} • {r.student?.class_name}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <p className="text-xs font-bold text-text-main tracking-tight">{r.exams?.title}</p>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2 text-text-dim">
                                    <Clock size={12} />
                                    <span className="text-[10px] font-bold">
                                       {r.completed_at ? new Date(r.completed_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Pengerjaan...'}
                                    </span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                 <div className={cn(
                                    "inline-flex items-center justify-center min-w-[40px] px-2 py-1 rounded-md text-[11px] font-bold border",
                                    r.score >= 75 ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                                 )}>
                                    {r.score}
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

export default Monitoring;
