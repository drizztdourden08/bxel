/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { beginPending } from '../../src/editor/pending/begin-pending';
import { commitPending } from '../../src/editor/pending/commit-pending';
import { updateLayerFlag } from '../../src/editor/update-layer-flag';
import { selectionMask } from '../../src/editor/selection/selection-mask';
import { startFlip } from '../../src/editor/transform/start-flip';
import { startRotate } from '../../src/editor/transform/start-rotate';
import { startScale } from '../../src/editor/transform/start-scale';
import { startTurn } from '../../src/editor/transform/start-turn';
import { useNoticeStore } from '../../src/stores/useNoticeStore';
import { usePendingStore } from '../../src/stores/usePendingStore';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { at, BLOCK, openRig } from './selection-harness';

describe('the transforms', () => {
  it('flips a selection with pixels.flip and the whole sprite with sprite.flip', () => {
    const rig = openRig();
    rig.paint({ x: 4, y: 4, width: 1, height: 1 }, 3);
    rig.paint({ x: 20, y: 20, width: 1, height: 1 }, 8);
    rig.select({ x: 0, y: 0, width: 8, height: 8 });
    expect(startFlip('horizontal')).toBe(true);
    expect(usePendingStore.getState().outcome?.clipping).toBe('none');
    commitPending();
    expect(rig.pixels()[at(3, 4)]).toBe(3);
    expect(rig.pixels()[at(20, 20)]).toBe(8);
    expect(selectionMask(rig.target())?.bits[at(3, 4)]).toBe(1);
    useSelectionStore.getState().setMask(null, null);
    startFlip('horizontal');
    const preview = usePendingStore.getState().outcome?.frame?.indices;
    commitPending();
    expect(rig.pixels()[at(11, 20)]).toBe(8);
    expect(rig.pixels()).toEqual(preview);
    expect(rig.host.view(rig.documentId)?.lastEvent.label).toBe('Flip horizontal');
  });

  it('turns a quarter and undoes in one step', () => {
    const rig = openRig();
    rig.paint({ x: 0, y: 0, width: 1, height: 1 }, 3);
    startTurn('clockwise');
    commitPending();
    expect(rig.pixels()[at(31, 0)]).toBe(3);
    rig.host.undo(rig.documentId);
    expect(rig.pixels()[at(0, 0)]).toBe(3);
  });

});

describe('rotating and scaling', () => {
  it('previews a rotation that expands the canvas exactly as it commits', () => {
    const rig = openRig();
    rig.paint({ x: 8, y: 8, width: 16, height: 16 }, 4);
    expect(startRotate()).toBe(true);
    expect(usePendingStore.getState().pending?.editing).toBe(true);
    usePendingStore.getState().revise({ kind: 'rotate', angle: 45, bounds: 'expand' });
    const { outcome } = usePendingStore.getState();
    expect(outcome?.width).toBeGreaterThan(32);
    commitPending();
    expect(rig.target().sprite.width).toBe(outcome?.width);
    expect(rig.target().sprite.height).toBe(outcome?.height);
    expect(rig.pixels()).toEqual(outcome?.frame?.indices);
  });

  it('refuses a rotation that does not fit when the policy is cancel', () => {
    const rig = openRig();
    rig.paint({ x: 0, y: 0, width: 32, height: 32 }, 4);
    startRotate();
    usePendingStore.getState().revise({ kind: 'rotate', angle: 45, bounds: 'cancel' });
    expect(usePendingStore.getState().outcome?.error).not.toBeNull();
    expect(commitPending()).toBe(false);
    expect(rig.pixels()[at(5, 5)]).toBe(4);
  });

  it('scales by size with a preview that equals the commit', () => {
    const rig = openRig();
    rig.paint(BLOCK, 4);
    rig.select(BLOCK);
    startScale();
    expect(usePendingStore.getState().pending?.spec).toMatchObject({ kind: 'scale', width: 4, height: 3 });
    usePendingStore.getState().revise({ kind: 'scale', width: 8, height: 6, bounds: 'crop' });
    const preview = usePendingStore.getState().outcome?.frame?.indices;
    commitPending();
    expect(rig.pixels()).toEqual(preview);
    expect(rig.pixels().filter((value) => value === 4)).toHaveLength(48);
  });

  it('refuses to start on a locked layer', () => {
    const rig = openRig();
    rig.paint(BLOCK, 4);
    rig.select(BLOCK);
    updateLayerFlag(rig.target().layerId, 'locked', true);
    useNoticeStore.setState({ notice: null });
    expect(beginPending({ kind: 'move', offset: { x: 1, y: 0 } })).toBe(false);
    expect(useNoticeStore.getState().notice?.text).toContain('locked');
    expect(usePendingStore.getState().pending).toBeNull();
  });
});
