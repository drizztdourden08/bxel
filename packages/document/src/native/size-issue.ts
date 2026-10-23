/* @layer core @kind logic */
import type { ListedEntry } from './archive.type';
import { MAX_ENTRY_BYTES, MAX_TOTAL_BYTES } from './container.constants';
import { LOAD_ERROR } from './load-error.constants';
import type { LoadIssue } from './load-report.type';
import { makeIssue } from './make-issue';

const sizeIssue = (listed: readonly ListedEntry[]): LoadIssue | null => {
  const oversized = listed.find((entry) => entry.size > MAX_ENTRY_BYTES);
  if (oversized) {
    return makeIssue(LOAD_ERROR.FILE_TOO_LARGE, `${oversized.name} declares more than the entry limit.`, oversized.name);
  }
  const total = listed.reduce((sum, entry) => sum + entry.size, 0);
  return total > MAX_TOTAL_BYTES ? makeIssue(LOAD_ERROR.FILE_TOO_LARGE, 'The archive declares more than the total limit.') : null;
};

export { sizeIssue };
