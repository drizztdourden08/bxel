/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { snapToGuides } from '../../src/guides/snap-to-guides';

const LINES = { x: [10], y: [6, 20] };

describe('snapping a marquee corner to guides', () => {
  it('lands the dragged edge on a guide within 4 screen pixels', () => {
    const rising = snapToGuides({ x: 10.9, y: 5.6 }, { x: 10, y: 5 }, { lines: LINES, zoom: 4, from: { x: 2, y: 2 } });
    expect(rising).toEqual({ x: 9, y: 5 });
    const falling = snapToGuides({ x: 9.4, y: 6.2 }, { x: 9, y: 6 }, { lines: LINES, zoom: 4, from: { x: 14, y: 14 } });
    expect(falling).toEqual({ x: 10, y: 6 });
  });

  it('leaves a corner alone when no guide is within 4 screen pixels', () => {
    const far = snapToGuides({ x: 12, y: 13 }, { x: 12, y: 13 }, { lines: LINES, zoom: 4, from: { x: 2, y: 2 } });
    expect(far).toEqual({ x: 12, y: 13 });
    const wide = snapToGuides({ x: 10.9, y: 5.6 }, { x: 10, y: 5 }, { lines: LINES, zoom: 1, from: null });
    expect(wide).toEqual({ x: 10, y: 6 });
    expect(snapToGuides({ x: 10, y: 6 }, { x: 10, y: 6 }, { lines: undefined, zoom: 4, from: null })).toEqual({ x: 10, y: 6 });
  });

  it('snaps the start corner so its left and top edge sit on the guide', () => {
    expect(snapToGuides({ x: 9.8, y: 19.7 }, { x: 9, y: 19 }, { lines: LINES, zoom: 8, from: null })).toEqual({ x: 10, y: 20 });
  });
});
