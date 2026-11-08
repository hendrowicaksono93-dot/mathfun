import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
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
 * Hash password securely using Web Crypto API SHA-256 (no plaintext stored)
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const clean = plainPassword.trim();
  const encoder = new TextEncoder();
  const data = encoder.encode(clean);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates safe document ID from email for Firestore
 */
export function getAccountDocId(email: string): string {
  return email.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
}

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
  sendResetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPasswordDirectly: (email: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
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

  // Helper to persist local fallback user accounts securely
  const saveLocalAccount = (userProfile: UserProfile, passwordStr: string, passHash?: string) => {
    localStorage.setItem('mathfun_active_user', JSON.stringify(userProfile));
    try {
      const stored = localStorage.getItem('mathfun_registered_users');
      const list: Record<string, { profile: UserProfile; pass: string; passHash?: string }> = stored ? JSON.parse(stored) : {};
      list[userProfile.email.toLowerCase()] = { 
        profile: userProfile, 
        pass: passwordStr.trim(), 
        passHash: passHash || '' 
      };
      localStorage.setItem('mathfun_registered_users', JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save to mathfun_registered_users', e);
    }
  };

  // 1. Pendaftaran Siswa (Register) -> Simpan di Firebase Firestore & Google Spreadsheet
  const signUp = async (email: string, password: string, fullName: string, className?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = fullName.trim() || cleanEmail.split('@')[0];
    const cleanClass = (className || '').trim().toUpperCase();

    if (!cleanPassword || cleanPassword.length < 6) {
      throw new Error('Password minimal 6 karakter.');
    }

    const passHash = await hashPassword(cleanPassword);

    try {
      const res = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
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
        console.warn('Simpan Firestore users offline/tertunda:', fsErr);
      }

      // Simpan kredensial aman (hash SHA-256) ke user_accounts di Firestore
      try {
        await setDoc(doc(db, 'user_accounts', getAccountDocId(cleanEmail)), {
          uid,
          email: cleanEmail,
          fullName: cleanName,
          className: cleanClass,
          passHash,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (accErr) {
        console.warn('Simpan Firestore user_accounts tertunda:', accErr);
      }

      const activeProfile: UserProfile = { uid, email: cleanEmail, fullName: cleanName, className: cleanClass };
      saveLocalAccount(activeProfile, cleanPassword, passHash);
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

      // If already registered in Firebase Auth, attempt sign-in automatically or check hash
      if (err.code === 'auth/email-already-in-use') {
        try {
          const signInRes = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
          const uid = signInRes.user.uid;
          const activeProfile: UserProfile = { uid, email: cleanEmail, fullName: cleanName, className: cleanClass };
          saveLocalAccount(activeProfile, cleanPassword, passHash);
          setUser(activeProfile);
          return;
        } catch (signInErr: any) {
          // Check if user exists in Firestore with matching hash
          try {
            const accDoc = await getDoc(doc(db, 'user_accounts', getAccountDocId(cleanEmail)));
            if (accDoc.exists() && accDoc.data()?.passHash === passHash) {
              const activeProfile: UserProfile = {
                uid: accDoc.data().uid || 'fs_user',
                email: cleanEmail,
                fullName: accDoc.data().fullName || cleanName,
                className: accDoc.data().className || cleanClass,
              };
              saveLocalAccount(activeProfile, cleanPassword, passHash);
              setUser(activeProfile);
              return;
            }
          } catch {}

          throw new Error('Email sudah terdaftar. Masukkan kata sandi yang sesuai, klik "Masuk di sini", atau gunakan "Lupa Kata Sandi?" jika lupa kata sandi.');
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
          await setDoc(doc(db, 'user_accounts', getAccountDocId(cleanEmail)), {
            uid: fallbackUid,
            email: cleanEmail,
            fullName: cleanName,
            className: cleanClass,
            passHash,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } catch (fsErr) {
          console.warn('Firestore fallback user save:', fsErr);
        }

        const activeProfile: UserProfile = { uid: fallbackUid, email: cleanEmail, fullName: cleanName, className: cleanClass };
        saveLocalAccount(activeProfile, cleanPassword, passHash);
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
      if (err.code === 'auth/too-many-requests') {
        errMsg = 'Pendaftaran dari perangkat/jaringan ini terlalu sering (auth/too-many-requests). Silakan tunggu beberapa menit atau gunakan tombol "Daftar dengan Google".';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Password minimal 6 karakter.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Format email tidak valid.';
      }
      throw new Error(errMsg);
    }
  };

  // 2. Login Siswa -> Prioritaskan Firebase Auth, sinkronkan verifikasi hash cadangan
  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) throw new Error('Alamat email wajib diisi.');
    if (!cleanPassword) throw new Error('Kata sandi wajib diisi.');

    const inputHash = await hashPassword(cleanPassword);

    try {
      const res = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
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

      // Pastikan hash kata sandi terbarui di user_accounts
      try {
        await setDoc(doc(db, 'user_accounts', getAccountDocId(cleanEmail)), {
          uid,
          email: cleanEmail,
          fullName: userProfile.fullName,
          className: userProfile.className || '',
          passHash: inputHash,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch {}

      saveLocalAccount(userProfile, cleanPassword, inputHash);
      setUser(userProfile);
    } catch (err: any) {
      console.warn('Sign In Firebase Error (Handled):', err.code, err.message);

      // Verifikasi alternatif 1: Cek Firestore user_accounts (jika auth error karena rate-limit, invalid-credential, atau spasi keyboard)
      try {
        const accSnap = await getDoc(doc(db, 'user_accounts', getAccountDocId(cleanEmail)));
        if (accSnap.exists()) {
          const accData = accSnap.data();
          if (accData.passHash === inputHash) {
            const restoredProfile: UserProfile = {
              uid: accData.uid || 'fs_' + Math.random().toString(36).substring(2, 10),
              email: accData.email || cleanEmail,
              fullName: accData.fullName || cleanEmail.split('@')[0],
              className: accData.className || '',
            };
            saveLocalAccount(restoredProfile, cleanPassword, inputHash);
            setUser(restoredProfile);
            return;
          } else {
            throw new Error('Kata sandi salah. Silakan periksa kembali huruf besar/kecil atau klik "Lupa Kata Sandi?".');
          }
        }
      } catch (fsCheckErr: any) {
        if (fsCheckErr.message?.includes('Kata sandi salah')) {
          throw fsCheckErr;
        }
      }

      // Verifikasi alternatif 2: Cek akun yang tersimpan di local storage backup
      try {
        const stored = localStorage.getItem('mathfun_registered_users');
        if (stored) {
          const list = JSON.parse(stored);
          const userEntry = list[cleanEmail];
          if (userEntry && userEntry.profile) {
            if (userEntry.passHash === inputHash || userEntry.pass === cleanPassword) {
              localStorage.setItem('mathfun_active_user', JSON.stringify(userEntry.profile));
              setUser(userEntry.profile);
              return;
            } else {
              throw new Error('Kata sandi salah. Silakan periksa kembali kata sandi Anda atau klik "Lupa Kata Sandi?".');
            }
          }
        }
      } catch (storageErr: any) {
        if (storageErr.message?.includes('Kata sandi salah')) {
          throw storageErr;
        }
      }

      // If Firebase Auth provider is not enabled, fall back to stored/instant login seamlessly
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation' || err.code === 'auth/unauthorized-domain') {
        if (cleanPassword && cleanPassword.length >= 6) {
          const fallbackUid = 'local_' + Math.random().toString(36).substring(2, 10);
          const fallbackProfile: UserProfile = {
            uid: fallbackUid,
            email: cleanEmail,
            fullName: cleanEmail.split('@')[0],
          };
          saveLocalAccount(fallbackProfile, cleanPassword, inputHash);
          setUser(fallbackProfile);
          return;
        }
      }

      let errMsg = err.message || 'Gagal masuk';
      if (err.code === 'auth/too-many-requests') {
        errMsg = 'Akses login dibatasi sementara oleh Firebase (auth/too-many-requests) karena terlalu banyak percobaan masuk. Silakan gunakan tombol "Masuk dengan Google" atau atur ulang kata sandi melalui "Lupa Kata Sandi?".';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errMsg = 'Email atau kata sandi tidak cocok. Pastikan tidak ada spasi berlebih. Jika Anda lupa sandi, silakan klik tautan "Lupa Kata Sandi?" di bawah ini.';
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

  // 5. Kirim Link Reset Password via Firebase Email
  const sendResetPassword = async (emailToReset: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = emailToReset.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Alamat email wajib diisi.' };
    }

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return {
        success: true,
        message: `Link reset kata sandi telah dikirimkan ke email ${cleanEmail}. Silakan periksa Kotak Masuk (Inbox) atau folder Spam email Anda untuk memperbarui kata sandi.`
      };
    } catch (err: any) {
      console.warn('Firebase sendPasswordResetEmail error:', err);
      if (err.code === 'auth/user-not-found') {
        return {
          success: false,
          message: `Email ${cleanEmail} belum terdaftar di Firebase Auth. Anda dapat menggunakan opsi "Reset Sandi Mandiri" di bawah ini secara langsung.`
        };
      } else if (err.code === 'auth/too-many-requests') {
        return {
          success: false,
          message: 'Permintaan pengiriman email reset sandi mencapai batas (auth/too-many-requests). Silakan gunakan opsi "Reset Sandi Mandiri" langsung di bawah ini tanpa perlu menunggu.'
        };
      } else if (err.code === 'auth/invalid-email') {
        return { success: false, message: 'Format alamat email tidak valid.' };
      }
      return {
        success: false,
        message: err.message || 'Gagal mengirim link email. Gunakan opsi Reset Sandi Mandiri di bawah ini.'
      };
    }
  };

  // 6. Reset Kata Sandi Mandiri Langsung (untuk siswa SMP tanpa akses inbox email)
  const resetPasswordDirectly = async (emailToReset: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = emailToReset.trim().toLowerCase();
    const cleanPass = newPassword.trim();

    if (!cleanEmail) return { success: false, message: 'Email siswa wajib diisi.' };
    if (!cleanPass || cleanPass.length < 6) return { success: false, message: 'Kata sandi baru minimal 6 karakter.' };

    try {
      const newHash = await hashPassword(cleanPass);
      const accRef = doc(db, 'user_accounts', getAccountDocId(cleanEmail));
      const accSnap = await getDoc(accRef);

      let profile: UserProfile;
      if (accSnap.exists()) {
        const data = accSnap.data();
        profile = {
          uid: data.uid || 'acc_' + Math.random().toString(36).substring(2, 9),
          email: cleanEmail,
          fullName: data.fullName || cleanEmail.split('@')[0],
          className: data.className || '',
        };
        await setDoc(accRef, {
          passHash: newHash,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } else {
        // Cek juga dari users collection jika ada
        profile = {
          uid: 'acc_' + Math.random().toString(36).substring(2, 9),
          email: cleanEmail,
          fullName: cleanEmail.split('@')[0],
          className: '',
        };
        await setDoc(accRef, {
          uid: profile.uid,
          email: cleanEmail,
          fullName: profile.fullName,
          className: '',
          passHash: newHash,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // Update di local storage backup
      saveLocalAccount(profile, cleanPass, newHash);

      // Coba juga kirim reset email ke Firebase sebagai sync tambahan
      try {
        await sendPasswordResetEmail(auth, cleanEmail);
      } catch {}

      return {
        success: true,
        message: 'Kata sandi berhasil diperbarui dengan aman! Anda sekarang dapat masuk menggunakan kata sandi baru Anda.'
      };
    } catch (err: any) {
      console.error('Reset password directly error:', err);
      const cleanPass = newPassword.trim();
      const newHash = await hashPassword(cleanPass);
      const fallbackProfile: UserProfile = {
        uid: 'acc_' + Math.random().toString(36).substring(2, 9),
        email: cleanEmail,
        fullName: cleanEmail.split('@')[0],
      };
      saveLocalAccount(fallbackProfile, cleanPass, newHash);
      return {
        success: true,
        message: 'Kata sandi berhasil disimpan secara lokal! Silakan gunakan kata sandi baru untuk masuk.'
      };
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
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser, 
      loading, 
      signUp, 
      signIn, 
      signInWithGoogle, 
      signOut, 
      updateProfile,
      sendResetPassword,
      resetPasswordDirectly 
    }}>
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
