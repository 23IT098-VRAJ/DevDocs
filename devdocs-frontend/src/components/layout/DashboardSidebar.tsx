'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  
  const displayName = user?.email?.split('@')[0] || 'User';
  const userName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  const userInitials = userName.substring(0, 2).toUpperCase();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'dashboard', filled: true },
    { name: 'Search', path: '/search', icon: 'search' },
    { name: 'Browse', path: '/solution', icon: 'explore' },
    { name: 'New Solution', path: '/solution/create', icon: 'add_circle' },
    { name: 'Profile', path: '/profile', icon: 'person' },
  ];

  const projects = [
    { name: 'API Gateway', color: 'bg-emerald-500' },
    { name: 'Auth Service', color: 'bg-purple-500' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-[#0f1115] z-20">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800/50">
        <div className="bg-[#07b9d5]/20 p-2 rounded-lg">
          <svg className="w-6 h-6 text-[#07b9d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h1 className="text-white text-xl font-bold tracking-tight">DevDocs</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                active
                  ? 'bg-[#07b9d5]/10 border border-[#07b9d5]/20 text-[#07b9d5]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`material-symbols-outlined ${item.filled && active ? 'filled' : ''}`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}

        {/* Projects Section */}
        <div className="pt-4 mt-4 border-t border-slate-800">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Projects
          </p>
          {projects.map((project) => (
            <a
              key={project.name}
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <span className={`w-2 h-2 rounded-full ${project.color} shadow-[0_0_8px_rgba(16,185,129,0.6)]`}></span>
              <span className="text-sm">{project.name}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="relative">
            <div className="bg-gradient-to-br from-[#07b9d5] to-[#059ab3] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {userInitials}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0f1115] rounded-full"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-slate-500 truncate">Pro Member</p>
          </div>
          <button
            onClick={() => signOut()}
            className="text-slate-400 hover:text-white transition-colors"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
