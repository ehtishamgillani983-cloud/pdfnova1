import React from 'react';
import { FileText, Shield, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteConfig';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800/80">
          {/* Col 1: PDF Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              PDF Converters
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('/tools/pdf-to-word')}
                  className="hover:text-white transition-colors text-left"
                >
                  PDF to Word
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tools/word-to-pdf')}
                  className="hover:text-white transition-colors text-left"
                >
                  Word to PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tools/merge-pdf')}
                  className="hover:text-white transition-colors text-left"
                >
                  Merge PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tools/split-pdf')}
                  className="hover:text-white transition-colors text-left"
                >
                  Split PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tools/compress-pdf')}
                  className="hover:text-white transition-colors text-left"
                >
                  Compress PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tools/pdf-to-jpg')}
                  className="hover:text-white transition-colors text-left"
                >
                  PDF to JPG
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tools/jpg-to-pdf')}
                  className="hover:text-white transition-colors text-left"
                >
                  JPG to PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: AI Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span>AI Document Tools</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('/tools/ai-pdf-summarizer')}
                  className="hover:text-white transition-colors text-left"
                >
                  AI PDF Summarizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tools/chat-with-pdf')}
                  className="hover:text-white transition-colors text-left"
                >
                  Chat with PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tools/pdf-ocr')}
                  className="hover:text-white transition-colors text-left"
                >
                  Neural PDF OCR
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tools/pdf-translator')}
                  className="hover:text-white transition-colors text-left"
                >
                  PDF Translator
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tools/rotate-pdf')}
                  className="hover:text-white transition-colors text-left"
                >
                  Rotate PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Resources & SEO
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('/blog')}
                  className="hover:text-white transition-colors text-left"
                >
                  PDF Guides & Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tools')}
                  className="hover:text-white transition-colors text-left"
                >
                  Full Tools Directory
                </button>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-left block"
                >
                  XML Sitemap
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-left block"
                >
                  Robots.txt
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Company */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('/about')}
                  className="hover:text-white transition-colors text-left"
                >
                  About PDFNova
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/account')}
                  className="hover:text-white transition-colors text-left"
                >
                  My Account
                </button>
              </li>
              <li>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>100% Free & Secure</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Legal & Privacy
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('/privacy-policy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/terms-of-service')}
                  className="hover:text-white transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <span className="text-xs text-slate-500 block pt-1">
                  Google AdSense Compliant
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              P
            </div>
            <span>
              © {new Date().getFullYear()} {SITE_CONFIG.name} (SZ.PDF). All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>Built for students, developers & professionals</span>
            <span>·</span>
            <button
              onClick={() => handleNav('/admin/login')}
              className="text-slate-600 hover:text-slate-400 transition-colors"
              title="System Console"
            >
              Console
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
