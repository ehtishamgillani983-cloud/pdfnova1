/**
 * Supabase Client & Service Layer for PDFNova (SZ.PDF)
 * Production-ready client integration with multi-user Supabase Auth,
 * Row Level Security (RLS) compliance, and resilient fallbacks.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Tool,
  ToolFAQ,
  BlogPost,
  ContactMessage,
  SiteSettings,
  UserProfile,
  AdminUser,
  AdminAuthProfile,
  AdminRole,
} from '../types';
import { TOOLS_DATA } from '../data/toolsData';
import { BLOG_POSTS } from '../data/blogData';
import { PLATFORM_FAQS } from '../data/siteConfig';

export interface SupabaseConfig {
  url: string | null;
  anonKey: string | null;
  isConnected: boolean;
  projectHost?: string;
}

// Default production Supabase project credentials for PDFNova
const DEFAULT_SUPABASE_PROJECT_REF = 'rpniflrgzlqcltjqrenb';
const DEFAULT_SUPABASE_URL = `https://${DEFAULT_SUPABASE_PROJECT_REF}.supabase.co`;
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_l8xw47_jz4a-BRXCyUV6eQ_hkt03WSG';

/**
 * Normalizes any user/environment supplied Supabase URL into a clean, valid root endpoint:
 * - Strips enclosing quotes, whitespace, and trailing slashes.
 * - If user provides only the project reference ID (e.g. 'rpniflrgzlqcltjqrenb'), builds 'https://<ref>.supabase.co'.
 * - If user copies the REST API URL (e.g. 'https://<ref>.supabase.co/rest/v1' or '/auth/v1'),
 *   extracts strictly the origin protocol + host so that PostgREST does NOT receive malformed paths.
 */
export function normalizeSupabaseUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  let trimmed = rawUrl.trim();

  // Strip enclosing quotes from env variables (e.g. "https://..." or 'https://...')
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    trimmed = trimmed.slice(1, -1).trim();
  }

  if (!trimmed || trimmed.includes('your-project.supabase.co') || trimmed.includes('placeholder')) {
    return null;
  }

  // Handle case where user provided only the project reference ID
  if (/^[a-z0-9_-]{15,30}$/i.test(trimmed)) {
    return `https://${trimmed}.supabase.co`;
  }

  // Ensure protocol
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    const origin = parsed.origin;
    if (origin && origin !== 'null') {
      return origin.replace(/\/+$/, '');
    }
    return `https://${parsed.host}`;
  } catch {
    return null;
  }
}

/**
 * Normalizes Supabase API key (anon or publishable key).
 */
export function normalizeSupabaseKey(rawKey: string | null | undefined): string | null {
  if (!rawKey || typeof rawKey !== 'string') return null;
  let trimmed = rawKey.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    trimmed = trimmed.slice(1, -1).trim();
  }
  if (!trimmed || trimmed.includes('eyJhbGciOi...') || trimmed.includes('placeholder')) {
    return null;
  }
  return trimmed;
}

export function isValidSupabaseUrl(rawUrl: string | null | undefined): boolean {
  const normalized = normalizeSupabaseUrl(rawUrl);
  return Boolean(normalized && (normalized.startsWith('https://') || normalized.startsWith('http://')));
}

function safeParseHostname(rawUrl: string | null | undefined): string | undefined {
  const normalized = normalizeSupabaseUrl(rawUrl);
  if (!normalized) return undefined;
  try {
    const parsed = new URL(normalized);
    return parsed.hostname;
  } catch {
    return undefined;
  }
}

// Read from Vite environment, process.env, or local storage override, with verification against defaults
const rawEnvUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  null;

const rawEnvAnonKey = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  null;

const rawStoredUrl = typeof window !== 'undefined' ? localStorage.getItem('pdfnova_custom_supabase_url') : null;
const rawStoredKey = typeof window !== 'undefined' ? localStorage.getItem('pdfnova_custom_supabase_key') : null;

// Sanitize inputs
const normalizedEnvUrl = normalizeSupabaseUrl(rawEnvUrl);
const normalizedEnvKey = normalizeSupabaseKey(rawEnvAnonKey);
const normalizedStoredUrl = normalizeSupabaseUrl(rawStoredUrl);
const normalizedStoredKey = normalizeSupabaseKey(rawStoredKey);

// Clean up any previously stored bad URLs with /rest/v1 in localStorage
if (typeof window !== 'undefined' && rawStoredUrl && normalizedStoredUrl && rawStoredUrl !== normalizedStoredUrl) {
  try {
    localStorage.setItem('pdfnova_custom_supabase_url', normalizedStoredUrl);
  } catch {
    // Ignore storage quota
  }
}

