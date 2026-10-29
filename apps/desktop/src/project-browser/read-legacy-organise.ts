/* @layer renderer-app @kind logic */
import { z } from 'zod';
import { browserViewSchema } from './browser-view-schema';
import type { LegacyOrganise } from './project-browser.type';

/** The pins and smart filters that older versions kept in the owner's settings for one project. */
const readLegacyOrganise = (raw: unknown, key: string): LegacyOrganise => {
  const record = z.record(z.string(), z.unknown()).safeParse(raw);
  const parsed = browserViewSchema.safeParse((record.success ? record.data[key] : undefined) ?? {});
  return { pinned: parsed.success ? (parsed.data.pinned ?? []) : [], smart: parsed.success ? (parsed.data.smart ?? []) : [] };
};

export { readLegacyOrganise };
