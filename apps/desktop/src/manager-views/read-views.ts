/* @layer renderer-app @kind logic */
import { managerViewSchema } from './manager-view-schema';
import { MAX_SAVED_VIEWS } from './manager-views.constants';
import type { ManagerViews, SavedManagerView } from './manager-views.type';

const readViews = (raw: unknown): ManagerViews => {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {};
  const found = Object.entries(raw).flatMap(([id, value]): [string, SavedManagerView][] => {
    const parsed = managerViewSchema.safeParse(value);
    return parsed.success ? [[id, parsed.data]] : [];
  });
  return Object.fromEntries(found.slice(-MAX_SAVED_VIEWS));
};

export { readViews };
