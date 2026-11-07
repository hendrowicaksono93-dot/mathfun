import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Check, ChevronDown, GraduationCap, Sparkles, X, AlertCircle } from 'lucide-react';
import { useAuth, SMP_CLASSES, formatStudentNameWithClass } from '../lib/AuthContext';

interface StudentProfileMenuProps {
  className?: string;
  theme?: 'dark' | 'light';
}

export default function StudentProfileMenu({ className = '', theme = 'dark' }: StudentProfileMenuProps) {
  const { user, signOut, updateProfile } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Tombol Profil Kanan Atas */}
      <button
        type="button"
        onClick={() => setDropdownOpen(prev => !prev)}
        className={`flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-xl transition-all cursor-pointer border ${
          theme === 'dark'
            ? 'bg-indigo-950/70 hover:bg-indigo-900 border-indigo-700/60 text-white shadow-sm'
            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm'
        }`}
        aria-expanded={dropdownOpen}
      >
        <div className="flex flex-col text-right leading-tight min-w-0 max-w-[140px] hidden sm:flex">
          <span className="text-xs font-bold truncate">
            {user.fullName || 'Siswa'}
          </span>
          <span className={`text-[10px] font-semibold flex items-center justify-end gap-1 ${
            theme === 'dark' ? 'text-indigo-300' : 'text-slate-500'
          }`}>
            {user.className ? (
              <span className="px-1.5 py-0.2 bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded text-[9px] font-black uppercase">
                {user.className}
              </span>
            ) : (
              <span className="text-amber-400 italic text-[9px]">(Pilih Kelas)</span>
            )}
          </span>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-inner flex-shrink-0">
          {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
        </div>

        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''} ${
          theme === 'dark' ? 'text-indigo-300' : 'text-slate-400'
        }`} />
      </button>

      {/* Dropdown Menu (Profil & Logout) */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Info Akun */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 rounded-t-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm text-slate-900 truncate">
                {user.fullName || 'Siswa'}
              </span>
              {user.className && (
                <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-md border border-indigo-200">
                  {user.className}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 truncate" title={user.email}>
              {user.email}
            </p>
          </div>

          {/* Opsi Menu */}
          <div className="p-1 space-y-0.5">
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                setModalOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold">Profil Siswa</p>
                <p className="text-[10px] text-slate-400 font-normal">Edit nama & pilih kelas (7A - 9I)</p>
              </div>
            </button>

            <button
              type="button"
              onClick={async () => {
                setDropdownOpen(false);
                await signOut();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold">Keluar (Logout)</p>
                <p className="text-[10px] text-rose-400 font-normal">Keluar dari akun Anda</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Modal Edit Nama & Kelas */}
      {modalOpen && (
        <EditProfileModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [className, setClassName] = useState(user?.className || '');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setClassName(user.className || '');
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setStatusMessage({ type: 'error', text: 'Nama siswa tidak boleh kosong.' });
      return;
    }

    try {
      setIsSaving(true);
      setStatusMessage(null);
      await updateProfile(fullName.trim(), className.trim().toUpperCase());
      setStatusMessage({ type: 'success', text: '✅ Profil dan kelas berhasil disimpan!' });
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menyimpan profil.' });
    } finally {
      setIsSaving(false);
    }
  };

  const previewCombinedName = formatStudentNameWithClass(fullName, className);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-7 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
        
        {/* Tombol Tutup */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Modal */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Edit Profil Siswa</h3>
            <p className="text-xs text-slate-500">Perbarui nama dan pilih kelas Anda</p>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`mb-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Terdaftar (Read-only) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Email Akun
            </label>
            <input
              type="text"
              value={user.email}
              disabled
              className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-500 cursor-not-allowed outline-none"
            />
          </div>

          {/* Nama Siswa */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Lengkap Siswa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Dropdown Kelas (7A sampai 9I) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Kelas Siswa (7A - 9I) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">-- Pilih Kelas Anda --</option>
                
                {/* Kelas 7 */}
                <optgroup label="── Kelas 7 (VII) ──">
                  {SMP_CLASSES.filter(c => c.startsWith('7')).map(c => (
                    <option key={c} value={c}>Kelas {c}</option>
                  ))}
                </optgroup>

                {/* Kelas 8 */}
                <optgroup label="── Kelas 8 (VIII) ──">
                  {SMP_CLASSES.filter(c => c.startsWith('8')).map(c => (
                    <option key={c} value={c}>Kelas {c}</option>
                  ))}
                </optgroup>

                {/* Kelas 9 */}
                <optgroup label="── Kelas 9 (IX) ──">
                  {SMP_CLASSES.filter(c => c.startsWith('9')).map(c => (
                    <option key={c} value={c}>Kelas {c}</option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Pilihan kelas tersedia dari <strong>7A sampai 9I</strong>.
            </p>
          </div>

          {/* Pratinjau Penggabungan Nama & Kelas */}
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl">
            <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Format Nama di Database &amp; Spreadsheet:</span>
            </div>
            <p className="text-sm font-mono font-black text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 inline-block">
              {previewCombinedName || 'KELAS_NAMA SISWA'}
            </p>
            <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
              * Nama dan kelas digabung otomatis menjadi <code>KELAS_NAMA SISWA</code> sehingga langsung rapi di Google Spreadsheet tanpa mengubah tabel database.
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
