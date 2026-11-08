import { db, doc, getDoc, setDoc, collection, getDocs } from './firebase';
import { appendAttemptToSheet, appendResetAttemptToSheet } from './sheets';

export interface AttemptHistoryItem {
  attemptNumber: number;
  score: number;
  date: string;
  pg?: number;
  isian?: number;
}

export interface UserAttemptData {
  count: number;
  history: AttemptHistoryItem[];
  isMaxReached: boolean;
  bestScore?: number;
}

export interface StudentAttemptSummary {
  docId: string;
  userId: string;
  email: string;
  fullName: string;
  topicId: string;
  topicName: string;
  count: number;
  bestScore?: number;
  updatedAt: string;
  history: AttemptHistoryItem[];
}

export const MAX_ALLOWED_ATTEMPTS = 2;

/**
 * Normalizes topic ID to clean consistent slug (e.g., 'transformasi-geometri')
 */
export function normalizeTopicId(topicId: string): string {
  return (topicId || 'default')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates primary attempt docId based on email and topicId.
 * Email is the permanent, unique identifier for students across devices.
 */
export function getAttemptDocId(emailOrUid: string, topicId: string): string {
  const cleanUser = (emailOrUid || 'anon').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  const cleanTopic = normalizeTopicId(topicId).replace(/[^a-z0-9_-]/g, '_');
  return `${cleanUser}_${cleanTopic}`;
}

export function getLocalAttemptKey(emailOrUid: string, topicId: string): string {
  return `mathfun_attempt_${getAttemptDocId(emailOrUid, topicId)}`;
}

/**
 * Cleans and deduplicates rapid double-click submissions (< 5 seconds apart with same score).
 * This fixes the issue where a single student submission was counted twice!
 */
export function cleanAndDeduplicateHistory(history: AttemptHistoryItem[]): AttemptHistoryItem[] {
  if (!Array.isArray(history) || history.length <= 1) return history || [];
  const deduped: AttemptHistoryItem[] = [];

  for (let i = 0; i < history.length; i++) {
    const item = history[i];
    if (deduped.length > 0) {
      const prev = deduped[deduped.length - 1];
      const prevTime = new Date(prev.date).getTime();
      const currTime = new Date(item.date).getTime();
      // If within 5 seconds and same score, treat as accidental double submission
      if (!isNaN(prevTime) && !isNaN(currTime) && Math.abs(currTime - prevTime) < 5000 && prev.score === item.score) {
        continue;
      }
    }
    deduped.push({
      ...item,
      attemptNumber: deduped.length + 1
    });
  }
  return deduped;
}

/**
 * Retrieves the attempt count and history for a given user and topic.
 * Strictly scopes by the specific topicId.
 */
export async function getUserAttemptData(
  userId: string,
  topicId: string,
  email?: string
): Promise<UserAttemptData> {
  const cleanTopic = normalizeTopicId(topicId);
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanUid = (userId || '').trim();

  if (!cleanEmail && !cleanUid) {
    return { count: 0, history: [], isMaxReached: false };
  }

  // 1. Check primary document (keyed by email)
  if (cleanEmail) {
    const emailDocId = getAttemptDocId(cleanEmail, cleanTopic);
    try {
      const docRef = doc(db, 'user_attempts', emailDocId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        const rawHistory: AttemptHistoryItem[] = Array.isArray(data.history) ? data.history : [];
        const cleanHistory = cleanAndDeduplicateHistory(rawHistory);
        const count = cleanHistory.length;
        const bestScore = cleanHistory.length > 0 ? Math.max(...cleanHistory.map(h => h.score || 0)) : undefined;

        // Auto-fix Firestore if dirty duplicate attempts existed
        if (data.count !== count && rawHistory.length !== cleanHistory.length) {
          try {
            await setDoc(docRef, { count, history: cleanHistory, bestScore }, { merge: true });
          } catch {}
        }

        const localKey = getLocalAttemptKey(cleanEmail, cleanTopic);
        try {
          localStorage.setItem(localKey, JSON.stringify({ count, history: cleanHistory, bestScore }));
        } catch {}

        return {
          count,
          history: cleanHistory,
          isMaxReached: count >= MAX_ALLOWED_ATTEMPTS,
          bestScore
        };
      }
    } catch (err) {
      console.warn('[AttemptService] Error fetching user_attempts by email:', err);
    }
  }

  // 2. Check fallback document (keyed by UID)
  if (cleanUid) {
    const uidDocId = getAttemptDocId(cleanUid, cleanTopic);
    try {
      const docRef = doc(db, 'user_attempts', uidDocId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        const rawHistory: AttemptHistoryItem[] = Array.isArray(data.history) ? data.history : [];
        const cleanHistory = cleanAndDeduplicateHistory(rawHistory);
        const count = cleanHistory.length;
        const bestScore = cleanHistory.length > 0 ? Math.max(...cleanHistory.map(h => h.score || 0)) : undefined;

        // Migrate to emailDocId if email is known
        if (cleanEmail) {
          try {
            const emailDocRef = doc(db, 'user_attempts', getAttemptDocId(cleanEmail, cleanTopic));
            await setDoc(emailDocRef, {
              ...data,
              userId: cleanUid,
              email: cleanEmail,
              topicId: cleanTopic,
              count,
              history: cleanHistory,
              bestScore,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          } catch {}
        }

        return {
          count,
          history: cleanHistory,
          isMaxReached: count >= MAX_ALLOWED_ATTEMPTS,
          bestScore
        };
      }
    } catch (err) {
      console.warn('[AttemptService] Error fetching user_attempts by UID:', err);
    }
  }

  // 3. Fallback: Local Storage
  const preferredKey = cleanEmail || cleanUid;
  const localKey = getLocalAttemptKey(preferredKey, cleanTopic);
  try {
    const cached = localStorage.getItem(localKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const rawHistory = Array.isArray(parsed.history) ? parsed.history : [];
      const cleanHistory = cleanAndDeduplicateHistory(rawHistory);
      const count = cleanHistory.length;
      return {
        count,
        history: cleanHistory,
        isMaxReached: count >= MAX_ALLOWED_ATTEMPTS,
        bestScore: parsed.bestScore
      };
    }
  } catch {}

  return { count: 0, history: [], isMaxReached: false };
}

/**
 * Records a new completed attempt for the user.
 * Strictly increments count up to 2 and prevents duplicate rapid submissions.
 */
export async function recordUserAttempt(
  userId: string,
  topicId: string,
  data: {
    score: number;
    pg: number;
    isian: number;
    email?: string;
    fullName?: string;
    topicName?: string;
  }
): Promise<{ newCount: number; isMaxReached: boolean }> {
  const cleanTopic = normalizeTopicId(topicId);
  const cleanEmail = (data.email || '').trim().toLowerCase();
  const cleanUid = (userId || '').trim();
  const primaryId = cleanEmail || cleanUid || 'anon';

  const docId = getAttemptDocId(primaryId, cleanTopic);
  const localKey = getLocalAttemptKey(primaryId, cleanTopic);

  // Fetch current state first
  const current = await getUserAttemptData(userId, cleanTopic, data.email);

  // Anti-Double Submit Guard: If last attempt was less than 8 seconds ago with identical score, return current
  if (current.history.length > 0) {
    const lastItem = current.history[current.history.length - 1];
    if (lastItem && lastItem.date) {
      const lastMs = new Date(lastItem.date).getTime();
      const diffMs = Math.abs(Date.now() - lastMs);
      if (!isNaN(diffMs) && diffMs < 8000 && lastItem.score === data.score) {
        console.warn('[AttemptService] Anti-Double-Submit: Submission ignored (recorded < 8s ago)');
        return {
          newCount: current.count,
          isMaxReached: current.count >= MAX_ALLOWED_ATTEMPTS
        };
      }
    }
  }

  const newCount = Math.min(current.count + 1, MAX_ALLOWED_ATTEMPTS);
  const newHistoryItem: AttemptHistoryItem = {
    attemptNumber: newCount,
    score: data.score,
    date: new Date().toISOString(),
    pg: data.pg,
    isian: data.isian
  };

  const updatedHistory = [...current.history, newHistoryItem];
  const bestScore = Math.max(...updatedHistory.map(h => h.score || 0));

  const docData = {
    userId: cleanUid,
    email: cleanEmail,
    fullName: data.fullName || 'Siswa',
    topicId: cleanTopic,
    topicName: data.topicName || cleanTopic,
    count: newCount,
    history: updatedHistory,
    bestScore,
    updatedAt: new Date().toISOString()
  };

  // 1. Save to Firestore user_attempts
  try {
    const docRef = doc(db, 'user_attempts', docId);
    await setDoc(docRef, docData, { merge: true });

    // Also mirror to UID doc if email was used, for dual-compat
    if (cleanEmail && cleanUid) {
      const uidDocRef = doc(db, 'user_attempts', getAttemptDocId(cleanUid, cleanTopic));
      await setDoc(uidDocRef, docData, { merge: true });
    }
  } catch (err) {
    console.error('[AttemptService] Gagal menyimpan user_attempts ke Firestore:', err);
  }

  // 2. Save to LocalStorage
  try {
    localStorage.setItem(localKey, JSON.stringify({
      count: newCount,
      history: updatedHistory,
      bestScore
    }));
  } catch {}

  // 3. Sync to Google Spreadsheet Tab "Data Percobaan Siswa"
  try {
    const nowStr = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    appendAttemptToSheet({
      fullName: data.fullName || 'Siswa',
      email: cleanEmail || cleanUid,
      topicId: cleanTopic,
      topicName: data.topicName || cleanTopic,
      attemptNumber: newCount,
      score: data.score,
      statusQuota: `${newCount} / ${MAX_ALLOWED_ATTEMPTS}`,
      note: newCount >= MAX_ALLOWED_ATTEMPTS ? 'Batas Percobaan Tercapai' : 'Tersisa 1 Kesempatan',
      createdAt: nowStr
    }).catch(e => console.warn('Spreadsheet attempt sync non-blocking error:', e));
  } catch {}

  return {
    newCount,
    isMaxReached: newCount >= MAX_ALLOWED_ATTEMPTS
  };
}

/**
 * Resets attempt count for a user and topic.
 * (Teacher/Guru tool for retests or testing permissions)
 */
export async function resetUserAttempts(
  userId: string, 
  topicId: string, 
  email?: string,
  fullName?: string,
  teacherName?: string
): Promise<boolean> {
  const cleanTopic = normalizeTopicId(topicId);
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanUid = (userId || '').trim();
  const primaryId = cleanEmail || cleanUid || 'anon';

  const resetData = {
    userId: cleanUid,
    email: cleanEmail,
    fullName: fullName || cleanEmail.split('@')[0] || 'Siswa',
    topicId: cleanTopic,
    count: 0,
    history: [],
    bestScore: 0,
    updatedAt: new Date().toISOString(),
    lastResetBy: teacherName || 'Guru',
    lastResetAt: new Date().toISOString()
  };

  try {
    // Reset primary email doc
    if (cleanEmail) {
      const emailDocRef = doc(db, 'user_attempts', getAttemptDocId(cleanEmail, cleanTopic));
      await setDoc(emailDocRef, resetData);
      localStorage.removeItem(getLocalAttemptKey(cleanEmail, cleanTopic));
    }

    // Reset UID doc
    if (cleanUid) {
      const uidDocRef = doc(db, 'user_attempts', getAttemptDocId(cleanUid, cleanTopic));
      await setDoc(uidDocRef, resetData);
      localStorage.removeItem(getLocalAttemptKey(cleanUid, cleanTopic));
    }

    // Also remove generic key
    localStorage.removeItem(getLocalAttemptKey(primaryId, cleanTopic));

    // Log the reset event to Google Spreadsheet
    try {
      const nowStr = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
      appendResetAttemptToSheet({
        fullName: fullName || cleanEmail || 'Siswa',
        email: cleanEmail || cleanUid,
        topicId: cleanTopic,
        topicName: cleanTopic,
        resetBy: teacherName || 'Guru / Admin',
        createdAt: nowStr
      }).catch(() => {});
    } catch {}

    return true;
  } catch (err) {
    console.error('[AttemptService] Gagal mereset attempts:', err);
    return false;
  }
}

/**
 * Adjusts student attempts (e.g., set to 1 so student gets 1 more chance, or reset to 0)
 */
export async function adjustStudentAttempt(
  emailOrUid: string,
  topicId: string,
  newCount: number,
  teacherName?: string
): Promise<boolean> {
  const cleanTopic = normalizeTopicId(topicId);
  const cleanUser = emailOrUid.trim().toLowerCase();
  const docId = getAttemptDocId(cleanUser, cleanTopic);

  try {
    const docRef = doc(db, 'user_attempts', docId);
    const snap = await getDoc(docRef);
    const existing = snap.exists() ? snap.data() : {};

    await setDoc(docRef, {
      ...existing,
      count: newCount,
      updatedAt: new Date().toISOString(),
      lastModifiedBy: teacherName || 'Guru'
    }, { merge: true });

    localStorage.removeItem(getLocalAttemptKey(cleanUser, cleanTopic));
    return true;
  } catch (err) {
    console.error('[AttemptService] Gagal mengubah attempt count:', err);
    return false;
  }
}

/**
 * Retrieves all recorded student attempts across all topics for the Guru Dashboard.
 */
export async function getAllStudentAttempts(): Promise<StudentAttemptSummary[]> {
  try {
    const snap = await getDocs(collection(db, 'user_attempts'));
    const list: StudentAttemptSummary[] = [];

    snap.forEach(d => {
      const data = d.data();
      if (!data) return;
      const rawHistory = Array.isArray(data.history) ? data.history : [];
      const cleanHistory = cleanAndDeduplicateHistory(rawHistory);
      const count = Number(data.count) || cleanHistory.length;

      // Only include records that have user and topic info
      const email = data.email || '';
      const uid = data.userId || '';
      const fullName = data.fullName || email.split('@')[0] || 'Siswa';
      const topicId = data.topicId || '';
      const topicName = data.topicName || topicId;

      list.push({
        docId: d.id,
        userId: uid,
        email,
        fullName,
        topicId,
        topicName,
        count,
        bestScore: data.bestScore !== undefined ? data.bestScore : (cleanHistory.length > 0 ? Math.max(...cleanHistory.map(h => h.score || 0)) : undefined),
        updatedAt: data.updatedAt || '',
        history: cleanHistory
      });
    });

    // Sort by most recently updated
    return list.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
  } catch (err) {
    console.error('[AttemptService] Gagal mengambil daftar semua student attempts:', err);
    return [];
  }
}
