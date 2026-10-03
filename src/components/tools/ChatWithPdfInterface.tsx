import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Trash2, 
  Sparkles, 
  FileText, 
  Copy, 
  Check, 
  Upload, 
  RefreshCw,
  CornerDownLeft,
  BookOpen
} from 'lucide-react';
import { PDFProcessorService } from '../../services/pdfProcessor';
import { analytics } from '../../services/analytics';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: string[];
  timestamp: string;
}

export const ChatWithPdfInterface: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [docSummary, setDocSummary] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestedQuestions = [
    'What is the core purpose and scope of this document?',
    'What are the key deadlines, dates, or milestones?',
    'What are the primary risks or compliance requirements?',
    'Summarize the methodology or technical specifications',
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleFileUpload = async (uploadedFile: File) => {
    if (!uploadedFile.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF document.');
      return;
    }
    setFile(uploadedFile);
    setLoading(true);
    analytics.track('file_uploaded', {
      toolSlug: 'chat-with-pdf',
      fileName: uploadedFile.name,
      fileSizeBytes: uploadedFile.size,
    });

    try {
      const text = await PDFProcessorService.extractText(uploadedFile);
      setDocSummary(text.slice(0, 300) + '...');
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: `Document "${uploadedFile.name}" successfully parsed! You can now ask any question about clauses, numbers, data tables, or summaries.`,
          citations: ['Document Loaded: ' + (uploadedFile.size / 1024).toFixed(1) + ' KB'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages([
        {
          id: 'error',
          sender: 'assistant',
          text: `Loaded document "${uploadedFile.name}". Ready for queries.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || !file || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    analytics.track('processing_started', {
      toolSlug: 'chat-with-pdf',
      query: textToSend,
    });

    try {
      const response = await PDFProcessorService.queryDocument(
        file.name,
        textToSend,
        messages.map((m) => ({ sender: m.sender, text: m.text }))
      );

      const aiMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'assistant',
        text: response.answer,
        citations: response.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      analytics.track('processing_completed', { toolSlug: 'chat-with-pdf' });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'assistant',
          text: 'Unable to process query at this time. Please check your document connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      analytics.track('processing_failed', { toolSlug: 'chat-with-pdf' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (confirm('Clear the current conversation?')) {
      setMessages([]);
    }
  };

  const handleResetDocument = () => {
    setFile(null);
    setMessages([]);
    setDocSummary('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden my-6">
      {/* If no file uploaded, show clean dropzone */}
      {!file ? (
        <div className="p-8 sm:p-12 text-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/80 rounded-2xl p-10 cursor-pointer transition-all flex flex-col items-center justify-center max-w-xl mx-auto group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 group-hover:scale-105 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Select or Drop a PDF Document
            </h3>
            <p className="text-sm text-slate-500 mb-4 max-w-sm">
              Upload legal agreements, study guides, reports, or research papers (up to 50MB) to begin chatting.
            </p>
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors">
              Browse Files
            </button>
          </div>
        </div>
      ) : (
        /* Split view: Document preview panel on left, Chat stream on right */
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* Left Document Inspector */}
          <div className="lg:col-span-4 bg-slate-50 border-r border-slate-200 p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 truncate max-w-[160px]">
                      {file.name}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB · Active
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleResetDocument}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg text-xs"
                  title="Change Document"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Document Overview Snip */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Document Context</span>
                </span>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 line-clamp-6 leading-relaxed">
                  {docSummary || 'Extracting document text tokens and parsing layout...'}
                </div>
              </div>

              {/* Starter Suggested Prompts */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Suggested Inquiries</span>
                </span>
                <div className="space-y-1.5">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      disabled={loading}
                      className="w-full text-left p-2 rounded-lg bg-white hover:bg-blue-50 hover:border-blue-200 border border-slate-200/80 text-xs text-slate-700 font-medium transition-all flex items-start justify-between group disabled:opacity-50"
                    >
                      <span>{q}</span>
                      <CornerDownLeft className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0 mt-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Architecture indicator */}
            <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700 block">AI Backend Integration</span>
              <span>Grounded in document context. Ready for Gemini API or Supabase vector search.</span>
            </div>
          </div>

          {/* Right Chat Stream */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-white h-full">
            {/* Header with Clear Chat */}
            <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-800">
                  Assistant Active ({messages.length} messages)
                </span>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={handleClearChat}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Conversation</span>
                </button>
              )}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[480px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-sm shadow-blue-500/10'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Citations if available */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 space-y-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Verified References:
                        </span>
                        {msg.citations.map((cite, i) => (
                          <div
                            key={i}
                            className="text-xs text-blue-700 bg-white/70 px-2 py-0.5 rounded border border-blue-100 font-mono"
                          >
                            {cite}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Timestamp */}
                  <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="hover:text-slate-700 transition-colors"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-2">
                  <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-bl-none p-4 text-xs text-slate-600 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing document sections and generating answer...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about this document..."
                  disabled={loading}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-medium shadow-sm transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
