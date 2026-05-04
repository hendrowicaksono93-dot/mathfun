import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Menu, X, BookOpen } from 'lucide-react';
import { topics } from '../lib/topics';

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTopics = topics.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
               <button className="text-indigo-200 hover:text-white transition-colors">Beranda</button>
               <button className="text-indigo-200 hover:text-white transition-colors">Semua Topik</button>
               <button className="text-indigo-200 hover:text-white transition-colors">Papan Peringkat</button>
               <div className="w-8 h-8 bg-indigo-800 rounded-full flex items-center justify-center text-indigo-200 font-bold border border-indigo-700">AS</div>
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
      </main>

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

