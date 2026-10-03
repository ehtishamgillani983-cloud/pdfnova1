import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'cookies';
  onNavigate: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNavigate }) => {
  const content = {
    privacy: {
      title: 'Privacy Policy',
      path: '/privacy-policy',
      effectiveDate: 'March 2026',
      sections: [
        {
          heading: '1. Commitment to Data Minimization & Privacy',
          body: 'At PDFNova, we treat your documents with the highest confidentiality. We design our software so that files are processed either directly inside your web browser (client-side) or within isolated, ephemeral worker memory. We never sell, rent, or trade your document data.',
        },
        {
          heading: '2. Ephemeral Storage & Automatic Deletion',
          body: 'For features requiring server-side compute (such as deep OCR and AI Summarization), uploaded documents are temporarily held in secure, encrypted memory buffers. All temporary files are automatically scheduled for permanent purging within 2 hours of processing completion.',
        },
        {
          heading: '3. Analytics & Google AdSense',
          body: 'We utilize Google Analytics 4 to monitor aggregate site performance and identify broken tools. We partner with Google AdSense to serve non-intrusive advertisements that fund our free tier. Third-party advertising vendors, including Google, use cookies to serve ads based on prior visits.',
        },
        {
          heading: '4. AI Model Training Disclaimer',
          body: 'PDFNova strictly does NOT use your uploaded PDFs, contracts, tax files, or personal images to train foundation artificial intelligence or machine learning models.',
        },
      ],
    },
    terms: {
      title: 'Terms of Service',
      path: '/terms-of-service',
      effectiveDate: 'March 2026',
      sections: [
        {
          heading: '1. Acceptance of Terms',
          body: 'By accessing or using the PDFNova website, API, or applications, you agree to be bound by these Terms of Service and all applicable international laws and regulations.',
        },
        {
          heading: '2. Acceptable Use Policy',
          body: 'You agree not to use PDFNova to convert, merge, or distribute malicious code, copyrighted material without authorization, malware, or unlawful content. PDFNova reserves the right to terminate access for abusive scraping or rate limit circumvention.',
        },
        {
          heading: '3. Intellectual Property Rights',
          body: 'You retain full and exclusive copyright and intellectual property rights in and to all documents and content uploaded to PDFNova. PDFNova asserts zero ownership or licensing rights over your files.',
        },
        {
          heading: '4. Disclaimer of Warranty',
          body: 'PDFNova provides document utilities on an "as is" and "as available" basis. While we strive for near 100% conversion accuracy, users should verify mission-critical outputs before signing or filing with regulatory authorities.',
        },
      ],
    },
    cookies: {
      title: 'Cookie Policy',
      path: '/cookie-policy',
      effectiveDate: 'March 2026',
      sections: [
        {
          heading: '1. What Are Cookies?',
          body: 'Cookies are small text tokens stored in your browser by websites you visit. They are used to remember user preferences, maintain session state, and compile aggregated analytics.',
        },
        {
          heading: '2. Cookies Used on PDFNova',
          body: 'We use strictly necessary cookies (for UI state and user preferences), analytical cookies (Google Analytics 4 to track page load velocities), and advertising cookies (Google AdSense to deliver relevant ads).',
        },
        {
          heading: '3. Managing Cookie Preferences',
          body: 'You can modify or disable cookies at any time through your browser settings. Note that disabling cookies will not impair your ability to convert or merge documents.',
        },
      ],
    },
  }[type];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SEOHead
        title={`${content.title} | PDFNova`}
        description={`Read the official ${content.title} for PDFNova. Explains data retention, security, and document handling.`}
        canonicalPath={content.path}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: content.title }]} onNavigate={onNavigate} />

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-12 my-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Legal Documentation
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">{content.title}</h1>
            <p className="text-xs text-slate-500 mt-1">Effective Date: {content.effectiveDate}</p>
          </div>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            {content.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{sec.heading}</h3>
                <p>{sec.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
