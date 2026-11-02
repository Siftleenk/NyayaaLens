import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Easing } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  BookOpen,
  Map,
  Plus,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Clock,
  Briefcase,
  Phone,
  Inbox,
} from 'lucide-react';
import { useApp } from '../context';
import { formatCurrency, formatDate, statusColor } from '../utils';

// ─── Animation Variants ──────────────────────────────────────────────────────

const EASE_OUT: Easing = 'easeOut';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.025,
    y: -3,
    transition: { duration: 0.22, ease: EASE_OUT },
  },
};

// ─── Daily Tips ──────────────────────────────────────────────────────────────

const TIPS = [
  'Always request a written acknowledgment for any complaint you file.',
  'The Consumer Protection Act covers online purchases made on any Indian e-commerce platform.',
  'You have 2 years from the date of defect to file a consumer complaint.',
  'The National Consumer Helpline (1800-11-4000) is free and available Mon–Sat.',
  'You can claim compensation for mental agony in addition to the product refund.',
];

// ─── Greeting Helper ─────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─── Status Label Helper ─────────────────────────────────────────────────────

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    open: 'Open',
    'in-progress': 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
  };
  return labels[status] ?? status;
}

// ─── Quick Action Card ───────────────────────────────────────────────────────

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  bg: string;
  textColor: string;
  subtitleColor: string;
  onClick: () => void;
}

