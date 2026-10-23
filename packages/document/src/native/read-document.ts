/* @layer core @kind logic */
import { absentIssue } from './absent-issue';
import type { EntryCheck } from './entry-check.type';
import { FORMAT_VERSION } from './container.constants';
import { LOAD_ERROR } from './load-error.constants';
import type { Manifest } from './manifest.type';
import { makeIssue } from './make-issue';
import { migrate } from './migrations/migrate';
import { parseJson } from './parse-json';
import type { Parsed } from './parsed.type';
import type { ReadDocument } from './read-document.type';
import { validateDocument } from './validate-document';

const readDocument = (manifest: Manifest, check: EntryCheck): Parsed<ReadDocument> => {
  const path = manifest.document;
  const bytes = check.good.get(path);
  if (!bytes) return { ok: false, issues: [absentIssue(path, check.problems)] };
  const json = parseJson(bytes, LOAD_ERROR.DOCUMENT_INVALID, path);
  if (!json.ok) return json;
  const migrated = migrate({ document: json.value, blobs: check.good }, manifest.formatVersion);
  if (!migrated) {
    const stuck = makeIssue(LOAD_ERROR.DOCUMENT_INVALID, `No migration leads from format ${manifest.formatVersion}.`, path);
    return { ok: false, issues: [stuck] };
  }
  const document = validateDocument(migrated.document, manifest);
  if (!document.ok) return document;
  return {
    ok: true,
    value: { document: document.value, blobs: migrated.blobs, migrated: manifest.formatVersion < FORMAT_VERSION },
  };
};

export { readDocument };
