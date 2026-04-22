import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';
import { 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Shield, 
  Trash2, 
  Edit3,
  Loader2,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('SISWA');

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching users:', error);
    else setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      alert('Error updating role: ' + error.message);
    } else {
      setEditingId(null);
      fetchUsers();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini secara permanen?')) return;

    // Hard delete from profiles (Auth deletion requires service role / edge function)
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) alert('Error: ' + error.message);
    else fetchUsers();
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-text-main m-0 tracking-tight">Manajemen User</h1>
           <p className="text-sm text-text-dim mt-1 font-medium">Kelola sinkronisasi akun supabase & profil sekolah.</p>
        </div>
        <button className="btn-primary">
           + Tambah User
        </button>
      </div>

      <div className="card shadow-subtle border border-border-subtle bg-white">
         <div className="p-5 border-b border-border-subtle flex justify-between items-center bg-slate-50/30">
            <h3 className="text-[11px] font-bold text-text-main uppercase tracking-widest italic">Daftar Akun Terdaftar</h3>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
               <input 
                 type="text" 
                 className="input-field pl-9 py-1.5 h-auto text-xs w-64" 
                 placeholder="Cari user..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 border-b border-border-subtle">
                     <th className="px-6 py-4 text-[10px] font-bold text-text-dim uppercase tracking-widest">User Info</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-text-dim uppercase tracking-widest">Status Role</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-text-dim uppercase tracking-widest">Dibuat Pada</th>
                     <th className="px-6 py-4 text-center text-[10px] font-bold text-text-dim uppercase tracking-widest">Aksi</th>
                  </tr>
               </thead>
               <tbody>
                  <AnimatePresence>
                    {loading ? (
                       <tr>
                          <td colSpan={4} className="px-6 py-20 text-center">
                             <Loader2 size={32} className="animate-spin text-primary mx-auto mb-3" />
                             <p className="text-text-dim font-bold uppercase tracking-widest text-[10px]">Memuat Data...</p>
                          </td>
                       </tr>
                    ) : filteredUsers.length === 0 ? (
                       <tr>
                          <td colSpan={4} className="px-6 py-20 text-center text-text-dim font-medium text-sm">
                             Tidak ada user ditemukan.
                          </td>
                       </tr>
                    ) : filteredUsers.map((user) => (
                       <motion.tr 
                         key={user.id} 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className="border-b border-border-subtle last:border-0 hover:bg-slate-50/50 transition-colors"
                       >
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                   {user.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                   <p className="font-bold text-text-main text-sm">{user.full_name}</p>
                                   <p className="text-xs text-text-dim">{user.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             {editingId === user.id ? (
                                <div className="flex items-center gap-2">
                                   <select 
                                     className="input-field py-1 px-2 text-xs font-bold w-32"
                                     value={newRole}
                                     onChange={(e) => setNewRole(e.target.value as UserRole)}
                                   >
                                      <option value="ADMIN">ADMIN</option>
                                      <option value="GURU">GURU</option>
                                      <option value="TENEGA_KEPENDIDIKAN">STAF</option>
                                      <option value="SISWA">SISWA</option>
                                   </select>
                                   <button 
                                     onClick={() => handleUpdateRole(user.id)}
                                     className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                   >
                                      <Check size={14} />
                                   </button>
                                   <button 
                                     onClick={() => setEditingId(null)}
                                     className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                   >
                                      <X size={14} />
                                   </button>
                                </div>
                             ) : (
                                <span className={cn(
                                   "badge-base",
                                   user.role === 'ADMIN' ? "bg-red-50 text-primary border border-primary/10" : "bg-slate-100 text-slate-600 border border-slate-200"
                                )}>
                                   {user.role}
                                </span>
                             )}
                          </td>
                          <td className="px-6 py-4">
                             <p className="text-xs text-text-dim font-medium">
                                {new Date(user.created_at).toLocaleDateString('id-ID', {
                                   day: 'numeric',
                                   month: 'short',
                                   year: 'numeric'
                                })}
                             </p>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => {
                                    setEditingId(user.id);
                                    setNewRole(user.role);
                                  }}
                                  className="p-2 text-text-dim hover:text-primary transition-all"
                                >
                                   <Edit3 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-2 text-text-dim hover:text-primary transition-all"
                                >
                                   <Trash2 size={16} />
                                </button>
                             </div>
                          </td>
                       </motion.tr>
                    ))}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>
      </div>

      <div className="p-5 bg-red-50 border border-primary/10 rounded-xl flex items-start gap-4">
         <Shield size={20} className="text-primary mt-0.5 shrink-0" />
         <div className="space-y-1">
            <h4 className="font-bold text-primary uppercase tracking-widest text-[10px]">Informasi Keamanan</h4>
            <p className="text-xs font-semibold text-primary/70 leading-relaxed italic">
               Role "ADMIN" memiliki akses penuh ke seluruh database. Pastikan hanya personil yang berwenang yang memiliki role ini. Perubahan role akan berdampak langsung pada menu navigasi user tersebut.
            </p>
         </div>
      </div>
    </div>
  );
};

const cn = (...inputs: any[]) => {
  return inputs.filter(Boolean).join(' ');
}

export default UserManagement;
