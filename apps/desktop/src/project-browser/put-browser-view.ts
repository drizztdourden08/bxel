/* @layer renderer-app @kind logic */
import { z } from 'zod';
import { browserViewSchema } from './browser-view-schema';
import { MAX_SAVED_BROWSERS } from './project-browser.constants';
import type { BrowserViews, SavedBrowserView } from './project-browser.type';

const heldViews = (raw: unknown): [string, SavedBrowserView][] => {
  const record = z.record(z.string(), z.unknown()).safeParse(raw);
  if (!record.success) return [];
  return Object.entries(record.data).flatMap(([key, value]): [string, SavedBrowserView][] => {
    const parsed = browserViewSchema.safeParse(value);
    return parsed.success ? [[key, parsed.data]] : [];
  });
};

const putBrowserView = (raw: unknown, key: string, view: SavedBrowserView): BrowserViews =>
  Object.fromEntries([...heldViews(raw).filter(([each]) => each !== key), [key, view]].slice(-MAX_SAVED_BROWSERS));

export { putBrowserView };
