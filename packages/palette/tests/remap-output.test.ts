/* @layer tests @kind test */
import { createHash } from 'node:crypto';
import type { TransactionResult } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { noiseRig } from './noise-rig';
import type { NoiseRig } from './noise-rig';

const SIDE = 300;
const WANT = 'bf93cc4296fc 7c11200dade7 7a85238b7caa d95b3afbe19c 39c9c66bcc68 1b3cbdbb2316 211ce5987bcf f458ac1fe501 446d4815f129';

const hexBytes = (_key: string, item: unknown): unknown => (item instanceof Uint8Array ? Buffer.from(item).toString('hex') : item);

const flat = (value: unknown): string => JSON.stringify(value, hexBytes);

const digest = (value: unknown): string => createHash('sha1').update(flat(value)).digest('hex').slice(0, 12);

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

describe('S2 palette remap output on a 300 sprite', { tags: ['standard'] }, () => {
  test('reorder, merge, delete, undo and redo stay byte for byte the same', () => {
    expect(run().join(' ')).toBe(WANT);
  });
});
