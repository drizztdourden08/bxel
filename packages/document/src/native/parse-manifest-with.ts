/* @layer core @kind logic */
import type { z } from 'zod';
import type { ArchiveContents } from './archive.type';
import { ENTRY } from './container.constants';
import { LOAD_ERROR } from './load-error.constants';
import { makeIssue } from './make-issue';
import { parseJson } from './parse-json';
import type { Parsed } from './parsed.type';
import { zodIssues } from './zod-issues';

const parseManifestWith = <T>(archive: ArchiveContents, schema: z.ZodType<T>): Parsed<T> => {
  const bytes = archive.files.get(ENTRY.manifest);
  if (!bytes) {
    return { ok: false, issues: [makeIssue(LOAD_ERROR.MANIFEST_INVALID, 'manifest.json is missing.', ENTRY.manifest)] };
  }
  const json = parseJson(bytes, LOAD_ERROR.MANIFEST_INVALID, ENTRY.manifest);
  if (!json.ok) return json;
  const result = schema.safeParse(json.value);
  if (result.success) return { ok: true, value: result.data };
  return { ok: false, issues: zodIssues(result.error, LOAD_ERROR.MANIFEST_INVALID) };
};

export { parseManifestWith };
