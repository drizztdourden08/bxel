/* @layer renderer-app @kind logic */
import type { CommandStep, Engine } from '@bxel/document';

const applyDemoSteps = (engine: Engine, label: string, steps: readonly CommandStep[]): Readonly<Record<string, string>> => {
  const result = engine.execute({
    documentId: engine.documentId,
    baseRevision: engine.state().revision,
    mode: 'commit',
    origin: 'ui',
    label,
    steps,
    previewPixels: 0,
  });
  if (!result.ok) throw new Error(`${label} failed: ${result.error.message}`);
  return result.created;
};

export { applyDemoSteps };
