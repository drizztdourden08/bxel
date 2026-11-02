/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { dragHint } from '../../src/editor/selection/drag-hint';
import { dropSelectionVertex } from '../../src/editor/selection/drop-selection-vertex';
import { pasteAsFrame } from '../../src/editor/selection/paste-as-frame';
import { selectionToGuides } from '../../src/editor/selection/selection-to-guides';
import { snapSliceMove } from '../../src/slice/snap-slice-move';
import { useNoticeStore } from '../../src/stores/useNoticeStore';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { useViewStore } from '../../src/stores/useViewStore';
import { BLOCK, openRig } from './selection-harness';

const clip = {
  width: 3,
  height: 2,
  origin: { x: 5, y: 5 },
  pixels: Uint8Array.from([1, 2, 3, 0, 4, 5]),
  bits: Uint8Array.from([1, 1, 1, 0, 1, 1]),
};

describe('W8 selection extras', { tags: ['standard'] }, () => {
  it('reads out the mode, size and place of a drag', () => {
    const shape = { variant: 'rect' as const, from: { x: 2, y: 3 }, to: { x: 6, y: 5 }, path: [] };
    expect(dragHint(shape, 'replace', { square: false, centre: false })).toBe('Replace: 5 x 3 at 2, 3');
    const lasso = { variant: 'lasso' as const, from: { x: 0, y: 0 }, to: { x: 0, y: 0 }, path: [{ x: 1, y: 1 }, { x: 4, y: 2 }] };
    expect(dragHint(lasso, 'add', { square: false, centre: false })).toBe('Add: 4 x 2 at 1, 1');
  });

  it('Backspace drops the last polygon vertex and nothing else', () => {
    openRig();
    useSelectionStore.setState({ variant: 'polygon', vertices: [{ x: 1, y: 1 }, { x: 5, y: 1 }, { x: 5, y: 5 }] });
    expect(dropSelectionVertex()).toBe(true);
    expect(useSelectionStore.getState().vertices).toEqual([{ x: 1, y: 1 }, { x: 5, y: 1 }]);
    useSelectionStore.setState({ variant: 'rect', vertices: [{ x: 1, y: 1 }] });
    expect(dropSelectionVertex()).toBe(false);
    expect(useSelectionStore.getState().vertices).toHaveLength(1);
  });

  it('a moved slice pulls its edge onto a guide when snap is on, and stays put when it is off', () => {
    const rig = openRig();
    rig.select(BLOCK);
    expect(selectionToGuides()).toBe(true);
    const origin = { x: 0, y: 0, width: 2, height: 2 };
    const drag = { kind: 'move' as const, id: 'slc_1' as never, start: { x: 0, y: 0 }, origin, rect: { ...origin, x: BLOCK.x + 1 } };
    useViewStore.setState({ snap: false, guides: true });
    expect(snapSliceMove(drag, 2).rect.x).toBe(BLOCK.x + 1);
    useViewStore.setState({ snap: true, guides: true });
    expect(snapSliceMove(drag, 2).rect.x).toBe(BLOCK.x);
    useViewStore.setState({ snap: false });
  });

  it('paste as a new frame adds a frame at the end holding the clip, as one undo step', () => {
    const rig = openRig();
    useSelectionStore.setState({ clipboard: clip });
    const before = rig.target().sprite.frames.length;
    useNoticeStore.setState({ notice: null });
    const pasted = pasteAsFrame();
    expect(useNoticeStore.getState().notice?.text ?? null).toBeNull();
    expect(pasted).toBe(true);
    const sprite = rig.target().sprite;
    expect(sprite.frames).toHaveLength(before + 1);
    const added = sprite.frames[before];
    const celId = added ? rig.target().layer.cels[added.id] : undefined;
    const cel = celId === undefined ? undefined : sprite.cels[celId];
    expect(cel?.pixels[0]).toBe(1);
    expect(cel?.pixels[sprite.width + 2]).toBe(5);
    rig.host.undo(rig.documentId);
    expect(rig.target().sprite.frames).toHaveLength(before);
  });
});
