/* @layer core @kind logic */
import { strFromU8 } from 'fflate';
import type { LoadErrorCode } from './load-report.type';
import { makeIssue } from './make-issue';
import type { Parsed } from './parsed.type';

const parseJson = (bytes: Uint8Array, code: LoadErrorCode, path: string): Parsed<unknown> => {
  try {
    const value: unknown = JSON.parse(strFromU8(bytes));
    return { ok: true, value };
  } catch {
    return { ok: false, issues: [makeIssue(code, `${path} is not valid JSON.`, path)] };
  }
};

export { parseJson };
