import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertTriangle, CheckCircle, ShieldAlert, Eye, Zap, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context';
import { analyzeDarkPatterns, riskColor } from '../utils';
import type { DarkPatternResult } from '../types';

// ─── Suspicious behaviour definitions ────────────────────────────────────────
const BEHAVIOURS: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: 'drip-pricing',           label: 'Extra fees appeared only at checkout',            icon: <AlertCircle size={14} /> },
  { id: 'fake-urgency',           label: 'Countdown timer or "Only X left" messages',       icon: <Zap size={14} /> },
  { id: 'forced-action',          label: 'Hard to unsubscribe or cancel',                   icon: <ShieldAlert size={14} /> },
  { id: 'sneaking',               label: 'Items were added to cart without asking',          icon: <Search size={14} /> },
  { id: 'disguised-ads',          label: 'Ads looked like regular content',                 icon: <Eye size={14} /> },
  { id: 'difficult-cancellation', label: 'Cancellation required calling support',           icon: <AlertTriangle size={14} /> },
];

// ─── Stagger animation variants ──────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } },
  exit:    { opacity: 0, y: -12, scale: 0.95, transition: { duration: 0.2 } },
};

// ─── Scanning animation ───────────────────────────────────────────────────────
function ScanningEffect() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <div className="relative flex items-center justify-center">
        {/* Outer pulsing ring */}
        <motion.div
          className="absolute rounded-full border-2 border-[#C9F56A]/30"
          style={{ width: 96, height: 96 }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Inner pulsing ring */}
        <motion.div
          className="absolute rounded-full border-2 border-[#C9F56A]/50"
          style={{ width: 64, height: 64 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.1, 0.7] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        <motion.div
          className="relative z-10 text-[#C9F56A]"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Eye size={32} />
        </motion.div>
      </div>

      {/* Scanning bars */}
      <div className="flex flex-col gap-2 w-48">
        {[0.0, 0.15, 0.3].map((delay, i) => (
          <motion.div
            key={i}
            className="h-1.5 rounded-full bg-[#C9F56A]/20 overflow-hidden"
          >
            <motion.div
              className="h-full bg-[#C9F56A] rounded-full"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay }}
            />
          </motion.div>
        ))}
      </div>

      <p className="text-white/40 text-sm tracking-wide">Scanning for dark patterns…</p>
    </div>
  );
}

