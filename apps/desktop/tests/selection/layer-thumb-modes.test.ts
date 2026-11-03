/* @layer renderer-app @kind test */
import type { MouseEvent } from 'react';
import { describe, expect, it } from 'vitest';
import { selectionMask } from '../../src/editor/selection/selection-mask';
import { thumbGestures } from '../../src/views/LayerStack/behavior/thumb-gestures';
import { at, BLOCK, countOn, openRig } from './selection-harness';
import type { SelectionRig } from './selection-harness';

const WIDE = { x: 0, y: 0, width: 10, height: 10 };

const click = (rig: SelectionRig, keys: { shiftKey: boolean; altKey: boolean }): void => {
  const layerId = rig.target().sprite.layers[0]?.id ?? '';
  const event = { ctrlKey: true, metaKey: false, ...keys, stopPropagation: () => undefined } as unknown as MouseEvent<HTMLElement>;
  thumbGestures(layerId, true).onClick(event);
};

describe('S2 layer thumb clicks use the marquee mode keys', { tags: ['standard'] }, () => {
  it('Ctrl replaces, Ctrl+Shift adds, Ctrl+Alt subtracts and Ctrl+Shift+Alt intersects', () => {
    const rig = openRig();
    rig.paint(BLOCK, 6);
    click(rig, { shiftKey: false, altKey: false });
    expect(countOn(selectionMask(rig.target()))).toBe(12);
    rig.select(WIDE);
    click(rig, { shiftKey: false, altKey: true });
    expect(countOn(selectionMask(rig.target()))).toBe(100 - 12);
    expect(selectionMask(rig.target())?.bits[at(5, 5)]).toBe(0);
    rig.select(WIDE);
    click(rig, { shiftKey: true, altKey: true });
    expect(countOn(selectionMask(rig.target()))).toBe(12);
    rig.select(BLOCK);
    click(rig, { shiftKey: true, altKey: false });
    expect(countOn(selectionMask(rig.target()))).toBe(12);
  });
});
