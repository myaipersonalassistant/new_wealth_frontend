import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { onAuthStateChange, getUserProfile, signOutUser } from '@/lib/firebaseAuth';
import { getStudentProgress, upsertProgress } from '@/lib/firebaseStudentProgress';
import { getTotalLessons } from '@/data/courseData';
import { getDashboardCourses, type DashboardCourse } from '@/lib/dashboardCourses';
import { getCourseStructure, type ModuleStructure } from '@/lib/courseContent';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import { CoursePurchaseButton } from '@/components/Course/CoursePurchaseButton';
import DashboardCurriculum from '@/components/Dashboard/DashboardCurriculum';
import DashboardResources from '@/components/Dashboard/DashboardResources';
import DashboardNotes, { DashboardNotesEmpty } from '@/components/Dashboard/DashboardNotes';
import StarterResources from '@/components/Dashboard/StarterResources';
import CourseContentPreview from '@/components/Dashboard/CourseContentPreview';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { User } from 'firebase/auth';


interface ProgressEntry {
  module_number: number;
  lesson_index: number;
  completed: boolean;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<DashboardCourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState('starter-pack');

  // Load dashboard courses (from Firestore + enrollment status)
  useEffect(() => {
    if (!user) {
      setCourses([]);
      setCoursesLoading(false);
      return;
    }
    setCoursesLoading(true);
    getDashboardCourses(user.uid, user.email).then((list) => {
      setCourses(list);
      if (list.length > 0 && !selectedCourseId) setSelectedCourseId(list[0].id);
      setCoursesLoading(false);
    });
  }, [user]);

  // Sync tab from URL (e.g. from Thanks page link)
  useEffect(() => {
    if (tabParam && courses.some((c) => c.id === tabParam)) setSelectedCourseId(tabParam);
  }, [tabParam, courses]);

  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<{ moduleNumber: number; lessonIndex: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'resources' | 'notes'>('curriculum');
  const [userProfile, setUserProfile] = useState<{ full_name: string } | null>(null);
  const [firestoreStructure, setFirestoreStructure] = useState<ModuleStructure[] | null>(null);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) ?? courses[0];
  const isStarterPack = selectedCourseId === 'starter-pack';
  const totalLessons = !selectedCourse || isStarterPack
    ? 0
    : firestoreStructure
      ? firestoreStructure.reduce((acc, m) => acc + m.episodes.length, 0)
      : getTotalLessons(selectedCourse);
  const completedCount = progress.filter(p => p.completed).length;

