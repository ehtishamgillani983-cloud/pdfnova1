import React, { useState } from 'react';
import { 
  Upload, 
  Eye, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  RotateCcw,
  Search
} from 'lucide-react';
import { PDFProcessorService } from '../../services/pdfProcessor';
import { analytics } from '../../services/analytics';

export const OcrInterface: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [language, setLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setLoading(true);
    setProgressMsg('Scanning document coordinates & glyphs...');

    analytics.track('file_uploaded', {
      toolSlug: 'ocr-pdf',
      fileName: uploadedFile.name,
      fileSizeBytes: uploadedFile.size,
    });

    try {
      const text = await PDFProcessorService.extractText(uploadedFile, (_percent, msg) => {
        setProgressMsg(msg);
      });
      setExtractedText(text);
      analytics.track('processing_completed', { toolSlug: 'ocr-pdf' });
    } catch {
      alert('Could not OCR this document.');
      analytics.track('processing_failed', { toolSlug: 'ocr-pdf' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!extractedText || !file) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}_ocr.txt`;
    a.click();
    URL.revokeObjectURL(url);
    analytics.track('download_clicked', { toolSlug: 'ocr-pdf' });
  };

  const handleReset = () => {
    setFile(null);
    setExtractedText('');
    setSearchTerm('');
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
            input.accept = '.pdf,image/*';
            input.onchange = (e) => {
              const f = (e.target as HTMLInputElement).files?.[0];
              if (f) handleFileUpload(f);
            };
            input.click();
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <Eye className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Upload Scanned PDF or Image for OCR
          </h3>
          <p className="text-sm text-slate-500 mb-4 max-w-sm">
            Convert invoices, paper receipts, book scans, or photos into searchable text.
          </p>

          <div className="flex items-center gap-2 mb-4" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs text-slate-600 font-medium">Recognition Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="en">English (Default)</option>
              <option value="es">Spanish (Español)</option>
              <option value="fr">French (Français)</option>
              <option value="de">German (Deutsch)</option>
              <option value="zh">Chinese (Simplified)</option>
            </select>
          </div>

          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors">
            Select Scanned File
          </button>
        </div>
      ) : loading ? (
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-base font-bold text-slate-900">{progressMsg}</h3>
          <p className="text-xs text-slate-500">
            Applying optical character recognition and extracting readable text lines...
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
                <span className="text-xs text-slate-500">
                  OCR Completed · {extractedText.split(/\s+/).length} words detected
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .TXT</span>
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                title="Scan another file"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Search in Extracted Text */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search extracted text..."
              className="bg-transparent border-none text-xs text-slate-900 w-full focus:outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Extracted Text Box */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto">
            {searchTerm ? (
              extractedText
                .split(new RegExp(`(${searchTerm})`, 'gi'))
                .map((part, idx) =>
                  part.toLowerCase() === searchTerm.toLowerCase() ? (
                    <mark key={idx} className="bg-yellow-200 text-slate-900 px-0.5 rounded">
                      {part}
                    </mark>
                  ) : (
                    part
                  )
                )
            ) : (
              extractedText
            )}
          </div>
        </div>
      )}
    </div>
  );
};
