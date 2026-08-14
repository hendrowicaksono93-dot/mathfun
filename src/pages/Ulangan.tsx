import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { KeyRound, Lock, ShieldAlert, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { db, collection, addDoc } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { appendScoreToSheet, getUlanganPin, getGuruPin, getScriptUrl, getTopicPinsFromStorage, setTopicPinInStorage } from '../lib/sheets';
import { getBankSoalFromFirestore, saveBankSoalToFirestore, QuestionItem } from '../lib/bankSoalService';
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
  
  let defaultPresetQuestions = bilanganBulatQuestions;
  switch (currentTopic.id) {
    case 'aljabar': defaultPresetQuestions = aljabarQuestions; break;
    case 'plsv-ptlsv': defaultPresetQuestions = plsvQuestions; break;
    case 'aritmatika-sosial': defaultPresetQuestions = aritmatikaSosialQuestions; break;
    case 'perbandingan': defaultPresetQuestions = perbandinganQuestions; break;
    case 'unsur-geometri': defaultPresetQuestions = unsurGeometriQuestions; break;
    case 'pythagoras': defaultPresetQuestions = pythagorasQuestions; break;
    case 'bangun-datar': defaultPresetQuestions = bangunDatarQuestions; break;
    case 'statistika': defaultPresetQuestions = statistikaQuestions; break;
    case 'menyederhanakan-aljabar': defaultPresetQuestions = menyederhanakanAljabarQuestions; break;
    case 'himpunan': defaultPresetQuestions = himpunanQuestions; break;
    case 'relasi-fungsi': defaultPresetQuestions = relasiFungsiQuestions; break;
    case 'persamaan-garis-lurus': defaultPresetQuestions = persamaanGarisLurusQuestions; break;
    case 'bangun-ruang-sisi-datar': defaultPresetQuestions = bangunRuangSisiDatarQuestions; break;
    case 'barisan-deret': defaultPresetQuestions = barisanDeretQuestions; break;
    case 'lingkaran': defaultPresetQuestions = lingkaranQuestions; break;
    case 'spldv': defaultPresetQuestions = spldvQuestions; break;
    case 'geometri-kesebangunan': defaultPresetQuestions = geometriKesebangunanQuestions; break;
    case 'bangun-ruang-sisi-lengkung': defaultPresetQuestions = bangunRuangSisiLengkungQuestions; break;
    case 'transformasi-geometri': defaultPresetQuestions = transformasiGeometriQuestions; break;
    case 'peluang': defaultPresetQuestions = peluangQuestions; break;
    default: defaultPresetQuestions = bilanganBulatQuestions;
  }

  const navigate = useNavigate();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [checkingOnlinePin, setCheckingOnlinePin] = useState(false);

  const [customQuestions, setCustomQuestions] = useState<QuestionItem[] | null>(null);
  const [isFromFirestore, setIsFromFirestore] = useState<boolean>(false);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(true);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [scoreInfo, setScoreInfo] = useState({ pg: 0, isian: 0, total: 0 });

  const quizQuestions = (customQuestions && customQuestions.length > 0) ? customQuestions : defaultPresetQuestions;

  // Load questions from Firebase Firestore first, with fallback to live Apps Script
  useEffect(() => {
    let isMounted = true;
    async function loadQuestions() {
      setLoadingQuestions(true);
      
      // 1. Try Firestore
      const fsQuestions = await getBankSoalFromFirestore(currentTopic.id);
      if (isMounted && fsQuestions && fsQuestions.length > 0) {
        setCustomQuestions(fsQuestions);
        setIsFromFirestore(true);
        setLoadingQuestions(false);
        return;
      }

      // 2. Fallback: try live Apps Script if available
      const scriptUrl = getScriptUrl();
      if (scriptUrl) {
        try {
          const res = await fetch(`${scriptUrl}?action=get_bank_soal`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'success' && data.bankSoal) {
              // Look for currentTopic.id or slugified keys
              const topicKeys = Object.keys(data.bankSoal);
              const targetKey = topicKeys.find(k => k.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') === currentTopic.id);
              if (targetKey && data.bankSoal[targetKey] && data.bankSoal[targetKey].length > 0) {
                const fetchedQuestions = data.bankSoal[targetKey];
                if (isMounted) {
                  setCustomQuestions(fetchedQuestions);
                  setIsFromFirestore(true);
                }
                // Save to Firestore in background
                saveBankSoalToFirestore(currentTopic.id, fetchedQuestions);
                if (isMounted) setLoadingQuestions(false);
                return;
              }
            }
          }
        } catch (e) {
          console.warn('Live fetch bank soal error:', e);
        }
      }

      if (isMounted) {
        setCustomQuestions(null);
        setIsFromFirestore(false);
        setLoadingQuestions(false);
      }
    }

    loadQuestions();
    return () => { isMounted = false; };
  }, [currentTopic.id]);

  // Automatically unlock if in Guru mode
  useEffect(() => {
    const isGuru = new URLSearchParams(window.location.search).get('guru') === 'true' ||
                   new URLSearchParams(window.location.search).get('admin') === 'true' ||
                   Boolean(user?.email && (user.email.includes('guru') || user.email.includes('admin')));
    if (isGuru) {
      setIsUnlocked(true);
    }

    // Pre-fetch topic PINs from Apps Script if scriptUrl is present
    const scriptUrl = getScriptUrl();
    if (scriptUrl) {
      fetch(`${scriptUrl}?action=get_topic_pins`)
        .then(res => res.json())
        .then(data => {
          if (data && data.status === 'success' && data.pins) {
            Object.keys(data.pins).forEach(tId => {
              if (data.pins[tId]) {
                setTopicPinInStorage(tId.toLowerCase(), String(data.pins[tId]));
              }
            });
          }
        })
        .catch(err => console.warn('Gagal pre-fetch topic PINs:', err));
    }
  }, [user, topicId]);

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    const cleanInput = pinInput.trim().toLowerCase();
    const cleanTopicId = topicId.toLowerCase();
    const localUlanganPin = getUlanganPin().trim().toLowerCase();
    const localGuruPin = getGuruPin().trim().toLowerCase();
    
    // Topic specific local PIN
    const topicPins = getTopicPinsFromStorage();
    const specificTopicPin = (topicPins[cleanTopicId] || topicPins[topicId] || '').trim().toLowerCase();

    // 1. Check local / default / topic pins
    if (
      (specificTopicPin && cleanInput === specificTopicPin) ||
      cleanInput === localUlanganPin || 
      cleanInput === localGuruPin || 
      cleanInput === '1234' || 
      cleanInput === 'guru' || 
      cleanInput === 'admin'
    ) {
      setIsUnlocked(true);
      return;
    }

    // 2. Check online PIN via Apps Script webhook if available
    const scriptUrl = getScriptUrl();
    if (scriptUrl) {
      try {
        setCheckingOnlinePin(true);
        // First try getting topic specific PIN
        const res = await fetch(`${scriptUrl}?action=get_topic_pins`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'success' && data.pins) {
            // Save all pins locally
            Object.entries(data.pins).forEach(([k, v]) => {
              if (v) setTopicPinInStorage(k.toLowerCase(), String(v));
            });

            // Find matching pin for current topic
            const rawPin = data.pins[topicId] || data.pins[cleanTopicId];
            const onlineTopicPin = rawPin ? String(rawPin).trim().toLowerCase() : '';

            if (onlineTopicPin && cleanInput === onlineTopicPin) {
              setIsUnlocked(true);
              setCheckingOnlinePin(false);
              return;
            }
          }
          if (data.status === 'success' && data.ulanganPin) {
            const globalOnlinePin = String(data.ulanganPin).trim().toLowerCase();
            if (cleanInput === globalOnlinePin) {
              setIsUnlocked(true);
              setCheckingOnlinePin(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Gagal memverifikasi PIN secara online:', err);
      } finally {
        setCheckingOnlinePin(false);
      }
    }

    setPinError(`PIN Ulangan Harian untuk materi "${currentTopic.name}" tidak cocok. Silakan tanyakan PIN materi ini kepada Guru.`);
  };

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
        let ans = (answers[q.id] || '').toString().trim().toLowerCase();
        let correct = q.answer.toString().trim().toLowerCase();
        if (ans === correct) isianCorrect++;
      }
    });

    const finalScore = ((pgCorrect * 6) + (isianCorrect * 8));

    setScoreInfo({ pg: pgCorrect, isian: isianCorrect, total: finalScore });
    setSubmitted(true);
    
    // Simpan ke Firebase Firestore & Google Spreadsheet
    saveScoreToFirebaseAndSheets(finalScore, pgCorrect, isianCorrect);

    if (finalScore >= 75) {
      triggerConfetti();
    }
  };

  const saveScoreToFirebaseAndSheets = async (total: number, pg: number, isian: number) => {
    try {
      setIsSaving(true);
      setSaveStatus('Menyimpan nilai ke Firebase Firestore...');
      
      const name = user?.fullName || 'Siswa Anonim';
      const email = user?.email || 'siswa@example.com';
      const nowStr = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

      // 1. Simpan ke Firebase Firestore
      try {
        await addDoc(collection(db, 'scores'), {
          userId: user?.uid || null,
          fullName: name,
          email: email,
          topicId: topicId,
          topicName: currentTopic.name,
          score: total,
          correctPilihan: pg,
          correctIsian: isian,
          createdAt: new Date().toISOString(),
        });
      } catch (fsErr) {
        console.warn('Simpan Firestore offline/tertunda:', fsErr);
      }

      setSaveStatus('Mencatat nilai ke Google Spreadsheet...');

      // 2. Simpan ke Google Spreadsheet
      const sheetRes = await appendScoreToSheet({
        fullName: name,
        email: email,
        topicName: currentTopic.name,
        score: total,
        correctPilihan: pg,
        correctIsian: isian,
        createdAt: nowStr,
      });

      if (sheetRes.success) {
        setSaveStatus('✅ Nilai berhasil disimpan di Firebase & Google Sheet!');
      } else {
        setSaveStatus(`✅ Nilai tersimpan di Firebase. (${sheetRes.message})`);
      }
    } catch (err: any) {
      console.error('Gagal menyimpan skor:', err);
      setSaveStatus(`⚠️ Gagal menyimpan: ${err.message || 'Cek koneksi internet'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const resetQuiz = () => {
    if(window.confirm('Yakin ingin mereset ulangan? Semua jawaban akan dihapus.')) {
        setAnswers({});
        setSubmitted(false);
        setSaveStatus('');
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

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 md:p-8 bg-white border border-slate-200 rounded-3xl shadow-xl animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-indigo-600 shadow-sm">
          <KeyRound className="w-8 h-8" />
        </div>
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">PIN Akses Ulangan Harian</h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Materi: <strong className="text-indigo-700">{currentTopic.name}</strong><br/>
            Silakan masukkan PIN Ulangan Harian yang diberikan oleh Guru untuk memulai tes.
          </p>
        </div>

        <form onSubmit={handleVerifyPin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              PIN Ulangan Harian
            </label>
            <div className="relative">
              <input
                type="text"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Contoh: 1234"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                autoFocus
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>
            {pinError && (
              <p className="text-xs font-semibold text-rose-600 mt-2 bg-rose-50 p-2.5 rounded-lg border border-rose-100 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={checkingOnlinePin || !pinInput.trim()}
            className="w-full py-3.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {checkingOnlinePin ? 'Memeriksa PIN...' : 'Mulai Kerjakan Tes'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-medium flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span>Ulangan Harian - {currentTopic.name}</span>
            {isFromFirestore && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                ☁️ Live Firebase
              </span>
            )}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {loadingQuestions 
              ? 'Memuat soal dari Firebase Firestore...' 
              : `Kerjakan ${pgQuestions.length} soal pilihan ganda dan ${isianQuestions.length} isian singkat dengan teliti.`}
          </p>
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
            
            {saveStatus && (
              <p className="text-xs text-indigo-200 mt-3 font-medium bg-indigo-950/80 px-4 py-2 rounded-lg border border-indigo-700/50 inline-block">
                {saveStatus}
              </p>
            )}

            <div>
              <button onClick={resetQuiz} className="mt-6 px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-500 transition-colors shadow-sm">Ulangi Tes</button>
            </div>
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
