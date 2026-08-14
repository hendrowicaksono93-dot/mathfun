import React, { useState } from 'react';
import { NavLink, Outlet, useParams, Link, useLocation } from 'react-router-dom';
import { BookOpen, Gamepad2, PenTool, GraduationCap, ArrowLeft, User as UserIcon, X, Home, ChevronRight } from 'lucide-react';
import { topics } from '../lib/topics';
import { useAuth } from '../lib/AuthContext';

const LOGO_SRC = "/logo.png";
const LOGO_FALLBACK = "https://lh3.googleusercontent.com/d/1BnEiNri7kLjPFOUzKEAJaxnWwI1bTuNd";

export default function TopicLayout() {
  const { topicId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentTopic = topics.find(t => t.id === topicId) || { name: 'Topik Tidak Ditemukan' };

  const menuItems = [
    { name: 'Materi', path: 'materi', icon: BookOpen, desc: 'Rangkuman konsep & rumus' },
    { name: 'Simulasi', path: 'simulasi', icon: Gamepad2, desc: 'Eksplorasi visual interaktif' },
    { name: 'Latihan', path: 'latihan', icon: PenTool, desc: 'Asah pemahaman mandiri' },
    { name: 'Ulangan Harian', path: 'ulangan', icon: GraduationCap, desc: 'Evaluasi & rekap nilai' },
  ];

  // Determine current active page name for mobile header
  const currentPathSegment = location.pathname.split('/').pop() || 'materi';
  const activeMenuItem = menuItems.find(item => item.path === currentPathSegment) || menuItems[0];

  return (
    <div className="bg-slate-50 h-screen w-full flex flex-col md:flex-row overflow-hidden font-sans text-slate-800">
      
      {/* ======================================================== */}
      {/* MOBILE TOP NAVIGATION BAR (Hanya Tampil di Layar HP)    */}
      {/* ======================================================== */}
      <header className="md:hidden bg-indigo-900 text-white px-3.5 py-2.5 flex items-center justify-between border-b border-indigo-800 flex-shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Tombol Logo Interaktif untuk Membuka Sidebar di HP */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Buka Menu Modul"
            className="relative group p-1 bg-indigo-950/80 hover:bg-indigo-800 border-2 border-orange-400/80 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center flex-shrink-0"
          >
            <img
              src={LOGO_SRC}
              onError={(e) => {
                if (e.currentTarget.src !== LOGO_FALLBACK) {
                  e.currentTarget.src = LOGO_FALLBACK;
                }
              }}
              alt="Logo MathFun - Ketuk untuk buka menu"
              className="w-8 h-8 object-contain rounded-lg"
            />
            {/* Indikator Badge Menu */}
            <span className="absolute -bottom-1 -right-1 bg-orange-500 text-[9px] font-black px-1 rounded-full text-white shadow-sm border border-indigo-900">
              MENU
            </span>
          </button>

          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-1 text-[11px] text-indigo-300 font-medium truncate">
              <span className="truncate max-w-[120px]">{currentTopic.name}</span>
              <ChevronRight className="w-3 h-3 text-indigo-400 flex-shrink-0" />
              <span className="text-orange-300 font-semibold">{activeMenuItem.name}</span>
            </div>
            <p className="text-[10px] text-indigo-200/80">Ketuk logo untuk menu</p>
          </div>
        </div>

        {/* Tombol Cepat Kembali ke Beranda */}
        <Link
          to="/"
          className="p-2 text-indigo-200 hover:text-white bg-indigo-800/60 hover:bg-indigo-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Kembali ke Beranda"
        >
          <Home className="w-4 h-4" />
          <span className="hidden xs:inline">Beranda</span>
        </Link>
      </header>

      {/* ======================================================== */}
      {/* MOBILE DRAWER / SIDEBAR POPUP (Slide dari Kiri di HP)     */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Gelap (Klik di luar untuk menutup) */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Konten Sidebar HP */}
          <div className="relative w-80 max-w-[85vw] bg-indigo-900 text-white h-full flex flex-col shadow-2xl z-10 border-r border-indigo-700 animate-in slide-in-from-left duration-200">
            {/* Header Drawer */}
            <div className="p-5 border-b border-indigo-800 bg-indigo-950/70 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={LOGO_SRC}
                  onError={(e) => {
                    if (e.currentTarget.src !== LOGO_FALLBACK) {
                      e.currentTarget.src = LOGO_FALLBACK;
                    }
                  }}
                  alt="MathFun Logo"
                  className="w-9 h-9 object-contain rounded-xl bg-indigo-900 p-0.5 border border-indigo-700 shadow-md"
                />
                <div className="min-w-0">
                  <h2 className="text-base font-bold tracking-tight text-white">MathFun SMP</h2>
                  <p className="text-[10px] text-orange-300 uppercase tracking-wider font-semibold">
                    Menu Modul Belajar
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-indigo-300 hover:text-white bg-indigo-800/80 rounded-lg hover:bg-indigo-700 transition-colors"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Judul Topik Saat Ini */}
            <div className="px-5 py-4 bg-indigo-900/90 border-b border-indigo-800/80">
              <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Topik Aktif</span>
              <h3 className="text-base font-bold text-white leading-snug mt-0.5">{currentTopic.name}</h3>
            </div>

            {/* Menu Navigasi Modul di HP */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-700 to-indigo-800 text-white font-semibold shadow-md border border-orange-400/40'
                          : 'text-indigo-200 hover:bg-indigo-800/70 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive ? 'bg-orange-500 text-white shadow-sm' : 'bg-indigo-800 text-indigo-300'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-[11px] text-indigo-300 truncate opacity-80">{item.desc}</p>
                        </div>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Footer Drawer */}
            <div className="p-4 border-t border-indigo-800 bg-indigo-950/60 space-y-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-800/90 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors border border-indigo-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Pilih Bab / Topik Lain</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DESKTOP SIDEBAR NAVIGATION (Selalu Tampil di Layar Lebar) */}
      {/* ======================================================== */}
      <aside className="hidden md:flex w-72 bg-indigo-900 text-white flex-col flex-shrink-0 border-r border-indigo-800">
        <div className="p-6 border-b border-indigo-800">
          <Link to="/" className="inline-flex items-center space-x-2 text-indigo-200 hover:text-white transition-colors mb-4 text-sm font-medium">
            <img
              src={LOGO_SRC}
              onError={(e) => {
                if (e.currentTarget.src !== LOGO_FALLBACK) {
                  e.currentTarget.src = LOGO_FALLBACK;
                }
              }}
              alt="MathFun Logo"
              className="w-6 h-6 object-contain rounded bg-indigo-950 p-0.5"
            />
            <ArrowLeft className="w-3.5 h-3.5 ml-1" />
            <span>MathFun SMP</span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight leading-tight">{currentTopic.name}</h1>
          <p className="text-xs text-indigo-300 mt-2 uppercase tracking-widest font-semibold flex items-center gap-1">
             <span className="w-1.5 h-1.5 bg-orange-400 rounded-full inline-block"></span>
             Modul Pembelajaran
          </p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-800 font-medium'
                      : 'opacity-70 hover:opacity-100 hover:bg-indigo-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-orange-400' : 'text-indigo-300'}`} />
                    <span className="text-sm font-medium">{item.name}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400"></div>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA                                        */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header Desktop */}
        <header className="h-16 bg-white border-b border-slate-200 hidden md:flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 text-sm">Topik</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-sm line-clamp-1">{currentTopic.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Siswa</p>
              <p className="text-sm font-bold text-indigo-600 line-clamp-1 max-w-[150px]">
                {user?.fullName || (user as any)?.user_metadata?.full_name || user?.email || 'Tamu'}
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold overflow-hidden border border-indigo-200 shadow-sm">
                {(user as any)?.user_metadata?.avatar_url ? (
                  <img src={(user as any).user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto w-full h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

