/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { autoPickLayer } from '../../src/editor/auto-pick-layer';
import type { FillChoice } from '../../src/editor/editor.type';
import { fillMask } from '../../src/editor/fill-mask';
import { layerUnderPointer } from '../../src/editor/layer-under-pointer';
import { beginPending } from '../../src/editor/pending/begin-pending';
import { shapeCentre } from '../../src/editor/shape-centre';
import { tileCellMask } from '../../src/editor/tile-cell-mask';
import { nudgeSteps } from '../../src/editor/transform/nudge-steps';
import { DRAWING_DEFAULTS } from '../../src/stores/drawing-store.constants';
import { useDrawingStore } from '../../src/stores/useDrawingStore';
import { usePendingStore } from '../../src/stores/usePendingStore';
import { at, BLOCK, openRig } from './selection-harness';

const tileSize = vi.hoisted(() => vi.fn<() => { width: number; height: number } | null>(() => null));
vi.mock('../../src/editor/tile-size-of-target', () => ({ tileSizeOfTarget: tileSize }));

const CHOICE: FillChoice = { index: 3, mode: 'contiguous', connectivity: 4 };

beforeEach(() => {
  useDrawingStore.setState({ ...DRAWING_DEFAULTS });
  tileSize.mockReturnValue(null);
});

describe('W7 the move options', { tags: ['standard'] }, () => {
  it('moves only the selection by default and the whole layer in Layer mode', () => {
    const rig = openRig();
    rig.paint(BLOCK, 6);
    rig.paint({ x: 20, y: 20, width: 1, height: 1 }, 7);
    rig.select(BLOCK);
    beginPending({ kind: 'move', offset: { x: 1, y: 0 } });
    expect(usePendingStore.getState().outcome?.frame?.indices[at(21, 20)]).toBe(0);
    useDrawingStore.setState({ moveTarget: 'layer' });
    beginPending({ kind: 'move', offset: { x: 1, y: 0 } });
    expect(usePendingStore.getState().outcome?.frame?.indices[at(21, 20)]).toBe(7);
  });

  it('nudges by the tile size when the sprite has one and falls back to the pixel step', () => {
    openRig();
    expect(nudgeSteps(false)).toEqual({ x: 1, y: 1 });
    useDrawingStore.setState({ nudgeUnit: 'tile' });
    expect(nudgeSteps(false)).toEqual({ x: 1, y: 1 });
    tileSize.mockReturnValue({ width: 16, height: 8 });
    expect(nudgeSteps(false)).toEqual({ x: 16, y: 8 });
    expect(nudgeSteps(true)).toEqual({ x: 8, y: 8 });
  });

  it('picks the layer that has a pixel under the pointer only when Auto pick is on', () => {
    const rig = openRig();
    rig.paint({ x: 3, y: 3, width: 1, height: 1 }, 5);
    const { sprite, frameId, layerId } = rig.target();
    expect(layerUnderPointer(sprite, frameId, { x: 3, y: 3 })).toBe(layerId);
    expect(layerUnderPointer(sprite, frameId, { x: 4, y: 4 })).toBeNull();
    expect(layerUnderPointer(sprite, frameId, { x: -1, y: 3 })).toBeNull();
    expect(autoPickLayer({ x: 3, y: 3 })).toBe(false);
    useDrawingStore.setState({ moveAutoPick: true });
    expect(autoPickLayer({ x: 3, y: 3 })).toBe(false);
  });
});

describe('W7 the fill and shape options', { tags: ['standard'] }, () => {
  it('cuts a tile cell out of the sprite and clamps it at the edge', () => {
    const space = { width: 20, height: 20 };
    const mask = tileCellMask(space, { width: 8, height: 8 }, { x: 10, y: 3 });
    expect(mask.bits[3 * 20 + 8]).toBe(1);
    expect(mask.bits[3 * 20 + 15]).toBe(1);
    expect(mask.bits[3 * 20 + 16]).toBe(0);
    expect(mask.bits[8 * 20 + 8]).toBe(0);
    const edge = tileCellMask(space, { width: 8, height: 8 }, { x: 18, y: 18 });
    expect(edge.bits[19 * 20 + 19]).toBe(1);
  });

  it('limits a fill to the clicked tile cell only when asked', () => {
    const rig = openRig();
    expect(fillMask(rig.target(), { x: 9, y: 9 }, CHOICE)).toBeNull();
    const mask = fillMask(rig.target(), { x: 9, y: 9 }, { ...CHOICE, tile: { width: 8, height: 8 } });
    expect(mask?.bits[at(9, 9)]).toBe(1);
    expect(mask?.bits[at(7, 9)]).toBe(0);
    expect(mask?.bits[at(16, 9)]).toBe(0);
  });

  it('draws from the centre by default and lets Alt turn it back off', () => {
    expect(shapeCentre(false)).toBe(false);
    expect(shapeCentre(true)).toBe(true);
    useDrawingStore.setState({ shapeFromCentre: true });
    expect(shapeCentre(false)).toBe(true);
    expect(shapeCentre(true)).toBe(false);
  });
});
