/* @layer renderer-app @kind logic */
import type { CommandError, CommandStep } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import { currentTarget } from './current-target';
import type { EditorTarget } from './editor.type';
import { layerErrorText } from './layer-error-text';

/** Runs the steps as one undo step. Returns the refusal, or null when it worked. */
const executeLayerSteps = (target: EditorTarget, label: string, steps: readonly CommandStep[]): CommandError | null => {
  if (steps.length === 0) return null;
  const result = useDocumentStore.getState().host.execute({
    documentId: target.documentId,
    baseRevision: target.revision,
    mode: 'commit',
    origin: 'ui',
    label,
    steps,
    previewPixels: 0,
  });
  return result.ok ? null : result.error;
};

/** The same, and a refusal shows as a notice. */
const runLayerSteps = (label: string, build: (target: EditorTarget) => readonly CommandStep[]): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const refused = executeLayerSteps(target, label, build(target));
  if (refused) useNoticeStore.getState().post(layerErrorText(refused, target.sprite));
  return refused === null;
};

export { executeLayerSteps, runLayerSteps };
