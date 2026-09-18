import { db, doc, getDoc, setDoc } from './firebase';
import { getScriptUrl, setAllTopicPinsInStorage, setScriptUrl, setGuruPin, setUlanganPin } from './sheets';

export interface QuestionItem {
  id: string;
  type: 'pg' | 'pg_kompleks' | 'kompleks' | 'isian' | string;
  question: string;
  options?: string[];
  answer: string;
  difficulty?: 'Mudah' | 'Sedang' | 'Sulit';
  score?: number;
  image?: string;
  imageUrl?: string;
}

/**
 * Resolves a letter (A, B, C, D, E) or exact text to the corresponding option string
 */
export function resolveOptionValue(val: string, options: string[] = []): string {
  const clean = val.trim();
  const upper = clean.toUpperCase();
  if (options && options.length > 0) {
    if (upper === 'A' && options[0] !== undefined) return options[0].trim();
    if (upper === 'B' && options[1] !== undefined) return options[1].trim();
    if (upper === 'C' && options[2] !== undefined) return options[2].trim();
    if (upper === 'D' && options[3] !== undefined) return options[3].trim();
    if (upper === 'E' && options[4] !== undefined) return options[4].trim();

    // Check if clean matches an option text (case-insensitive)
    const match = options.find(opt => opt.trim().toLowerCase() === clean.toLowerCase());
    if (match) return match.trim();
  }
  return clean;
}

/**
 * Parses correct answers from q.answer into an array of string option values
 * Supports:
 * - "A, C" or "A; C" or "A, B, D"
 * - "Opsi 1; Opsi 2"
 * - Array of answers
 */
export function parseCorrectAnswers(answerStr: string | string[], options: string[] = []): string[] {
  if (Array.isArray(answerStr)) {
    return answerStr.map(a => resolveOptionValue(String(a), options)).filter(Boolean);
  }
  if (!answerStr) return [];
  const raw = String(answerStr).trim();

  // 1. Delimiter: semicolon (;) or pipe (|)
  if (raw.includes(';') || raw.includes('|')) {
    return raw.split(/[;|]+/)
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => resolveOptionValue(s, options));
  }

  // 2. Delimiter: " dan " or " & "
  if (/\s+(?:dan|&)\s+/i.test(raw)) {
    return raw.split(/\s+(?:dan|&)\s+/i)
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => resolveOptionValue(s, options));
  }

  // 3. Letters with commas, e.g. "A, C" or "A, B, D" or "A,C"
  if (/^[A-Ea-e](\s*,\s*[A-Ea-e])+$/.test(raw)) {
    return raw.split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => resolveOptionValue(s, options));
  }

  // 4. Comma separated where each item matches an option or letter
  if (raw.includes(',') && options.length > 0) {
    // If the whole string is an exact option (e.g. "0,6" or "1,5"), treat as single answer
    const exactMatch = options.some(opt => opt.trim().toLowerCase() === raw.toLowerCase());
    if (!exactMatch) {
      const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
      const allPartsValid = parts.every(part => {
        const u = part.toUpperCase();
        return (u >= 'A' && u <= 'E') || options.some(opt => opt.trim().toLowerCase() === part.toLowerCase());
      });
      if (allPartsValid && parts.length > 1) {
        return parts.map(s => resolveOptionValue(s, options));
      }
    }
  }

  // Single answer
  return [resolveOptionValue(raw, options)];
}

/**
 * Checks if question is Pilihan Ganda Kompleks (multi-choice)
 */
export function isPgKompleksQuestion(q: QuestionItem): boolean {
  if (q.type === 'pg_kompleks' || (q.type as string) === 'kompleks' || (q.type as string) === 'pgk') {
    return true;
  }
  if (q.type === 'pg') {
    const correctList = parseCorrectAnswers(q.answer, q.options || []);
    return correctList.length > 1;
  }
  return false;
}

/**
 * Evaluates whether user's selected answers match the correct answers
 */
