'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Grid3x3, Plus, User, LogOut, Home, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function GlassmorphicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // --- Scroll-to-hide logic ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY.current) {
        // Scrolling UP → show
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Scrolling DOWN (past 80px threshold) → hide
        setVisible(false);
        setMobileMenuOpen(false); // close mobile menu when hiding
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/*
        SCROLL-TO-HIDE WRAPPER
        - translate-y moves the whole navbar off-screen when hidden
        - The inner nav has the rounded pill shape and glassmorphic styles
        - min-w-[600px] keeps it from shrinking below a usable size on zoom
      */}
      <div
        className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        {/* Padding around the pill */}
        <div className="px-4 pt-4">
          {/*
            THE STATIC NAVBAR PILL
            - min-w-[600px] prevents shrinking below a minimum on zoom
            - No transform scale — everything inside uses flex with flex-shrink-0
              on critical elements so they never collapse
          */}
          <nav
            className="mx-auto backdrop-blur-2xl border border-[#07b9d5]/20 rounded-2xl shadow-2xl shadow-[#07b9d5]/10 overflow-hidden"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              minWidth: '320px',  // Mobile-friendly minimum
              maxWidth: '1280px', // max-w-5xl equivalent
              height: '64px',     // h-16 — always 64px, never changes
            }}
          >
            <div className="flex items-center justify-between h-full px-6">

              {/* ─── LEFT: Logo (flex-shrink-0 so it never compresses) ─── */}
              <button
                onClick={() => navigateTo('/')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#07b9d5] focus:ring-offset-2 focus:ring-offset-black rounded-lg"
                aria-label="DevDocs home"
              >
                <div className="relative group">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#07b9d5] to-[#059ab3] rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-[#07b9d5]/50 group-hover:shadow-[#07b9d5]/80 transition-all duration-300 group-hover:scale-110">
                    D
                  </div>
                  <div className="absolute inset-0 bg-[#07b9d5] rounded-lg blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                </div>
                <span className="text-white font-semibold text-lg tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  DevDocs
                </span>
              </button>

              {/* ─── RIGHT: Actions (flex-shrink-0 so they never compress) ─── */}
              <div className="flex items-center gap-3 flex-shrink-0">

                {/* New Solution CTA */}
                <button
                  onClick={() => navigateTo('/solution/create')}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#07b9d5] to-[#059ab3] text-black px-5 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-[#07b9d5]/50 transition-all duration-300 hover:scale-105 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#07b9d5] focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Create new solution"
                >
                  <Plus size={18} />
                  <span>New Solution</span>
                </button>

                {/* Profile Icon - Direct Navigation */}
                <button
                  onClick={() => navigateTo('/profile')}
                  className="w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-full flex items-center justify-center hover:border-[#07b9d5]/50 hover:shadow-lg hover:shadow-[#07b9d5]/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#07b9d5] focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Go to profile"
                >
                  <User size={18} className="text-white" />
                </button>

                {/* Hamburger / Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center hover:bg-[#07b9d5]/20 hover:border-[#07b9d5]/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#07b9d5] focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Toggle navigation menu"
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />}
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* ─── HAMBURGER DROPDOWN (slides below the pill) ─── */}
        {mobileMenuOpen && (
          <div className="px-4 pt-1" role="navigation" aria-label="Mobile navigation menu">
            <div
              className="mx-auto rounded-2xl border border-[#07b9d5]/20 shadow-2xl shadow-[#07b9d5]/10 overflow-hidden p-3 pb-4"
              style={{
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(24px)',
                minWidth: '320px',  // Mobile-friendly minimum
                maxWidth: '1280px',
              }}
            >
              <GlassMobileNavLink
                icon={<Home size={18} />}
                label="Dashboard"
                active={pathname === '/'}
                onClick={() => navigateTo('/')}
              />
              <GlassMobileNavLink
                icon={<Search size={18} />}
                label="Search"
                badge="AI"
                active={pathname === '/search'}
                onClick={() => navigateTo('/search')}
              />
              <GlassMobileNavLink
                icon={<Grid3x3 size={18} />}
                label="Browse Solutions"
                active={pathname === '/solution'}
                onClick={() => navigateTo('/solution')}
              />
              <GlassMobileNavLink
                icon={<Plus size={18} />}
                label="New Solution"
                primary
                onClick={() => navigateTo('/solution/create')}
              />
              <GlassMobileNavLink
                icon={<LogOut size={18} />}
                label="Sign Out"
                onClick={handleSignOut}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   MOBILE / HAMBURGER NAV LINK
   ───────────────────────────────────────────────────────────── */
interface GlassMobileNavLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  primary?: boolean;
  onClick: () => void;
}

function GlassMobileNavLink({ icon, label, active, badge, primary, onClick }: GlassMobileNavLinkProps) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 mt-1.5 focus:outline-none focus:ring-2 focus:ring-[#07b9d5] focus:ring-offset-2 focus:ring-offset-black/90 ${
        primary
          ? 'bg-gradient-to-r from-[#07b9d5] to-[#059ab3] text-black shadow-lg shadow-[#07b9d5]/30'
          : active
          ? 'bg-gradient-to-r from-[#07b9d5]/20 to-[#059ab3]/10 text-[#07b9d5] border border-[#07b9d5]/30'
          : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
      }`}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="bg-gradient-to-r from-[#07b9d5] to-[#059ab3] text-black text-[10px] font-bold px-2 py-1 rounded-md shadow-lg shadow-[#07b9d5]/50">
          {badge}
        </span>
      )}
    </button>
  );
}
