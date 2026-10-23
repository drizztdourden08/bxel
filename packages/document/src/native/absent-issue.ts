/* @layer core @kind logic */
import { LOAD_ERROR } from './load-error.constants';
import type { LoadIssue } from './load-report.type';
import { makeIssue } from './make-issue';

const absentIssue = (path: string, problems: ReadonlyMap<string, LoadIssue>): LoadIssue =>
  problems.get(path) ?? makeIssue(LOAD_ERROR.ENTRY_MISSING, `${path} is not listed in the manifest.`, path);

export { absentIssue };
