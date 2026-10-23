/* @layer core @kind logic */
import { CommandFailure } from '../commands/command-failure';
import type { TransactionResult } from '../commands/result.type';
import type { EngineStore } from './engine.type';
import { failedResult } from './failed-result';

const attempt = (store: EngineStore, baseRevision: number, run: () => TransactionResult): TransactionResult => {
  try {
    return run();
  } catch (error) {
    if (error instanceof CommandFailure) return failedResult(store, baseRevision, error.error);
    throw error;
  }
};

export { attempt };
