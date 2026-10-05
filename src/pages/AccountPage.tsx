import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Key, 
  LogOut, 
  FileText, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Shield,
  Layers
} from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { dbService } from '../services/supabaseClient';
import { UserProfile } from '../types';

interface AccountPageProps {
  onNavigate: (path: string) => void;
  onLogout?: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate, onLogout }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    const currentUser = await dbService.getCurrentUser();
    if (!currentUser) {
      // Redirect unauthenticated visitor to /login
      onNavigate('/login');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await dbService.signOutUser();
    if (onLogout) {
      onLogout();
    }
    onNavigate('/login');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('Passwords do not match.');
      return;
    }

    setPassLoading(true);
    try {
      const res = await dbService.changeUserPassword(newPassword);
      if (!res.success) {
        setPassError(res.error || 'Failed to update password.');
      } else {
        setPassSuccess('Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setPassError(err.message || 'An error occurred.');
    } finally {
      setPassLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-6">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Active';

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SEOHead
        title="My Account | PDFNova"
        description="Manage your PDFNova account, credentials, and settings."
        canonicalPath="/account"
        noIndex={true}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'My Account' }]} onNavigate={onNavigate} />

        <div className="space-y-6 my-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-blue-500/20">
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {user.name || user.full_name || 'My Account'}
                </h1>
                <p className="text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {user.email}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                    UID: {user.id.substring(0, 16)}...
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
                    <Shield className="w-3 h-3" />
                    Verified User
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-sm font-semibold transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Account Details & Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
              <div className="flex items-center gap-3 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Member Since
              </div>
              <p className="text-lg font-bold text-slate-900">{formattedDate}</p>
              <p className="text-xs text-slate-500 mt-1">Full access to all PDF & AI tools</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
              <div className="flex items-center gap-3 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Plan Status
              </div>
              <p className="text-lg font-bold text-emerald-700">100% Free & Unlimited</p>
              <p className="text-xs text-slate-500 mt-1">No subscriptions, no card required</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
              <div className="flex items-center gap-3 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Max File Upload
              </div>
              <p className="text-lg font-bold text-slate-900">100 MB per file</p>
              <p className="text-xs text-slate-500 mt-1">Up to 20 files per batch conversion</p>
            </div>
          </div>

          {/* Security & Password Management */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Security & Password</h2>
                <p className="text-xs text-slate-500">Update your account password securely</p>
              </div>
            </div>

            {passSuccess && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-sm text-emerald-800 font-medium">{passSuccess}</p>
              </div>
            )}

            {passError && (
              <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <p className="text-sm text-red-700 font-medium">{passError}</p>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                disabled={passLoading}
                className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition flex items-center gap-2 disabled:opacity-50"
              >
                {passLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Quick PDF Tools Launcher */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-md shadow-blue-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold">Ready to process documents?</h3>
              <p className="text-blue-100 text-sm mt-1 max-w-lg">
                Explore our full suite of free PDF tools including Word conversion, compression, merging, neural OCR, and AI document chat.
              </p>
            </div>
            <a
              href="/tools"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/tools');
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow hover:bg-blue-50 transition shrink-0"
            >
              Browse All Tools
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
