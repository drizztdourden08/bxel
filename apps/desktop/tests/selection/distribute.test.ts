/* @layer renderer-app @kind test */
import { combineMasks, emptyMask } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import { beforeEach, describe, expect, it } from 'vitest';
import { distributeSelection } from '../../src/editor/selection/distribute-selection';
import { maskIslands } from '../../src/editor/selection/mask-islands';
import { selectionMask } from '../../src/editor/selection/selection-mask';
import { setSelection } from '../../src/editor/selection/set-selection';
import { distributeSlices } from '../../src/slice/distribute-slices';
import { addSliceRect } from '../../src/slice/add-slice-rect';
import { useNoticeStore } from '../../src/stores/useNoticeStore';
import { useSliceToolStore } from '../../src/stores/useSliceToolStore';
import { at, countOn, openRig } from './selection-harness';
import type { Box, SelectionRig } from './selection-harness';

const FIRST: Box = { x: 0, y: 4, width: 2, height: 2 };
const SECOND: Box = { x: 5, y: 4, width: 2, height: 2 };
const THIRD: Box = { x: 20, y: 4, width: 2, height: 2 };

const selectAll = (rig: SelectionRig, boxes: readonly Box[]): MaskView => {
  const target = rig.target();
  const mask = boxes.reduce((sum, box) => combineMasks(sum, rig.select(box), 'add'), emptyMask(target.sprite));
  setSelection(target, mask);
  return mask;
};

let rig: SelectionRig;

beforeEach(() => {
  rig = openRig();
  useNoticeStore.setState({ notice: null });
  useSliceToolStore.setState({ selected: null, dialog: null });
});

describe('K1 splitting a selection into separate areas', { tags: ['critical'] }, () => {
  it('finds one island per group of touching pixels, diagonals included', () => {
    const mask = emptyMask({ width: 8, height: 8 });
    for (const [x, y] of [[0, 0], [1, 1], [5, 5], [6, 5]]) mask.bits[(y ?? 0) * 8 + (x ?? 0)] = 1;
    const islands = maskIslands(mask);
    expect(islands).toHaveLength(2);
    expect(islands.map((island) => island.box)).toEqual([{ x: 0, y: 0, width: 2, height: 2 }, { x: 5, y: 5, width: 2, height: 1 }]);
  });
});

describe('S2 distribute a floating selection', { tags: ['standard'] }, () => {
  it('spaces three separate areas evenly as one step', () => {
    rig.paint(FIRST, 1);
    rig.paint(SECOND, 2);
    rig.paint(THIRD, 3);
    selectAll(rig, [FIRST, SECOND, THIRD]);
    expect(distributeSelection('horizontal')).toBe(true);
    const pixels = rig.pixels();
    expect([pixels[at(0, 4)], pixels[at(10, 4)], pixels[at(20, 4)]]).toEqual([1, 2, 3]);
    expect(pixels[at(5, 4)]).toBe(0);
    expect(countOn(selectionMask(rig.target()))).toBe(12);
    expect(maskIslands(selectionMask(rig.target()) ?? emptyMask({ width: 1, height: 1 })).map((island) => island.box.x)).toEqual([0, 10, 20]);
    rig.host.undo(rig.documentId);
    expect(rig.pixels()[at(5, 4)]).toBe(2);
    expect(rig.pixels()[at(10, 4)]).toBe(0);
  });

  it('spaces areas vertically too', () => {
    const top: Box = { x: 4, y: 0, width: 2, height: 2 };
    const middle: Box = { x: 4, y: 3, width: 2, height: 2 };
    const bottom: Box = { x: 4, y: 20, width: 2, height: 2 };
    rig.paint(top, 1);
    rig.paint(middle, 2);
    rig.paint(bottom, 3);
    selectAll(rig, [top, middle, bottom]);
    expect(distributeSelection('vertical')).toBe(true);
    const pixels = rig.pixels();
    expect([pixels[at(4, 0)], pixels[at(4, 10)], pixels[at(4, 20)]]).toEqual([1, 2, 3]);
  });

  it('needs three separate areas and says so', () => {
    rig.paint(FIRST, 1);
    rig.paint(THIRD, 3);
    selectAll(rig, [FIRST, THIRD]);
    expect(distributeSelection('horizontal')).toBe(false);
    expect(useNoticeStore.getState().notice?.text).toBe('Select three or more separate areas to space them out.');
  });

  it('does nothing when the areas are already even', () => {
    const middle: Box = { x: 10, y: 4, width: 2, height: 2 };
    rig.paint(FIRST, 1);
    rig.paint(middle, 2);
    rig.paint(THIRD, 3);
    const before = rig.pixels().slice();
    selectAll(rig, [FIRST, middle, THIRD]);
    expect(distributeSelection('horizontal')).toBe(true);
    expect(rig.pixels()).toEqual(before);
  });
});

describe('S2 distribute slices', { tags: ['standard'] }, () => {
  const slice = (x: number, y: number): void => void addSliceRect({ x, y, width: 4, height: 4 });

  const lefts = (): number[] => rig.target().sprite.slices.map((each) => each.rect.x);

  it('spaces three slices evenly across the sprite, keeping their sizes', () => {
    slice(0, 2);
    slice(6, 2);
    slice(24, 2);
    expect(distributeSlices('horizontal')).toBe(true);
    expect(lefts()).toEqual([0, 12, 24]);
    expect(rig.target().sprite.slices.map((each) => each.rect.width)).toEqual([4, 4, 4]);
  });

  it('spaces them vertically and undoes as one step', () => {
    slice(2, 0);
    slice(2, 5);
    slice(2, 24);
    expect(distributeSlices('vertical')).toBe(true);
    expect(rig.target().sprite.slices.map((each) => each.rect.y)).toEqual([0, 12, 24]);
    rig.host.undo(rig.documentId);
    expect(rig.target().sprite.slices.map((each) => each.rect.y)).toEqual([0, 5, 24]);
  });

  it('needs three slices and says so', () => {
    slice(0, 0);
    slice(10, 0);
    expect(distributeSlices('horizontal')).toBe(false);
    expect(useNoticeStore.getState().notice?.text).toBe('Add three or more slices to space them out.');
  });
});
