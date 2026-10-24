/* @layer core @kind logic */
import type { CommandError } from '@bxel/document';
import type { Failure, FailureExtra } from './error.type';
import { mcpFailure } from './mcp-failure';

const engineFailure = (
  error: CommandError,
  extra: Pick<FailureExtra, 'currentRevision' | 'since'> = {},
): Failure =>
  mcpFailure(error.code, error.message, {
    ...extra,
    ...(error.step === null ? {} : { step: error.step }),
    ...(error.path === null ? {} : { path: error.path }),
    details: error.details,
  });

export { engineFailure };
