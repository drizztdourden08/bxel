/* @layer core @kind logic */
import type { TransactionResult } from '../commands/result.type';
import type { TransactionRequest } from '../commands/transaction.type';
import { createDraft } from '../draft/create-draft';
import { forkIdSource } from '../ids/fork-id-source';
import { attempt } from './attempt';
import { checkDraft } from './check-draft';
import { checkRequest } from './check-request';
import { commitDraft } from './commit-draft';
import type { EngineStore } from './engine.type';
import { previewResult } from './preview-result';
import { runSteps } from './run-steps';

const executeTransaction = (store: EngineStore, request: TransactionRequest): TransactionResult =>
  attempt(store, request.baseRevision, () => {
    checkRequest(store, request);
    const draft = createDraft({ base: store.project, ids: forkIdSource(store.ids) });
    runSteps({ store, draft, request });
    checkDraft(draft);
    return request.mode === 'preview' ? previewResult({ store, draft, request }) : commitDraft({ store, draft, request });
  });

export { executeTransaction };
