/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { wheelBox } from '../../src/sheet-manager/wheel-box';
import { wheelDensity } from '../../src/views/ProjectPanel/behavior/wheel-density';
import { wheelZoom } from '../../src/views/TilesetPanel/behavior/wheel-zoom';

describe('K1 the Ctrl+wheel steps of the tile grid, the sprite grid and the project widget', { tags: ['critical'] }, () => {
  it('steps the tile thumbnails up and down and stops at the ends', () => {
    expect(wheelZoom(2, -100)).toBe(3);
    expect(wheelZoom(2, 100)).toBe(1);
    expect(wheelZoom(4, -100)).toBe(4);
    expect(wheelZoom(1, 100)).toBe(1);
  });

  it('steps the sprite thumbnails by one notch inside the limits', () => {
    expect(wheelBox(48, -1)).toBe(56);
    expect(wheelBox(48, 1)).toBe(40);
    expect(wheelBox(24, 1)).toBe(24);
    expect(wheelBox(128, -1)).toBe(128);
  });

  it('walks the project widget from compact rows through comfortable rows to tiles', () => {
    expect(wheelDensity({ density: 'compact', tile: 64 }, -1)).toEqual({ density: 'comfortable' });
    expect(wheelDensity({ density: 'comfortable', tile: 64 }, -1)).toEqual({ mode: 'list', density: 'grid', tile: 48 });
    expect(wheelDensity({ density: 'grid', tile: 96 }, -1)).toBeNull();
    expect(wheelDensity({ density: 'grid', tile: 48 }, 1)).toEqual({ density: 'comfortable' });
    expect(wheelDensity({ density: 'compact', tile: 64 }, 1)).toBeNull();
  });
});
