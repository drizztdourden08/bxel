/* @layer tests @kind test */
import { createHash } from 'node:crypto';
import type { TransactionResult } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { noiseRig } from './noise-rig';
import type { NoiseRig } from './noise-rig';

const SIDE = 300;
const WANT = '34cce5f0880c effcee0d21b4 712b2736747c 077f022a56b9 fe74b0847845 15688a743ae3 d7364b892528 b9ab685bcce7 1f23d2388ef0';

const digest = (value: unknown): string =>
  createHash('sha1')
    .update(JSON.stringify(value, (_key, item: unknown) => (item instanceof Uint8Array ? Buffer.from(item).toString('hex') : item)))
    .digest('hex')
    .slice(0, 12);

const stage = (rig: NoiseRig, result: TransactionResult): string => {
  if (!result.ok) throw new Error(result.error.message);
  return digest([result, rig.engine.state().artwork, rig.engine.state().revision]);
};

const edit = (rig: NoiseRig, name: string, options: object, mode: 'commit' | 'preview' = 'commit'): TransactionResult =>
  rig.engine.execute({
    documentId: rig.engine.documentId,
    baseRevision: rig.engine.state().revision,
    mode,
    origin: 'ui',
    label: 'Remap',
    steps: [{ name, targets: null, options }],
    previewPixels: SIDE * SIDE,
  });

const walk = (rig: NoiseRig, direction: 'undo' | 'redo'): TransactionResult =>
  rig.engine[direction]({ documentId: rig.engine.documentId, expectedRevision: rig.engine.state().revision });

const slot = (rig: NoiseRig, at: number): string => rig.slots[at] ?? '';

const run = (): string[] => {
  const rig = noiseRig(SIDE);
  const reversed = [slot(rig, 0), ...rig.slots.slice(1).reverse()];
  const out: string[] = [];
  out.push(stage(rig, edit(rig, 'palette.reorder', { bankId: rig.bankId, order: reversed }, 'preview')));
  out.push(stage(rig, edit(rig, 'palette.reorder', { bankId: rig.bankId, order: reversed })));
  out.push(stage(rig, edit(rig, 'swatch.merge', { bankId: rig.bankId, from: slot(rig, 5), into: slot(rig, 2) })));
  const doomed = rig.engine.state().artwork.banks[0]?.slots[3]?.id ?? '';
  const fallback = rig.engine.state().artwork.banks[0]?.slots[1]?.id ?? '';
  out.push(stage(rig, edit(rig, 'swatch.delete', { bankId: rig.bankId, swatchId: doomed, replacementId: fallback })));
  out.push(stage(rig, walk(rig, 'undo')));
  out.push(stage(rig, walk(rig, 'undo')));
  out.push(stage(rig, walk(rig, 'redo')));
  out.push(stage(rig, walk(rig, 'undo')));
  out.push(stage(rig, walk(rig, 'undo')));
  return out;
};

describe('palette remap output on a 300 sprite', () => {
  test('reorder, merge, delete, undo and redo stay byte for byte the same', () => {
    expect(run().join(' ')).toBe(WANT);
  });
});
