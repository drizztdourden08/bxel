/* @layer renderer-app @kind logic */
import { MAX_STORED_PROJECTS, MAX_STORED_TABS } from './workspace.constants';
import type { StoredTabs, StoredTabsMap } from './stored-tabs.type';

const isText = (value: unknown): value is string => typeof value === 'string' && value !== '';

const entryOf = (value: unknown): StoredTabs | null => {
  if (typeof value !== 'object' || value === null) return null;
  const { open, active } = value as { open?: unknown; active?: unknown };
  if (!Array.isArray(open)) return null;
  return { open: open.filter(isText).slice(0, MAX_STORED_TABS), active: isText(active) ? active : null };
};

const parseStoredTabs = (value: unknown): StoredTabsMap => {
  if (typeof value !== 'object' || value === null) return {};
  const entries = Object.entries(value).flatMap(([id, each]) => {
    const entry = entryOf(each);
    return entry ? [[id, entry] as const] : [];
  });
  return Object.fromEntries(entries.slice(-MAX_STORED_PROJECTS));
};

export { parseStoredTabs };
