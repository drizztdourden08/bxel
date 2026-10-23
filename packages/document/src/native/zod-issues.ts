/* @layer core @kind logic */
import type { z } from 'zod';
import { MAX_REPORTED_ISSUES } from './container.constants';
import type { LoadErrorCode, LoadIssue } from './load-report.type';
import { makeIssue } from './make-issue';

const jsonPath = (path: readonly PropertyKey[]): string =>
  path.reduce<string>(
    (text, key) => (typeof key === 'number' ? `${text}[${key}]` : `${text}.${String(key)}`),
    '$',
  );

const zodIssues = (error: z.ZodError, code: LoadErrorCode): readonly LoadIssue[] =>
  error.issues.slice(0, MAX_REPORTED_ISSUES).map((item) => makeIssue(code, item.message, jsonPath(item.path)));

export { zodIssues };
