/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { canStepHistory } from '../../src/editor/can-step-history';
import { clearSelection } from '../../src/editor/selection/clear-selection';
import { reselect } from '../../src/editor/selection/reselect';
import { selectAll } from '../../src/editor/selection/select-all';
import { selectionMask } from '../../src/editor/selection/selection-mask';
import { stepHistory } from '../../src/editor/step-history';
import { useSelectionHistoryStore } from '../../src/stores/useSelectionHistoryStore';
import { BLOCK, countOn, openRig } from './selection-harness';

describe('selection history', () => {
  it('makes a selection change undoable and redoable without touching the pixels', () => {
    const rig = openRig();
    useSelectionHistoryStore.getState().reset();
    rig.paint(BLOCK, 4);
    selectAll();
    expect(countOn(selectionMask(rig.target()))).toBe(32 * 32);
    expect(canStepHistory('undo')).toBe(true);
    stepHistory('undo');
    expect(selectionMask(rig.target())).toBeNull();
    expect(rig.pixels()[4 * 32 + 4]).toBe(4);
    stepHistory('redo');
    expect(countOn(selectionMask(rig.target()))).toBe(32 * 32);
  });

  it('reselects what Deselect dropped', () => {
    const rig = openRig();
    useSelectionHistoryStore.getState().reset();
    rig.select(BLOCK);
    clearSelection();
    expect(selectionMask(rig.target())).toBeNull();
    expect(reselect()).toBe(true);
    expect(countOn(selectionMask(rig.target()))).toBe(BLOCK.width * BLOCK.height);
  });
});
