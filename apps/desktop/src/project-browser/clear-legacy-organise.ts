/* @layer renderer-app @kind logic */
import { z } from 'zod';
import { browserViewSchema } from './browser-view-schema';
import type { BrowserViews } from './project-browser.type';

/** The saved views without the pins and filters of one project, once they live in its project file. */
const clearLegacyOrganise = (raw: unknown, key: string): BrowserViews => {
  const record = z.record(z.string(), z.unknown()).safeParse(raw);
  if (!record.success) return {};
  return Object.fromEntries(
    Object.entries(record.data).flatMap(([each, value]) => {
      const parsed = browserViewSchema.safeParse(value);
      if (!parsed.success) return [];
      if (each !== key) return [[each, parsed.data] as const];
      const { pinned: _pinned, smart: _smart, ...rest } = parsed.data;
      return [[each, rest] as const];
    }),
  );
};

export { clearLegacyOrganise };
