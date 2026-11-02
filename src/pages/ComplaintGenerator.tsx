import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Easing } from 'framer-motion';
import { FileText, Zap, Copy, Download, Save, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../context';
import { generateComplaintText } from '../utils';
import type { ProblemCategory } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────

const INPUT_CLASS =
  'w-full bg-white border border-[#E8E6DF] rounded-xl px-4 py-3 text-sm text-[#172033] font-inter focus:outline-none focus:border-[#172033] transition-colors';

const CARD_CLASS = 'bg-white rounded-2xl border border-[#E8E6DF] p-6 shadow-sm';

const CATEGORIES: { value: ProblemCategory; label: string; emoji: string }[] = [
  { value: 'defective-product', label: 'Defective Product', emoji: '🔧' },
  { value: 'refund-dispute',    label: 'Refund Dispute',    emoji: '💸' },
  { value: 'misleading-ad',     label: 'Misleading Ad',     emoji: '📢' },
  { value: 'hidden-charges',    label: 'Hidden Charges',    emoji: '💳' },
  { value: 'warranty-dispute',  label: 'Warranty Dispute',  emoji: '📋' },
  { value: 'ecommerce',         label: 'E-Commerce Issue',  emoji: '🛒' },
  { value: 'service-failure',   label: 'Service Failure',   emoji: '⚙️' },
  { value: 'other',             label: 'Other',             emoji: '📝' },
];

const TIPS = [
  {
    icon: '📄',
    title: 'Keep Supporting Documents',
    body: 'Always attach invoices, screenshots, and previous communication threads with your complaint for a stronger case.',
  },
  {
    icon: '⏱️',
    title: 'Act Within 2 Years',
    body: 'Under the Consumer Protection Act, 2019, complaints must be filed within two years of the cause of action arising.',
  },
  {
    icon: '📬',
    title: 'Send via Registered Post',
    body: 'Send your complaint letter via speed post or registered post to the company and keep the receipt as proof of delivery.',
  },
];


// ─── Animation variants ───────────────────────────────────────────────────────

const EASE_OUT: Easing = 'easeOut';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: EASE_OUT },
  }),
};

