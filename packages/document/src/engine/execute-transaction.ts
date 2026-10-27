/* @layer core @kind logic */
import { CommandFailure } from '../commands/command-failure';
import type { TransactionResult } from '../commands/result.type';
import type { TransactionRequest } from '../commands/transaction.type';
import { createDraft } from '../draft/create-draft';
import type { Draft } from '../draft/draft.type';
import { forkIdSource } from '../ids/fork-id-source';
import { attempt } from './attempt';
import { blameStep } from './blame-step';
import { checkDraft } from './check-draft';
import { checkRequest } from './check-request';
import { commitDraft } from './commit-draft';
import type { EngineStore } from './engine.type';
import { previewResult } from './preview-result';
import { runSteps } from './run-steps';

const checkedDraft = (store: EngineStore, request: TransactionRequest, draft: Draft): void => {
  try {
    checkDraft(draft);
  } catch (error) {
    throw error instanceof CommandFailure ? blameStep(store, request, error) : error;
  }
};

const executeTransaction = (store: EngineStore, request: TransactionRequest): TransactionResult =>
  attempt(store, request.baseRevision, () => {
    checkRequest(store, request);
    const draft = createDraft({ base: store.artwork, ids: forkIdSource(store.ids), stamp: store.clock?.() });
    runSteps({ store, draft, request });
    checkedDraft(store, request, draft);
    return request.mode === 'preview' ? previewResult({ store, draft, request }) : commitDraft({ store, draft, request });
  });

export { executeTransaction };
