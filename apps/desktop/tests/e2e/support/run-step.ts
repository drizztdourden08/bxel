/* @layer renderer-app @kind logic */
import type { Engine, TargetScope } from '@bxel/document';

const runStep = (engine: Engine, name: string, options: unknown, targets: TargetScope | null = null): void => {
  const result = engine.execute({
    documentId: engine.documentId,
    baseRevision: engine.state().revision,
    mode: 'commit',
    origin: 'ui',
    label: name,
    steps: [{ name, targets, options }],
    previewPixels: 0,
  });
  if (!result.ok) throw new Error(`${name} failed: ${result.error.message}`);
};

export { runStep };
