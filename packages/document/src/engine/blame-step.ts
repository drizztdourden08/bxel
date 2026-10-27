/* @layer core @kind logic */
import { CommandFailure } from '../commands/command-failure';
import type { TransactionRequest } from '../commands/transaction.type';
import { createDraft } from '../draft/create-draft';
import { forkIdSource } from '../ids/fork-id-source';
import { checkDraft } from './check-draft';
import type { EngineStore } from './engine.type';
import { runSteps } from './run-steps';

const failsAfter = (store: EngineStore, request: TransactionRequest, count: number): boolean => {
  try {
    const draft = createDraft({ base: store.artwork, ids: forkIdSource(store.ids), stamp: store.clock?.() });
    runSteps({ store, draft, request: { ...request, steps: request.steps.slice(0, count) } });
    checkDraft(draft);
    return false;
  } catch {
    return true;
  }
};

const firstFailingStep = (store: EngineStore, request: TransactionRequest): number => {
  for (let count = 1; count < request.steps.length; count += 1) {
    if (failsAfter(store, request, count)) return count - 1;
  }
  return request.steps.length - 1;
};

const blameStep = (store: EngineStore, request: TransactionRequest, failure: CommandFailure): CommandFailure =>
  failure.error.step === null && request.steps.length > 0
    ? new CommandFailure({ ...failure.error, step: firstFailingStep(store, request) })
    : failure;

export { blameStep };
