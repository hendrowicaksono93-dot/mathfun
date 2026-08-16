// Utility for integrating Google Sheets API and optional Webhook Sync
import { db, doc, getDoc, collection, getDocs } from './firebase';

const SPREADSHEET_ID_KEY = 'mathfun_spreadsheet_id';
const ACCESS_TOKEN_KEY = 'mathfun_google_access_token';
const SCRIPT_URL_KEY = 'mathfun_script_url';
const GURU_PIN_KEY = 'mathfun_guru_pin';
const ULANGAN_PIN_KEY = 'mathfun_ulangan_pin';
const TOPIC_PINS_KEY = 'mathfun_topic_pins';

export const getSpreadsheetId = (): string => {
  return localStorage.getItem(SPREADSHEET_ID_KEY) || '';
};

export const setSpreadsheetId = (id: string): void => {
  localStorage.setItem(SPREADSHEET_ID_KEY, id.trim());
};

export const getGuruPin = (): string => {
  return localStorage.getItem(GURU_PIN_KEY) || 'guru';
};

export const setGuruPin = (pin: string): void => {
  if (pin && pin.trim()) {
    localStorage.setItem(GURU_PIN_KEY, pin.trim());
  }
};

export const getUlanganPin = (): string => {
  return localStorage.getItem(ULANGAN_PIN_KEY) || '';
};

export const setUlanganPin = (pin: string): void => {
  if (pin && pin.trim()) {
    localStorage.setItem(ULANGAN_PIN_KEY, pin.trim());
  } else {
    localStorage.removeItem(ULANGAN_PIN_KEY);
  }
};

export const getTopicPinsFromStorage = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(TOPIC_PINS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const setTopicPinInStorage = (topicId: string, pin: string): void => {
  const current = getTopicPinsFromStorage();
  current[topicId] = pin.trim();
  localStorage.setItem(TOPIC_PINS_KEY, JSON.stringify(current));
};

export const setAllTopicPinsInStorage = (pins: Record<string, string>): void => {
  localStorage.setItem(TOPIC_PINS_KEY, JSON.stringify(pins));
};

export const getGoogleAccessToken = (): string => {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY) || '';
};

export const setGoogleAccessToken = (token: string): void => {
  if (token) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const getScriptUrl = (): string => {
  return localStorage.getItem(SCRIPT_URL_KEY) || '';
};

export const setScriptUrl = (url: string): void => {
  localStorage.setItem(SCRIPT_URL_KEY, url.trim());
};

/**
 * Resolves Google Apps Script Web App URL from localStorage or Firestore settings
 */
export async function resolveScriptUrl(): Promise<string> {
  let url = getScriptUrl();
  if (url) return url;

  try {
    const docRef = doc(db, 'settings', 'app_config');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data?.scriptUrl) {
        setScriptUrl(data.scriptUrl);
        return data.scriptUrl;
      }
    }
  } catch (e) {
    console.warn('Gagal membaca scriptUrl dari Firestore:', e);
  }
  return '';
}

/**
 * Resolves Spreadsheet ID from localStorage or Firestore settings
 */
export async function resolveSpreadsheetId(): Promise<string> {
  let id = getSpreadsheetId();
  if (id) return id;

  try {
    const docRef = doc(db, 'settings', 'app_config');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data?.spreadsheetId) {
        setSpreadsheetId(data.spreadsheetId);
        return data.spreadsheetId;
      }
    }
  } catch (e) {
    console.warn('Gagal membaca spreadsheetId dari Firestore:', e);
  }
  return '';
}

export interface StudentRegistrationData {
  fullName: string;
  email: string;
  createdAt?: string;
}

export interface ScoreData {
  fullName: string;
  email: string;
  topicName: string;
  score: number;
  correctPilihan: number;
  correctIsian: number;
  tabSwitches?: number;
  createdAt?: string;
}

/**
 * Creates a new Google Spreadsheet titled "MathFun - Data & Nilai Siswa"
 * and sets up sheets: "Data Siswa" and "Hasil Ujian"
 */
