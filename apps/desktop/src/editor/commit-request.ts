/* @layer renderer-app @kind logic */
import type { TransactionRequest } from '@bxel/document';
import { cellScope } from './cell-scope';
import type { CommitStep } from './commit-request.type';
import type { EditorTarget } from './editor.type';

const commitRequest = (target: EditorTarget, label: string, step: CommitStep): TransactionRequest => ({
  documentId: target.documentId,
  baseRevision: target.revision,
  mode: 'commit',
  origin: 'ui',
  label,
  steps: [{ name: step.name, targets: cellScope(target), options: step.options }],
  previewPixels: 0,
});

export { commitRequest };
