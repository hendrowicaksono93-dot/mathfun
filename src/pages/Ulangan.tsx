import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { 
  aljabarQuestions, 
  bilanganBulatQuestions, 
  plsvQuestions, 
  aritmatikaSosialQuestions, 
  perbandinganQuestions, 
  unsurGeometriQuestions,
  pythagorasQuestions,
  bangunDatarQuestions,
  statistikaQuestions,
  menyederhanakanAljabarQuestions,
  himpunanQuestions,
  relasiFungsiQuestions,
  persamaanGarisLurusQuestions,
  bangunRuangSisiDatarQuestions,
  barisanDeretQuestions,
  lingkaranQuestions,
  spldvQuestions,
  geometriKesebangunanQuestions,
  bangunRuangSisiLengkungQuestions,
  transformasiGeometriQuestions,
  peluangQuestions
} from '../lib/data';
import { topics } from '../lib/topics';

export default function Ulangan() {
  const { topicId } = useParams();
  const { user } = useAuth();
  const currentTopic = topics.find(t => t.id === topicId) || topics[0];
  
  let quizQuestions = bilanganBulatQuestions;
  switch (currentTopic.id) {
    case 'aljabar': quizQuestions = aljabarQuestions; break;
    case 'plsv-ptlsv': quizQuestions = plsvQuestions; break;
    case 'aritmatika-sosial': quizQuestions = aritmatikaSosialQuestions; break;
    case 'perbandingan': quizQuestions = perbandinganQuestions; break;
    case 'unsur-geometri': quizQuestions = unsurGeometriQuestions; break;
    case 'pythagoras': quizQuestions = pythagorasQuestions; break;
    case 'bangun-datar': quizQuestions = bangunDatarQuestions; break;
    case 'statistika': quizQuestions = statistikaQuestions; break;
    case 'menyederhanakan-aljabar': quizQuestions = menyederhanakanAljabarQuestions; break;
    case 'himpunan': quizQuestions = himpunanQuestions; break;
    case 'relasi-fungsi': quizQuestions = relasiFungsiQuestions; break;
    case 'persamaan-garis-lurus': quizQuestions = persamaanGarisLurusQuestions; break;
    case 'bangun-ruang-sisi-datar': quizQuestions = bangunRuangSisiDatarQuestions; break;
    case 'barisan-deret': quizQuestions = barisanDeretQuestions; break;
    case 'lingkaran': quizQuestions = lingkaranQuestions; break;
    case 'spldv': quizQuestions = spldvQuestions; break;
    case 'geometri-kesebangunan': quizQuestions = geometriKesebangunanQuestions; break;
    case 'bangun-ruang-sisi-lengkung': quizQuestions = bangunRuangSisiLengkungQuestions; break;
    case 'transformasi-geometri': quizQuestions = transformasiGeometriQuestions; break;
    case 'peluang': quizQuestions = peluangQuestions; break;
    default: quizQuestions = bilanganBulatQuestions;
  }

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [scoreInfo, setScoreInfo] = useState({ pg: 0, isian: 0, total: 0 });

  const handlePgChange = (id: string, value: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleIsianChange = (id: string, value: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    // Determine missing answers
    const missing = quizQuestions.filter(q => !answers[q.id] || answers[q.id].trim() === '');
    if (missing.length > 0 && !window.confirm(`Ada ${missing.length} soal yang belum dijawab. Yakin ingin mengumpulkan?`)) {
      return;
    }

    let pgCorrect = 0;
    let isianCorrect = 0;

    quizQuestions.forEach(q => {
      if (q.type === 'pg') {
        if (answers[q.id] === q.answer) pgCorrect++;
      } else {
        // loose match for isian (ignore spaces)
        let ans = (answers[q.id] || '').toString().trim().toLowerCase();
        let correct = q.answer.toString().trim().toLowerCase();
        if (ans === correct) isianCorrect++;
      }
    });

    const pgScore = (100 / 10) * pgCorrect;
    const finalScore = ((pgCorrect * 6) + (isianCorrect * 8));

    setScoreInfo({ pg: pgCorrect, isian: isianCorrect, total: finalScore });
    setSubmitted(true);
    
    // Simpan ke Supabase jika URL & Key tersedia
    saveScoreToSupabase(finalScore, pgCorrect, isianCorrect);

    if (finalScore >= 75) {
      triggerConfetti();
    }
  };

  const saveScoreToSupabase = async (total: number, pg: number, isian: number) => {
    if (!supabase) {
      console.warn('Skor tidak disimpan: Supabase belum dikonfigurasi.');
      return;
    }

    try {
      setIsSaving(true);
      const name = user?.user_metadata.full_name || user?.email || 'Siswa Anonim';
      
      const { error } = await supabase.from('scores').insert([
        {
          user_id: user?.id || null,
          full_name: name,
          topic_id: topicId,
          topic_name: currentTopic.name,
          score: total,
          correct_pg: pg,
          correct_isian: isian,
          created_at: new Date().toISOString(),
        }
      ]);

      if (error) throw error;
      console.log('Skor berhasil disimpan ke Supabase!');
    } catch (err) {
      console.error('Gagal menyimpan skor:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const resetQuiz = () => {
    if(window.confirm('Yakin ingin mereset ulangan? Semua jawaban akan dihapus.')) {
        setAnswers({});
        setSubmitted(false);
        setScoreInfo({ pg: 0, isian: 0, total: 0 });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  const pgQuestions = quizQuestions.filter(q => q.type === 'pg');
  const isianQuestions = quizQuestions.filter(q => q.type === 'isian');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Ulangan Harian - {currentTopic.name}</h1>
          <p className="text-slate-500 text-sm mt-1">Kerjakan 10 soal pilihan ganda dan 5 isian singkat dengan teliti.</p>
        </div>
      </div>

      {submitted && (
        <div className="bg-indigo-900 border border-indigo-800 text-white rounded-xl p-6 md:p-8 mb-8 text-center shadow-lg animate-in zoom-in-95 duration-500 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-1">Nilai Akhir</h2>
            <div className="text-5xl md:text-6xl font-black mb-6 text-white">{scoreInfo.total}</div>
            
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6 bg-indigo-950/50 border border-indigo-800 p-4 rounded-xl">
               <div>
                 <p className="text-indigo-300 text-xs uppercase tracking-wider mb-1">Pilihan Ganda</p>
                 <p className="text-lg font-bold text-white">{scoreInfo.pg} <span className="text-xs font-normal text-indigo-400">/ 10 Benar</span></p>
               </div>
               <div>
                 <p className="text-indigo-300 text-xs uppercase tracking-wider mb-1">Isian Singkat</p>
                 <p className="text-lg font-bold text-white">{scoreInfo.isian} <span className="text-xs font-normal text-indigo-400">/ 5 Benar</span></p>
               </div>
            </div>
            
            {scoreInfo.total >= 75 ? (
                <p className="text-sm font-medium text-emerald-400">🎉 Luar Biasa! Kamu sudah menguasai materi ini.</p>
            ) : (
                <p className="text-sm font-medium text-amber-400">💪 Jangan menyerah! Pelajari lagi materinya ya.</p>
            )}
            
            {isSaving && (
              <p className="text-[10px] text-indigo-400 mt-2 italic animate-pulse">Menyimpan skor ke database...</p>
            )}

            <button onClick={resetQuiz} className="mt-6 px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-500 transition-colors shadow-sm">Ulangi Tes</button>
          </div>
        </div>
      )}

      {/* Bagian A: Pilihan Ganda */}
      <div className="mb-8">
        <div className="bg-slate-50 py-3 px-5 rounded-t-xl border border-slate-200 border-b-0 space-y-1">
           <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Bagian A: Pilihan Ganda</h2>
        </div>
        <div className="bg-white rounded-b-xl p-5 md:p-6 border border-slate-200 shadow-sm space-y-6">
           {pgQuestions.map((q, idx) => {
             const userAnswer = answers[q.id];
             const isCorrect = userAnswer === q.answer;

             return (
               <div key={q.id} className={`p-4 md:p-5 rounded-xl border transition-all ${submitted ? (isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200') : 'bg-slate-50 border-slate-200 hover:border-indigo-300'}`}>
                 <div className="flex gap-4">
                    <span className="bg-indigo-100 text-indigo-800 text-sm font-bold w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-sm font-semibold text-slate-800">{q.question}</p>
                        <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${q.difficulty === 'Mudah' ? 'bg-emerald-100 text-emerald-700' : q.difficulty === 'Sedang' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{q.difficulty}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {q.options?.map(opt => (
                           <label key={opt} className={`flex items-center px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                              userAnswer === opt 
                              ? (submitted ? (isCorrect ? 'bg-emerald-100 border-emerald-400' : 'bg-rose-100 border-rose-400') : 'bg-indigo-50 border-indigo-400 ring-1 ring-indigo-200')
                              : (submitted && opt === q.answer ? 'bg-emerald-100 border-emerald-400' : 'bg-white border-slate-200 hover:bg-slate-50')
                           }`}>
                             <input 
                               type="radio" 
                               name={q.id} 
                               value={opt} 
                               checked={userAnswer === opt} 
                               onChange={() => handlePgChange(q.id, opt)}
                               disabled={submitted}
                               className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 mr-2"
                             />
                             <span className={`text-sm text-slate-700 ${submitted && opt === q.answer ? 'font-bold text-emerald-800' : ''}`}>{opt}</span>
                           </label>
                        ))}
                      </div>
                      
                      {submitted && !isCorrect && (
                         <div className="mt-3 p-3 bg-white/60 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium">
                           💡 Jawaban Benar: <strong className="font-mono text-sm">{q.answer}</strong>
                         </div>
                      )}
                    </div>
                 </div>
               </div>
             )
           })}
        </div>
      </div>

      {/* Bagian B: Isian Singkat */}
      <div className="mb-8">
        <div className="bg-slate-50 py-3 px-5 rounded-t-xl border border-slate-200 border-b-0 space-y-1">
           <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Bagian B: Isian Singkat</h2>
        </div>
        <div className="bg-white rounded-b-xl p-5 md:p-6 border border-slate-200 shadow-sm space-y-6">
           {isianQuestions.map((q, idx) => {
             const userAnswer = answers[q.id] || '';
             const isCorrect = submitted && (userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase());

             return (
                <div key={q.id} className={`p-4 md:p-5 rounded-xl border transition-all ${submitted ? (isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200') : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex gap-4">
                      <span className="bg-slate-200 text-slate-800 text-sm font-bold w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <p className="text-sm font-semibold text-slate-800">{q.question}</p>
                          <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${q.difficulty === 'Mudah' ? 'bg-emerald-100 text-emerald-700' : q.difficulty === 'Sedang' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{q.difficulty}</span>
                        </div>
                        
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => handleIsianChange(q.id, e.target.value)}
                          disabled={submitted}
                          placeholder={submitted ? '' : "Ketik jawabanmu..."}
                          className={`w-full max-w-xs px-3 py-2 border rounded-lg font-mono text-sm transition-colors focus:outline-none focus:ring-1 ${
                             submitted 
                              ? (isCorrect ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-rose-100 border-rose-400 text-rose-800')
                              : 'bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 text-slate-800'
                          }`}
                        />

                        {submitted && !isCorrect && (
                           <div className="mt-3 p-3 bg-white/60 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium inline-block w-full max-w-xs">
                             💡 Jawaban Benar: <strong className="font-mono text-sm">{q.answer}</strong>
                           </div>
                        )}
                      </div>
                  </div>
                </div>
             );
           })}
        </div>
      </div>

      {!submitted && (
        <div className="sticky bottom-6 flex justify-end">
           <button 
             onClick={handleSubmit} 
             className="bg-indigo-600 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition-all w-full md:w-auto text-center"
           >
             Kumpulkan Jawaban
           </button>
        </div>
      )}

    </div>
  );
}
