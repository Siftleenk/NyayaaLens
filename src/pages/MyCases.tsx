import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Plus, Trash2, Edit3, ChevronDown, ChevronUp,
  Search, X, Save, AlertCircle, FileText, CheckCircle,
} from 'lucide-react';
import { useApp } from '../context';
import { formatCurrency, formatDate, statusColor } from '../utils';
import type { CaseStatus, ProblemCategory } from '../types';

// ─── Animation helpers ────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: EASE } },
};

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: CaseStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const CATEGORY_OPTIONS: { value: ProblemCategory; label: string }[] = [
  { value: 'defective-product', label: 'Defective Product' },
  { value: 'refund-dispute', label: 'Refund Dispute' },
  { value: 'misleading-ad', label: 'Misleading Advertisement' },
  { value: 'hidden-charges', label: 'Hidden Charges' },
  { value: 'warranty-dispute', label: 'Warranty Dispute' },
  { value: 'ecommerce', label: 'E-Commerce Problem' },
  { value: 'service-failure', label: 'Service Failure' },
  { value: 'other', label: 'Other' },
];

const INPUT = 'w-full bg-[#F8F7F3] border border-[#E8E6DF] rounded-lg px-3 py-2 text-sm text-[#172033] focus:outline-none focus:border-[#172033] transition-colors';
const LABEL = 'block text-xs font-semibold text-[#172033]/60 uppercase tracking-wide mb-1';

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

function DeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.22, ease: EASE }}
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-[#E8E6DF]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="font-bold text-[#172033] text-lg font-space">Delete Case?</h3>
        </div>
        <p className="text-sm text-[#172033]/60 mb-6 leading-relaxed">
          This will permanently delete the case and all associated complaint data. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-[#E8E6DF] text-[#172033] text-sm font-semibold rounded-xl py-2.5 hover:bg-[#F8F7F3] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white text-sm font-semibold rounded-xl py-2.5 hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MyCases() {
  const { cases, updateCase, deleteCase, showNotification } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | CaseStatus>('all');
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [editingCase, setEditingCase] = useState<string | null>(null);
  const [deletingCase, setDeletingCase] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string; company: string; product: string; amount: string;
    status: CaseStatus; category: ProblemCategory | ''; description: string;
    desiredResolution: string; notes: string;
  }>({
    title: '', company: '', product: '', amount: '', status: 'open',
    category: '', description: '', desiredResolution: '', notes: '',
  });
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  // ─── Derived state ──────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return cases.filter(c => {
      const matchesSearch = !q ||
        c.title.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.product.toLowerCase().includes(q);
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [cases, searchQuery, filterStatus]);

  const stats = useMemo(() => ({
    total: cases.length,
    active: cases.filter(c => c.status === 'open' || c.status === 'in-progress').length,
    resolved: cases.filter(c => c.status === 'resolved' || c.status === 'closed').length,
  }), [cases]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function startEdit(caseId: string) {
    const c = cases.find(x => x.id === caseId);
    if (!c) return;
    setEditForm({
      title: c.title, company: c.company, product: c.product,
      amount: String(c.amount), status: c.status, category: c.category,
      description: c.description, desiredResolution: c.desiredResolution,
      notes: c.notes,
    });
    setEditingCase(caseId);
    setExpandedCase(caseId);
  }

  function saveEdit() {
    if (!editingCase) return;
    updateCase(editingCase, {
      title: editForm.title,
      company: editForm.company,
      product: editForm.product,
      amount: parseFloat(editForm.amount) || 0,
      status: editForm.status,
      category: editForm.category as ProblemCategory,
      description: editForm.description,
      desiredResolution: editForm.desiredResolution,
      notes: editForm.notes,
    });
    setEditingCase(null);
    showNotification('success', 'Case updated successfully!');
  }

  function cancelEdit() {
    setEditingCase(null);
  }

  function confirmDelete() {
    if (!deletingCase) return;
    deleteCase(deletingCase);
    setDeletingCase(null);
    setExpandedCase(null);
    setEditingCase(null);
    showNotification('success', 'Case deleted.');
  }

  function handleStatusChange(id: string, status: CaseStatus) {
    updateCase(id, { status });
    showNotification('success', `Status updated to "${status}".`);
  }

  function saveNotes(id: string) {
    const notes = notesDraft[id] ?? cases.find(c => c.id === id)?.notes ?? '';
    updateCase(id, { notes });
    showNotification('success', 'Notes saved!');
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full bg-[#F8F7F3] p-6 lg:p-8 pt-14 lg:pt-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex items-start justify-between mb-8 gap-4 flex-wrap"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[#172033] flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-[#C9F56A]" />
              </div>
              <h1 className="text-3xl font-extrabold text-[#172033] font-space tracking-tight">My Cases</h1>
            </div>
            <p className="text-[#172033]/50 text-sm pl-[52px]">Track and manage all your consumer disputes</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/complaint-generator')}
            className="flex items-center gap-2 bg-[#172033] text-[#C9F56A] font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#1E2D45] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Complaint
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.38, ease: EASE }}
          className="flex gap-3 mb-6 flex-wrap"
        >
          {[
            { label: 'Total Cases', value: stats.total, color: 'bg-[#172033]/8 text-[#172033]' },
            { label: 'Active', value: stats.active, color: 'bg-amber-50 text-amber-700 border border-amber-200' },
            { label: 'Resolved', value: stats.resolved, color: 'bg-green-50 text-green-700 border border-green-200' },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${s.color}`}>
              <span className="text-lg font-bold">{s.value}</span>
              <span className="font-medium opacity-80">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.38, ease: EASE }}
          className="mb-6 space-y-3"
        >
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#172033]/40" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search cases by company, product, or title…"
              className="w-full bg-white border border-[#E8E6DF] rounded-xl pl-10 pr-10 py-3 text-sm text-[#172033] focus:outline-none focus:border-[#172033] transition-colors shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#172033]/30 hover:text-[#172033]/60"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status filter pills */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'open', 'in-progress', 'resolved', 'closed'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                  filterStatus === s
                    ? 'bg-[#172033] text-white'
                    : 'bg-white border border-[#E8E6DF] text-[#172033]/60 hover:text-[#172033] hover:border-[#172033]/30'
                }`}
              >
                {s === 'all' ? 'All' : s.replace('-', ' ')}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cases list */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            {cases.length === 0 ? (
              <>
                <div className="w-16 h-16 bg-[#172033]/6 rounded-2xl flex items-center justify-center mb-4">
                  <Briefcase className="w-8 h-8 text-[#172033]/30" />
                </div>
                <h3 className="font-bold text-[#172033] text-lg font-space mb-2">No cases yet</h3>
                <p className="text-[#172033]/50 text-sm mb-6 max-w-xs">
                  Start by generating a complaint. Your cases will appear here.
                </p>
                <button
                  onClick={() => navigate('/complaint-generator')}
                  className="flex items-center gap-2 bg-[#172033] text-[#C9F56A] text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1E2D45] transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Generate a Complaint
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-[#172033]/6 rounded-2xl flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-[#172033]/30" />
                </div>
                <h3 className="font-bold text-[#172033] text-lg font-space mb-2">No cases match</h3>
                <p className="text-[#172033]/50 text-sm mb-4">Try adjusting your search or filter.</p>
                <button
                  onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
                  className="text-[#172033] border border-[#E8E6DF] text-sm font-medium px-4 py-2 rounded-lg hover:bg-white transition-colors"
                >
                  Clear Filters
                </button>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {filtered.map(c => {
              const isExpanded = expandedCase === c.id;
              const isEditing = editingCase === c.id;

              return (
                <motion.div
                  key={c.id}
                  variants={itemVariants}
                  layout
                  className="bg-white border border-[#E8E6DF] rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Case header row */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-[#172033] text-sm font-space truncate">{c.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${statusColor(c.status)}`}>
                            {c.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#172033]/50 flex-wrap">
                          <span>{c.company}</span>
                          <span>·</span>
                          <span>{c.product}</span>
                          <span>·</span>
                          <span className="font-semibold text-[#172033]/70">{formatCurrency(c.amount)}</span>
                          <span>·</span>
                          <span>{formatDate(c.purchaseDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => startEdit(c.id)}
                          className="p-2 rounded-lg text-[#172033]/40 hover:text-[#172033] hover:bg-[#F8F7F3] transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCase(c.id)}
                          className="p-2 rounded-lg text-[#172033]/40 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setExpandedCase(isExpanded ? null : c.id)}
                          className="p-2 rounded-lg text-[#172033]/40 hover:text-[#172033] hover:bg-[#F8F7F3] transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded / Edit content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="expanded"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-[#E8E6DF] p-5 space-y-4">
                          {isEditing ? (
                            /* ── EDIT MODE ── */
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-[#172033]/50 uppercase tracking-wide mb-3">Edit Case</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className={LABEL}>Title</label>
                                  <input className={INPUT} value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} />
                                </div>
                                <div>
                                  <label className={LABEL}>Company</label>
                                  <input className={INPUT} value={editForm.company} onChange={e => setEditForm(p => ({ ...p, company: e.target.value }))} />
                                </div>
                                <div>
                                  <label className={LABEL}>Product</label>
                                  <input className={INPUT} value={editForm.product} onChange={e => setEditForm(p => ({ ...p, product: e.target.value }))} />
                                </div>
                                <div>
                                  <label className={LABEL}>Amount (₹)</label>
                                  <input className={INPUT} type="number" value={editForm.amount} onChange={e => setEditForm(p => ({ ...p, amount: e.target.value }))} />
                                </div>
                                <div>
                                  <label className={LABEL}>Status</label>
                                  <select className={INPUT} value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value as CaseStatus }))}>
                                    {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label className={LABEL}>Category</label>
                                  <select className={INPUT} value={editForm.category} onChange={e => setEditForm(p => ({ ...p, category: e.target.value as ProblemCategory }))}>
                                    {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                  </select>
                                </div>
                              </div>
                              <div>
                                <label className={LABEL}>Description</label>
                                <textarea className={`${INPUT} min-h-[80px] resize-none`} value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} />
                              </div>
                              <div>
                                <label className={LABEL}>Desired Resolution</label>
                                <textarea className={`${INPUT} min-h-[60px] resize-none`} value={editForm.desiredResolution} onChange={e => setEditForm(p => ({ ...p, desiredResolution: e.target.value }))} />
                              </div>
                              <div>
                                <label className={LABEL}>Notes</label>
                                <textarea className={`${INPUT} min-h-[60px] resize-none`} value={editForm.notes} onChange={e => setEditForm(p => ({ ...p, notes: e.target.value }))} />
                              </div>
                              <div className="flex gap-2 pt-1">
                                <button onClick={saveEdit} className="flex items-center gap-1.5 bg-[#172033] text-[#C9F56A] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1E2D45] transition-colors">
                                  <Save className="w-3.5 h-3.5" /> Save Changes
                                </button>
                                <button onClick={cancelEdit} className="text-sm text-[#172033]/60 border border-[#E8E6DF] px-4 py-2 rounded-lg hover:bg-[#F8F7F3] transition-colors">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* ── VIEW MODE ── */
                            <div className="space-y-4">
                              {/* Description */}
                              <div>
                                <p className={LABEL}>Problem Description</p>
                                <p className="text-sm text-[#172033]/80 leading-relaxed">{c.description || '—'}</p>
                              </div>

                              {/* Desired resolution */}
                              <div>
                                <p className={LABEL}>Desired Resolution</p>
                                <p className="text-sm text-[#172033]/80 leading-relaxed">{c.desiredResolution || '—'}</p>
                              </div>

                              {/* Status changer */}
                              <div className="flex items-center gap-3">
                                <p className={`${LABEL} mb-0`}>Status</p>
                                <select
                                  value={c.status}
                                  onChange={e => handleStatusChange(c.id, e.target.value as CaseStatus)}
                                  className="text-xs border border-[#E8E6DF] rounded-lg px-3 py-1.5 bg-white text-[#172033] focus:outline-none focus:border-[#172033] cursor-pointer"
                                >
                                  {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                              </div>

                              {/* Complaint preview */}
                              {c.complaint && (
                                <div>
                                  <p className={LABEL}>Complaint Preview</p>
                                  <div className="bg-[#F8F7F3] rounded-lg p-3 text-xs text-[#172033]/70 font-mono leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
                                    {c.complaint.slice(0, 300)}{c.complaint.length > 300 ? '…' : ''}
                                  </div>
                                </div>
                              )}

                              {/* Notes */}
                              <div>
                                <p className={LABEL}>Notes</p>
                                <textarea
                                  value={notesDraft[c.id] ?? c.notes}
                                  onChange={e => setNotesDraft(p => ({ ...p, [c.id]: e.target.value }))}
                                  placeholder="Add personal notes, tracking info, or reminders…"
                                  className="w-full bg-[#F8F7F3] border border-[#E8E6DF] rounded-lg px-3 py-2 text-sm text-[#172033] focus:outline-none focus:border-[#172033] transition-colors resize-none min-h-[70px]"
                                />
                                <button
                                  onClick={() => saveNotes(c.id)}
                                  className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#172033] border border-[#E8E6DF] px-3 py-1.5 rounded-lg hover:bg-[#F8F7F3] transition-colors"
                                >
                                  <CheckCircle className="w-3 h-3" /> Save Notes
                                </button>
                              </div>

                              {/* Updated at */}
                              <p className="text-xs text-[#172033]/30">Last updated {formatDate(c.updatedAt)}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deletingCase && (
          <DeleteModal
            onConfirm={confirmDelete}
            onCancel={() => setDeletingCase(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