// ─── Label helper ─────────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold font-space text-[#172033] mb-1.5">
      {children}
      {required && <span className="text-[#FF6B35] ml-1">*</span>}
    </label>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ComplaintGenerator() {
  const { addCase, showNotification } = useApp();

  // Form state
  const [company,           setCompany]           = useState('');
  const [product,           setProduct]           = useState('');
  const [amount,            setAmount]            = useState('');
  const [purchaseDate,      setPurchaseDate]      = useState('');
  const [category,          setCategory]          = useState<ProblemCategory | ''>('');
  const [description,       setDescription]       = useState('');
  const [desiredResolution, setDesiredResolution] = useState('');

  // Output / UI state
  const [generatedComplaint, setGeneratedComplaint] = useState('');
  const [isGenerating,       setIsGenerating]        = useState(false);
  const [copied,             setCopied]              = useState(false);
  const [saved,              setSaved]               = useState(false);
  const [errors,             setErrors]              = useState<string[]>([]);

  // ── Validation ────────────────────────────────────────────────────────────

  function validate(): boolean {
    const errs: string[] = [];
    if (!company.trim())           errs.push('Company / Seller name is required.');
    if (!product.trim())           errs.push('Product / Service name is required.');
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
                                   errs.push('A valid amount paid is required.');
    if (!purchaseDate)             errs.push('Date of purchase is required.');
    if (!category)                 errs.push('Problem category is required.');
    if (!description.trim())       errs.push('Description of your grievance is required.');
    if (!desiredResolution.trim()) errs.push('Desired resolution is required.');
    setErrors(errs);
    return errs.length === 0;
  }

  // ── Generate ──────────────────────────────────────────────────────────────

  function handleGenerate() {
    if (!validate()) return;
    setIsGenerating(true);
    setGeneratedComplaint('');

    setTimeout(() => {
      const text = generateComplaintText({
        company:           company.trim(),
        product:           product.trim(),
        amount:            Number(amount),
        purchaseDate,
        category,
        description:       description.trim(),
        desiredResolution: desiredResolution.trim(),
      });
      setGeneratedComplaint(text);
      setIsGenerating(false);
    }, 1200);
  }

  // ── Copy ──────────────────────────────────────────────────────────────────

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(generatedComplaint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showNotification('error', 'Failed to copy to clipboard.');
    }
  }

  // ── Download ──────────────────────────────────────────────────────────────

  function handleDownload() {
    const blob = new Blob([generatedComplaint], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `nyaya-lens-complaint-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── Save to Cases ─────────────────────────────────────────────────────────

  function handleSave() {
    if (saved) return;
    addCase({
      title:             `${product.trim()} — ${company.trim()}`,
      company:           company.trim(),
      product:           product.trim(),
      amount:            Number(amount),
      purchaseDate,
      category:          category as ProblemCategory,
      description:       description.trim(),
      desiredResolution: desiredResolution.trim(),
      status:            'open',
      complaint:         generatedComplaint,
      notes:             '',
    });
    setSaved(true);
    showNotification('success', 'Case saved to My Cases!');
    setTimeout(() => setSaved(false), 3000);
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F8F7F3] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Breadcrumb */}
          <p className="text-xs font-inter text-[#172033]/50 mb-3 tracking-wide uppercase">
            NYAYA LENS &nbsp;/&nbsp; Complaint Generator
          </p>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#172033] flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-[#C9F56A]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-space font-bold text-[#172033] leading-tight">
                Complaint Generator
              </h1>
              <p className="text-sm text-[#172033]/60 font-inter mt-1 max-w-xl">
                Fill in the details below and Nyaya Lens will draft a legally grounded consumer
                complaint letter for you — ready to send in seconds.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Two-column Layout ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* ── LEFT: Form ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className={CARD_CLASS}
          >
            <h2 className="text-base font-space font-bold text-[#172033] mb-5">
              Your Complaint Details
            </h2>

            <div className="space-y-4">

              {/* Company */}
              <div>
                <Label required>Company / Seller Name</Label>
                <input
                  type="text"
                  placeholder="e.g. Amazon India, Flipkart, Swiggy…"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>

              {/* Product */}
              <div>
                <Label required>Product / Service Name</Label>
                <input
                  type="text"
                  placeholder="e.g. iPhone 15, OnePlus 12R, Prime Membership…"
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>

              {/* Amount + Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label required>Amount Paid (₹)</Label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 29999"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <Label required>Date of Purchase</Label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={e => setPurchaseDate(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <Label required>Problem Category</Label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ProblemCategory | '')}
                  className={INPUT_CLASS}
                >
                  <option value="">— Select a category —</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.emoji} &nbsp;{cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <Label required>Description of Grievance</Label>
                <textarea
                  rows={4}
                  placeholder="Describe what happened in detail — what was promised, what went wrong, when it happened, and what steps you already took…"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className={`${INPUT_CLASS} resize-none`}
                />
              </div>

              {/* Desired Resolution */}
              <div>
                <Label required>Desired Resolution</Label>
                <textarea
                  rows={2}
                  placeholder="e.g. Full refund of ₹29,999, product replacement, written apology…"
                  value={desiredResolution}
                  onChange={e => setDesiredResolution(e.target.value)}
                  className={`${INPUT_CLASS} resize-none`}
                />
              </div>

              {/* Validation errors */}
              {errors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-xs font-space font-semibold text-red-700">
                      Please fix the following:
                    </span>
                  </div>
                  {errors.map((err, i) => (
                    <p key={i} className="text-xs font-inter text-red-600 pl-6">
                      • {err}
                    </p>
                  ))}
                </motion.div>
              )}

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-[#172033] text-[#C9F56A] font-space font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1E2D45] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                      className="inline-block"
                    >
                      <Zap className="w-4 h-4" />
                    </motion.span>
                    Generating…
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate Complaint Letter
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* ── RIGHT: Output ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
          >
            {generatedComplaint ? (
              <div className={CARD_CLASS}>
                {/* Output header */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#C9F56A]" />
                    <h2 className="text-base font-space font-bold text-[#172033]">
                      Generated Complaint
                    </h2>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    {/* Copy */}
                    <button
                      onClick={handleCopy}
                      title="Copy to clipboard"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E8E6DF] bg-white hover:bg-[#F8F7F3] text-xs font-inter font-medium text-[#172033] transition-colors"
                    >
                      {copied
                        ? <Check className="w-3.5 h-3.5 text-green-600" />
                        : <Copy className="w-3.5 h-3.5" />
                      }
                      {copied ? 'Copied!' : 'Copy'}
                    </button>

                    {/* Download */}
                    <button
                      onClick={handleDownload}
                      title="Download as .txt"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E8E6DF] bg-white hover:bg-[#F8F7F3] text-xs font-inter font-medium text-[#172033] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>

                    {/* Save to Cases */}
                    <button
                      onClick={handleSave}
                      disabled={saved}
                      title="Save complaint as a case"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FF6B35] hover:bg-[#e55f2d] text-white text-xs font-inter font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {saved
                        ? <Check className="w-3.5 h-3.5" />
                        : <Save className="w-3.5 h-3.5" />
                      }
                      {saved ? 'Saved!' : 'Save to Cases'}
                    </button>
                  </div>
                </div>

                {/* Editable textarea */}
                <textarea
                  value={generatedComplaint}
                  onChange={e => setGeneratedComplaint(e.target.value)}
                  rows={24}
                  spellCheck={false}
                  className="w-full bg-[#F8F7F3] border border-[#E8E6DF] rounded-xl px-4 py-3 text-xs font-mono text-[#172033] leading-relaxed focus:outline-none focus:border-[#172033] transition-colors resize-none"
                />

                {/* Disclaimer */}
                <p className="mt-3 text-xs font-inter text-[#172033]/50 leading-relaxed">
                  ⚠️ &nbsp;This letter is AI-generated for guidance only. Fill in the fields
                  marked with brackets (e.g. <em>[Your Full Name]</em>) before sending. HAQMATE
                  is not a legal service provider.
                </p>
              </div>
            ) : (
              /* Empty state */
              <div className={`${CARD_CLASS} flex flex-col items-center justify-center text-center min-h-[420px]`}>
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="w-20 h-20 rounded-3xl bg-[#F8F7F3] border-2 border-dashed border-[#E8E6DF] flex items-center justify-center mb-5"
                >
                  <FileText className="w-9 h-9 text-[#172033]/25" />
                </motion.div>
                <h3 className="text-base font-space font-bold text-[#172033] mb-2">
                  Your complaint letter will appear here
                </h3>
                <p className="text-sm font-inter text-[#172033]/50 max-w-xs leading-relaxed">
                  Fill in the form on the left and click{' '}
                  <span className="font-semibold text-[#172033]">Generate Complaint Letter</span>{' '}
                  to create a professionally drafted, legally grounded complaint in seconds.
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-inter text-[#172033]/40">
                  <Zap className="w-3.5 h-3.5 text-[#C9F56A]" />
                  Powered by Nyaya Lens — free &amp; instant
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Tips Section ───────────────────────────────────────────────────── */}
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-space font-bold text-[#172033]/50 uppercase tracking-widest mb-4"
          >
            Pro Tips
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TIPS.map((tip, i) => (
              <motion.div
                key={tip.title}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="bg-white rounded-2xl border border-[#E8E6DF] p-5 shadow-sm flex gap-4"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{tip.icon}</span>
                <div>
                  <h3 className="text-sm font-space font-bold text-[#172033] mb-1">
                    {tip.title}
                  </h3>
                  <p className="text-xs font-inter text-[#172033]/60 leading-relaxed">
                    {tip.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
