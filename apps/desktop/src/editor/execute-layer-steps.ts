/* @layer renderer-app @kind logic */
import type { CommandError, CommandStep } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import type { EditorTarget } from './editor.type';

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

export { executeLayerSteps };
