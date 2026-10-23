/* @layer core @kind logic */
import type { z } from 'zod';
import { ERROR_CODE } from './error-code.constants';
import { fail } from './fail';

const parseOptions = <S extends z.ZodType>(schema: S, value: unknown, prefix: string): z.output<S> => {
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  const issue = result.error.issues[0];
  const path = [prefix, ...(issue?.path ?? [])].map(String).join('.');
  throw fail(ERROR_CODE.INVALID_OPTION, issue?.message ?? 'The options are not valid.', { path });
};

export { parseOptions };
