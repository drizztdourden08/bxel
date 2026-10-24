/* @layer core @kind logic */
import type { z } from 'zod';
import { LOAD_ERROR } from '../load-error.constants';
import type { Parsed } from '../parsed.type';
import { zodIssues } from '../zod-issues';

const parseAssetFile = <T>(json: unknown, schema: z.ZodType<T>): Parsed<T> => {
  const result = schema.safeParse(json);
  if (result.success) return { ok: true, value: result.data };
  return { ok: false, issues: zodIssues(result.error, LOAD_ERROR.DOCUMENT_INVALID) };
};

export { parseAssetFile };
