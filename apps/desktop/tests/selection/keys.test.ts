/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { applyPreview } from '../../src/editor/pending/apply-preview';
import { cancelPreview } from '../../src/editor/pending/cancel-preview';
import { addVertex } from '../../src/editor/selection/add-vertex';
import { startFlip } from '../../src/editor/transform/start-flip';
import { usePendingStore } from '../../src/stores/usePendingStore';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { BLOCK, openRig } from './selection-harness';

describe('the apply and cancel keys', () => {
  it('close an open polygon first, then apply or cancel the pending edit', () => {
    const rig = openRig();
    rig.paint(BLOCK, 6);
    rig.select(BLOCK);
    startFlip('vertical');
    addVertex({ x: 1, y: 1 });
    addVertex({ x: 9, y: 1 });
    addVertex({ x: 9, y: 9 });
    expect(applyPreview()).toBe(true);
    expect(useSelectionStore.getState().vertices).toHaveLength(0);
    expect(usePendingStore.getState().pending).not.toBeNull();
    addVertex({ x: 1, y: 1 });
    expect(cancelPreview()).toBe(true);
    expect(usePendingStore.getState().pending).not.toBeNull();
    expect(cancelPreview()).toBe(true);
    expect(usePendingStore.getState().pending).toBeNull();
    expect(cancelPreview()).toBe(false);
  });
});