  // Auth check (Firebase)
  useEffect(() => {
    const unsub = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        getUserProfile(firebaseUser.uid).then((p) => {
          if (p) setUserProfile({ full_name: p.full_name });
        });
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const p = await getUserProfile(userId);
    if (p) setUserProfile({ full_name: p.full_name });
  };

  // Load progress when user or course changes (skip for Starter Pack)
  useEffect(() => {
    if (!user || selectedCourseId === 'starter-pack') return;

    const loadProgress = async () => {
      const data = await getStudentProgress(user.uid, selectedCourseId);
      setProgress(data.map((p) => ({ module_number: p.module_number, lesson_index: p.lesson_index, completed: p.completed })));
    };

    loadProgress();
  }, [user, selectedCourseId]);

  // Load curriculum structure from Firestore (for beginner-course and masterclass)
  useEffect(() => {
    if (selectedCourseId === 'starter-pack') {
      setFirestoreStructure(null);
      return;
    }
    getCourseStructure(selectedCourseId).then((s) => setFirestoreStructure(s.length > 0 ? s : null));
  }, [selectedCourseId]);

  // Redirect to auth if not authenticated (must be before any early returns)
  useEffect(() => {
    if (!loading && !user) {
      const redirectPath = '/dashboard' + (tabParam ? `?tab=${tabParam}` : '');
      navigate(`/auth?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }, [loading, user, navigate, tabParam]);

  // Toggle lesson completion
  const handleToggleLesson = useCallback(async (moduleNumber: number, lessonIndex: number, completed: boolean) => {
    if (!user) return;

    // Optimistic update
    setProgress(prev => {
      const existing = prev.find(p => p.module_number === moduleNumber && p.lesson_index === lessonIndex);
      if (existing) {
        return prev.map(p =>
          p.module_number === moduleNumber && p.lesson_index === lessonIndex
            ? { ...p, completed }
            : p
        );
      }
      return [...prev, { module_number: moduleNumber, lesson_index: lessonIndex, completed }];
    });

    await upsertProgress(user.uid, selectedCourseId, moduleNumber, lessonIndex, completed);
  }, [user, selectedCourseId]);

  // Find next uncompleted lesson
  const getNextLesson = useCallback(() => {
    const allLessons: { moduleNumber: number; lessonIndex: number; title: string; moduleName: string }[] = [];

    if (firestoreStructure && firestoreStructure.length > 0) {
      firestoreStructure.forEach((mod) => {
        mod.episodes.forEach((ep, li) => {
          allLessons.push({
            moduleNumber: mod.number,
            lessonIndex: ep.index,
            title: ep.title,
            moduleName: mod.title,
          });
        });
      });
    } else if (selectedCourse?.modules) {
      selectedCourse.modules.forEach((mod) => {
        mod.lessons.forEach((lesson, li) => {
          allLessons.push({
            moduleNumber: mod.number,
            lessonIndex: li,
            title: lesson.title,
            moduleName: mod.title,
          });
        });
      });
      if (selectedCourse.bonusModule) {
        selectedCourse.bonusModule.lessons.forEach((lesson, li) => {
          allLessons.push({
            moduleNumber: 0,
            lessonIndex: li,
            title: lesson.title,
            moduleName: selectedCourse.bonusModule!.title,
          });
        });
      }
    }

    for (const lesson of allLessons) {
      const isCompleted = progress.some(
        (p) => p.module_number === lesson.moduleNumber && p.lesson_index === lesson.lessonIndex && p.completed
      );
      if (!isCompleted) return lesson;
    }

    return null;
  }, [selectedCourse, firestoreStructure, progress]);

  const nextLesson = getNextLesson();

  const handleResumeClick = () => {
    if (nextLesson) {
      setSelectedLesson({ moduleNumber: nextLesson.moduleNumber, lessonIndex: nextLesson.lessonIndex });
      setActiveTab('notes');
    }
  };

  const handleSelectLesson = (moduleNumber: number, lessonIndex: number) => {
    setSelectedLesson({ moduleNumber, lessonIndex });
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedLesson(null);
    setProgress([]);
  };

  // Get lesson details for notes
  const getSelectedLessonDetails = () => {
    if (!selectedLesson) return null;

    if (firestoreStructure && firestoreStructure.length > 0) {
      const mod = firestoreStructure.find((m) => m.number === selectedLesson.moduleNumber);
      if (mod) {
        const ep = mod.episodes.find((e) => e.index === selectedLesson.lessonIndex);
        if (ep) return { title: ep.title, moduleName: mod.title };
      }
      return null;
    }

    if (!selectedCourse?.modules) return null;
    const mod = selectedCourse.modules.find((m) => m.number === selectedLesson.moduleNumber);
    if (mod) {
      const lesson = mod.lessons[selectedLesson.lessonIndex];
      if (lesson) return { title: lesson.title, moduleName: mod.title };
    }

    if (selectedLesson.moduleNumber === 0 && selectedCourse.bonusModule) {
      const lesson = selectedCourse.bonusModule.lessons[selectedLesson.lessonIndex];
      if (lesson) return { title: lesson.title, moduleName: selectedCourse.bonusModule!.title };
    }

    return null;
  };

  const lessonDetails = getSelectedLessonDetails();

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/');
  };

  const getDisplayName = () => {
    if (userProfile?.full_name) return userProfile.full_name;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Student';
  };

  const getInitials = () => {
    if (userProfile?.full_name) {
      const names = userProfile.full_name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) return user.email[0].toUpperCase();
    return 'S';
  };

  // Loading state
  if (loading || (user && coursesLoading && courses.length === 0)) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show loading while redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Redirecting to Sign In...</h1>
          <p className="text-slate-400">
            Please sign in to access your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <Header />


      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              My Learning Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Track your progress, take notes, and access your course resources.</p>
          </div>

          {/* Header: Course selector, stats, resume */}
          <DashboardHeader
            courses={courses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={handleCourseChange}
            completedCount={completedCount}
            totalLessons={totalLessons}
            nextLesson={isStarterPack || selectedCourse?.isLocked ? null : nextLesson}
            onResumeClick={handleResumeClick}
            isStarterPack={isStarterPack}
          />

          {/* Locked Starter Pack: show Start form CTA */}
          {selectedCourse?.isLocked && selectedCourse?.requiresStartForm ? (
            <div className="mt-8 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Unlock Starter Pack</h2>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Fill out the form on the Start page to get free access — videos, guides, spreadsheets, and more.
              </p>
              <Link
                to="/start"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all"
              >
                Get Starter Pack — It&apos;s Free
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ) : selectedCourse?.isLocked ? (
            /* Locked paid course: show purchase CTA */
            <div className="mt-8 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Unlock {selectedCourse.title}</h2>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Purchase this course to access all modules, videos, and resources.
              </p>
              <div className="max-w-sm mx-auto">
                <CoursePurchaseButton
                  courseId={selectedCourse.id}
                  priceLabel={selectedCourse.price || 'Purchase'}
                  variant={selectedCourse.id === 'masterclass' ? 'amber' : 'indigo'}
                  fullWidth
                />
              </div>
              <p className="text-slate-500 text-sm mt-4">
                Have a coupon? Enter it above or{' '}
                <Link
                  to={selectedCourse.id === 'beginner-course' ? '/course' : '/masterclass'}
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  view full course details
                </Link>
              </p>
            </div>
          ) : isStarterPack ? (
            <div className="mt-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Starter Resources</h2>
                <p className="text-slate-400 mt-1">Your free resources — videos, guides, spreadsheets, and more.</p>
              </div>
              <StarterResources />
            </div>
          ) : !selectedCourse ? (
            <div className="mt-8 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-12 text-center">
              <p className="text-slate-400">No courses available yet. Check back soon.</p>
            </div>
          ) : (
            <>
          {/* Mobile Tab Switcher */}
          <div className="flex lg:hidden gap-1 mt-8 bg-slate-800/40 border border-slate-700/30 rounded-xl p-1">
            {[
              { id: 'curriculum' as const, label: 'Curriculum', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
              { id: 'resources' as const, label: 'Resources', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
              { id: 'notes' as const, label: 'Notes', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Grid */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Curriculum */}
            <div className={`lg:col-span-5 ${activeTab !== 'curriculum' ? 'hidden lg:block' : ''}`}>
              <DashboardCurriculum
                course={selectedCourse}
                progress={progress}
                onToggleLesson={handleToggleLesson}
                onSelectLesson={handleSelectLesson}
                selectedLesson={selectedLesson}
                firestoreStructure={firestoreStructure}
              />
            </div>

            {/* Right Column: Resources + Notes */}
            <div className={`lg:col-span-7 space-y-8 ${activeTab === 'curriculum' ? 'hidden lg:block' : ''}`}>
              {/* Resources */}
              <div className={`${activeTab === 'notes' ? 'hidden lg:block' : ''}`}>
                <DashboardResources resources={selectedCourse.resources} />
              </div>

              {/* Content Preview + Notes */}
              <div className={`${activeTab === 'resources' ? 'hidden lg:block' : ''}`}>
                {selectedLesson && lessonDetails ? (
                    <CourseContentPreview
                      courseId={selectedCourseId}
                      moduleNumber={selectedLesson.moduleNumber}
                      lessonIndex={selectedLesson.lessonIndex}
                      lessonTitle={lessonDetails.title}
                      moduleName={lessonDetails.moduleName}
                    >
                      <DashboardNotes
                        courseId={selectedCourseId}
                        moduleNumber={selectedLesson.moduleNumber}
                        lessonIndex={selectedLesson.lessonIndex}
                        lessonTitle={lessonDetails.title}
                        moduleName={lessonDetails.moduleName}
                        userId={user.uid}
                      />
                    </CourseContentPreview>
                ) : (
                  <DashboardNotesEmpty />
                )}
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer compact />

    </div>
  );
};

export default Dashboard;
