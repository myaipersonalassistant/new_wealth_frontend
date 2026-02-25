import React, { useState, useEffect } from 'react';
import { listCourseSettings, updateCourseSetting, seedDefaultCourseSettings, createCourseSetting } from '@/lib/firebaseCourseSettings';
import CourseContentManager from './CourseContentManager';
import CourseCouponManager from './CourseCouponManager';

interface CourseSetting {
  id: string;
  course_id: string;
  title: string;
  description: string;
  price: string;
  visible: boolean;
  purchasable: boolean;
  coming_soon_message: string;
  updated_at: string;
}

interface Props {
  onNotification: (message: string, type: 'success' | 'error') => void;
}

const CourseManager: React.FC<Props> = ({ onNotification }) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'content' | 'coupons'>('content');
  const [courses, setCourses] = useState<CourseSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [newCourseId, setNewCourseId] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState('£97');
  const [creating, setCreating] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      let data = await listCourseSettings();
      if (data.length === 0) {
        await seedDefaultCourseSettings();
        data = await listCourseSettings();
      }
      setCourses(data);
    } catch (err: any) {
      onNotification('Failed to load course settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const toggleField = async (courseId: string, field: 'visible' | 'purchasable', currentValue: boolean) => {
    setUpdating(courseId + field);
    try {
      await updateCourseSetting(courseId, { [field]: !currentValue });
      onNotification(`${field === 'visible' ? 'Visibility' : 'Purchase status'} updated`, 'success');
      fetchCourses();
    } catch (err: any) {
      onNotification('Failed to update setting', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const saveMessage = async (courseId: string) => {
    setUpdating(courseId + 'message');
    try {
      await updateCourseSetting(courseId, { coming_soon_message: messageText });
      onNotification('Coming soon message updated', 'success');
      setEditingMessage(null);
      fetchCourses();
    } catch {
      onNotification('Failed to update message', 'error');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="w-8 h-8 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Course Management</h1>
          <p className="text-slate-400 mt-1">Upload content, control visibility and purchase availability</p>
        </div>
        <button onClick={fetchCourses} className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'content' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700'
          }`}
        >
          Content & Uploads
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'settings' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700'
          }`}
        >
          Course Settings
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'coupons' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700'
          }`}
        >
          Coupons
        </button>
      </div>

      {activeTab === 'content' ? (
        <CourseContentManager onNotification={onNotification} />
      ) : activeTab === 'coupons' ? (
        <CourseCouponManager onNotification={onNotification} />
      ) : (
        <>
      {/* Create Course */}
      {showCreateCourse ? (
        <div className="mb-8 p-6 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
          <h3 className="text-white font-semibold mb-4">Create New Course</h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const id = newCourseId.trim().toLowerCase().replace(/\s+/g, '-') || newCourseTitle.trim().toLowerCase().replace(/\s+/g, '-');
              if (!id) return onNotification('Course ID is required', 'error');
              setCreating(true);
              try {
                await createCourseSetting({
                  course_id: id,
                  title: newCourseTitle || id,
                  price: newCoursePrice,
                  visible: true,
                  purchasable: true,
                  is_free: false,
                });
                onNotification('Course created', 'success');
                setShowCreateCourse(false);
                setNewCourseId('');
                setNewCourseTitle('');
                setNewCoursePrice('£97');
                fetchCourses();
              } catch (err) {
                onNotification(err instanceof Error ? err.message : 'Failed to create', 'error');
              } finally {
                setCreating(false);
              }
            }}
            className="space-y-4 max-w-md"
          >
            <div>
              <label className="block text-slate-400 text-sm mb-1">Course ID (URL-friendly, e.g. advanced-course)</label>
              <input
                type="text"
                value={newCourseId}
                onChange={(e) => setNewCourseId(e.target.value)}
                placeholder="advanced-course"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-xl text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Title</label>
              <input
                type="text"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                placeholder="Advanced Property Course"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-xl text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Price</label>
              <input
                type="text"
                value={newCoursePrice}
                onChange={(e) => setNewCoursePrice(e.target.value)}
                placeholder="£97"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-xl text-white text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowCreateCourse(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                Cancel
              </button>
              <button type="submit" disabled={creating} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-medium rounded-xl disabled:opacity-50">
                {creating ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-6">
          <button
            onClick={() => setShowCreateCourse(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl text-sm font-medium transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Course
          </button>
        </div>
      )}

      {/* Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-1">Total Courses</h3>
          <span className="text-4xl font-bold text-amber-400">{courses.length}</span>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-1">Visible</h3>
          <span className="text-4xl font-bold text-emerald-400">{courses.filter(c => c.visible).length}</span>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-1">Purchasable</h3>
          <span className="text-4xl font-bold text-blue-400">{courses.filter(c => c.purchasable).length}</span>
        </div>
      </div>

      {/* Course Cards */}
      <div className="space-y-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Course Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{course.title}</h3>
                  <span className="text-amber-400 font-bold text-lg">{course.price}</span>
                </div>
                <p className="text-slate-400 text-sm mb-4">{course.description}</p>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${course.visible ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${course.visible ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    {course.visible ? 'Visible to public' : 'Hidden from public'}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${course.purchasable ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-slate-500/10 text-slate-400 border border-slate-500/30'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${course.purchasable ? 'bg-blue-400' : 'bg-slate-400'}`} />
                    {course.purchasable ? 'Open for purchase' : 'Not purchasable'}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-3">Last updated: {new Date(course.updated_at).toLocaleString()}</p>
              </div>

              {/* Toggle Controls */}
              <div className="flex flex-col gap-4 lg:min-w-[280px]">
                {/* Visible Toggle */}
                <div className="flex items-center justify-between bg-slate-900/60 border border-slate-700/40 rounded-xl p-4">
                  <div>
                    <p className="text-white font-medium text-sm">Course Visible</p>
                    <p className="text-slate-500 text-xs">Show on site & navigation</p>
                  </div>
                  <button
                    onClick={() => toggleField(course.course_id, 'visible', course.visible)}
                    disabled={updating === course.course_id + 'visible'}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${course.visible ? 'bg-emerald-500' : 'bg-slate-600'} ${updating === course.course_id + 'visible' ? 'opacity-50' : ''}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${course.visible ? 'translate-x-7' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Purchasable Toggle */}
                <div className="flex items-center justify-between bg-slate-900/60 border border-slate-700/40 rounded-xl p-4">
                  <div>
                    <p className="text-white font-medium text-sm">Open for Purchase</p>
                    <p className="text-slate-500 text-xs">Allow enrolment & payment</p>
                  </div>
                  <button
                    onClick={() => toggleField(course.course_id, 'purchasable', course.purchasable)}
                    disabled={updating === course.course_id + 'purchasable'}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${course.purchasable ? 'bg-blue-500' : 'bg-slate-600'} ${updating === course.course_id + 'purchasable' ? 'opacity-50' : ''}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${course.purchasable ? 'translate-x-7' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Coming Soon Message */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-300 font-medium text-sm">Coming Soon Message</p>
                {editingMessage !== course.course_id ? (
                  <button
                    onClick={() => { setEditingMessage(course.course_id); setMessageText(course.coming_soon_message); }}
                    className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditingMessage(null)} className="text-slate-400 hover:text-white text-sm transition-colors">Cancel</button>
                    <button
                      onClick={() => saveMessage(course.course_id)}
                      disabled={updating === course.course_id + 'message'}
                      className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
                    >
                      {updating === course.course_id + 'message' ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>
              {editingMessage === course.course_id ? (
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm"
                />
              ) : (
                <p className="text-slate-400 text-sm bg-slate-900/40 rounded-xl px-4 py-3">{course.coming_soon_message}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Help Text */}
      <div className="mt-8 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
        <h4 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          How Course Visibility Works
        </h4>
        <ul className="space-y-2 text-slate-400 text-sm">
          <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">1.</span> <strong className="text-slate-300">Hidden</strong> — Course page shows "Coming Soon" and nav links are removed from the site.</li>
          <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">2.</span> <strong className="text-slate-300">Visible but not purchasable</strong> — Course page is viewable but the enrol/buy buttons are disabled with a "Coming Soon" label.</li>
          <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">3.</span> <strong className="text-slate-300">Visible and purchasable</strong> — Full course page with active enrol/buy buttons. Ready for students.</li>
        </ul>
      </div>
        </>
      )}
    </div>
  );
};

export default CourseManager;