// ─── Risk badge ───────────────────────────────────────────────────────────────
function RiskBadge({ risk }: { risk: string }) {
  const colors = riskColor(risk);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {risk === 'high'   && <AlertTriangle size={10} />}
      {risk === 'medium' && <AlertCircle  size={10} />}
      {risk === 'low'    && <Info         size={10} />}
      {risk}
    </span>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────
function ResultCard({ result, index }: { result: DarkPatternResult; index: number }) {
  const colors = riskColor(result.risk);
  return (
    <motion.div
      variants={cardVariants}
      className={`bg-[#172033] border rounded-xl p-5 space-y-3 ${colors.border}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${colors.bg} ${colors.text}`}>
            {index + 1}
          </span>
          <h3 className="text-white font-semibold text-sm leading-snug">{result.pattern}</h3>
        </div>
        <RiskBadge risk={result.risk} />
      </div>

      {/* Description */}
      <p className="text-white/60 text-sm leading-relaxed">{result.description}</p>

      {/* Divider */}
      <div className="border-t border-white/8" />

      {/* Recommendation */}
      <div className="flex items-start gap-2">
        <ShieldAlert size={14} className="text-[#C9F56A] mt-0.5 flex-shrink-0" />
        <div>
          <span className="text-[#C9F56A] text-xs font-semibold uppercase tracking-wider">Recommended Action</span>
          <p className="text-white/70 text-sm mt-0.5 leading-relaxed">{result.recommendation}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DarkPatternDetector() {
  const { } = useApp(); // keep context wired

  const [websiteText,         setWebsiteText]         = useState('');
  const [selectedBehaviours,  setSelectedBehaviours]  = useState<string[]>([]);
  const [results,             setResults]             = useState<DarkPatternResult[]>([]);
  const [hasAnalyzed,         setHasAnalyzed]         = useState(false);
  const [isAnalyzing,         setIsAnalyzing]         = useState(false);
  const [inputError,          setInputError]          = useState('');

  // Toggle a behaviour checkbox
  function toggleBehaviour(id: string) {
    setSelectedBehaviours(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  }

  // Run analysis
  function handleAnalyze() {
    if (!websiteText.trim() && selectedBehaviours.length === 0) {
      setInputError('Please paste some website text or select at least one suspicious behaviour.');
      return;
    }
    setInputError('');
    setIsAnalyzing(true);
    setHasAnalyzed(false);
    setResults([]);

    setTimeout(() => {
      const detectedResults = analyzeDarkPatterns(websiteText, selectedBehaviours);
      setResults(detectedResults);
      setHasAnalyzed(true);
      setIsAnalyzing(false);
    }, 1500);
  }

  const highCount   = results.filter(r => r.risk === 'high').length;
  const mediumCount = results.filter(r => r.risk === 'medium').length;
  const lowCount    = results.filter(r => r.risk === 'low').length;

  return (
    <div className="min-h-screen bg-[#0F1621] text-white">
      {/* ── Subtle grid overlay ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {/* Breadcrumb */}
          <p className="text-white/40 text-xs tracking-widest uppercase font-medium">
            NYAYA LENS &rsaquo; Tools &rsaquo; Dark Pattern Detector
          </p>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-2">
              {/* Title */}
              <h1 className="flex items-center gap-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#C9F56A]/15 border border-[#C9F56A]/30">
                  <Eye size={20} className="text-[#C9F56A]" />
                </span>
                <span>
                  Dark Pattern{' '}
                  <span className="text-[#C9F56A]">Detector</span>
                </span>
              </h1>
              {/* Subtitle */}
              <p className="text-white/50 text-base max-w-xl leading-relaxed">
                Identify manipulative website practices before they cost you money or privacy.
              </p>
            </div>

            {/* Badge */}
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C9F56A]/30 bg-[#C9F56A]/10 text-[#C9F56A] text-xs font-semibold tracking-wide">
                <ShieldAlert size={12} />
                Rule-Based Detection
              </span>
            </div>
          </div>

          {/* Decorative line */}
          <div className="h-px bg-gradient-to-r from-[#C9F56A]/40 via-white/10 to-transparent" />
        </motion.div>

        {/* ── TWO-COLUMN LAYOUT ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 items-start">

          {/* ── LEFT PANEL ────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-[#172033] rounded-2xl border border-white/10 p-6 space-y-6"
          >
            {/* Panel title */}
            <div className="flex items-center gap-2">
              <Search size={16} className="text-[#C9F56A]" />
              <h2 className="text-white font-semibold text-base">Analyse Suspicious Content</h2>
            </div>

            {/* Textarea */}
            <div className="space-y-2">
              <label className="text-white/50 text-xs uppercase tracking-widest font-medium">
                Paste website text
              </label>
              <textarea
                value={websiteText}
                onChange={e => { setWebsiteText(e.target.value); setInputError(''); }}
                placeholder="Paste website text, checkout flow, or terms &amp; conditions…"
                className="w-full h-40 bg-[#0F1621] text-white/80 border border-white/10 rounded-xl p-4 resize-none placeholder:text-white/30 text-sm focus:outline-none focus:border-[#C9F56A]/50 focus:ring-1 focus:ring-[#C9F56A]/30 transition-all duration-200"
              />
            </div>

            {/* OR divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs font-medium px-2">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Behaviour checklist */}
            <div className="space-y-3">
              <label className="text-white/50 text-xs uppercase tracking-widest font-medium block">
                Select suspicious behaviours you noticed
              </label>
              <div className="space-y-2.5">
                {BEHAVIOURS.map(behaviour => {
                  const checked = selectedBehaviours.includes(behaviour.id);
                  return (
                    <button
                      key={behaviour.id}
                      type="button"
                      onClick={() => { toggleBehaviour(behaviour.id); setInputError(''); }}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                        checked
                          ? 'border-[#C9F56A]/40 bg-[#C9F56A]/8'
                          : 'border-white/8 bg-[#0F1621]/60 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      {/* Custom checkbox */}
                      <span
                        className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                          checked
                            ? 'bg-[#C9F56A] border-[#C9F56A]'
                            : 'border-white/30 bg-transparent'
                        }`}
                      >
                        {checked && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            width="9" height="7" viewBox="0 0 9 7" fill="none"
                          >
                            <path d="M1 3.5L3.5 6L8 1" stroke="#172033" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </motion.svg>
                        )}
                      </span>
                      {/* Icon + label */}
                      <span className="flex items-center gap-2">
                        <span className={`${checked ? 'text-[#C9F56A]' : 'text-white/30'} transition-colors duration-200`}>
                          {behaviour.icon}
                        </span>
                        <span className={`text-sm leading-snug transition-colors duration-200 ${checked ? 'text-white/90' : 'text-white/55'}`}>
                          {behaviour.label}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {inputError && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                >
                  <AlertTriangle size={12} className="flex-shrink-0" />
                  {inputError}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Analyze button */}
            <motion.button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              whileHover={{ scale: isAnalyzing ? 1 : 1.02 }}
              whileTap={{ scale: isAnalyzing ? 1 : 0.98 }}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isAnalyzing
                  ? 'bg-[#C9F56A]/40 text-[#172033]/60 cursor-not-allowed'
                  : 'bg-[#C9F56A] text-[#172033] hover:bg-[#d8ff7a] shadow-lg shadow-[#C9F56A]/20'
              }`}
            >
              <Eye size={16} />
              {isAnalyzing ? 'Scanning…' : 'Detect Dark Patterns'}
            </motion.button>

            {/* Disclaimer */}
            <p className="text-white/25 text-xs text-center leading-relaxed">
              Results are potential red flags for awareness only, not legal findings.
            </p>
          </motion.div>

          {/* ── RIGHT PANEL (results) ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="min-h-[520px]"
          >
            <AnimatePresence mode="wait">

              {/* ── Empty state ── */}
              {!hasAnalyzed && !isAnalyzing && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full min-h-[520px] bg-[#172033] rounded-2xl border border-white/10 gap-5 p-10"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl border border-white/8 bg-[#0F1621] flex items-center justify-center">
                      <Eye size={40} className="text-white/15" />
                    </div>
                    {/* corner dots */}
                    {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((pos, i) => (
                      <span key={i} className={`absolute ${pos} w-2 h-2 rounded-full border border-white/15 bg-[#172033]`} />
                    ))}
                  </div>
                  <div className="text-center space-y-2 max-w-xs">
                    <p className="text-white/30 font-medium text-sm">Ready to investigate</p>
                    <p className="text-white/20 text-xs leading-relaxed">
                      Paste website content or select suspicious behaviours on the left to begin detection.
                    </p>
                  </div>
                  {/* Decorative dots */}
                  <div className="flex gap-1.5 mt-2">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-white/15"
                        animate={{ opacity: [0.15, 0.5, 0.15] }}
                        transition={{ duration: 1.4, repeat: Infinity, delay }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Scanning ── */}
              {isAnalyzing && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#172033] rounded-2xl border border-white/10 min-h-[520px] flex items-center justify-center"
                >
                  <ScanningEffect />
                </motion.div>
              )}

              {/* ── Results ── */}
              {hasAnalyzed && !isAnalyzing && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* ── All clear ── */}
                  {results.length === 0 && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-[#172033] rounded-2xl border border-green-500/30 p-10 flex flex-col items-center gap-4 text-center"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                        <CheckCircle size={32} className="text-green-400" />
                      </div>
                      <div>
                        <p className="text-green-400 font-bold text-lg">No dark patterns detected</p>
                        <p className="text-green-300/60 text-sm mt-1">Looks clean based on your input.</p>
                      </div>
                      <div className="flex items-start gap-2 max-w-sm bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-left">
                        <Info size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-amber-300/70 text-xs leading-relaxed">
                          Always review carefully before making purchases or sharing personal data.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Patterns found ── */}
                  {results.length > 0 && (
                    <>
                      {/* Summary card */}
                      <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#172033] border border-red-500/30 rounded-2xl p-5"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                              <ShieldAlert size={18} className="text-red-400" />
                            </div>
                            <div>
                              <p className="text-white font-bold text-base">
                                {results.length} potential dark pattern{results.length !== 1 ? 's' : ''} detected
                              </p>
                              <p className="text-white/40 text-xs">Review each finding carefully before proceeding</p>
                            </div>
                          </div>
                          {/* Mini counts */}
                          <div className="flex gap-2 flex-wrap">
                            {highCount > 0 && (
                              <span className="px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold">
                                {highCount} HIGH
                              </span>
                            )}
                            {mediumCount > 0 && (
                              <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
                                {mediumCount} MED
                              </span>
                            )}
                            {lowCount > 0 && (
                              <span className="px-2.5 py-1 rounded-lg bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-bold">
                                {lowCount} LOW
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>

                      {/* Result cards */}
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-3"
                      >
                        <AnimatePresence>
                          {results.map((result, index) => (
                            <ResultCard key={result.pattern + index} result={result} index={index} />
                          ))}
                        </AnimatePresence>
                      </motion.div>

                      {/* Footer note */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center gap-2 text-white/25 text-xs text-center justify-center pt-2"
                      >
                        <Info size={11} />
                        These are potential red flags for awareness only, not legal findings.
                      </motion.p>
                    </>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── BOTTOM INFO STRIP ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { icon: <Zap size={16} className="text-[#C9F56A]" />, title: 'Real-Time Detection', desc: 'Rule-based engine scans for known manipulation tactics used by e-commerce sites.' },
            { icon: <ShieldAlert size={16} className="text-[#FF6B35]" />, title: 'Know Your Rights', desc: 'Dark patterns often violate consumer protection laws in India. Document and report them.' },
            { icon: <CheckCircle size={16} className="text-green-400" />, title: 'Stay Informed', desc: 'Awareness is your best defence. Always read before you click.' },
          ].map((item, i) => (
            <div key={i} className="bg-[#172033] rounded-xl border border-white/8 p-4 flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
              <div>
                <p className="text-white/80 text-xs font-semibold">{item.title}</p>
                <p className="text-white/35 text-xs mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
