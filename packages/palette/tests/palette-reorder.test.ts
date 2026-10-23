/* @layer tests @kind test */
import { flattenFrame, frameToRgba } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { celBytes, currentBank, currentSprite, execute, firstFrame, makeRig, slotId, snapshotProject, step, succeed } from './palette-engine';
import type { Rig } from './palette-engine';

const reverseTail = (rig: Rig): string[] => [0, 4, 3, 2, 1].map((index) => slotId(rig, index));

const rgbaOf = (rig: Rig): number[] => {
  const sprite = currentSprite(rig);
  return Array.from(frameToRgba(sprite, currentBank(rig), firstFrame(sprite)));
};

const reorder = (rig: Rig, order: readonly string[]) => execute(rig, [step('palette.reorder', { bankId: rig.bankId, order })]);

describe('palette.reorder', () => {
  it('keeps every rendered pixel identical while the indices change', () => {
    const rig = makeRig();
    const before = rgbaOf(rig);
    const bytesBefore = celBytes(currentSprite(rig));
    succeed(reorder(rig, reverseTail(rig)));
    expect(rgbaOf(rig)).toEqual(before);
    expect(celBytes(currentSprite(rig))).not.toEqual(bytesBefore);
    expect(currentBank(rig).slots.map((slot) => slot.id)).toEqual(reverseTail(rig));
  });

  it('remaps through one table so slot 1 and slot 4 trade places', () => {
    const rig = makeRig();
    const sprite = currentSprite(rig);
    const flatBefore = Array.from(flattenFrame(sprite, firstFrame(sprite)));
    succeed(reorder(rig, reverseTail(rig)));
    const after = currentSprite(rig);
    const table = [0, 4, 3, 2, 1];
    expect(Array.from(flattenFrame(after, firstFrame(after)))).toEqual(flatBefore.map((value) => table[value]));
  });

  it('undoes and redoes the remap as one history step', () => {
    const rig = makeRig();
    const original = snapshotProject(rig.engine.state().project);
    succeed(reorder(rig, reverseTail(rig)));
    const reordered = snapshotProject(rig.engine.state().project);
    expect(reordered).not.toBe(original);
    const undone = rig.engine.undo({ documentId: rig.engine.documentId, expectedRevision: rig.engine.state().revision });
    expect(undone.ok).toBe(true);
    expect(snapshotProject(rig.engine.state().project)).toBe(original);
    const redone = rig.engine.redo({ documentId: rig.engine.documentId, expectedRevision: rig.engine.state().revision });
    expect(redone.ok).toBe(true);
    expect(snapshotProject(rig.engine.state().project)).toBe(reordered);
  });

  it('commits nothing when the order is unchanged', () => {
    const rig = makeRig();
    const revision = rig.engine.state().revision;
    const same = [0, 1, 2, 3, 4].map((index) => slotId(rig, index));
    const result = succeed(reorder(rig, same));
    expect(result.ok && result.noop).toBe(true);
    expect(rig.engine.state().revision).toBe(revision);
  });
});
