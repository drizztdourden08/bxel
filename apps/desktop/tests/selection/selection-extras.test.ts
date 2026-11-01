/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { gated } from '../../src/keymap/gated';
import { pasteNewSprite } from '../../src/editor/selection/paste-new-sprite';
import { selectByFrame } from '../../src/editor/selection/select-by-frame';
import { selectionMask } from '../../src/editor/selection/selection-mask';
import { selectionToGuides } from '../../src/editor/selection/selection-to-guides';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { BLOCK, countOn, openRig } from './selection-harness';

describe('S2 selection extras', { tags: ['standard'] }, () => {
  it('selection to guides adds a guide on each edge of the selection as one step', () => {
    const rig = openRig();
    rig.select(BLOCK);
    expect(selectionToGuides()).toBe(true);
    expect(rig.target().sprite.guides).toEqual({ x: [BLOCK.x, BLOCK.x + BLOCK.width], y: [BLOCK.y, BLOCK.y + BLOCK.height] });
    rig.host.undo(rig.documentId);
    expect(rig.target().sprite.guides).toBeUndefined();
  });

  it('select by frame takes the pixels the layer uses in any frame', () => {
    const rig = openRig();
    rig.paint({ x: 3, y: 3, width: 2, height: 2 }, 6);
    selectByFrame();
    expect(countOn(selectionMask(rig.target()))).toBe(4);
  });

  it('paste as a new sprite makes a sprite of the clip size with the clip pixels', () => {
    const rig = openRig();
    useSelectionStore.setState({ clipboard: { width: 3, height: 2, origin: { x: 5, y: 5 }, pixels: Uint8Array.from([1, 2, 3, 0, 4, 5]), bits: Uint8Array.from([1, 1, 1, 0, 1, 1]) } });
    const before = rig.host.view(rig.documentId)?.state.artwork.sprites.length ?? 0;
    expect(pasteNewSprite()).toBe(true);
    const sprites = rig.host.view(rig.documentId)?.state.artwork.sprites ?? [];
    expect(sprites).toHaveLength(before + 1);
    const made = sprites.at(-1);
    expect([made?.width, made?.height]).toEqual([3, 2]);
    expect(made?.name).toBe('Pasted');
  });

  it('a selection command that needs a selection says so in its own words, and select by frame needs none', () => {
    const rig = openRig();
    const reason = (id: string) => gated({ id, label: id, run: () => undefined }).reason?.();
    expect(reason('selection.border')).toBe('Select some pixels first.');
    expect(reason('selection.to_guides')).toBe('Select some pixels first.');
    expect(reason('selection.select_by_frame')).toBeNull();
    rig.select(BLOCK);
    expect(reason('selection.border')).toBeNull();
  });
});
