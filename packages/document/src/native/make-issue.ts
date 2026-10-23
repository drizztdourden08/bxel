/* @layer core @kind logic */
import type { LoadErrorCode, LoadIssue } from './load-report.type';

const makeIssue = (code: LoadErrorCode, message: string, path: string | null = null): LoadIssue => ({
  code,
  message,
  path,
});

export { makeIssue };
