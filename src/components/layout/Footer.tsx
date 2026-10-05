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
                <a
                  href="/pdf-to-word"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/pdf-to-word');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  PDF to Word
                </a>
              </li>
              <li>
                <a
                  href="/word-to-pdf"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/word-to-pdf');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  Word to PDF
                </a>
              </li>
              <li>
                <a
                  href="/merge-pdf"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/merge-pdf');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  Merge PDF
                </a>
              </li>
              <li>
                <a
                  href="/split-pdf"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/split-pdf');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  Split PDF
                </a>
              </li>
              <li>
                <a
                  href="/compress-pdf"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/compress-pdf');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  Compress PDF
                </a>
              </li>
              <li>
                <a
                  href="/pdf-to-jpg"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/pdf-to-jpg');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  PDF to JPG
                </a>
              </li>
              <li>
                <a
                  href="/jpg-to-pdf"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/jpg-to-pdf');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  JPG to PDF
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: AI Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span>AI Document Tools</span>
              <Sparkles className="w-3-h-3 text-amber-400" />
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/pdf-summarizer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/pdf-summarizer');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  AI PDF Summarizer
                </a>
              </li>
              <li>
                <a
                  href="/chat-with-pdf"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/chat-with-pdf');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  Chat with PDF
                </a>
              </li>
              <li>
                <a
                  href="/ocr-pdf"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/ocr-pdf');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  Neural PDF OCR
                </a>
              </li>
              <li>
                <a
                  href="/pdf-translator"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/pdf-translator');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  PDF Translator
                </a>
              </li>
              <li>
                <a
                  href="/pdf-editor"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/pdf-editor');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  Free PDF Editor
                </a>
              </li>
              <li>
                <a
                  href="/pdf-to-excel"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/pdf-to-excel');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  PDF to Excel
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Resources &amp; SEO
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/blog"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/blog');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  PDF Guides &amp; Blog
                </a>
              </li>
              <li>
                <a
                  href="/tools"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/tools');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  Full Tools Directory
                </a>
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
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/about');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  About PDFNova
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/contact');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="/account"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/account');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  My Account
                </a>
              </li>
              <li>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>100% Free &amp; Secure</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Legal &amp; Privacy
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/privacy-policy');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-of-service"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/terms-of-service');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/cookie-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/cookie-policy');
                  }}
                  className="hover:text-white transition-colors text-left block"
                >
                  Cookie Policy
                </a>
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
              © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>Built for students, developers &amp; professionals</span>
            <span>·</span>
            <a
              href="/admin/login"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/admin/login');
              }}
              className="text-slate-600 hover:text-slate-400 transition-colors"
              title="System Console"
            >
              Console
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
