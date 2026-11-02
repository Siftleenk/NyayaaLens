import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Easing } from 'framer-motion';
import { Scale, Mail, Lock, User, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } from '../lib/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthMode = 'login' | 'signup' | 'reset';

// ─── Animation ────────────────────────────────────────────────────────────────

const EASE: Easing = 'easeOut';

const panelVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.25, ease: EASE } },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function friendlyError(code: string): string {
  const map: Record<string, string> = {
    'auth/invalid-credential':         'Incorrect email or password.',
    'auth/user-not-found':             'No account found with that email.',
    'auth/wrong-password':             'Incorrect password.',
    'auth/email-already-in-use':       'An account with this email already exists.',
    'auth/weak-password':              'Password must be at least 6 characters.',
    'auth/invalid-email':              'Please enter a valid email address.',
    'auth/too-many-requests':          'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user':       'Google sign-in was cancelled.',
    'auth/network-request-failed':     'Network error. Check your connection.',
  };
  return map[code] ?? 'Something went wrong. Please try again.';
}

const INPUT = `w-full bg-white border border-[#E8E6DF] rounded-xl px-4 py-3 text-sm
  text-[#172033] focus:outline-none focus:border-[#172033] transition-colors`;

// ─── Google Button ────────────────────────────────────────────────────────────

function GoogleButton({ onSuccess, onError }: {
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? '';
      onError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handle}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 bg-white border border-[#E8E6DF]
        rounded-xl px-4 py-3 text-sm font-semibold text-[#172033] shadow-sm
        hover:shadow-md hover:border-[#172033]/30 transition-all disabled:opacity-60"
    >
      {/* Google SVG icon */}
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      {loading ? 'Signing in…' : 'Continue with Google'}
    </motion.button>
  );
}

// ─── Main AuthPage ─────────────────────────────────────────────────────────────

export default function AuthPage() {
  const [mode, setMode]         = useState<AuthMode>('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);

  function clearMessages() { setError(''); setSuccess(''); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        // Auth state change handled by context
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
      } else {
        await resetPassword(email);
        setSuccess('Password reset email sent! Check your inbox.');
      }
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? '';
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  }

  const titles: Record<AuthMode, string> = {
    login:  'Welcome back',
    signup: 'Create your account',
    reset:  'Reset your password',
  };
  const subtitles: Record<AuthMode, string> = {
    login:  'Sign in to access your Nyaya Lens dashboard',
    signup: 'Join Nyaya Lens — your consumer protection companion',
    reset:  "Enter your email and we'll send a reset link",
  };

  return (
    <div className="min-h-screen bg-[#F8F7F3] flex flex-col">

      {/* ── Top bar ── */}
      <header className="flex items-center gap-2.5 px-6 py-5">
        <div className="w-8 h-8 bg-[#172033] rounded-lg flex items-center justify-center">
          <Scale className="w-4 h-4 text-[#C9F56A]" />
        </div>
        <span className="font-space font-bold text-[#172033] text-lg tracking-tight">Nyaya Lens</span>
      </header>

      {/* ── Centre card ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white rounded-3xl border border-[#E8E6DF] shadow-sm p-8">

            {/* Mode header */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mb-7"
              >
                <h1 className="text-2xl font-extrabold text-[#172033] font-space tracking-tight mb-1">
                  {titles[mode]}
                </h1>
                <p className="text-sm text-[#172033]/55 leading-relaxed">{subtitles[mode]}</p>
              </motion.div>
            </AnimatePresence>

            {/* Google sign-in — only on login + signup */}
            {mode !== 'reset' && (
              <>
                <GoogleButton
                  onSuccess={() => {}} // context handles redirect
                  onError={setError}
                />

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-[#E8E6DF]" />
                  <span className="text-xs text-[#172033]/40 font-medium">or continue with email</span>
                  <div className="flex-1 h-px bg-[#E8E6DF]" />
                </div>
              </>
            )}

            {/* Error / Success banners */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700 leading-snug">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4"
                >
                  <p className="text-sm text-green-700 leading-snug">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">

              {/* Name field — signup only */}
              <AnimatePresence>
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#172033]/35" />
                      <input
                        type="text"
                        placeholder="Full name"
                        required={mode === 'signup'}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={`${INPUT} pl-10`}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#172033]/35" />
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={e => { setEmail(e.target.value); clearMessages(); }}
                  className={`${INPUT} pl-10`}
                />
              </div>

              {/* Password — not on reset mode */}
              <AnimatePresence>
                {mode !== 'reset' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="relative"
                  >
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#172033]/35" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      placeholder={mode === 'signup' ? 'Password (min 6 chars)' : 'Password'}
                      required
                      value={password}
                      onChange={e => { setPassword(e.target.value); clearMessages(); }}
                      className={`${INPUT} pl-10 pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(p => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#172033]/35 hover:text-[#172033]/60"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Forgot password link */}
              {mode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { setMode('reset'); clearMessages(); }}
                    className="text-xs text-[#172033]/50 hover:text-[#172033] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[#172033] text-[#C9F56A] font-space font-semibold
                  py-3 px-6 rounded-xl flex items-center justify-center gap-2
                  hover:bg-[#1E2D45] transition-colors mt-1 disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                    {mode === 'login' ? 'Signing in…' : mode === 'signup' ? 'Creating account…' : 'Sending…'}
                  </span>
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Mode switcher */}
            <div className="mt-6 text-center text-sm text-[#172033]/50">
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => { setMode('signup'); clearMessages(); }}
                    className="font-semibold text-[#172033] hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => { setMode('login'); clearMessages(); }}
                    className="font-semibold text-[#172033] hover:underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMode('login'); clearMessages(); }}
                  className="font-semibold text-[#172033] hover:underline"
                >
                  ← Back to sign in
                </button>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-[#172033]/35 mt-5 leading-relaxed px-4">
            By continuing, you agree that Nyaya Lens is an informational platform.
            Always consult a qualified legal professional for specific legal advice.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