export async function createNewSpreadsheet(accessToken: string): Promise<string> {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: 'MathFun - Data & Nilai Siswa',
      },
      sheets: [
        {
          properties: { title: 'Data Siswa' },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: [
                    { userEnteredValue: { stringValue: 'Nama Akun' } },
                    { userEnteredValue: { stringValue: 'Email' } },
                    { userEnteredValue: { stringValue: 'Waktu Daftar' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          properties: { title: 'Hasil Ujian' },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: [
                    { userEnteredValue: { stringValue: 'Nama Akun' } },
                    { userEnteredValue: { stringValue: 'Email' } },
                    { userEnteredValue: { stringValue: 'Bab / Materi' } },
                    { userEnteredValue: { stringValue: 'Nilai' } },
                    { userEnteredValue: { stringValue: 'Jawaban PG Benar' } },
                    { userEnteredValue: { stringValue: 'Jawaban Isian Benar' } },
                    { userEnteredValue: { stringValue: 'Jumlah Pelanggaran' } },
                    { userEnteredValue: { stringValue: 'Waktu Selesai' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          properties: { title: 'Pengaturan Guru' },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: [
                    { userEnteredValue: { stringValue: 'Kode Akses Guru' } },
                    { userEnteredValue: { stringValue: 'Kode Akses Ulangan (Global)' } },
                    { userEnteredValue: { stringValue: 'Keterangan' } },
                    { userEnteredValue: { stringValue: 'Terakhir Diubah' } },
                  ],
                },
                {
                  values: [
                    { userEnteredValue: { stringValue: getGuruPin() || 'guru' } },
                    { userEnteredValue: { stringValue: getUlanganPin() || '' } },
                    { userEnteredValue: { stringValue: 'PIN / Kode Akses Guru & PIN Ulangan Global' } },
                    { userEnteredValue: { stringValue: new Date().toLocaleString('id-ID') } },
                  ],
                },
              ],
            },
          ],
        },
        {
          properties: { title: 'Pengaturan PIN Soal' },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: [
                    { userEnteredValue: { stringValue: 'ID Materi' } },
                    { userEnteredValue: { stringValue: 'Judul Materi' } },
                    { userEnteredValue: { stringValue: 'PIN Soal / Ulangan' } },
                    { userEnteredValue: { stringValue: 'Status' } },
                    { userEnteredValue: { stringValue: 'Terakhir Diubah' } },
                  ],
                },
                ...[
                  ['bilangan-bulat', 'Bilangan Bulat'],
                  ['aljabar', 'Aljabar'],
                  ['plsv-ptlsv', 'Persamaan & Pertidaksamaan Linear Satu Variabel'],
                  ['aritmatika-sosial', 'Aritmatika Sosial'],
                  ['perbandingan', 'Perbandingan'],
                  ['unsur-geometri', 'Unsur Geometri (Titik, Garis, Sudut)'],
                  ['pythagoras', 'Teorema Pythagoras'],
                  ['bangun-datar', 'Bangun Datar (Segitiga & Segiempat)'],
                  ['statistika', 'Statistika'],
                  ['menyederhanakan-aljabar', 'Menyederhanakan Aljabar'],
                  ['himpunan', 'Himpunan'],
                  ['relasi-fungsi', 'Relasi dan Fungsi'],
                  ['persamaan-garis-lurus', 'Persamaan Garis Lurus'],
                  ['bangun-ruang-sisi-datar', 'Bangun Ruang Sisi Datar'],
                  ['barisan-deret', 'Barisan dan Deret'],
                  ['lingkaran', 'Lingkaran'],
                  ['spldv', 'SPLDV'],
                  ['geometri-kesebangunan', 'Geometri (Kesebangunan dan Kongruen)'],
                  ['bangun-ruang-sisi-lengkung', 'Bangun Ruang Sisi Lengkung'],
                  ['transformasi-geometri', 'Transformasi Geometri'],
                  ['peluang', 'Peluang']
                ].map(([id, name]) => ({
                  values: [
                    { userEnteredValue: { stringValue: id } },
                    { userEnteredValue: { stringValue: name } },
                    { userEnteredValue: { stringValue: '' } },
                    { userEnteredValue: { stringValue: 'Aktif' } },
                    { userEnteredValue: { stringValue: new Date().toLocaleString('id-ID') } },
                  ]
                }))
              ],
            },
          ],
        },
        {
          properties: { title: 'Bank Soal' },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: [
                    { userEnteredValue: { stringValue: 'ID Materi' } },
                    { userEnteredValue: { stringValue: 'Tipe (pg/isian)' } },
                    { userEnteredValue: { stringValue: 'ID Soal' } },
                    { userEnteredValue: { stringValue: 'Pertanyaan' } },
                    { userEnteredValue: { stringValue: 'Opsi A' } },
                    { userEnteredValue: { stringValue: 'Opsi B' } },
                    { userEnteredValue: { stringValue: 'Opsi C' } },
                    { userEnteredValue: { stringValue: 'Opsi D' } },
                    { userEnteredValue: { stringValue: 'Kunci Jawaban' } },
                    { userEnteredValue: { stringValue: 'Kesulitan' } },
                    { userEnteredValue: { stringValue: 'Skor' } },
                  ],
                },
                {
                  values: [
                    { userEnteredValue: { stringValue: 'aljabar' } },
                    { userEnteredValue: { stringValue: 'pg' } },
                    { userEnteredValue: { stringValue: 'q1' } },
                    { userEnteredValue: { stringValue: 'Bentuk sederhana dari 3a - 5b - a - 4b adalah...' } },
                    { userEnteredValue: { stringValue: '2a - 9b' } },
                    { userEnteredValue: { stringValue: '2a + 9b' } },
                    { userEnteredValue: { stringValue: '-2a - 9b' } },
                    { userEnteredValue: { stringValue: '4a - b' } },
                    { userEnteredValue: { stringValue: '2a - 9b' } },
                    { userEnteredValue: { stringValue: 'Mudah' } },
                    { userEnteredValue: { stringValue: '10' } },
                  ],
                },
                {
                  values: [
                    { userEnteredValue: { stringValue: 'aljabar' } },
                    { userEnteredValue: { stringValue: 'isian' } },
                    { userEnteredValue: { stringValue: 'q11' } },
                    { userEnteredValue: { stringValue: 'Tentukan banyak suku pada bentuk aljabar: 4x² - 3x + 2y - 5' } },
                    { userEnteredValue: { stringValue: '' } },
                    { userEnteredValue: { stringValue: '' } },
                    { userEnteredValue: { stringValue: '' } },
                    { userEnteredValue: { stringValue: '' } },
                    { userEnteredValue: { stringValue: '4' } },
                    { userEnteredValue: { stringValue: 'Mudah' } },
                    { userEnteredValue: { stringValue: '10' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal membuat Spreadsheet: ${errorText}`);
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  setSpreadsheetId(spreadsheetId);
  return spreadsheetId;
}

/**
 * Appends student registration data to Google Spreadsheet
 */
export async function appendStudentToSheet(student: StudentRegistrationData): Promise<{ success: boolean; message: string }> {
  const scriptUrl = await resolveScriptUrl();
  const spreadsheetId = await resolveSpreadsheetId();
  const token = getGoogleAccessToken();

  const formattedDate = student.createdAt || new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  // 1. Try sending via Google Apps Script Web App URL if configured
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'add_student',
          fullName: student.fullName,
          email: student.email,
          createdAt: formattedDate,
        }),
      });
      return { success: true, message: 'Data siswa dikirim ke Apps Script!' };
    } catch (e) {
      console.warn('Apps Script failed, falling back to direct API', e);
    }
  }

  // 2. Direct Google Sheets API append
  if (!spreadsheetId) {
    return { success: false, message: 'ID Spreadsheet belum diatur.' };
  }

  if (!token) {
    return { success: false, message: 'Token Google OAuth tidak ditemukan. Silakan login dengan Google.' };
  }

  try {
    const range = encodeURIComponent('Data Siswa!A:C');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [
          [student.fullName, student.email, formattedDate],
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Google Sheets API Error:', err);
      return { success: false, message: `Error Sheets API: ${res.statusText}` };
    }

    return { success: true, message: 'Data siswa berhasil dicatat di Google Sheet!' };
  } catch (error: any) {
    console.error('Failed to append to Google Sheet:', error);
    return { success: false, message: error.message || 'Gagal menyimpan ke Google Sheet' };
  }
}

/**
 * Appends test score data to Google Spreadsheet
 */
export async function appendScoreToSheet(score: ScoreData): Promise<{ success: boolean; message: string }> {
  const scriptUrl = await resolveScriptUrl();
  const spreadsheetId = await resolveSpreadsheetId();
  const token = getGoogleAccessToken();

  const formattedDate = score.createdAt || new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  // 1. Try sending via Google Apps Script Web App URL if configured
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'add_score',
          fullName: score.fullName,
          email: score.email,
          topicName: score.topicName,
          score: score.score,
          correctPilihan: score.correctPilihan,
          correctIsian: score.correctIsian,
          tabSwitches: score.tabSwitches !== undefined ? score.tabSwitches : 0,
          createdAt: formattedDate,
        }),
      });
      return { success: true, message: 'Nilai dikirim ke Apps Script!' };
    } catch (e) {
      console.warn('Apps script sync failed', e);
    }
  }

  // 2. Direct Google Sheets API append
  if (!spreadsheetId) {
    return { success: false, message: 'Spreadsheet ID belum disetting' };
  }

  if (!token) {
    return { success: false, message: 'Membutuhkan login Google untuk menulis langsung ke Sheets' };
  }

  try {
    const range = encodeURIComponent('Hasil Ujian!A:H');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [
          [
            score.fullName,
            score.email,
            score.topicName,
            score.score,
            score.correctPilihan,
            score.correctIsian,
            score.tabSwitches !== undefined ? score.tabSwitches : 0,
            formattedDate,
          ],
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Google Sheets API Error:', err);
      return { success: false, message: `Error API: ${res.statusText}` };
    }

    return { success: true, message: 'Nilai ujian berhasil dicatat di Google Sheet!' };
  } catch (error: any) {
    console.error('Gagal mencatat nilai ke Google Sheet:', error);
    return { success: false, message: error.message || 'Gagal menyimpan nilai ke Google Sheet' };
  }
}

/**
 * Synchronizes ALL existing users and test scores from Firestore to Google Spreadsheet
 */
export async function syncAllFirestoreDataToSpreadsheet(customScriptUrl?: string): Promise<{
  success: boolean;
  totalUsers: number;
  totalScores: number;
  message: string;
}> {
  const scriptUrl = customScriptUrl || await resolveScriptUrl();
  if (!scriptUrl) {
    return {
      success: false,
      totalUsers: 0,
      totalScores: 0,
      message: 'URL Google Apps Script Web App belum diisi di Pengaturan Guru.',
    };
  }

  try {
    // 1. Fetch all users from Firestore
    const usersSnap = await getDocs(collection(db, 'users'));
    let userCount = 0;
    for (const docSnap of usersSnap.docs) {
      const u = docSnap.data();
      const fullName = u.fullName || 'Siswa Anonim';
      const email = u.email || '-';
      const createdAt = u.createdAt 
        ? new Date(u.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) 
        : new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
      
      try {
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            action: 'add_student',
            fullName,
            email,
            createdAt,
          }),
        });
        userCount++;
      } catch (err) {
        console.warn('Gagal sync user:', fullName, err);
      }
    }

    // 2. Fetch all scores from Firestore
    const scoresSnap = await getDocs(collection(db, 'scores'));
    let scoreCount = 0;
    for (const docSnap of scoresSnap.docs) {
      const s = docSnap.data();
      const fullName = s.fullName || s.studentName || 'Siswa Anonim';
      const email = s.email || s.studentEmail || '-';
      const topicName = s.topicName || s.topicId || 'Ulangan Harian';
      const score = s.score !== undefined ? s.score : 0;
      const correctPilihan = s.correctPilihan || 0;
      const correctIsian = s.correctIsian || 0;
      const tabSwitches = s.tabSwitches !== undefined ? s.tabSwitches : 0;
      const createdAt = s.createdAt 
        ? new Date(s.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) 
        : new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

      try {
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            action: 'add_score',
            fullName,
            email,
            topicName,
            score,
            correctPilihan,
            correctIsian,
            tabSwitches,
            createdAt,
          }),
        });
        scoreCount++;
      } catch (err) {
        console.warn('Gagal sync score:', err);
      }
    }

    return {
      success: true,
      totalUsers: userCount,
      totalScores: scoreCount,
      message: `Berhasil mengekspor ${userCount} data siswa & ${scoreCount} hasil ujian dari Firestore ke Spreadsheet!`,
    };
  } catch (error: any) {
    return {
      success: false,
      totalUsers: 0,
      totalScores: 0,
      message: `Gagal sinkronisasi data: ${error.message || error}`,
    };
  }
}
