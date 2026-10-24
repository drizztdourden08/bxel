/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { CANVAS_DEFAULTS } from '../../src/canvas-look/canvas-look.constants';
import { lookOf } from '../../src/canvas-look/look-of';
import { spriteLook } from '../../src/canvas-look/sprite-look';

describe('the pixel grid of a sprite', () => {
  const base = lookOf(CANVAS_DEFAULTS);

  it('keeps the app look for a sprite with no grid of its own', () => {
    expect(spriteLook(base, undefined)).toBe(base);
  });

  it('spaces the pixel lines by the cell of the sprite, across and down', () => {
    const own = spriteLook(base, { width: 8, height: 4 });
    expect(own.pixelLine).toMatchObject({ every: 8, everyY: 4 });
    expect(own.majorLine).toEqual(base.majorLine);
    expect(base.pixelLine.every).toBe(1);
  });
});
