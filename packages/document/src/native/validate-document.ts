/* @layer core @kind logic */
import { projectSchema } from '../schema/project-schema';
import { checkIntegrity } from './check-integrity';
import type { DocumentJson } from './document-json.type';
import { LOAD_ERROR } from './load-error.constants';
import type { Manifest } from './manifest.type';
import { makeIssue } from './make-issue';
import type { Parsed } from './parsed.type';
import { zodIssues } from './zod-issues';

const validateDocument = (json: unknown, manifest: Manifest): Parsed<DocumentJson> => {
  const parsed = projectSchema.safeParse(json);
  if (!parsed.success) return { ok: false, issues: zodIssues(parsed.error, LOAD_ERROR.DOCUMENT_INVALID) };
  const document: DocumentJson = parsed.data;
  const issues = checkIntegrity(document);
  if (issues.length > 0) return { ok: false, issues };
  if (document.id !== manifest.projectId) {
    const mismatch = makeIssue(LOAD_ERROR.DOCUMENT_INVALID, 'The document and the manifest name different projects.', '$.id');
    return { ok: false, issues: [mismatch] };
  }
  return { ok: true, value: document };
};

export { validateDocument };
