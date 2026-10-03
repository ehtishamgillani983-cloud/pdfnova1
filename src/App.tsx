/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ToolsDirectoryPage } from './pages/ToolsDirectoryPage';
import { ToolPageTemplate } from './components/tools/ToolPageTemplate';
import { BlogListingPage, BlogPostPage } from './pages/BlogPages';
import { AboutPage, ContactPage } from './pages/CompanyPages';
import { AccountPage } from './pages/AccountPage';
import { LegalPage } from './pages/LegalPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { getToolBySlug, TOOLS_DATA } from './data/toolsData';
import { BLOG_POSTS } from './data/blogData';
import { analytics } from './services/analytics';
import { dbService } from './services/supabaseClient';
import { Tool } from './types';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pdfnova_admin_auth') === 'true';
    }
    return false;
  });

  const [liveTools, setLiveTools] = useState<Tool[]>(TOOLS_DATA);

  // Sync with browser history navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch dynamic tools from Supabase
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const fetched = await dbService.getTools();
        if (fetched && fetched.length > 0) {
          setLiveTools(fetched);
        }
      } catch (e) {
        console.warn('Dynamic tools fetch note:', e);
      }
    };
    fetchTools();
  }, [currentPath]);

  const navigate = (path: string) => {
    if (path === currentPath) return;
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    analytics.track('tool_opened', { targetPath: path });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    navigate('/admin');
  };

  const handleAdminLogout = async () => {
    await dbService.signOutAdmin();
    setIsAdminLoggedIn(false);
    navigate('/admin/login');
  };

  // Route Dispatcher
  const renderCurrentView = () => {
    // 1. Admin Routes: strictly protect /admin and /admin/*
    if (currentPath === '/admin/login') {
      return (
        <AdminLoginPage
          onLoginSuccess={handleAdminLogin}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      if (!isAdminLoggedIn) {
        return (
          <AdminLoginPage
            onLoginSuccess={handleAdminLogin}
            onNavigate={navigate}
          />
        );
      }
      return (
        <AdminDashboardPage
          onLogout={handleAdminLogout}
          onNavigate={navigate}
        />
      );
    }

    // 2. Direct static XML sitemap and robots handler
    if (currentPath === '/sitemap.xml' || currentPath === '/robots.txt') {
      window.location.replace(currentPath);
      return null;
    }

    // 3. User Authentication Routes
    if (currentPath === '/login') {
      return <LoginPage onNavigate={navigate} />;
    }
    if (currentPath === '/signup') {
      return <SignUpPage onNavigate={navigate} />;
    }
    if (currentPath === '/forgot-password') {
      return <ForgotPasswordPage onNavigate={navigate} />;
    }
    if (currentPath === '/reset-password') {
      return <ResetPasswordPage onNavigate={navigate} />;
    }

    // 4. User Account (Protected)
    if (currentPath === '/account') {
      return <AccountPage onNavigate={navigate} />;
    }

    // 5. Pricing redirect (Pricing completely removed)
    if (currentPath === '/pricing') {
      return <ToolsDirectoryPage onNavigate={navigate} />;
    }

    // 6. Blog System
    if (currentPath === '/blog') {
      return <BlogListingPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '');
      const post = BLOG_POSTS.find((b) => b.slug === slug);
      if (post) {
        return <BlogPostPage post={post} onNavigate={navigate} />;
      }
      return <BlogListingPage onNavigate={navigate} />;
    }

    // 7. Company & Legal Pages
    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }
    if (currentPath === '/privacy-policy') {
      return <LegalPage type="privacy" onNavigate={navigate} />;
    }
    if (currentPath === '/terms') {
      window.history.replaceState(null, '', '/terms-of-service');
      return <LegalPage type="terms" onNavigate={navigate} />;
    }
    if (currentPath === '/terms-of-service') {
      return <LegalPage type="terms" onNavigate={navigate} />;
    }
    if (currentPath === '/cookie-policy') {
      return <LegalPage type="cookies" onNavigate={navigate} />;
    }
    if (currentPath === '/tools') {
      return <ToolsDirectoryPage onNavigate={navigate} />;
    }

    // 8. Individual Tool Pages
    let toolSlug = '';
    if (currentPath.startsWith('/tools/')) {
      toolSlug = currentPath.replace('/tools/', '');
    } else if (currentPath.startsWith('/')) {
      toolSlug = currentPath.substring(1);
    }

    if (toolSlug === 'ai-pdf-summarizer') {
      window.history.replaceState(null, '', '/pdf-summarizer');
      toolSlug = 'pdf-summarizer';
    }
    if (toolSlug === 'remove-pages-from-pdf' || toolSlug === 'delete-pages-from-pdf') {
      window.history.replaceState(null, '', '/split-pdf');
      toolSlug = 'split-pdf';
    }

    if (toolSlug) {
      const tool = liveTools.find((t) => t.slug === toolSlug) || getToolBySlug(toolSlug);
      if (tool) {
        return <ToolPageTemplate tool={tool} onNavigate={navigate} />;
      }
    }

    // 9. Homepage
    if (currentPath === '/') {
      return <HomePage onNavigate={navigate} />;
    }

    // 10. Fallback 404
    return <NotFoundPage onNavigate={navigate} />;
  };

  const isAdminView = currentPath.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {!isAdminView && (
        <Header currentPath={currentPath} onNavigate={navigate} />
      )}
      
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {!isAdminView && (
        <Footer onNavigate={navigate} />
      )}
    </div>
  );
}
