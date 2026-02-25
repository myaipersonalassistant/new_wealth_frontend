import React from 'react';
import { getTotalLessons, getTotalDuration } from '@/data/courseData';
import type { CourseData } from '@/data/courseData';

interface DashboardHeaderProps {
  courses: (CourseData & { isLocked?: boolean })[];
  selectedCourseId: string;
  onSelectCourse: (id: string) => void;
  completedCount: number;
  totalLessons: number;
  nextLesson: { moduleNumber: number; lessonIndex: number; title: string; moduleName: string } | null;
  onResumeClick: () => void;
  isStarterPack?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  courses,
  selectedCourseId,
  onSelectCourse,
  completedCount,
  totalLessons,
  nextLesson,
  onResumeClick,
  isStarterPack = false,
}) => {
  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const duration = selectedCourse ? getTotalDuration(selectedCourse) : 0;

  return (
    <div className="space-y-6">
      {/* Course Selector Tabs */}
      <div className="flex flex-wrap gap-3">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => onSelectCourse(course.id)}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
              selectedCourseId === course.id
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            {course.shortTitle}
            {course.isLocked && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <title>Locked - Purchase to unlock</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Stats Cards - hidden for Starter Pack */}
      {!isStarterPack && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm font-medium">Overall Progress</span>
            <span className={`text-lg font-bold ${percentage === 100 ? 'text-emerald-400' : 'text-indigo-400'}`}>
              {percentage}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                percentage === 100
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Lessons Completed */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium">Lessons Done</p>
              <p className="text-white text-xl font-bold">{completedCount} <span className="text-slate-500 text-sm font-normal">/ {totalLessons}</span></p>
            </div>
          </div>
        </div>

        {/* Total Duration */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium">Total Duration</p>
              <p className="text-white text-xl font-bold">{Math.floor(duration / 60)}h {duration % 60}m</p>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium">Modules</p>
              <p className="text-white text-xl font-bold">{selectedCourse?.modules.length || 0}{selectedCourse?.bonusModule ? ' + Bonus' : ''}</p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Quick Resume - hidden for Starter Pack */}
      {!isStarterPack && nextLesson && percentage < 100 && (
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Continue where you left off</p>
              <p className="text-white font-semibold">{nextLesson.title}</p>
              <p className="text-slate-500 text-sm">Module {nextLesson.moduleNumber}: {nextLesson.moduleName}</p>
            </div>
          </div>
          <button
            onClick={onResumeClick}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 flex items-center gap-2 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            Resume Lesson
          </button>
        </div>
      )}

      {/* Completed Banner - hidden for Starter Pack */}
      {!isStarterPack && percentage === 100 && (
        <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <p className="text-emerald-400 font-bold text-lg">Course Complete!</p>
            <p className="text-slate-400 text-sm">Congratulations! You've completed all lessons in this course.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
