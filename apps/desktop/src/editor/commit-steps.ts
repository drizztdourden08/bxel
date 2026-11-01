/* @layer renderer-app @kind logic */
import type { CommandStep, TargetScope, TransactionRequest } from '@bxel/document';
import { useDrawingStore } from '../stores/useDrawingStore';
import { cellScope } from './cell-scope';
import type { CommitStep } from './commit-request.type';
import type { EditorTarget } from './editor.type';
import { isLinkedCel } from './linked-cel';

const stepOf = (step: CommitStep, scope: TargetScope, allUses: boolean): CommandStep => ({
  name: step.name,
  targets: scope,
  options: allUses ? { ...(step.options as object), allUses: true } : step.options,
  ...(step.ref === undefined ? {} : { ref: step.ref }),
});

const commitSteps = (target: EditorTarget, label: string, steps: readonly CommitStep[], scope: TargetScope = cellScope(target)): TransactionRequest => {
  const choice = useDrawingStore.getState().linkedChoice;
  const linked = isLinkedCel(target);
  const unlink: CommandStep[] = linked && choice === 'unlink' ? [{ name: 'cel.unlink', targets: scope, options: {} }] : [];
  return {
    documentId: target.documentId,
    baseRevision: target.revision,
    mode: 'commit',
    origin: 'ui',
    label,
    steps: [...unlink, ...steps.map((step) => stepOf(step, scope, linked && choice === 'all'))],
    previewPixels: 0,
  };
};

export { commitSteps };
