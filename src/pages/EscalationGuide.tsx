import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Easing } from 'framer-motion';
import {
  Map,
  Phone,
  Globe,
  ArrowRight,
  CheckSquare,
  ChevronRight,
  ExternalLink,
  Shield,
  FileText,
  Scale,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../context';

// ─── Animation Variants ───────────────────────────────────────────────────────

const OUT: Easing = 'easeOut';
const IN: Easing = 'easeIn';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: OUT },
  }),
};

const stepPanel = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: OUT } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.25, ease: IN } },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChecklistItem {
  id: number;
  label: string;
  checked: boolean;
}

interface ResourceCard {
  title: string;
  url: string;
  description: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const RESOURCES: ResourceCard[] = [
  {
    title: 'National Consumer Helpline',
    url: 'https://consumerhelpline.gov.in',
    description: 'consumerhelpline.gov.in',
  },
  {
    title: 'e-Jagriti Portal',
    url: 'https://e-jagriti.gov.in',
    description: 'e-jagriti.gov.in',
  },
  {
    title: 'Consumer Affairs Ministry',
    url: 'https://consumeraffairs.nic.in',
    description: 'consumeraffairs.nic.in',
  },
];

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 1, label: 'Purchase receipt / invoice', checked: false },
  { id: 2, label: 'Order confirmation email', checked: false },
  { id: 3, label: 'Product photographs', checked: false },
  { id: 4, label: 'Communication screenshots (WhatsApp, email, chat)', checked: false },
  { id: 5, label: 'Bank statements showing payment', checked: false },
  { id: 6, label: 'Product delivery receipt', checked: false },
  { id: 7, label: 'Warranty documents', checked: false },
  { id: 8, label: 'Service request records', checked: false },
];

const STEPS = [
  { id: 1, label: 'Company Complaint' },
  { id: 2, label: 'National Consumer Helpline' },
  { id: 3, label: 'Consumer Commission' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Bullet point with ChevronRight accent */
const ActionItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start gap-2 text-sm text-gray-700">
    <ChevronRight size={16} className="mt-0.5 shrink-0 text-[#C9F56A]" />
    <span>{children}</span>
  </li>
);

/** Evidence pill */
const EvidencePill: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9F56A]/50 bg-[#C9F56A]/10 px-3 py-1 text-xs font-medium text-[#172033]">
    <Shield size={11} className="text-[#172033]" />
    {label}
  </span>
);

/** Commission level row */
const CommissionRow: React.FC<{ level: string; range: string }> = ({ level, range }) => (
  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
    <div className="flex items-center gap-2">
      <Scale size={15} className="text-[#172033]" />
      <span className="text-sm font-semibold text-[#172033]">{level}</span>
    </div>
    <span className="rounded-full bg-[#172033]/10 px-3 py-0.5 text-xs font-medium text-[#172033]">
      {range}
    </span>
  </div>
);

// ─── Step Panels ──────────────────────────────────────────────────────────────

const Step1Panel: React.FC<{ onGenerate: () => void }> = ({ onGenerate }) => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#172033]">
          <FileText size={20} className="text-[#C9F56A]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#172033]">Step 1: Contact the Company</h3>
          <p className="text-sm text-gray-500">Begin before escalating to authorities</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          First Response Required
        </span>
        <span className="text-xs text-gray-500">Expected response: 15–30 days</span>
      </div>
    </div>

    {/* Intro */}
    <p className="rounded-xl bg-[#C9F56A]/15 px-4 py-3 text-sm font-medium text-[#172033]">
      Begin with a formal written complaint to the company. Most disputes are resolved at this
      stage — always exhaust this option before proceeding.
    </p>

    {/* Action items */}
    <div>
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-400">
        Action Items
      </h4>
      <ul className="space-y-2.5">
        <ActionItem>Find the company's Grievance Officer contact (usually at the bottom of their website)</ActionItem>
        <ActionItem>Send complaint via email — keep the sent receipt as proof</ActionItem>
        <ActionItem>Use registered post for physical complaints (keep the postal receipt)</ActionItem>
        <ActionItem>Note the acknowledgment number / ticket ID from the company's response</ActionItem>
      </ul>
    </div>

    {/* Evidence to prepare */}
    <div>
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-400">
        Evidence to Prepare
      </h4>
      <div className="flex flex-wrap gap-2">
        <EvidencePill label="Purchase invoice" />
        <EvidencePill label="Product photos" />
        <EvidencePill label="Screenshot of issue" />
        <EvidencePill label="Previous chat logs" />
      </div>
    </div>

    {/* Template preview */}
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Template Preview
      </p>
      <p className="font-mono text-sm text-[#172033]">
        Subject: Formal Consumer Complaint — [Product Name]
      </p>
      <p className="mt-1.5 text-xs text-gray-500 italic">
        Use Nyaya Lens's generator for a complete, ready-to-send letter.
      </p>
    </div>

    {/* CTA */}
    <button
      onClick={onGenerate}
      className="flex items-center gap-2 rounded-xl bg-[#172033] px-5 py-3 text-sm font-semibold text-[#C9F56A] transition-all hover:bg-[#1e2d47] active:scale-95"
    >
      <FileText size={16} />
      Generate Complaint Letter
      <ArrowRight size={16} />
    </button>
  </div>
);

