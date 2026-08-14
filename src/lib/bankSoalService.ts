import { db, doc, getDoc, setDoc } from './firebase';
import { getScriptUrl, setAllTopicPinsInStorage, setScriptUrl, setGuruPin, setUlanganPin } from './sheets';

export interface QuestionItem {
  id: string;
  type: 'pg' | 'isian';
  question: string;
  options?: string[];
  answer: string;
  difficulty?: 'Mudah' | 'Sedang' | 'Sulit';
  score?: number;
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
