import React, { useState, useEffect, useRef } from 'react';
import {
  listStarterResources,
  createStarterResource,
  updateStarterResource,
  deleteStarterResource,
  uploadStarterFile,
  inferResourceType,
  type StarterResource,
  type ResourceType,
} from '@/lib/starterResources';

interface StarterPackManagerProps {
  onNotification: (message: string, type: 'success' | 'error') => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileIcon = (ft: ResourceType) => {
  if (ft === 'video') {
    return (
      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    );
  }
  if (ft === 'audio') {
    return (
      <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    );
  }
  if (ft === 'pdf' || ft === 'document') {
    return (
      <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  }
  if (ft === 'spreadsheet') {
    return (
      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  }
  return (
    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
};

const ACCEPT = '.pdf,.xlsx,.xls,.csv,.doc,.docx,.txt,.mp4,.webm,.mp3,.wav,.m4a,.ogg,.png,.jpg,.jpeg';

const StarterPackManager: React.FC<StarterPackManagerProps> = ({ onNotification }) => {
  const [resources, setResources] = useState<StarterResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const list = await listStarterResources();
      setResources(list);
    } catch (err) {
      console.error(err);
      onNotification('Failed to load starter resources', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleAddNew = async (files: File[], sharedTitle: string, sharedDescription: string, sharedTranscript: string) => {
    if (files.length === 0) return;
    setSaving(true);
    setUploadingId('new');
    try {
      let baseOrder = resources.length > 0 ? Math.max(...resources.map(r => r.order), 0) + 1 : 0;
      let created = 0;
      let failed = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(Math.round(((i) / files.length) * 100));
        try {
          const url = await uploadStarterFile(file, (p) => setUploadProgress(Math.round(((i + p / 100) / files.length) * 100)));
          const fileType = inferResourceType(file);
          const title = sharedTitle.trim() && files.length === 1
            ? sharedTitle
            : (sharedTitle.trim() && files.length > 1 ? `${sharedTitle} (${file.name})` : file.name);
          await createStarterResource({
            title,
            description: sharedDescription || '',
            transcript: sharedTranscript || undefined,
            file_url: url,
            file_name: file.name,
            file_type: fileType,
            file_size: file.size,
            order: baseOrder + i,
          });
          created++;
        } catch {
          failed++;
        }
      }
      if (created > 0) {
        onNotification(`Added ${created} resource${created !== 1 ? 's' : ''} successfully${failed > 0 ? ` (${failed} failed)` : ''}`, failed > 0 ? 'error' : 'success');
      } else {
        onNotification('Failed to add resources', 'error');
      }
      setShowAddForm(false);
      fetchResources();
    } catch (err: unknown) {
      onNotification(err instanceof Error ? err.message : 'Failed to add resource', 'error');
    } finally {
      setSaving(false);
      setUploadingId(null);
    }
  };

  const handleUpdate = async (id: string, data: { title?: string; description?: string; transcript?: string; order?: number }) => {
    setSaving(true);
    try {
      await updateStarterResource(id, data);
      onNotification('Resource updated', 'success');
      setEditingId(null);
      fetchResources();
    } catch (err) {
      onNotification(err instanceof Error ? err.message : 'Failed to update', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReplaceFile = async (id: string, file: File) => {
    const res = resources.find(r => r.id === id);
    if (!res) return;
    setUploadingId(id);
    setUploadProgress(0);
    try {
      const url = await uploadStarterFile(file, setUploadProgress);
      await updateStarterResource(id, {
        file_url: url,
        file_name: file.name,
        file_type: inferResourceType(file),
        file_size: file.size,
      });
      onNotification('File replaced', 'success');
      fetchResources();
    } catch (err) {
      onNotification(err instanceof Error ? err.message : 'Failed to replace file', 'error');
    } finally {
      setUploadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resource? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteStarterResource(id);
      onNotification('Resource deleted', 'success');
      fetchResources();
    } catch (err) {
      onNotification(err instanceof Error ? err.message : 'Failed to delete', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const idx = resources.findIndex(r => r.id === id);
    if (idx < 0) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= resources.length) return;
    const a = resources[idx];
    const b = resources[newIdx];
    try {
      await updateStarterResource(a.id, { order: b.order });
      await updateStarterResource(b.id, { order: a.order });
      onNotification('Order updated', 'success');
      fetchResources();
    } catch (err) {
      onNotification(err instanceof Error ? err.message : 'Reorder failed', 'error');
      fetchResources();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Starter Pack Resources</h1>
          <p className="text-slate-400 mt-1">Upload videos, audio, PDFs, and more. Add title, description, and optional transcript.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchResources}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-xl transition-all text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Resource
          </button>
        </div>
      </div>

      {/* Add form - inline page-like section */}
      {showAddForm && (
        <AddResourceForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddNew}
          saving={saving}
          uploading={uploadingId === 'new'}
          uploadProgress={uploadProgress}
          accept={ACCEPT}
          fileInputRef={fileInputRef}
        />
      )}

      {/* Status */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{resources.length} resource{resources.length !== 1 ? 's' : ''}</h3>
            <p className="text-slate-400 text-sm">These appear on the Starter Resources page in the user dashboard.</p>
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-700 rounded-xl" />
                <div className="flex-1">
                  <div className="h-5 bg-slate-700 rounded w-48 mb-2" />
                  <div className="h-4 bg-slate-700/50 rounded w-72" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-12 text-center">
          <p className="text-slate-400 mb-4">No resources yet. Add your first one.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-medium rounded-xl"
          >
            Add Resource
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {resources.map((res, idx) => (
            <ResourceCard
              key={res.id}
              resource={res}
              index={idx}
              total={resources.length}
              isEditing={editingId === res.id}
              onStartEdit={() => setEditingId(res.id)}
              onCancelEdit={() => setEditingId(null)}
              onSave={(data) => handleUpdate(res.id, data)}
              onReplaceFile={(file) => handleReplaceFile(res.id, file)}
              onDelete={() => handleDelete(res.id)}
              onReorder={handleReorder}
              isUploading={uploadingId === res.id}
              uploadProgress={uploadProgress}
              isDeleting={deletingId === res.id}
              saving={saving}
              getFileIcon={getFileIcon}
              formatFileSize={formatFileSize}
              accept={ACCEPT}
            />
          ))}
        </div>
      )}

      <div className="mt-8 bg-slate-800/40 border border-slate-700/30 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How it works
        </h3>
        <p className="text-slate-400 text-sm">
          Resources are stored in Firestore and Firebase Storage. Users see them on the <strong className="text-slate-300">Starter Resources</strong> page in their dashboard (accessible from the Thanks page after subscribing).
        </p>
      </div>
    </div>
  );
};

interface AddResourceFormProps {
  onClose: () => void;
  onSubmit: (files: File[], title: string, description: string, transcript: string) => Promise<void>;
  saving: boolean;
  uploading: boolean;
  uploadProgress: number;
  accept: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const AddResourceForm: React.FC<AddResourceFormProps> = ({
  onClose,
  onSubmit,
  saving,
  uploading,
  uploadProgress,
  accept,
  fileInputRef,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [transcript, setTranscript] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected?.length) {
      setFiles(Array.from(selected));
    } else {
      setFiles([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;
    onSubmit(files, title, description, transcript);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Add Resource{files.length > 1 ? 's' : ''}</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          title="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-2">Files *</label>
          <input
            ref={fileInputRef as React.RefObject<HTMLInputElement>}
            type="file"
            accept={accept}
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600 rounded-xl text-slate-200 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-slate-900 file:bg-amber-500 file:font-medium file:cursor-pointer hover:file:bg-amber-400"
          />
          <p className="text-slate-500 text-xs mt-1.5">Select one or more files. Each file will be added as a separate resource.</p>
          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 bg-slate-900/60 border border-slate-700/50 rounded-lg">
                  <span className="text-slate-300 text-sm truncate flex-1 mr-2">{f.name}</span>
                  <span className="text-slate-500 text-xs flex-shrink-0">
                    {f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${(f.size / 1024).toFixed(1)} KB`}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="ml-2 p-1 text-slate-500 hover:text-red-400 transition-colors"
                    title="Remove"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-2">Title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={files.length === 1 ? files[0]?.name : 'Shared title for batch (each file will append its name)'}
            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-2">Description (optional)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Short description — applies to all selected files"
            rows={3}
            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600 rounded-xl text-white placeholder-slate-500 resize-none focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-2">Transcript (optional)</label>
          <textarea
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            placeholder="For videos/audio — applies to all selected files"
            rows={3}
            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600 rounded-xl text-white placeholder-slate-500 resize-none focus:outline-none focus:border-amber-500/50"
          />
        </div>
        {uploading && (
          <div className="space-y-2">
            <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
            <p className="text-slate-500 text-sm">Uploading... {uploadProgress}%</p>
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || files.length === 0}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Adding...' : files.length > 0 ? `Add ${files.length} Resource${files.length !== 1 ? 's' : ''}` : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

interface ResourceCardProps {
  resource: StarterResource;
  index: number;
  total: number;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (data: { title?: string; description?: string; transcript?: string }) => void;
  onReplaceFile: (file: File) => void;
  onDelete: () => void;
  onReorder: (id: string, dir: 'up' | 'down') => void;
  isUploading: boolean;
  uploadProgress: number;
  isDeleting: boolean;
  saving: boolean;
  getFileIcon: (ft: ResourceType) => React.ReactNode;
  formatFileSize: (b: number) => string;
  accept: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  index,
  total,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
  onReplaceFile,
  onDelete,
  onReorder,
  isUploading,
  uploadProgress,
  isDeleting,
  saving,
  getFileIcon,
  formatFileSize,
  accept,
}) => {
  const [title, setTitle] = useState(resource.title);
  const [description, setDescription] = useState(resource.description);
  const [transcript, setTranscript] = useState(resource.transcript || '');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(resource.title);
    setDescription(resource.description);
    setTranscript(resource.transcript || '');
  }, [resource]);

  const handleSave = () => {
    onSave({ title, description, transcript: transcript || undefined });
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/70 transition-all">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
          {getFileIcon(resource.file_type)}
        </div>
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                placeholder="Title"
              />
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white resize-none"
                placeholder="Description"
                rows={2}
              />
              <textarea
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white resize-none"
                placeholder="Transcript (optional)"
                rows={3}
              />
            </div>
          ) : (
            <>
              <h4 className="text-white font-semibold">{resource.title}</h4>
              <p className="text-slate-400 text-sm mt-0.5">{resource.description}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                <span>{resource.file_name}</span>
                {resource.file_size != null && resource.file_size > 0 && (
                  <>
                    <span className="w-1 h-1 bg-slate-600 rounded-full" />
                    <span>{formatFileSize(resource.file_size)}</span>
                  </>
                )}
                <span className="capitalize">{resource.file_type}</span>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          {!isEditing && (
            <>
              <button
                onClick={() => onReorder(resource.id, 'up')}
                disabled={index === 0}
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 disabled:opacity-30"
                title="Move up"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => onReorder(resource.id, 'down')}
                disabled={index >= total - 1}
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 disabled:opacity-30"
                title="Move down"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <a
                href={resource.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-lg text-slate-300 hover:text-white text-xs font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open
              </a>
              <input
                ref={fileRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) onReplaceFile(f);
                  e.target.value = '';
                }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg text-amber-400 text-xs font-medium disabled:opacity-50"
              >
                {isUploading ? (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {uploadProgress}%
                  </span>
                ) : (
                  'Replace file'
                )}
              </button>
              <button
                onClick={onStartEdit}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-lg text-slate-300 hover:text-white text-xs font-medium"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium disabled:opacity-50"
              >
                {isDeleting ? (
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                Delete
              </button>
            </>
          )}
          {isEditing && (
            <div className="flex gap-2">
              <button onClick={onCancelEdit} className="px-3 py-2 text-slate-400 hover:text-white">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-medium rounded-lg disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StarterPackManager;
