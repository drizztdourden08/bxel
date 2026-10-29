/* @layer renderer-app @kind logic */
import { z } from 'zod';
import { browserViewSchema } from './browser-view-schema';
import { MAX_SAVED_BROWSERS } from './project-browser.constants';
import type { BrowserViews, SavedBrowserView, StoredBrowserView } from './project-browser.type';

const heldViews = (raw: unknown): [string, StoredBrowserView][] => {
  const record = z.record(z.string(), z.unknown()).safeParse(raw);
  if (!record.success) return [];
  return Object.entries(record.data).flatMap(([key, value]): [string, StoredBrowserView][] => {
    const parsed = browserViewSchema.safeParse(value);
    return parsed.success ? [[key, parsed.data]] : [];
  });
};

const putBrowserView = (raw: unknown, key: string, view: SavedBrowserView): BrowserViews => {
  const held = heldViews(raw);
  const older = held.find(([each]) => each === key)?.[1];
  const legacy = older === undefined ? {} : { ...(older.pinned ? { pinned: older.pinned } : {}), ...(older.smart ? { smart: older.smart } : {}) };
  const entries: [string, StoredBrowserView][] = [...held.filter(([each]) => each !== key), [key, { ...view, ...legacy }]];
  return Object.fromEntries(entries.slice(-MAX_SAVED_BROWSERS));
};

export { putBrowserView };
