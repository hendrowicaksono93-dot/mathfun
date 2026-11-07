import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  googleProvider, 
  firebaseSignOut, 
  onAuthStateChanged,
  doc, 
  getDoc, 
  setDoc,
  FirebaseUser 
} from './firebase';
import { GoogleAuthProvider } from 'firebase/auth';
import { appendStudentToSheet, setGoogleAccessToken } from './sheets';

export const SMP_CLASSES = [
  '7A', '7B', '7C', '7D', '7E', '7F', '7G', '7H', '7I',
  '8A', '8B', '8C', '8D', '8E', '8F', '8G', '8H', '8I',
  '9A', '9B', '9C', '9D', '9E', '9F', '9G', '9H', '9I',
] as const;

export type SmpClassType = typeof SMP_CLASSES[number];

/**
 * Combines Class and Student Name into format "KELAS_NAMA SISWA"
 * without altering Google Spreadsheet columns.
 */
export function formatStudentNameWithClass(fullName: string, className?: string): string {
  const cleanName = (fullName || 'Siswa').trim();
  const cleanClass = (className || '').trim().toUpperCase();
  if (!cleanClass) return cleanName;
  if (cleanName.toUpperCase().startsWith(`${cleanClass}_`)) {
    return cleanName;
  }
  return `${cleanClass}_${cleanName}`;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  className?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, className?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (fullName: string, className: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check stored local session on startup if Firebase Auth is not active
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Fetch user data from Firebase Firestore
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            setUser({
              uid: fbUser.uid,
              email: fbUser.email || data.email || '',
              fullName: data.fullName || fbUser.displayName || 'Siswa',
              className: data.className || '',
            });
          } else {
            // Fallback profile if Firestore doc doesn't exist yet
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Siswa',
              className: '',
            };
            setUser(newProfile);
            // Create user document in Firebase Firestore
            try {
              await setDoc(userDocRef, {
                uid: fbUser.uid,
                email: newProfile.email,
                fullName: newProfile.fullName,
                createdAt: new Date().toISOString(),
              });
            } catch (setErr) {
              console.warn('Firestore setDoc offline/deferred:', setErr);
            }
          }
        } catch (err) {
          console.warn('Gagal mengambil data siswa dari Firebase (menggunakan data lokal/auth):', err);
          setUser({
            uid: fbUser.uid,
            email: fbUser.email || '',
            fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Siswa',
          });
        }
      } else {
        // Check local storage session fallback
        const savedSession = localStorage.getItem('mathfun_active_user');
        if (savedSession) {
          try {
            const parsed = JSON.parse(savedSession);
            if (parsed && parsed.email && parsed.fullName) {
              setUser(parsed);
            } else {
              setUser(null);
            }
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper to persist local fallback user accounts
  const saveLocalAccount = (userProfile: UserProfile, passwordStr: string) => {
    localStorage.setItem('mathfun_active_user', JSON.stringify(userProfile));
    try {
      const stored = localStorage.getItem('mathfun_registered_users');
      const list: Record<string, { profile: UserProfile; pass: string }> = stored ? JSON.parse(stored) : {};
      list[userProfile.email.toLowerCase()] = { profile: userProfile, pass: passwordStr };
      localStorage.setItem('mathfun_registered_users', JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save to mathfun_registered_users', e);
    }
  };

  // 1. Pendaftaran Siswa (Register) -> Simpan di Firebase Firestore & Google Spreadsheet
  const signUp = async (email: string, password: string, fullName: string, className?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim() || cleanEmail.split('@')[0];
    const cleanClass = (className || '').trim().toUpperCase();

    try {
      const res = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const uid = res.user.uid;

      const profileData = {
        uid,
        email: cleanEmail,
        fullName: cleanName,
        className: cleanClass,
        createdAt: new Date().toISOString(),
      };

      // Simpan data siswa ke Firebase Firestore
      try {
        await setDoc(doc(db, 'users', uid), profileData);
      } catch (fsErr) {
        console.warn('Simpan Firestore offline/tertunda:', fsErr);
      }

      const activeProfile: UserProfile = { uid, email: cleanEmail, fullName: cleanName, className: cleanClass };
      saveLocalAccount(activeProfile, password);
      setUser(activeProfile);

      // Simpan data pendaftaran ke Google Spreadsheet (Format: KELAS_NAMA SISWA)
      try {
        const formattedName = formatStudentNameWithClass(cleanName, cleanClass);
        await appendStudentToSheet({
          fullName: formattedName,
          email: cleanEmail,
          createdAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
        });
      } catch (sheetErr) {
        console.warn('Sheet sync error:', sheetErr);
      }
    } catch (err: any) {
      console.warn('Sign Up Firebase Error (Handled):', err);

      // If already registered, attempt sign-in automatically
      if (err.code === 'auth/email-already-in-use') {
        try {
          const signInRes = await signInWithEmailAndPassword(auth, cleanEmail, password);
          const uid = signInRes.user.uid;
          const activeProfile: UserProfile = { uid, email: cleanEmail, fullName: cleanName, className: cleanClass };
          saveLocalAccount(activeProfile, password);
          setUser(activeProfile);
          return;
        } catch (signInErr: any) {
          throw new Error('Email sudah terdaftar. Silakan masukkan kata sandi yang benar atau klik tab "Masuk di sini".');
        }
      }

      // If Firebase Auth provider is disabled or domain restricted, seamlessly use resilient cloud/local registration
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation' || err.code === 'auth/unauthorized-domain') {
        const fallbackUid = 'local_' + Math.random().toString(36).substring(2, 12);
        const profileData = {
          uid: fallbackUid,
          email: cleanEmail,
          fullName: cleanName,
          className: cleanClass,
          createdAt: new Date().toISOString(),
        };

        try {
          await setDoc(doc(db, 'users', fallbackUid), profileData);
        } catch (fsErr) {
          console.warn('Firestore fallback user save:', fsErr);
        }

        const activeProfile: UserProfile = { uid: fallbackUid, email: cleanEmail, fullName: cleanName, className: cleanClass };
        saveLocalAccount(activeProfile, password);
        setUser(activeProfile);

        try {
          const formattedName = formatStudentNameWithClass(cleanName, cleanClass);
          await appendStudentToSheet({
            fullName: formattedName,
            email: cleanEmail,
            createdAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
          });
        } catch {}
        return;
      }

      let errMsg = err.message || 'Gagal mendaftar';
      if (err.code === 'auth/weak-password') {
        errMsg = 'Password minimal 6 karakter.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Format email tidak valid.';
      }
      throw new Error(errMsg);
    }
  };

  // 2. Login Siswa -> Ambil data dari Firebase Firestore / Local Fallback
  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const uid = res.user.uid;

      // Ambil profil siswa dari Firebase Firestore
      let userProfile: UserProfile = {
        uid,
        email: cleanEmail,
        fullName: res.user.displayName || cleanEmail.split('@')[0],
        className: '',
      };

      try {
        const userSnap = await getDoc(doc(db, 'users', uid));
        if (userSnap.exists()) {
          const data = userSnap.data();
          userProfile = {
            uid,
            email: data.email || cleanEmail,
            fullName: data.fullName || userProfile.fullName,
            className: data.className || '',
          };
        }
      } catch (fsErr) {
        console.warn('Firestore fetch user error:', fsErr);
      }

      saveLocalAccount(userProfile, password);
      setUser(userProfile);
    } catch (err: any) {
      console.warn('Sign In Firebase Error (Handled):', err);

      // Check stored local accounts for fallback
      try {
        const stored = localStorage.getItem('mathfun_registered_users');
        if (stored) {
          const list = JSON.parse(stored);
          const userEntry = list[cleanEmail];
          if (userEntry && userEntry.profile) {
            if (userEntry.pass && userEntry.pass !== password) {
              throw new Error('Password salah. Silakan periksa kembali kata sandi Anda.');
            }
            localStorage.setItem('mathfun_active_user', JSON.stringify(userEntry.profile));
            setUser(userEntry.profile);
            return;
          }
        }
      } catch (storageErr) {
        console.warn(storageErr);
      }

      // If Firebase Auth provider is not enabled, fall back to stored/instant login seamlessly
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation' || err.code === 'auth/unauthorized-domain') {
        if (password && password.length >= 3) {
          const fallbackUid = 'local_' + Math.random().toString(36).substring(2, 10);
          const fallbackProfile: UserProfile = {
            uid: fallbackUid,
            email: cleanEmail,
            fullName: cleanEmail.split('@')[0],
          };
          saveLocalAccount(fallbackProfile, password);
          setUser(fallbackProfile);
          return;
        }
      }

      let errMsg = err.message || 'Gagal masuk';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errMsg = 'Email atau kata sandi tidak cocok. Jika Anda siswa baru dan belum pernah mendaftar, silakan klik tombol "Daftar di sini".';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Format email tidak valid.';
      }
      throw new Error(errMsg);
    }
  };

  // 3. Login Google OAuth -> Dapat OAuth Token untuk Google Sheets API & Firebase
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      if (accessToken) {
        setGoogleAccessToken(accessToken);
      }

      const fbUser = result.user;
      const fullName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Siswa';
      const email = fbUser.email || '';

      // Simpan / update di Firebase Firestore
      try {
        await setDoc(
          doc(db, 'users', fbUser.uid),
          {
            uid: fbUser.uid,
            email,
            fullName,
            createdAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (fsErr) {
        console.warn('Simpan Firestore offline/tertunda:', fsErr);
      }

      setUser({
        uid: fbUser.uid,
        email,
        fullName,
      });

      // Simpan data pendaftaran/login siswa ke Google Sheet
      await appendStudentToSheet({
        fullName,
        email,
        createdAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      });
    } catch (err: any) {
      console.warn('Google Sign In Error (Handled):', err);
      let errMsg = err.message || 'Gagal login dengan Google';
      if (err.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'domain ini';
        errMsg = `Domain "${domain}" belum diotorisasi di Firebase Console. Anda dapat login langsung menggunakan formulir Email & Kata Sandi di bawah, atau tambahkan domain ini ke Firebase Console > Authentication > Settings > Authorized domains.`;
      } else if (err.code === 'auth/operation-not-allowed') {
        errMsg = 'Metode login Google belum diaktifkan di Firebase Console. Silakan aktifkan provider Google di Authentication > Sign-in method atau gunakan pendaftaran Email.';
      } else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        errMsg = 'Jendela login Google ditutup sebelum proses selesai. Silakan coba lagi atau gunakan login Email.';
      } else if (err.code === 'auth/popup-blocked') {
        errMsg = 'Popup login Google diblokir oleh browser. Izinkan popup untuk situs ini atau gunakan form login Email.';
      }
      throw new Error(errMsg);
    }
  };

  // 4. Update Profil Siswa (Nama & Kelas) -> Simpan di Firebase Firestore & Google Spreadsheet
  const updateProfile = async (newFullName: string, newClassName: string) => {
    if (!user) throw new Error('Tidak ada akun siswa yang sedang aktif.');
    const cleanName = newFullName.trim() || user.fullName;
    const cleanClass = newClassName.trim().toUpperCase();

    const updatedProfile: UserProfile = {
      ...user,
      fullName: cleanName,
      className: cleanClass,
    };

    // 1. Simpan ke Firebase Firestore
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          email: user.email,
          fullName: cleanName,
          className: cleanClass,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (fsErr) {
      console.warn('Gagal update profile di Firestore:', fsErr);
    }

    // 2. Simpan ke Local Storage
    localStorage.setItem('mathfun_active_user', JSON.stringify(updatedProfile));
    try {
      const stored = localStorage.getItem('mathfun_registered_users');
      if (stored) {
        const list = JSON.parse(stored);
        if (list[user.email.toLowerCase()]) {
          list[user.email.toLowerCase()].profile = updatedProfile;
          localStorage.setItem('mathfun_registered_users', JSON.stringify(list));
        }
      }
    } catch (e) {
      console.warn(e);
    }

    // 3. Update React State
    setUser(updatedProfile);

    // 4. Sinkronkan nama berformat KELAS_NAMA SISWA ke Google Spreadsheet
    try {
      const formattedName = formatStudentNameWithClass(cleanName, cleanClass);
      await appendStudentToSheet({
        fullName: formattedName,
        email: user.email,
        createdAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      });
    } catch (sheetErr) {
      console.warn('Gagal update nama siswa ke spreadsheet:', sheetErr);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {}
    localStorage.removeItem('mathfun_active_user');
    setGoogleAccessToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signUp, signIn, signInWithGoogle, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