export function isQuestionAnswerCorrect(q: QuestionItem, userAnswer: string | string[] | undefined): boolean {
  if (userAnswer === undefined || userAnswer === null) return false;

  if (q.type === 'isian') {
    const ans = String(userAnswer).trim().toLowerCase();
    const correct = String(q.answer).trim().toLowerCase();
    return ans === correct;
  }

  const isKompleks = isPgKompleksQuestion(q);
  const correctList = parseCorrectAnswers(q.answer, q.options || []);

  if (isKompleks) {
    let userList: string[] = [];
    if (Array.isArray(userAnswer)) {
      userList = userAnswer.map(s => s.trim().toLowerCase());
    } else if (typeof userAnswer === 'string' && userAnswer.trim()) {
      userList = [userAnswer.trim().toLowerCase()];
    }

    const normCorrect = correctList.map(s => s.trim().toLowerCase());
    if (userList.length !== normCorrect.length || normCorrect.length === 0) {
      return false;
    }

    // Every item in normCorrect must be in userList, and userList has no extra items
    const allIncluded = normCorrect.every(c => userList.includes(c));
    const noExtras = userList.every(u => normCorrect.includes(u));
    return allIncluded && noExtras;
  } else {
    // Single choice PG
    const singleAns = (Array.isArray(userAnswer) ? userAnswer[0] : userAnswer) || '';
    const normUser = String(singleAns).trim().toLowerCase();
    const target = (correctList[0] || String(q.answer)).trim().toLowerCase();
    return normUser === target;
  }
}

/**
 * Format image URLs especially from Google Drive share links
 * e.g. https://drive.google.com/file/d/FILE_ID/view -> direct image thumbnail
 */
