/* @layer renderer-app @kind logic */
import { z } from 'zod';
import { DEFAULT_SORT, DEFAULT_VIEW, MAX_SAVED_BROWSERS, THUMB_STOPS } from './project-browser.constants';
import type { SavedBrowserView } from './project-browser.type';

const sortSchema = z
  .object({ key: z.enum(['name', 'kind', 'modified', 'folder', 'size', 'frames', 'usedBy']).catch('name'), descending: z.boolean().catch(false) })
  .catch(DEFAULT_SORT);

const viewSchema = z.object({
  view: z.enum(['grid', 'list', 'columns']).catch(DEFAULT_VIEW.view),
  size: z.number().int().refine((value) => THUMB_STOPS.includes(value)).catch(DEFAULT_VIEW.size),
  sort: sortSchema,
  preview: z.boolean().catch(DEFAULT_VIEW.preview),
  folder: z.string().nullable().catch(null),
  pinned: z.array(z.string()).catch([]),
  smart: z.array(z.object({ id: z.string(), name: z.string(), query: z.string() })).catch([]),
});

type BrowserViews = Readonly<Record<string, SavedBrowserView>>;

const readBrowserView = (raw: unknown, key: string): SavedBrowserView => {
  const held = typeof raw === 'object' && raw !== null && !Array.isArray(raw) ? (raw as Record<string, unknown>)[key] : undefined;
  const parsed = viewSchema.safeParse(held ?? {});
  return parsed.success ? parsed.data : DEFAULT_VIEW;
};

const putBrowserView = (raw: unknown, key: string, view: SavedBrowserView): BrowserViews => {
  const held = typeof raw === 'object' && raw !== null && !Array.isArray(raw) ? Object.entries(raw as Record<string, SavedBrowserView>) : [];
  return Object.fromEntries([...held.filter(([each]) => each !== key), [key, view]].slice(-MAX_SAVED_BROWSERS));
};

export { putBrowserView, readBrowserView };
export type { BrowserViews };
