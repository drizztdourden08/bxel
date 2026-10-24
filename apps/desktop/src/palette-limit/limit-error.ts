/* @layer renderer-app @kind logic */
import { LIMIT_RANGE, LIMIT_TEXT } from './palette-limit.constants';

const limitError = (limit: number): string | null =>
  Number.isInteger(limit) && limit >= LIMIT_RANGE.min && limit <= LIMIT_RANGE.max ? null : LIMIT_TEXT.range;

export { limitError };
