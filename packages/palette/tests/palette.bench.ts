/* @layer tests @kind bench */
import type { TransactionResult } from '@bxel/document';
import { bench, describe } from 'vitest';
import { noiseRig } from './noise-rig';

const SIDE = 2048;
const HEAVY = { iterations: 20, time: 0, warmupIterations: 10, warmupTime: 0 };

const rig = noiseRig(SIDE);
const { engine, bankId } = rig;

const turned = (): string[] => {
  const current = (engine.state().artwork.banks.find((bank) => bank.id === bankId)?.slots ?? []).map((slot) => String(slot.id));
  return [current[0] ?? '', ...current.slice(1).reverse()];
};

const reorder = (mode: 'commit' | 'preview'): TransactionResult =>
  engine.execute({
    documentId: engine.documentId,
    baseRevision: engine.state().revision,
    mode,
    origin: 'ui',
    label: 'Reorder',
    steps: [{ name: 'palette.reorder', targets: null, options: { bankId, order: turned() } }],
    previewPixels: 0,
  });

describe('palette engine, 2048 sprite', () => {
  bench('palette.reorder remap of every pixel, commit (target 100 ms)', () => {
    const result = reorder('commit');
    if (!result.ok) throw new Error(result.error.message);
  }, HEAVY);
  bench('palette.reorder remap of every pixel, preview (target 100 ms)', () => {
    const result = reorder('preview');
    if (!result.ok) throw new Error(result.error.message);
  }, HEAVY);
  bench('undo then redo of a remap (target 100 ms)', () => {
    const at = { documentId: engine.documentId, expectedRevision: engine.state().revision };
    engine.undo(at);
    engine.redo({ ...at, expectedRevision: engine.state().revision });
  }, HEAVY);
});
