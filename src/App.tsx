import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context';
import NotificationStack from './components/NotificationStack';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ComplaintGenerator from './pages/ComplaintGenerator';
import DarkPatternDetector from './pages/DarkPatternDetector';
import KnowYourRights from './pages/KnowYourRights';
import MyCases from './pages/MyCases';
import EscalationGuide from './pages/EscalationGuide';

// ─── Animation ────────────────────────────────────────────────────────────────

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1, y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

// ─── Mobile top bar ───────────────────────────────────────────────────────────

function MobileTopBar() {
  const navigate = useNavigate();
  const { setSidebarOpen } = useApp();
  return (
    <div className="lg:hidden sticky top-0 z-20 flex items-center justify-between
      px-4 py-3 bg-[#F8F7F3] border-b border-[#E8E6DF] flex-shrink-0">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2"
      >
        <div className="w-7 h-7 bg-[#172033] rounded-lg flex items-center justify-center">
          <Scale className="w-3.5 h-3.5 text-[#C9F56A]" />
        </div>
        <span className="font-space font-bold text-[#172033] text-base tracking-tight">
          Nyaya <span className="text-[#FF6B35]">Lens</span>
        </span>
      </button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setSidebarOpen(true)}
        className="bg-[#172033] text-white p-2 rounded-lg"
        aria-label="Open menu"
      >
        <Menu className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

// ─── App shell (sidebar layout) ───────────────────────────────────────────────

function AppShell() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F7F3]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileTopBar />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-full"
            >
              <Routes>
                <Route path="/dashboard"             element={<Dashboard />} />
                <Route path="/complaint-generator"   element={<ComplaintGenerator />} />
                <Route path="/dark-pattern-detector" element={<DarkPatternDetector />} />
                <Route path="/know-your-rights"      element={<KnowYourRights />} />
                <Route path="/my-cases"              element={<MyCases />} />
                <Route path="/escalation-guide"      element={<EscalationGuide />} />
                {/* Fallback → dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Landing page — full screen, no sidebar */}
        <Route path="/" element={<LandingPage />} />
        {/* All app pages — wrapped in sidebar layout */}
        <Route path="/*" element={<AppShell />} />
      </Routes>
      <NotificationStack />
    </AppProvider>
  );
}
