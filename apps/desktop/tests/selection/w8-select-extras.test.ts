/* @layer renderer-app @kind test */
import { flattenFrame, findSprite } from '@bxel/document';
import type { SpriteId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { dragHint } from '../../src/editor/selection/drag-hint';
import { dropSelectionVertex } from '../../src/editor/selection/drop-selection-vertex';
import { pasteAsFrame } from '../../src/editor/selection/paste-as-frame';
import { selectionToGuides } from '../../src/editor/selection/selection-to-guides';
import { snapSliceMove } from '../../src/slice/snap-slice-move';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useNoticeStore } from '../../src/stores/useNoticeStore';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { useViewStore } from '../../src/stores/useViewStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { animationOf, freshAnimation, live } from '../timeline/timeline-harness';
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

  it('paste as a new frame adds a frame at the end of the animation holding the clip, as one undo step', () => {
    freshAnimation();
    useSelectionStore.setState({ clipboard: clip });
    const before = animationOf().frames.length;
    useNoticeStore.setState({ notice: null });
    const pasted = pasteAsFrame();
    expect(useNoticeStore.getState().notice?.text ?? null).toBeNull();
    expect(pasted).toBe(true);
    const frames = animationOf().frames;
    expect(frames).toHaveLength(before + 1);
    const sprite = findSprite(live().artwork, frames[before]?.spriteId as SpriteId);
    const painted = sprite ? flattenFrame(sprite, sprite.frames[0]?.id as never) : new Uint8Array();
    expect(painted[0]).toBe(1);
    expect(painted[(sprite?.width ?? 0) + 2]).toBe(5);
    useDocumentStore.getState().host.undo(live().documentId);
    expect(animationOf().frames).toHaveLength(before);
  });

  it('paste as a new frame posts a notice and does nothing when no animation is open', () => {
    openRig();
    useWorkspaceStore.setState({ workspaces: {}, tabs: [], activeTab: null });
    useSelectionStore.setState({ clipboard: clip });
    useNoticeStore.setState({ notice: null });
    expect(pasteAsFrame()).toBe(false);
    expect(useNoticeStore.getState().notice?.text).toBeDefined();
  });
});
