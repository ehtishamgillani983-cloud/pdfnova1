import React, { useState } from 'react';
import { 
  Upload, 
  Globe, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { PDFProcessorService } from '../../services/pdfProcessor';
import { analytics } from '../../services/analytics';

export const TranslatorInterface: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [copied, setCopied] = useState(false);

  const languages = [
    { code: 'es', label: 'Spanish (Español)' },
    { code: 'fr', label: 'French (Français)' },
    { code: 'de', label: 'German (Deutsch)' },
    { code: 'it', label: 'Italian (Italiano)' },
    { code: 'pt', label: 'Portuguese (Português)' },
    { code: 'zh', label: 'Chinese (Simplified)' },
    { code: 'ja', label: 'Japanese (日本語)' },
    { code: 'ar', label: 'Arabic (العربية)' },
  ];

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setLoading(true);
    setProgressMsg('Extracting document blocks and reading structure...');

    analytics.track('file_uploaded', {
      toolSlug: 'pdf-translator',
      fileName: uploadedFile.name,
      fileSizeBytes: uploadedFile.size,
    });

    try {
      const src = await PDFProcessorService.extractText(uploadedFile);
      setSourceText(src);

      const trans = await PDFProcessorService.translateDocument(
        uploadedFile,
        targetLang,
        (_p, msg) => setProgressMsg(msg)
      );
      setTranslatedText(trans);
      analytics.track('processing_completed', { toolSlug: 'pdf-translator' });
    } catch {
      alert('Translation failed. Please try again.');
      analytics.track('processing_failed', { toolSlug: 'pdf-translator' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!translatedText || !file) return;
    const blob = new Blob([translatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}_translated_${targetLang}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    analytics.track('download_clicked', { toolSlug: 'pdf-translator' });
  };

  const handleReset = () => {
    setFile(null);
    setSourceText('');
    setTranslatedText('');
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
            input.accept = '.pdf';
            input.onchange = (e) => {
              const f = (e.target as HTMLInputElement).files?.[0];
              if (f) handleFileUpload(f);
            };
            input.click();
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <Globe className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Upload PDF Document to Translate
          </h3>
          <p className="text-sm text-slate-500 mb-4 max-w-sm">
            Translate academic papers, legal documents, and foreign manuals while preserving tables and formatting.
          </p>

          <div className="flex items-center gap-2 mb-4" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs text-slate-600 font-medium">Target Language:</span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors">
            Select Document
          </button>
        </div>
      ) : loading ? (
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-base font-bold text-slate-900">{progressMsg}</h3>
          <p className="text-xs text-slate-500">
            Translating into target language while preserving document typography...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 truncate max-w-[280px]">
                  {file.name}
                </h4>
                <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <span>Source: Detected</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="font-semibold text-blue-600 uppercase">{targetLang}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Translation</span>
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                title="Translate another document"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Side-by-side comparison grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Original Document Stream
              </span>
              <div className="text-xs text-slate-600 font-mono whitespace-pre-wrap max-h-[350px] overflow-y-auto leading-relaxed">
                {sourceText}
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
                Translated Stream ({targetLang.toUpperCase()})
              </span>
              <div className="text-xs text-slate-800 font-mono whitespace-pre-wrap max-h-[350px] overflow-y-auto leading-relaxed">
                {translatedText}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
