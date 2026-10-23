/* @layer core @kind logic */
import type { EntryCheck } from './entry-check.type';
import { LOAD_ERROR } from './load-error.constants';
import type { LoadIssue } from './load-report.type';
import type { Manifest } from './manifest.type';

const previewIssue = (manifest: Manifest, check: EntryCheck): LoadIssue | null => {
  if (manifest.preview === null) return null;
  const issue = check.problems.get(manifest.preview);
  return issue && issue.code !== LOAD_ERROR.ENTRY_MISSING ? issue : null;
};

export { previewIssue };
