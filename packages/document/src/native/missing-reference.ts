/* @layer core @kind logic */
import { LOAD_ERROR } from './load-error.constants';
import type { LoadIssue } from './load-report.type';
import { makeIssue } from './make-issue';

const missingReference = (
  known: ReadonlySet<string>,
  id: string | null,
  kind: string,
  path: string,
): readonly LoadIssue[] =>
  id === null || known.has(id) ? [] : [makeIssue(LOAD_ERROR.REFERENCE_BROKEN, `No ${kind} has the id ${id}.`, path)];

export { missingReference };
