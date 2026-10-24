/* @layer core @kind logic */
import type { Failure, FailureExtra } from './error.type';
import { retryFor } from './retry-for';

const mcpFailure = (code: string, message: string, extra: FailureExtra = {}): Failure => ({
  ok: false,
  error: {
    code,
    message,
    step: extra.step ?? null,
    path: extra.path ?? null,
    details: [...(extra.details ?? [])],
    retry: extra.retry ?? retryFor(code),
    ...(extra.currentRevision === undefined ? {} : { currentRevision: extra.currentRevision }),
    ...(extra.since === undefined ? {} : { since: [...extra.since] }),
  },
});

export { mcpFailure };
