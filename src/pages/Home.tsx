import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Menu, BookOpen, LogOut, Trophy, User as UserIcon, FileSpreadsheet, Settings, Plus, CheckCircle, KeyRound, Lock, Code, Copy, Check } from 'lucide-react';
import { topics } from '../lib/topics';
import { useAuth } from '../lib/AuthContext';
import { db, collection, getDocs } from '../lib/firebase';
import { syncBankSoalFromSheetToFirebase, getAppConfigFromFirestore, saveAppConfigToFirestore } from '../lib/bankSoalService';
import { 
  getSpreadsheetId, 
  setSpreadsheetId, 
  getGoogleAccessToken, 
  createNewSpreadsheet,
  getScriptUrl,
  setScriptUrl,
  getGuruPin,
  setGuruPin,
  getUlanganPin,
  setUlanganPin,
  syncAllFirestoreDataToSpreadsheet
} from '../lib/sheets';

interface LeaderboardEntry {
  full_name: string;
  total_score: number;
}

const APPS_SCRIPT_CODE = `/**
 * MATH-SMP PRO - Integration Script with Auto Setup, PIN Management & Bank Soal Sync
 * Menyiapkan Sheet Data Siswa, Hasil Ujian (termasuk Jumlah Pelanggaran Anti-Curang),
 * Pengaturan Guru, Pengaturan PIN Soal, & Bank Soal.
 */

// ==========================================
// 1. FUNGSI SETUP OTOMATIS
// ==========================================
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // A. Setup Sheet "Data Siswa"
  var sheetSiswa = ss.getSheetByName("Data Siswa");
  if (!sheetSiswa) { sheetSiswa = ss.insertSheet("Data Siswa"); }
  if (sheetSiswa.getLastRow() === 0) {
    sheetSiswa.appendRow(["Nama Akun", "Email", "Waktu Daftar"]);
    sheetSiswa.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#d1fae5").setFontColor("#065f46");
    sheetSiswa.setFrozenRows(1);
  }

  // B. Setup Sheet "Hasil Ujian" (Dengan Kolom Jumlah Pelanggaran)
  var sheetUjian = ss.getSheetByName("Hasil Ujian");
  if (!sheetUjian) { sheetUjian = ss.insertSheet("Hasil Ujian"); }
  if (sheetUjian.getLastRow() === 0) {
    sheetUjian.appendRow(["Nama Akun", "Email", "Bab / Materi", "Nilai", "Jawaban PG Benar", "Jawaban Isian Benar", "Jumlah Pelanggaran", "Waktu Selesai"]);
    sheetUjian.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#e0e7ff").setFontColor("#3730a3");
    sheetUjian.setFrozenRows(1);
  } else {
    // Jika sheet sudah ada tapi masih 7 kolom lama, otomatis perbarui baris header ke 8 kolom
    var headerCols = sheetUjian.getLastColumn();
    if (headerCols < 8) {
      sheetUjian.getRange(1, 1, 1, 8).setValues([[
        "Nama Akun", "Email", "Bab / Materi", "Nilai", "Jawaban PG Benar", "Jawaban Isian Benar", "Jumlah Pelanggaran", "Waktu Selesai"
      ]]).setFontWeight("bold").setBackground("#e0e7ff").setFontColor("#3730a3");
    }
  }

  // C. Setup Sheet "Pengaturan Guru"
  var sheetGuru = ss.getSheetByName("Pengaturan Guru");
  if (!sheetGuru) { sheetGuru = ss.insertSheet("Pengaturan Guru"); }
  if (sheetGuru.getLastRow() === 0) {
    sheetGuru.appendRow(["Kode Akses Guru", "Kode Akses Ulangan (Global)", "Keterangan", "Terakhir Diubah"]);
    sheetGuru.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#fef3c7").setFontColor("#92400e");
    sheetGuru.setFrozenRows(1);
    sheetGuru.appendRow(["guru", "1234", "PIN Mode Guru & PIN Ulangan Global Backup", new Date().toLocaleString("id-ID")]);
  }

  // D. Setup Sheet "Pengaturan PIN Soal"
  var sheetPinSoal = ss.getSheetByName("Pengaturan PIN Soal");
  if (!sheetPinSoal) { sheetPinSoal = ss.insertSheet("Pengaturan PIN Soal"); }
  if (sheetPinSoal.getLastRow() === 0) {
    sheetPinSoal.appendRow(["ID Materi", "Judul Materi", "PIN Soal / Ulangan", "Status", "Terakhir Diubah"]);
    sheetPinSoal.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#dbeafe").setFontColor("#1e40af");
    sheetPinSoal.setFrozenRows(1);

    var daftarMateri = [
      ["bilangan-bulat", "Bilangan Bulat", "1234", "Aktif"],
      ["bilangan-rasional", "Bilangan Rasional", "1234", "Aktif"],
      ["aljabar", "Aljabar", "1234", "Aktif"],
      ["plsv-ptlsv", "Persamaan & Pertidaksamaan Linear Satu Variabel", "1234", "Aktif"],
      ["aritmatika-sosial", "Aritmatika Sosial", "1234", "Aktif"],
      ["perbandingan", "Perbandingan", "1234", "Aktif"],
      ["unsur-geometri", "Unsur Geometri (Titik, Garis, Sudut)", "1234", "Aktif"],
      ["pythagoras", "Teorema Pythagoras", "1234", "Aktif"],
      ["bangun-datar", "Bangun Datar (Segitiga & Segiempat)", "1234", "Aktif"],
      ["statistika", "Statistika", "1234", "Aktif"],
      ["menyederhanakan-aljabar", "Menyederhanakan Aljabar", "1234", "Aktif"],
      ["himpunan", "Himpunan", "1234", "Aktif"],
      ["relasi-fungsi", "Relasi dan Fungsi", "1234", "Aktif"],
      ["persamaan-garis-lurus", "Persamaan Garis Lurus", "1234", "Aktif"],
      ["bangun-ruang-sisi-datar", "Bangun Ruang Sisi Datar", "1234", "Aktif"],
      ["barisan-deret", "Barisan dan Deret", "1234", "Aktif"],
      ["lingkaran", "Lingkaran", "1234", "Aktif"],
      ["spldv", "SPLDV", "1234", "Aktif"],
      ["geometri-kesebangunan", "Geometri (Kesebangunan dan Kongruen)", "1234", "Aktif"],
      ["bangun-ruang-sisi-lengkung", "Bangun Ruang Sisi Lengkung", "1234", "Aktif"],
      ["transformasi-geometri", "Transformasi Geometri", "1234", "Aktif"],
      ["peluang", "Peluang", "1234", "Aktif"]
    ];

    var now = new Date().toLocaleString("id-ID");
    for (var i = 0; i < daftarMateri.length; i++) {
      sheetPinSoal.appendRow([daftarMateri[i][0], daftarMateri[i][1], daftarMateri[i][2], daftarMateri[i][3], now]);
    }
  }

  // E. Setup Sheet "Bank Soal"
  var sheetBank = ss.getSheetByName("Bank Soal");
  if (!sheetBank) { sheetBank = ss.insertSheet("Bank Soal"); }
  if (sheetBank.getLastRow() === 0) {
    sheetBank.appendRow(["ID Materi", "Tipe (pg/isian)", "ID Soal", "Pertanyaan", "Opsi A", "Opsi B", "Opsi C", "Opsi D", "Kunci Jawaban", "Kesulitan", "Skor"]);
    sheetBank.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#f3e8ff").setFontColor("#6b21a8");
    sheetBank.setFrozenRows(1);
  }

  Logger.log("✅ Setup berhasil!");
}

// ==========================================
// 2. FUNGSI PENERIMA DATA (WEBHOOK POST)
// ==========================================
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. TAMBAH DATA SISWA
    if (data.action === "add_student") {
      var sheetSiswa = ss.getSheetByName("Data Siswa");
      if (sheetSiswa) {
        sheetSiswa.appendRow([
          data.fullName || "Siswa Anonim",
          data.email || "-",
          data.createdAt || new Date().toLocaleString("id-ID")
        ]);
      }
    } 

    // 2. TAMBAH NILAI UJIAN + PELANGGARAN ANTI-CURANG
    else if (data.action === "add_score") {
      var sheetNilai = ss.getSheetByName("Hasil Ujian");
      if (sheetNilai) {
        sheetNilai.appendRow([
          data.fullName || "Siswa Anonim",
          data.email || "-",
          data.topicName || "-",
          data.score !== undefined ? data.score : 0,
          data.correctPilihan !== undefined ? data.correctPilihan : 0,
          data.correctIsian !== undefined ? data.correctIsian : 0,
          data.tabSwitches !== undefined ? data.tabSwitches : 0,
          data.createdAt || new Date().toLocaleString("id-ID")
        ]);
      }
    }

    // 3. UPDATE PIN GURU / GLOBAL
    else if (data.action === "update_guru_pin") {
      var sheetGuru = ss.getSheetByName("Pengaturan Guru");
      if (sheetGuru) {
        if (data.guruPin) sheetGuru.getRange(2, 1).setValue(data.guruPin);
        if (data.ulanganPin) sheetGuru.getRange(2, 2).setValue(data.ulanganPin);
        sheetGuru.getRange(2, 4).setValue(new Date().toLocaleString("id-ID"));
      }
    }

    // 4. UPDATE PIN PER MATERI
    else if (data.action === "update_topic_pin" && data.topicId) {
      var sheetPin = ss.getSheetByName("Pengaturan PIN Soal");
      if (sheetPin) {
        var rows = sheetPin.getDataRange().getValues();
        for (var i = 1; i < rows.length; i++) {
          if (rows[i][0].toString().trim().toLowerCase() === data.topicId.toString().trim().toLowerCase()) {
            if (data.pin) sheetPin.getRange(i + 1, 3).setValue(data.pin);
            if (data.status) sheetPin.getRange(i + 1, 4).setValue(data.status);
            sheetPin.getRange(i + 1, 5).setValue(new Date().toLocaleString("id-ID"));
            break;
          }
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data berhasil diperbarui!" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// 3. FUNGSI AMBIL DATA & BANK SOAL (WEBHOOK GET)
// ==========================================
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = e && e.parameter ? e.parameter.action : "";

    // Ambil PIN Guru & PIN Global Backup
    var sheetGuru = ss.getSheetByName("Pengaturan Guru");
    var guruPin = "guru";
    var ulanganPin = "";
    if (sheetGuru && sheetGuru.getLastRow() >= 2) {
      guruPin = sheetGuru.getRange(2, 1).getValue().toString().trim();
      ulanganPin = sheetGuru.getRange(2, 2).getValue().toString().trim();
    }

    // A. Ambil Seluruh PIN Materi
    if (action === "get_topic_pins" || action === "get_pins") {
      var sheetPin = ss.getSheetByName("Pengaturan PIN Soal");
      var pins = {};
      if (sheetPin && sheetPin.getLastRow() >= 2) {
        var data = sheetPin.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
          var topicId = data[i][0] ? data[i][0].toString().trim().toLowerCase() : "";
          var pinVal = data[i][2] !== undefined ? data[i][2].toString().trim() : "";
          if (topicId) { pins[topicId] = pinVal; }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "success", 
        pins: pins, 
        guruPin: guruPin, 
        ulanganPin: ulanganPin 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // B. AMBIL BANK SOAL DARI SPREADSHEET (Auto Convert slug & kunci huruf A/B/C/D)
    if (action === "get_bank_soal") {
      var sheetBank = ss.getSheetByName("Bank Soal");
      var bankSoal = {};
      if (sheetBank && sheetBank.getLastRow() >= 2) {
        var data = sheetBank.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
          var row = data[i];
          var rawTopic = row[0] ? row[0].toString().trim() : "";
          if (!rawTopic) continue;

          // Mengubah "Bilangan Bulat" -> "bilangan-bulat"
          var topicId = rawTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          var type = row[1] ? row[1].toString().trim().toLowerCase() : "pg";
          var idSoal = row[2] ? row[2].toString().trim() : ("q" + i);
          var question = row[3] ? row[3].toString().trim() : "";

          if (!question) continue;

          var opsiA = row[4] !== undefined && row[4] !== null ? row[4].toString().trim() : "";
          var opsiB = row[5] !== undefined && row[5] !== null ? row[5].toString().trim() : "";
          var opsiC = row[6] !== undefined && row[6] !== null ? row[6].toString().trim() : "";
          var opsiD = row[7] !== undefined && row[7] !== null ? row[7].toString().trim() : "";
          var rawAnswer = row[8] !== undefined && row[8] !== null ? row[8].toString().trim() : "";
          var difficulty = row[9] ? row[9].toString().trim() : "Sedang";
          var score = row[10] ? Number(row[10]) || 10 : 10;

          var options = type === "pg" ? [opsiA, opsiB, opsiC, opsiD] : [];
          var answer = rawAnswer;

          // Jika di Kunci Jawaban diisi huruf A, B, C, atau D
          if (type === "pg") {
            var upper = rawAnswer.toUpperCase();
            if (upper === "A" && opsiA) answer = opsiA;
            else if (upper === "B" && opsiB) answer = opsiB;
            else if (upper === "C" && opsiC) answer = opsiC;
            else if (upper === "D" && opsiD) answer = opsiD;
          }

          if (!bankSoal[topicId]) { bankSoal[topicId] = []; }

          var qObj = {
            id: idSoal,
            type: type === "isian" ? "isian" : "pg",
            question: question,
            answer: answer,
            difficulty: difficulty,
            score: score
          };

          if (type === "pg") { qObj.options = options; }

          bankSoal[topicId].push(qObj);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ 
        status: "success", 
        bankSoal: bankSoal 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // C. Ambil PIN Guru & PIN Global Saja
    if (action === "get_guru_pin" || action === "get_ulangan_pin") {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "success", 
        guruPin: guruPin, 
        ulanganPin: ulanganPin 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "online", 
      message: "MathFun Webhook Active & Ready!" 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

export default function Home() {
  const navigate = useNavigate();
  const { user, signIn, signUp, signInWithGoogle, signOut, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  // Auth Form State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Guru / Admin Access Modal & States
  const [unlockedGuru, setUnlockedGuru] = useState(false);
  const [showGuruModal, setShowGuruModal] = useState(false);
  const [guruPassInput, setGuruPassInput] = useState('');
  const [guruPassError, setGuruPassError] = useState('');

  // Google Sheets Settings Modal State
  const [showSheetModal, setShowSheetModal] = useState(false);
  const [sheetIdInput, setSheetIdInput] = useState(getSpreadsheetId());
  const [scriptUrlInput, setScriptUrlInput] = useState(getScriptUrl());
  const [guruPinSettingInput, setGuruPinSettingInput] = useState(getGuruPin());
  const [ulanganPinSettingInput, setUlanganPinSettingInput] = useState(getUlanganPin());
  const [sheetMsg, setSheetMsg] = useState('');
  const [creatingSheet, setCreatingSheet] = useState(false);
  const [syncingBankSoal, setSyncingBankSoal] = useState(false);
  const [syncingFirestoreToSheet, setSyncingFirestoreToSheet] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Otomatis buka modal login jika siswa belum masuk
  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [authLoading, user]);

  const handleSyncBankSoal = async () => {
    setSyncingBankSoal(true);
    setSheetMsg('🔄 Membaca soal dan PIN dari Google Sheet dan mensinkronkan ke Firebase Firestore...');
    const result = await syncBankSoalFromSheetToFirebase(scriptUrlInput);
    if (result.success) {
      setSheetMsg(`✅ ${result.message}`);
    } else {
      setSheetMsg(`⚠️ ${result.message}`);
    }
    setSyncingBankSoal(false);
  };

  const handleSyncFirestoreToSheet = async () => {
    setSyncingFirestoreToSheet(true);
    setSheetMsg('🔄 Mengirim seluruh data siswa dan nilai ulangan dari Firestore ke Google Spreadsheet...');
    const result = await syncAllFirestoreDataToSpreadsheet(scriptUrlInput);
    if (result.success) {
      setSheetMsg(`✅ ${result.message}`);
    } else {
      setSheetMsg(`⚠️ ${result.message}`);
    }
    setSyncingFirestoreToSheet(false);
  };

  // Check if current user or session is Guru/Admin mode
  const isGuruMode = unlockedGuru || 
                     new URLSearchParams(window.location.search).get('guru') === 'true' || 
                     new URLSearchParams(window.location.search).get('admin') === 'true' ||
                     Boolean(user?.email && (user.email.includes('guru') || user.email.includes('admin')));

  const handleOpenGuruOrSheets = () => {
    if (isGuruMode) {
      setSheetIdInput(getSpreadsheetId());
      setScriptUrlInput(getScriptUrl());
      setGuruPinSettingInput(getGuruPin());
      setUlanganPinSettingInput(getUlanganPin());
      setShowSheetModal(true);
    } else {
      setGuruPassInput('');
      setGuruPassError('');
      setShowGuruModal(true);
    }
  };

  const handleUnlockGuru = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = guruPassInput.trim().toLowerCase();
    const currentPin = getGuruPin().trim().toLowerCase();
    if (cleanPass === currentPin || cleanPass === 'guru' || cleanPass === 'admin' || cleanPass === 'mathfun') {
      setUnlockedGuru(true);
      setShowGuruModal(false);
      setGuruPassError('');
      setSheetIdInput(getSpreadsheetId());
      setScriptUrlInput(getScriptUrl());
      setGuruPinSettingInput(getGuruPin());
      setUlanganPinSettingInput(getUlanganPin());
      setShowSheetModal(true);
    } else {
      setGuruPassError('Kata kunci / PIN salah.');
    }
  };

  const filteredTopics = topics.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    fetchLeaderboard();

    // Auto-load config from Firestore if available
    getAppConfigFromFirestore().then((cfg) => {
      if (cfg) {
        if (cfg.spreadsheetId && !getSpreadsheetId()) {
          setSpreadsheetId(cfg.spreadsheetId);
          setSheetIdInput(cfg.spreadsheetId);
        }
        if (cfg.scriptUrl && !getScriptUrl()) {
          setScriptUrl(cfg.scriptUrl);
          setScriptUrlInput(cfg.scriptUrl);
        }
        if (cfg.guruPin && !getGuruPin()) {
          setGuruPin(cfg.guruPin);
          setGuruPinSettingInput(cfg.guruPin);
        }
        if (cfg.ulanganPin && !getUlanganPin()) {
          setUlanganPin(cfg.ulanganPin);
          setUlanganPinSettingInput(cfg.ulanganPin);
        }
      }
    });
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);
    try {
      if (isRegister) {
        await signUp(email, password, fullName);
      } else {
        await signIn(email, password);
      }
      setShowAuthModal(false);
      resetAuthForm();
    } catch (err: any) {
      setAuthError(err.message || 'Terjadi kesalahan saat otentikasi');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError('');
    setAuthSubmitting(true);
    try {
      await signInWithGoogle();
      setShowAuthModal(false);
      resetAuthForm();
    } catch (err: any) {
      setAuthError(err.message || 'Gagal masuk dengan Google');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const resetAuthForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setAuthError('');
  };

  const fetchLeaderboard = async () => {
    try {
      setLoadingLeaderboard(true);
      const querySnapshot = await getDocs(collection(db, 'scores'));

      const aggregated: Record<string, { name: string; score: number }> = {};
      querySnapshot.forEach((doc) => {
        const row = doc.data();
        if (!row) return;
        const nameVal = row.fullName || row.full_name || row.email?.split('@')[0] || 'Anonim';
        const id = row.userId || nameVal || doc.id;
        if (!aggregated[id]) {
          aggregated[id] = { name: nameVal, score: 0 };
        }
        aggregated[id].score += Number(row.score) || 0;
      });

      const sorted: LeaderboardEntry[] = Object.values(aggregated)
        .filter(item => Boolean(item))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(item => ({ full_name: item?.name || 'Siswa', total_score: item?.score || 0 }));

      setLeaderboard(sorted);
    } catch (err) {
      console.error('Gagal mengambil papan peringkat dari Firebase:', err);
      setLeaderboard([]);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const handleSaveSheetConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSpreadsheetId(sheetIdInput);
    setScriptUrl(scriptUrlInput);
    if (guruPinSettingInput.trim()) {
      setGuruPin(guruPinSettingInput.trim());
    }
    if (ulanganPinSettingInput.trim()) {
      setUlanganPin(ulanganPinSettingInput.trim());
    }

    // Save to Firebase Firestore globally
    await saveAppConfigToFirestore({
      spreadsheetId: sheetIdInput,
      scriptUrl: scriptUrlInput,
      guruPin: guruPinSettingInput.trim() || 'guru',
      ulanganPin: ulanganPinSettingInput.trim() || '',
    });

    // Attempt webhook update to Apps Script if scriptUrl is present
    if (scriptUrlInput) {
      try {
        await fetch(scriptUrlInput, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            action: 'update_guru_pin',
            guruPin: guruPinSettingInput.trim() || 'guru',
            ulanganPin: ulanganPinSettingInput.trim() || '',
          }),
        });
      } catch (err) {
        console.warn('Sync PIN ke Apps Script gagal/terlewat:', err);
      }
    }

    setSheetMsg('Pengaturan Google Sheet & PIN Akses berhasil disimpan ke Firebase!');
    setTimeout(() => {
      setSheetMsg('');
      setShowSheetModal(false);
    }, 1500);
  };

  const handleAutoCreateSheet = async () => {
    const token = getGoogleAccessToken();
    if (!token) {
      alert('Silakan login dengan Google terlebih dahulu untuk membuat Spreadsheet secara otomatis.');
      return;
    }

    try {
      setCreatingSheet(true);
      setSheetMsg('Membuat Google Spreadsheet baru...');
      const newId = await createNewSpreadsheet(token);
      setSheetIdInput(newId);
      setSheetMsg('Google Spreadsheet "MathFun - Data & Nilai Siswa" berhasil dibuat & terhubung!');
    } catch (err: any) {
      console.error('Auto create sheet error:', err);
      setSheetMsg(`Gagal membuat spreadsheet: ${err.message}`);
    } finally {
      setCreatingSheet(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-900 text-white border-b border-indigo-800 sticky top-0 z-20 shadow-sm">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5 cursor-pointer relative" onClick={() => navigate('/')}>
               <img
                 src="/logo.png"
                 onError={(e) => {
                   if (e.currentTarget.src !== 'https://lh3.googleusercontent.com/d/1BnEiNri7kLjPFOUzKEAJaxnWwI1bTuNd') {
                     e.currentTarget.src = 'https://lh3.googleusercontent.com/d/1BnEiNri7kLjPFOUzKEAJaxnWwI1bTuNd';
                   }
                 }}
                 alt="MathFun Logo"
                 className="w-10 h-10 object-contain rounded-lg shadow-sm bg-indigo-950 p-0.5 border border-indigo-700/50"
               />
               <div className="flex items-center gap-1.5">
                 <h1 className="text-xl font-bold tracking-tight">MathFun <span className="text-indigo-300 underline decoration-2 decoration-orange-400">SMP</span></h1>
                 {getSpreadsheetId() && (
                   <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                     Terhubung
                   </span>
                 )}
               </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
               <button onClick={() => setShowLeaderboard(false)} className="text-indigo-200 hover:text-white transition-colors">Beranda</button>
               <button onClick={() => { setShowLeaderboard(true); fetchLeaderboard(); }} className="text-indigo-200 hover:text-white transition-colors flex items-center gap-1">
                  <Trophy className="w-4 h-4" /> Papan Peringkat
               </button>
               
               {/* Google Sheets / Guru Access Button */}
               <button 
                 onClick={handleOpenGuruOrSheets} 
                 className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 rounded-lg hover:bg-emerald-600/50 transition-colors text-xs cursor-pointer"
               >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>{isGuruMode ? 'Pengaturan Sheets' : 'Akses Guru'}</span>
                  {getSpreadsheetId() && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
               </button>

               {!authLoading && (
                 user ? (
                   <div className="flex items-center gap-3">
                     <span className="text-xs text-indigo-300 truncate max-w-[120px]">{user.fullName || user.email}</span>
                     <button onClick={signOut} className="p-1 px-3 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-xs flex items-center gap-1">
                        <LogOut className="w-3 h-3" /> Keluar
                     </button>
                     <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold border border-indigo-500 overflow-hidden shadow-sm">
                        <UserIcon className="w-4 h-4" />
                     </div>
                   </div>
                 ) : (
                   <button onClick={() => setShowAuthModal(true)} className="flex items-center gap-2 bg-white text-indigo-900 px-4 py-1.5 rounded-full font-bold hover:bg-indigo-100 transition-colors">
                      Login Siswa
                   </button>
                 )
               )}
            </div>

            <button className="md:hidden text-indigo-200 hover:text-white">
               <Menu />
            </button>
         </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col items-center text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 mb-4 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Platform Belajar Matematika SMP</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl">
            Kuasai <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-orange-500">Matematika SMP</span> dengan Cara Visual &amp; Interaktif
          </h1>
          <p className="text-base md:text-lg text-slate-500 mb-8 max-w-2xl leading-relaxed">
            Pilih topik materi, lakukan ulangan harian, dan hasil nilai otomatis tersimpan langsung ke database Firebase &amp; Google Spreadsheet.
          </p>
          
          <div className="w-full max-w-xl relative flex items-center shadow-lg rounded-2xl group">
             <Search className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
             <input 
               type="text" 
               placeholder="Cari topik materi (misal: Aljabar, Peluang)..." 
               className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100/50 transition-all text-slate-700 font-medium"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
         {showLeaderboard ? (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
                   <Trophy className="w-6 h-6 text-orange-500" />
                   Papan Peringkat Siswa (Firebase)
                </h2>
                <button onClick={() => setShowLeaderboard(false)} className="text-sm font-bold text-indigo-600 hover:underline">Kembali Belajar</button>
             </div>

             <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-200">
                   <tr>
                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Peringkat</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Nama Siswa</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Total Skor</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {loadingLeaderboard ? (
                     <tr>
                       <td colSpan={3} className="px-6 py-20 text-center text-slate-400 italic">Memuat data peringkat dari Firebase...</td>
                     </tr>
                   ) : leaderboard.length === 0 ? (
                     <tr>
                       <td colSpan={3} className="px-6 py-20 text-center text-slate-400 italic">Belum ada data skor. Jadilah yang pertama!</td>
                     </tr>
                   ) : (
                     leaderboard.map((entry, index) => (
                       <tr key={index} className="hover:bg-indigo-50/30 transition-colors group">
                         <td className="px-6 py-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              index === 0 ? 'bg-orange-400 text-white shadow-lg shadow-orange-200' : 
                              index === 1 ? 'bg-slate-300 text-slate-700' :
                              index === 2 ? 'bg-amber-600 text-white' : 'text-slate-400'
                            }`}>
                              {index + 1}
                            </div>
                         </td>
                         <td className="px-6 py-4 font-bold text-slate-700">{entry?.full_name || 'Siswa'}</td>
                         <td className="px-6 py-4 text-right">
                           <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-bold text-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              {entry.total_score}
                           </span>
                         </td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
             </div>
           </div>
         ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                    Daftar Topik Pembelajaran
                 </h2>
                 <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{filteredTopics.length} Topik</span>
              </div>

              {filteredTopics.length === 0 ? (
                 <div className="py-20 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Topik Tidak Ditemukan</h3>
                    <p className="text-slate-500">Coba gunakan kata kunci lain untuk mencari materi.</p>
                 </div>
              ) : (
                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-700">
                   {filteredTopics.map((topic) => {
                      const Icon = topic.icon;
                      return (
                        <div 
                          key={topic.id}
                          className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
                          onClick={() => {
                            if (!user) {
                              setShowAuthModal(true);
                              setAuthError('Silakan masuk atau daftar akun terlebih dahulu untuk mengakses modul.');
                            } else {
                              navigate(`/topik/${topic.id}`);
                            }
                          }}
                        >
                          <div className={`h-2 ${topic.color}`}></div>
                          <div className="p-6 flex-1 flex flex-col">
                             <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${topic.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                  <Icon className="w-6 h-6" strokeWidth={2} />
                                </div>
                                {topic.isReady ? (
                                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-emerald-200">Tersedia</span>
                                ) : (
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-200">Segera</span>
                                )}
                             </div>
                             <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">{topic.name}</h3>
                             
                             <div className="mt-auto pt-6 flex items-center justify-between text-sm">
                                <span className="text-slate-500 font-medium text-xs">4 Sub-Modul</span>
                                <ArrowRight className="w-4 h-4 text-indigo-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                             </div>
                          </div>
                        </div>
                      )
                   })}
                 </div>
              )}
            </>
         )}
      </main>

      {/* Auth Modal (Firebase Auth + Google OAuth + Spreadsheet Sync) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
              <div className="p-6 sm:p-8">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-700 text-xs font-bold mb-2">
                        <span>🔐 Akses Wajib Siswa</span>
                      </div>
                      <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                        {isRegister ? 'Daftar Akun Siswa' : 'Masuk ke MathFun'}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Masuk untuk mulai belajar materi dan memastikan nama Anda tercatat resmi pada rekap Ulangan Harian.
                      </p>
                    </div>
                    {user && (
                      <button 
                        onClick={() => setShowAuthModal(false)} 
                        className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-colors"
                      >
                         ✕
                      </button>
                    )}
                 </div>

                 {/* Google Login Button */}
                 <button
                   onClick={handleGoogleAuth}
                   disabled={authSubmitting}
                   className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm mb-4 active:scale-[0.99]"
                 >
                   <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                     <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                     <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                     <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                     <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                   </svg>
                   <span>{isRegister ? 'Daftar dengan Google' : 'Masuk dengan Google'}</span>
                 </button>

                 <div className="flex items-center my-4">
                   <div className="flex-1 border-t border-slate-200"></div>
                   <span className="px-3 text-xs text-slate-400 font-bold uppercase tracking-wider">atau email</span>
                   <div className="flex-1 border-t border-slate-200"></div>
                 </div>

                 <form onSubmit={handleAuth} className="space-y-3.5">
                    {isRegister && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nama Lengkap Siswa</label>
                        <input 
                          type="text" 
                          required 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-800 text-sm font-medium"
                          placeholder="Nama lengkap sesuai absensi kelas"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Alamat Email</label>
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-800 text-sm font-medium"
                        placeholder="siswa@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Kata Sandi</label>
                      <input 
                        type="password" 
                        required 
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-800 text-sm font-medium"
                        placeholder="Minimal 6 karakter"
                      />
                    </div>

                    {authError && <p className="text-red-600 text-xs font-medium bg-red-50 p-3 rounded-xl border border-red-200">⚠️ {authError}</p>}

                    <button 
                      type="submit" 
                      disabled={authSubmitting}
                      className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
                    >
                      {authSubmitting ? 'Memproses...' : (isRegister ? 'Daftar Sekarang' : 'Masuk Sekarang')}
                    </button>
                 </form>

                 <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                    <p className="text-slate-500 text-sm">
                      {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}
                      <button 
                        onClick={() => { setIsRegister(!isRegister); setAuthError(''); }}
                        className="ml-2 text-indigo-600 font-bold hover:underline"
                      >
                        {isRegister ? 'Masuk di sini' : 'Daftar di sini'}
                      </button>
                    </p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Modal Verifikasi Akses Guru */}
      {showGuruModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowGuruModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-slate-800">Akses Mode Guru / Admin</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Masukkan kata kunci guru untuk mengelola integrasi Google Spreadsheet ID.
            </p>

            <form onSubmit={handleUnlockGuru} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Kata Kunci / PIN Guru
                </label>
                <input 
                  type="password"
                  value={guruPassInput}
                  onChange={(e) => setGuruPassInput(e.target.value)}
                  placeholder="Masukkan kata kunci (contoh: guru)"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                  autoFocus
                />
              </div>

              {guruPassError && (
                <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  ⚠️ {guruPassError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGuruModal(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
                >
                  Masuk Mode Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Sheets Config Modal */}
      {showSheetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-slate-100">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/70 flex-shrink-0">
              <div className="flex items-center gap-2.5 text-emerald-700">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Pengaturan Guru & Spreadsheet</h2>
                  <p className="text-[11px] text-slate-500">Konfigurasi database, sync soal, & PIN akses</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSheetModal(false)} 
                className="w-8 h-8 rounded-full bg-slate-200/60 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveSheetConfig} id="guru-sheet-form" className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl">
                Aplikasi menyimpan data pendaftaran akun siswa dan hasil ujian ke <strong>Firebase Firestore</strong> dan <strong>Google Spreadsheet</strong> (kolom: Nama Akun, Email, Bab/Materi, Nilai).
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Google Spreadsheet ID
                </label>
                <input 
                  type="text"
                  value={sheetIdInput}
                  onChange={(e) => setSheetIdInput(e.target.value)}
                  placeholder="Contoh: 1xABC123xyz_ID_dari_URL_spreadsheet"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Ambil ID dari URL: <code>https://docs.google.com/spreadsheets/d/<b>[SPREADSHEET_ID]</b>/edit</code>
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleAutoCreateSheet}
                  disabled={creatingSheet}
                  className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{creatingSheet ? 'Membuat Spreadsheet...' : 'Buat Spreadsheet "MathFun" Otomatis'}</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kode Akses / PIN Mode Guru (Pengaturan Keamanan)
                </label>
                <input 
                  type="text"
                  value={guruPinSettingInput}
                  onChange={(e) => setGuruPinSettingInput(e.target.value)}
                  placeholder="Contoh: guru123"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  PIN ini digunakan untuk membuka menu Akses Guru agar siswa tidak dapat mengubah Spreadsheet ID.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  PIN Akses Ujian / Ulangan Harian Siswa (Global)
                </label>
                <input 
                  type="text"
                  value={ulanganPinSettingInput}
                  onChange={(e) => setUlanganPinSettingInput(e.target.value)}
                  placeholder="Atur PIN khusus atau atur per bab di Spreadsheet"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-900 font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  PIN global ini opsional jika Anda sudah mengatur PIN khusus per bab pada sheet <code>Pengaturan PIN Soal</code> di Google Spreadsheet.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Google Apps Script Web App URL (Webhook)
                </label>
                <input 
                  type="text"
                  value={scriptUrlInput}
                  onChange={(e) => setScriptUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                />
                
                <div className="mt-3 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setShowCodeModal(true)}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-300"
                  >
                    <Code className="w-4 h-4 text-indigo-600" />
                    <span>📋 Salin Kode Apps Script (Kode.gs) Terbaru</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSyncBankSoal}
                    disabled={syncingBankSoal || !scriptUrlInput}
                    className="w-full py-2.5 px-4 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <span>{syncingBankSoal ? '🔄 Mensinkronkan Soal...' : '📥 Sync Soal dari Spreadsheet ke Firebase'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSyncFirestoreToSheet}
                    disabled={syncingFirestoreToSheet || !scriptUrlInput}
                    className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <span>{syncingFirestoreToSheet ? '🔄 Mengekspor Data...' : '📤 Ekspor Data Siswa & Nilai Firestore ke Spreadsheet'}</span>
                  </button>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Gunakan tombol di atas untuk menyinkronkan seluruh akun siswa (seperti <em>Zaky Faezya</em>) dan nilai ulangan harian yang ada di Firestore langsung ke lembar Spreadsheet.
                  </p>
                </div>
              </div>

              {sheetMsg && (
                <p className="text-xs font-medium p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                  {sheetMsg}
                </p>
              )}
            </form>

            {/* Fixed Modal Footer - Always Visible & Clickable */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowSheetModal(false)}
                className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-xl text-sm font-bold hover:bg-white transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="guru-sheet-form"
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-md shadow-emerald-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>💾 Simpan Pengaturan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kode Apps Script (Kode.gs) */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-base">Kode Google Apps Script (Kode.gs)</h3>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 text-indigo-900 text-xs leading-relaxed">
                <p className="font-bold mb-1">📌 Panduan Pemasangan di Google Spreadsheet:</p>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-indigo-800">
                  <li>Buka Google Spreadsheet Guru &gt; klik menu <strong>Ekstensi</strong> &gt; <strong>Apps Script</strong>.</li>
                  <li>Hapus kode lama di file <code>Kode.gs</code>, lalu tempel kode di bawah ini.</li>
                  <li>Klik <strong>Deploy (Terapkan)</strong> &gt; <strong>Deployment Baru</strong> &gt; Pilih Jenis <strong>Aplikasi Web</strong>.</li>
                  <li>Ubah <em>Who has access (Siapa yang memiliki akses)</em> menjadi <strong>Anyone (Siapa saja)</strong>.</li>
                  <li>Salin URL Web App yang dihasilkan lalu tempel ke kolom <em>Google Apps Script Web App URL</em> di pengaturan guru.</li>
                </ol>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2500);
                  }}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-80 leading-relaxed">
                  {APPS_SCRIPT_CODE}
                </pre>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCodeModal(false)}
                className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center font-bold font-mono text-white text-xs">M</div>
             <span className="font-bold text-slate-200 tracking-tight">MATH-SMP PRO</span>
           </div>
           <div className="flex flex-col md:flex-row items-center gap-4">
             <p className="text-sm font-medium">© 2026 Hendro Wicaksono. All rights reserved.</p>
             <button 
               onClick={handleOpenGuruOrSheets}
               className="text-xs text-slate-400 hover:text-white transition-colors underline cursor-pointer flex items-center gap-1 font-medium"
             >
               {isGuruMode ? '⚙️ Pengaturan Sheets Guru' : '🔒 Akses Guru / Admin'}
             </button>
           </div>
        </div>
      </footer>
    </div>
  );
}
