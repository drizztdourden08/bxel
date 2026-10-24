/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { tilePlacements } from '../../src/views/PixelViewport/behavior/tile-placements';
import type { PlacedImage } from '../../src/views/PixelViewport/behavior/viewport.type';

const placed: PlacedImage = { x: 100, y: 60, scale: 4, width: 64, height: 48 };
const room = { width: 300, height: 200 };

describe('tile placements', () => {
  it('places the sprite alone when the tiling is off', () => {
    expect(tilePlacements(placed, { x: false, y: false }, room)).toEqual([placed]);
  });

  it('puts the sprite first and repeats it across the room along one axis', () => {
    const tiles = tilePlacements(placed, { x: true, y: false }, room);
    expect(tiles[0]).toEqual(placed);
    expect(tiles.slice(1).every((tile) => tile.y === placed.y)).toBe(true);
    expect(tiles.map((tile) => tile.x).sort((a, b) => a - b)).toEqual([-28, 36, 100, 164, 228, 292]);
  });

  it('repeats the sprite along both axes and never twice at the same place', () => {
    const tiles = tilePlacements(placed, { x: true, y: true }, room);
    const spots = new Set(tiles.map((tile) => `${tile.x},${tile.y}`));
    expect(spots.size).toBe(tiles.length);
    expect(tiles.length).toBeGreaterThan(9);
    expect(spots.has('36,12')).toBe(true);
  });
});
