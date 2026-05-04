import React from 'react';
import { NavLink, Outlet, useParams, Link } from 'react-router-dom';
import { BookOpen, Gamepad2, PenTool, GraduationCap, ArrowLeft, User as UserIcon } from 'lucide-react';
import { topics } from '../lib/topics';
import { useAuth } from '../lib/AuthContext';

export default function TopicLayout() {
  const { topicId } = useParams();
  const { user } = useAuth();
  const currentTopic = topics.find(t => t.id === topicId) || { name: 'Topik Tidak Ditemukan' };

  const menuItems = [
    { name: 'Materi', path: 'materi', icon: BookOpen },
    { name: 'Simulasi', path: 'simulasi', icon: Gamepad2 },
    { name: 'Latihan', path: 'latihan', icon: PenTool },
    { name: 'Ulangan Harian', path: 'ulangan', icon: GraduationCap },
  ];

  return (
    <div className="bg-slate-50 h-screen w-full flex flex-col md:flex-row overflow-hidden font-sans text-slate-800">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-indigo-900 text-white flex flex-col flex-shrink-0 border-r border-indigo-800">
        <div className="p-6 border-b border-indigo-800">
          <Link to="/" className="inline-flex items-center space-x-2 text-indigo-300 hover:text-indigo-100 transition-colors mb-4 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span>Beranda</span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight leading-tight">{currentTopic.name}</h1>
          <p className="text-xs text-indigo-300 mt-2 uppercase tracking-widest font-semibold flex items-center gap-1">
             <span className="w-1.5 h-1.5 bg-orange-400 rounded-full inline-block"></span>
             Modul Pembelajaran
          </p>
        </div>
        <nav className="flex-1 p-4 flex flex-row overflow-x-auto md:flex-col gap-2">
          {menuItems.map((item) => {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap min-w-max md:min-w-0 ${
                    isActive
                      ? 'bg-indigo-800 font-medium'
                      : 'opacity-60 hover:bg-indigo-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-orange-400' : 'bg-slate-400'}`}></div>
                    <span className="text-sm">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        {/* Top Header */}
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
                {user?.user_metadata.full_name || user?.email || 'Tamu'}
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold overflow-hidden border border-indigo-200 shadow-sm">
                {user?.user_metadata.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto w-full h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
