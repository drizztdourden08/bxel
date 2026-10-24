/* @layer core @kind logic */
import { MAX_RECENT_PROJECTS } from './recent.constants';
import { recentSchema } from './recent-schema';
import type { RecentProject } from './recent.type';

const parseRecentProjects = (value: unknown): readonly RecentProject[] => {
  if (!Array.isArray(value)) return [];
  const kept: RecentProject[] = [];
  for (const entry of value as unknown[]) {
    const parsed = recentSchema.safeParse(entry);
    if (parsed.success) kept.push(parsed.data);
  }
  return kept.slice(0, MAX_RECENT_PROJECTS);
};

export { parseRecentProjects };
