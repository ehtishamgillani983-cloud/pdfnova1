import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  FileText, 
  Layers, 
  Image, 
  ArrowRight, 
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { TOOLS_DATA, TOOL_CATEGORIES } from '../data/toolsData';
import { SEOHead } from '../components/seo/SEOHead';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { dbService } from '../services/supabaseClient';
import { Tool } from '../types';

interface ToolsDirectoryPageProps {
  onNavigate: (path: string) => void;
}

export const ToolsDirectoryPage: React.FC<ToolsDirectoryPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tools, setTools] = useState<Tool[]>(TOOLS_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTools = async () => {
      try {
        const fetched = await dbService.getTools();
        if (fetched && fetched.length > 0) {
          setTools(fetched.filter((t) => t.isActive));
        }
      } catch (err) {
        console.warn('Failed to load tools from dbService, using defaults:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTools();
  }, []);

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'ai' ? tool.isAi : tool.category === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <SEOHead
        title="PDF Tools - All Online Document Tools Directory | PDFNova"
        description="Explore all PDF tools and online document tools on PDFNova. Free online converters, compressor, merger, splitter, OCR, editor, and AI document utilities."
        canonicalPath="/tools"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Tools', path: '/tools' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'All Tools' }]} onNavigate={onNavigate} />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto pt-4 pb-8 space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            PDF Tools - All Online Document Utilities
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Free, fast, and secure tools designed for students, legal teams, and businesses.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="max-w-3xl mx-auto space-y-4 mb-10">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools (e.g. compress, merge, word to pdf, translate, summarize)..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Tools ({tools.length})
            </button>
            <button
              onClick={() => setSelectedCategory('ai')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedCategory === 'ai'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white border border-purple-200 text-purple-700 hover:bg-purple-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Utilities ({tools.filter((t) => t.isAi).length})</span>
            </button>
            {TOOL_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === category.slug
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="max-w-md mx-auto py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">No tools matched your criteria</h2>
            <p className="text-xs text-slate-500">
              Try searching with another keyword like &quot;merge&quot;, &quot;ocr&quot;, or &quot;compress&quot;.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onNavigate(`/${tool.slug}`)}
                className="group bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-400/80 hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer relative"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${
                      tool.isAi ? 'bg-purple-600 shadow-xs shadow-purple-500/20' : 'bg-blue-600 shadow-xs shadow-blue-500/20'
                    }`}>
                      {tool.isAi ? <Sparkles className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    {tool.isAi && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        AI
                      </span>
                    )}
                    {tool.isProOnly && !tool.isAi && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        PRO
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base mb-1.5">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