function QuickActionCard({
  icon,
  title,
  subtitle,
  bg,
  textColor,
  subtitleColor,
  onClick,
}: QuickActionProps) {
  return (
    <motion.button
      variants={itemVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      onClick={onClick}
      className={`${bg} rounded-2xl p-5 text-left w-full group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#172033] transition-shadow hover:shadow-xl`}
      aria-label={title}
    >
      <motion.div variants={cardHover}>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-white/10 backdrop-blur-sm`}>
          <span className={textColor}>{icon}</span>
        </div>
        <p className={`font-semibold text-[15px] leading-snug ${textColor} font-['Space_Grotesk',sans-serif]`}>
          {title}
        </p>
        <p className={`text-xs mt-1 leading-relaxed ${subtitleColor}`}>{subtitle}</p>
        <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${textColor} opacity-70 group-hover:opacity-100 transition-opacity`}>
          Open <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>
    </motion.button>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent?: string;
}

function StatCard({ label, value, icon, accent = 'text-[#172033]' }: StatCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-11 h-11 rounded-xl bg-[#F8F7F3] border border-gray-100 flex items-center justify-center shrink-0">
        <span className="text-[#172033]/60">{icon}</span>
      </div>
      <div>
        <p className={`text-2xl font-bold leading-none ${accent} font-['Space_Grotesk',sans-serif]`}>
          {value}
        </p>
        <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Dashboard Component ─────────────────────────────────────────────────────

export default function Dashboard() {
  const { cases } = useApp();
  const navigate  = useNavigate();

  // ── Derived stats ──
  const activeCases = useMemo(
    () => cases.filter((c) => c.status === 'open' || c.status === 'in-progress'),
    [cases]
  );

  const resolvedCases = useMemo(
    () => cases.filter((c) => c.status === 'resolved' || c.status === 'closed'),
    [cases]
  );

  const totalValueAtRisk = useMemo(
    () => activeCases.reduce((sum, c) => sum + c.amount, 0),
    [activeCases]
  );

  const recentCases = useMemo(
    () =>
      [...cases]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3),
    [cases]
  );

  const oldestOpenCase = useMemo(() => {
    if (activeCases.length === 0) return null;
    return activeCases.reduce((oldest, c) =>
      new Date(c.createdAt) < new Date(oldest.createdAt) ? c : oldest
    );
  }, [activeCases]);

  const daysSinceOldest = useMemo(() => {
    if (!oldestOpenCase) return 0;
    const diff = Date.now() - new Date(oldestOpenCase.createdAt).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }, [oldestOpenCase]);

  // ── Daily tip (rotates by day of month) ──
  const todayTip = TIPS[new Date().getDate() % TIPS.length];

  const greeting = getGreeting();

  return (
    <motion.div
      className="min-h-screen bg-[#F8F7F3] px-4 py-6 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto space-y-7">

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] font-['Space_Grotesk',sans-serif] leading-tight">
              {greeting}, Citizen. 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Here's your consumer protection overview
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/complaint-generator')}
            className="inline-flex items-center gap-2 bg-[#C9F56A] text-[#172033] font-semibold text-sm px-5 py-3 rounded-xl hover:bg-[#bef050] transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus size={16} strokeWidth={2.5} />
            New Complaint
          </motion.button>
        </motion.div>

        {/* ── QUICK ACTIONS ───────────────────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Quick Actions
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <QuickActionCard
              icon={<FileText size={20} strokeWidth={1.8} />}
              title="Generate Complaint"
              subtitle="Draft a legal complaint letter in minutes"
              bg="bg-[#172033]"
              textColor="text-white"
              subtitleColor="text-white/50"
              onClick={() => navigate('/complaint-generator')}
            />
            <QuickActionCard
              icon={<Search size={20} strokeWidth={1.8} />}
              title="Detect Dark Patterns"
              subtitle="Expose manipulative UI & hidden traps"
              bg="bg-[#1e2d47]"
              textColor="text-white"
              subtitleColor="text-white/50"
              onClick={() => navigate('/dark-pattern-detector')}
            />
            <QuickActionCard
              icon={<BookOpen size={20} strokeWidth={1.8} />}
              title="Know Your Rights"
              subtitle="Explore Indian consumer protection laws"
              bg="bg-[#C9F56A]"
              textColor="text-[#172033]"
              subtitleColor="text-[#172033]/55"
              onClick={() => navigate('/know-your-rights')}
            />
            <QuickActionCard
              icon={<Map size={20} strokeWidth={1.8} />}
              title="Escalation Guide"
              subtitle="Step-by-step path to get justice"
              bg="bg-[#FF6B35]"
              textColor="text-white"
              subtitleColor="text-white/60"
              onClick={() => navigate('/escalation-guide')}
            />
          </div>
        </motion.div>

        {/* ── MAIN CONTENT + SIDEBAR ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left / Main column */}
          <div className="xl:col-span-2 space-y-6">

            {/* ── STATS ROW ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                label="Total Cases"
                value={cases.length}
                icon={<Briefcase size={18} strokeWidth={1.7} />}
              />
              <StatCard
                label="Active Cases"
                value={activeCases.length}
                icon={<AlertTriangle size={18} strokeWidth={1.7} />}
                accent="text-amber-600"
              />
              <StatCard
                label="Resolved"
                value={resolvedCases.length}
                icon={<CheckCircle size={18} strokeWidth={1.7} />}
                accent="text-emerald-600"
              />
            </div>

            {/* ── ACTIVE CASES ──────────────────────────────────────────── */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Section header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <h2 className="font-semibold text-[#172033] text-sm font-['Space_Grotesk',sans-serif]">
                    Active Cases
                  </h2>
                </div>
                <button
                  onClick={() => navigate('/my-cases')}
                  className="text-xs font-semibold text-[#172033] hover:text-[#FF6B35] transition-colors flex items-center gap-1"
                >
                  View All <ArrowRight size={12} />
                </button>
              </div>

              {activeCases.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                    <Shield size={24} className="text-emerald-500" strokeWidth={1.5} />
                  </div>
                  <p className="font-semibold text-[#172033] text-sm mb-1">
                    No active cases — great news!
                  </p>
                  <p className="text-gray-400 text-xs mb-4">
                    All your consumer matters are resolved.
                  </p>
                  <button
                    onClick={() => navigate('/complaint-generator')}
                    className="text-xs font-semibold text-[#172033] underline underline-offset-2 hover:text-[#FF6B35] transition-colors"
                  >
                    Open a new case
                  </button>
                </div>
              ) : (
                /* Case rows */
                <ul className="divide-y divide-gray-50">
                  {activeCases.slice(0, 3).map((c, idx) => (
                    <motion.li
                      key={c.id}
                      variants={itemVariants}
                      custom={idx}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/70 transition-colors group cursor-default"
                    >
                      {/* Icon */}
                      <div className="w-9 h-9 rounded-xl bg-[#F8F7F3] border border-gray-100 flex items-center justify-center shrink-0">
                        <Briefcase size={15} className="text-[#172033]/40" strokeWidth={1.7} />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#172033] truncate leading-snug">
                          {c.company}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{c.product}</p>
                      </div>

                      {/* Amount */}
                      <div className="text-right shrink-0 hidden sm:block">
                        <p className="text-sm font-bold text-[#172033] font-['Space_Grotesk',sans-serif]">
                          {formatCurrency(c.amount)}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(c.createdAt)}</p>
                      </div>

                      {/* Status badge */}
                      <span
                        className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusColor(c.status)}`}
                      >
                        {statusLabel(c.status)}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>

            {/* ── CONSUMER AWARENESS TIP ────────────────────────────────── */}
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden bg-[#edfaa3] border border-[#C9F56A] rounded-2xl p-5"
            >
              {/* Decorative circle */}
              <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-[#C9F56A]/40 pointer-events-none" />
              <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-[#C9F56A]/25 pointer-events-none" />

              <div className="relative flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#C9F56A] border border-[#b4e356] flex items-center justify-center shrink-0 mt-0.5">
                  <Shield size={18} className="text-[#172033]" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#172033]/50">
                      Tip of the Day
                    </p>
                    <span className="text-[10px] font-semibold bg-[#172033] text-[#C9F56A] px-2 py-0.5 rounded-full">
                      Daily
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#172033] leading-relaxed">
                    {todayTip}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── RECENT ACTIVITY ───────────────────────────────────────── */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" strokeWidth={1.7} />
                  <h2 className="font-semibold text-[#172033] text-sm font-['Space_Grotesk',sans-serif]">
                    Recent Activity
                  </h2>
                </div>
              </div>

              {recentCases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                    <Inbox size={20} className="text-gray-300" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm text-gray-400">No activity yet. Start a new case to see updates here.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {recentCases.map((c, idx) => (
                    <motion.li
                      key={c.id}
                      variants={itemVariants}
                      custom={idx}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Status dot */}
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          c.status === 'resolved' || c.status === 'closed'
                            ? 'bg-emerald-400'
                            : c.status === 'in-progress'
                            ? 'bg-amber-400'
                            : 'bg-blue-400'
                        }`}
                      />

                      {/* Title */}
                      <p className="flex-1 text-sm text-[#172033] font-medium truncate">
                        {c.title}
                      </p>

                      {/* Status + date */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full hidden sm:inline-flex ${statusColor(c.status)}`}
                        >
                          {statusLabel(c.status)}
                        </span>
                        <span className="text-[11px] text-gray-400">{formatDate(c.updatedAt)}</span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>

          {/* ── RIGHT SIDEBAR / QUICK STATS ─────────────────────────────── */}
          <div className="space-y-4">

            {/* Value at risk */}
            <motion.div
              variants={itemVariants}
              className="bg-[#172033] rounded-2xl p-5 text-white"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={15} className="text-[#C9F56A]" strokeWidth={1.8} />
                <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  Total Value at Risk
                </p>
              </div>
              <p className="text-3xl font-bold font-['Space_Grotesk',sans-serif] leading-none mb-1">
                {formatCurrency(totalValueAtRisk)}
              </p>
              <p className="text-white/40 text-xs mt-1">
                Across {activeCases.length} active {activeCases.length === 1 ? 'case' : 'cases'}
              </p>

              {/* Progress bar — ratio of active vs total */}
              {cases.length > 0 && (
                <div className="mt-5">
                  <div className="flex justify-between text-[10px] text-white/40 mb-1.5">
                    <span>Active</span>
                    <span>
                      {Math.round((activeCases.length / cases.length) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#C9F56A] rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(activeCases.length / cases.length) * 100}%`,
                      }}
                      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Days since oldest open case */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-gray-400" strokeWidth={1.7} />
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Oldest Open Case
                </p>
              </div>
              {oldestOpenCase ? (
                <>
                  <p className="text-3xl font-bold text-[#172033] font-['Space_Grotesk',sans-serif] leading-none">
                    {daysSinceOldest}
                    <span className="text-base font-medium text-gray-400 ml-1">days</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1.5 truncate" title={oldestOpenCase.title}>
                    {oldestOpenCase.title}
                  </p>
                  {daysSinceOldest >= 15 && (
                    <div className="mt-3 flex items-start gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                      <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" strokeWidth={2} />
                      <p className="text-[11px] text-amber-700 leading-snug">
                        Consider escalating — over 15 days without resolution.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle size={16} className="text-emerald-400" strokeWidth={1.7} />
                  <p className="text-sm text-emerald-600 font-medium">No open cases</p>
                </div>
              )}
            </motion.div>

            {/* NCH Helpline card */}
            <motion.div
              variants={itemVariants}
              className="bg-[#FF6B35] rounded-2xl p-5 text-white overflow-hidden relative"
            >
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute right-4 top-3 w-12 h-12 rounded-full bg-white/10 pointer-events-none" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                    <Phone size={15} className="text-white" strokeWidth={1.8} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                    NCH Helpline
                  </p>
                </div>
                <p className="text-2xl font-bold font-['Space_Grotesk',sans-serif] leading-none tracking-wide">
                  1800-11-4000
                </p>
                <p className="text-white/60 text-xs mt-1.5 leading-snug">
                  Free · Mon to Sat · 9 AM – 5 PM
                </p>
                <div className="mt-4 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9F56A] animate-pulse" />
                  <p className="text-[11px] text-white/80 font-medium">National Consumer Helpline</p>
                </div>
              </div>
            </motion.div>

            {/* My Cases shortcut */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/my-cases')}
              className="w-full bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex items-center justify-between group hover:border-[#C9F56A] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F8F7F3] border border-gray-100 flex items-center justify-center">
                  <Briefcase size={16} className="text-[#172033]/60" strokeWidth={1.7} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#172033]">My Cases</p>
                  <p className="text-[11px] text-gray-400">{cases.length} total case{cases.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="text-gray-300 group-hover:text-[#172033] group-hover:translate-x-1 transition-all"
              />
            </motion.button>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
