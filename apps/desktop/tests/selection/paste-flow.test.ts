/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { clipOf } from '../../src/editor/selection/clip-of';
import { decodeClip } from '../../src/editor/selection/decode-clip';
import { encodeClip } from '../../src/editor/selection/encode-clip';
import { copyMerged } from '../../src/editor/selection/copy-merged';
import { copySelection } from '../../src/editor/selection/copy-selection';
import { pasteClip } from '../../src/editor/selection/paste-clip';
import { pasteInPlace } from '../../src/editor/selection/paste-in-place';
import { remapClip } from '../../src/editor/selection/remap-clip';
import { useReadoutStore } from '../../src/stores/useReadoutStore';
import { usePendingStore } from '../../src/stores/usePendingStore';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { BLOCK, openRig } from './selection-harness';

const TABLE = Uint8Array.from([0, 0, 0, 0, 255, 0, 0, 255, 0, 255, 0, 255]);

describe('the paste flow', () => {
  it('pastes in the middle of the sprite when the pointer is off the canvas, and in place keeps the source', () => {
    const rig = openRig();
    rig.paint(BLOCK, 4);
    rig.select(BLOCK);
    copySelection();
    useReadoutStore.setState({ pointer: null });
    expect(pasteClip()).toBe(true);
    expect(usePendingStore.getState().pending?.spec).toMatchObject({ kind: 'paste', offset: { x: 16 - 2 - 4, y: 16 - 1 - 4 } });
    usePendingStore.getState().clear();
    expect(pasteInPlace()).toBe(true);
    expect(usePendingStore.getState().pending?.spec).toMatchObject({ offset: { x: 0, y: 0 } });
  });

  it('pastes under the pointer', () => {
    const rig = openRig();
    rig.paint(BLOCK, 4);
    rig.select(BLOCK);
    copySelection();
    useReadoutStore.setState({ pointer: { x: 20, y: 10 } });
    pasteClip();
    expect(usePendingStore.getState().pending?.spec).toMatchObject({ kind: 'paste', offset: { x: 20 - 2 - 4, y: 10 - 1 - 4 } });
    useReadoutStore.setState({ pointer: null });
  });

  it('crops a clip larger than the sprite instead of refusing it', () => {
    openRig();
    const big = { width: 40, height: 40, origin: { x: 0, y: 0 }, pixels: new Uint8Array(1600).fill(3), bits: new Uint8Array(1600).fill(1) };
    useSelectionStore.setState({ clipboard: big });
    expect(pasteClip()).toBe(true);
    const spec = usePendingStore.getState().pending?.spec;
    expect(spec?.kind === 'paste' ? [spec.clip.width, spec.clip.height] : []).toEqual([32, 32]);
  });

  it('copy merged takes the flattened picture', () => {
    const rig = openRig();
    rig.paint(BLOCK, 6);
    rig.select(BLOCK);
    expect(copyMerged()).toBe(true);
    expect(useSelectionStore.getState().clipboard?.pixels.every((value) => value === 6)).toBe(true);
  });
});

describe('the clip on the system clipboard', () => {
  it('round trips through its bytes with the palette it was copied under', () => {
    const rig = openRig();
    rig.paint(BLOCK, 2);
    const mask = rig.select(BLOCK);
    const clip = clipOf(rig.pixels(), mask);
    expect(clip).not.toBeNull();
    const carried = decodeClip(encodeClip(clip ?? { width: 0, height: 0, origin: { x: 0, y: 0 }, pixels: new Uint8Array(), bits: new Uint8Array() }, TABLE));
    expect(carried?.clip.pixels).toEqual(clip?.pixels);
    expect(carried?.clip.origin).toEqual({ x: 4, y: 4 });
    expect(carried?.table).toEqual(TABLE);
  });

  it('refuses bytes that are not a clip', () => {
    expect(decodeClip(Uint8Array.from([1, 2, 3]))).toBeNull();
  });

  it('remaps to the nearest colour when the palettes differ and leaves the same palette alone', () => {
    const clip = { width: 2, height: 1, origin: { x: 0, y: 0 }, pixels: Uint8Array.from([1, 2]), bits: Uint8Array.from([1, 1]) };
    const target = Uint8Array.from([0, 0, 0, 0, 0, 255, 0, 255, 250, 5, 5, 255]);
    const moved = remapClip(clip, TABLE, target);
    expect(moved.changed).toBe(true);
    expect([...moved.clip.pixels]).toEqual([2, 1]);
    expect(remapClip(clip, TABLE, TABLE).changed).toBe(false);
  });
});
