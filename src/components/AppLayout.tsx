import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Database, 
  Users, 
  GraduationCap, 
  Activity, 
  LogOut,
  Menu,
  X,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { 
      label: 'Dashboard', 
      path: '/app', 
      icon: LayoutDashboard, 
      roles: ['ADMIN', 'GURU', 'TENEGA_KEPENDIDIKAN', 'SISWA'] 
    },
    { 
      label: 'Manajemen Ujian', 
      path: '/app/exams', 
      icon: FileText, 
      roles: ['ADMIN', 'GURU'] 
    },
    { 
      label: 'Bank Soal', 
      path: '/app/questions', 
      icon: Database, 
      roles: ['ADMIN', 'GURU'] 
    },
    { 
      label: 'Hasil Ujian', 
      path: '/app/results', 
      icon: GraduationCap, 
      roles: ['ADMIN', 'GURU'] 
    },
    { 
      label: 'Data Siswa', 
      path: '/app/students', 
      icon: Users, 
      roles: ['ADMIN'] 
    },
    { 
      label: 'Monitoring', 
      path: '/app/monitoring', 
      icon: Activity, 
      roles: ['ADMIN', 'TENEGA_KEPENDIDIKAN'] 
    },
    { 
      label: 'Manajemen User', 
      path: '/app/users', 
      icon: UserCheck, 
      roles: ['ADMIN'] 
    }
  ];

  const filteredItems = navItems.filter(item => 
    profile && item.roles.includes(profile.role)
  );

  return (
    <div className="min-h-screen flex bg-app-bg">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-border-subtle transition-all duration-300 fixed md:relative z-40 h-screen",
          isSidebarOpen ? "w-[260px]" : "w-20"
        )}
      >
        <div className="p-6 h-16 flex items-center gap-3 border-b border-border-subtle">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-extrabold text-sm shrink-0">PU</div>
          {isSidebarOpen && <span className="font-bold text-primary text-lg tracking-tight whitespace-nowrap">SMK PRIMA UNGGUL</span>}
        </div>

        <nav className="p-4 flex-1 space-y-1">
          {filteredItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) => cn(
                "nav-item-base border border-transparent",
                isActive 
                  ? "nav-item-active" 
                  : "hover:bg-slate-50"
              )}
            >
              <item.icon size={20} className={cn(isSidebarOpen ? "mr-3" : "mx-auto")} />
              {isSidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {isSidebarOpen && (
          <div className="p-6 border-t border-border-subtle text-[11px] text-slate-400">
            Jurusan:<br />
            TKJ • DKV • AK • BC • MPLB • BD
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-border-subtle flex items-center justify-between px-8 z-30 sticky top-0">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 md:hidden"
              >
                <Menu size={20} />
              </button>
              <h2 className="text-sm font-semibold text-text-main">
                {navItems.find(i => window.location.pathname === i.path)?.label || 'Aplikasi Ujian'}
              </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-xs font-semibold text-text-main uppercase tracking-wider">
                {profile?.role === 'ADMIN' ? 'Superuser' : profile?.full_name}
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-5 py-2 bg-primary text-white rounded-lg text-[13px] font-semibold hover:bg-primary-dark transition-colors"
            >
              LOGOUT
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
};
