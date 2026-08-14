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
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 1. Pendaftaran Siswa (Register) -> Simpan di Firebase Firestore & Google Spreadsheet
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      const profileData = {
        uid,
        email,
        fullName,
        createdAt: new Date().toISOString(),
      };

      // Simpan data siswa ke Firebase Firestore
      try {
        await setDoc(doc(db, 'users', uid), profileData);
      } catch (fsErr) {
        console.warn('Simpan Firestore offline/tertunda:', fsErr);
      }

      setUser({ uid, email, fullName });

      // Simpan data pendaftaran ke Google Spreadsheet
      const sheetRes = await appendStudentToSheet({
        fullName,
        email,
        createdAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      });

      if (sheetRes.success) {
        alert('Pendaftaran berhasil! Akun tersimpan di Firebase & Google Sheet.');
      } else {
        alert(`Pendaftaran berhasil! Akun tersimpan di Firebase. (Catatan Spreadsheet: ${sheetRes.message})`);
      }
    } catch (err: any) {
      console.error('Sign Up Error:', err);
      let errMsg = err.message || 'Gagal mendaftar';
      if (err.code === 'auth/operation-not-allowed') {
        errMsg = 'Metode pendaftaran Email/Password belum diaktifkan di Firebase Console. Aktifkan di menu Authentication > Sign-in method.';
      } else if (err.code === 'auth/email-already-in-use') {
        errMsg = 'Email sudah terdaftar. Silakan login.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Password minimal 6 karakter.';
      }
      throw new Error(errMsg);
    }
  };

  // 2. Login Siswa -> Ambil data dari Firebase Firestore
  const signIn = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      // Ambil profil siswa dari Firebase Firestore
      const userSnap = await getDoc(doc(db, 'users', uid));
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUser({
          uid,
          email: data.email || email,
          fullName: data.fullName || 'Siswa',
        });
      } else {
        setUser({
          uid,
          email,
          fullName: res.user.displayName || email.split('@')[0],
        });
      }
    } catch (err: any) {
      console.error('Sign In Error:', err);
      let errMsg = err.message || 'Gagal masuk';
      if (err.code === 'auth/operation-not-allowed') {
        errMsg = 'Metode masuk Email/Password belum diaktifkan di Firebase Console. Aktifkan di menu Authentication > Sign-in method.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errMsg = 'Email atau password salah. Silakan periksa kembali.';
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
    await firebaseSignOut(auth);
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
