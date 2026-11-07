import { db, doc, getDoc, setDoc, collection, getDocs, query, where } from './firebase';

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

const MAX_ALLOWED_ATTEMPTS = 2;

function getAttemptDocId(userId: string, topicId: string): string {
  const cleanUser = (userId || 'anon').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  const cleanTopic = (topicId || 'default').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  return `${cleanUser}_${cleanTopic}`;
}

function getLocalAttemptKey(userId: string, topicId: string): string {
  return `mathfun_attempt_${getAttemptDocId(userId, topicId)}`;
}

/**
 * Retrieves the attempt count and history for a given user and topic.
 * Checks Firestore doc, falls back to `scores` query, and local storage.
 */
export async function getUserAttemptData(
  userId: string,
  topicId: string,
  email?: string
): Promise<UserAttemptData> {
  if (!userId && !email) {
    return { count: 0, history: [], isMaxReached: false };
  }

  const effectiveId = userId || email || '';
  const docId = getAttemptDocId(effectiveId, topicId);
  const localKey = getLocalAttemptKey(effectiveId, topicId);

  // 1. Check direct Firestore user_attempts document
  try {
    const docRef = doc(db, 'user_attempts', docId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      const count = Number(data.count) || (Array.isArray(data.history) ? data.history.length : 0);
      const history: AttemptHistoryItem[] = Array.isArray(data.history) ? data.history : [];
      const bestScore = history.length > 0 ? Math.max(...history.map(h => h.score || 0)) : undefined;

      // Update local storage mirror
      try {
        localStorage.setItem(localKey, JSON.stringify({ count, history, bestScore }));
      } catch (e) {
        // ignore
      }

      return {
        count,
        history,
        isMaxReached: count >= MAX_ALLOWED_ATTEMPTS,
        bestScore
      };
    }
  } catch (err) {
    console.warn('[AttemptService] Error fetching user_attempts from Firestore:', err);
  }

  // 2. Fallback: Check existing scores collection to count past completions
  try {
    const scoresRef = collection(db, 'scores');
    const snapshot = await getDocs(scoresRef);
    const matchedScores: AttemptHistoryItem[] = [];

    snapshot.forEach(docSnap => {
      const d = docSnap.data();
      if (!d) return;
      const isMatchUser = (d.userId && d.userId === userId) || (email && d.email && d.email.toLowerCase() === email.toLowerCase());
      const isMatchTopic = d.topicId === topicId || (d.topicId && d.topicId.toLowerCase().replace(/[^a-z0-9_-]/g, '-') === topicId.toLowerCase().replace(/[^a-z0-9_-]/g, '-'));

      if (isMatchUser && isMatchTopic) {
        matchedScores.push({
          attemptNumber: matchedScores.length + 1,
          score: Number(d.score) || 0,
          date: d.createdAt || new Date().toISOString(),
          pg: d.correctPilihan,
          isian: d.correctIsian
        });
      }
    });

    if (matchedScores.length > 0) {
      const count = matchedScores.length;
      const bestScore = Math.max(...matchedScores.map(m => m.score || 0));

      // Auto-migrate to user_attempts doc in background
      try {
        const docRef = doc(db, 'user_attempts', docId);
        setDoc(docRef, {
          userId: effectiveId,
          email: email || '',
          topicId,
          count,
          history: matchedScores,
          bestScore,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        // ignore
      }

      return {
        count,
        history: matchedScores,
        isMaxReached: count >= MAX_ALLOWED_ATTEMPTS,
        bestScore
      };
    }
  } catch (err) {
    console.warn('[AttemptService] Error checking scores collection:', err);
  }

  // 3. Fallback: Local Storage
  try {
    const cached = localStorage.getItem(localKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const count = Number(parsed.count) || 0;
      const history = Array.isArray(parsed.history) ? parsed.history : [];
      return {
        count,
        history,
        isMaxReached: count >= MAX_ALLOWED_ATTEMPTS,
        bestScore: parsed.bestScore
      };
    }
  } catch {
    // ignore
  }

  return { count: 0, history: [], isMaxReached: false };
}

/**
 * Records a new completed attempt for the user.
 * Increments count up to 2 and appends history.
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
  const effectiveId = userId || data.email || 'anon';
  const docId = getAttemptDocId(effectiveId, topicId);
  const localKey = getLocalAttemptKey(effectiveId, topicId);

  // Fetch current state first
  const current = await getUserAttemptData(userId, topicId, data.email);
  const newCount = current.count + 1;
  const newHistoryItem: AttemptHistoryItem = {
    attemptNumber: newCount,
    score: data.score,
    date: new Date().toISOString(),
    pg: data.pg,
    isian: data.isian
  };

  const updatedHistory = [...current.history, newHistoryItem];
  const bestScore = Math.max(...updatedHistory.map(h => h.score || 0));

  // Save to Firestore
  try {
    const docRef = doc(db, 'user_attempts', docId);
    await setDoc(docRef, {
      userId: effectiveId,
      email: data.email || '',
      fullName: data.fullName || '',
      topicId,
      topicName: data.topicName || topicId,
      count: newCount,
      history: updatedHistory,
      bestScore,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('[AttemptService] Gagal menyimpan user_attempts ke Firestore:', err);
  }

  // Save to LocalStorage
  try {
    localStorage.setItem(localKey, JSON.stringify({
      count: newCount,
      history: updatedHistory,
      bestScore
    }));
  } catch (e) {
    // ignore
  }

  return {
    newCount,
    isMaxReached: newCount >= MAX_ALLOWED_ATTEMPTS
  };
}

/**
 * Resets attempt count for a user (Teacher/Guru tool for testing or manual permission)
 */
export async function resetUserAttempts(userId: string, topicId: string, email?: string): Promise<boolean> {
  const effectiveId = userId || email || 'anon';
  const docId = getAttemptDocId(effectiveId, topicId);
  const localKey = getLocalAttemptKey(effectiveId, topicId);

  try {
    const docRef = doc(db, 'user_attempts', docId);
    await setDoc(docRef, {
      userId: effectiveId,
      email: email || '',
      topicId,
      count: 0,
      history: [],
      bestScore: 0,
      updatedAt: new Date().toISOString()
    });
    localStorage.removeItem(localKey);
    return true;
  } catch (err) {
    console.error('[AttemptService] Gagal mereset attempts:', err);
    return false;
  }
}
