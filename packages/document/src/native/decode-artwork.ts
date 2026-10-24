/* @layer core @kind logic */
import { checkEntries } from './check-entries';
import { fatalEntryIssues } from './fatal-entry-issues';
import { fatalReport } from './fatal-report';
import { finishReport } from './finish-report';
import { fromDocumentJson } from './from-document-json';
import type { LoadReport } from './load-report.type';
import { openContainer } from './open-container';
import { readDocument } from './read-document';

const decodeArtwork = (bytes: Uint8Array): LoadReport => {
  const opened = openContainer(bytes);
  if (!opened.ok) return fatalReport(opened.issues);
  const { manifest, archive } = opened.value;
  const check = checkEntries(manifest, archive);
  const entryIssues = fatalEntryIssues(manifest, check);
  if (entryIssues.length > 0) return fatalReport(entryIssues);
  const read = readDocument(manifest, check);
  if (!read.ok) return fatalReport(read.issues);
  const built = fromDocumentJson(read.value.document, { good: read.value.blobs, problems: check.problems });
  if (built.issues.length > 0) return fatalReport(built.issues);
  return finishReport({ opened: opened.value, read: read.value, built, check });
};

export { decodeArtwork };
