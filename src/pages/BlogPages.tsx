import React, { useState } from 'react';
import {
  Search,
  Clock,
  ArrowRight,
  FileText,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Wrench,
  BookOpen,
} from 'lucide-react';
import { BLOG_POSTS, BLOG_CATEGORIES, getRelatedPosts } from '../data/blogData';
import { BlogPost } from '../types';
import { SEOHead } from '../components/seo/SEOHead';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { TOOLS_DATA } from '../data/toolsData';

interface BlogListingPageProps {
  onNavigate: (path: string) => void;
}

export const BlogListingPage: React.FC<BlogListingPageProps> = ({ onNavigate }) => {
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');

  // Primary 10 core SEO guides
  const primaryGuides = BLOG_POSTS.slice(0, 10);

  const filteredPosts = primaryGuides.filter((post) => {
    const matchesCat = selectedCat === 'All' || post.category === selectedCat;
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.summary.toLowerCase().includes(search.toLowerCase()) ||
      (post.primaryKeyword && post.primaryKeyword.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const featuredPost = primaryGuides[0];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <SEOHead
        title="PDF Guides & How-To Tutorials | PDFNova"
        description="Learn how to convert, compress, merge, split, edit, and manage PDF files with practical PDF guides from PDFNova."
        canonicalPath="/blog"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Blog' }]} onNavigate={onNavigate} />

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto pt-6 pb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Practical Document Guides</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            PDF Guides &amp; How-To Tutorials
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Step-by-step instructions to convert, compress, merge, split, edit, and optimize your PDF documents online with PDFNova.
          </p>
        </div>

        {/* Featured Guide Spotlight */}
        {featuredPost && selectedCat === 'All' && !search && (
          <section aria-labelledby="featured-heading" className="mb-12">
            <div
              onClick={() => onNavigate(`/blog/${featuredPost.slug}`)}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md p-6 sm:p-10 cursor-pointer hover:border-blue-400 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group"
            >
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-bold">Featured Guide</span>
                  <span>·</span>
                  <span>{featuredPost.category}</span>
                </div>
                <h2
                  id="featured-heading"
                  className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug"
                >
                  {featuredPost.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {featuredPost.summary}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
                  <span className="font-medium text-slate-700">{featuredPost.author.name}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 px-4 py-2 rounded-xl group-hover:bg-blue-700 transition-colors">
                    Read Guide
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  {featuredPost.toolRoute && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(featuredPost.toolRoute!);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors"
                    >
                      <Wrench className="w-3.5 h-3.5 text-blue-600" />
                      Try {featuredPost.toolCtaText || 'Tool'}
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl h-56 sm:h-72 flex items-center justify-center p-8 text-white text-center shadow-inner">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-blue-100">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-blue-200 font-bold block">
                    Fast Online Conversion
                  </span>
                  <p className="text-lg font-bold text-white">
                    Convert PDF Documents to Editable Word
                  </p>
                  <p className="text-xs text-blue-100 max-w-xs mx-auto">
                    Preserve tables, fonts, and layout alignment with zero hassle.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Category Filters & Search */}
        <section aria-label="Filter guides" className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCat === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PDF guides..."
              aria-label="Search guides"
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
            />
          </div>
        </section>

        {/* Articles Grid */}
        <section aria-label="All guides">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <p className="text-slate-600 text-sm">No guides matched your search. Try another category or query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => onNavigate(`/blog/${post.slug}`)}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer p-6 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {post.title}
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      Read Guide
                      <ArrowRight className="w-3 h-3" />
                    </span>

                    {post.toolRoute && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(post.toolRoute!);
                        }}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 font-medium transition-colors"
                      >
                        <Wrench className="w-3 h-3" />
                        <span>Tool</span>
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

interface BlogPostPageProps {
  post: BlogPost;
  onNavigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, onNavigate }) => {
  const PRODUCTION_ORIGIN = 'https://pdfnova1.vercel.app';
  const fullArticleUrl = `${PRODUCTION_ORIGIN}/blog/${post.slug}`;
  const relatedPosts = getRelatedPosts(post);

  // Map related tools
  const relatedTools = (post.relatedToolSlugs || [])
    .map((slug) => TOOLS_DATA.find((t) => t.slug === slug))
    .filter((t): t is typeof TOOLS_DATA[0] => Boolean(t));

  // Breadcrumbs schema
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  // Article JSON-LD Structured Data
  const schemaArticle = {
    '@type': 'Article',
    headline: post.h1 || post.title,
    description: post.seoDescription,
    inLanguage: 'en-US',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullArticleUrl,
    },
    author: {
      '@type': 'Organization',
      name: 'PDFNova Editorial Team',
      url: PRODUCTION_ORIGIN,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PDFNova',
      url: PRODUCTION_ORIGIN,
      logo: {
        '@type': 'ImageObject',
        url: `${PRODUCTION_ORIGIN}/logo.svg`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.dateModified || post.publishedAt,
    image: `${PRODUCTION_ORIGIN}/og-image.svg`,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <SEOHead
        title={post.seoTitle}
        description={post.seoDescription}
        canonicalPath={`/blog/${post.slug}`}
        ogType="article"
        breadcrumbs={breadcrumbItems}
        jsonLd={schemaArticle}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Visible Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Blog', path: '/blog' },
            { label: post.title },
          ]}
          onNavigate={onNavigate}
        />

        <article className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-12 my-6">
          {/* Article Header */}
          <header className="space-y-4 pb-8 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              {post.h1 || post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{post.author.name}</span>
              <span>·</span>
              <span>Updated October 2026</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
          </header>

          {/* Direct Answer & Top Tool CTA */}
          <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100 space-y-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
                  Quick Answer
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {post.introAnswer || post.summary}
                </p>
              </div>
            </div>

            {post.toolRoute && (
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate(post.toolRoute!)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors text-sm"
                >
                  <Wrench className="w-4 h-4" />
                  <span>{post.toolCtaText || 'Open Tool'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-500">
                  Free · No software installation needed · 100% private
                </span>
              </div>
            )}
          </div>

          {/* Structured Sections */}
          <div className="space-y-10 text-slate-800 leading-relaxed">
            {/* Section 1 & 2 */}
            {post.sections && post.sections.length > 0 ? (
              post.sections.slice(0, 2).map((sec, idx) => (
                <section key={idx} className="space-y-3">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {sec.heading}
                  </h2>
                  <p className="text-base text-slate-700 leading-relaxed">
                    {sec.content}
                  </p>
                </section>
              ))
            ) : null}

            {/* How-To Step-by-Step Section */}
            {post.steps && post.steps.length > 0 && (
              <section aria-labelledby="steps-heading" className="space-y-6 pt-4">
                <div className="space-y-1">
                  <h2 id="steps-heading" className="text-2xl font-bold text-slate-900 tracking-tight">
                    How to {post.primaryKeyword ? post.primaryKeyword.charAt(0).toUpperCase() + post.primaryKeyword.slice(1) : 'Complete This Task'} Online
                  </h2>
                  <p className="text-sm text-slate-600">
                    Follow these 4 simple steps using PDFNova in your desktop or mobile browser:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.steps.map((st) => (
                    <div
                      key={st.stepNumber}
                      className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2 relative"
                    >
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold">
                        {st.stepNumber}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        {st.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {st.description}
                      </p>
                    </div>
                  ))}
                </div>

                {post.toolRoute && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => onNavigate(post.toolRoute!)}
                      className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
                    >
                      <span>Start Now: {post.toolCtaText || 'Open Tool'}</span>
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Additional Sections (Tips & Common Problems) */}
            {post.sections && post.sections.length > 2 ? (
              post.sections.slice(2).map((sec, idx) => (
                <section key={idx} className="space-y-3 pt-4">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {sec.heading}
                  </h2>
                  <p className="text-base text-slate-700 leading-relaxed">
                    {sec.content}
                  </p>
                </section>
              ))
            ) : null}

            {/* Visible FAQs Section */}
            {post.faqs && post.faqs.length > 0 && (
              <section aria-labelledby="faq-heading" className="space-y-6 pt-6 border-t border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4" />
                    <span>Questions &amp; Answers</span>
                  </div>
                  <h2 id="faq-heading" className="text-2xl font-bold text-slate-900 tracking-tight">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-4">
                  {post.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-2"
                    >
                      <h3 className="text-base font-bold text-slate-900 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
                        <span>{faq.question}</span>
                      </h3>
                      <p className="text-sm text-slate-600 pl-6 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Tools Section */}
            {relatedTools.length > 0 && (
              <section aria-labelledby="tools-heading" className="space-y-4 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  <h2 id="tools-heading" className="text-xl font-bold text-slate-900">
                    Related PDF Tools
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {relatedTools.map((t) => (
                    <div
                      key={t.slug}
                      onClick={() => onNavigate(`/${t.slug}`)}
                      className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                    >
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                        <span>{t.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {t.shortDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Guides Section */}
            {relatedPosts.length > 0 && (
              <section aria-labelledby="related-heading" className="space-y-4 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <h2 id="related-heading" className="text-xl font-bold text-slate-900">
                    Related PDF Guides &amp; Tutorials
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {relatedPosts.map((r) => (
                    <div
                      key={r.slug}
                      onClick={() => onNavigate(`/blog/${r.slug}`)}
                      className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-blue-600">
                          {r.category}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {r.title}
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 group-hover:text-blue-600 mt-3 pt-2 border-t border-slate-100">
                        Read Guide
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Final Call to Action Block */}
            <div className="p-8 rounded-2xl bg-gradient-to-tr from-slate-900 to-blue-950 text-white text-center space-y-4 shadow-sm">
              <h2 className="text-2xl font-bold text-white">
                Ready to {post.primaryKeyword ? post.primaryKeyword : 'Process Your PDF'}?
              </h2>
              <p className="text-sm text-slate-300 max-w-lg mx-auto">
                Use PDFNova’s free online tools to work with your documents securely and quickly in your browser.
              </p>
              {post.toolRoute && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate(post.toolRoute!)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-md"
                  >
                    <span>{post.toolCtaText || 'Open Tool'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <footer className="pt-8 mt-10 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Related topics:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </footer>
          )}
        </article>
      </div>
    </div>
  );
};
