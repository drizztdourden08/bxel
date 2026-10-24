/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { TransactionResult } from '../commands/result.type';
import { applyRedo } from '../history/apply-redo';
import { applyUndo } from '../history/apply-undo';
import type { HistoryEntry } from '../history/history.type';
import { attempt } from './attempt';
import { computeChanges } from './compute-changes';
import type { EngineStore, HistoryRun } from './engine.type';
import { guardDocument } from './guard-document';
import { notify } from './notify';
import { okResult } from './ok-result';

const entryFor = ({ store, request, direction }: HistoryRun): HistoryEntry => {
  guardDocument(store, request.documentId, request.expectedRevision);
  const { entries, cursor } = store.history;
  const entry = direction === 'undo' ? entries[cursor - 1] : entries[cursor];
  if (entry) return entry;
  const code = direction === 'undo' ? ERROR_CODE.NOTHING_TO_UNDO : ERROR_CODE.NOTHING_TO_REDO;
  throw fail(code, `There is nothing to ${direction}.`);
};

const applyStep = (store: EngineStore, { direction }: HistoryRun, entry: HistoryEntry): TransactionResult => {
  const artwork = direction === 'undo' ? applyUndo(store.artwork, entry) : applyRedo(store.artwork, entry);
  const changes = computeChanges(store.artwork, artwork);
  const previousRevision = store.revision;
  store.artwork = artwork;
  store.revision += 1;
  store.history = { ...store.history, cursor: store.history.cursor + (direction === 'undo' ? -1 : 1) };
  notify(store, {
    kind: direction,
    documentId: store.documentId,
    revision: store.revision,
    previousRevision,
    label: entry.label,
    origin: entry.origin,
    actor: entry.actor,
    changes,
  });
  return okResult({ mode: 'commit', baseRevision: previousRevision, revision: store.revision, changes });
};

const stepHistory = (run: HistoryRun): TransactionResult =>
  attempt(run.store, run.request.expectedRevision, () => applyStep(run.store, run, entryFor(run)));

export { stepHistory };
