/* @layer renderer-app @kind test */
import { rectMask } from '@bxel/raster';
import type { Size } from '@bxel/raster';
import { beforeEach, describe, expect, it } from 'vitest';
import { incomingMask } from '../../src/editor/selection/incoming-mask';
import { mirrorMask } from '../../src/editor/selection/mirror-mask';
import type { DragShape } from '../../src/editor/selection/selection.type';
import { SELECTION_DEFAULTS } from '../../src/stores/selection-store.constants';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { at, countOn } from './selection-harness';

const SIZE: Size = { width: 32, height: 32 };

const BOX: DragShape = { variant: 'rect', from: { x: 2, y: 4 }, to: { x: 5, y: 6 }, path: [] };

beforeEach(() => {
  useSelectionStore.setState({ ...SELECTION_DEFAULTS });
  useToolStore.setState({ ...TOOL_DEFAULTS });
});

describe('K1 a selection that follows the symmetry axes', { tags: ['critical'] }, () => {
  it('leaves a mask alone when no axis is on', () => {
    const mask = rectMask(SIZE, { from: { x: 2, y: 4 }, to: { x: 5, y: 6 } });
    expect(mirrorMask(mask, {})).toBe(mask);
  });

  it('adds the mirror of the box across a vertical axis', () => {
    const mask = rectMask(SIZE, { from: { x: 2, y: 4 }, to: { x: 5, y: 6 } });
    const both = mirrorMask(mask, { x2: SIZE.width });
    expect(countOn(both)).toBe(24);
    expect(both.bits[at(2, 4)]).toBe(1);
    expect(both.bits[at(29, 4)]).toBe(1);
    expect(both.bits[at(10, 4)]).toBe(0);
  });

  it('adds the mirror across both axes as four boxes', () => {
    const mask = rectMask(SIZE, { from: { x: 2, y: 4 }, to: { x: 5, y: 6 } });
    const four = mirrorMask(mask, { x2: SIZE.width, y2: SIZE.height });
    expect(countOn(four)).toBe(48);
    expect(four.bits[at(29, 27)]).toBe(1);
  });
});

describe('S2 the marquee while symmetry is on', { tags: ['standard'] }, () => {
  it('selects only the dragged box when symmetry is off', () => {
    expect(countOn(incomingMask(BOX, SIZE))).toBe(12);
  });

  it('also selects the mirrored box when symmetry X is on', () => {
    useToolStore.setState({ symmetryX: true });
    const mask = incomingMask(BOX, SIZE);
    expect(countOn(mask)).toBe(24);
    expect(mask.bits[at(29, 5)]).toBe(1);
  });

  it('keeps only the dragged box when the mirror option is off', () => {
    useToolStore.setState({ symmetryX: true });
    useSelectionStore.getState().setMirror(false);
    expect(countOn(incomingMask(BOX, SIZE))).toBe(12);
  });

  it('mirrors a lasso and a polygon the same way', () => {
    useToolStore.setState({ symmetryY: true });
    const lasso: DragShape = { variant: 'lasso', from: { x: 2, y: 2 }, to: { x: 2, y: 2 }, path: [{ x: 2, y: 2 }, { x: 8, y: 2 }, { x: 8, y: 6 }, { x: 2, y: 6 }] };
    const mask = incomingMask(lasso, SIZE);
    expect(mask.bits[at(4, 4)]).toBe(1);
    expect(mask.bits[at(4, 27)]).toBe(1);
  });

  it('uses a fixed size box for the mirrored box too', () => {
    useToolStore.setState({ symmetryX: true });
    useSelectionStore.getState().setFixed('size');
    useSelectionStore.getState().setFixedWidth(3);
    useSelectionStore.getState().setFixedHeight(2);
    const stamp: DragShape = { variant: 'rect', from: { x: 4, y: 4 }, to: { x: 4, y: 4 }, path: [] };
    expect(countOn(incomingMask(stamp, SIZE))).toBe(12);
  });
});
