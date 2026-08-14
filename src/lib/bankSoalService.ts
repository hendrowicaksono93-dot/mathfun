import { db, doc, getDoc, setDoc } from './firebase';
import { getScriptUrl } from './sheets';

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
 * Fetches all Bank Soal from Google Apps Script Webhook and syncs them directly into Firebase Firestore
 */
export async function syncBankSoalFromSheetToFirebase(): Promise<{
  success: boolean;
  message: string;
  syncedTopicsCount?: number;
  totalQuestionsCount?: number;
}> {
  const scriptUrl = getScriptUrl();
  if (!scriptUrl) {
    return {
      success: false,
      message: 'URL Webhook Apps Script belum dikonfigurasi di Pengaturan Guru / Sheets.',
    };
  }

  try {
    const res = await fetch(`${scriptUrl}?action=get_bank_soal`);
    if (!res.ok) {
      return { success: false, message: `Server Apps Script merespon HTTP ${res.status}` };
    }

    const data = await res.json();
    if (data.status !== 'success' || !data.bankSoal) {
      return {
        success: false,
        message: data.message || 'Sheet Bank Soal kosong atau format tidak sesuai. Pastikan Apps Script (Kode.gs) sudah diperbarui dan di-deploy Ulang sebagai Web App.',
      };
    }

    const bankSoalMap: Record<string, QuestionItem[]> = data.bankSoal;
    const topicKeys = Object.keys(bankSoalMap);

    if (topicKeys.length === 0) {
      return { success: false, message: 'Tidak ada data soal ditemukan di sheet Bank Soal.' };
    }

    let totalSyncedQuestions = 0;
    let syncedTopics = 0;

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

    return {
      success: true,
      message: `Berhasil mensinkronkan ${syncedTopics} bab (${totalSyncedQuestions} soal) dari Spreadsheet ke Firebase Firestore!`,
      syncedTopicsCount: syncedTopics,
      totalQuestionsCount: totalSyncedQuestions,
    };
  } catch (error: any) {
    console.error('Gagal mensinkronkan Bank Soal:', error);
    return {
      success: false,
      message: error.message || 'Terjadi kesalahan saat mensinkronkan data soal.',
    };
  }
}
