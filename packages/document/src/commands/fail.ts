/* @layer core @kind logic */
import type { ErrorCode, FailExtra } from './command-error.type';
import { CommandFailure } from './command-failure';

const fail = (code: ErrorCode, message: string, extra: FailExtra = {}): CommandFailure =>
  new CommandFailure({
    code,
    message,
    step: extra.step ?? null,
    path: extra.path ?? null,
    details: extra.details ?? [],
  });

export { fail };