const Step2Panel: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#172033]">
          <Phone size={20} className="text-[#C9F56A]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#172033]">Step 2: National Consumer Helpline</h3>
          <p className="text-sm text-gray-500">Government mediation service</p>
        </div>
      </div>
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Government Helpline
      </span>
    </div>

    {/* Contact box */}
    <div className="rounded-2xl border-2 border-[#C9F56A] bg-[#C9F56A]/10 p-5">
      <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#172033]">
        Contact Information
      </h4>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <Phone size={18} className="shrink-0 text-[#172033]" />
          <div>
            <p className="text-base font-bold text-[#172033]">1800-11-4000</p>
            <p className="text-xs text-gray-500">Toll-free · Mon–Sat 9AM–5PM</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <Phone size={18} className="shrink-0 text-[#172033]" />
          <div>
            <p className="text-base font-bold text-[#172033]">14404</p>
            <p className="text-xs text-gray-500">Short code helpline</p>
          </div>
        </div>
        <a
          href="https://consumerhelpline.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md"
        >
          <Globe size={18} className="shrink-0 text-[#172033]" />
          <div>
            <p className="text-sm font-bold text-[#172033]">consumerhelpline.gov.in</p>
            <p className="text-xs text-gray-500">Main portal</p>
          </div>
          <ExternalLink size={13} className="ml-auto text-gray-400" />
        </a>
        <a
          href="https://consumerhelpline.gov.in/gama.php"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md"
        >
          <Globe size={18} className="shrink-0 text-[#172033]" />
          <div>
            <p className="text-sm font-bold text-[#172033]">GAMA Portal</p>
            <p className="text-xs text-gray-500">Online complaint filing</p>
          </div>
          <ExternalLink size={13} className="ml-auto text-gray-400" />
        </a>
      </div>
    </div>

    {/* How to file online */}
    <div>
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-400">
        How to File Online
      </h4>
      <ol className="space-y-3">
        {[
          'Visit consumerhelpline.gov.in',
          'Register or login to your account',
          'File your complaint with full details',
          'Receive your complaint reference number',
          'Track complaint status online anytime',
        ].map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#172033] text-xs font-bold text-[#C9F56A]">
              {i + 1}
            </span>
            <span className="pt-0.5 text-sm text-gray-700">{step}</span>
          </li>
        ))}
      </ol>
    </div>

    {/* What NCH can do */}
    <div>
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-400">
        What NCH Can Do
      </h4>
      <ul className="space-y-2">
        <ActionItem>Mediate between you and the company for an amicable resolution</ActionItem>
        <ActionItem>Officially register your complaint with a government reference number</ActionItem>
        <ActionItem>Escalate unresolved cases to CCPA (Central Consumer Protection Authority)</ActionItem>
      </ul>
    </div>

    <div className="flex items-center gap-2 rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
      <AlertCircle size={16} className="shrink-0" />
      Expected resolution timeline: <span className="font-semibold ml-1">30–60 days</span>
    </div>
  </div>
);

