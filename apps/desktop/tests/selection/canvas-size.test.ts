/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { cropToSelection } from '../../src/canvas-size/crop-to-selection';
import { resizeActiveSprite } from '../../src/canvas-size/resize-active-sprite';
import { trimActiveSprite } from '../../src/canvas-size/trim-active-sprite';
import { selectionMask } from '../../src/editor/selection/selection-mask';
import { useNoticeStore } from '../../src/stores/useNoticeStore';
import { BLOCK, openRig } from './selection-harness';

describe('the canvas size actions', () => {
  it('crops the sprite to the box of the selection in one undo step and clears the selection', () => {
    const rig = openRig();
    rig.paint(BLOCK, 3);
    rig.select({ x: 2, y: 2, width: 8, height: 6 });
    expect(cropToSelection()).toBe(true);
    expect(rig.target().sprite.width).toBe(8);
    expect(rig.target().sprite.height).toBe(6);
    expect(selectionMask(rig.target())).toBeNull();
    expect(rig.host.view(rig.documentId)?.lastEvent.label).toBe('Crop sprite to selection');
    rig.host.undo(rig.documentId);
    expect(rig.target().sprite.width).toBe(32);
  });

  it('asks for a selection before it crops', () => {
    const rig = openRig();
    expect(cropToSelection()).toBe(false);
    expect(rig.target().sprite.width).toBe(32);
    expect(useNoticeStore.getState().notice?.text).toContain('Select an area');
  });

  it('trims to the drawn pixels in one undo step and tells when there is nothing to trim', () => {
    const rig = openRig();
    rig.paint(BLOCK, 3);
    expect(trimActiveSprite()).toBe(true);
    expect(rig.target().sprite.width).toBe(BLOCK.width);
    expect(rig.target().sprite.height).toBe(BLOCK.height);
    expect(trimActiveSprite()).toBe(false);
    expect(useNoticeStore.getState().notice?.text).toContain('nothing to trim');
    rig.host.undo(rig.documentId);
    expect(rig.target().sprite.width).toBe(32);
  });

  it('sets the canvas size around an anchor in one undo step', () => {
    const rig = openRig();
    expect(resizeActiveSprite({ width: 40, height: 20, anchor: 'top-left' })).toBe(true);
    expect(rig.target().sprite.width).toBe(40);
    expect(rig.target().sprite.height).toBe(20);
    rig.host.undo(rig.documentId);
    expect(rig.target().sprite.height).toBe(32);
  });
});
