import React, { useState } from 'react';
import { 
  Upload, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  ListOrdered, 
  HelpCircle, 
  RotateCcw 
} from 'lucide-react';
import { PDFProcessorService } from '../../services/pdfProcessor';
import { analytics } from '../../services/analytics';

type SummaryTab = 'short' | 'detailed' | 'keypoints' | 'questions';

export const AiSummarizerInterface: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [activeTab, setActiveTab] = useState<SummaryTab>('short');
  const [copied, setCopied] = useState(false);
  const [summaryData, setSummaryData] = useState<{
    shortSummary: string;
    detailedSummary: string;
    keyPoints: string[];
    questions: string[];
  } | null>(null);

  const handleFileUpload = async (uploadedFile: File) => {
    if (!uploadedFile.name.toLowerCase().endsWith('.pdf') && !uploadedFile.name.toLowerCase().endsWith('.txt')) {
      alert('Please upload a PDF or TXT file.');
      return;
    }

    setFile(uploadedFile);
    setLoading(true);
    setProgressMsg('Uploading document...');

    analytics.track('file_uploaded', {
      toolSlug: 'ai-pdf-summarizer',
      fileName: uploadedFile.name,
      fileSizeBytes: uploadedFile.size,
    });

    try {
      const summary = await PDFProcessorService.generateSummary(
        uploadedFile,
        'executive',
        (_percent, msg) => setProgressMsg(msg)
      );
      setSummaryData(summary);
      analytics.track('processing_completed', { toolSlug: 'ai-pdf-summarizer' });
    } catch {
      alert('Could not summarize document. Please try again.');
      analytics.track('processing_failed', { toolSlug: 'ai-pdf-summarizer' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCurrent = () => {
    if (!summaryData) return;
    let textToCopy = '';
    if (activeTab === 'short') textToCopy = summaryData.shortSummary;
    if (activeTab === 'detailed') textToCopy = summaryData.detailedSummary;
    if (activeTab === 'keypoints') textToCopy = summaryData.keyPoints.map((k, i) => `${i + 1}. ${k}`).join('\n');
    if (activeTab === 'questions') textToCopy = summaryData.questions.map((q, i) => `Q${i + 1}: ${q}`).join('\n');

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!summaryData || !file) return;
    const fullReport = `PDFNOVA AI SUMMARY REPORT
Document: ${file.name}
Generated: ${new Date().toLocaleString()}

--------------------------------------------------
1. EXECUTIVE SUMMARY
--------------------------------------------------
${summaryData.shortSummary}

--------------------------------------------------
2. DETAILED BREAKDOWN
--------------------------------------------------
${summaryData.detailedSummary}

--------------------------------------------------
3. KEY POINTS & ACTION ITEMS
--------------------------------------------------
${summaryData.keyPoints.map((k, i) => `${i + 1}. ${k}`).join('\n')}

--------------------------------------------------
4. CRITICAL QUESTIONS & FAQ
--------------------------------------------------
${summaryData.questions.map((q, i) => `Q${i + 1}: ${q}`).join('\n')}
`;

    const blob = new Blob([fullReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
    analytics.track('download_clicked', { toolSlug: 'ai-pdf-summarizer' });
  };

  const handleReset = () => {
    setFile(null);
    setSummaryData(null);
    setProgressMsg('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 my-6">
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/30 hover:bg-blue-50/70 rounded-2xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center max-w-xl mx-auto"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf,.txt';
            input.onchange = (e) => {
              const f = (e.target as HTMLInputElement).files?.[0];
              if (f) handleFileUpload(f);
            };
            input.click();
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Upload PDF for Instant AI Summarization
          </h3>
          <p className="text-sm text-slate-500 mb-4 max-w-sm">
            Drag & drop your document here or click to browse files (PDF or TXT up to 50MB).
          </p>
          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors">
            Choose File
          </button>
        </div>
      ) : loading ? (
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-base font-bold text-slate-900">{progressMsg}</h3>
          <p className="text-xs text-slate-500">
            Extracting text tokens, mapping semantic structure, and formulating insights...
          </p>
        </div>
      ) : summaryData ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Document metadata banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 truncate max-w-[280px]">
                  {file.name}
                </h4>
                <span className="text-xs text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB · Analysis Completed
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCurrent}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Tab'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Brief</span>
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                title="Summarize another document"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('short')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'short'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Short Summary</span>
            </button>
            <button
              onClick={() => setActiveTab('detailed')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'detailed'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Detailed Breakdown</span>
            </button>
            <button
              onClick={() => setActiveTab('keypoints')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'keypoints'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5 text-emerald-600" />
              <span>Key Points ({summaryData.keyPoints.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'questions'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
              <span>Critical Questions</span>
            </button>
          </div>

          {/* Active Tab Content Panel */}
          <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-200 leading-relaxed text-sm text-slate-800 min-h-[220px]">
            {activeTab === 'short' && (
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Executive Brief
                </h5>
                <p className="text-slate-700 text-base">{summaryData.shortSummary}</p>
              </div>
            )}

            {activeTab === 'detailed' && (
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Section Analysis
                </h5>
                <p className="whitespace-pre-wrap text-slate-700">{summaryData.detailedSummary}</p>
              </div>
            )}

            {activeTab === 'keypoints' && (
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Takeaways & Action Items
                </h5>
                <ul className="space-y-2">
                  {summaryData.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-slate-700">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Important Questions Addressed in Document
                </h5>
                <div className="space-y-2">
                  {summaryData.questions.map((q, i) => (
                    <div
                      key={i}
                      className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 font-medium"
                    >
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