export function formatQuestionImageUrl(url?: string): string {
  if (!url) return '';
  const clean = url.trim();
  if (!clean) return '';

  // Google Drive URL converter
  const gdMatch = clean.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]+)/);
  if (gdMatch && gdMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${gdMatch[1]}&sz=w1000`;
  }
  return clean;
}

export interface TopicBankSoal {
  topicId: string;
  topicName?: string;
  questions: QuestionItem[];
  updatedAt?: string;
}

export function toTopicSlug(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Saves topic-specific PINs to Firebase Firestore
 */
export async function saveTopicPinsToFirestore(pins: Record<string, string>): Promise<boolean> {
  try {
    const docRef = doc(db, 'settings', 'topic_pins');
    // Normalize keys to slugs
    const normalizedPins: Record<string, string> = {};
    Object.entries(pins).forEach(([k, v]) => {
      if (k && v !== undefined && v !== null) {
        normalizedPins[toTopicSlug(k)] = String(v).trim();
        normalizedPins[k.trim().toLowerCase()] = String(v).trim();
      }
    });

    await setDoc(docRef, {
      pins: normalizedPins,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('[Firestore] Gagal menyimpan Topic PINs ke Firestore:', error);
    return false;
  }
}

/**
 * Gets topic-specific PINs from Firebase Firestore
 */
export async function getTopicPinsFromFirestore(): Promise<Record<string, string>> {
  try {
    const docRef = doc(db, 'settings', 'topic_pins');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && data.pins && typeof data.pins === 'object') {
        return data.pins;
      }
    }
  } catch (error) {
    console.warn('[Firestore] Gagal membaca Topic PINs dari Firestore:', error);
  }
  return {};
}

/**
 * Saves global app configuration (Script URL, global PINs) to Firebase Firestore
 */
export async function saveAppConfigToFirestore(config: {
  scriptUrl?: string;
  spreadsheetId?: string;
  guruPin?: string;
  ulanganPin?: string;
}): Promise<boolean> {
  try {
    const docRef = doc(db, 'settings', 'app_config');
    await setDoc(docRef, {
      ...config,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('[Firestore] Gagal menyimpan app_config ke Firestore:', error);
    return false;
  }
}

/**
 * Gets global app configuration from Firebase Firestore
 */
export async function getAppConfigFromFirestore(): Promise<{
  scriptUrl?: string;
  spreadsheetId?: string;
  guruPin?: string;
  ulanganPin?: string;
} | null> {
  try {
    const docRef = doc(db, 'settings', 'app_config');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as any;
    }
  } catch (error) {
    console.warn('[Firestore] Gagal membaca app_config dari Firestore:', error);
  }
  return null;
}

/**
 * Loads questions for a given topicId directly from Firebase Firestore (collection: bank_soal)
 */
export async function getBankSoalFromFirestore(topicId: string): Promise<QuestionItem[] | null> {
  try {
    const cleanTopicId = toTopicSlug(topicId);
    const docRef = doc(db, 'bank_soal', cleanTopicId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as TopicBankSoal;
      if (data && Array.isArray(data.questions) && data.questions.length > 0) {
        return data.questions;
      }
    }
  } catch (error) {
    console.warn(`[Firestore] Gagal mengambil Bank Soal untuk topic '${topicId}':`, error);
  }
  return null;
}

/**
 * Saves or updates Bank Soal questions for a given topicId in Firebase Firestore
 */
export async function saveBankSoalToFirestore(
  topicId: string,
  questions: QuestionItem[],
  topicName?: string
): Promise<boolean> {
  try {
    const cleanTopicId = toTopicSlug(topicId);
    const docRef = doc(db, 'bank_soal', cleanTopicId);
    await setDoc(docRef, {
      topicId: cleanTopicId,
      topicName: topicName || cleanTopicId,
      questions,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error(`[Firestore] Gagal menyimpan Bank Soal ke Firestore:`, error);
    return false;
  }
}

/**
 * Fetches Bank Soal AND Topic PINs from Google Apps Script Webhook
 * and syncs them directly into Firebase Firestore (so every student on Vercel or anywhere has immediate access)
 */
export async function syncBankSoalFromSheetToFirebase(customScriptUrl?: string): Promise<{
  success: boolean;
  message: string;
  syncedTopicsCount?: number;
  totalQuestionsCount?: number;
  syncedPinsCount?: number;
}> {
  let scriptUrl = customScriptUrl || getScriptUrl();
  
  if (!scriptUrl) {
    // Try getting from Firestore
    const firestoreConfig = await getAppConfigFromFirestore();
    if (firestoreConfig?.scriptUrl) {
      scriptUrl = firestoreConfig.scriptUrl;
      setScriptUrl(scriptUrl);
    }
  }

  if (!scriptUrl) {
    return {
      success: false,
      message: 'URL Webhook Apps Script belum dikonfigurasi di Pengaturan Guru / Sheets.',
    };
  }

  // Save scriptUrl in Firestore config
  await saveAppConfigToFirestore({ scriptUrl });

  let totalSyncedQuestions = 0;
  let syncedTopics = 0;
  let syncedPins = 0;
  const messages: string[] = [];

  // 1. Sync PINs from Sheet
  try {
    const pinRes = await fetch(`${scriptUrl}?action=get_topic_pins`);
    if (pinRes.ok) {
      const pinData = await pinRes.json();
      if (pinData.status === 'success') {
        const pinsMap: Record<string, string> = pinData.pins || {};
        if (Object.keys(pinsMap).length > 0) {
          setAllTopicPinsInStorage(pinsMap);
          await saveTopicPinsToFirestore(pinsMap);
          syncedPins = Object.keys(pinsMap).length;
          messages.push(`${syncedPins} PIN Materi berhasil disinkronkan ke Firebase`);
        }
        if (pinData.ulanganPin) {
          setUlanganPin(String(pinData.ulanganPin));
          await saveAppConfigToFirestore({ ulanganPin: String(pinData.ulanganPin) });
        }
        if (pinData.guruPin) {
          setGuruPin(String(pinData.guruPin));
          await saveAppConfigToFirestore({ guruPin: String(pinData.guruPin) });
        }
      }
    }
  } catch (pinErr) {
    console.warn('Gagal sinkron PIN dari Apps Script:', pinErr);
  }

  // 2. Sync Bank Soal from Sheet
  try {
    const res = await fetch(`${scriptUrl}?action=get_bank_soal`);
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success' && data.bankSoal) {
        const bankSoalMap: Record<string, QuestionItem[]> = data.bankSoal;
        const topicKeys = Object.keys(bankSoalMap);

        for (const rawTopicId of topicKeys) {
          const topicId = toTopicSlug(rawTopicId);
          const questions = bankSoalMap[rawTopicId];
          if (Array.isArray(questions) && questions.length > 0) {
            const ok = await saveBankSoalToFirestore(topicId, questions);
            if (ok) {
              syncedTopics++;
              totalSyncedQuestions += questions.length;
            }
          }
        }
        if (syncedTopics > 0) {
          messages.push(`${syncedTopics} bab (${totalSyncedQuestions} soal) disinkronkan ke Firebase`);
        }
      }
    }
  } catch (soalErr: any) {
    console.error('Gagal mensinkronkan Bank Soal:', soalErr);
  }

  if (syncedTopics > 0 || syncedPins > 0) {
    return {
      success: true,
      message: `Berhasil sinkronisasi! ${messages.join(' & ')}.`,
      syncedTopicsCount: syncedTopics,
      totalQuestionsCount: totalSyncedQuestions,
      syncedPinsCount: syncedPins,
    };
  }

  return {
    success: false,
    message: 'Gagal mengambil data dari Google Apps Script. Pastikan URL Webhook benar dan izin deploy disetel ke "Anyone / Siapa saja".',
  };
}
