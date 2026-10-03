import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Database, 
  BookOpen, 
  HelpCircle, 
  Search, 
  Settings, 
  Mail, 
  Check, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink,
  ShieldCheck,
  Server,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Key,
  Sparkles,
  AlertCircle,
  LogOut,
  RefreshCw,
  Phone,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';
import { dbService, supabaseConfig } from '../../services/supabaseClient';
import { 
  Tool, 
  BlogPost, 
  ContactMessage, 
  SiteSettings, 
  AdminAuthProfile,
  AdminUser,
  AdminRole,
  ToolFAQ
} from '../../types';
import { TOOL_CATEGORIES } from '../../data/toolsData';
import { SEOHead } from '../../components/seo/SEOHead';

type AdminTab =
  | 'dashboard'
  | 'messages'
  | 'tools'
  | 'blog'
  | 'faqs'
  | 'settings'
  | 'security';

interface AdminDashboardPageProps {
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('messages');
  const [tools, setTools] = useState<Tool[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<ToolFAQ[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [adminAuth, setAdminAuth] = useState<AdminAuthProfile | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Message filtering and reading state
  const [messageSearch, setMessageSearch] = useState('');
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const [isBulkDeletingMessages, setIsBulkDeletingMessages] = useState(false);

  // Tools state
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isAddingTool, setIsAddingTool] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);
  const [newToolForm, setNewToolForm] = useState<Partial<Tool>>({
    name: '',
    slug: '',
    category: 'conversion',
    shortDescription: '',
    h1: '',
    seoTitle: '',
    seoDescription: '',
    icon: 'FileText',
    maxFileSizeMb: 100,
    status: 'active',
    isAi: false,
    isActive: true,
  });

