/* @layer core @kind logic */
import type { TransactionResult } from '../commands/result.type';
import { buildPreview } from './build-preview';
import { computeChanges } from './compute-changes';
import type { DraftRun } from './engine.type';
import { isEmptyChanges } from './is-empty-changes';
import { okResult } from './ok-result';

const previewResult = ({ store, draft, request }: DraftRun): TransactionResult => {
  const changes = computeChanges(store.artwork, draft.artwork);
  return okResult({
    mode: 'preview',
    baseRevision: request.baseRevision,
    revision: store.revision,
    changes,
    noop: isEmptyChanges(changes),
    warnings: draft.warnings,
    created: draft.created,
    report: draft.report,
    preview: buildPreview({ artwork: draft.artwork, base: store.artwork, changes, previewPixels: request.previewPixels }),
  });
};

export { previewResult };
