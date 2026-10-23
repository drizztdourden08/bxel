/* @layer core @kind logic */
import { manifestSchema } from '../schema/manifest-schema';
import type { ArchiveContents } from './archive.type';
import { ENTRY } from './container.constants';
import { LOAD_ERROR } from './load-error.constants';
import type { Manifest } from './manifest.type';
import { makeIssue } from './make-issue';
import { parseJson } from './parse-json';
import type { Parsed } from './parsed.type';
import { zodIssues } from './zod-issues';

const parseManifest = (archive: ArchiveContents): Parsed<Manifest> => {
  const bytes = archive.files.get(ENTRY.manifest);
  if (!bytes) {
    return { ok: false, issues: [makeIssue(LOAD_ERROR.MANIFEST_INVALID, 'manifest.json is missing.', ENTRY.manifest)] };
  }
  const json = parseJson(bytes, LOAD_ERROR.MANIFEST_INVALID, ENTRY.manifest);
  if (!json.ok) return json;
  const result = manifestSchema.safeParse(json.value);
  if (result.success) return { ok: true, value: result.data };
  return { ok: false, issues: zodIssues(result.error, LOAD_ERROR.MANIFEST_INVALID) };
};

export { parseManifest };
