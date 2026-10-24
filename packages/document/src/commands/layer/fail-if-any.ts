/* @layer core @kind logic */
import type { ErrorCode, TargetIssue } from '../command-error.type';
import { fail } from '../fail';

const failIfAny = (code: ErrorCode, message: string, details: readonly TargetIssue[]): void => {
  if (details.length > 0) throw fail(code, message, { details });
};

export { failIfAny };
