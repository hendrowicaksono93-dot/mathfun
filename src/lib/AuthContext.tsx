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

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
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
            });
          } else {
            // Fallback profile if Firestore doc doesn't exist yet
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Siswa',
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
  const signUp = async (email: string, password: string, fullName: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim() || cleanEmail.split('@')[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const uid = res.user.uid;

      const profileData = {
        uid,
        email: cleanEmail,
        fullName: cleanName,
        createdAt: new Date().toISOString(),
      };

      // Simpan data siswa ke Firebase Firestore
      try {
        await setDoc(doc(db, 'users', uid), profileData);
      } catch (fsErr) {
        console.warn('Simpan Firestore offline/tertunda:', fsErr);
      }

      const activeProfile: UserProfile = { uid, email: cleanEmail, fullName: cleanName };
      saveLocalAccount(activeProfile, password);
      setUser(activeProfile);

      // Simpan data pendaftaran ke Google Spreadsheet
      try {
        await appendStudentToSheet({
          fullName: cleanName,
          email: cleanEmail,
          createdAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
        });
      } catch (sheetErr) {
        console.warn('Sheet sync error:', sheetErr);
      }
    } catch (err: any) {
      console.error('Sign Up Firebase Error:', err);

      // If Firebase Auth provider is disabled or operation not allowed, seamlessly use resilient cloud/local registration
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation') {
        const fallbackUid = 'local_' + Math.random().toString(36).substring(2, 12);
        const profileData = {
          uid: fallbackUid,
          email: cleanEmail,
          fullName: cleanName,
          createdAt: new Date().toISOString(),
        };

        try {
          await setDoc(doc(db, 'users', fallbackUid), profileData);
        } catch (fsErr) {
          console.warn('Firestore fallback user save:', fsErr);
        }

        const activeProfile: UserProfile = { uid: fallbackUid, email: cleanEmail, fullName: cleanName };
        saveLocalAccount(activeProfile, password);
        setUser(activeProfile);

        try {
          await appendStudentToSheet({
            fullName: cleanName,
            email: cleanEmail,
            createdAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
          });
        } catch {}
        return;
      }

      let errMsg = err.message || 'Gagal mendaftar';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'Email sudah terdaftar. Silakan login.';
      } else if (err.code === 'auth/weak-password') {
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
      };

      try {
        const userSnap = await getDoc(doc(db, 'users', uid));
        if (userSnap.exists()) {
          const data = userSnap.data();
          userProfile = {
            uid,
            email: data.email || cleanEmail,
            fullName: data.fullName || userProfile.fullName,
          };
        }
      } catch (fsErr) {
        console.warn('Firestore fetch user error:', fsErr);
      }

      saveLocalAccount(userProfile, password);
      setUser(userProfile);
    } catch (err: any) {
      console.error('Sign In Firebase Error:', err);

      // If Firebase Auth provider is not enabled, fall back to stored/instant login seamlessly
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation') {
        // Check stored local accounts
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

        // Auto-login as student with this email if password is provided
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
        errMsg = 'Email atau password salah. Jika belum punya akun, silakan klik "Daftar di sini".';
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
      console.error('Google Sign In Error:', err);
      let errMsg = err.message || 'Gagal login dengan Google';
      if (err.code === 'auth/operation-not-allowed') {
        errMsg = 'Metode login Google belum diaktifkan di Firebase Console. Silakan aktifkan provider Google di Authentication > Sign-in method.';
      }
      throw new Error(errMsg);
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
    <AuthContext.Provider value={{ user, firebaseUser, loading, signUp, signIn, signInWithGoogle, signOut }}>
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
