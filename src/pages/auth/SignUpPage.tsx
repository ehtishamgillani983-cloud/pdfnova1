import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, FileText, Shield } from 'lucide-react';
import { dbService } from '../../services/supabaseClient';
import { SEOHead } from '../../components/seo/SEOHead';

interface SignUpPageProps {
  onNavigate: (path: string) => void;
  onLoginSuccess?: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setConfirmationNotice(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await dbService.signUpUser(email, password, fullName);
      if (!res.success) {
        setError(res.error || 'Failed to create account. Please try again.');
        setLoading(false);
        return;
      }

      if (res.needsEmailConfirmation) {
        setLoading(false);
        setConfirmationNotice(
          `Account created for ${email}! Please check your email to confirm your account, then sign in.`
        );
        return;
      }

      if (onLoginSuccess) {
        onLoginSuccess();
      }
      onNavigate('/account');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <SEOHead
        title="Create Free Account | PDFNova Document Suite"
        description="Sign up for free to access high-speed PDF converters, OCR, and AI document tools on PDFNova."
        canonicalPath="/signup"
        noIndex={true}
      />

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 mb-4">
            <FileText className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Free Account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Join thousands of users converting and processing PDFs safely
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80 sm:px-10">
          {confirmationNotice ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Account Created!</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {confirmationNotice}
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  Proceed to Sign In
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Create Free Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                Sign In
              </button>
            </p>
          </div>
            </>
          )}
        </div>

        <div className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Your privacy is protected. Files are automatically purged.</span>
        </div>
      </div>
    </div>
  );
};
