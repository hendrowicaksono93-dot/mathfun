import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Menu, BookOpen, LogIn, LogOut, Trophy, User as UserIcon } from 'lucide-react';
import { topics } from '../lib/topics';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

interface LeaderboardEntry {
  full_name: string;
  total_score: number;
}

export default function Home() {
  const navigate = useNavigate();
  const { user, signIn, signUp, signOut, loading: authLoading } = useAuth();
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

  const filteredTopics = topics.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    fetchLeaderboard();
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

  const resetAuthForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setAuthError('');
  };

  const fetchLeaderboard = async () => {
    if (!supabase) return;
    try {
      setLoadingLeaderboard(true);
      // We'll aggregate manually since Supabase client doesn't support complex GROUP BY easily without RPC
      // But we can try a simple query if the table is small, or use an RPC if defined.
      // For now, let's just fetch all and aggregate in JS for simplicity in this demo environment, 
      // though RPC is better for production.
      const { data, error } = await supabase.from('scores').select('full_name, score, user_id');
      
      if (error) throw error;

      const aggregated: Record<string, { name: string; score: number }> = {};
      data?.forEach((row: any) => {
        const id = row.user_id || row.full_name;
        if (!aggregated[id]) {
          aggregated[id] = { name: row.full_name || 'Anonim', score: 0 };
        }
        aggregated[id].score += row.score;
      });

      const sorted = Object.values(aggregated)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(item => ({ full_name: item.name, total_score: item.score }));

      setLeaderboard(sorted);
    } catch (err) {
      console.error('Gagal mengambil papan peringkat:', err);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-900 text-white border-b border-indigo-800 sticky top-0 z-20 shadow-sm">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold font-mono shadow-inner border border-indigo-500">M</div>
               <h1 className="text-xl font-bold tracking-tight">MATH-SMP <span className="text-indigo-300 underline decoration-2 decoration-orange-400">PRO</span></h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
               <button onClick={() => setShowLeaderboard(false)} className="text-indigo-200 hover:text-white transition-colors">Beranda</button>
               <button onClick={() => { setShowLeaderboard(true); fetchLeaderboard(); }} className="text-indigo-200 hover:text-white transition-colors flex items-center gap-1">
                  <Trophy className="w-4 h-4" /> Papan Peringkat
               </button>
               
               {!authLoading && (
                 user ? (
                   <div className="flex items-center gap-3">
                     <span className="text-xs text-indigo-300 truncate max-w-[100px]">{user.user_metadata.full_name || user.email}</span>
                     <button onClick={signOut} className="p-1 px-3 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-xs flex items-center gap-1">
                        <LogOut className="w-3 h-3" /> Keluar
                     </button>
                     <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold border border-indigo-500 overflow-hidden shadow-sm">
                        {user.user_metadata.avatar_url ? (
                          <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-4 h-4" />
                        )}
                     </div>
                   </div>
                 ) : (
                   <button onClick={() => setShowAuthModal(true)} className="flex items-center gap-2 bg-white text-indigo-900 px-4 py-1.5 rounded-full font-bold hover:bg-indigo-100 transition-colors">
                      <LogIn className="w-4 h-4" /> Login
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 mb-4 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Platform Belajar Matematika</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl">
            Kuasai <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-orange-500">Matematika SMP</span> dengan Cara Visual & Interaktif
          </h1>
          <p className="text-base md:text-lg text-slate-500 mb-10 max-w-2xl leading-relaxed">
            Pilih topik untuk memulai petualangan belajarmu. Setiap topik dilengkapi dengan materi terstruktur, simulasi interaktif, latihan soal, dan evaluasi akhir.
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
                   Papan Peringkat Siswa
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
                       <td colSpan={3} className="px-6 py-20 text-center text-slate-400 italic">Memuat data peringkat...</td>
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
                         <td className="px-6 py-4 font-bold text-slate-700">{entry.full_name}</td>
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
                   {filteredTopics.map((topic, idx) => {
                      const Icon = topic.icon;
                      return (
                        <div 
                          key={topic.id}
                          className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
                          onClick={() => navigate(`/topik/${topic.id}`)}
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

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{isRegister ? 'Daftar Akun Siswa' : 'Masuk ke MathFun'}</h2>
                    <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                       <Search className="w-6 h-6 rotate-45" />
                    </button>
                 </div>

                 <form onSubmit={handleAuth} className="space-y-4">
                    {isRegister && (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                        <input 
                          type="text" 
                          required 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                          placeholder="Contoh: Budi Santoso"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        placeholder="siswa@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                      <input 
                        type="password" 
                        required 
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        placeholder="••••••••"
                      />
                    </div>

                    {authError && <p className="text-red-500 text-xs font-medium bg-red-50 p-3 rounded-lg border border-red-100">{authError}</p>}

                    <button 
                      type="submit" 
                      disabled={authSubmitting}
                      className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {authSubmitting ? 'Memproses...' : (isRegister ? 'Daftar Sekarang' : 'Masuk Sekarang')}
                    </button>
                 </form>

                 <div className="mt-8 pt-6 border-t border-slate-100 text-center">
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

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center font-bold font-mono text-white text-xs">M</div>
             <span className="font-bold text-slate-200 tracking-tight">MATH-SMP PRO</span>
           </div>
           <p className="text-sm font-medium">© 2026 EduMath Indonesia. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