const Step3Panel: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#172033]">
          <Scale size={20} className="text-[#C9F56A]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#172033]">
            Step 3: Consumer Commission via e-Jagriti
          </h3>
          <p className="text-sm text-gray-500">Formal legal recourse</p>
        </div>
      </div>
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        Legal Recourse
      </span>
    </div>

    {/* Commission levels */}
    <div>
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-400">
        Three Levels of Adjudication
      </h4>
      <div className="space-y-2.5">
        <CommissionRow level="District Consumer Commission" range="Claims up to ₹50 Lakhs" />
        <CommissionRow level="State Consumer Commission" range="Claims ₹50L – ₹2 Crore" />
        <CommissionRow level="National Commission (NCDRC)" range="Claims above ₹2 Crore" />
      </div>
    </div>

    {/* e-Jagriti portal */}
    <a
      href="https://e-jagriti.gov.in"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 rounded-2xl border-2 border-[#172033] bg-[#172033] p-5 transition-opacity hover:opacity-90"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9F56A]">
        <Globe size={22} className="text-[#172033]" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-white">e-Jagriti Portal</p>
        <p className="text-sm text-gray-300">e-jagriti.gov.in</p>
        <p className="mt-1 text-xs text-gray-400">
          File consumer complaints online through the official e-Jagriti portal
        </p>
      </div>
      <ExternalLink size={18} className="text-[#C9F56A]" />
    </a>

    {/* Filing details */}
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Filing Fee</p>
        <p className="text-2xl font-bold text-[#172033]">₹200</p>
        <p className="mt-1 text-xs text-gray-500">
          For claims up to ₹5 lakh (approximate — verify on portal)
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Time Limit</p>
        <p className="text-2xl font-bold text-[#172033]">2 Years</p>
        <p className="mt-1 text-xs text-gray-500">
          File within 2 years of the cause of action
        </p>
      </div>
    </div>

    {/* Documents needed */}
    <div>
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-400">
        Documents Required
      </h4>
      <ul className="space-y-2">
        <ActionItem>Affidavit (notarised statement of facts)</ActionItem>
        <ActionItem>Copy of the formal complaint</ActionItem>
        <ActionItem>All supporting evidence (invoices, photos, screenshots)</ActionItem>
        <ActionItem>Proof of jurisdiction (residential address, purchase location)</ActionItem>
      </ul>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const EscalationGuide: React.FC = () => {
  const navigate = useNavigate();
  useApp(); // keep context subscription for notifications if needed
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [tipsOpen, setTipsOpen] = useState(true);

  const checkedCount = checklist.filter((item) => item.checked).length;

  const toggleCheck = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const getStepState = (stepId: number): 'completed' | 'active' | 'future' => {
    if (stepId < activeStep) return 'completed';
    if (stepId === activeStep) return 'active';
    return 'future';
  };

  const stepStateClasses = {
    completed: {
      badge: 'bg-green-500 text-white',
      label: 'text-green-600 font-semibold',
      line: 'bg-green-400',
    },
    active: {
      badge: 'bg-[#C9F56A] text-[#172033]',
      label: 'text-[#172033] font-bold',
      line: 'bg-gray-200',
    },
    future: {
      badge: 'bg-gray-200 text-gray-400',
      label: 'text-gray-400 font-medium',
      line: 'bg-gray-200',
    },
  };

  return (
    <div className="min-h-screen bg-[#F8F7F3] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* ── 1. HEADER ─────────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="space-y-2"
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <button
              onClick={() => navigate('/dashboard')}
              className="transition-colors hover:text-[#172033]"
            >
              Dashboard
            </button>
            <ChevronRight size={13} />
            <span className="font-medium text-[#172033]">Escalation Guide</span>
          </nav>

          {/* Title row */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172033]">
              <Map size={20} className="text-[#C9F56A]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#172033] sm:text-3xl">
                Escalation Guide
              </h1>
              <p className="text-sm text-gray-500">
                Step-by-step guide to resolving consumer disputes through official channels
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── 2. PROGRESS TRACKER ───────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
            Escalation Path
          </p>
          <div className="flex items-start justify-between">
            {STEPS.map((step, idx) => {
              const state = getStepState(step.id);
              const cls = stepStateClasses[state];
              const isLast = idx === STEPS.length - 1;

              return (
                <React.Fragment key={step.id}>
                  {/* Step node */}
                  <button
                    onClick={() => setActiveStep(step.id as 1 | 2 | 3)}
                    className="flex flex-1 flex-col items-center gap-2 focus:outline-none"
                  >
                    <motion.span
                      whileTap={{ scale: 0.92 }}
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-sm transition-colors ${cls.badge}`}
                    >
                      {state === 'completed' ? '✓' : step.id}
                    </motion.span>
                    <span className={`text-center text-xs leading-tight ${cls.label}`}>
                      {step.label}
                    </span>
                  </button>

                  {/* Connector line */}
                  {!isLast && (
                    <div className="relative mt-5 h-0.5 flex-1 self-start">
                      <div className="h-full w-full bg-gray-200 rounded-full" />
                      {state === 'completed' && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-green-400"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          style={{ transformOrigin: 'left' }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </motion.div>

        {/* ── 3. STEP CONTENT + SIDEBAR ─────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Step Detail Panel (2/3 width) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <AnimatePresence mode="wait">
                {activeStep === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepPanel}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Step1Panel onGenerate={() => navigate('/complaint-generator')} />
                  </motion.div>
                )}
                {activeStep === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepPanel}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Step2Panel />
                  </motion.div>
                )}
                {activeStep === 3 && (
                  <motion.div
                    key="step3"
                    variants={stepPanel}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Step3Panel />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step navigation arrows */}
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                <button
                  onClick={() => setActiveStep((s) => Math.max(1, s - 1) as 1 | 2 | 3)}
                  disabled={activeStep === 1}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:border-[#172033] hover:text-[#172033] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Previous Step
                </button>
                <span className="text-xs text-gray-400">
                  Step {activeStep} of {STEPS.length}
                </span>
                <button
                  onClick={() => setActiveStep((s) => Math.min(3, s + 1) as 1 | 2 | 3)}
                  disabled={activeStep === 3}
                  className="flex items-center gap-1.5 rounded-lg bg-[#172033] px-4 py-2 text-sm font-semibold text-[#C9F56A] transition-all hover:bg-[#1e2d47] disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                >
                  Next Step <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── 4. EVIDENCE CHECKLIST (sidebar) ─────────────────────────────── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="lg:col-span-1"
          >
            <div className="rounded-2xl border-2 border-[#C9F56A] bg-white p-5 shadow-sm">
              {/* Checklist header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare size={18} className="text-[#172033]" />
                  <h3 className="text-sm font-bold text-[#172033]">Evidence Checklist</h3>
                </div>
                <span className="rounded-full bg-[#172033] px-2.5 py-0.5 text-xs font-bold text-[#C9F56A]">
                  {checkedCount}/{checklist.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  className="h-full rounded-full bg-[#C9F56A]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(checkedCount / checklist.length) * 100}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>

              <p className="mb-4 text-xs text-gray-500">
                {checkedCount === checklist.length
                  ? '🎉 All documents ready! You\'re well prepared.'
                  : `${checklist.length - checkedCount} document${checklist.length - checkedCount !== 1 ? 's' : ''} remaining`}
              </p>

              {/* Checklist items */}
              <ul className="space-y-2.5">
                {checklist.map((item, i) => (
                  <motion.li
                    key={item.id}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={i * 0.5}
                  >
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-[#C9F56A]/10">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleCheck(item.id)}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#172033]"
                      />
                      <span
                        className={`text-xs leading-relaxed ${
                          item.checked ? 'text-gray-400 line-through' : 'text-gray-700'
                        }`}
                      >
                        {item.label}
                      </span>
                    </label>
                  </motion.li>
                ))}
              </ul>

              {/* Reset */}
              {checkedCount > 0 && (
                <button
                  onClick={() =>
                    setChecklist((prev) => prev.map((i) => ({ ...i, checked: false })))
                  }
                  className="mt-4 text-xs text-gray-400 underline transition-colors hover:text-[#172033]"
                >
                  Reset checklist
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── 5. QUICK TIPS ─────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <div className="rounded-2xl border-2 border-[#FF6B35]/30 bg-[#FF6B35]/5 p-6">
            <button
              onClick={() => setTipsOpen((o) => !o)}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF6B35]">
                  <AlertCircle size={18} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-[#172033]">Quick Tips for Success</h3>
              </div>
              {tipsOpen ? (
                <ChevronUp size={20} className="text-[#FF6B35]" />
              ) : (
                <ChevronDown size={20} className="text-[#FF6B35]" />
              )}
            </button>

            <AnimatePresence>
              {tipsOpen && (
                <motion.ul
                  key="tips-list"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="mt-5 space-y-2.5 overflow-hidden"
                >
                  {[
                    'Keep all evidence organised in a dedicated folder (physical and digital)',
                    'Note dates and times of every interaction with the company',
                    'Always prefer written communication over phone calls — it creates a paper trail',
                    'Request a reference number for every complaint you raise',
                    'The 30-day resolution window applies to most consumer complaints under the CPA 2019',
                  ].map((tip, i) => (
                    <motion.li
                      key={i}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="flex items-start gap-3 text-sm text-gray-700"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF6B35] text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      {tip}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── 6. OFFICIAL RESOURCES ROW ─────────────────────────────────────── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">
            Official Resources
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {RESOURCES.map((resource, i) => (
              <motion.a
                key={resource.title}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={i}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="group flex flex-col justify-between rounded-2xl bg-[#172033] p-5 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9F56A]/10">
                    <Globe size={18} className="text-[#C9F56A]" />
                  </div>
                  <ExternalLink
                    size={15}
                    className="text-gray-500 transition-colors group-hover:text-[#C9F56A]"
                  />
                </div>
                <div>
                  <p className="mb-1 text-sm font-bold text-white">{resource.title}</p>
                  <p className="text-xs text-gray-400">{resource.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Bottom spacer */}
        <div className="h-6" />
      </div>
    </div>
  );
};

export default EscalationGuide;
