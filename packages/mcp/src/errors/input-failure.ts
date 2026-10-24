/* @layer core @kind logic */
import { ERROR_CODE } from '@bxel/document';
import type { z } from 'zod';
import type { Failure } from './error.type';
import { mcpFailure } from './mcp-failure';

const stepOf = (path: readonly PropertyKey[]): number | undefined => {
  const index = path[1];
  return path[0] === 'steps' && typeof index === 'number' ? index : undefined;
};

const codeOf = (issue: z.core.$ZodIssue | undefined, last: string): string => {
  if (issue?.code === 'too_big' && (last === 'steps' || last === 'points')) return ERROR_CODE.BATCH_TOO_LARGE;
  if (issue?.code === 'invalid_union' && last === 'name') return ERROR_CODE.UNKNOWN_COMMAND;
  return ERROR_CODE.INVALID_OPTION;
};

const inputFailure = (error: z.ZodError): Failure => {
  const issue = error.issues[0];
  const path = (issue?.path ?? []).map(String);
  const step = stepOf(issue?.path ?? []);
  const where = path.length === 0 ? 'The input' : path.join('.');
  return mcpFailure(codeOf(issue, path.at(-1) ?? ''), `${where}: ${issue?.message ?? 'The input is not valid.'}`, {
    path: path.join('.'),
    ...(step === undefined ? {} : { step }),
  });
};

export { inputFailure };
