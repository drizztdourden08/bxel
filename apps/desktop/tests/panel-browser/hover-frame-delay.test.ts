/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { HOVER_FRAME_MAX_MS, HOVER_FRAME_MIN_MS } from '../../src/asset-thumbs/asset-thumbs.constants';
import { hoverFrameDelay } from '../../src/asset-thumbs/hover-frame-delay';

describe('S2 the hover animation of a thumbnail', { tags: ['standard'] }, () => {
  it('keeps a frame time as it is inside the range', () => {
    expect(hoverFrameDelay(120)).toBe(120);
  });

  it('clamps very short and very long frames', () => {
    expect(hoverFrameDelay(1)).toBe(HOVER_FRAME_MIN_MS);
    expect(hoverFrameDelay(60000)).toBe(HOVER_FRAME_MAX_MS);
  });
});
