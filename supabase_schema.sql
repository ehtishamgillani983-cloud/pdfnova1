/**
 * Supabase Database Architecture Schema for PDFNova (SZ.PDF)
 * Production-ready schema featuring multi-user authentication,
 * profiles linked to auth.users, contact_messages table,
 * tools, blog posts, FAQs, admin users, and Row Level Security (RLS) policies.
 *
 * To execute: Copy and paste into your Supabase SQL Editor and click 'Run'.
 */

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- HELPER: Trigger to automatically update updated_at timestamps
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. ADMIN USERS (Admin Authorization connected to auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_admin_user_id UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_status_role ON public.admin_users(status, role);

DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER trg_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Helper function to check if the executing user is an active admin/editor
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
      AND status = 'active'
      AND role IN ('admin', 'editor')
  );
$$;

-- ============================================================================
-- 2. PROFILES (Linked to auth.users.id)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  daily_conversions_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Automatically create/sync profile on Supabase auth user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
      updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 3. CONTACT MESSAGES (Contact Form Submissions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- ============================================================================
-- 4. TOOLS REPOSITORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_slug TEXT NOT NULL DEFAULT 'conversion',
  icon TEXT NOT NULL DEFAULT 'FileText',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  is_pro_only BOOLEAN NOT NULL DEFAULT FALSE,
  is_ai BOOLEAN NOT NULL DEFAULT FALSE,
  seo_title TEXT,
  seo_description TEXT,
  keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  max_file_size_mb INT NOT NULL DEFAULT 100,
  allowed_mime_types TEXT[] DEFAULT ARRAY[]::TEXT[],
  allowed_extensions TEXT[] DEFAULT ARRAY[]::TEXT[],
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  faqs JSONB DEFAULT '[]'::JSONB,
  how_it_works JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tools_slug ON public.tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_is_active ON public.tools(is_active);

-- ============================================================================
-- 5. BLOG POSTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  category_name TEXT DEFAULT 'PDF Guides',
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT DEFAULT 'PDFNova Specialist',
  author_role TEXT DEFAULT 'Document Specialist',
  author_avatar TEXT,
  read_time_minutes INT DEFAULT 5,
  is_published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);

-- ============================================================================
-- 6. FAQS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  tool_slug TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON public.faqs(display_order);

-- ============================================================================
-- 7. SITE SETTINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 1. admin_users policies
DROP POLICY IF EXISTS "Admins can view admin_users list" ON public.admin_users;
CREATE POLICY "Admins can view admin_users list"
  ON public.admin_users FOR SELECT
  USING (public.is_admin() OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;
CREATE POLICY "Admins can manage admin_users"
  ON public.admin_users FOR ALL
  USING (public.is_admin());

-- 2. profiles policies (Strict User Isolation)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- 3. contact_messages policies (Public Insert, Admin View/Delete)
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view and manage contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view and manage contact messages"
  ON public.contact_messages FOR ALL
  USING (public.is_admin());

-- 4. tools policies (Public Read, Admin Write)
DROP POLICY IF EXISTS "Public can view active tools" ON public.tools;
CREATE POLICY "Public can view active tools"
  ON public.tools FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage tools" ON public.tools;
CREATE POLICY "Admins can manage tools"
  ON public.tools FOR ALL
  USING (public.is_admin());

-- 5. blog_posts policies (Public Read, Admin Write)
DROP POLICY IF EXISTS "Public can view published blogs" ON public.blog_posts;
CREATE POLICY "Public can view published blogs"
  ON public.blog_posts FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage blogs" ON public.blog_posts;
CREATE POLICY "Admins can manage blogs"
  ON public.blog_posts FOR ALL
  USING (public.is_admin());

-- 6. faqs policies (Public Read, Admin Write)
DROP POLICY IF EXISTS "Public can view faqs" ON public.faqs;
CREATE POLICY "Public can view faqs"
  ON public.faqs FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage faqs" ON public.faqs;
CREATE POLICY "Admins can manage faqs"
  ON public.faqs FOR ALL
  USING (public.is_admin());

-- 7. site_settings policies (Public Read, Admin Write)
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin());
