import React, { useState } from 'react';
import { CourseData, colorMap } from '@/data/courseData';
import type { ModuleStructure } from '@/lib/courseContent';

interface ProgressEntry {
  module_number: number;
  lesson_index: number;
  completed: boolean;
}

interface DashboardCurriculumProps {
  course: CourseData;
  progress: ProgressEntry[];
  onToggleLesson: (moduleNumber: number, lessonIndex: number, completed: boolean) => void;
  onSelectLesson: (moduleNumber: number, lessonIndex: number) => void;
  selectedLesson: { moduleNumber: number; lessonIndex: number } | null;
  firestoreStructure?: ModuleStructure[] | null;
}

const DashboardCurriculum: React.FC<DashboardCurriculumProps> = ({
  course,
  progress,
  onToggleLesson,
  onSelectLesson,
  selectedLesson,
  firestoreStructure,
}) => {
  const [expandedModule, setExpandedModule] = useState<number | null>(1);

  const isCompleted = (moduleNumber: number, lessonIndex: number): boolean => {
    return progress.some(
      (p) => p.module_number === moduleNumber && p.lesson_index === lessonIndex && p.completed
    );
  };

  const getModuleProgress = (moduleNumber: number, lessonCount: number): number => {
    const completed = progress.filter((p) => p.module_number === moduleNumber && p.completed).length;
    return lessonCount > 0 ? Math.round((completed / lessonCount) * 100) : 0;
  };

  const isModuleComplete = (moduleNumber: number, lessonCount: number): boolean => {
    return getModuleProgress(moduleNumber, lessonCount) === 100;
  };

  // Use Firestore structure when available, else fall back to courseData
  const allModules =
    firestoreStructure && firestoreStructure.length > 0
      ? firestoreStructure.map((mod) => ({
          number: mod.number,
          title: mod.title,
          duration: `${mod.episodes.length} lessons`,
          color: 'indigo' as const,
          description: mod.description,
          lessons: mod.episodes.map((ep) => ({
            title: ep.title,
            duration: ep.duration || '',
            description: ep.description || '',
            episodeIndex: ep.index,
          })),
          isBonus: false,
        }))
      : [
          ...course.modules.map((m) => ({
            ...m,
            lessons: m.lessons.map((l, i) => ({ ...l, episodeIndex: i })),
          })),
          ...(course.bonusModule
            ? [
                {
                  number: 0,
                  title: course.bonusModule.title,
                  duration: course.bonusModule.lessons.reduce((acc, l) => acc + parseInt(l.duration), 0) + ' min',
                  color: 'amber' as const,
                  description: course.bonusModule.description,
                  lessons: course.bonusModule.lessons.map((l, i) => ({ ...l, episodeIndex: i })),
                  isBonus: true,
                },
              ]
            : []),
        ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-bold text-lg">Course Curriculum</h3>
        <span className="text-slate-500 text-sm">
          {progress.filter(p => p.completed).length} / {allModules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
        </span>
      </div>

      {allModules.map((mod) => {
        const colors = colorMap[mod.color] || colorMap.indigo;
        const isOpen = expandedModule === mod.number;
        const moduleProgress = getModuleProgress(mod.number, mod.lessons.length);
        const moduleComplete = isModuleComplete(mod.number, mod.lessons.length);
        const isBonus = 'isBonus' in mod && mod.isBonus;

        return (
          <div
            key={mod.number}
            className={`border rounded-2xl overflow-hidden transition-all ${
              isBonus
                ? 'border-dashed border-amber-500/30 bg-amber-500/[0.03]'
                : `${colors.border} ${colors.bg}`
            }`}
          >
            {/* Module Header */}
            <button
              onClick={() => setExpandedModule(isOpen ? null : mod.number)}
              className="w-full px-5 py-4 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 text-left min-w-0">
                {/* Module number / checkmark */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  moduleComplete
                    ? 'bg-emerald-500/20 border border-emerald-500/30'
                    : `${colors.badge} border ${colors.border}`
                }`}>
                  {moduleComplete ? (
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isBonus ? (
                    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  ) : (
                    <span className={`${colors.text} font-bold text-sm`}>{mod.number}</span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-semibold text-sm sm:text-base truncate">
                      {isBonus ? mod.title : `Module ${mod.number}: ${mod.title}`}
                    </h4>
                    {isBonus && (
                      <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">BONUS</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-slate-500 text-xs">{mod.lessons.length} lessons</span>
                    <span className="text-slate-600 text-xs">·</span>
                    <span className="text-slate-500 text-xs">{mod.duration}</span>
                    {moduleProgress > 0 && moduleProgress < 100 && (
                      <>
                        <span className="text-slate-600 text-xs">·</span>
                        <span className={`${colors.text} text-xs font-medium`}>{moduleProgress}%</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Mini progress bar */}
                {moduleProgress > 0 && moduleProgress < 100 && (
                  <div className="hidden sm:block w-16 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${colors.gradient}`}
                      style={{ width: `${moduleProgress}%` }}
                    />
                  </div>
                )}
                <svg
                  className={`w-4 h-4 ${colors.text} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Lessons */}
            <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-5 pb-4 space-y-2">
                {mod.lessons.map((lesson, li) => {
                  const epIndex = 'episodeIndex' in lesson ? lesson.episodeIndex : li;
                  const completed = isCompleted(mod.number, epIndex);
                  const isSelected = selectedLesson?.moduleNumber === mod.number && selectedLesson?.lessonIndex === epIndex;

                  return (
                    <div
                      key={li}
                      className={`flex items-center gap-3 rounded-xl p-3 transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-indigo-500/10 border border-indigo-500/30'
                          : 'bg-slate-800/40 border border-transparent hover:bg-slate-800/60 hover:border-slate-700/40'
                      }`}
                      onClick={() => onSelectLesson(mod.number, epIndex)}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLesson(mod.number, epIndex, !completed);
                        }}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                          completed
                            ? 'bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/30'
                            : 'border-2 border-slate-600 hover:border-indigo-400 bg-transparent'
                        }`}
                      >
                        {completed && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      {/* Lesson info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate transition-colors ${
                          completed ? 'text-slate-500 line-through' : 'text-white'
                        }`}>
                          {lesson.title}
                        </p>
                      </div>

                      {/* Duration */}
                      <span className="text-slate-500 text-xs flex-shrink-0">{lesson.duration}</span>

                      {/* Play icon on hover */}
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected ? 'bg-indigo-500/20' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <svg className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCurriculum;
