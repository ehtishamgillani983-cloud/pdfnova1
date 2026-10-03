/**
 * PDFNova (SZ.PDF) Core Type Definitions
 * Matches Supabase data models and client-side application state
 */

export type ToolCategorySlug = 'conversion' | 'management' | 'content' | 'image';

export interface ToolCategory {
  id: string;
  slug: ToolCategorySlug;
  name: string;
  description: string;
  icon: string;
  displayOrder: number;
}

export type JobStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export interface ToolOptionConfig {
  id: string;
  label: string;
  type: 'select' | 'range' | 'toggle' | 'text';
  defaultValue: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
}

export interface ToolFAQ {
  id?: string;
  question: string;
  answer: string;
  displayOrder?: number;
  toolSlug?: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}

export type ToolStatus = 'active' | 'inactive' | 'maintenance';
export type RequiredPlanTier = 'free' | 'pro' | 'business';

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description?: string;
  shortDescription: string;
  category_id?: string;
  category: ToolCategorySlug;
  category_slug?: string;
  icon: string;
  status?: ToolStatus;
  isActive: boolean;
  is_active?: boolean;
  isPremium?: boolean;
  is_premium?: boolean;
  isProOnly?: boolean;
  isBusinessOnly?: boolean;
  requiredPlan?: RequiredPlanTier;
  required_plan?: RequiredPlanTier;
  isAi?: boolean;
  h1: string;
  seoTitle: string;
  seo_title?: string;
  seoDescription: string;
  seo_description?: string;
  keywords: string[];
  maxFileSizeMb: number;
  max_file_size_mb?: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  multiFile?: boolean;
  options?: ToolOptionConfig[];
  howItWorks: HowItWorksStep[];
  features: string[];
  faqs: ToolFAQ[];
  relatedToolSlugs: string[];
  longContent: {
    overview: string;
    useCases: { audience: string; description: string }[];
    securityNotice: string;
  };
  clientExecutable?: boolean;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface ProcessingJob {
  id: string;
  toolSlug: string;
  status: JobStatus;
  progress: number;
  currentActionText?: string;
  fileName: string;
  fileSizeBytes: number;
  resultFileName?: string;
  resultBlob?: Blob;
  resultUrl?: string;
  resultSizeBytes?: number;
  extractedText?: string;
  translationResult?: string;
  summaryResult?: {
    shortSummary: string;
    detailedSummary: string;
    keyPoints: string[];
    questions: string[];
  };
  chatMessages?: {
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    timestamp: number;
  }[];
  errorMessage?: string;
  durationMs?: number;
}

export interface BlogStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogSection {
  heading: string;
  content: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  h1?: string;
  summary: string;
  category: string;
  category_id?: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt: string;
  dateModified?: string;
  readTime: string;
  content: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  toolRoute?: string;
  toolCtaText?: string;
  relatedToolSlugs?: string[];
  relatedSlugs?: string[];
  isPublished?: boolean;
  introAnswer?: string;
  steps?: BlogStep[];
  sections?: BlogSection[];
  faqs?: BlogFAQ[];
  created_at?: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  created_at: string;
  status: 'unread' | 'read';
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  supportEmail: string;
  supportPhone?: string;
  address?: string;
  maxUploadLimitFreeMb: number;
  maxUploadLimitProMb: number;
  maxUploadLimitBusinessMb: number;
  adsEnabled: boolean;
  maintenanceMode: boolean;
  updated_at?: string;
}

export interface AdSettings {
  enableHomepageBanner: boolean;
  enableToolPageBanner: boolean;
  enableToolPageSidebar: boolean;
  enableBlogBanner: boolean;
  adsenseClientId: string;
  bannerSlotId: string;
  rectangleSlotId: string;
  inArticleSlotId: string;
  sidebarSlotId: string;
  autoAdsEnabled: boolean;
  updated_at?: string;
}

// --- SUBSCRIPTIONS & PRICING PLANS ---
export type SubscriptionTier = 'free' | 'pro' | 'business';

export interface PlanFeature {
  id?: string;
  planId?: string;
  featureText: string;
  isIncluded?: boolean;
  displayOrder?: number;
}

export interface PricingPlan {
  id: string; // 'free' | 'pro' | 'business'
  name: string;
  slug?: string;
  tagline: string;
  description?: string;
  priceMonthly: number;
  priceAnnual: number;
  currency: string; // 'USD' or 'PKR'
  badge?: string;
  features: string[];
  isActive: boolean;
  maxUploadLimitMb: number;
  highlight?: boolean;
  ctaText: string;
  hasMonthlyYearlyOption?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// --- PAYMENT SYSTEM & METHODS (Pakistan: Easypaisa, JazzCash, Bank Transfer) ---
export type PaymentMethodType = 'easypaisa' | 'jazzcash' | 'bank_transfer' | 'stripe' | 'card';

export interface PaymentAccountSettings {
  accountTitle: string;
  accountNumber: string;
  bankName: string;
  iban: string;
  easypaisaNumber: string;
  easypaisaTitle: string;
  jazzcashNumber: string;
  jazzcashTitle: string;
  paymentInstructions: {
    easypaisa: string;
    jazzcash: string;
    bank_transfer: string;
  };
}

export type PaymentStatus = 'pending' | 'approved' | 'rejected';
export type SubscriptionStatus = 'none' | 'pending' | 'active' | 'expired' | 'cancelled' | 'rejected';

export interface PaymentRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethodType;
  transactionId: string;
  paymentProofUrl?: string;
  paymentProofName?: string;
  status: PaymentStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  createdAt: string;
  reviewedAt?: string;
  updatedAt?: string;
}

export interface SubscriptionRecord {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  paymentId?: string;
  status: SubscriptionStatus;
  startDate?: string;
  expiryDate?: string;
  paymentMethod?: PaymentMethodType;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'user' | 'admin';
  storageUsedBytes?: number;
  dailyConversionsCount?: number;
  createdAt: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface HomepageContentSettings {
  heroHeading: string;
  heroSubheading: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  trustPoints: { id: string; text: string; icon: string }[];
  announcementBanner?: string;
  updated_at?: string;
}

export interface SocialLinksSettings {
  twitter: string;
  github: string;
  linkedin: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  updated_at?: string;
}

export interface SEOGlobalSettings {
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  gscVerificationTag: string;
  sitemapUrl: string;
  robotsTxtDirectives: string;
  updated_at?: string;
}

// --- ADMIN USERS & AUTHORIZATION (Connected to Supabase Auth user IDs) ---
export type AdminRole = 'admin' | 'editor';
export type AdminUserStatus = 'active' | 'inactive';

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: AdminRole;
  status: AdminUserStatus;
  created_at: string;
  updated_at: string;
}

export interface AdminAuthProfile {
  id?: string;
  userId?: string;
  email: string;
  role?: AdminRole;
  status?: AdminUserStatus;
  passwordHash?: string;
  lastLogin?: string;
  isSupabaseLive?: boolean;
}
