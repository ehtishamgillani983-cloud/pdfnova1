import React, { useState } from 'react';
import { Shield, Zap, Sparkles, Heart, Mail, Phone, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { dbService } from '../services/supabaseClient';
import { analytics } from '../services/analytics';

export const AboutPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SEOHead
        title="About PDFNova - Engineering Modern Document Productivity | PDFNova"
        description="Learn about the mission, engineering philosophy, and privacy architecture behind PDFNova."
        canonicalPath="/about"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'About' }]} onNavigate={onNavigate} />

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-12 my-6 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Our Mission
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              Building the Modern Document Operating System
            </h1>
            <p className="text-base text-slate-600 mt-3 leading-relaxed">
              PDFNova was created to replace bloated desktop software and spammy conversion websites with a fast, private, and AI-powered document utility platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <Zap className="w-6 h-6 text-amber-500 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">Client-First Speed</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Where possible, document manipulation occurs directly in your web browser via WebAssembly, minimizing network overhead.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <Shield className="w-6 h-6 text-emerald-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">Strict Privacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We never sell documents, hold permanent storage, or train general AI foundation models on user uploads.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <Sparkles className="w-6 h-6 text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">AI Augmented</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Combining classic PDF primitives with generative semantic analysis to make 100-page filings conversational and understandable.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900">Architecture &amp; Reliability</h2>
            <p>
              Traditional PDF utilities are plagued by invasive popups, deceptive download buttons, and poor formatting fidelity. PDFNova is engineered according to enterprise-grade web standards, featuring responsive mobile design, verified AdSense ad placement containers, and real-time document vector analysis.
            </p>
            <p>
              Whether you are an undergraduate compiling research notes, an attorney reviewing multi-million dollar contracts, or an operations manager compressing invoices, PDFNova guarantees fast and reliable results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await dbService.submitContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Could not send message. Please try again.');
        setLoading(false);
        return;
      }

      analytics.track('contact_submitted', { subject: formData.subject });
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error while submitting message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SEOHead
        title="Contact PDFNova Support & Document Inquiries | PDFNova"
        description="Reach out to our document engineering team for technical support, feature feedback, or questions."
        canonicalPath="/contact"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Contact' }]} onNavigate={onNavigate} />

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-12 my-6">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Get in Touch
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Contact Support &amp; Feedback
            </h1>
            <p className="text-sm text-slate-600 mt-2">
              Have questions, feedback, or need assistance with any of our PDF tools? Send us a message and we will respond to your email.
            </p>
          </div>

          {submitted ? (
            <div className="py-10 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200 p-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for contacting PDFNova. Your message has been saved in our system and our team will follow up at <span className="font-semibold text-slate-800">{formData.email}</span> shortly.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition shadow-sm"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-medium">{errorMessage}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 012-3456"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Question about PDF to Word formatting"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Message *</label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our document team assist you?"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending to Supabase...' : 'Submit Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
