/* @layer renderer-app @kind logic */
import type { TargetScope, TransactionRequest } from '@bxel/document';
import { cellScope } from './cell-scope';
import type { CommitStep } from './commit-request.type';
import type { EditorTarget } from './editor.type';

const commitRequest = (
  target: EditorTarget,
  label: string,
  step: CommitStep,
  scope: TargetScope = cellScope(target),
): TransactionRequest => ({
  documentId: target.documentId,
  baseRevision: target.revision,
  mode: 'commit',
  origin: 'ui',
  label,
  steps: [{ name: step.name, targets: scope, options: step.options, ...(step.ref === undefined ? {} : { ref: step.ref }) }],
  previewPixels: 0,
});

export { commitRequest };
