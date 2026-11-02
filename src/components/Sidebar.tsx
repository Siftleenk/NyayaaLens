import { motion, AnimatePresence } from 'framer-motion';
import type { ReactElement } from 'react';
import {
  LayoutDashboard, FileText, Search, BookOpen, Briefcase,
  Map, X, Scale, ArrowUpRight,
} from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context';

// ─── Nav items ────────────────────────────────────────────────────────────────

const navItems: { path: string; label: string; icon: ReactElement }[] = [
  { path: '/dashboard',             label: 'Dashboard',              icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/complaint-generator',   label: 'AI Complaint Generator', icon: <FileText className="w-4 h-4" /> },
  { path: '/dark-pattern-detector', label: 'Dark Pattern Detector',  icon: <Search className="w-4 h-4" /> },
  { path: '/know-your-rights',      label: 'Know Your Rights',       icon: <BookOpen className="w-4 h-4" /> },
  { path: '/my-cases',              label: 'My Cases',               icon: <Briefcase className="w-4 h-4" /> },
  { path: '/escalation-guide',      label: 'Escalation Guide',       icon: <Map className="w-4 h-4" /> },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { cases, sidebarOpen, setSidebarOpen } = useApp();
  const [localOpen, setLocalOpen] = useState(false);

  const openCases = cases.filter(c => c.status === 'open' || c.status === 'in-progress').length;
  const isOpen    = sidebarOpen || localOpen;

  function close() {
    setSidebarOpen(false);
    setLocalOpen(false);
  }

  return (
    <>
      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar panel ── */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-64 bg-[#172033] z-50 flex flex-col
          lg:translate-x-0 lg:static lg:h-screen"
        style={{ translateX: undefined }}
      >
        {/* ── Logo (same tab → home) ── */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => { navigate('/'); close(); }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 bg-[#C9F56A] rounded-lg flex items-center justify-center
              group-hover:scale-105 transition-transform">
              <Scale className="w-4 h-4 text-[#172033]" />
            </div>
            <span className="font-space font-bold text-white text-lg tracking-tight">Nyaya Lens</span>
          </button>
          <button
            onClick={close}
            className="lg:hidden text-white/50 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Nav items (open each page in a NEW TAB) ── */}
        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-3 pb-2">
            — opens in new tab
          </p>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <a
                key={item.path}
                href={`#${item.path}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                  font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-[#C9F56A] text-[#172033]'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                }`}
              >
                <span className={isActive ? 'text-[#172033]' : 'text-white/50 group-hover:text-white/80'}>
                  {item.icon}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.path === '/my-cases' && openCases > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-[#172033]/20 text-[#172033]'
                      : 'bg-[#C9F56A]/20 text-[#C9F56A]'
                  }`}>
                    {openCases}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* ── Quick external link ── */}
        <div className="px-4 pb-2">
          <a
            href="https://consumerhelpline.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/40
              hover:text-[#C9F56A] hover:bg-white/5 transition-colors"
          >
            <span>National Consumer Helpline</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        {/* ── Footer note ── */}
        <div className="border-t border-white/10 p-5">
          <p className="text-[10px] text-white/25 leading-relaxed">
            Nyaya Lens is for awareness purposes only. Consult a qualified legal professional for legal advice.
          </p>
        </div>
      </motion.aside>
    </>
  );
}
