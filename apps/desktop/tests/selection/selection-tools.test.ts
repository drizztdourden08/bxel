/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { alignSelection } from '../../src/editor/selection/align-selection';
import { borderSelection } from '../../src/editor/selection/border-selection';
import { copySelection } from '../../src/editor/selection/copy-selection';
import { fillSelection } from '../../src/editor/selection/fill-selection';
import { pasteInPlace } from '../../src/editor/selection/paste-in-place';
import { prepareFor } from '../../src/editor/selection/prepare-paste';
import { resizeByAmount } from '../../src/editor/selection/resize-by-amount';
import { selectOpaque } from '../../src/editor/selection/select-opaque';
import { selectionMask } from '../../src/editor/selection/selection-mask';
import { smoothSelection } from '../../src/editor/selection/smooth-selection';
import { strokeSelection } from '../../src/editor/selection/stroke-selection';
import { commitPending } from '../../src/editor/pending/commit-pending';
import { recallTransform } from '../../src/editor/transform/recall-transform';
import { startTransform } from '../../src/editor/transform/start-transform';
import { usePendingStore } from '../../src/stores/usePendingStore';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { at, BLOCK, countOn, openRig } from './selection-harness';

describe('selection commands', () => {
  it('expands and shrinks by the amount option', () => {
    const rig = openRig();
    rig.select(BLOCK);
    useSelectionStore.getState().setAmount(2);
    resizeByAmount(1);
    expect(countOn(selectionMask(rig.target()))).toBe((BLOCK.width + 4) * (BLOCK.height + 4));
    resizeByAmount(-1);
    expect(countOn(selectionMask(rig.target()))).toBe(BLOCK.width * BLOCK.height);
  });

  it('takes a ring of the amount around the edge', () => {
    const rig = openRig();
    rig.select({ x: 10, y: 10, width: 6, height: 6 });
    useSelectionStore.getState().setAmount(1);
    borderSelection();
    expect(countOn(selectionMask(rig.target()))).toBe(8 * 8 - 4 * 4);
  });

  it('smooths a single pixel spur away', () => {
    const rig = openRig();
    rig.select({ x: 10, y: 10, width: 4, height: 4 });
    const mask = selectionMask(rig.target());
    if (!mask) throw new Error('no selection');
    mask.bits[10 * 32 + 20] = 1;
    useSelectionStore.getState().setMask(mask, rig.documentId);
    smoothSelection();
    expect(selectionMask(rig.target())?.bits[10 * 32 + 20]).toBe(0);
  });

  it('selects the opaque pixels of the active layer', () => {
    const rig = openRig();
    rig.paint({ x: 3, y: 3, width: 2, height: 2 }, 6);
    selectOpaque();
    expect(countOn(selectionMask(rig.target()))).toBe(4);
  });

  it('fills and strokes with the front colour as one undo step each', () => {
    const rig = openRig();
    useToolStore.getState().setColour('foreground', 7);
    rig.select({ x: 5, y: 5, width: 4, height: 4 });
    expect(fillSelection('foreground')).toBe(true);
    expect(rig.pixels()[at(6, 6)]).toBe(7);
    rig.host.undo(rig.documentId);
    expect(rig.pixels()[at(6, 6)]).toBe(0);
    expect(strokeSelection('inside')).toBe(true);
    expect(rig.pixels()[at(5, 5)]).toBe(7);
    expect(rig.pixels()[at(6, 6)]).toBe(0);
    expect(strokeSelection('outside')).toBe(true);
    expect(rig.pixels()[at(4, 6)]).toBe(7);
  });

  it('aligns the selected pixels to the canvas edge and the selection follows', () => {
    const rig = openRig();
    rig.paint({ x: 10, y: 10, width: 2, height: 2 }, 5);
    rig.select({ x: 10, y: 10, width: 2, height: 2 });
    expect(alignSelection('left')).toBe(true);
    expect(rig.pixels()[at(0, 10)]).toBe(5);
    expect(rig.pixels()[at(10, 10)]).toBe(0);
    expect(selectionMask(rig.target())?.bits[at(0, 10)]).toBe(1);
    alignSelection('bottom');
    expect(rig.pixels()[at(0, 31)]).toBe(5);
  });
});

describe('paste special', () => {
  it('as a new layer puts the paste on a layer of its own', () => {
    const rig = openRig();
    rig.paint(BLOCK, 4);
    rig.select(BLOCK);
    copySelection();
    const before = rig.target().sprite.layers.length;
    prepareFor('layer');
    expect(rig.target().sprite.layers.length).toBe(before + 1);
    expect(pasteInPlace()).toBe(true);
  });

  it('into the selection clips the paste to it', () => {
    const rig = openRig();
    rig.paint({ x: 2, y: 2, width: 4, height: 4 }, 4);
    rig.select({ x: 2, y: 2, width: 4, height: 4 });
    copySelection();
    rig.select({ x: 20, y: 20, width: 2, height: 2 });
    prepareFor('selection');
    pasteInPlace();
    expect(usePendingStore.getState().outcome?.frame?.indices[at(21, 21)]).toBe(4);
    expect(usePendingStore.getState().outcome?.frame?.indices[at(23, 23)]).toBe(0);
  });

  it('expand grows the canvas to hold a larger clip', () => {
    const rig = openRig();
    useSelectionStore.setState({ clipboard: { width: 40, height: 36, origin: { x: 0, y: 0 }, pixels: new Uint8Array(1440).fill(3), bits: new Uint8Array(1440).fill(1) } });
    prepareFor('expand');
    expect([rig.target().sprite.width, rig.target().sprite.height]).toEqual([40, 36]);
  });
});

describe('continuous transform', () => {
  it('Mod+T right after Apply takes the last transform back and reopens it without stacking resamples', () => {
    const rig = openRig();
    rig.paint({ x: 8, y: 8, width: 8, height: 4 }, 4);
    const original = rig.pixels();
    startTransform();
    const spec = usePendingStore.getState().pending?.spec;
    if (spec?.kind !== 'transform') throw new Error('no session');
    usePendingStore.getState().revise({ ...spec, angle: 30 });
    commitPending();
    const rotated = rig.pixels();
    expect(rotated).not.toEqual(original);
    expect(recallTransform()).toBe(true);
    const recalled = usePendingStore.getState().pending?.spec;
    expect(recalled?.kind === 'transform' ? recalled.angle : 0).toBe(30);
    expect(rig.pixels()).toEqual(original);
    expect(usePendingStore.getState().outcome?.frame?.indices).toEqual(rotated);
  });
});