  // FAQs state
  const [editingFaq, setEditingFaq] = useState<ToolFAQ | null>(null);
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<ToolFAQ | null>(null);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // Blog state
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);
  const [newBlogForm, setNewBlogForm] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'PDF Guides',
    author: { name: 'PDFNova Specialist', role: 'Document Specialist' },
    readTime: '5 min read',
    tags: ['PDF', 'Tutorial'],
    seoTitle: '',
    seoDescription: '',
  });

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('admin');

  // Supabase switcher
  const [customSupabaseUrl, setCustomSupabaseUrl] = useState(supabaseConfig.url || '');
  const [customSupabaseKey, setCustomSupabaseKey] = useState(supabaseConfig.anonKey || '');
  const [isConnectingSupabase, setIsConnectingSupabase] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [t, b, f, s, a, adm, m] = await Promise.all([
        dbService.getTools(),
        dbService.getBlogs(),
        dbService.getFaqs(),
        dbService.getSiteSettings(),
        dbService.getCurrentAdminUser(),
        dbService.getAdminUsers(),
        dbService.getContactMessages(),
      ]);

      setTools(t);
      setBlogs(b);
      setFaqs(f);
      setSiteSettings(s);
      setAdminAuth(a);
      setAdminUsers(adm);
      setMessages(m);
    } catch (e) {
      console.warn('Admin load data note:', e);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CONTACT MESSAGES ACTIONS (Real Supabase)
  // ==========================================

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      await dbService.markContactMessageStatus(msg.id, 'read');
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m))
      );
    }
  };

  const handleToggleMessageRead = async (msg: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = msg.status === 'read' ? 'unread' : 'read';
    await dbService.markContactMessageStatus(msg.id, nextStatus);
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, status: nextStatus } : m))
    );
    showToast(`Marked as ${nextStatus}`);
  };

  const handleConfirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
      await dbService.deleteContactMessage(messageToDelete.id);
      setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
      if (selectedMessage?.id === messageToDelete.id) {
        setSelectedMessage(null);
      }
      setSelectedMessageIds((prev) => prev.filter((id) => id !== messageToDelete.id));
      showToast('Message deleted successfully from database');
    } catch (err: any) {
      showToast(`Delete failed: ${err.message}`);
    } finally {
      setMessageToDelete(null);
    }
  };

  const handleConfirmBulkDeleteMessages = async () => {
    if (selectedMessageIds.length === 0) return;
    try {
      await dbService.deleteMultipleContactMessages(selectedMessageIds);
      setMessages((prev) => prev.filter((m) => !selectedMessageIds.includes(m.id)));
      if (selectedMessage && selectedMessageIds.includes(selectedMessage.id)) {
        setSelectedMessage(null);
      }
      showToast(`${selectedMessageIds.length} messages deleted from database`);
      setSelectedMessageIds([]);
    } catch (err: any) {
      showToast(`Bulk delete failed: ${err.message}`);
    } finally {
      setIsBulkDeletingMessages(false);
    }
  };

  const toggleSelectMessage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMessageIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllMessages = () => {
    if (selectedMessageIds.length === filteredMessages.length) {
      setSelectedMessageIds([]);
    } else {
      setSelectedMessageIds(filteredMessages.map((m) => m.id));
    }
  };

  // Filter messages
  const filteredMessages = messages.filter((m) => {
    const matchesFilter =
      messageFilter === 'all'
        ? true
        : messageFilter === 'unread'
        ? m.status === 'unread'
        : m.status === 'read';

    const q = messageSearch.toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  // ==========================================
  // TOOLS CRUD (Real Supabase)
  // ==========================================

  const handleToggleTool = async (id: string) => {
    const next = await dbService.toggleToolStatus(id);
    setTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: next, status: next ? 'active' : 'inactive' } : t))
    );
    showToast(`Tool ${next ? 'Activated' : 'Deactivated'}`);
  };

  const handleConfirmDeleteTool = async () => {
    if (!toolToDelete) return;
    try {
      await dbService.deleteTool(toolToDelete.id);
      setTools((prev) => prev.filter((t) => t.id !== toolToDelete.id));
      showToast(`Tool "${toolToDelete.name}" deleted from database`);
    } catch (err: any) {
      showToast(`Error deleting tool: ${err.message}`);
    } finally {
      setToolToDelete(null);
    }
  };

  const handleSaveTool = async () => {
    if (!editingTool) return;
    try {
      await dbService.updateTool(editingTool.id, editingTool);
      setTools((prev) => prev.map((t) => (t.id === editingTool.id ? editingTool : t)));
      setEditingTool(null);
      showToast('Tool updated successfully');
    } catch (err: any) {
      showToast(`Failed: ${err.message}`);
    }
  };

  const handleCreateTool = async () => {
    if (!newToolForm.name || !newToolForm.slug) {
      showToast('Name and slug are required');
      return;
    }
    try {
      const created = await dbService.addTool(newToolForm as any);
      setTools((prev) => [...prev, created]);
      setIsAddingTool(false);
      setNewToolForm({
        name: '',
        slug: '',
        category: 'conversion',
        shortDescription: '',
        h1: '',
        seoTitle: '',
        seoDescription: '',
        icon: 'FileText',
        maxFileSizeMb: 100,
        status: 'active',
        isAi: false,
        isActive: true,
      });
      showToast('New tool created in database');
    } catch (err: any) {
      showToast(`Failed to add tool: ${err.message}`);
    }
  };

  // ==========================================
  // FAQS CRUD (Real Supabase)
  // ==========================================

  const handleConfirmDeleteFaq = async () => {
    if (!faqToDelete || !faqToDelete.id) return;
    try {
      await dbService.deleteFaq(faqToDelete.id);
      setFaqs((prev) => prev.filter((f) => f.id !== faqToDelete.id));
      showToast('FAQ deleted from database');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    } finally {
      setFaqToDelete(null);
    }
  };

  const handleAddFaq = async () => {
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) {
      showToast('Question and answer are required');
      return;
    }
    try {
      const created = await dbService.addFaq({
        question: newFaqQuestion.trim(),
        answer: newFaqAnswer.trim(),
        displayOrder: faqs.length + 1,
      });
      setFaqs((prev) => [...prev, created]);
      setIsAddingFaq(false);
      setNewFaqQuestion('');
      setNewFaqAnswer('');
      showToast('FAQ added to database');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleSaveFaq = async () => {
    if (!editingFaq || !editingFaq.id) return;
    try {
      const updated = await dbService.updateFaq(editingFaq.id, editingFaq);
      setFaqs((prev) => prev.map((f) => (f.id === editingFaq.id ? updated : f)));
      setEditingFaq(null);
      showToast('FAQ updated');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // ==========================================
  // BLOG CRUD (Real Supabase)
  // ==========================================

  const handleConfirmDeleteBlog = async () => {
    if (!blogToDelete) return;
    try {
      await dbService.deleteBlogPost(blogToDelete.id);
      setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id));
      showToast('Blog article deleted from database');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    } finally {
      setBlogToDelete(null);
    }
  };

  const handleSaveBlog = async () => {
    if (!editingBlog) return;
    try {
      await dbService.saveBlogPost(editingBlog);
      setBlogs((prev) => prev.map((b) => (b.id === editingBlog.id ? editingBlog : b)));
      setEditingBlog(null);
      showToast('Blog article saved');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleCreateBlog = async () => {
    if (!newBlogForm.title || !newBlogForm.slug || !newBlogForm.content) {
      showToast('Title, slug, and content are required');
      return;
    }
    const newPost: BlogPost = {
      id: `blog-${Date.now()}`,
      title: newBlogForm.title,
      slug: newBlogForm.slug,
      summary: newBlogForm.summary || '',
      content: newBlogForm.content,
      category: newBlogForm.category || 'PDF Guides',
      author: newBlogForm.author || { name: 'PDFNova Specialist', role: 'Document Specialist' },
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: newBlogForm.readTime || '5 min read',
      tags: newBlogForm.tags || ['PDF'],
      seoTitle: newBlogForm.seoTitle || newBlogForm.title,
      seoDescription: newBlogForm.seoDescription || newBlogForm.summary || '',
      isPublished: true,
    };
    try {
      await dbService.saveBlogPost(newPost);
      setBlogs((prev) => [newPost, ...prev]);
      setIsAddingBlog(false);
      showToast('Blog article published');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // ==========================================
  // SECURITY & SETTINGS
  // ==========================================

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
    const res = await dbService.changeAdminPassword(newPassword, currentPassword);
    if (!res.success) {
      showToast(res.error || 'Failed to update password');
    } else {
      showToast('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleConnectSupabase = async () => {
    setIsConnectingSupabase(true);
    const ok = await dbService.configureSupabaseConnection(customSupabaseUrl.trim(), customSupabaseKey.trim());
    setIsConnectingSupabase(false);
    if (ok) {
      showToast('Supabase connection configured successfully!');
      loadAllData();
    } else {
      showToast('Connection failed. Please verify Supabase URL & Anon Key format.');
    }
  };

  const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <SEOHead
        title="Admin Management Dashboard | PDFNova Console"
        description="Administrative management portal for PDFNova platform configuration."
        canonicalPath="/admin"
        noIndex={true}
      />
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-blue-500/30 text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Confirmation Modal for Delete Actions */}
      {messageToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Delete Contact Message</h3>
            </div>
            <p className="text-sm text-slate-300">
              Are you sure you want to delete this message from <span className="font-semibold text-white">{messageToDelete.name}</span>?
            </p>
            <p className="text-xs text-red-300 bg-red-950/40 p-3 rounded-xl border border-red-800/40">
              This action will permanently delete the record from the Supabase database.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setMessageToDelete(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteMessage}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Delete from Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Messages Modal */}
      {isBulkDeletingMessages && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Delete Selected Messages</h3>
            </div>
            <p className="text-sm text-slate-300">
              Are you sure you want to delete all <span className="font-bold text-white">{selectedMessageIds.length}</span> selected messages from Supabase?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsBulkDeletingMessages(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBulkDeleteMessages}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Tool Modal */}
      {toolToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Delete Tool</h3>
            </div>
            <p className="text-sm text-slate-300">
              Are you sure you want to delete <span className="font-semibold text-white">{toolToDelete.name}</span>? This will remove it from the Supabase database.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setToolToDelete(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteTool}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Delete Tool
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete FAQ Modal */}
      {faqToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Delete FAQ</h3>
            </div>
            <p className="text-sm text-slate-300">
              Are you sure you want to delete this FAQ question from Supabase?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setFaqToDelete(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteFaq}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Delete FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Blog Modal */}
      {blogToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Delete Blog Article</h3>
            </div>
            <p className="text-sm text-slate-300">
              Are you sure you want to delete <span className="font-semibold text-white">{blogToDelete.title}</span> from Supabase?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setBlogToDelete(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteBlog}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 p-6 flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-sm text-white">PDFNova Admin</h1>
                <span className="text-[10px] text-blue-400 font-mono">Database Console</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/')}
              title="View Public Site"
              className="text-slate-400 hover:text-white p-1"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Supabase Status Pill */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                Supabase DB
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                supabaseConfig.isConnected
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {supabaseConfig.isConnected ? 'Connected' : 'Local / Offline'}
              </span>
            </div>
            {supabaseConfig.projectHost && (
              <p className="text-[10px] font-mono text-slate-500 truncate">
                {supabaseConfig.projectHost}
              </p>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'messages' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" />
                Contact Messages
              </span>
              {unreadMessagesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'tools' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>PDF Tools</span>
              <span className="ml-auto text-[10px] text-slate-500">{tools.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('blog')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'blog' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Blog Guides</span>
              <span className="ml-auto text-[10px] text-slate-500">{blogs.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'faqs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Platform FAQs</span>
              <span className="ml-auto text-[10px] text-slate-500">{faqs.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Database Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'security' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Admin Security</span>
            </button>
          </nav>
        </div>

        {/* Admin User Footer */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="truncate">
            <p className="font-semibold text-white truncate">{adminAuth?.email || 'admin@pdfnova.com'}</p>
            <span className="text-[10px] text-slate-500 uppercase font-mono">{adminAuth?.role || 'admin'}</span>
          </div>
          <button
            onClick={onLogout}
            title="Log out of Admin"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* ========================================================================= */}
        {/* TAB 1: CONTACT MESSAGES (Section 5) */}
        {/* ========================================================================= */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                  <Mail className="w-6 h-6 text-blue-500" />
                  Contact Messages
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Submissions stored in Supabase table <code className="text-blue-400">contact_messages</code>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadAllData}
                  disabled={loading}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>

                {selectedMessageIds.length > 0 && (
                  <button
                    onClick={() => setIsBulkDeletingMessages(true)}
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Selected ({selectedMessageIds.length})
                  </button>
                )}
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-1 w-full sm:w-auto">
                <button
                  onClick={() => setMessageFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    messageFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  All ({messages.length})
                </button>
                <button
                  onClick={() => setMessageFilter('unread')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    messageFilter === 'unread'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  Unread ({unreadMessagesCount})
                </button>
                <button
                  onClick={() => setMessageFilter('read')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    messageFilter === 'read'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  Read ({messages.length - unreadMessagesCount})
                </button>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  placeholder="Search sender, email, subject..."
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Message Detail View Modal */}
            {selectedMessage && (
              <div className="bg-slate-800 border border-blue-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-700 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">
                      Message Details · ID: {selectedMessage.id}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">{selectedMessage.subject}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="text-slate-200 font-semibold">{selectedMessage.name}</span>
                      <span>·</span>
                      <a href={`mailto:${selectedMessage.email}`} className="text-blue-400 hover:underline">
                        {selectedMessage.email}
                      </a>
                      {selectedMessage.phone && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <Phone className="w-3 h-3 text-slate-500" />
                            {selectedMessage.phone}
                          </span>
                        </>
                      )}
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleToggleMessageRead(selectedMessage, e)}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded-xl text-slate-200 transition"
                    >
                      Mark as {selectedMessage.status === 'read' ? 'Unread' : 'Read'}
                    </button>
                    <button
                      onClick={() => setMessageToDelete(selectedMessage)}
                      className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="px-3 py-1.5 bg-slate-900 text-xs text-slate-400 hover:text-white rounded-xl"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>
            )}

            {/* Messages Table */}
            <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between text-xs text-slate-400 font-semibold">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSelectAllMessages}
                    className="text-slate-400 hover:text-white p-1"
                    title="Select all"
                  >
                    {selectedMessageIds.length === filteredMessages.length && filteredMessages.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                  <span>Sender &amp; Subject</span>
                </div>
                <span>Date &amp; Actions</span>
              </div>

              {filteredMessages.length === 0 ? (
                <div className="text-center py-16 text-slate-500 space-y-2">
                  <Mail className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-sm">No contact messages found.</p>
                  <p className="text-xs text-slate-600">
                    Form submissions from the public Contact page will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/60">
                  {filteredMessages.map((msg) => {
                    const isSelected = selectedMessageIds.includes(msg.id);
                    const isUnread = msg.status === 'unread';

                    return (
                      <div
                        key={msg.id}
                        onClick={() => handleOpenMessage(msg)}
                        className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition ${
                          isUnread
                            ? 'bg-slate-800 hover:bg-slate-750 font-semibold'
                            : 'bg-slate-850 hover:bg-slate-800 text-slate-300'
                        } ${selectedMessage?.id === msg.id ? 'ring-1 ring-blue-500' : ''}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            onClick={(e) => toggleSelectMessage(msg.id, e)}
                            className="text-slate-400 hover:text-white p-1 shrink-0"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${isUnread ? 'text-white font-bold' : 'text-slate-200'}`}>
                                {msg.name}
                              </span>
                              <span className="text-xs text-slate-500 truncate">({msg.email})</span>
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-slate-300 truncate mt-0.5">{msg.subject}</p>
                            <p className="text-[11px] text-slate-500 truncate">{msg.message}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[11px] text-slate-500 hidden sm:inline">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </span>

                          <button
                            onClick={(e) => handleToggleMessageRead(msg, e)}
                            title={msg.status === 'read' ? 'Mark unread' : 'Mark read'}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
                          >
                            {msg.status === 'read' ? (
                              <CheckCircle2 className="w-4 h-4 text-slate-500" />
                            ) : (
                              <Mail className="w-4 h-4 text-blue-400" />
                            )}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMessageToDelete(msg);
                            }}
                            title="Delete message from Supabase"
                            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-950/30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PDF TOOLS (Section 6) */}
        {/* ========================================================================= */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                  <Layers className="w-6 h-6 text-blue-500" />
                  PDF Tools Management
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage active state, SEO metadata, and descriptions in Supabase <code className="text-blue-400">tools</code>
                </p>
              </div>

              <button
                onClick={() => setIsAddingTool(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add New Tool
              </button>
            </div>

            {/* Add Tool Drawer/Modal */}
            {isAddingTool && (
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white">Create New PDF Tool</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Tool Name</label>
                    <input
                      type="text"
                      value={newToolForm.name}
                      onChange={(e) => setNewToolForm({ ...newToolForm, name: e.target.value })}
                      placeholder="e.g. PDF Encrypt"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={newToolForm.slug}
                      onChange={(e) => setNewToolForm({ ...newToolForm, slug: e.target.value })}
                      placeholder="e.g. pdf-encrypt"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-xs block mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={newToolForm.shortDescription}
                    onChange={(e) => setNewToolForm({ ...newToolForm, shortDescription: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsAddingTool(false)}
                    className="px-4 py-2 bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTool}
                    className="px-4 py-2 bg-blue-600 text-xs font-semibold text-white rounded-xl"
                  >
                    Save Tool
                  </button>
                </div>
              </div>
            )}

            {/* Edit Tool Modal */}
            {editingTool && (
              <div className="bg-slate-800 border border-blue-500 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white">Edit Tool: {editingTool.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Tool Name</label>
                    <input
                      type="text"
                      value={editingTool.name}
                      onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">SEO Title</label>
                    <input
                      type="text"
                      value={editingTool.seoTitle}
                      onChange={(e) => setEditingTool({ ...editingTool, seoTitle: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-xs block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingTool.shortDescription}
                    onChange={(e) => setEditingTool({ ...editingTool, shortDescription: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingTool(null)}
                    className="px-4 py-2 bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTool}
                    className="px-4 py-2 bg-blue-600 text-xs font-semibold text-white rounded-xl"
                  >
                    Update Tool in Supabase
                  </button>
                </div>
              </div>
            )}

            {/* Tools Table */}
            <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-700">
                  <tr>
                    <th className="p-4">Tool Name</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {tools.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-750 transition">
                      <td className="p-4 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span>{t.name}</span>
                          {t.isAi && (
                            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-mono">
                              AI
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-mono text-slate-400">/{t.slug}</td>
                      <td className="p-4 text-slate-300 capitalize">{t.category}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleTool(t.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                            t.isActive
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {t.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingTool(t)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
                          title="Edit tool"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setToolToDelete(t)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-950/30"
                          title="Delete tool"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BLOG GUIDES (Section 6) */}
        {/* ========================================================================= */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                  SEO Blog Articles
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage search-optimized articles stored in Supabase <code className="text-blue-400">blog_posts</code>
                </p>
              </div>

              <button
                onClick={() => setIsAddingBlog(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                New Article
              </button>
            </div>

            {/* Add / Edit Blog Form */}
            {(isAddingBlog || editingBlog) && (
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white">
                  {editingBlog ? `Edit: ${editingBlog.title}` : 'Create New Article'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Title</label>
                    <input
                      type="text"
                      value={editingBlog ? editingBlog.title : newBlogForm.title}
                      onChange={(e) =>
                        editingBlog
                          ? setEditingBlog({ ...editingBlog, title: e.target.value })
                          : setNewBlogForm({ ...newBlogForm, title: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Slug</label>
                    <input
                      type="text"
                      value={editingBlog ? editingBlog.slug : newBlogForm.slug}
                      onChange={(e) =>
                        editingBlog
                          ? setEditingBlog({ ...editingBlog, slug: e.target.value })
                          : setNewBlogForm({ ...newBlogForm, slug: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-xs block mb-1">Summary</label>
                  <textarea
                    rows={2}
                    value={editingBlog ? editingBlog.summary : newBlogForm.summary}
                    onChange={(e) =>
                      editingBlog
                        ? setEditingBlog({ ...editingBlog, summary: e.target.value })
                        : setNewBlogForm({ ...newBlogForm, summary: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-xs block mb-1">Content (Markdown)</label>
                  <textarea
                    rows={6}
                    value={editingBlog ? editingBlog.content : newBlogForm.content}
                    onChange={(e) =>
                      editingBlog
                        ? setEditingBlog({ ...editingBlog, content: e.target.value })
                        : setNewBlogForm({ ...newBlogForm, content: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setIsAddingBlog(false);
                      setEditingBlog(null);
                    }}
                    className="px-4 py-2 bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingBlog ? handleSaveBlog : handleCreateBlog}
                    className="px-4 py-2 bg-blue-600 text-xs font-semibold text-white rounded-xl"
                  >
                    Save Article in Supabase
                  </button>
                </div>
              </div>
            )}

            {/* Blogs Table */}
            <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-700">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Published</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {blogs.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-750 transition">
                      <td className="p-4 font-semibold text-white">{b.title}</td>
                      <td className="p-4 text-slate-400">{b.category}</td>
                      <td className="p-4 text-slate-400">{b.publishedAt}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingBlog(b)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setBlogToDelete(b)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-950/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PLATFORM FAQS (Section 6) */}
        {/* ========================================================================= */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                  <HelpCircle className="w-6 h-6 text-blue-500" />
                  Platform FAQs
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Answers to frequent questions stored in Supabase <code className="text-blue-400">faqs</code>
                </p>
              </div>

              <button
                onClick={() => setIsAddingFaq(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add FAQ
              </button>
            </div>

            {/* Add FAQ Form */}
            {isAddingFaq && (
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white">Create New FAQ</h3>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Question</label>
                  <input
                    type="text"
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Answer</label>
                  <textarea
                    rows={3}
                    value={newFaqAnswer}
                    onChange={(e) => setNewFaqAnswer(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsAddingFaq(false)}
                    className="px-4 py-2 bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddFaq}
                    className="px-4 py-2 bg-blue-600 text-xs font-semibold text-white rounded-xl"
                  >
                    Save FAQ in Supabase
                  </button>
                </div>
              </div>
            )}

            {/* Edit FAQ Form */}
            {editingFaq && (
              <div className="bg-slate-800 border border-blue-500 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white">Edit FAQ</h3>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Question</label>
                  <input
                    type="text"
                    value={editingFaq.question}
                    onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Answer</label>
                  <textarea
                    rows={3}
                    value={editingFaq.answer}
                    onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingFaq(null)}
                    className="px-4 py-2 bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveFaq}
                    className="px-4 py-2 bg-blue-600 text-xs font-semibold text-white rounded-xl"
                  >
                    Update in Supabase
                  </button>
                </div>
              </div>
            )}

            {/* FAQs List */}
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div
                  key={f.id || i}
                  className="bg-slate-800 border border-slate-700 p-5 rounded-2xl flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">{f.question}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{f.answer}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditingFaq(f)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFaqToDelete(f)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-950/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: OVERVIEW STATS */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <LayoutDashboard className="w-6 h-6 text-blue-500" />
              Platform Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase">Contact Messages</span>
                <p className="text-2xl font-extrabold text-white">{messages.length}</p>
                <p className="text-[11px] text-amber-400">{unreadMessagesCount} unread inquiries</p>
              </div>

              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase">Active PDF Tools</span>
                <p className="text-2xl font-extrabold text-white">{tools.filter((t) => t.isActive).length}</p>
                <p className="text-[11px] text-emerald-400">100% Free &amp; Open</p>
              </div>

              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase">Blog Articles</span>
                <p className="text-2xl font-extrabold text-white">{blogs.length}</p>
                <p className="text-[11px] text-blue-400">Search-optimized</p>
              </div>

              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase">Database Status</span>
                <p className="text-xl font-bold text-emerald-400">
                  {supabaseConfig.isConnected ? 'Supabase Live' : 'Active Local'}
                </p>
                <p className="text-[11px] text-slate-400">Production Ready</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: DATABASE SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Settings className="w-6 h-6 text-blue-500" />
              Database &amp; Supabase Configuration
            </h2>

            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                Supabase Project Connection
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your live Supabase project by providing your project URL and public Anon key.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    value={customSupabaseUrl}
                    onChange={(e) => setCustomSupabaseUrl(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Supabase Anon Key
                  </label>
                  <input
                    type="text"
                    value={customSupabaseKey}
                    onChange={(e) => setCustomSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                  />
                </div>

                <button
                  onClick={handleConnectSupabase}
                  disabled={isConnectingSupabase}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isConnectingSupabase ? 'Testing...' : 'Test & Save Supabase Connection'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: ADMIN SECURITY */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Key className="w-6 h-6 text-blue-500" />
              Admin Security &amp; Credentials
            </h2>

            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4">
              <h3 className="text-sm font-bold text-white">Change Admin Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition"
                >
                  Update Admin Password
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
