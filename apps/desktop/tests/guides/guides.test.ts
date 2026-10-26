/* @layer renderer-app @kind test */
import type { Sprite } from '@bxel/document';
import type { GuideFrame } from '../../src/guides/guide.type';
import { describe, expect, it } from 'vitest';
import { guideNear } from '../../src/guides/guide-near';
import { guidePosition } from '../../src/guides/guide-position';
import { snapGuide } from '../../src/guides/snap-guide';
import { shownGuides } from '../../src/views/EditorCanvas/behavior/shown-guides';

const handle = (zoom: number): GuideFrame => ({
  pixelToScreen: (x, y) => ({ x: 100 + x * zoom, y: 50 + y * zoom }),
  view: () => ({ zoom }),
});

const sprite: Pick<Sprite, 'width' | 'height' | 'guides'> = { width: 16, height: 8, guides: { x: [4], y: [2.5] } };

describe('guide snapping', () => {
  it('snaps to the half pixel, or to the whole pixel on request, inside the sprite', () => {
    expect(snapGuide(3.2, 16, false)).toBe(3);
    expect(snapGuide(3.3, 16, false)).toBe(3.5);
    expect(snapGuide(3.6, 16, true)).toBe(4);
    expect(snapGuide(-4, 16, false)).toBe(0);
    expect(snapGuide(99, 16, false)).toBe(16);
  });

  it('maps a screen point to a position through the origin and the zoom', () => {
    const request = { axis: 'x', length: 16, whole: false } as const;
    expect(guidePosition(handle(8), request, { clientX: 100 + 8 * 5.1, clientY: 0 })).toBe(5);
    expect(guidePosition(handle(8), { ...request, axis: 'y' }, { clientX: 0, clientY: 50 + 8 * 2.3 })).toBe(2.5);
    expect(guidePosition(handle(8), request, { clientX: 5000, clientY: 0 })).toBe(16);
  });
});

describe('guides on the canvas', () => {
  it('finds the guide under the pointer, within a few screen pixels and inside the sprite span', () => {
    expect(guideNear(handle(8), sprite, { clientX: 100 + 32 + 2, clientY: 60 })).toEqual({ axis: 'x', position: 4 });
    expect(guideNear(handle(8), sprite, { clientX: 140, clientY: 60 })).toBeNull();
    expect(guideNear(handle(8), sprite, { clientX: 110, clientY: 50 + 20 })).toEqual({ axis: 'y', position: 2.5 });
    expect(guideNear(handle(8), sprite, { clientX: 100 + 32, clientY: 50 + 8 * 8 + 40 })).toBeNull();
  });

  it('finds nothing in a sprite without guides', () => {
    expect(guideNear(handle(8), { width: 16, height: 8 }, { clientX: 132, clientY: 60 })).toBeNull();
  });

  it('shows the dragged guide at its live place and drops it when it is over the ruler', () => {
    expect(shownGuides(sprite.guides, null)).toEqual({ x: [4], y: [2.5] });
    expect(shownGuides(sprite.guides, { axis: 'x', from: 4, position: 6 })).toEqual({ x: [6], y: [2.5] });
    expect(shownGuides(sprite.guides, { axis: 'x', from: 4, position: null })).toEqual({ x: [], y: [2.5] });
    expect(shownGuides(sprite.guides, { axis: 'y', from: null, position: 1 })).toEqual({ x: [4], y: [2.5, 1] });
    expect(shownGuides(undefined, { axis: 'y', from: null, position: null })).toEqual({ x: [], y: [] });
  });
});
