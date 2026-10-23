/* @layer core @kind logic */
import type { CommandError } from '../commands/command-error.type';
import type { TransactionFailed } from '../commands/result.type';
import type { EngineStore } from './engine.type';

const failedResult = (store: EngineStore, baseRevision: number, error: CommandError): TransactionFailed => ({
  ok: false,
  baseRevision,
  revision: store.revision,
  error,
});

export { failedResult };
