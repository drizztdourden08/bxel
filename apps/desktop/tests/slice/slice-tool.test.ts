/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { commitRequest } from '../../src/editor/commit-request';
import { snapEdge } from '../../src/guides/snap-edge';
import { addSliceRect } from '../../src/slice/add-slice-rect';
import { deleteSelectedSlice } from '../../src/slice/delete-selected-slice';
import { resizeSliceRect } from '../../src/slice/resize-slice-rect';
import { selectedSlice } from '../../src/slice/selected-slice';
import { selectionToSlice } from '../../src/slice/selection-to-slice';
import { selectionMask } from '../../src/editor/selection/selection-mask';
import { shiftSliceRect } from '../../src/slice/shift-slice-rect';
import { sliceAt } from '../../src/slice/slice-at';
import { sliceToSelection } from '../../src/slice/slice-to-selection';
import { sliceHandleAt } from '../../src/slice/slice-handle-at';
import { spanSliceRect } from '../../src/slice/span-slice-rect';
import { updateSlice } from '../../src/slice/update-slice';
import { useSliceToolStore } from '../../src/stores/useSliceToolStore';
import { useViewStore } from '../../src/stores/useViewStore';
import { openRig } from '../selection/selection-harness';
import type { SelectionRig } from '../selection/selection-harness';

const RECT = { x: 2, y: 2, width: 6, height: 5 };
const PIVOT = { x2: 6, y2: 10 };
const CENTRE = { x: 2, y: 1, width: 2, height: 3 };

const plain = (rig: SelectionRig) => rig.target().sprite.slices.map(({ id: _id, ...rest }) => rest);

let rig: SelectionRig;

beforeEach(() => {
  rig = openRig();
  useSliceToolStore.setState({ selected: null, dialog: null });
});

describe('S2 slices made on the canvas and through commands', { tags: ['standard'] }, () => {
  it('keep the same data whichever way they are made', () => {
    const id = addSliceRect(RECT);
    expect(id).not.toBeNull();
    if (id) expect(updateSlice(id, { pivot: PIVOT, center: CENTRE })).toBe(true);
    const drawn = plain(rig);
    const other = openRig();
    const target = other.target();
    other.host.execute(commitRequest(target, 'Add', { name: COMMAND_NAME.sliceAdd, options: { name: 'Slice', rect: RECT } }));
    other.host.execute(commitRequest(other.target(), 'Edit', { name: COMMAND_NAME.sliceUpdate, options: { slice: { by: 'name', name: 'Slice' }, pivot: PIVOT, center: CENTRE } }));
    expect(drawn).toEqual([{ name: 'Slice', rect: RECT, pivot: PIVOT, center: CENTRE }]);
    expect(plain(other)).toEqual(drawn);
  });

  it('gives each new slice a free name and refuses a rectangle outside the sprite', () => {
    addSliceRect(RECT);
    addSliceRect({ x: 0, y: 0, width: 2, height: 2 });
    expect(plain(rig).map((slice) => slice.name)).toHaveLength(2);
    expect(new Set(plain(rig).map((slice) => slice.name)).size).toBe(2);
    expect(addSliceRect({ x: 0, y: 0, width: 0, height: 4 })).toBeNull();
  });

  it('deletes the selected slice in one undo step', () => {
    const id = addSliceRect(RECT);
    useSliceToolStore.getState().select(id);
    expect(selectedSlice()?.rect).toEqual(RECT);
    const before = rig.host.view(rig.documentId)?.state.revision ?? 0;
    expect(deleteSelectedSlice()).toBe(true);
    expect(rig.target().sprite.slices).toHaveLength(0);
    expect(rig.host.view(rig.documentId)?.state.revision).toBe(before + 1);
    expect(selectedSlice()).toBeNull();
  });
});

describe('S2 slice rectangles', { tags: ['standard'] }, () => {
  it('find the topmost slice under a point and the handle near an edge', () => {
    addSliceRect(RECT);
    expect(sliceAt({ x: 3, y: 3 })).not.toBeNull();
    expect(sliceAt({ x: 9, y: 3 })).toBeNull();
    expect(sliceHandleAt(RECT, { x: 2.1, y: 2.1 }, 8)).toBe('nw');
    expect(sliceHandleAt(RECT, { x: 8, y: 4 }, 8)).toBe('e');
    expect(sliceHandleAt(RECT, { x: 5, y: 7.05 }, 8)).toBe('s');
    expect(sliceHandleAt(RECT, { x: 5, y: 4 }, 8)).toBeNull();
    expect(sliceHandleAt(RECT, { x: 20, y: 4 }, 8)).toBeNull();
  });

  it('resize from a handle, move and span inside the sprite and keep at least one pixel', () => {
    const bounds = { width: 16, height: 16 };
    expect(resizeSliceRect(RECT, 'se', { x: 12, y: 10 }, bounds)).toEqual({ x: 2, y: 2, width: 10, height: 8 });
    expect(resizeSliceRect(RECT, 'w', { x: 30, y: 0 }, bounds)).toEqual({ x: 7, y: 2, width: 1, height: 5 });
    expect(resizeSliceRect(RECT, 'n', { x: 0, y: -4 }, bounds)).toEqual({ x: 2, y: 0, width: 6, height: 7 });
    expect(shiftSliceRect(RECT, { x: 20, y: -9 }, bounds)).toEqual({ x: 10, y: 0, width: 6, height: 5 });
    expect(spanSliceRect({ x: 9, y: 9 }, { x: 3, y: 20 }, bounds)).toEqual({ x: 3, y: 9, width: 6, height: 7 });
  });
});

describe('S2 snapping a slice edge to a guide', { tags: ['standard'] }, () => {
  it('lands on a guide within 4 screen pixels when Snap is on, and rounds otherwise', () => {
    rig.host.execute(commitRequest(rig.target(), 'Guide', { name: COMMAND_NAME.guideAdd, options: { axis: 'x', position: 5 } }));
    useViewStore.setState({ snap: true, guides: true });
    expect(snapEdge({ x: 5.8, y: 3.2 }, 4)).toEqual({ x: 5, y: 3 });
    expect(snapEdge({ x: 5.9, y: 3.2 }, 8)).toEqual({ x: 6, y: 3 });
    useViewStore.setState({ snap: false });
    expect(snapEdge({ x: 5.4, y: 3.2 }, 4)).toEqual({ x: 5, y: 3 });
    expect(snapEdge({ x: 5.6, y: 3.2 }, 4)).toEqual({ x: 6, y: 3 });
  });
});

describe('S2 selection to slice and slice to selection', { tags: ['standard'] }, () => {
  it('makes a slice from the selection box and picks it', () => {
    rig.select({ x: 3, y: 4, width: 5, height: 2 });
    expect(selectionToSlice()).toBe(true);
    expect(selectedSlice()?.rect).toEqual({ x: 3, y: 4, width: 5, height: 2 });
  });

  it('refuses without a selection', () => {
    expect(selectionToSlice()).toBe(false);
    expect(rig.target().sprite.slices).toHaveLength(0);
  });

  it('turns the picked slice into the selection', () => {
    const id = addSliceRect(RECT);
    useSliceToolStore.getState().select(id);
    expect(sliceToSelection()).toBe(true);
    const mask = selectionMask(rig.target());
    expect(mask?.bits.reduce((sum, bit) => sum + bit, 0)).toBe(RECT.width * RECT.height);
  });

  it('refuses when no slice is picked', () => {
    expect(sliceToSelection()).toBe(false);
  });
});
