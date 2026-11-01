/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { BRUSH_DRAG_PIXELS } from '../../src/editor/brush-resize.constants';
import { brushResizeKeys } from '../../src/editor/brush-resize-keys';
import { brushSizeFromDrag } from '../../src/editor/brush-size-from-drag';
import { BRUSH_SIZE } from '../../src/stores/tool-store.constants';

describe('K1 resizing the brush by a drag on the canvas', { tags: ['critical'] }, () => {
  it('keeps the size when the pointer has not moved', () => {
    expect(brushSizeFromDrag(5, 0)).toBe(5);
    expect(brushSizeFromDrag(5, BRUSH_DRAG_PIXELS / 2 - 1)).toBe(5);
  });

  it('grows one step to the right and shrinks one step to the left', () => {
    expect(brushSizeFromDrag(5, BRUSH_DRAG_PIXELS)).toBe(6);
    expect(brushSizeFromDrag(5, -BRUSH_DRAG_PIXELS * 2)).toBe(3);
  });

  it('stays inside the limits of the brush', () => {
    expect(brushSizeFromDrag(5, -BRUSH_DRAG_PIXELS * 100)).toBe(BRUSH_SIZE.min);
    expect(brushSizeFromDrag(5, BRUSH_DRAG_PIXELS * 1000)).toBe(BRUSH_SIZE.max);
  });

  it('asks for control and alt together, never with shift', () => {
    expect(brushResizeKeys({ ctrlKey: true, altKey: true, shiftKey: false })).toBe(true);
    expect(brushResizeKeys({ ctrlKey: true, altKey: false, shiftKey: false })).toBe(false);
    expect(brushResizeKeys({ ctrlKey: true, altKey: true, shiftKey: true })).toBe(false);
  });
});