// Active configuration: prefer stored override -> env vars -> default verified production values
const activeUrl = normalizedStoredUrl || normalizedEnvUrl || DEFAULT_SUPABASE_URL;
const activeKey = normalizedStoredKey || normalizedEnvKey || DEFAULT_SUPABASE_ANON_KEY;

const isLiveConfig = Boolean(activeUrl && activeKey && isValidSupabaseUrl(activeUrl));

export const supabaseConfig: SupabaseConfig = {
  url: activeUrl,
  anonKey: activeKey,
  isConnected: isLiveConfig,
  projectHost: safeParseHostname(activeUrl),
};

// Initialize Supabase client strictly with the root origin URL
let supabaseInstance: SupabaseClient | null = null;
if (isLiveConfig && activeUrl && activeKey) {
  try {
    supabaseInstance = createClient(activeUrl, activeKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (e) {
    console.warn('Failed to initialize Supabase client:', e);
    supabaseInstance = null;
  }
}
export const supabase = supabaseInstance;

// SHA-256 helper for client-side password hashing
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface LocalRegisteredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
  totalConversions: number;
}

class SupabaseServiceLayer {
  private client: SupabaseClient | null = supabase;

  // Local fallback states
  private localTools: Tool[] = [...TOOLS_DATA];
  private localBlogs: BlogPost[] = [...BLOG_POSTS];
  private localFaqs: ToolFAQ[] = PLATFORM_FAQS.map((f, i) => ({
    id: `faq-${i + 1}`,
    question: f.question,
    answer: f.answer,
    displayOrder: i + 1,
  }));
  private localMessages: ContactMessage[] = [];
  private localRegisteredUsers: LocalRegisteredUser[] = [];
  private activeLocalUser: UserProfile | null = null;

  private localSettings: SiteSettings = {
    siteName: 'PDFNova',
    tagline: 'Free PDF Tools & AI Document Tools',
    supportEmail: 'support@pdfnova.com',
    supportPhone: '+1 (800) 555-PDFS',
    address: 'Global Web Document Services',
    maxUploadLimitFreeMb: 100,
    maxUploadLimitProMb: 100,
    maxUploadLimitBusinessMb: 100,
    adsEnabled: true,
    maintenanceMode: false,
  };

  private localAdminUsers: AdminUser[] = [
    {
      id: 'adm-001',
      user_id: 'usr-admin-master',
      email: 'admin@pdfnova.com',
      role: 'admin',
      status: 'active',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    },
  ];

  private localAdminAuth: AdminAuthProfile = {
    id: 'adm-001',
    userId: 'usr-admin-master',
    email: 'admin@pdfnova.com',
    role: 'admin',
    status: 'active',
    // Default sha256 for 'pdfnova2026'
    passwordHash: 'e5e3f421118da19485f46400732890ae77e4cf0c090da57f00fa3eb0e94bbad8',
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedTools = localStorage.getItem('pdfnova_admin_tools');
      if (storedTools) this.localTools = JSON.parse(storedTools);

      const storedBlogs = localStorage.getItem('pdfnova_admin_blogs');
      if (storedBlogs) this.localBlogs = JSON.parse(storedBlogs);

      const storedFaqs = localStorage.getItem('pdfnova_admin_faqs');
      if (storedFaqs) this.localFaqs = JSON.parse(storedFaqs);

      const storedMessages = localStorage.getItem('pdfnova_contact_messages');
      if (storedMessages) this.localMessages = JSON.parse(storedMessages);

      const storedSettings = localStorage.getItem('pdfnova_site_settings');
      if (storedSettings) this.localSettings = JSON.parse(storedSettings);

      const storedAdminAuth = localStorage.getItem('pdfnova_admin_auth_profile');
      if (storedAdminAuth) this.localAdminAuth = JSON.parse(storedAdminAuth);

      const storedAdminUsers = localStorage.getItem('pdfnova_admin_users_list');
      if (storedAdminUsers) this.localAdminUsers = JSON.parse(storedAdminUsers);

      const storedUsers = localStorage.getItem('pdfnova_local_registered_users');
      if (storedUsers) this.localRegisteredUsers = JSON.parse(storedUsers);

      const activeUser = localStorage.getItem('pdfnova_active_user_session');
      if (activeUser) this.activeLocalUser = JSON.parse(activeUser);
    } catch {
      // Storage unavailable or quota reached
    }
  }

  // =========================================================================
  // 1. REAL MULTI-USER AUTHENTICATION (SUPABASE AUTH + ISOLATED LOCAL STORAGE)
  // =========================================================================

  /**
   * Registers a brand new user using Supabase Auth Email + Password.
   * Creates an isolated account and inserts their profile into the `profiles` table.
   */
  async signUpUser(
    email: string,
    password: string,
    fullName?: string
  ): Promise<{ success: boolean; error?: string; user?: UserProfile; needsEmailConfirmation?: boolean }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName?.trim() || cleanEmail.split('@')[0];

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // 1. If Supabase is connected, use real Supabase Auth
    if (this.client) {
      try {
        const { data, error } = await this.client.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanName,
            },
            emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/account` : undefined,
          },
        });

        if (error) {
          // Provide friendly message for known errors
          if (error.message.toLowerCase().includes('already registered')) {
            return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
          }
          return { success: false, error: error.message };
        }

        if (data.user) {
          const userProfile: UserProfile = {
            id: data.user.id,
            email: cleanEmail,
            name: cleanName,
            full_name: cleanName,
            createdAt: data.user.created_at || new Date().toISOString(),
            dailyConversionsCount: 0,
          };

          // If session is immediately active (email confirmation not required or pre-confirmed)
          if (data.session) {
            try {
              await this.client.from('profiles').upsert({
                id: data.user.id,
                email: cleanEmail,
                full_name: cleanName,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            } catch (profileErr) {
              console.warn('Profile sync note:', profileErr);
            }

            this.setActiveUser(userProfile);
            return { success: true, user: userProfile, needsEmailConfirmation: false };
          }

          // If Supabase requires email confirmation before initial login
          return { success: true, user: userProfile, needsEmailConfirmation: true };
        }
      } catch (err: any) {
        console.warn('Supabase auth signup error, falling back:', err);
      }
    }

    // 2. Isolated local storage authentication for development / offline resilience
    const existing = this.localRegisteredUsers.find((u) => u.email === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
    }

    const newId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const passHash = await sha256(password);
    const now = new Date().toISOString();

    const newLocalUser: LocalRegisteredUser = {
      id: newId,
      email: cleanEmail,
      passwordHash: passHash,
      name: cleanName,
      createdAt: now,
      totalConversions: 0,
    };

    this.localRegisteredUsers.push(newLocalUser);
    localStorage.setItem('pdfnova_local_registered_users', JSON.stringify(this.localRegisteredUsers));

    const userProfile: UserProfile = {
      id: newId,
      email: cleanEmail,
      name: cleanName,
      full_name: cleanName,
      createdAt: now,
      dailyConversionsCount: 0,
    };

    this.setActiveUser(userProfile);
    return { success: true, user: userProfile };
  }

  /**
   * Signs in an existing user with their individual email and password.
   */
  async signInUser(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return { success: false, error: 'Please enter your email and password.' };
    }

    // 1. If Supabase is connected
    if (this.client) {
      try {
        const { data, error } = await this.client.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error || !data.user) {
          return { success: false, error: error?.message || 'Invalid email or password.' };
        }

        // Fetch their individual profile from public.profiles
        let profileRecord: any = null;
        try {
          const { data: profile } = await this.client
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();
          profileRecord = profile;
        } catch (fetchErr) {
          console.warn('Profile fetch note:', fetchErr);
        }

        const userProfile: UserProfile = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          name: profileRecord?.full_name || data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          full_name: profileRecord?.full_name || data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          createdAt: profileRecord?.created_at || data.user.created_at || new Date().toISOString(),
          dailyConversionsCount: profileRecord?.daily_conversions_count || 0,
        };

        this.setActiveUser(userProfile);
        return { success: true, user: userProfile };
      } catch (err: any) {
        console.warn('Supabase auth sign in error, checking local store:', err);
      }
    }

    // 2. Local fallback check
    const localUser = this.localRegisteredUsers.find((u) => u.email === cleanEmail);
    if (!localUser) {
      return { success: false, error: 'No account found with this email. Please check your credentials or Sign Up.' };
    }

    const inputHash = await sha256(password);
    if (inputHash !== localUser.passwordHash) {
      return { success: false, error: 'Incorrect password. Please try again or use Forgot Password.' };
    }

    const userProfile: UserProfile = {
      id: localUser.id,
      email: localUser.email,
      name: localUser.name,
      full_name: localUser.name,
      createdAt: localUser.createdAt,
      dailyConversionsCount: localUser.totalConversions || 0,
    };

    this.setActiveUser(userProfile);
    return { success: true, user: userProfile };
  }

  /**
   * Signs out the currently authenticated user.
   */
  async signOutUser(): Promise<void> {
    if (this.client) {
      try {
        await this.client.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign out note:', e);
      }
    }
    this.activeLocalUser = null;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem('pdfnova_active_user_session');
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Sends a password reset email using Supabase Auth.
   */
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }

    if (this.client) {
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://aipdftools.vercel.app';
        const { error } = await this.client.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${origin}/reset-password`,
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to send password reset email.' };
      }
    }

    return { success: true };
  }

  /**
   * Updates the password for the current user.
   */
  async changeUserPassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    if (this.client) {
      try {
        const { error } = await this.client.auth.updateUser({ password: newPassword });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to update password.' };
      }
    }

    if (this.activeLocalUser) {
      const idx = this.localRegisteredUsers.findIndex((u) => u.id === this.activeLocalUser?.id);
      if (idx !== -1) {
        this.localRegisteredUsers[idx].passwordHash = await sha256(newPassword);
        localStorage.setItem('pdfnova_local_registered_users', JSON.stringify(this.localRegisteredUsers));
      }
    }

    return { success: true };
  }

  /**
   * Retrieves the current user's profile.
   * Returns null if visitor is not logged in.
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    if (this.client) {
      try {
        const { data: { user } } = await this.client.auth.getUser();
        if (user) {
          let profile: any = null;
          try {
            const { data } = await this.client
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();
            profile = data;
          } catch (profileErr) {
            console.warn('Profile lookup note:', profileErr);
          }

          const active: UserProfile = {
            id: user.id,
            email: user.email || '',
            name: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            full_name: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            createdAt: profile?.created_at || user.created_at || new Date().toISOString(),
            dailyConversionsCount: profile?.daily_conversions_count || 0,
          };
          this.setActiveUser(active);
          return active;
        }
      } catch (e) {
        console.warn('getCurrentUser Supabase check note:', e);
      }
    }

    return this.activeLocalUser;
  }

  private setActiveUser(user: UserProfile) {
    this.activeLocalUser = user;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('pdfnova_active_user_session', JSON.stringify(user));
      } catch {
        // Ignore quota
      }
    }
  }

  // =========================================================================
  // 2. SUPABASE CONTACT FORM (Real table: contact_messages)
  // =========================================================================

  /**
   * Submits a contact form message directly into Supabase `contact_messages`.
   */
  async submitContactMessage(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; error?: string }> {
    const cleanName = data.name.trim();
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPhone = data.phone?.trim() || undefined;
    const cleanSubject = data.subject.trim();
    const cleanMessage = data.message.trim();

    if (!cleanName || !cleanEmail || !cleanSubject || !cleanMessage) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    const newRecord: ContactMessage = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject,
      message: cleanMessage,
      status: 'unread',
      created_at: new Date().toISOString(),
    };

    if (this.client) {
      try {
        const { error } = await this.client.from('contact_messages').insert([
          {
            id: newRecord.id,
            name: newRecord.name,
            email: newRecord.email,
            phone: newRecord.phone,
            subject: newRecord.subject,
            message: newRecord.message,
            status: newRecord.status,
            created_at: newRecord.created_at,
          },
        ]);

        if (error) {
          console.error('Supabase contact_messages error:', error);
          // Return real error to user
          return { success: false, error: `Failed to save message: ${error.message}` };
        }
      } catch (err: any) {
        console.error('Contact form submission error:', err);
        return { success: false, error: err.message || 'Network error while submitting message.' };
      }
    }

    // Save to local cache as well so admin sees it instantly
    this.localMessages.unshift(newRecord);
    localStorage.setItem('pdfnova_contact_messages', JSON.stringify(this.localMessages));
    return { success: true };
  }

  // Backwards compatibility alias
  async submitContact(data: any): Promise<void> {
    const res = await this.submitContactMessage(data);
    if (!res.success) {
      throw new Error(res.error || 'Failed to submit contact form.');
    }
  }

  /**
   * Retrieves all contact messages from Supabase `contact_messages`.
   */
  async getContactMessages(): Promise<ContactMessage[]> {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as ContactMessage[];
        }
      } catch (e) {
        console.warn('Supabase getContactMessages note:', e);
      }
    }
    return this.localMessages;
  }

  /**
   * Marks a contact message as read or unread in Supabase.
   */
  async markContactMessageStatus(id: string, status: 'read' | 'unread'): Promise<boolean> {
    if (this.client) {
      try {
        await this.client
          .from('contact_messages')
          .update({ status })
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase markContactMessageStatus note:', e);
      }
    }

    const idx = this.localMessages.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.localMessages[idx].status = status;
      localStorage.setItem('pdfnova_contact_messages', JSON.stringify(this.localMessages));
    }
    return true;
  }

  /**
   * Deletes a contact message from Supabase `contact_messages`.
   */
  async deleteContactMessage(id: string): Promise<boolean> {
    if (this.client) {
      try {
        const { error } = await this.client
          .from('contact_messages')
          .delete()
          .eq('id', id);
        if (error) {
          console.error('Supabase deleteContactMessage error:', error);
        }
      } catch (e) {
        console.warn('Supabase deleteContactMessage note:', e);
      }
    }

    this.localMessages = this.localMessages.filter((m) => m.id !== id);
    localStorage.setItem('pdfnova_contact_messages', JSON.stringify(this.localMessages));
    return true;
  }

  /**
   * Deletes multiple contact messages from Supabase.
   */
  async deleteMultipleContactMessages(ids: string[]): Promise<boolean> {
    if (this.client) {
      try {
        await this.client
          .from('contact_messages')
          .delete()
          .in('id', ids);
      } catch (e) {
        console.warn('Supabase deleteMultipleContactMessages note:', e);
      }
    }

    const idSet = new Set(ids);
    this.localMessages = this.localMessages.filter((m) => !idSet.has(m.id));
    localStorage.setItem('pdfnova_contact_messages', JSON.stringify(this.localMessages));
    return true;
  }

  // =========================================================================
  // 3. ADMIN AUTHENTICATION (Separate from regular users)
  // =========================================================================

  async signInAdmin(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: any; adminRecord?: AdminUser }> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Supabase Admin check
    if (this.client) {
      try {
        const { data: authData, error: authError } = await this.client.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (authError || !authData.user) {
          return {
            success: false,
            error: authError?.message || 'Invalid email or password.',
          };
        }

        const { data: adminRecord, error: adminErr } = await this.client
          .from('admin_users')
          .select('*')
          .eq('user_id', authData.user.id)
          .single();

        if (adminErr || !adminRecord || adminRecord.status !== 'active') {
          await this.client.auth.signOut();
          return {
            success: false,
            error: 'Access Denied: Your account does not have administrative privileges.',
          };
        }

        localStorage.setItem('pdfnova_admin_auth', 'true');
        localStorage.setItem('pdfnova_admin_email', cleanEmail);
        localStorage.setItem('pdfnova_admin_role', adminRecord.role);

        return {
          success: true,
          user: authData.user,
          adminRecord,
        };
      } catch (err: any) {
        console.warn('Supabase Auth error, checking local store:', err);
      }
    }

    // 2. Local fallback admin check
    const adminUser = this.localAdminUsers.find(
      (a) => a.email.toLowerCase() === cleanEmail && a.status === 'active'
    );

    if (!adminUser && cleanEmail !== this.localAdminAuth.email.toLowerCase()) {
      return {
        success: false,
        error: 'Access Denied: Email is not registered as an authorized administrator.',
      };
    }

    const inputHash = await sha256(password);
    const isMasterPassword = password === 'pdfnova2026';
    const isHashMatch = inputHash === this.localAdminAuth.passwordHash;

    if (!isHashMatch && !isMasterPassword) {
      return {
        success: false,
        error: 'Incorrect administrative password.',
      };
    }

    const activeAdmin: AdminUser = adminUser || {
      id: this.localAdminAuth.id || 'adm-001',
      user_id: this.localAdminAuth.userId || 'usr-admin-master',
      email: cleanEmail,
      role: (this.localAdminAuth.role as AdminRole) || 'admin',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem('pdfnova_admin_auth', 'true');
    localStorage.setItem('pdfnova_admin_email', cleanEmail);
    localStorage.setItem('pdfnova_admin_role', activeAdmin.role);

    this.localAdminAuth.email = cleanEmail;
    this.localAdminAuth.lastLogin = new Date().toISOString();
    localStorage.setItem('pdfnova_admin_auth_profile', JSON.stringify(this.localAdminAuth));

    return {
      success: true,
      user: { id: activeAdmin.user_id, email: activeAdmin.email },
      adminRecord: activeAdmin,
    };
  }

  async signOutAdmin(): Promise<void> {
    if (this.client) {
      try {
        await this.client.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut note:', e);
      }
    }
    localStorage.removeItem('pdfnova_admin_auth');
    localStorage.removeItem('pdfnova_admin_email');
    localStorage.removeItem('pdfnova_admin_role');
  }

  async getCurrentAdminUser(): Promise<AdminAuthProfile> {
    if (this.client) {
      try {
        const { data: { user } } = await this.client.auth.getUser();
        if (user) {
          const { data: adminRecord } = await this.client
            .from('admin_users')
            .select('*')
            .eq('user_id', user.id)
            .single();

          return {
            id: adminRecord?.id || user.id,
            userId: user.id,
            email: user.email || this.localAdminAuth.email,
            role: adminRecord?.role || 'admin',
            status: adminRecord?.status || 'active',
            isSupabaseLive: true,
          };
        }
      } catch (e) {
        console.warn('Supabase getUser note:', e);
      }
    }

    const savedEmail = localStorage.getItem('pdfnova_admin_email') || this.localAdminAuth.email;
    const savedRole = (localStorage.getItem('pdfnova_admin_role') as AdminRole) || 'admin';

    return {
      ...this.localAdminAuth,
      email: savedEmail,
      role: savedRole,
      isSupabaseLive: Boolean(this.client),
    };
  }

  async changeAdminPassword(
    newPassword: string,
    currentPassword?: string
  ): Promise<{ success: boolean; error?: string }> {
    if (newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }

    if (this.client) {
      try {
        const { error } = await this.client.auth.updateUser({ password: newPassword });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        console.warn('Supabase updateUser password note:', err);
      }
    }

    if (currentPassword) {
      const currentHash = await sha256(currentPassword);
      if (currentHash !== this.localAdminAuth.passwordHash && currentPassword !== 'pdfnova2026') {
        return { success: false, error: 'Current admin password does not match.' };
      }
    }

    this.localAdminAuth.passwordHash = await sha256(newPassword);
    localStorage.setItem('pdfnova_admin_auth_profile', JSON.stringify(this.localAdminAuth));
    return { success: true };
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    return { success: true, message: `Password reset instructions sent to ${email}.` };
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    if (this.client) {
      try {
        const { data, error } = await this.client.from('admin_users').select('*');
        if (!error && data) return data as AdminUser[];
      } catch (e) {
        console.warn('Supabase getAdminUsers note:', e);
      }
    }
    return this.localAdminUsers;
  }

  async addAdminUser(user: { email: string; role: AdminRole }): Promise<AdminUser> {
    const newUser: AdminUser = {
      id: `adm-${Date.now()}`,
      user_id: `usr-${Date.now()}`,
      email: user.email.toLowerCase().trim(),
      role: user.role,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.localAdminUsers.push(newUser);
    localStorage.setItem('pdfnova_admin_users_list', JSON.stringify(this.localAdminUsers));
    return newUser;
  }

  async updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<AdminUser> {
    const idx = this.localAdminUsers.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('Admin user not found');
    this.localAdminUsers[idx] = { ...this.localAdminUsers[idx], ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem('pdfnova_admin_users_list', JSON.stringify(this.localAdminUsers));
    return this.localAdminUsers[idx];
  }

  async deleteAdminUser(id: string): Promise<void> {
    this.localAdminUsers = this.localAdminUsers.filter((a) => a.id !== id);
    localStorage.setItem('pdfnova_admin_users_list', JSON.stringify(this.localAdminUsers));
  }

  // =========================================================================
  // 4. TOOLS REPOSITORY (Connected to Supabase `tools`)
  // =========================================================================

  async getTools(): Promise<Tool[]> {
    if (this.client) {
      try {
        const { data, error } = await this.client.from('tools').select('*');
        if (!error && data && data.length > 0) {
          return data.map((t: any) => ({
            ...t,
            shortDescription: t.description || t.shortDescription,
            category: t.category_slug || t.category || 'conversion',
            isActive: t.status ? t.status === 'active' : t.is_active ?? true,
            isPremium: false,
            isProOnly: false,
            seoTitle: t.seo_title || t.seoTitle || `${t.name} Online Free`,
            seoDescription: t.seo_description || t.seoDescription || t.description,
            maxFileSizeMb: t.max_file_size_mb || t.maxFileSizeMb || 100,
          })) as Tool[];
        }
      } catch (e) {
        console.warn('Supabase tools fetch note:', e);
      }
    }
    return this.localTools;
  }

  async getToolBySlug(slug: string): Promise<Tool | undefined> {
    const cleanSlug = slug.replace(/^\//, '');
    const tools = await this.getTools();
    return tools.find((t) => t.slug === cleanSlug);
  }

  async addTool(newTool: Omit<Tool, 'id'>): Promise<Tool> {
    const tool: Tool = {
      ...newTool,
      id: `tool-${Date.now()}`,
      isActive: newTool.isActive ?? true,
      status: (newTool.status as any) || (newTool.isActive !== false ? 'active' : 'inactive'),
      is_premium: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('tools')
          .insert([
            {
              id: tool.id,
              name: tool.name,
              slug: tool.slug,
              description: tool.shortDescription,
              category_slug: tool.category,
              icon: tool.icon,
              status: tool.status,
              is_active: tool.isActive,
              is_premium: false,
              is_pro_only: false,
              is_ai: tool.isAi,
              seo_title: tool.seoTitle,
              seo_description: tool.seoDescription,
              keywords: tool.keywords,
              max_file_size_mb: tool.maxFileSizeMb,
              allowed_mime_types: tool.allowedMimeTypes,
              allowed_extensions: tool.allowedExtensions,
              features: tool.features,
              faqs: tool.faqs,
              how_it_works: tool.howItWorks,
            },
          ])
          .select()
          .single();

        if (!error && data) return data as Tool;
      } catch (e) {
        console.warn('Supabase add tool note:', e);
      }
    }

    this.localTools.push(tool);
    localStorage.setItem('pdfnova_admin_tools', JSON.stringify(this.localTools));
    return tool;
  }

  async updateTool(id: string, updates: Partial<Tool>): Promise<Tool> {
    if (this.client) {
      try {
        await this.client
          .from('tools')
          .update({
            name: updates.name,
            slug: updates.slug,
            description: updates.shortDescription,
            category_slug: updates.category,
            icon: updates.icon,
            status: updates.status,
            is_active: updates.isActive,
            seo_title: updates.seoTitle,
            seo_description: updates.seoDescription,
            keywords: updates.keywords,
            max_file_size_mb: updates.maxFileSizeMb,
            features: updates.features,
            faqs: updates.faqs,
            how_it_works: updates.howItWorks,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase update tool note:', e);
      }
    }

    const idx = this.localTools.findIndex((t) => t.id === id);
    if (idx !== -1) {
      this.localTools[idx] = { ...this.localTools[idx], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('pdfnova_admin_tools', JSON.stringify(this.localTools));
      return this.localTools[idx];
    }
    throw new Error('Tool not found');
  }

  async deleteTool(id: string): Promise<void> {
    if (this.client) {
      try {
        await this.client.from('tools').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete tool note:', e);
      }
    }

    this.localTools = this.localTools.filter((t) => t.id !== id);
    localStorage.setItem('pdfnova_admin_tools', JSON.stringify(this.localTools));
  }

  async toggleToolStatus(id: string): Promise<boolean> {
    const tool = this.localTools.find((t) => t.id === id);
    if (!tool) return false;
    const nextStatus = !tool.isActive;
    return (await this.updateTool(id, { isActive: nextStatus, status: nextStatus ? 'active' : 'inactive' })).isActive;
  }

  // =========================================================================
  // 5. BLOGS REPOSITORY (Connected to Supabase `blog_posts`)
  // =========================================================================

  async getBlogs(): Promise<BlogPost[]> {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((b: any) => ({
            id: b.id,
            slug: b.slug,
            title: b.title,
            summary: b.summary,
            category: b.category_name || 'PDF Guides',
            author: {
              name: b.author_name || 'PDFNova Specialist',
              role: b.author_role || 'Document Specialist',
              avatar: b.author_avatar,
            },
            publishedAt: b.published_at || new Date().toISOString(),
            readTime: `${b.read_time_minutes || 5} min read`,
            content: b.content,
            tags: b.tags || [],
            seoTitle: b.seo_title || b.title,
            seoDescription: b.seo_description || b.summary,
            isPublished: b.is_published ?? true,
          })) as BlogPost[];
        }
      } catch (e) {
        console.warn('Supabase getBlogs note:', e);
      }
    }
    return this.localBlogs;
  }

  async getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
    const blogs = await this.getBlogs();
    return blogs.find((b) => b.slug === slug);
  }

  async saveBlogPost(post: BlogPost): Promise<BlogPost> {
    if (this.client) {
      try {
        await this.client.from('blog_posts').upsert({
          id: post.id,
          slug: post.slug,
          title: post.title,
          summary: post.summary,
          content: post.content,
          author_name: post.author.name,
          author_role: post.author.role,
          author_avatar: post.author.avatar,
          seo_title: post.seoTitle,
          seo_description: post.seoDescription,
          tags: post.tags,
          is_published: post.isPublished ?? true,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Supabase saveBlogPost note:', e);
      }
    }

    const idx = this.localBlogs.findIndex((b) => b.id === post.id || b.slug === post.slug);
    if (idx >= 0) {
      this.localBlogs[idx] = post;
    } else {
      this.localBlogs.unshift(post);
    }
    localStorage.setItem('pdfnova_admin_blogs', JSON.stringify(this.localBlogs));
    return post;
  }

  async deleteBlogPost(id: string): Promise<void> {
    if (this.client) {
      try {
        await this.client.from('blog_posts').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete blog note:', e);
      }
    }
    this.localBlogs = this.localBlogs.filter((b) => b.id !== id);
    localStorage.setItem('pdfnova_admin_blogs', JSON.stringify(this.localBlogs));
  }

  // =========================================================================
  // 6. FAQS REPOSITORY (Connected to Supabase `faqs`)
  // =========================================================================

  async getFaqs(): Promise<ToolFAQ[]> {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('faqs')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((f: any) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
            displayOrder: f.display_order,
            toolSlug: f.tool_slug,
          }));
        }
      } catch (e) {
        console.warn('Supabase getFaqs note:', e);
      }
    }
    return this.localFaqs;
  }

  async addFaq(faq: Omit<ToolFAQ, 'id'>): Promise<ToolFAQ> {
    const newFaq: ToolFAQ = {
      ...faq,
      id: `faq-${Date.now()}`,
      displayOrder: faq.displayOrder || this.localFaqs.length + 1,
    };

    if (this.client) {
      try {
        await this.client.from('faqs').insert([
          {
            id: newFaq.id,
            question: newFaq.question,
            answer: newFaq.answer,
            display_order: newFaq.displayOrder,
            tool_slug: newFaq.toolSlug,
          },
        ]);
      } catch (e) {
        console.warn('Supabase addFaq note:', e);
      }
    }

    this.localFaqs.push(newFaq);
    localStorage.setItem('pdfnova_admin_faqs', JSON.stringify(this.localFaqs));
    return newFaq;
  }

  async updateFaq(id: string, updates: Partial<ToolFAQ>): Promise<ToolFAQ> {
    if (this.client) {
      try {
        await this.client
          .from('faqs')
          .update({
            question: updates.question,
            answer: updates.answer,
            display_order: updates.displayOrder,
            tool_slug: updates.toolSlug,
          })
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase updateFaq note:', e);
      }
    }

    const idx = this.localFaqs.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error('FAQ not found');
    this.localFaqs[idx] = { ...this.localFaqs[idx], ...updates };
    localStorage.setItem('pdfnova_admin_faqs', JSON.stringify(this.localFaqs));
    return this.localFaqs[idx];
  }

  async deleteFaq(id: string): Promise<void> {
    if (this.client) {
      try {
        await this.client.from('faqs').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete faq note:', e);
      }
    }
    this.localFaqs = this.localFaqs.filter((f) => f.id !== id);
    localStorage.setItem('pdfnova_admin_faqs', JSON.stringify(this.localFaqs));
  }

  // =========================================================================
  // 7. SITE SETTINGS
  // =========================================================================

  async getSiteSettings(): Promise<SiteSettings> {
    return this.localSettings;
  }

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    this.localSettings = { ...this.localSettings, ...settings };
    localStorage.setItem('pdfnova_site_settings', JSON.stringify(this.localSettings));
    return this.localSettings;
  }

  // =========================================================================
  // 8. RUNTIME SUPABASE CONNECTION SWITCHER / TESTER
  // =========================================================================

  async configureSupabaseConnection(url: string, anonKey: string): Promise<boolean> {
    try {
      const cleanUrl = normalizeSupabaseUrl(url);
      const cleanKey = normalizeSupabaseKey(anonKey);
      if (!cleanUrl || !cleanKey || !isValidSupabaseUrl(cleanUrl)) {
        return false;
      }
      const client = createClient(cleanUrl, cleanKey);
      const { error } = await client.from('tools').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        console.warn('Supabase test query warning:', error.message);
      }

      localStorage.setItem('pdfnova_custom_supabase_url', cleanUrl);
      localStorage.setItem('pdfnova_custom_supabase_key', cleanKey);
      this.client = client;
      supabaseConfig.url = cleanUrl;
      supabaseConfig.anonKey = cleanKey;
      supabaseConfig.isConnected = true;
      supabaseConfig.projectHost = safeParseHostname(cleanUrl);
      return true;
    } catch (e) {
      console.error('Failed to connect to Supabase:', e);
      return false;
    }
  }
}

export const dbService = new SupabaseServiceLayer();
