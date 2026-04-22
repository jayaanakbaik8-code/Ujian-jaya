import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Exam } from '../types';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Loader2,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const ExamManagement = () => {
  const { profile } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchExams = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setExams(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const examData = { 
      title, 
      description, 
      start_time: startTime, 
      end_time: endTime, 
      duration_minutes: duration,
      created_by: profile?.id 
    };

    let error;
    if (editingId) {
      const { error: err } = await supabase.from('exams').update(examData).eq('id', editingId);
      error = err;
    } else {
      const { error: err } = await supabase.from('exams').insert([examData]);
      error = err;
    }

    if (error) alert(error.message);
    else {
      setIsModalOpen(false);
      resetForm();
      fetchExams();
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime('');
    setEndTime('');
    setDuration(60);
    setEditingId(null);
  };

  const handleEdit = (e: Exam) => {
    setTitle(e.title);
    setDescription(e.description);
    // Format dates for input type datetime-local
    setStartTime(new Date(e.start_time).toISOString().slice(0, 16));
    setEndTime(new Date(e.end_time).toISOString().slice(0, 16));
    setDuration(e.duration_minutes);
    setEditingId(e.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus ujian ini pamanen? Seluruh pertanyaan juga akan terhapus.')) return;
    const { error } = await supabase.from('exams').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchExams();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-text-main m-0 tracking-tight">Manajemen Ujian</h1>
           <p className="text-sm text-text-dim mt-1 font-medium italic">Rancang jadwal dan durasi ujian untuk seluruh jurusan.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="btn-primary"
        >
           + Rancang Ujian
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center">
               <Loader2 size={48} className="animate-spin text-primary mb-4" />
               <p className="font-black text-xs uppercase tracking-widest text-slate-400 font-mono italic">Sinkronisasi Database...</p>
            </div>
         ) : exams.length === 0 ? (
            <div className="col-span-full py-20 text-center text-text-dim font-medium text-sm">
               Belum ada jadwal ujian tersedia.
            </div>
         ) : exams.map((exam) => (
            <motion.div 
               layout
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               key={exam.id} 
               className="card bg-white border border-border-subtle shadow-subtle hover:border-primary/20 transition-all flex flex-col"
            >
               <div className="p-6 flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                     <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-lg border border-border-subtle group-hover:bg-primary transition-all">
                        <FileText size={20} className="text-primary group-hover:text-white" />
                     </div>
                     <span className={cn(
                        "badge-base border px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider",
                        exam.is_active ? "bg-green-50 text-green-600 border-green-100" : "bg-slate-100 text-slate-500 border-slate-200"
                     )}>
                        {exam.is_active ? 'Aktif' : 'Draft'}
                     </span>
                  </div>

                  <div>
                     <h3 className="text-lg font-bold text-text-main leading-tight tracking-tight mb-2">{exam.title}</h3>
                     <p className="text-xs text-text-dim font-medium line-clamp-2 leading-relaxed">{exam.description || 'Tidak ada deskripsi ujian.'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                     <div className="space-y-1">
                        <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest">Mulai</p>
                        <p className="text-xs font-bold text-text-main">
                           {new Date(exam.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                           <span className="text-slate-400 ml-1">@{new Date(exam.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest">Durasi</p>
                        <p className="text-xs font-bold text-primary">{exam.duration_minutes} Menit</p>
                     </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                     <div className="flex gap-1">
                        <button onClick={() => handleEdit(exam)} className="p-2 text-text-dim hover:text-primary transition-all"><Edit3 size={14} /></button>
                        <button onClick={() => handleDelete(exam.id)} className="p-2 text-text-dim hover:text-primary transition-all"><Trash2 size={14} /></button>
                     </div>
                     <Link to={`/app/questions?examId=${exam.id}`} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                        <span>Butir Soal</span>
                        <ArrowRight size={12} />
                     </Link>
                  </div>
               </div>
            </motion.div>
         ))}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsModalOpen(false)}></div>
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="card bg-white w-full max-w-lg relative z-10"
            >
               <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-slate-50/30">
                 <h2 className="text-sm font-bold text-text-main uppercase tracking-widest italic">{editingId ? 'Update Ujian' : 'Rancang Ujian Baru'}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-text-dim hover:text-primary transition-all">
                    <Plus className="rotate-45" size={18} />
                 </button>
               </div>
               
               <form onSubmit={handleSubmit} className="p-8 space-y-5">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Judul Ujian</label>
                     <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input-field h-11 font-bold" placeholder="Ex: USBN MATEMATIKA KELAS XII" required />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Deskripsi</label>
                     <textarea value={description} onChange={e => setDescription(e.target.value)} className="input-field py-3 h-24 font-medium" placeholder="Ex: Baca soal dengan teliti..." />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Mulai</label>
                        <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className="input-field h-11 text-xs" required />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Selesai</label>
                        <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} className="input-field h-11 text-xs" required />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Durasi (Menit)</label>
                     <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="input-field h-11 font-bold text-primary" required />
                  </div>

                  <div className="flex gap-4 pt-4">
                     <button type="submit" disabled={loading} className="flex-1 btn-primary h-12 uppercase text-[11px] tracking-widest font-bold">
                        {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : editingId ? 'Simpan Data' : 'Publish Jadwal'}
                     </button>
                  </div>
               </form>
            </motion.div>
         </div>
      )}
    </div>
  );
};

const cn = (...inputs: any[]) => {
  return inputs.filter(Boolean).join(' ');
}

export default ExamManagement;
