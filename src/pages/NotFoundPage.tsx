import React from 'react';
import { FileQuestion, ArrowRight, Home, Search } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <SEOHead
        title="404 - Page Not Found | PDFNova"
        description="The document tool or page you requested could not be found. Explore all free PDF and AI document utilities on PDFNova."
        canonicalPath="/404"
        noIndex={true}
      />

      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm border border-blue-100">
          <FileQuestion className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Error 404</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Document Not Found
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The page, guide, or tool you are trying to reach does not exist or may have been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('/')}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>
          <button
            onClick={() => onNavigate('/tools')}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 border border-slate-200 cursor-pointer transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Browse All PDF Tools</span>
          </button>
        </div>
      </div>
    </div>
  );
};
