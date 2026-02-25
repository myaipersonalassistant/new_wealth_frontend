/**
 * Dashboard courses - merges Firestore course_settings with static courseData
 * Handles enrollment checks for paid courses; Starter Pack requires Start form submission
 */

import { listCourseSettings } from './firebaseCourseSettings';
import { getUserEnrollments } from './courseEnrollments';
import { hasStarterPackAccess } from './starterPackAccess';
import { beginnerCourse, masterclassCourse, starterPackCourse, getCourseById as getStaticCourse, type CourseData } from '@/data/courseData';
const STATIC_COURSES: Record<string, CourseData> = {
  'beginner-course': beginnerCourse,
  'masterclass': masterclassCourse,
  'starter-pack': starterPackCourse,
};

export interface DashboardCourse extends CourseData {
  isLocked: boolean;
  isFree: boolean;
  price?: string;
  /** For Starter Pack when locked: show Start form CTA instead of purchase */
  requiresStartForm?: boolean;
}

/** Get courses for dashboard - from Firestore, merged with static structure, with enrollment status */
export async function getDashboardCourses(
  userId: string | null,
  userEmail?: string | null
): Promise<DashboardCourse[]> {
  const [settings, enrollments, starterPackUnlocked] = await Promise.all([
    listCourseSettings(),
    userId ? getUserEnrollments(userId) : Promise.resolve([]),
    hasStarterPackAccess(userEmail),
  ]);

  const enrollmentSet = new Set(enrollments);
  const seenIds = new Set<string>();

  const courses: DashboardCourse[] = [];

  for (const s of settings) {
    if (!s.visible) continue;
    seenIds.add(s.course_id);

    const staticCourse = STATIC_COURSES[s.course_id];
    const isFree = s.is_free || s.course_id === 'starter-pack';

    let isLocked: boolean;
    let requiresStartForm = false;

    if (s.course_id === 'starter-pack') {
      isLocked = !starterPackUnlocked;
      requiresStartForm = true;
    } else {
      const isEnrolled = enrollmentSet.has(s.course_id);
      isLocked = !isFree && !isEnrolled;
    }

    const course: DashboardCourse = {
      id: s.course_id,
      title: s.title,
      shortTitle: staticCourse?.shortTitle ?? (s.title.split(' ')[0] || s.title),
      modules: staticCourse?.modules ?? [],
      bonusModule: staticCourse?.bonusModule,
      resources: staticCourse?.resources ?? [],
      isLocked,
      isFree,
      price: s.price,
      requiresStartForm: s.course_id === 'starter-pack' ? true : undefined,
    };

    courses.push(course);
  }

  // Always include Starter Pack (even if not in Firestore)
  if (!seenIds.has('starter-pack')) {
    courses.unshift({
      ...starterPackCourse,
      isLocked: !starterPackUnlocked,
      isFree: true,
      requiresStartForm: true,
    });
  }

  // Ensure starter-pack is first, then by order
  courses.sort((a, b) => {
    if (a.id === 'starter-pack') return -1;
    if (b.id === 'starter-pack') return 1;
    return a.title.localeCompare(b.title);
  });

  return courses;
}

/** Get single course by ID (for compatibility) - prefers static for structure */
export function getCourseById(id: string, fromList?: DashboardCourse[]): DashboardCourse | undefined {
  if (fromList) return fromList.find((c) => c.id === id);
  const staticCourse = getStaticCourse(id);
  if (staticCourse) {
    return { ...staticCourse, isLocked: false, isFree: id === 'starter-pack' };
  }
  return undefined;
}
