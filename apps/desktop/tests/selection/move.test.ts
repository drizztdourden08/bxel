/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { beginPending } from '../../src/editor/pending/begin-pending';
import { cancelPending } from '../../src/editor/pending/cancel-pending';
import { commitPending } from '../../src/editor/pending/commit-pending';
import { setFloatOffset } from '../../src/editor/pending/set-float-offset';
import { selectionMask } from '../../src/editor/selection/selection-mask';
import { nudgeFloat } from '../../src/editor/transform/nudge-float';
import { usePendingStore } from '../../src/stores/usePendingStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { at, BLOCK, countOn, openRig } from './selection-harness';

describe('moving a selection', () => {
  it('floats with arrows of 1 and 8 pixels, previews through the engine and applies one pixels.move', () => {
    const rig = openRig();
    rig.paint(BLOCK, 6);
    rig.select(BLOCK);
    useToolStore.getState().selectTool('move');
    expect(nudgeFloat(1, 0)).toBe(true);
    expect(nudgeFloat(8, 0)).toBe(true);
    expect(nudgeFloat(0, 8)).toBe(true);
    const pending = usePendingStore.getState();
    expect(pending.pending?.spec).toMatchObject({ kind: 'move', offset: { x: 9, y: 8 } });
    expect(rig.pixels()[at(4, 4)]).toBe(6);
    const preview = pending.outcome?.frame?.indices;
    expect(preview?.[at(13, 12)]).toBe(6);
    expect(preview?.[at(4, 4)]).toBe(0);
    const revision = rig.target().revision;
    expect(commitPending()).toBe(true);
    expect(rig.target().revision).toBeGreaterThan(revision);
    expect(rig.pixels()).toEqual(preview);
    expect(rig.host.view(rig.documentId)?.lastEvent.label).toBe('Move');
    expect(countOn(selectionMask(rig.target()))).toBe(12);
    expect(selectionMask(rig.target())?.bits[at(13, 12)]).toBe(1);
    rig.host.undo(rig.documentId);
    expect(rig.pixels()[at(4, 4)]).toBe(6);
    expect(rig.pixels()[at(13, 12)]).toBe(0);
  });

  it('follows a drag offset and cancels without touching the file', () => {
    const rig = openRig();
    rig.paint(BLOCK, 6);
    rig.select(BLOCK);
    beginPending({ kind: 'move', offset: { x: 0, y: 0 } });
    setFloatOffset({ x: -2, y: 3 });
    expect(usePendingStore.getState().outcome?.frame?.indices[at(2, 7)]).toBe(6);
    const before = rig.pixels();
    cancelPending();
    expect(usePendingStore.getState().pending).toBeNull();
    expect(rig.pixels()).toEqual(before);
  });

  it('moves the whole cel when nothing is selected, and says what falls outside', () => {
    const rig = openRig();
    rig.paint({ x: 0, y: 0, width: 2, height: 2 }, 4);
    beginPending({ kind: 'move', offset: { x: -1, y: 0 } });
    expect(usePendingStore.getState().outcome?.clipping).toMatch(/fall outside the sprite/);
    expect(commitPending()).toBe(true);
    expect(rig.pixels()[at(0, 0)]).toBe(4);
    expect(rig.pixels()[at(1, 0)]).toBe(0);
  });
});
