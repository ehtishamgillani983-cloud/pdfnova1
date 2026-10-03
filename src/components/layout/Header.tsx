import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Layers, 
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight,
  Search,
  User,
  LogOut,
  LogIn
} from 'lucide-react';
import { TOOL_CATEGORIES, TOOLS_DATA } from '../../data/toolsData';
import { dbService } from '../../services/supabaseClient';
import { UserProfile } from '../../types';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    checkCurrentUser();
  }, [currentPath]);

  const checkCurrentUser = async () => {
    try {
      const user = await dbService.getCurrentUser();
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    }
  };

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await dbService.signOutUser();
    setCurrentUser(null);
    handleNav('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleNav('/')}
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-950 via-slate-900 to-blue-900 bg-clip-text text-transparent">
                  PDF<span className="text-blue-600">Nova</span>
                </span>
                <span className="block text-[10px] font-medium text-slate-500 -mt-1 tracking-wider uppercase">
                  Free Document Utilities
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
              {/* Tools Mega Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setToolsDropdownOpen(true)}
                onMouseLeave={() => setToolsDropdownOpen(false)}
              >
                <button
                  onClick={() => handleNav('/tools')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:text-slate-950 hover:bg-slate-50 ${
                    currentPath.startsWith('/tools') || currentPath.includes('-pdf') || currentPath.includes('pdf-')
                      ? 'text-blue-600 font-semibold'
                      : ''
                  }`}
                >
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span>All Tools</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {toolsDropdownOpen && (
                  <div className="absolute top-full left-0 w-[580px] p-4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
                    {TOOL_CATEGORIES.map((cat) => (
                      <div key={cat.id} className="space-y-1">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                          <span>{cat.name}</span>
                        </div>
                        {TOOLS_DATA.filter((t) => t.category === cat.slug)
                          .slice(0, 4)
                          .map((tool) => (
                            <button
                              key={tool.id}
                              onClick={() => handleNav(`/tools/${tool.slug}`)}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50/70 transition-colors"
                            >
                              <span>{tool.name}</span>
                              {tool.isAi && (
                                <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-0.5">
                                  <Sparkles className="w-2.5 h-2.5" /> AI
                                </span>
                              )}
                            </button>
                          ))}
                      </div>
                    ))}
                    <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">100% free document utilities</span>
                      <button
                        onClick={() => handleNav('/tools')}
                        className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        Browse all tools <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNav('/tools/ai-pdf-summarizer')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:text-slate-950 hover:bg-slate-50 ${
                  currentPath === '/tools/ai-pdf-summarizer' || currentPath === '/tools/chat-with-pdf'
                    ? 'text-blue-600 font-semibold'
                    : ''
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Tools</span>
              </button>

              <button
                onClick={() => handleNav('/blog')}
                className={`px-3 py-2 rounded-lg transition-colors hover:text-slate-950 hover:bg-slate-50 ${
                  currentPath === '/blog' || currentPath.startsWith('/blog/') ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                Blog
              </button>

              <button
                onClick={() => handleNav('/about')}
                className={`px-3 py-2 rounded-lg transition-colors hover:text-slate-950 hover:bg-slate-50 ${
                  currentPath === '/about' ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                About
              </button>

              <button
                onClick={() => handleNav('/contact')}
                className={`px-3 py-2 rounded-lg transition-colors hover:text-slate-950 hover:bg-slate-50 ${
                  currentPath === '/contact' ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                Contact
              </button>
            </nav>
          </div>

          {/* Right Action CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNav('/tools')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Search tools"
            >
              <Search className="w-4 h-4" />
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('/account')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    currentPath === '/account'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{currentUser.name || 'Account'}</span>
                </button>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('/signup')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm shadow-blue-500/20 transition"
                >
                  Sign Up Free
                </button>
              </div>
            )}

            <button
              onClick={() => handleNav('/tools')}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-all flex items-center gap-1.5 group"
            >
              <span>Tools</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <button
              onClick={() => handleNav('/tools')}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 text-slate-800 text-sm font-medium text-left"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>All PDF Tools</span>
            </button>
            <button
              onClick={() => handleNav('/tools/ai-pdf-summarizer')}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 text-slate-800 text-sm font-medium text-left"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI PDF Tools</span>
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => handleNav('/tools/pdf-to-word')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
            >
              PDF to Word
            </button>
            <button
              onClick={() => handleNav('/tools/merge-pdf')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Merge PDF
            </button>
            <button
              onClick={() => handleNav('/tools/compress-pdf')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Compress PDF
            </button>
            <button
              onClick={() => handleNav('/tools/chat-with-pdf')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Chat with PDF
            </button>
            <button
              onClick={() => handleNav('/blog')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Blog
            </button>
            <button
              onClick={() => handleNav('/about')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
            >
              About
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Contact
            </button>
          </div>

          {/* User Auth Section in Mobile Menu */}
          <div className="pt-3 border-t border-slate-100">
            {currentUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleNav('/account')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-blue-50 text-blue-800 text-sm font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    My Account ({currentUser.name || currentUser.email})
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('/signup')}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-sm"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
