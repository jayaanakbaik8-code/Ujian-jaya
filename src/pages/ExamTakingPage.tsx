import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Question, Exam } from '../types';
import { 
  Timer, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Send,
  Loader2,
  Lock,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ExamTakingPage = () => {
  const { examId } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (examId) fetchExam();
  }, [examId]);

  const fetchExam = async () => {
    setLoading(true);
    // Fetch Exam
    const { data: examData } = await supabase.from('exams').select('*').eq('id', examId).single();
    if (!examData) {
      alert('Ujian tidak ditemukan!');
      navigate('/app');
      return;
    }
    setExam(examData);
    setTimeLeft(examData.duration_minutes * 60);

    // Fetch Questions
    const { data: qData } = await supabase.from('questions').select('*').eq('exam_id', examId).order('created_at', { ascending: true });
    setQuestions(qData || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  // Auto submit when time's up
  useEffect(() => {
    if (started && timeLeft === 0 && !isSubmitting) {
      handleSubmit();
    }
  }, [timeLeft, started]);

  const handleSelect = (qId: string, optIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer_index) {
        correctCount++;
      }
    });
    return Math.round((correctCount / questions.length) * 100);
  };

  const handleSubmit = async () => {
    if (!confirm('Apakah Anda yakin ingin menyelesaikan ujian sekarang?')) return;
    
    setIsSubmitting(true);
    const score = calculateScore();

    const { error } = await supabase.from('results').insert([{
      exam_id: examId,
      student_id: profile?.id,
      score: score,
      answers: answers,
      completed_at: new Date().toISOString()
    }]);

    if (error) {
      if (error.code === '23505') alert('Anda sudah mengikuti ujian ini sebelumnya.');
      else alert('Error submitting: ' + error.message);
    } else {
      alert(`Ujian selesai! Skor Anda: ${score}`);
    }
    setIsSubmitting(false);
    navigate('/app');
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse">MEMUAT UJIAN...</div>;

  if (!started) {
     return (
        <div className="min-h-screen bg-app-bg flex items-center justify-center p-6">
           <div className="card max-w-xl w-full p-10 bg-white shadow-subtle border border-border-subtle space-y-8 flex flex-col items-center">
              <div className="text-center space-y-4">
                 <div className="w-16 h-16 bg-red-100 text-primary rounded-2xl flex items-center justify-center mx-auto border border-primary/10">
                    <Lock size={32} />
                 </div>
                 <div>
                    <h1 className="text-2xl font-bold text-text-main tracking-tight uppercase">{exam?.title}</h1>
                    <p className="text-[10px] font-bold text-text-dim uppercase tracking-[0.2em] mt-1">SMK PRIMA UNGGUL • COMPUTER BASED TEST</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full py-6 border-y border-slate-50">
                 <div className="p-4 bg-slate-50 rounded-xl text-center border border-border-subtle">
                    <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest mb-1">Durasi</p>
                    <p className="text-xl font-bold text-text-main">{exam?.duration_minutes} Menit</p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl text-center border border-border-subtle">
                    <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest mb-1">Butir Soal</p>
                    <p className="text-xl font-bold text-text-main">{questions.length} Soal</p>
                 </div>
              </div>

              <div className="bg-slate-900 border border-border-subtle p-5 rounded-xl flex gap-4 w-full">
                 <AlertCircle size={20} className="text-primary shrink-0 mt-0.5" />
                 <p className="text-[11px] font-medium text-slate-400 leading-relaxed italic">
                    Dilarang membuka tab baru, mencari jawaban di internet, atau bertanya kepada orang lain. Segala bentuk kecurangan akan terekam oleh sistem.
                 </p>
              </div>

              <button 
                onClick={() => setStarted(true)}
                className="w-full btn-primary h-14 uppercase text-[11px] font-bold tracking-widest"
              >
                 Mulai Ujian Sekarang
              </button>
           </div>
        </div>
     );
  }

  const currentQuestion = questions[currentIdx];

  return (
    <div className="min-h-screen bg-app-bg flex flex-col">
      {/* Exam Header */}
      <header className="h-20 bg-white border-b border-border-subtle px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold italic text-sm">PU</div>
           <div>
              <h2 className="text-sm font-bold text-text-main tracking-tight uppercase line-clamp-1">{exam?.title}</h2>
              <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest">Siswa: {profile?.full_name}</p>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <div className={cn(
             "px-4 py-2 rounded-lg flex items-center gap-2 border transition-colors",
             timeLeft < 300 ? "bg-red-50 border-red-100 text-red-600 animate-pulse" : "bg-slate-50 border-border-subtle text-text-main"
           )}>
              <Timer size={16} />
              <span className="text-base font-bold font-mono">{formatTime(timeLeft)}</span>
           </div>
           <button 
             onClick={handleSubmit} 
             disabled={isSubmitting}
             className="px-5 py-2.5 bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2"
           >
              {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <><Send size={14} /> Finish</>}
           </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-72 bg-white border-r border-border-subtle p-6 overflow-y-auto order-2 lg:order-1">
           <h4 className="text-[10px] font-bold text-text-dim uppercase tracking-[0.2em] mb-6 italic">Navigasi Soal</h4>
           <div className="grid grid-cols-5 gap-2">
              {questions.map((_, idx) => (
                 <button
                   key={idx}
                   onClick={() => setCurrentIdx(idx)}
                   className={cn(
                     "aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all border",
                     currentIdx === idx ? "bg-primary border-primary text-white shadow-subtle z-10" :
                     answers[questions[idx].id] !== undefined ? "bg-red-50 border-primary/20 text-primary" : "bg-slate-50 border-border-subtle text-text-dim hover:border-primary/20"
                   )}
                 >
                    {idx + 1}
                 </button>
              ))}
           </div>
           
           <div className="mt-8 p-5 bg-slate-50 rounded-xl border border-border-subtle space-y-3">
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Progress</span>
                 <span className="text-xs font-bold text-text-main">{Object.keys(answers).length} / {questions.length}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                 />
              </div>
           </div>
        </aside>

        {/* Question Area */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 order-1 lg:order-2">
           {currentQuestion && (
              <div className="max-w-3xl mx-auto space-y-10">
                 <motion.div
                   key={currentIdx}
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="space-y-8"
                 >
                    <div className="flex gap-5">
                       <span className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center text-lg font-bold italic shrink-0 border border-white/5">
                          {currentIdx + 1}
                       </span>
                       <h3 className="text-xl font-bold text-text-main leading-relaxed pt-1">
                          {currentQuestion.question_text}
                       </h3>
                    </div>

                    <div className="grid gap-3 pl-0 lg:pl-16">
                       {currentQuestion.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelect(currentQuestion.id, idx)}
                            className={cn(
                              "p-4 rounded-xl border text-left flex items-center gap-4 transition-all group",
                              answers[currentQuestion.id] === idx 
                                ? "bg-white border-primary shadow-subtle ring-1 ring-primary/10" 
                                : "bg-white border-border-subtle hover:border-primary/20"
                            )}
                          >
                             <div className={cn(
                               "w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all border",
                               answers[currentQuestion.id] === idx 
                                 ? "bg-primary border-primary text-white" 
                                 : "bg-slate-50 border-border-subtle text-slate-400 group-hover:text-primary group-hover:border-primary/20"
                             )}>
                                {String.fromCharCode(65 + idx)}
                             </div>
                             <span className={cn(
                               "text-sm font-medium transition-colors",
                               answers[currentQuestion.id] === idx ? "text-text-main font-bold" : "text-text-dim group-hover:text-text-main"
                             )}>{opt}</span>
                          </button>
                       ))}
                    </div>
                 </motion.div>

                 <div className="flex items-center justify-between pt-10 border-t border-border-subtle">
                    <button 
                      onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                      disabled={currentIdx === 0}
                      className="px-6 py-2.5 bg-white border border-border-subtle text-text-dim font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-slate-50 disabled:opacity-30 transition-all flex items-center gap-2"
                    >
                       <ChevronLeft size={16} /> Previous
                    </button>
                    {currentIdx < questions.length - 1 ? (
                       <button 
                         onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                         className="px-6 py-2.5 bg-primary text-white font-bold uppercase tracking-widest text-[10px] rounded-lg shadow-subtle hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                       >
                          Next <ChevronRight size={16} />
                       </button>
                    ) : (
                       <button 
                         onClick={handleSubmit}
                         className="px-6 py-2.5 bg-green-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg shadow-subtle hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                       >
                          Submit <CheckCircle2 size={16} />
                       </button>
                    )}
                 </div>
              </div>
           )}
        </main>
      </div>
    </div>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

export default ExamTakingPage;
