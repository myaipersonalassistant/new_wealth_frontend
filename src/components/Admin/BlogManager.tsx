import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  listBlogPostsAdmin,
  getBlogStatsAdmin,
  createBlogPostAdmin,
  updateBlogPostAdmin,
  deleteBlogPostAdmin,
} from '@/lib/blogPosts';
import { uploadBlogImage, uploadBlogVideo, uploadBlogFile } from '@/lib/blogStorage';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[];
  author_name: string;
  author_bio: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  read_time_minutes: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface BlogStats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
  featured: number;
  categories: Record<string, number>;
}

interface Props {
  onNotification: (message: string, type: 'success' | 'error') => void;
}

const CATEGORIES = [
  'Getting Started',
  'Finance',
  'Market Analysis',
  'Wealth Building',
  'Landlord Tips',
  'Legal & Tax',
  'Case Studies',
  'General',
];

const emptyPost: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  category: 'General',
  tags: [],
  author_name: 'Christopher Ifonlaja',
  author_bio: 'Author of Build Wealth Through Property and property investment educator.',
  status: 'draft',
  featured: false,
  read_time_minutes: 5,
  published_at: null,
};

const BlogManager: React.FC<Props> = ({ onNotification }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingPost, setEditingPost] = useState<Partial<BlogPost>>(emptyPost);
  const [isNew, setIsNew] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [coverUploadProgress, setCoverUploadProgress] = useState<number | null>(null);
  const [mediaUploading, setMediaUploading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch posts from Firestore
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const posts = await listBlogPostsAdmin({ search: searchQuery });
      const filtered = statusFilter === 'all' ? posts : posts.filter((p) => p.status === statusFilter);
      setPosts(filtered);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      onNotification('Failed to load blog posts', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, onNotification]);

  // Fetch stats from Firestore
  const fetchStats = useCallback(async () => {
    try {
      const stats = await getBlogStatsAdmin();
      setStats(stats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, [fetchPosts, fetchStats]);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setEditingPost(prev => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
    }));
  };

  const handleNewPost = () => {
    setEditingPost({ ...emptyPost });
    setIsNew(true);
    setView('editor');
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost({ ...post });
    setIsNew(false);
    setView('editor');
  };

  const handleSave = async (publishStatus?: 'draft' | 'published') => {
    if (!editingPost.title?.trim()) {
      onNotification('Title is required', 'error');
      return;
    }
    if (!editingPost.slug?.trim()) {
      onNotification('Slug is required', 'error');
      return;
    }

    setSaving(true);
    try {
      const postData = {
        ...editingPost,
        status: publishStatus || editingPost.status,
      };

      if (isNew) {
        const created = await createBlogPostAdmin(postData);
        onNotification('Blog post created successfully', 'success');
        setEditingPost(created);
        setIsNew(false);
      } else {
        await updateBlogPostAdmin(editingPost.id!, postData);
        onNotification('Blog post updated successfully', 'success');
        setEditingPost((prev) => ({ ...prev, ...postData }));
      }
      fetchPosts();
      fetchStats();
    } catch (err: any) {
      onNotification(err.message || 'Failed to save post', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"? This cannot be undone.`)) return;

    try {
      await deleteBlogPostAdmin(post.id);
      onNotification('Blog post deleted', 'success');
      fetchPosts();
      fetchStats();
    } catch (err: unknown) {
      onNotification(err instanceof Error ? err.message : 'Failed to delete post', 'error');
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !editingPost.tags?.includes(tag)) {
      setEditingPost(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditingPost(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag),
    }));
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not published';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'draft':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'archived':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  // Rich text toolbar actions
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    // Sync content
    if (editorRef.current) {
      setEditingPost(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploadProgress(0);
    try {
      const url = await uploadBlogImage(file, 'covers', (p) => setCoverUploadProgress(p.percent));
      setEditingPost(prev => ({ ...prev, cover_image: url }));
      onNotification('Cover image uploaded', 'success');
    } catch (err: any) {
      onNotification(err.message || 'Upload failed', 'error');
    } finally {
      setCoverUploadProgress(null);
      e.target.value = '';
    }
  };

  const handleInsertMedia = async (
    type: 'image' | 'video' | 'file',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaUploading(true);
    try {
      let url: string;
      let html: string;
      if (type === 'image') {
        url = await uploadBlogImage(file, 'images');
        html = `<img src="${url}" alt="${file.name}" style="max-width:100%;height:auto;border-radius:8px;" />`;
      } else if (type === 'video') {
        url = await uploadBlogVideo(file);
        html = `<video src="${url}" controls style="max-width:100%;border-radius:8px;"></video>`;
      } else {
        url = await uploadBlogFile(file);
        html = `<a href="${url}" target="_blank" rel="noopener" class="text-amber-400">${file.name}</a>`;
      }
      editorRef.current?.focus();
      document.execCommand('insertHTML', false, html);
      setEditingPost(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
      onNotification(`${type} uploaded and inserted`, 'success');
    } catch (err: any) {
      onNotification(err.message || 'Upload failed', 'error');
    } finally {
      setMediaUploading(false);
      e.target.value = '';
    }
  };

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const input = coverInputRef.current;
      if (input) {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        input.dispatchEvent(new Event('change'));
      }
    }
  };

  const handleCoverDragOver = (e: React.DragEvent) => e.preventDefault();

  // Editor view
  if (view === 'editor') {
    return (
      <div className="space-y-6">
        {/* Editor Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => { setView('list'); fetchPosts(); }}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Posts
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50"
            >
              {saving ? 'Publishing...' : (editingPost.status === 'published' ? 'Update' : 'Publish')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="Post title..."
                value={editingPost.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-slate-700 text-white text-3xl font-bold placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-slate-500 text-xs font-medium mb-1">URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 text-sm">/blog/</span>
                <input
                  type="text"
                  value={editingPost.slug || ''}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, slug: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-slate-500 text-xs font-medium mb-1">Excerpt / Summary</label>
              <textarea
                placeholder="Brief description for article cards and SEO..."
                value={editingPost.excerpt || ''}
                onChange={(e) => setEditingPost(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors resize-none text-sm"
              />
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-slate-500 text-xs font-medium mb-2">Content</label>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-800 border border-slate-700 rounded-t-xl border-b-0">
                <button onClick={() => execCommand('bold')} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors" title="Bold">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"/><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"/></svg>
                </button>
                <button onClick={() => execCommand('italic')} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors" title="Italic">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 4h-9M14 20H5M15 4L9 20"/></svg>
                </button>
                <button onClick={() => execCommand('underline')} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors" title="Underline">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3M4 21h16"/></svg>
                </button>
                <div className="w-px h-6 bg-slate-700 mx-1" />
                <button onClick={() => execCommand('formatBlock', 'h2')} className="px-2 py-1 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors text-xs font-bold" title="Heading 2">H2</button>
                <button onClick={() => execCommand('formatBlock', 'h3')} className="px-2 py-1 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors text-xs font-bold" title="Heading 3">H3</button>
                <button onClick={() => execCommand('formatBlock', 'p')} className="px-2 py-1 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors text-xs" title="Paragraph">P</button>
                <div className="w-px h-6 bg-slate-700 mx-1" />
                <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors" title="Bullet List">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
                </button>
                <button onClick={() => execCommand('insertOrderedList')} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors" title="Numbered List">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M10 6h11M10 12h11M10 18h11M4 6V4l-1 1M3 10h2M4 18h-1c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
                </button>
                <button onClick={() => execCommand('formatBlock', 'blockquote')} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors" title="Quote">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                </button>
                <div className="w-px h-6 bg-slate-700 mx-1" />
                <button onClick={insertLink} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors" title="Insert Link">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                </button>
                <div className="w-px h-6 bg-slate-700 mx-1" />
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleInsertMedia('image', e)} />
                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleInsertMedia('video', e)} />
                <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => handleInsertMedia('file', e)} />
                <button onClick={() => imageInputRef.current?.click()} disabled={mediaUploading} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors disabled:opacity-50" title="Insert Image (Firebase Storage)">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </button>
                <button onClick={() => videoInputRef.current?.click()} disabled={mediaUploading} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors disabled:opacity-50" title="Insert Video (Firebase Storage)">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
                <button onClick={() => fileInputRef.current?.click()} disabled={mediaUploading} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors disabled:opacity-50" title="Insert File (PDF, etc.)">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </button>
                <button onClick={() => execCommand('removeFormat')} className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors" title="Clear Formatting">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              {/* Content Editable Area */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={() => {
                  if (editorRef.current) {
                    setEditingPost(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
                  }
                }}
                dangerouslySetInnerHTML={{ __html: editingPost.content || '' }}
                className="min-h-[400px] max-h-[600px] overflow-y-auto px-6 py-4 bg-slate-800/60 border border-slate-700 rounded-b-xl text-slate-200 focus:outline-none focus:border-amber-500/50 transition-colors prose prose-invert prose-sm max-w-none
                  prose-headings:text-white prose-h2:text-xl prose-h3:text-lg
                  prose-p:text-slate-300 prose-a:text-amber-400
                  prose-strong:text-white prose-ul:text-slate-300 prose-ol:text-slate-300
                  prose-blockquote:border-amber-500 prose-blockquote:text-slate-400"
              />
              {/* HTML Source Toggle */}
              <div className="mt-2">
                <details className="group">
                  <summary className="text-slate-500 text-xs cursor-pointer hover:text-slate-300 transition-colors">
                    View/Edit HTML Source
                  </summary>
                  <textarea
                    value={editingPost.content || ''}
                    onChange={(e) => {
                      setEditingPost(prev => ({ ...prev, content: e.target.value }));
                      if (editorRef.current) {
                        editorRef.current.innerHTML = e.target.value;
                      }
                    }}
                    rows={12}
                    className="w-full mt-2 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-green-400 font-mono text-xs focus:outline-none focus:border-amber-500/50 transition-colors resize-y"
                  />
                </details>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4 text-sm">Post Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-500 text-xs font-medium mb-1">Status</label>
                  <select
                    value={editingPost.status || 'draft'}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 text-xs font-medium mb-1">Category</label>
                  <select
                    value={editingPost.category || 'General'}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={editingPost.featured || false}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500/20"
                  />
                  <label htmlFor="featured" className="text-slate-300 text-sm">Featured article</label>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4 text-sm">Cover Image</h3>
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              <div
                onDrop={handleCoverDrop}
                onDragOver={handleCoverDragOver}
                onClick={() => coverInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  editingPost.cover_image
                    ? 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50'
                    : 'border-slate-600 hover:border-amber-500/40 hover:bg-slate-800/80'
                }`}
              >
                {coverUploadProgress !== null ? (
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${coverUploadProgress}%` }} />
                    </div>
                    <p className="text-amber-400 text-sm">Uploading {coverUploadProgress}%</p>
                  </div>
                ) : editingPost.cover_image ? (
                  <>
                    <div className="rounded-lg overflow-hidden border border-slate-700/50 mb-3">
                      <img src={editingPost.cover_image} alt="Cover" className="w-full h-32 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <p className="text-slate-400 text-xs">Click or drag to replace • Stored in Firebase Storage</p>
                  </>
                ) : (
                  <div className="space-y-2">
                    <svg className="w-10 h-10 text-amber-400/60 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                    </svg>
                    <p className="text-slate-400 text-sm">Drop image here or click to upload</p>
                    <p className="text-slate-500 text-xs">JPEG, PNG, GIF, WebP • Max 5MB</p>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-slate-500 text-xs">Or</span>
                <input
                  type="text"
                  placeholder="Paste image URL..."
                  value={editingPost.cover_image || ''}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, cover_image: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4 text-sm">Tags</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                  className="flex-1 px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 hover:bg-amber-500/20 transition-colors text-sm"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(editingPost.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-slate-700/50 text-slate-300 text-xs px-2.5 py-1 rounded-lg"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Author */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4 text-sm">Author</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Author name"
                  value={editingPost.author_name || ''}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, author_name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
                <textarea
                  placeholder="Author bio..."
                  value={editingPost.author_bio || ''}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, author_bio: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none"
                />
              </div>
            </div>

            {/* Post Info */}
            {!isNew && editingPost.id && (
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-4 text-sm">Post Info</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Created</span>
                    <span className="text-slate-300">{formatDate(editingPost.created_at || null)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Updated</span>
                    <span className="text-slate-300">{formatDate(editingPost.updated_at || null)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Published</span>
                    <span className="text-slate-300">{formatDate(editingPost.published_at || null)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Read time</span>
                    <span className="text-slate-300">{editingPost.read_time_minutes || 0} min</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <a
                    href={`/blog/${editingPost.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-xs font-medium transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View on site
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Manager</h1>
          <p className="text-slate-400 mt-1">Create, edit, and publish blog articles</p>
        </div>
        <button
          onClick={handleNewPost}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <p className="text-slate-500 text-xs font-medium mb-1">Total Posts</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <p className="text-slate-500 text-xs font-medium mb-1">Published</p>
            <p className="text-3xl font-bold text-emerald-400">{stats.published}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <p className="text-slate-500 text-xs font-medium mb-1">Drafts</p>
            <p className="text-3xl font-bold text-amber-400">{stats.drafts}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <p className="text-slate-500 text-xs font-medium mb-1">Featured</p>
            <p className="text-3xl font-bold text-blue-400">{stats.featured}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'published', 'draft', 'archived'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === s
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/50'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 bg-slate-700/50 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-700/50 rounded w-2/3" />
                  <div className="h-3 bg-slate-700/50 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
          <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h3 className="text-lg font-semibold text-white mb-1">No posts found</h3>
          <p className="text-slate-400 text-sm mb-4">
            {searchQuery ? 'Try a different search term' : 'Create your first blog post to get started'}
          </p>
          <button
            onClick={handleNewPost}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Post
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all group"
            >
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700/50">
                  {post.cover_image ? (
                    <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold truncate">{post.title}</h3>
                    {post.featured && (
                      <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${getStatusBadge(post.status)}`}>
                      {post.status}
                    </span>
                    <span>{post.category}</span>
                    <span>{post.read_time_minutes} min read</span>
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditPost(post)}
                    className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-all"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  {post.status === 'published' && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-all"
                      title="View"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(post)}
                    className="p-2 bg-slate-700/50 hover:bg-red-500/20 rounded-lg text-slate-300 hover:text-red-400 transition-all"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogManager;
