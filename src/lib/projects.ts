import type { Project } from './types';
import { asDate } from './dates';

/*
  কোনো হার্ডকোড করা ক্যাটাগরি তালিকা নেই — ক্যাটাগরি আসে Firestore-এর
  `categories` কালেকশন থেকে (src/lib/useCategories.ts), আর তা না থাকলে
  প্রজেক্টগুলোর `category` ফিল্ড থেকে অটোমেটিক বানানো হয়। অর্থাৎ নতুন
  প্রজেক্টে নতুন ক্যাটাগরি-স্লাগ দিলেই ফিল্টারে নতুন অপশন দেখা যাবে।

  এই ফাইলে শুধু লেবেল/গ্রেডিয়েন্ট হেল্পার আছে।
*/

const LEGACY_LABELS: Record<string, string> = {
  developer: 'Developer Tool',
  everyday: 'Everyday Tool',
  design: 'Design Tool',
};

/** "api-testing" → "Api testing" (প্রথম অক্ষর বড়) */
export function prettifyCategory(id: string): string {
  const words = id.replace(/[-_]+/g, ' ').trim();
  if (!words) return 'Other';
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * " Lable " → "lable" — Firestore-এর category/category-slug যেকোনো
 * হাতের লেখায় (বড়-ছোট অক্ষর, স্পেস/আন্ডারস্কোর) এলেও ফিল্টার তুলনাটা
 * যেন সবসময় মেলে, সেজন্য একই স্লাগ-আকারে আনা হয়।
 */
export function normalizeCategoryId(id: string): string {
  return id.trim().toLowerCase().replace(/[\s_]+/g, '-');
}

export interface CategoryRef {
  id: string;
  label: string;
}

/**
 * প্রজেক্ট কি選 সিলেক্ট করা category-র মধ্যে পড়ে?
 * Firestore-এ category doc-এর id/slug আর প্রজেক্টের `category` ফিল্ডে
 * হুবহু একই লেখা নাও থাকতে পারে (যেমন id "Slug" কিন্তু প্রজেক্টে
 * "Lable") — তাই id মিললে তো বটেই, সিলেক্ট করা category-র label-এর
 * সাথেও মিলিয়ে দেখা হয়। 'all' হলে সব প্রজেক্টই মেলে।
 */
export function categoryMatches(
  projectCategory: string | undefined,
  selectedId: string,
  categories: CategoryRef[],
): boolean {
  if (selectedId === 'all') return true;
  const pc = normalizeCategoryId(projectCategory ?? '');
  if (!pc) return false;
  if (pc === selectedId) return true;
  const selected = categories.find((c) => c.id === selectedId);
  return !!selected && pc === normalizeCategoryId(selected.label);
}

export function categoryLabel(id: string): string {
  return LEGACY_LABELS[id] ?? prettifyCategory(id ?? '');
}

/** Default gradient used for fallback tiles when an image link fails. */
export const CATEGORY_ACCENT: Record<string, string> = {
  developer: 'from-violet-500 to-purple-700',
  everyday: 'from-sky-400 to-blue-600',
  design: 'from-emerald-400 to-teal-600',
};

export function projectAccent(project: Pick<Project, 'accent' | 'category'>): string {
  if (project.accent && project.accent.trim()) return project.accent;
  return CATEGORY_ACCENT[project.category] ?? 'from-brand to-ember';
}

export function projectDomain(project: Pick<Project, 'domain' | 'projectUrl'>): string {
  if (project.domain && project.domain.trim()) return project.domain;
  try {
    return new URL(project.projectUrl).host;
  } catch {
    return project.projectUrl.replace(/^https?:\/\//, '').split('/')[0] || project.projectUrl;
  }
}

export function projectYear(project: Pick<Project, 'year' | 'createdAt'>): number | null {
  if (typeof project.year === 'number') return project.year;
  const date = asDate(project.createdAt);
  return date ? date.getFullYear() : null;
}
