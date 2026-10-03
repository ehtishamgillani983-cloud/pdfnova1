import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Upload, 
  ArrowRight, 
  ChevronRight, 
  GraduationCap, 
  Briefcase, 
  Scale, 
  CheckCircle,
  HelpCircle,
  Clock,
  Lock,
  Eye,
  Minimize2,
  Combine,
  Split
} from 'lucide-react';
import { TOOLS_DATA, TOOL_CATEGORIES } from '../data/toolsData';
import { PLATFORM_FAQS } from '../data/siteConfig';
import { SEOHead } from '../components/seo/SEOHead';
import { dbService } from '../services/supabaseClient';
import { HomepageContentSettings, Tool, ToolFAQ } from '../types';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [content, setContent] = useState<HomepageContentSettings>({
    heroHeading: 'Online PDF Tools - Free PDF Converter & AI Utilities',
    heroSubheading: 'Convert, compress, merge, split, and edit documents online with fast, free online PDF tools. 100% private, browser-accelerated, and free forever.',
    primaryCtaText: 'Explore PDF Tools',
    secondaryCtaText: 'Try AI PDF Tools',
    trustPoints: [
      { id: '1', text: 'Fast processing', icon: 'Zap' },
      { id: '2', text: 'Easy to use', icon: 'CheckCircle' },
      { id: '3', text: 'Secure handling', icon: 'Lock' },
      { id: '4', text: 'Free tools available', icon: 'ShieldCheck' },
    ],
    announcementBanner: 'Next-Gen Document Intelligence & Conversion',
  });
  const [allTools, setAllTools] = useState<Tool[]>(TOOLS_DATA);
  const [faqsList, setFaqsList] = useState<ToolFAQ[]>(PLATFORM_FAQS.map((f, i) => ({ id: `${i}`, question: f.question, answer: f.answer })));

  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        const [t, f] = await Promise.all([
          dbService.getTools(),
          dbService.getFaqs(),
        ]);
        if (t && t.length > 0) {
          setAllTools(t.filter((item: Tool) => item.isActive));
        }
        if (f && f.length > 0) {
          setFaqsList(f);
        }
      } catch (e) {
        console.warn('Home dynamic data note:', e);
      }
    };
    loadDynamicData();
  }, []);

  const popularTools = allTools.filter((t) =>
    ['pdf-to-word', 'merge-pdf', 'compress-pdf', 'chat-with-pdf', 'jpg-to-pdf', 'split-pdf'].includes(t.slug)
  );

  const aiTools = allTools.filter((t) => t.isAi);

  const homeSchema = [
    {
      '@type': 'WebSite',
      name: 'PDFNova',
      url: 'https://aipdftools.vercel.app',
      description: 'Free online PDF tools and AI document converter. Convert, compress, merge, edit and understand documents online.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://aipdftools.vercel.app/tools?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqsList.slice(0, 5).map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title="Online PDF Tools - Free PDF Converter & AI Document Tools | PDFNova"
        description="Convert, compress, merge, split, and edit documents online with fast, free online PDF tools. 100% private, no software installation needed. Try PDFNova today."
        canonicalPath="/"
        jsonLd={homeSchema}
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{content.announcementBanner || 'Next-Gen Document Intelligence & Conversion'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
              {content.heroHeading}
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {content.heroSubheading}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('/tools')}
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
              >
                <span>{content.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/chat-with-pdf')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{content.secondaryCtaText}</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-600 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Fast processing</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>Easy to use</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Secure handling</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Free tools available</span>
              </div>
            </div>
          </div>

          {/* Visual Interactive Upload / Quick-Action Island */}
          <div className="mt-12 max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
            <div className="text-center pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Quick Document Workspace
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select an action or drop any document to begin instant processing
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { name: 'Convert to Word', slug: 'pdf-to-word', icon: FileText, color: 'text-blue-600 bg-blue-50' },
                { name: 'Compress PDF', slug: 'compress-pdf', icon: Minimize2, color: 'text-emerald-600 bg-emerald-50' },
                { name: 'Merge PDF', slug: 'merge-pdf', icon: Combine, color: 'text-indigo-600 bg-indigo-50' },
                { name: 'Chat with AI', slug: 'chat-with-pdf', icon: Sparkles, color: 'text-amber-600 bg-amber-50' },
              ].map((item) => (
                <button
                  key={item.slug}
                  onClick={() => onNavigate(`/${item.slug}`)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-slate-50/80 transition-all text-center group"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">{item.name}</span>
                </button>
              ))}
            </div>

            {/* Drag & Drop Action Box */}
            <div
              onClick={() => onNavigate('/tools')}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Drop your PDF or image here
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                Or browse from your computer or mobile device. Files up to 50MB processed instantly.
              </p>
              <span className="text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                Choose tool from directory <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR PDF TOOLS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Essential Utilities
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Popular PDF Tools
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              The most trusted converters and page management tools used daily.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/tools')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            <span>View all 15+ tools</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onNavigate(`/${tool.slug}`)}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {tool.shortDescription}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Start conversion</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. AI DOCUMENT TOOLS SHOWCASE */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next-Gen AI Document Suite</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Understand Any Document with AI
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Ask questions, summarize 100-page reports, translate text, and extract data with state-of-the-art accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onNavigate(`/${tool.slug}`)}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between group hover:border-blue-500"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700 flex items-center justify-between text-xs font-semibold text-blue-400">
                  <span>Try AI tool</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY USE PDFNOVA */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Performance &amp; Trust
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            Why Professionals Choose PDFNova
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Built from the ground up to eliminate formatting loss, file size headaches, and privacy risks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Blazing Fast Browser &amp; Edge Speeds
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We leverage client-side WebAssembly and modern edge clusters to process common tasks like merging, splitting, and image optimization directly on your device without upload delays.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Strict Ephemeral Storage
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your files belong to you. Files processed through server pipelines are stored in volatile memory caches with automated expiration after two hours. No permanent retention.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Pristine Formatting Preservation
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our conversion engines intelligently map table geometry, font metrics, and paragraph hierarchy so converted DOCX or image outputs never scramble your hard work.
            </p>
          </div>
        </div>
      </section>

      {/* 5. AUDIENCE SECTIONS: Students, Businesses, Professionals */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Tailored for Every Workflow
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From academic assignments to corporate compliance audits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Students */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">For Students</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Summarize 40-page journal articles before seminars, merge homework photo scans into neat PDFs, and compress assignments to beat university LMS upload caps.
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                <li>• AI PDF Summarizer for rapid study notes</li>
                <li>• JPG to PDF for handwritten homework</li>
                <li>• Free access without credit cards</li>
              </ul>
            </div>

            {/* For Businesses */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">For Businesses</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Convert supplier quotes and invoices into editable Word docs, combine quarterly reports, and sanitize confidential PDFs before external emailing.
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                <li>• PDF to Word with intact spreadsheet tables</li>
                <li>• High-compression engine for email limits</li>
                <li>• Multi-page contract signing online</li>
              </ul>
            </div>

            {/* For Legal & Professionals */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">For Legal &amp; Compliance</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Interrogate 100-page master agreements with Chat with PDF, extract selectable text from blurred image scans with OCR, and translate foreign briefs.
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                <li>• Verified page citations for every query</li>
                <li>• Optical Character Recognition (OCR)</li>
                <li>• ISO-standard document encryption</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Answers &amp; Details
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Everything you need to know about PDFNova and our free document utilities.
          </p>
        </div>

        <div className="space-y-3">
          {faqsList.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-90 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Ready to Supercharge Your PDF Workflow?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
            Join thousands of students, researchers, and business professionals who convert, compress, and analyze documents with PDFNova every day.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/tools')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              Get Started for Free
            </button>
            <button
              onClick={() => onNavigate('/signup')}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-800/80 hover:bg-blue-800 text-white border border-blue-400/40 font-semibold text-sm rounded-xl transition-all"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
