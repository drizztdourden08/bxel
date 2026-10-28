/* @layer renderer-app @kind logic */
import { z } from 'zod';
import { browserViewSchema } from './browser-view-schema';
import { DEFAULT_VIEW } from './project-browser.constants';
import type { SavedBrowserView } from './project-browser.type';

const readBrowserView = (raw: unknown, key: string): SavedBrowserView => {
  const record = z.record(z.string(), z.unknown()).safeParse(raw);
  const held = record.success ? record.data[key] : undefined;
  const parsed = browserViewSchema.safeParse(held ?? {});
  return parsed.success ? parsed.data : DEFAULT_VIEW;
};

export { readBrowserView };
