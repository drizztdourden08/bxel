/* @layer core @kind logic */
import { DEFAULT_ACTOR } from '../commands/actor.constants';
import type { TransactionResult } from '../commands/result.type';
import { collectOps } from '../history/collect-ops';
import type { HistoryEntry } from '../history/history.type';
import { opsBytes } from '../history/ops-bytes';
import { recordEntry } from '../history/record-entry';
import { computeChanges } from './compute-changes';
import { emptyChanges } from './empty-changes';
import type { DraftRun } from './engine.type';
import { notify } from './notify';
import { okResult } from './ok-result';

const commitDraft = ({ store, draft, request }: DraftRun): TransactionResult => {
  const ops = collectOps(draft);
  const common = {
    mode: 'commit',
    baseRevision: request.baseRevision,
    warnings: draft.warnings,
    created: draft.created,
    report: draft.report,
  } as const;
  const actor = request.actor ?? DEFAULT_ACTOR;
  if (ops.length === 0) {
    return okResult({ ...common, revision: store.revision, changes: emptyChanges(), noop: true });
  }
  const changes = computeChanges(store.artwork, draft.artwork);
  const entry: HistoryEntry = {
    id: store.nextEntryId,
    label: request.label,
    origin: request.origin,
    actor,
    bytes: opsBytes(ops),
    ops,
  };
  const previousRevision = store.revision;
  store.nextEntryId += 1;
  store.history = recordEntry({ history: store.history, entry, limits: store.limits });
  store.artwork = draft.artwork;
  store.ids = draft.ids;
  store.revision += 1;
  notify(store, {
    kind: 'commit',
    documentId: store.documentId,
    revision: store.revision,
    previousRevision,
    label: request.label,
    origin: request.origin,
    actor,
    changes,
  });
  return okResult({ ...common, revision: store.revision, changes });
};

export { commitDraft };
