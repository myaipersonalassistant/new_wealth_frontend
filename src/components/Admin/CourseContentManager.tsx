import React, { useState, useEffect, useRef } from 'react';
import {
  listCourseContent,
  createCourseContent,
  updateCourseContent,
  deleteCourseContent,
  uploadCourseFile,
  inferContentFileType,
  type CourseContentEntry,
  type ContentFile,
} from '@/lib/courseContent';
import { listCourseSettings, type CourseSetting } from '@/lib/firebaseCourseSettings';

const ACCEPT = '.pdf,.xlsx,.xls,.csv,.doc,.docx,.txt,.mp4,.webm,.mp3,.wav,.m4a,.ogg,.png,.jpg,.jpeg,.gif,.webp';

interface Props {
  onNotification: (message: string, type: 'success' | 'error') => void;
}

/** Group content entries by module */
function groupByModule(entries: CourseContentEntry[]): Map<number, CourseContentEntry[]> {
  const map = new Map<number, CourseContentEntry[]>();
  for (const e of entries) {
    if (!map.has(e.module_number)) map.set(e.module_number, []);
    map.get(e.module_number)!.push(e);
  }
  for (const arr of map.values()) {
    arr.sort((a, b) => a.episode_index - b.episode_index);
  }
  return map;
}

const getFileIcon = (type: string) => {
  if (type === 'video') return '🎬';
  if (type === 'audio') return '🔊';
  if (type === 'pdf') return '📄';
  if (type === 'spreadsheet') return '📊';
  if (type === 'document') return '📝';
  return '📎';
};

