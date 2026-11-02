import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import {
  Scale,
  Menu,
  X,
  ArrowRight,
  FileText,
  Zap,
  TrendingUp,
  BookOpen,
  Briefcase,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Phone,
  BadgeCheck,
  Info,
  LifeBuoy,
  Activity,
} from 'lucide-react';

// Open an app page in a new tab (hash-router paths)
function openPage(path: string) {
  window.open(`${window.location.origin}${window.location.pathname}#${path}`, '_blank');
}

// ─── Animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};




const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

// ─── Section wrapper with viewport trigger ─────────────────────────────────────
function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ onNav }: { onNav: (path: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links: { label: string; href: string }[] = [
    { label: 'Features', href: '#features' },
    { label: 'Rights', href: '#rights' },
    { label: 'How it Works', href: '#how-it-works' },
  ];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => onNav('/')}
          className="flex items-center gap-2.5 group"
        >
          <span className="w-9 h-9 rounded-full bg-[#C9F56A] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Scale className="w-4.5 h-4.5 text-[#172033]" strokeWidth={2.2} />
          </span>
          <span className="font-bold text-lg tracking-tight text-[#172033] font-['Space_Grotesk',sans-serif]">
            Nyaya<span className="text-[#FF6B35]"> Lens</span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.href)}
              className="text-sm font-medium text-[#172033]/70 hover:text-[#172033] transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNav('/dashboard')}
            className="px-4 py-2 text-sm font-semibold bg-[#172033] text-white rounded-lg hover:bg-[#1e2d45] transition-colors"
          >
            Get Started
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-[#172033]"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col px-4 py-4 gap-1">
              {links.map((l) => (
                <button
                  key={l.label}
                  onClick={() => scrollTo(l.href)}
                  className="text-left px-3 py-2.5 text-sm font-medium text-[#172033]/80 hover:text-[#172033] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => { setMobileOpen(false); onNav('/dashboard'); }}
                className="mt-2 px-4 py-2.5 text-sm font-semibold bg-[#172033] text-white rounded-lg"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── Hero Dashboard Preview Card ───────────────────────────────────────────────
function HeroDashboardCard() {
  return (
    <motion.div
      variants={scaleIn}
      className="relative w-full max-w-lg mx-auto"
    >
      {/* Glow */}
      <div className="absolute -inset-4 bg-[#C9F56A]/20 rounded-3xl blur-2xl" />

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Card header */}
        <div className="bg-[#172033] px-5 py-3.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-white/60 text-xs ml-2 font-mono">nyaya-lens.app/dashboard</span>
        </div>

        <div className="p-5 space-y-3.5">
          {/* Complaint tracker */}
          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Active Complaint</p>
                <p className="text-sm font-bold text-[#172033]">Complaint #2847</p>
                <p className="text-xs text-gray-500 mt-0.5">Amazon India — Refund Dispute</p>
              </div>
              <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                In Progress
              </span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Company → NCDRC</span>
                <span>Step 2/5</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '40%' }}
                  transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                  className="h-full bg-[#C9F56A] rounded-full"
                />
              </div>
            </div>
          </div>

          {/* AI Assistant row */}
          <div className="flex items-center gap-3 border border-[#C9F56A]/40 rounded-xl px-4 py-3 bg-[#C9F56A]/8">
            <div className="w-8 h-8 rounded-full bg-[#C9F56A] flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-[#172033]" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#172033]">AI Complaint Assistant</p>
              <p className="text-[10px] text-gray-500">Ready to draft your complaint</p>
            </div>
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-400"
            />
          </div>

          {/* Dark pattern alert */}
          <div className="flex items-center gap-3 border border-red-100 rounded-xl px-4 py-3 bg-red-50/70">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" strokeWidth={2} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-red-700">3 Dark Patterns Detected</p>
              <p className="text-[10px] text-red-500">On last scanned page</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-red-400" />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#172033] p-3.5 text-center">
              <p className="text-[#C9F56A] text-base font-extrabold font-['Space_Grotesk',sans-serif]">₹2.4Cr</p>
              <p className="text-white/60 text-[10px] mt-0.5">Consumer Savings</p>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3.5 text-center">
              <p className="text-[#172033] text-base font-extrabold font-['Space_Grotesk',sans-serif]">12,400+</p>
              <p className="text-gray-500 text-[10px] mt-0.5">Complaints Filed</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection({ onNav }: { onNav: (path: string) => void }) {
  return (
    <Section className="pt-32 pb-20 px-4 sm:px-6 bg-[#F8F7F3] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div className="space-y-6">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9F56A]/30 border border-[#C9F56A]/50 text-xs font-semibold text-[#172033]">
                <BadgeCheck className="w-3.5 h-3.5 text-[#172033]" />
                Consumer Protection Act 2019
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-[#172033] leading-[1.08] tracking-tight font-['Space_Grotesk',sans-serif]"
            >
              The internet isn't always fair.{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Now you have</span>{' '}
                <span className="relative z-10 text-[#FF6B35]">Haq.</span>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-[#172033]/65 leading-relaxed max-w-lg"
            >
              Your personal consumer protection companion. Understand your rights,
              challenge unfair practices, and take control — powered by AI and
              grounded in Indian law.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNav('/complaint-generator')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#172033] text-white rounded-xl font-semibold text-sm shadow-lg shadow-[#172033]/20 hover:bg-[#1e2d45] transition-colors"
              >
                <FileText className="w-4 h-4" />
                Resolve My Issue
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNav('/know-your-rights')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-[#172033] text-[#172033] rounded-xl font-semibold text-sm hover:bg-[#172033] hover:text-white transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Explore My Rights
              </motion.button>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {['#FF6B35', '#C9F56A', '#172033', '#6366f1'].map((c, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ backgroundColor: c }}
                  >
                    {['A', 'P', 'R', 'S'][i]}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#172033]/60">
                <span className="font-semibold text-[#172033]">12,400+</span> consumers helped across India
              </p>
            </motion.div>
          </div>

          {/* Right: dashboard card */}
          <HeroDashboardCard />
        </div>
      </div>
    </Section>
  );
}

// ─── Stats Bar ─────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { label: 'Consumer Protection Act', value: '2019', icon: ShieldCheck },
    { label: 'National Consumer Helpline', value: '1800-11-4000', icon: Phone },
    { label: 'Average Recovery', value: '₹10,000+', icon: TrendingUp },
    { label: 'Resolution Window', value: '30 Days', icon: Activity },
  ];

  return (
    <div className="bg-[#172033] py-5 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x lg:divide-white/10">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex items-center gap-3 px-4 lg:px-8 py-1"
            >
              <s.icon className="w-4 h-4 text-[#C9F56A] flex-shrink-0" strokeWidth={2} />
              <div>
                <p className="text-white font-bold text-sm font-['Space_Grotesk',sans-serif]">{s.value}</p>
                <p className="text-white/50 text-[11px]">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Features Section ──────────────────────────────────────────────────────────
const FEATURES: {
  icon: React.FC<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  page: string;
  accent: string;
}[] = [
  {
    icon: FileText,
    title: 'AI Complaint Generator',
    description: 'Generate legally-sound complaint letters in seconds. Tailored to your issue and the right forum.',
    page: '/complaint-generator',
    accent: '#C9F56A',
  },
  {
    icon: AlertTriangle,
    title: 'Dark Pattern Detector',
    description: 'Identify manipulative practices before they cost you. Scan websites and app flows instantly.',
    page: '/dark-pattern-detector',
    accent: '#FF6B35',
  },
  {
    icon: BookOpen,
    title: 'Know Your Rights',
    description: '6 comprehensive consumer protection guides covering every situation under Indian law.',
    page: '/know-your-rights',
    accent: '#6366f1',
  },
  {
    icon: Briefcase,
    title: 'Case Manager',
    description: 'Track all your consumer disputes in one place — from complaint filing to resolution.',
    page: '/my-cases',
    accent: '#0ea5e9',
  },
  {
    icon: TrendingUp,
    title: 'Escalation Guide',
    description: 'Step-by-step escalation from company grievance to NCDRC, with templates at every level.',
    page: '/escalation-guide',
    accent: '#f59e0b',
  },
];

function FeatureCard({
  feature,
  onNav,
}: {
  feature: (typeof FEATURES)[number];
  onNav: (path: string) => void;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(23,32,51,0.10)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4 cursor-pointer group"
      onClick={() => onNav(feature.page)}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${feature.accent}20` }}
      >
        <div style={{ color: feature.accent }}>
          <feature.icon className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>
      <div className="flex-1 space-y-1.5">
        <h3 className="font-bold text-[#172033] text-base font-['Space_Grotesk',sans-serif]">{feature.title}</h3>
        <p className="text-sm text-[#172033]/60 leading-relaxed">{feature.description}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#172033]/40 group-hover:text-[#172033] transition-colors">
        Explore
        <motion.span
          initial={{ x: 0 }}
          whileHover={{ x: 3 }}
          className="inline-flex"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.span>
      </div>
    </motion.div>
  );
}

function FeaturesSection({ onNav }: { onNav: (path: string) => void }) {
  return (
    <Section id="features" className="py-24 px-4 sm:px-6 bg-[#F8F7F3]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-widest text-[#FF6B35]">
            Platform Features
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold text-[#172033] font-['Space_Grotesk',sans-serif] tracking-tight"
          >
            Everything you need to fight back
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#172033]/60 text-base max-w-xl mx-auto">
            A complete toolkit for Indian consumers — from understanding your rights to enforcing them.
          </motion.p>
        </div>

        <motion.div
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} feature={f} onNav={onNav} />
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

// ─── How It Works Section ──────────────────────────────────────────────────────
function HowItWorksSection({ onNav }: { onNav: (path: string) => void }) {
  const steps = [
    {
      num: '01',
      icon: FileText,
      title: 'Describe your problem',
      desc: 'Tell us what happened — the company, product, amount, and what went wrong. Plain language works fine.',
    },
    {
      num: '02',
      icon: Zap,
      title: 'Generate your complaint',
      desc: "Our AI crafts a legally-grounded complaint letter with the right tone, citations, and demand for resolution.",
    },
    {
      num: '03',
      icon: TrendingUp,
      title: 'Escalate if needed',
      desc: 'No response? We guide you through every escalation — from company to Consumer Forum to NCDRC.',
    },
  ];

  return (
    <Section id="how-it-works" className="py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-widest text-[#FF6B35]">
            How It Works
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold text-[#172033] font-['Space_Grotesk',sans-serif] tracking-tight"
          >
            Resolve your issue in 3 steps
          </motion.h2>
        </div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-8 left-[16.7%] right-[16.7%] h-px bg-gray-200 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-[#172033] flex items-center justify-center shadow-lg shadow-[#172033]/20">
                    <step.icon className="w-6 h-6 text-[#C9F56A]" strokeWidth={2} />
                  </div>
                  <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#C9F56A] flex items-center justify-center text-[10px] font-black text-[#172033]">
                    {i + 1}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-[#172033] font-['Space_Grotesk',sans-serif]">{step.title}</h3>
                  <p className="text-sm text-[#172033]/60 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div variants={fadeUp} className="flex justify-center mt-12">
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNav('/complaint-generator')}
            className="flex items-center gap-2 px-7 py-3.5 bg-[#C9F56A] text-[#172033] rounded-xl font-bold text-sm hover:bg-[#b8e455] transition-colors shadow-lg shadow-[#C9F56A]/30"
          >
            Start for free
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Rights Awareness Section ──────────────────────────────────────────────────
function RightsSection({ onNav }: { onNav: (path: string) => void }) {
  const rights = [
    {
      title: 'Right to Safety',
      badge: 'Section 2(9)',
      desc: 'Protection against hazardous goods and services. Manufacturers must disclose risks and meet safety standards.',
      icon: ShieldCheck,
    },
    {
      title: 'Right to Information',
      badge: 'Section 2(9)',
      desc: 'You have the right to know quality, quantity, purity, standard, and price of goods before purchase.',
      icon: Info,
    },
    {
      title: 'Right to Redressal',
      badge: 'Section 2(9)',
      desc: 'Unfair trade practices and exploitation can be challenged at District, State, or National forums.',
      icon: LifeBuoy,
    },
  ];

  return (
    <Section id="rights" className="py-24 px-4 sm:px-6 bg-[#F8F7F3]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-widest text-[#FF6B35]">
            Consumer Rights
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold text-[#172033] font-['Space_Grotesk',sans-serif] tracking-tight"
          >
            Your rights at a glance
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#172033]/60 text-base max-w-xl mx-auto">
            The Consumer Protection Act 2019 guarantees you six fundamental rights.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {rights.map((r, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(23,32,51,0.08)' }}
              className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 cursor-pointer"
              onClick={() => onNav('/know-your-rights')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C9F56A]/25 flex items-center justify-center">
                  <r.icon className="w-5 h-5 text-[#172033]" strokeWidth={2} />
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#C9F56A]/30 text-[#172033]">
                  {r.badge}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-[#172033] text-base mb-1.5 font-['Space_Grotesk',sans-serif]">{r.title}</h3>
                <p className="text-sm text-[#172033]/60 leading-relaxed">{r.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#172033]/40 hover:text-[#172033] transition-colors">
                Learn more <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="flex justify-center mt-10">
          <button
            onClick={() => onNav('/know-your-rights')}
            className="text-sm font-semibold text-[#172033] underline underline-offset-4 hover:text-[#FF6B35] transition-colors"
          >
            View all 6 consumer rights →
          </button>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Trust / Resources Section ─────────────────────────────────────────────────
function TrustSection() {
  const resources = [
    {
      name: 'National Consumer Helpline',
      url: 'https://consumerhelpline.gov.in',
      display: 'consumerhelpline.gov.in',
      desc: 'Official helpline for filing complaints and tracking their status.',
    },
    {
      name: 'e-Jagriti Portal',
      url: 'https://edaakhil.nic.in',
      display: 'e-jagriti.gov.in',
      desc: 'File cases directly with consumer commissions online.',
    },
    {
      name: 'Consumer Affairs Ministry',
      url: 'https://consumeraffairs.nic.in',
      display: 'consumeraffairs.nic.in',
      desc: 'Ministry of Consumer Affairs, Food and Public Distribution.',
    },
  ];

  return (
    <Section className="py-24 px-4 sm:px-6 bg-[#172033]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-widest text-[#C9F56A]">
            Official Sources
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk',sans-serif] tracking-tight"
          >
            Backed by official sources
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/50 text-base max-w-xl mx-auto">
            All guidance on Nyaya Lens is grounded in Government of India portals
            and the Consumer Protection Act 2019.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {resources.map((r, i) => (
            <motion.a
              key={i}
              variants={fadeUp}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4, backgroundColor: 'rgba(201,245,106,0.06)' }}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 p-6 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#C9F56A]/15 flex items-center justify-center flex-shrink-0">
                  <ExternalLink className="w-4 h-4 text-[#C9F56A]" strokeWidth={2} />
                </div>
                <span className="text-[10px] font-mono text-white/30 pt-1">{r.display}</span>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm font-['Space_Grotesk',sans-serif] mb-1">{r.name}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{r.desc}</p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CCPA Mention + Tagline */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/10 pt-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C9F56A] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#172033]" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">CCPA — Central Consumer Protection Authority</p>
              <p className="text-white/40 text-xs">Established under Section 10 of CPA 2019</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-2xl font-extrabold text-[#C9F56A] font-['Space_Grotesk',sans-serif]">
              Know Your Rights.
            </p>
            <p className="text-2xl font-extrabold text-white font-['Space_Grotesk',sans-serif]">
              Protect Your Money.
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer({ onNav }: { onNav: (path: string) => void }) {
  const quickLinks: { label: string; page: string }[] = [
    { label: 'Dashboard',           page: '/dashboard' },
    { label: 'Complaint Generator', page: '/complaint-generator' },
    { label: 'Dark Pattern Detector', page: '/dark-pattern-detector' },
    { label: 'Know Your Rights',    page: '/know-your-rights' },
    { label: 'My Cases',            page: '/my-cases' },
    { label: 'Escalation Guide',    page: '/escalation-guide' },
  ];

  return (
    <footer className="bg-[#F8F7F3] border-t border-gray-200 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <button onClick={() => onNav('/')} className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-full bg-[#C9F56A] flex items-center justify-center">
                <Scale className="w-4 h-4 text-[#172033]" strokeWidth={2.2} />
              </span>
              <span className="font-bold text-lg text-[#172033] font-['Space_Grotesk',sans-serif]">
                Nyaya<span className="text-[#FF6B35]"> Lens</span>
              </span>
            </button>
            <p className="text-sm text-[#172033]/60 leading-relaxed max-w-xs">
              Your personal consumer protection companion for India. Know your rights.
              Fight back. Win.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs text-[#172033]/50">Grounded in Consumer Protection Act 2019</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#172033]/40 mb-4">Quick Links</p>
            <div className="grid grid-cols-2 gap-1.5">
              {quickLinks.map((l) => (
                <button
                  key={l.page}
                  onClick={() => onNav(l.page)}
                  className="text-left text-sm text-[#172033]/65 hover:text-[#172033] transition-colors py-0.5"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#172033]/40 mb-4">Official Resources</p>
            <div className="space-y-2">
              {[
                { label: 'National Consumer Helpline', url: 'https://consumerhelpline.gov.in' },
                { label: 'e-Jagriti Portal', url: 'https://edaakhil.nic.in' },
                { label: 'Consumer Affairs Ministry', url: 'https://consumeraffairs.nic.in' },
                { label: 'CCPA', url: 'https://ccpa.nic.in' },
              ].map((r) => (
                <a
                  key={r.label}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[#172033]/65 hover:text-[#172033] transition-colors"
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  {r.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer + Copyright */}
        <div className="border-t border-gray-200 pt-6 space-y-3">
          <p className="text-xs text-[#172033]/40 leading-relaxed max-w-3xl">
            <strong className="text-[#172033]/60">Disclaimer:</strong> Nyaya Lens is provided for informational
            purposes only. The content does not constitute legal advice. Always consult a qualified legal
            professional for advice specific to your situation. We are not affiliated with any government body.
          </p>
          <p className="text-xs text-[#172033]/35">
            © 2024 Nyaya Lens. All rights reserved. Made with ❤️ for Indian consumers.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── LandingPage (root export) ─────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F3] font-['Inter',sans-serif]">
      <Navbar onNav={openPage} />
      <main>
        <HeroSection onNav={openPage} />
        <StatsBar />
        <FeaturesSection onNav={openPage} />
        <HowItWorksSection onNav={openPage} />
        <RightsSection onNav={openPage} />
        <TrustSection />
      </main>
      <Footer onNav={openPage} />
    </div>
  );
}
