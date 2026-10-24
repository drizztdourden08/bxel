/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { commitPending } from '../../src/editor/pending/commit-pending';
import { setFloatOffset } from '../../src/editor/pending/set-float-offset';
import { copySelection } from '../../src/editor/selection/copy-selection';
import { cutSelection } from '../../src/editor/selection/cut-selection';
import { deleteSelection } from '../../src/editor/selection/delete-selection';
import { pasteClip } from '../../src/editor/selection/paste-clip';
import { useNoticeStore } from '../../src/stores/useNoticeStore';
import { usePendingStore } from '../../src/stores/usePendingStore';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { at, BLOCK, openRig } from './selection-harness';

describe('the clipboard', () => {
  it('copies the selected indices, pastes a floating preview at the same place and commits with skipZero', () => {
    const rig = openRig();
    rig.paint({ x: 4, y: 4, width: 2, height: 2 }, 5);
    rig.select(BLOCK);
    expect(copySelection()).toBe(true);
    expect(useSelectionStore.getState().clipboard?.origin).toEqual({ x: 4, y: 4 });
    rig.paint({ x: 20, y: 20, width: 4, height: 3 }, 9);
    expect(pasteClip()).toBe(true);
    const floating = usePendingStore.getState();
    expect(floating.pending?.spec).toMatchObject({ kind: 'paste', offset: { x: 0, y: 0 } });
    expect(floating.outcome?.frame?.indices[at(4, 4)]).toBe(5);
    setFloatOffset({ x: 16, y: 16 });
    const preview = usePendingStore.getState().outcome?.frame?.indices;
    expect(preview?.[at(20, 20)]).toBe(5);
    expect(preview?.[at(22, 20)]).toBe(9);
    expect(commitPending()).toBe(true);
    expect(rig.pixels()).toEqual(preview);
    expect(rig.host.view(rig.documentId)?.lastEvent.label).toBe('Paste');
    expect(rig.pixels()[at(4, 4)]).toBe(5);
  });

  it('keeps the paste inside the sprite', () => {
    const rig = openRig();
    rig.paint(BLOCK, 2);
    rig.select(BLOCK);
    copySelection();
    pasteClip();
    setFloatOffset({ x: 100, y: -100 });
    expect(usePendingStore.getState().pending?.spec).toMatchObject({ kind: 'paste', offset: { x: 24, y: -4 } });
    expect(usePendingStore.getState().outcome?.error).toBeNull();
  });

  it('cuts in one undo step and deletes without touching the clipboard', () => {
    const rig = openRig();
    rig.paint(BLOCK, 7);
    rig.select(BLOCK);
    expect(cutSelection()).toBe(true);
    expect(rig.pixels()[at(5, 5)]).toBe(0);
    expect(useSelectionStore.getState().clipboard?.pixels.every((value) => value === 7)).toBe(true);
    expect(rig.host.view(rig.documentId)?.lastEvent.label).toBe('Cut');
    rig.host.undo(rig.documentId);
    expect(rig.pixels()[at(5, 5)]).toBe(7);
    expect(deleteSelection()).toBe(true);
    expect(rig.pixels()[at(5, 5)]).toBe(0);
    expect(rig.host.view(rig.documentId)?.lastEvent.label).toBe('Delete selection');
    expect(useSelectionStore.getState().clipboard?.width).toBe(4);
  });

  it('says so when there is nothing to copy or paste', () => {
    openRig();
    expect(copySelection()).toBe(false);
    expect(pasteClip()).toBe(false);
    expect(useNoticeStore.getState().notice?.text).toBe('Copy a selection first.');
  });
});
