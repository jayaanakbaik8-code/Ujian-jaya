import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Student } from '../types';
import { 
  Users, 
  Search, 
  UserPlus, 
  Trash2, 
  Edit3,
  Loader2,
  Download,
  Info,
  X
} from 'lucide-react';
import { motion } from 'motion/react';

const StudentManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [nis, setNis] = useState('');
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name', { ascending: true });

    if (error) console.error(error);
    else setStudents(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const studentData = { nis, name, class_name: className };

    let error;
    if (editingId) {
      const { error: err } = await supabase.from('students').update(studentData).eq('id', editingId);
      error = err;
    } else {
      const { error: err } = await supabase.from('students').insert([studentData]);
      error = err;
    }

    if (error) {
      alert(error.message);
    } else {
      setIsModalOpen(false);
      resetForm();
      fetchStudents();
    }
    setLoading(false);
  };

  const resetForm = () => {
    setNis('');
    setName('');
    setClassName('');
    setEditingId(null);
  };

  const handleEdit = (s: Student) => {
    setNis(s.nis);
    setName(s.name);
    setClassName(s.class_name);
    setEditingId(s.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus data siswa ini?')) return;
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchStudents();
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nis.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-text-main m-0 tracking-tight">Database Siswa</h1>
           <p className="text-sm text-text-dim mt-1 font-medium">Monitoring seluruh data NIS dan Kelas SMK Prima Unggul.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-5 py-2 border border-border-subtle text-text-dim font-bold rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2 text-xs uppercase tracking-widest">
              <Download size={14} />
              <span>Export CSV</span>
           </button>
           <button 
             onClick={() => { resetForm(); setIsModalOpen(true); }}
             className="btn-primary"
           >
              + Tambah Siswa
           </button>
        </div>
      </div>

      <div className="card shadow-subtle border border-border-subtle bg-white">
         <div className="p-5 border-b border-border-subtle flex justify-between items-center bg-slate-50/30">
            <h3 className="text-[11px] font-bold text-text-main uppercase tracking-widest italic">Daftar Siswa Aktif</h3>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
               <input 
                 type="text" 
                 className="input-field pl-9 py-1.5 h-auto text-xs w-64" 
                 placeholder="Cari Nama / NIS..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 border-b border-border-subtle">
                     <th className="px-6 py-4 text-[10px] font-bold text-text-dim uppercase tracking-widest">NIS</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-text-dim uppercase tracking-widest">Nama Lengkap</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-text-dim uppercase tracking-widest">Kelas / Jurusan</th>
                     <th className="px-6 py-4 text-center text-[10px] font-bold text-text-dim uppercase tracking-widest">Aksi</th>
                  </tr>
               </thead>
               <tbody>
                  {loading ? (
                     <tr>
                        <td colSpan={4} className="px-6 py-20 text-center">
                           <Loader2 size={32} className="animate-spin text-primary mx-auto" />
                        </td>
                     </tr>
                  ) : filteredStudents.map((s) => (
                     <tr key={s.id} className="border-b border-border-subtle last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <span className="font-mono text-xs font-bold text-primary bg-red-50/50 px-2 py-1 rounded border border-primary/10">{s.nis}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-text-main text-sm">{s.name}</td>
                        <td className="px-6 py-4">
                           <span className="badge-base bg-slate-900 text-white border-none">{s.class_name}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center justify-center gap-2">
                              <button onClick={() => handleEdit(s)} className="p-2 text-text-dim hover:text-primary transition-all"><Edit3 size={16} /></button>
                              <button onClick={() => handleDelete(s.id)} className="p-2 text-text-dim hover:text-primary transition-all"><Trash2 size={16} /></button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <div className="card p-6 bg-slate-900 text-white flex items-center gap-6 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/5">
            <Info size={24} className="text-primary" />
         </div>
         <div>
            <h4 className="text-sm font-bold uppercase tracking-widest leading-none mb-1">Tips Administrasi</h4>
            <p className="text-slate-400 text-xs font-medium leading-relaxed italic">Gunakan NIS yang valid sebagai kredensial login utama bagi siswa dalam sistem sekolah terintegrasi.</p>
         </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsModalOpen(false)}></div>
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="card bg-white w-full max-w-md relative z-10"
            >
               <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-slate-50/30">
                 <h2 className="text-sm font-bold text-text-main uppercase tracking-widest italic">{editingId ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-text-dim hover:text-primary transition-all">
                    <X size={18} />
                 </button>
               </div>
               
               <form onSubmit={handleSubmit} className="p-8 space-y-5">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">NIS (Nomor Induk Siswa)</label>
                     <input type="text" value={nis} onChange={e => setNis(e.target.value)} className="input-field h-11" placeholder="Ex: 212210045" required />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Nama Lengkap</label>
                     <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field h-11" placeholder="Ex: Andi Suryana" required />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Kelas / Jurusan</label>
                     <select value={className} onChange={e => setClassName(e.target.value)} className="input-field h-11 font-semibold" required>
                        <option value="">Pilih Kelas</option>
                        <option value="XII TKJ 1">XII TKJ 1</option>
                        <option value="XII TKJ 2">XII TKJ 2</option>
                        <option value="XII DKV">XII DKV</option>
                        <option value="XII AK">XII AK</option>
                        <option value="XII BC">XII BC</option>
                        <option value="XII MPLB">XII MPLB</option>
                        <option value="XII BD">XII BD</option>
                      </select>
                  </div>
                  <div className="flex gap-4 pt-4">
                     <button type="submit" className="flex-1 btn-primary h-12 uppercase text-[11px] tracking-widest font-bold">
                        {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : editingId ? 'Simpan Data' : 'Daftarkan Siswa'}
                     </button>
                  </div>
               </form>
            </motion.div>
         </div>
      )}
    </div>
  );
};

export default StudentManagement;
