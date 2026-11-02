import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckSquare,
  ArrowRight,
  Shield,
  Key,
} from 'lucide-react';
import { rightsData } from '../utils';
import type { RightsCard } from '../types';

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE },
  },
};

const expandVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.38, ease: EASE },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.28, ease: EASE },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ icon: React.ReactNode; label: string }> = ({
  icon,
  label,
}) => (
  <div className="flex items-center gap-2 mb-3">
    <span className="text-[#172033]">{icon}</span>
    <span className="text-xs font-bold uppercase tracking-widest text-[#172033]/50">
      {label}
    </span>
  </div>
);

const NumberBadge: React.FC<{ n: number }> = ({ n }) => (
  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#C9F56A] flex items-center justify-center text-[#172033] text-xs font-bold">
    {n}
  </span>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const KnowYourRights: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Filter logic
  const q = searchQuery.trim().toLowerCase();
  const filteredCards: RightsCard[] = q
    ? rightsData.filter(
        (card) =>
          card.title.toLowerCase().includes(q) ||
          card.category.toLowerCase().includes(q) ||
          card.summary.toLowerCase().includes(q)
      )
    : rightsData;

  const toggleCard = (id: string) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#F8F7F3]">
      {/* ── Page Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#C9F56A] flex items-center justify-center flex-shrink-0">
              <BookOpen size={22} className="text-[#172033]" strokeWidth={2.2} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172033] tracking-tight">
              Know Your Rights
            </h1>
          </div>

          <p className="text-[#172033]/60 text-base sm:text-lg max-w-2xl leading-relaxed mb-4">
            Comprehensive consumer protection guides under Indian law — understand
            your entitlements and how to enforce them.
          </p>

          {/* Legal tag */}
          <div className="inline-flex items-center gap-2 bg-[#172033] text-[#C9F56A] text-xs font-semibold px-4 py-2 rounded-full">
            <Shield size={13} strokeWidth={2.5} />
            Consumer Protection Act, 2019
          </div>
        </motion.div>

        {/* ── SEARCH BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <div className="relative w-full">
            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#172033]/40"
              strokeWidth={2}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setExpandedCard(null);
              }}
              placeholder="Search rights — e.g. defective product, refund, warranty..."
              className="
                w-full bg-white border border-[#E8E6DF] rounded-2xl
                pl-12 pr-5 py-4 text-sm text-[#172033]
                placeholder:text-[#172033]/35
                focus:outline-none focus:ring-2 focus:ring-[#C9F56A] focus:border-transparent
                transition-shadow duration-200 shadow-sm hover:shadow-md
              "
            />
          </div>
        </motion.div>

        {/* ── RESULTS COUNT ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.18 }}
          className="text-xs font-semibold text-[#172033]/45 uppercase tracking-widest mb-6"
        >
          {filteredCards.length} rights guide{filteredCards.length !== 1 ? 's' : ''}
        </motion.p>

        {/* ── CARDS GRID ── */}
        {filteredCards.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start"
          >
            {filteredCards.map((card) => {
              const isExpanded = expandedCard === card.id;

              return (
                <motion.div
                  key={card.id}
                  variants={cardVariants}
                  whileHover={{ scale: isExpanded ? 1 : 1.012 }}
                  layout
                  className="
                    bg-white rounded-2xl border border-[#E8E6DF] shadow-sm
                    overflow-hidden transition-shadow duration-200
                    hover:shadow-lg
                  "
                >
                  {/* ── Collapsed (always-visible) header ── */}
                  <div className="p-5">
                    {/* Top row */}
                    <div className="flex items-start gap-4 mb-3">
                      {/* Emoji icon in lime square */}
                      <div className="w-12 h-12 rounded-xl bg-[#C9F56A] flex items-center justify-center flex-shrink-0 text-2xl select-none">
                        {card.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Category badge */}
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#FF6B35] bg-[#FF6B35]/10 px-2.5 py-0.5 rounded-full mb-1">
                          {card.category}
                        </span>
                        {/* Title */}
                        <h2 className="text-[#172033] font-bold text-base leading-snug line-clamp-2">
                          {card.title}
                        </h2>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-[#172033]/60 text-sm leading-relaxed line-clamp-2 mb-4">
                      {card.summary}
                    </p>

                    {/* Expand button */}
                    <button
                      onClick={() => toggleCard(card.id)}
                      className="
                        group flex items-center gap-1.5 text-sm font-semibold
                        text-[#172033] hover:text-[#FF6B35]
                        transition-colors duration-200
                      "
                      aria-expanded={isExpanded}
                      aria-controls={`expanded-${card.id}`}
                    >
                      {isExpanded ? (
                        <>
                          Show Less
                          <ChevronUp
                            size={16}
                            className="transition-transform duration-300"
                            strokeWidth={2.5}
                          />
                        </>
                      ) : (
                        <>
                          Learn More
                          <ChevronDown
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-y-0.5"
                            strokeWidth={2.5}
                          />
                        </>
                      )}
                    </button>
                  </div>

                  {/* ── Expanded content ── */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        id={`expanded-${card.id}`}
                        key="expanded"
                        variants={expandVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="overflow-hidden"
                      >
                        <div className="border-t border-[#E8E6DF] px-5 pt-5 pb-6 space-y-6">

                          {/* EXPLANATION */}
                          <section>
                            <SectionLabel
                              icon={<Key size={14} strokeWidth={2.5} />}
                              label="Explanation"
                            />
                            <p className="text-[#172033]/75 text-sm leading-relaxed">
                              {card.explanation}
                            </p>
                          </section>

                          {/* NEXT STEPS */}
                          <section>
                            <SectionLabel
                              icon={<ArrowRight size={14} strokeWidth={2.5} />}
                              label="Next Steps"
                            />
                            <ol className="space-y-2.5">
                              {card.nextSteps.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <NumberBadge n={idx + 1} />
                                  <span className="text-sm text-[#172033]/75 leading-relaxed pt-0.5">
                                    {step}
                                  </span>
                                </li>
                              ))}
                            </ol>
                          </section>

                          {/* EVIDENCE CHECKLIST */}
                          <section>
                            <SectionLabel
                              icon={
                                <CheckSquare size={14} strokeWidth={2.5} />
                              }
                              label="Evidence Checklist"
                            />
                            <ul className="space-y-2">
                              {card.evidenceChecklist.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2.5"
                                >
                                  {/* Checkmark box */}
                                  <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 border-[#C9F56A] bg-[#C9F56A]/20 flex items-center justify-center">
                                    <svg
                                      width="10"
                                      height="8"
                                      viewBox="0 0 10 8"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M1 4L3.5 6.5L9 1"
                                        stroke="#172033"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </span>
                                  <span className="text-sm text-[#172033]/70 leading-relaxed">
                                    {item}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </section>

                          {/* LEGAL BASIS */}
                          <section className="bg-[#F8F7F3] rounded-xl p-4 border border-[#E8E6DF]">
                            <SectionLabel
                              icon={<Shield size={14} strokeWidth={2.5} />}
                              label="Legal Basis"
                            />
                            <p className="text-xs font-semibold text-[#172033] mb-0.5">
                              {card.relevantLaw}
                            </p>
                            <p className="text-xs text-[#172033]/50 mb-3">
                              {card.officialSource}
                            </p>
                            <a
                              href={card.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="
                                inline-flex items-center gap-1.5
                                text-xs font-semibold text-[#FF6B35]
                                hover:text-[#172033] transition-colors duration-200
                                underline-offset-2 hover:underline
                              "
                            >
                              View Official Source
                              <ExternalLink size={11} strokeWidth={2.5} />
                            </a>
                          </section>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* ── EMPTY STATE ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#E8E6DF] flex items-center justify-center mb-5">
              <BookOpen size={28} className="text-[#172033]/30" strokeWidth={1.8} />
            </div>
            <h3 className="text-[#172033] font-bold text-lg mb-2">
              No rights guides match your search
            </h3>
            <p className="text-[#172033]/50 text-sm mb-5 max-w-xs leading-relaxed">
              Try a different keyword or browse all available guides.
            </p>
            <p className="text-xs text-[#172033]/40 font-medium">
              Try searching for:{' '}
              <span className="text-[#FF6B35]">refund</span>,{' '}
              <span className="text-[#FF6B35]">warranty</span>,{' '}
              <span className="text-[#FF6B35]">defective</span>,{' '}
              <span className="text-[#FF6B35]">charges</span>
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="
                mt-6 px-5 py-2.5 rounded-xl bg-[#172033] text-[#C9F56A]
                text-sm font-semibold hover:bg-[#FF6B35] hover:text-white
                transition-colors duration-200
              "
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default KnowYourRights;
