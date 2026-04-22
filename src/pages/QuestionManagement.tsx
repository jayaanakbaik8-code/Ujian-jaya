import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Question, Exam } from '../types';
import { 
  Database, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Paperclip,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const QuestionManagement = () => {
  const [searchParams] = useSearchParams();
  const examId = searchParams.get('examId');
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '', '']); // A, B, C, D, E
  const [correctIndex, setCorrectIndex] = useState(0);

  useEffect(() => {
    if (!examId) {
      navigate('/app/exams');
      return;
    }
    fetchData();
  }, [examId]);

  const fetchData = async () => {
    setLoading(true);
    // Fetch Exam Info
    const { data: examData } = await supabase.from('exams').select('*').eq('id', examId).single();
    setExam(examData);

    // Fetch Questions
    const { data: qData } = await supabase.from('questions').select('*').eq('exam_id', examId).order('created_at', { ascending: true });
    setQuestions(qData || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examId || !questionText.trim()) return;

    setLoading(true);
    const { error } = await supabase.from('questions').insert([{
      exam_id: examId,
      question_text: questionText,
      options: options.filter(o => o.trim() !== ''),
      correct_answer_index: correctIndex
    }]);

    if (error) alert(error.message);
    else {
      setIsAdding(false);
      setQuestionText('');
      setOptions(['', '', '', '', '']);
      setCorrectIndex(0);
      fetchData();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus soal ini?')) return;
    await supabase.from('questions').delete().eq('id', id);
    fetchData();
  };

  if (!exam && !loading) return <div className="p-10 text-center font-bold">Ujian tidak ditemukan.</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-6">
         <button onClick={() => navigate('/app/exams')} className="p-3 bg-white border border-border-subtle rounded-xl hover:bg-slate-50 text-text-dim hover:text-primary transition-all">
            <ChevronLeft size={20} />
         </button>
         <div>
            <h1 className="text-2xl font-bold text-text-main m-0 tracking-tight">{exam?.title}</h1>
            <p className="text-sm text-text-dim mt-1 font-medium flex items-center gap-2 italic">
               <Database size={14} className="text-primary" />
               Bank Soal • {questions.length} Pertanyaan Terdaftar
            </p>
         </div>
      </div>

      <div className="grid gap-6">
         {/* Add Form */}
         <AnimatePresence>
            {isAdding ? (
               <motion.div 
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="card p-8 bg-white border border-primary/20 shadow-subtle"
               >
                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Isi Pertanyaan</label>
                        <textarea 
                          value={questionText} 
                          onChange={e => setQuestionText(e.target.value)}
                          className="input-field h-32 py-4 text-base font-bold" 
                          placeholder="Ketik pertanyaan disini..."
                          required
                        />
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1">Pilihan Jawaban (A-E)</label>
                        <div className="grid gap-3">
                           {options.map((option, idx) => (
                              <div key={idx} className="flex gap-3 items-center">
                                 <div 
                                   onClick={() => setCorrectIndex(idx)}
                                   className={cn(
                                     "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-all border text-sm font-bold",
                                     correctIndex === idx 
                                       ? "bg-primary border-primary text-white shadow-subtle" 
                                       : "bg-slate-50 border-border-subtle text-slate-400 hover:border-primary/40"
                                   )}
                                 >
                                    {String.fromCharCode(65 + idx)}
                                 </div>
                                 <input 
                                   type="text" 
                                   value={option}
                                   onChange={e => {
                                      const next = [...options];
                                      next[idx] = e.target.value;
                                      setOptions(next);
                                   }}
                                   className={cn(
                                      "input-field h-11 text-sm font-medium",
                                      correctIndex === idx && "border-primary/30 ring-1 ring-primary/5"
                                   )}
                                   placeholder={`Pilihan ${String.fromCharCode(65 + idx)}...`}
                                   required={idx < 2}
                                 />
                                 {correctIndex === idx && (
                                    <div className="text-primary font-bold uppercase text-[9px] tracking-widest italic flex items-center gap-1 shrink-0 px-2 py-1 bg-red-50/50 rounded border border-primary/10">
                                       <Check size={12} />
                                       Kunci
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="flex gap-4 pt-4 border-t border-slate-50">
                        <button type="submit" disabled={loading} className="flex-1 btn-primary h-12 uppercase text-[11px] tracking-widest font-bold">
                           {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : (
                              <span className="flex items-center justify-center gap-2">
                                 Simpan Soal
                                 <Plus size={16} />
                              </span>
                           )}
                        </button>
                        <button type="button" onClick={() => setIsAdding(false)} className="px-6 h-12 text-text-dim text-[11px] uppercase tracking-widest font-bold border border-border-subtle rounded-lg hover:bg-slate-50 transition-all">Batal</button>
                     </div>
                  </form>
               </motion.div>
            ) : (
               <button 
                 onClick={() => setIsAdding(true)}
                 className="p-10 bg-white border border-dashed border-border-subtle rounded-2xl hover:border-primary/40 text-text-dim hover:text-primary transition-all flex flex-col items-center justify-center gap-3 group"
               >
                  <div className="w-12 h-12 bg-slate-50 group-hover:bg-primary/5 rounded-xl flex items-center justify-center transition-colors border border-border-subtle group-hover:border-primary/20">
                     <Plus size={24} />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest">Tambah Pertanyaan Baru</span>
               </button>
            )}
         </AnimatePresence>

         {/* Question List */}
         <div className="space-y-4">
            {questions.map((q, qIdx) => (
               <motion.div 
                 layout
                 key={q.id} 
                 className="card p-6 bg-white border border-border-subtle shadow-subtle hover:border-primary/10 transition-all"
               >
                  <div className="flex justify-between items-start gap-6 mb-4">
                     <div className="flex gap-3">
                        <div className="w-8 h-8 bg-slate-900 text-white rounded font-bold italic text-sm flex items-center justify-center shrink-0">
                           {qIdx + 1}
                        </div>
                        <h4 className="text-base font-bold text-text-main leading-relaxed">{q.question_text}</h4>
                     </div>
                     <button onClick={() => handleDelete(q.id)} className="p-2 text-text-dim hover:text-primary transition-all shrink-0">
                        <Trash2 size={16} />
                     </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2.5 pl-11">
                     {q.options.map((opt, oIdx) => (
                        <div 
                           key={oIdx} 
                           className={cn(
                             "p-3 rounded-lg border flex items-center gap-3 transition-all",
                             q.correct_answer_index === oIdx 
                               ? "bg-green-50 border-green-200 text-green-700" 
                               : "bg-slate-50/30 border-border-subtle text-text-dim"
                           )}
                        >
                           <div className={cn(
                             "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0 border",
                             q.correct_answer_index === oIdx 
                               ? "bg-green-500 border-green-600 text-white" 
                               : "bg-white border-border-subtle text-slate-400"
                           )}>
                              {String.fromCharCode(65 + oIdx)}
                           </div>
                           <span className={cn(
                             "text-xs font-medium",
                             q.correct_answer_index === oIdx ? "font-bold" : ""
                           )}>{opt}</span>
                        </div>
                     ))}
                  </div>
               </motion.div>
            ))}
         </div>
      </div>
      
      {questions.length > 0 && !isAdding && (
         <div className="flex justify-center py-10">
            <div className="p-6 bg-slate-900 rounded-3xl text-white flex items-center gap-6 shadow-subtle relative overflow-hidden group border border-white/5">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/5">
                  <Check size={24} className="text-primary" />
               </div>
               <div>
                  <h5 className="text-sm font-bold uppercase tracking-widest mb-1 italic">Semua Sudah OK?</h5>
                  <p className="text-slate-400 font-medium text-[11px] leading-relaxed italic">Cek kembali seluruh butir pertanyaan dan kunci jawaban.</p>
               </div>
               <button onClick={() => navigate('/app/exams')} className="px-6 h-11 bg-primary text-white font-bold uppercase tracking-widest text-[10px] rounded-lg shadow-primary/20 hover:scale-[1.02] transition-all">Selesai</button>
            </div>
         </div>
      )}
    </div>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

export default QuestionManagement;