const CourseContentManager: React.FC<Props> = ({ onNotification }) => {
  const [courses, setCourses] = useState<CourseSetting[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [content, setContent] = useState<CourseContentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [addingEpisode, setAddingEpisode] = useState<{ mod: number; ep: number } | null>(null);
  const [addingModule, setAddingModule] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    listCourseSettings().then((list) => {
      const paidCourses = list.filter((c) => c.course_id !== 'starter-pack');
      setCourses(paidCourses);
      if (paidCourses.length > 0 && !selectedCourseId) {
        setSelectedCourseId(paidCourses[0].course_id);
      }
    });
  }, []);

  const fetchContent = async () => {
    if (!selectedCourseId) return;
    setLoading(true);
    try {
      const list = await listCourseContent(selectedCourseId);
      setContent(list);
      if (list.length > 0 && expandedModule === null) {
        const maxMod = Math.max(...list.map((c) => c.module_number));
        setExpandedModule(maxMod);
      }
    } catch (err) {
      onNotification('Failed to load course content', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [selectedCourseId]);

  const byModule = groupByModule(content);
  const sortedModules = [...byModule.keys()].sort((a, b) => a - b);
  const maxModuleNum = sortedModules.length > 0 ? Math.max(...sortedModules) : 0;

  const getEntry = (mod: number, ep: number) =>
    content.find((c) => c.module_number === mod && c.episode_index === ep);

  const getNextEpisodeIndex = (mod: number) => {
    const episodes = byModule.get(mod) || [];
    if (episodes.length === 0) return 0;
    return Math.max(...episodes.map((e) => e.episode_index)) + 1;
  };

  const handleAddModule = async (title: string) => {
    setAddingModule(false);
    const newModNum = maxModuleNum + 1;
    try {
      await createCourseContent({
        course_id: selectedCourseId,
        module_number: newModNum,
        module_title: title || `Module ${newModNum}`,
        episode_index: 0,
        episode_title: 'Episode 1',
        episode_description: '',
        files: [],
        order: newModNum * 1000,
      });
      onNotification('Module added. Add episodes and upload content below.', 'success');
      setExpandedModule(newModNum);
      fetchContent();
    } catch (err) {
      onNotification(err instanceof Error ? err.message : 'Failed to add module', 'error');
    }
  };

  const handleAddEpisode = async (mod: number, file?: File, title?: string, description?: string) => {
    const epIndex = getNextEpisodeIndex(mod);

    if (file) {
      setUploading(`new-${mod}-${epIndex}`);
      setUploadProgress(0);
      try {
        const url = await uploadCourseFile(file, selectedCourseId, mod, epIndex, setUploadProgress);
        const fileType = inferContentFileType(file);
        const modEntries = byModule.get(mod) || [];
        const modTitle = modEntries[0]?.module_title || `Module ${mod}`;
        await createCourseContent({
          course_id: selectedCourseId,
          module_number: mod,
          module_title: modTitle,
          episode_index: epIndex,
          episode_title: title || file.name,
          episode_description: description,
          files: [{ url, type: fileType, name: file.name, size: file.size }],
          order: mod * 1000 + epIndex,
        });
        onNotification('Episode added with content', 'success');
        setAddingEpisode(null);
        fetchContent();
      } catch (err) {
        onNotification(err instanceof Error ? err.message : 'Upload failed', 'error');
      } finally {
        setUploading(null);
      }
    } else {
      try {
        const modEntries = byModule.get(mod) || [];
        const modTitle = modEntries[0]?.module_title || `Module ${mod}`;
        await createCourseContent({
          course_id: selectedCourseId,
          module_number: mod,
          module_title: modTitle,
          episode_index: epIndex,
          episode_title: title || `Episode ${epIndex + 1}`,
          episode_description: description,
          files: [],
          order: mod * 1000 + epIndex,
        });
        onNotification('Episode added. Upload content to fill it.', 'success');
        setAddingEpisode(null);
        fetchContent();
      } catch (err) {
        onNotification(err instanceof Error ? err.message : 'Failed to add episode', 'error');
      }
    }
  };

  const handleAddFile = async (entryId: string, mod: number, ep: number, file: File) => {
    const entry = content.find((c) => c.id === entryId);
    if (!entry) return;
    setUploading(entryId);
    setUploadProgress(0);
    try {
      const url = await uploadCourseFile(file, selectedCourseId, mod, ep, setUploadProgress);
      const fileType = inferContentFileType(file);
      const newFiles = [...entry.files, { url, type: fileType, name: file.name, size: file.size }];
      await updateCourseContent(entryId, { files: newFiles });
      onNotification('File added', 'success');
      fetchContent();
    } catch (err) {
      onNotification(err instanceof Error ? err.message : 'Upload failed', 'error');
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveFile = async (entryId: string, fileIndex: number) => {
    const entry = content.find((c) => c.id === entryId);
    if (!entry) return;
    const newFiles = entry.files.filter((_, i) => i !== fileIndex);
    await updateCourseContent(entryId, { files: newFiles });
    onNotification('File removed', 'success');
    fetchContent();
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Delete this episode and all its content?')) return;
    try {
      await deleteCourseContent(entryId);
      onNotification('Episode deleted', 'success');
      fetchContent();
    } catch {
      onNotification('Failed to delete', 'error');
    }
  };

  const handleUpdateEntry = async (entryId: string) => {
    const entry = content.find((c) => c.id === entryId);
    if (!entry) return;
    try {
      await updateCourseContent(entryId, {
        episode_title: editTitle || entry.episode_title,
        episode_description: editDesc || undefined,
      });
      onNotification('Episode updated', 'success');
      setEditingEntry(null);
      fetchContent();
    } catch {
      onNotification('Failed to update', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Course Content</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Create modules, episodes, and upload videos, PDFs, spreadsheets, audio — any resource type.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCourseId(c.course_id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCourseId === c.course_id
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {!selectedCourseId && courses.length === 0 ? (
        <div className="py-12 text-center text-slate-400">Loading courses...</div>
      ) : !selectedCourseId ? (
        <div className="py-12 text-center text-slate-400">Select a course above or add one in Course Settings.</div>
      ) : loading ? (
        <div className="flex justify-center py-12">
          <svg className="w-8 h-8 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Add Module */}
          {addingModule ? (
            <AddModuleForm
              onSubmit={handleAddModule}
              onCancel={() => setAddingModule(false)}
            />
          ) : (
            <button
              onClick={() => setAddingModule(true)}
              className="w-full py-4 border-2 border-dashed border-amber-500/40 rounded-2xl text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/60 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Module
            </button>
          )}

          {/* Modules */}
          {sortedModules.map((modNum) => {
            const episodes = byModule.get(modNum) || [];
            const modTitle = episodes[0]?.module_title || `Module ${modNum}`;
            const isOpen = expandedModule === modNum;
            const isAddingEp = addingEpisode?.mod === modNum;

            return (
              <div
                key={modNum}
                className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedModule(isOpen ? null : modNum)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <span className="text-amber-400 font-bold text-sm">{modNum}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{modTitle}</h3>
                      <p className="text-slate-500 text-xs">{episodes.length} episode{episodes.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 space-y-3 border-t border-slate-700/50 pt-4">
                    {episodes.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-4"
                      >
                        {editingEntry === entry.id ? (
                          <div className="space-y-2">
                            <input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="Episode title"
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
                            />
                            <textarea
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                              placeholder="Description (optional)"
                              rows={2}
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateEntry(entry.id)}
                                className="px-3 py-1.5 bg-amber-500 text-slate-900 text-sm font-medium rounded-lg"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingEntry(null)}
                                className="px-3 py-1.5 text-slate-400 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-white font-medium">{entry.episode_title}</h4>
                                  {entry.files.length === 0 && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-600/50 text-slate-400">Empty</span>
                                  )}
                                </div>
                                {entry.episode_description && (
                                  <p className="text-slate-500 text-xs mt-0.5">{entry.episode_description}</p>
                                )}
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <button
                                  onClick={() => {
                                    setEditingEntry(entry.id);
                                    setEditTitle(entry.episode_title);
                                    setEditDesc(entry.episode_description || '');
                                  }}
                                  className="px-3 py-2 text-slate-400 hover:text-white text-sm"
                                >
                                  Edit
                                </button>
                                <input
                                  ref={(el) => { fileInputRefs.current[entry.id] = el; }}
                                  type="file"
                                  accept={ACCEPT}
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleAddFile(entry.id, modNum, entry.episode_index, f);
                                    e.target.value = '';
                                  }}
                                />
                                <button
                                  onClick={() => fileInputRefs.current[entry.id]?.click()}
                                  disabled={!!uploading}
                                  className="px-3 py-2 bg-amber-500/20 text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-500/30 disabled:opacity-50"
                                >
                                  {uploading === entry.id ? `${uploadProgress}%` : '+ Add File'}
                                </button>
                                <button
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  className="px-3 py-2 text-red-400/80 hover:text-red-400 text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            {entry.files.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {entry.files.map((f, fi) => (
                                  <div
                                    key={fi}
                                    className="flex items-center gap-2 px-3 py-2 bg-slate-800/80 border border-slate-700/50 rounded-lg"
                                  >
                                    <span>{getFileIcon(f.type)}</span>
                                    <a
                                      href={f.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-amber-400 hover:text-amber-300 text-sm truncate max-w-[160px]"
                                    >
                                      {f.name}
                                    </a>
                                    <button
                                      onClick={() => handleRemoveFile(entry.id, fi)}
                                      className="text-slate-500 hover:text-red-400 p-0.5"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}

                    {isAddingEp ? (
                      <AddEpisodeForm
                        onSubmit={(file, title, desc) => handleAddEpisode(modNum, file, title, desc)}
                        onCancel={() => setAddingEpisode(null)}
                        uploading={!!uploading && uploading.startsWith('new-')}
                        progress={uploadProgress}
                        accept={ACCEPT}
                      />
                    ) : (
                      <button
                        onClick={() => setAddingEpisode({ mod: modNum, ep: getNextEpisodeIndex(modNum) })}
                        className="w-full py-3 border border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-amber-400 hover:border-amber-500/40 text-sm font-medium transition-all"
                      >
                        + Add Episode
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {selectedCourseId && sortedModules.length === 0 && !addingModule && (
            <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-slate-700/40">
              <p className="text-slate-400 mb-2">No modules yet.</p>
              <p className="text-slate-500 text-sm">Click &quot;Add New Module&quot; above to create your first module and start uploading content.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface AddModuleFormProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

const AddModuleForm: React.FC<AddModuleFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
      <input
        type="text"
        placeholder="Module title (e.g. Getting Started)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm"
      />
      <div className="flex gap-2">
        <button onClick={onCancel} className="px-4 py-2 text-slate-400 hover:text-white text-sm">
          Cancel
        </button>
        <button
          onClick={() => onSubmit(title)}
          className="px-4 py-2 bg-amber-500 text-slate-900 font-medium rounded-xl text-sm"
        >
          Add Module
        </button>
      </div>
    </div>
  );
};

interface AddEpisodeFormProps {
  onSubmit: (file?: File, title?: string, description?: string) => void;
  onCancel: () => void;
  uploading: boolean;
  progress: number;
  accept: string;
}

const AddEpisodeForm: React.FC<AddEpisodeFormProps> = ({
  onSubmit,
  onCancel,
  uploading,
  progress,
  accept,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(file || undefined, title || undefined, description || undefined);
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-900/60 border border-slate-700/50 rounded-xl">
      <input
        type="file"
        accept={accept}
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="w-full text-sm text-slate-300 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500/20 file:text-amber-400"
      />
      <input
        type="text"
        placeholder="Episode title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm"
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm resize-none"
      />
      {uploading && (
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={onCancel} className="px-3 py-2 text-slate-400 hover:text-white text-sm">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="px-4 py-2 bg-amber-500 text-slate-900 font-medium rounded-lg text-sm disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : file ? 'Upload & Add Episode' : 'Add Empty Episode'}
        </button>
      </div>
    </div>
  );
};

export default CourseContentManager;
