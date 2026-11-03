/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { selectionMask } from '../../src/editor/selection/selection-mask';
import { nudgeOutlineKey } from '../../src/editor/selection/nudge-outline-key';
import { useToolStore } from '../../src/stores/useToolStore';
import { at, BLOCK, openRig } from './selection-harness';

const press = (key: string, shiftKey = false): boolean => {
  let handled = false;
  nudgeOutlineKey({
    key,
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    shiftKey,
    preventDefault: () => {
      handled = true;
    },
  });
  return handled;
};

describe('S2 arrow keys on the select tool', { tags: ['standard'] }, () => {
  it('move the outline by 1 pixel and by 8 with Shift, leaving the pixels alone', () => {
    const rig = openRig();
    rig.paint(BLOCK, 6);
    rig.select(BLOCK);
    useToolStore.getState().selectTool('select');
    expect(press('ArrowRight')).toBe(true);
    expect(selectionMask(rig.target())?.bits[at(5, 4)]).toBe(1);
    expect(selectionMask(rig.target())?.bits[at(4, 4)]).toBe(0);
    expect(press('ArrowDown', true)).toBe(true);
    expect(selectionMask(rig.target())?.bits[at(5, 12)]).toBe(1);
    expect(rig.pixels()[at(4, 4)]).toBe(6);
  });

  it('do nothing on another tool or without a selection', () => {
    const rig = openRig();
    rig.paint(BLOCK, 6);
    useToolStore.getState().selectTool('select');
    expect(press('ArrowRight')).toBe(false);
    rig.select(BLOCK);
    useToolStore.getState().selectTool('move');
    expect(press('ArrowRight')).toBe(false);
  });
});
