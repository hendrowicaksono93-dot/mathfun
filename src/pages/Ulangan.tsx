import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { KeyRound, Lock, ShieldAlert, ShieldCheck, ArrowLeft, CheckCircle2, AlertTriangle, EyeOff, CameraOff, Check, CheckSquare, Circle, Square, Trophy, RotateCcw, Home, BookOpen, History, RefreshCw, UserCheck } from 'lucide-react';
import { db, collection, addDoc } from '../lib/firebase';
import { useAuth, formatStudentNameWithClass } from '../lib/AuthContext';
import QuestionImage from '../components/QuestionImage';
import { 
  getUserAttemptData, 
  recordUserAttempt, 
  resetUserAttempts, 
  getAllStudentAttempts,
  adjustStudentAttempt,
  UserAttemptData,
  StudentAttemptSummary,
  MAX_ALLOWED_ATTEMPTS
} from '../lib/attemptService';
import { 
  getBankSoalFromFirestore, 
  saveBankSoalToFirestore, 
  getTopicPinsFromFirestore,
  getAppConfigFromFirestore,
  toTopicSlug,
  formatQuestionImageUrl,
  isPgKompleksQuestion,
  isQuestionAnswerCorrect,
  QuestionItem 
} from '../lib/bankSoalService';
import { 
  aljabarQuestions, 
  bilanganBulatQuestions, 
  bilanganRasionalQuestions,
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
import { 
  getScriptUrl, 
  setScriptUrl, 
  getGuruPin, 
  getUlanganPin, 
  getTopicPinsFromStorage, 
  setTopicPinInStorage, 
  appendScoreToSheet 
} from '../lib/sheets';

export default function Ulangan() {
  const { topicId } = useParams();
  const { user } = useAuth();
  const currentTopic = topics.find(t => t.id === topicId) || topics[0];
  
  let defaultPresetQuestions = bilanganBulatQuestions;
  switch (currentTopic.id) {
    case 'bilangan-rasional': defaultPresetQuestions = bilanganRasionalQuestions; break;
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

  // Attempt Limit States (Max 2 Attempts per Account per Topic)
  const isGuru = new URLSearchParams(window.location.search).get('guru') === 'true' || 
    new URLSearchParams(window.location.search).get('admin') === 'true' || 
    Boolean(user?.email && (user.email.includes('guru') || user.email.includes('admin')));

  const [attemptData, setAttemptData] = useState<UserAttemptData>({ count: 0, history: [], isMaxReached: false });
  const [loadingAttempts, setLoadingAttempts] = useState<boolean>(true);
  const [isResettingAttempt, setIsResettingAttempt] = useState<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);

  // Guru Attempt Management for this Topic
  const [showGuruAttemptsModal, setShowGuruAttemptsModal] = useState<boolean>(false);
  const [topicAttemptsList, setTopicAttemptsList] = useState<StudentAttemptSummary[]>([]);
  const [loadingTopicAttempts, setLoadingTopicAttempts] = useState<boolean>(false);
  const [guruActionMsg, setGuruActionMsg] = useState<string>('');
  const [manualResetEmail, setManualResetEmail] = useState<string>('');

  // Load user attempts for current account and topic
  useEffect(() => {
    let isMounted = true;
    async function loadAttempts() {
      if (!user?.uid && !user?.email) {
        setLoadingAttempts(false);
        return;
      }
      setLoadingAttempts(true);
      try {
        const data = await getUserAttemptData(user?.uid || '', currentTopic.id, user?.email);
        if (isMounted) {
          setAttemptData(data);
        }
      } catch (err) {
        console.warn('Gagal memuat status percobaan:', err);
      } finally {
        if (isMounted) {
          setLoadingAttempts(false);
        }
      }
    }
    loadAttempts();
    return () => { isMounted = false; };
  }, [user?.uid, user?.email, currentTopic.id]);

  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [scoreInfo, setScoreInfo] = useState({ pg: 0, isian: 0, total: 0 });
  const [showUnansweredModal, setShowUnansweredModal] = useState<boolean>(false);
  const [unansweredCount, setUnansweredCount] = useState<number>(0);

  // Anti-Cheat States
  const [violationCount, setViolationCount] = useState<number>(0);
  const [warningToast, setWarningToast] = useState<string | null>(null);
  const [isScreenConcealed, setIsScreenConcealed] = useState<boolean>(false);
  const [showViolationModal, setShowViolationModal] = useState<boolean>(false);
  const [lastViolationType, setLastViolationType] = useState<string>('');
  const toastTimeoutRef = useRef<any>(null);

  const showAntiCheatToast = useCallback((msg: string) => {
    setWarningToast(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setWarningToast(null);
    }, 3500);
  }, []);

  const handleTriggerViolation = useCallback((type: 'tab_switch' | 'screenshot' | 'devtools' | 'copy_paste', desc: string) => {
    setViolationCount(prev => prev + 1);
    setLastViolationType(desc);
    showAntiCheatToast(`🛡️ ${desc}`);
    if (type === 'tab_switch' || type === 'screenshot') {
      setShowViolationModal(true);
    }
  }, [showAntiCheatToast]);

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

    // 1. Fetch topic PINs and config directly from Firebase Firestore
    getTopicPinsFromFirestore().then((firestorePins) => {
      if (firestorePins && Object.keys(firestorePins).length > 0) {
        Object.entries(firestorePins).forEach(([tId, pinVal]) => {
          if (pinVal) {
            setTopicPinInStorage(tId.toLowerCase(), String(pinVal));
            setTopicPinInStorage(toTopicSlug(tId), String(pinVal));
          }
        });
      }
    });

    getAppConfigFromFirestore().then((cfg) => {
      if (cfg?.scriptUrl && !getScriptUrl()) {
        setScriptUrl(cfg.scriptUrl);
      }
    });

    // 2. Pre-fetch topic PINs from Apps Script if scriptUrl is present
    const scriptUrl = getScriptUrl();
    if (scriptUrl) {
      fetch(`${scriptUrl}?action=get_topic_pins`)
        .then(res => res.json())
        .then(data => {
          if (data && data.status === 'success' && data.pins) {
            Object.keys(data.pins).forEach(tId => {
              if (data.pins[tId]) {
                setTopicPinInStorage(tId.toLowerCase(), String(data.pins[tId]));
                setTopicPinInStorage(toTopicSlug(tId), String(data.pins[tId]));
              }
            });
          }
        })
        .catch(err => console.warn('Gagal pre-fetch topic PINs:', err));
    }
  }, [user, topicId]);

  // Anti-Cheating Event Listeners (Active only during the exam before submit)
  useEffect(() => {
    if (!isUnlocked || submitted) return;

    // 1. Block Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      handleTriggerViolation('copy_paste', 'Klik kanan dinonaktifkan demi integritas ulangan.');
    };

    // 2. Block Copy & Cut
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      handleTriggerViolation('copy_paste', 'Dilarang menyalin (Copy) teks soal ulangan!');
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      handleTriggerViolation('copy_paste', 'Dilarang memotong (Cut) teks dari lembar ulangan!');
    };

    // 3. Block Paste into exam inputs
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      handleTriggerViolation('copy_paste', 'Dilarang menempel (Paste) jawaban dari luar! Ketik secara mandiri.');
    };

    // 4. Block Drag & Selection on text elements
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return; // Allow selecting text inside own input
      }
      e.preventDefault();
    };

    // 5. Detect Keyboard Shortcuts (Screenshot, DevTools, Copy, Print, View Source)
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen / Screenshot keys
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('');
          }
        } catch {
          // ignore
        }
        setIsScreenConcealed(true);
        handleTriggerViolation('screenshot', 'Tangkapan layar (PrintScreen / Screenshot) terdeteksi & diblokir!');
        return;
      }

      // Windows Snipping tool (Win + Shift + S) or Mac Screenshot (Cmd + Shift + 3/4/5)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['S', 's', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        setIsScreenConcealed(true);
        handleTriggerViolation('screenshot', 'Kombinasi tombol tangkapan layar (Snipping Tool) terdeteksi!');
        return;
      }

      // Ctrl/Cmd + C, V, X, P, U, S
      if ((e.ctrlKey || e.metaKey) && ['c', 'C', 'v', 'V', 'x', 'X', 'p', 'P', 'u', 'U', 's', 'S'].includes(e.key)) {
        const target = e.target as HTMLElement;
        const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
        
        // Allow select all or standard editing inside input if not copy/paste
        if (isInput && (e.key === 'a' || e.key === 'A' || e.key === 'z' || e.key === 'Z')) {
          return;
        }

        e.preventDefault();
        handleTriggerViolation('copy_paste', `Pintasan tombol (Ctrl/Cmd + ${e.key.toUpperCase()}) dinonaktifkan saat ulangan.`);
        return;
      }

      // Developer Tools (F12 or Ctrl+Shift+I/J/C)
      if (
        e.key === 'F12' || 
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key))
      ) {
        e.preventDefault();
        handleTriggerViolation('devtools', 'Akses Developer Tools / Inspeksi Soal diblokir!');
        return;
      }
    };

    // 6. Tab Switching / Window Blur Detection
    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        setIsScreenConcealed(true);
        handleTriggerViolation('tab_switch', 'Terdeteksi berpindah tab / meninggalkan jendela ulangan!');
      }
    };

    const handleWindowBlur = () => {
      setIsScreenConcealed(true);
    };

    const handleWindowFocus = () => {
      // Screen stays concealed until modal acknowledged
    };

    // 7. Warn before leaving page
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Ulangan sedang berlangsung. Jika Anda keluar, jawaban yang belum tersimpan akan hilang!';
      return e.returnValue;
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('cut', handleCut);
    window.addEventListener('paste', handlePaste);
    window.addEventListener('selectstart', handleSelectStart);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('cut', handleCut);
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('selectstart', handleSelectStart);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isUnlocked, submitted, handleTriggerViolation]);

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setCheckingOnlinePin(true);

    const cleanInput = pinInput.trim().toLowerCase();
    const cleanTopicId = topicId.toLowerCase();
    const slugTopicId = toTopicSlug(topicId);
    const slugTopicName = toTopicSlug(currentTopic.name);
    const localGuruPin = getGuruPin().trim().toLowerCase();
    const localUlanganPin = getUlanganPin().trim().toLowerCase();
    
    // Topic specific local PIN from Spreadsheet / Firestore sync
    const topicPins = getTopicPinsFromStorage();
    const specificTopicPin = (
      topicPins[cleanTopicId] || 
      topicPins[topicId] || 
      topicPins[slugTopicId] || 
      topicPins[slugTopicName] || 
      ''
    ).trim().toLowerCase();

    // 1. Check if input matches specific topic PIN from local storage
    if (specificTopicPin && cleanInput === specificTopicPin) {
      setIsUnlocked(true);
      setCheckingOnlinePin(false);
      return;
    }

    // Teacher PIN bypass (if configured by Guru)
    if (localGuruPin && cleanInput === localGuruPin) {
      setIsUnlocked(true);
      setCheckingOnlinePin(false);
      return;
    }

    // 2. Check live Firebase Firestore PINs (Realtime Cloud Check)
    try {
      const firestorePins = await getTopicPinsFromFirestore();
      if (firestorePins && Object.keys(firestorePins).length > 0) {
        const firestorePin = (
          firestorePins[cleanTopicId] || 
          firestorePins[topicId] || 
          firestorePins[slugTopicId] || 
          firestorePins[slugTopicName] || 
          ''
        ).trim().toLowerCase();

        if (firestorePin && cleanInput === firestorePin) {
          setIsUnlocked(true);
          setCheckingOnlinePin(false);
          return;
        }
      }

      // If no specific topic PIN is set in spreadsheet, check global ulangan PIN from Firestore
      const firestoreConfig = await getAppConfigFromFirestore();
      if (firestoreConfig?.ulanganPin) {
        const globalFsPin = String(firestoreConfig.ulanganPin).trim().toLowerCase();
        if (globalFsPin && cleanInput === globalFsPin) {
          setIsUnlocked(true);
          setCheckingOnlinePin(false);
          return;
        }
      }
    } catch (fsErr) {
      console.warn('Gagal cek Firestore PIN:', fsErr);
    }

    // 3. Check online live PIN directly via Apps Script webhook if available
    let scriptUrl = getScriptUrl();
    if (!scriptUrl) {
      const cfg = await getAppConfigFromFirestore();
      if (cfg?.scriptUrl) {
        scriptUrl = cfg.scriptUrl;
      }
    }

    if (scriptUrl) {
      try {
        const res = await fetch(`${scriptUrl}?action=get_topic_pins`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'success' && data.pins) {
            // Save all pins locally and in Firestore
            Object.entries(data.pins).forEach(([k, v]) => {
              if (v) {
                setTopicPinInStorage(k.toLowerCase(), String(v));
                setTopicPinInStorage(toTopicSlug(k), String(v));
              }
            });

            // Find matching pin for current topic from Spreadsheet
            const rawPin = data.pins[topicId] || data.pins[cleanTopicId] || data.pins[slugTopicId] || data.pins[slugTopicName];
            const onlineTopicPin = rawPin ? String(rawPin).trim().toLowerCase() : '';

            if (onlineTopicPin && cleanInput === onlineTopicPin) {
              setIsUnlocked(true);
              setCheckingOnlinePin(false);
              return;
            }
          }
          if (data.status === 'success' && data.ulanganPin) {
            const globalOnlinePin = String(data.ulanganPin).trim().toLowerCase();
            if (globalOnlinePin && cleanInput === globalOnlinePin) {
              setIsUnlocked(true);
              setCheckingOnlinePin(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Gagal memverifikasi PIN secara online:', err);
      }
    }

    // 4. Fallback check localUlanganPin if configured and non-empty
    if (localUlanganPin && cleanInput === localUlanganPin) {
      setIsUnlocked(true);
      setCheckingOnlinePin(false);
      return;
    }

    setCheckingOnlinePin(false);
    setPinError(`PIN Ulangan Harian untuk materi "${currentTopic.name}" salah. Pastikan PIN sesuai dengan yang ada di Google Spreadsheet guru.`);
  };

  const handlePgChange = (id: string, value: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handlePgKompleksToggle = (id: string, value: string) => {
    if (submitted) return;
    setAnswers(prev => {
      const current = prev[id];
      let list: string[] = [];
      if (Array.isArray(current)) {
        list = [...current];
      } else if (typeof current === 'string' && current.trim()) {
        list = [current.trim()];
      }

      if (list.includes(value)) {
        list = list.filter(item => item !== value);
      } else {
        list.push(value);
      }
      return { ...prev, [id]: list };
    });
  };

  const handleIsianChange = (id: string, value: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (isSubmittingRef.current || isSaving || submitted) {
      console.warn('Pengumpulan jawaban sedang berlangsung...');
      return;
    }

    // Determine missing answers
    const missing = quizQuestions.filter(q => {
      const a = answers[q.id];
      if (a === undefined || a === null) return true;
      if (Array.isArray(a)) return a.length === 0;
      return String(a).trim() === '';
    });

    if (missing.length > 0) {
      setUnansweredCount(missing.length);
      setShowUnansweredModal(true);
      return;
    }

    executeSubmit();
  };

  const executeSubmit = () => {
    if (isSubmittingRef.current || isSaving || submitted) {
      console.warn('Pengumpulan jawaban sedang diproses...');
      return;
    }
    // Lock immediately synchronously before async operations
    isSubmittingRef.current = true;
    setShowUnansweredModal(false);

    let pgCorrect = 0;
    let isianCorrect = 0;

    quizQuestions.forEach(q => {
      try {
        if (q.type === 'isian') {
          const ans = (answers[q.id] || '').toString().trim().toLowerCase();
          const correct = (q.answer ?? '').toString().trim().toLowerCase();
          if (ans && ans === correct) isianCorrect++;
        } else {
          if (isQuestionAnswerCorrect(q, answers[q.id])) {
            pgCorrect++;
          }
        }
      } catch (e) {
        console.warn('Evaluasi jawaban error:', e);
      }
    });

    const pgList = quizQuestions.filter(q => q.type !== 'isian');
    const isianList = quizQuestions.filter(q => q.type === 'isian');

    let finalScore = 0;
    if (pgList.length === 10 && isianList.length === 5) {
      finalScore = (pgCorrect * 6) + (isianCorrect * 8);
    } else {
      const totalQ = quizQuestions.length;
      if (totalQ > 0) {
        finalScore = Math.round(((pgCorrect + isianCorrect) / totalQ) * 100);
      }
    }

    setScoreInfo({ pg: pgCorrect, isian: isianCorrect, total: finalScore });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
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
      
      const rawName = user?.fullName || 'Siswa Anonim';
      const name = formatStudentNameWithClass(rawName, user?.className);
      const email = user?.email || 'siswa@example.com';
      const nowStr = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

      // 1. Simpan ke Firebase Firestore scores
      try {
        await addDoc(collection(db, 'scores'), {
          userId: user?.uid || null,
          fullName: name,
          className: user?.className || '',
          email: email,
          topicId: currentTopic.id,
          topicName: currentTopic.name,
          score: total,
          correctPilihan: pg,
          correctIsian: isian,
          tabSwitches: violationCount,
          createdAt: new Date().toISOString(),
        });
      } catch (fsErr) {
        console.warn('Simpan Firestore offline/tertunda:', fsErr);
      }

      // 2. Simpan & perbarui batasan kuota percobaan (Maksimal 2x per akun per materi)
      try {
        const attemptResult = await recordUserAttempt(user?.uid || '', currentTopic.id, {
          score: total,
          pg,
          isian,
          email,
          fullName: name,
          topicName: currentTopic.name,
        });

        setAttemptData(prev => ({
          count: attemptResult.newCount,
          isMaxReached: attemptResult.isMaxReached,
          bestScore: prev.bestScore !== undefined ? Math.max(prev.bestScore, total) : total,
          history: [
            ...prev.history,
            {
              attemptNumber: attemptResult.newCount,
              score: total,
              date: new Date().toISOString(),
              pg,
              isian
            }
          ]
        }));
      } catch (attErr) {
        console.warn('Gagal mencatat percobaan ke Firestore:', attErr);
      }

      setSaveStatus('Mencatat nilai ke Google Spreadsheet...');

      // 3. Simpan ke Google Spreadsheet
      const sheetRes = await appendScoreToSheet({
        fullName: name,
        email: email,
        topicName: currentTopic.name,
        score: total,
        correctPilihan: pg,
        correctIsian: isian,
        tabSwitches: violationCount,
        createdAt: nowStr,
      });

      if (sheetRes.success) {
        setSaveStatus('✅ Nilai & Percobaan berhasil dicatat di Firebase & Google Sheet!');
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

  const handleResetAttempts = async () => {
    if (!user) return;
    setIsResettingAttempt(true);
    try {
      await resetUserAttempts(user.uid, currentTopic.id, user.email, user.fullName, user.fullName || 'Guru');
      setAttemptData({ count: 0, history: [], isMaxReached: false, bestScore: undefined });
      setSaveStatus('✅ Kuota percobaan berhasil di-reset.');
    } catch (e) {
      console.error('Gagal reset attempt:', e);
    } finally {
      setIsResettingAttempt(false);
    }
  };

  const fetchTopicAttempts = async () => {
    setLoadingTopicAttempts(true);
    setGuruActionMsg('');
    try {
      const all = await getAllStudentAttempts();
      const filtered = all.filter(a => a.topicId === currentTopic.id);
      setTopicAttemptsList(filtered);
    } catch (e) {
      console.error('Gagal memuat list attempts:', e);
    } finally {
      setLoadingTopicAttempts(false);
    }
  };

  const handleResetStudentFromModal = async (studentEmail: string, studentUid?: string, studentName?: string) => {
    setGuruActionMsg('Sedang mereset kuota...');
    try {
      await resetUserAttempts(
        studentUid || studentEmail,
        currentTopic.id,
        studentEmail,
        studentName,
        user?.fullName || 'Guru / Admin'
      );
      setGuruActionMsg(`✅ Kuota percobaan ${studentName || studentEmail} berhasil di-reset ke 0 (Bebas tes 2x lagi).`);
      fetchTopicAttempts();

      if (user && (user.email === studentEmail || user.uid === studentUid)) {
        setAttemptData({ count: 0, history: [], isMaxReached: false, bestScore: undefined });
      }
    } catch (e: any) {
      setGuruActionMsg(`⚠️ Gagal reset: ${e.message}`);
    }
  };

  const handleManualResetByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualResetEmail.trim()) return;
    setGuruActionMsg('Sedang memproses reset...');
    try {
      await resetUserAttempts(
        manualResetEmail.trim(),
        currentTopic.id,
        manualResetEmail.trim(),
        undefined,
        user?.fullName || 'Guru / Admin'
      );
      setGuruActionMsg(`✅ Kuota untuk email ${manualResetEmail.trim()} pada materi ini berhasil direset.`);
      setManualResetEmail('');
      fetchTopicAttempts();
    } catch (err: any) {
      setGuruActionMsg(`⚠️ Gagal reset: ${err.message}`);
    }
  };

  const resetQuiz = () => {
    if (attemptData.isMaxReached && !isGuru) {
      return;
    }
    isSubmittingRef.current = false;
    setAnswers({});
    setSubmitted(false);
    setSaveStatus('');
    setScoreInfo({ pg: 0, isian: 0, total: 0 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const pgQuestions = quizQuestions.filter(q => q.type !== 'isian');
  const isianQuestions = quizQuestions.filter(q => q.type === 'isian');

  // 1. Validasi Akun Siswa (Wajib Login agar batas 2x pengerjaan terpantau per akun)
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 md:p-8 bg-white border border-slate-200 rounded-3xl shadow-xl text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-600 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Login Diperlukan untuk Ulangan</h2>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          Materi: <strong className="text-indigo-700">{currentTopic.name}</strong><br/>
          Sesuai aturan ujian, setiap akun siswa dibatasi <strong>maksimal 2 kali pengerjaan</strong> agar siswa tidak banyak coba-coba. Silakan masuk dengan akun terdaftar Anda.
        </p>
        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Masuk / Login Akun Siswa</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-medium flex items-center justify-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Loading State Pengecekan Riwayat Kuota Akun
  if (loadingAttempts) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-200 rounded-3xl shadow-xl text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-base font-bold text-slate-800">Memeriksa Kuota Ulangan...</h3>
        <p className="text-xs text-slate-500 mt-1">Memvalidasi riwayat pengerjaan akun Anda di sistem.</p>
      </div>
    );
  }

  // 3. Batas Kuota Tercapai (Sudah 2 Kali Mengerjakan)
  if (attemptData.isMaxReached && !isGuru) {
    return (
      <div className="max-w-xl mx-auto my-10 p-6 md:p-8 bg-white border-2 border-rose-200 rounded-3xl shadow-xl animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-600 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 border border-rose-300 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2">
            Batas Kuota Ulangan Habis
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Kesempatan Pengerjaan Telah Habis
          </h2>
          <p className="text-xs md:text-sm text-slate-600 mt-2 leading-relaxed">
            Akun <strong className="text-slate-800">{user.email}</strong> telah menggunakan <strong>2 dari 2 kesempatan</strong> ulangan harian materi <strong className="text-indigo-700">{currentTopic.name}</strong>.
          </p>
        </div>

        {/* Ringkasan Nilai dan Riwayat 2x Percobaan */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-5 mb-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <History className="w-4 h-4 text-indigo-600" />
              <span>Riwayat 2 Kali Percobaan Anda:</span>
            </span>
            <span className="font-extrabold text-indigo-700 text-sm">
              Nilai Terbaik: {attemptData.bestScore ?? '-'}
            </span>
          </div>

          <div className="space-y-2">
            {attemptData.history.map((att, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800">
                    Percobaan #{att.attemptNumber || idx + 1}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {att.date ? new Date(att.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : 'Selesai'}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-base font-black px-2.5 py-0.5 rounded-lg ${
                    att.score >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {att.score}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {att.score >= 75 ? 'Tuntas' : 'Belum Tuntas'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 leading-relaxed flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Sesuai ketentuan asesmen Kurikulum Merdeka, siswa dibatasi maksimal 2 kali agar tidak melakukan spekulasi/coba-coba. Nilai terbaik Anda telah tersimpan dan tercatat di Guru.
            </span>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
          <button
            onClick={() => navigate(`/materi/${currentTopic.id}`)}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Pelajari Materi Ini</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. Layar Verifikasi PIN (Jika Belum Terbuka)
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 md:p-8 bg-white border border-slate-200 rounded-3xl shadow-xl animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-indigo-600 shadow-sm">
          <KeyRound className="w-8 h-8" />
        </div>
        
        <div className="text-center mb-5">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">PIN Akses Ulangan Harian</h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Materi: <strong className="text-indigo-700">{currentTopic.name}</strong><br/>
            Silakan masukkan PIN Ulangan Harian yang diberikan oleh Guru untuk memulai tes.
          </p>
        </div>

        {/* Informasi Akun & Kuota Percobaan */}
        <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Akun Siswa:</span>
            <span className="font-bold text-slate-800 truncate max-w-[200px]">{user.fullName || user.email}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/80 pt-2">
            <span className="text-slate-500 font-medium">Status Kesempatan:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
              attemptData.count === 0 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {attemptData.count === 0 ? 'Percobaan 1 dari 2' : '⚠️ Percobaan 2 dari 2 (Terakhir)'}
            </span>
          </div>
          {isGuru && (
            <div className="pt-2 border-t border-slate-200/80 flex flex-col gap-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-purple-700 font-bold">Mode Guru Aktif:</span>
                <button
                  type="button"
                  onClick={handleResetAttempts}
                  disabled={isResettingAttempt}
                  className="text-purple-600 hover:text-purple-800 underline font-semibold cursor-pointer"
                >
                  {isResettingAttempt ? 'Mereset...' : 'Reset Kuota Akun Ini'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowGuruAttemptsModal(true);
                  fetchTopicAttempts();
                }}
                className="w-full py-1.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>👥 Kelola & Reset Percobaan Seluruh Siswa</span>
              </button>
            </div>
          )}
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
                placeholder="Masukkan PIN Materi"
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
            className="w-full py-3.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {checkingOnlinePin ? 'Memeriksa PIN...' : `Mulai Kerjakan (Percobaan ke-${attemptData.count + 1})`}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-medium flex items-center justify-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto select-none relative">
      
      {/* Toast Notifikasi Anti-Curang */}
      {warningToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-rose-900 text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-rose-400 flex items-center gap-3 text-xs md:text-sm font-bold tracking-wide backdrop-blur-md">
            <ShieldAlert className="w-5 h-5 text-rose-300 animate-pulse flex-shrink-0" />
            <span>{warningToast}</span>
          </div>
        </div>
      )}

      {/* Modal / Shield Penyamaran saat Pindah Tab atau Screenshot Terdeteksi */}
      {isScreenConcealed && !submitted && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-500/80 rounded-3xl p-6 md:p-8 max-w-lg w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-950/80 border border-rose-500/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-400">
              <EyeOff className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-lg md:text-xl font-black text-white tracking-tight mb-2">
              ⚠️ Layar Ujian Disamarkan
            </h2>
            <p className="text-xs md:text-sm text-rose-200 font-medium mb-4">
              {lastViolationType || 'Terdeteksi meninggalkan jendela ujian, membuka tab/aplikasi lain, atau mencoba tangkapan layar.'}
            </p>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Siswa:</span>
                <span className="font-bold text-white">{user?.fullName || 'Siswa'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Status Pengawasan:</span>
                <span className="font-bold text-rose-400">Tercatat ({violationCount}x Peringatan)</span>
              </div>
              <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 leading-relaxed">
                Segala aktivitas membuka tab/aplikasi AI dan tangkapan layar dipantau oleh sistem demi kejujuran akademik.
              </p>
            </div>
            <button
              onClick={() => {
                setIsScreenConcealed(false);
                setShowViolationModal(false);
              }}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-rose-900/50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Saya Mengerti & Lanjutkan Ujian</span>
            </button>
          </div>
        </div>
      )}

      {/* Header Halaman */}
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

      {/* Bar Keamanan Anti-Curang (Security Bar) */}
      {!submitted && (
        <div className="mb-6 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="font-bold text-indigo-950 flex items-center gap-1.5">
                <span>Mode Ujian Terproteksi (Anti-Curang Aktif)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              </p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Copy/Paste diblokir • Screenshot/AI dilarang • Deteksi pindah tab aktif
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 border ${
              attemptData.count === 0 
                ? 'bg-blue-100 text-blue-800 border-blue-200' 
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              <History className="w-3 h-3" />
              <span>{attemptData.count === 0 ? 'Percobaan 1 dari 2' : 'Kesempatan Terakhir (2 dari 2)'}</span>
            </span>
            <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 border ${
              violationCount === 0 
                ? 'bg-emerald-100/80 text-emerald-800 border-emerald-200' 
                : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
            }`}>
              <AlertTriangle className="w-3 h-3" />
              <span>{violationCount === 0 ? '0 Pelanggaran' : `${violationCount}x Peringatan`}</span>
            </span>
          </div>
        </div>
      )}

      {/* Watermark Pencegah Foto Layar */}
      {!submitted && (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden flex flex-wrap gap-16 p-8 items-center justify-around opacity-[0.025] select-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="text-xs font-mono font-black rotate-[-25deg] uppercase">
              {user?.fullName || 'MathFun Siswa'} • {user?.email || 'Ujian'} • PROTECTED
            </div>
          ))}
        </div>
      )}

      {/* Jika Ujian Sudah Selesai / Dikumpulkan: Tampilkan HANYA Nilai / Skor Saja */}
      {submitted ? (
        <div className="max-w-2xl mx-auto my-6 animate-in zoom-in-95 duration-500">
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 border-2 border-indigo-500/40 text-white rounded-3xl p-6 md:p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center mx-auto mb-4 text-amber-300 shadow-inner">
                <Trophy className="w-9 h-9" />
              </div>

              <span className="inline-block px-3 py-1 bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                Ulangan Selesai • {currentTopic.name}
              </span>
              
              <h2 className="text-xs md:text-sm font-semibold text-indigo-300 uppercase tracking-widest mb-1">
                Nilai Akhir Siswa
              </h2>
              
              <div className="text-6xl md:text-7xl font-black mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-amber-200">
                {scoreInfo.total}
              </div>

              {scoreInfo.total >= 75 ? (
                <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs md:text-sm font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>🎉 Tuntas! Kamu telah menguasai materi ini dengan baik.</span>
                </div>
              ) : (
                <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs md:text-sm font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>💪 Belum Tuntas. Pelajari lagi materi untuk pemahaman lebih baik.</span>
                </div>
              )}

              {/* Status Kesempatan / Kuota Pengerjaan */}
              {attemptData.count >= 2 && !isGuru ? (
                <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs md:text-sm font-bold">
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span>Batas 2 dari 2 Kesempatan Telah Digunakan</span>
                </div>
              ) : (
                <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs md:text-sm font-bold">
                  <History className="w-4 h-4 text-blue-400" />
                  <span>
                    {isGuru 
                      ? 'Mode Guru (Bebas Mengulang Ujian)' 
                      : `Percobaan ${attemptData.count} dari 2 Selesai • Tersisa 1 Kesempatan Lagi`}
                  </span>
                </div>
              )}

              {/* Rincian Skor */}
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-6 bg-slate-900/70 border border-indigo-900/60 p-4 rounded-2xl text-left">
                <div className="bg-indigo-950/50 border border-indigo-800/40 p-3 rounded-xl">
                  <p className="text-indigo-300 text-[11px] font-semibold uppercase tracking-wider mb-1">Pilihan Ganda</p>
                  <p className="text-xl font-bold text-white">
                    {scoreInfo.pg} <span className="text-xs font-normal text-indigo-400">/ {pgQuestions.length} Benar</span>
                  </p>
                </div>
                <div className="bg-indigo-950/50 border border-indigo-800/40 p-3 rounded-xl">
                  <p className="text-indigo-300 text-[11px] font-semibold uppercase tracking-wider mb-1">Isian Singkat</p>
                  <p className="text-xl font-bold text-white">
                    {scoreInfo.isian} <span className="text-xs font-normal text-indigo-400">/ {isianQuestions.length} Benar</span>
                  </p>
                </div>
              </div>

              {/* Status Penyimpanan */}
              {saveStatus && (
                <div className="mb-6 p-3 rounded-xl bg-indigo-950/80 border border-indigo-700/50 text-xs font-medium text-indigo-200 flex items-center justify-center gap-2 max-w-md mx-auto">
                  {isSaving && <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />}
                  <span>{saveStatus}</span>
                </div>
              )}

              <p className="text-[12px] text-indigo-300/80 mb-6 max-w-md mx-auto leading-relaxed">
                🔒 Kunci jawaban disembunyikan demi menjaga integritas akademik ulangan harian. Skor dan hasil pengerjaanmu telah tersimpan.
              </p>

              {/* Tombol Aksi */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                {attemptData.count >= 2 && !isGuru ? (
                  <div className="w-full sm:w-auto px-5 py-3 bg-slate-800/80 text-slate-400 border border-slate-700/80 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Kuota Ulangan Habis (2/2)</span>
                  </div>
                ) : (
                  <button
                    onClick={resetQuiz}
                    className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isGuru ? 'Ulangi Tes (Mode Guru)' : 'Ulangi Tes (Kesempatan Terakhir: 2/2)'}</span>
                  </button>
                )}
                
                <button
                  onClick={() => navigate('/')}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                  <span>Kembali ke Beranda</span>
                </button>

                {attemptData.count >= 2 && !isGuru && (
                  <button
                    onClick={() => navigate(`/materi/${currentTopic.id}`)}
                    className="w-full sm:w-auto px-6 py-3 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-indigo-200 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Pelajari Materi</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Bagian A: Pilihan Ganda & Pilihan Ganda Kompleks */}
      <div className="mb-8">
        <div className="bg-slate-50 py-3.5 px-5 rounded-t-xl border border-slate-200 border-b-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
           <div>
             <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
               Bagian A: Pilihan Ganda & Pilihan Ganda Kompleks
             </h2>
             <p className="text-xs text-slate-500 mt-0.5">
               Tombol bulat (◉) untuk PG Biasa (1 jawaban). Tombol kotak (☑) untuk PG Kompleks (bisa pilih 2 atau lebih).
             </p>
           </div>
           <div className="flex items-center gap-2 text-xs font-semibold">
             <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
               <CheckSquare className="w-3.5 h-3.5 text-purple-600" />
               <span>PG Kompleks</span>
             </span>
             <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
               <Circle className="w-3.5 h-3.5 text-slate-500" />
               <span>PG Biasa</span>
             </span>
           </div>
        </div>
        <div className="bg-white rounded-b-xl p-5 md:p-6 border border-slate-200 shadow-sm space-y-6">
           {pgQuestions.map((q, idx) => {
             const isKompleks = isPgKompleksQuestion(q);
             const userAnswer = answers[q.id];
             const userSelectedList = Array.isArray(userAnswer)
               ? userAnswer
               : (typeof userAnswer === 'string' && userAnswer.trim() ? [userAnswer.trim()] : []);
             const isCorrect = submitted && isQuestionAnswerCorrect(q, userAnswer);

             return (
               <div key={q.id} className={`p-4 md:p-5 rounded-xl border transition-all ${
                 submitted 
                   ? (isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200') 
                   : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
               }`}>
                 <div className="flex gap-4">
                    <span className="bg-indigo-100 text-indigo-800 text-sm font-bold w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      {/* Question meta badges */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        {isKompleks ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            <CheckSquare className="w-3.5 h-3.5 text-purple-600" />
                            <span>Pilihan Ganda Kompleks (Jawaban Benar Lebih dari 1)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            <Circle className="w-3 h-3 text-slate-500" />
                            <span>Pilihan Ganda (Pilih 1 Jawaban)</span>
                          </span>
                        )}
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          q.difficulty === 'Mudah' ? 'bg-emerald-100 text-emerald-700' :
                          q.difficulty === 'Sedang' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {q.difficulty || 'Sedang'}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-slate-800 mb-3">{q.question}</p>

                      {(q.image || q.imageUrl) && (
                        <QuestionImage
                          src={q.image || q.imageUrl}
                          alt={`Gambar Soal ${idx + 1}`}
                        />
                      )}

                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {q.options?.map(opt => {
                          const isSelected = isKompleks 
                            ? userSelectedList.includes(opt)
                            : userAnswer === opt;

                          return (
                            <div 
                              key={opt} 
                              onClick={() => {
                                if (submitted) return;
                                if (isKompleks) {
                                  handlePgKompleksToggle(q.id, opt);
                                } else {
                                  handlePgChange(q.id, opt);
                                }
                              }}
                              className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all select-none ${
                                submitted
                                  ? (isSelected
                                      ? (isCorrect
                                          ? 'bg-emerald-100/80 border-emerald-400 text-emerald-950 font-semibold'
                                          : 'bg-rose-100/80 border-rose-400 text-rose-950 font-medium')
                                      : 'bg-white border-slate-200 opacity-60 text-slate-600')
                                  : (isSelected
                                      ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200 text-indigo-950 shadow-xs'
                                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700')
                              }`}
                            >
                              {/* Indicator: Square Checkbox for PG Kompleks, Circle Radio for standard PG */}
                              <div className="mt-0.5 flex-shrink-0">
                                {isKompleks ? (
                                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                    submitted
                                      ? (isSelected
                                          ? (isCorrect
                                              ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                                              : 'border-rose-500 bg-rose-500 text-white shadow-xs')
                                          : 'border-slate-300 bg-white')
                                      : (isSelected
                                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs scale-105'
                                          : 'border-slate-300 bg-white hover:border-slate-400')
                                  }`}>
                                    {isSelected && (
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    )}
                                  </div>
                                ) : (
                                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                    submitted
                                      ? (isSelected
                                          ? (isCorrect
                                              ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                                              : 'border-rose-500 bg-rose-500 text-white shadow-xs')
                                          : 'border-slate-300 bg-white')
                                      : (isSelected
                                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                                          : 'border-slate-300 bg-white hover:border-slate-400')
                                  }`}>
                                    {isSelected && (
                                      <div className="w-2 h-2 rounded-full bg-white" />
                                    )}
                                  </div>
                                )}
                              </div>
                              <span className="text-sm leading-snug">{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      {submitted && (
                         <div className={`mt-3.5 p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                           isCorrect 
                             ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                             : 'bg-rose-50 border-rose-200 text-rose-900'
                         }`}>
                           <div className="flex items-center gap-1.5 font-bold">
                             {isCorrect ? (
                               <span className="text-emerald-700 flex items-center gap-1.5">
                                 <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                 Jawaban Benar
                               </span>
                             ) : (
                               <span className="text-rose-600 flex items-center gap-1.5">
                                 <AlertTriangle className="w-4 h-4 text-rose-500" />
                                 Jawaban Belum Tepat
                               </span>
                             )}
                           </div>
                           <span className="text-[11px] font-semibold text-slate-500">
                             {userSelectedList.length > 0 ? `Jawabanmu: ${userSelectedList.join(', ')}` : 'Tidak dijawab'}
                           </span>
                         </div>
                      )}
                    </div>
                 </div>
               </div>
             );
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
                        {(q.image || q.imageUrl) && (
                          <QuestionImage
                            src={q.image || q.imageUrl}
                            alt={`Gambar Soal ${idx + 1}`}
                          />
                        )}
                        
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

                        {submitted && (
                          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold">
                            {isCorrect ? (
                              <span className="text-emerald-700 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                Jawaban Benar
                              </span>
                            ) : (
                              <span className="text-rose-600 flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4 text-rose-500" />
                                Jawaban Belum Tepat
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                  </div>
                </div>
             );
           })}
        </div>
      </div>

          <div className="sticky bottom-6 flex justify-end">
             <button 
               onClick={handleSubmit} 
               disabled={isSaving || submitted}
               className="bg-indigo-600 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all w-full md:w-auto text-center cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
             >
               <CheckCircle2 className="w-4 h-4" />
               <span>{isSaving ? 'Menyimpan Jawaban...' : 'Kumpulkan Jawaban'}</span>
             </button>
          </div>
        </>
      )}

      {/* Modal Peringatan Soal Belum Terisi */}
      {showUnansweredModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Masih Ada Soal Belum Terisi
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Terdapat <strong className="text-indigo-600 font-bold">{unansweredCount} soal</strong> yang belum kamu jawab. Apakah kamu yakin ingin tetap mengumpulkan sekarang?
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowUnansweredModal(false)}
                className="w-full sm:flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Periksa Soal Dulu
              </button>
              <button
                type="button"
                onClick={executeSubmit}
                disabled={isSaving || submitted}
                className="w-full sm:flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shadow-indigo-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSaving ? 'Menyimpan...' : 'Tetap Kumpulkan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kelola & Reset Percobaan Siswa untuk Bab Ini (Akses Guru) */}
      {showGuruAttemptsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 md:p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Kelola Percobaan Siswa: {currentTopic.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lihat status kuota & reset percobaan siswa agar dapat mengikuti ulangan kembali (Maks. 2x).
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuruAttemptsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {guruActionMsg && (
              <div className="my-3 p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-medium">
                {guruActionMsg}
              </div>
            )}

            {/* Form Reset Cepat Berdasarkan Email */}
            <form onSubmit={handleManualResetByEmail} className="my-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={manualResetEmail}
                onChange={(e) => setManualResetEmail(e.target.value)}
                placeholder="Masukkan email siswa (misal: siswa@example.com)"
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-800"
              />
              <button
                type="submit"
                className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap cursor-pointer"
              >
                🔄 Reset Siswa Ini
              </button>
            </form>

            {/* List Siswa di Bab Ini */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {loadingTopicAttempts ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Memuat data percobaan siswa dari Firestore...
                </div>
              ) : topicAttemptsList.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  Belum ada siswa yang mengerjakan ulangan materi {currentTopic.name}.
                </div>
              ) : (
                topicAttemptsList.map((item, idx) => (
                  <div key={item.docId || idx} className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 truncate">{item.fullName || 'Siswa'}</span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          item.count >= 2 
                            ? 'bg-rose-100 text-rose-700' 
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.count} / 2 Kali
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{item.email}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Nilai Terbaik: <strong className="text-indigo-600 font-bold">{item.bestScore ?? '-'}</strong> • Terakhir: {item.updatedAt ? new Date(item.updatedAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleResetStudentFromModal(item.email, item.userId, item.fullName)}
                        className="py-1.5 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reset ke 0 (Beri 2x)</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span>Total {topicAttemptsList.length} data pengerjaan di bab ini</span>
              <button
                type="button"
                onClick={fetchTopicAttempts}
                className="text-purple-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Segarkan Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
