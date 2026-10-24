/* @layer tests @kind test */
import { writeTiledJson, writeTilemapJson } from '@bxel/formats';
import type { MapOrientationInput } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { makeMapInput, parseMap, parseTiled } from './make-tilemap-input';

const withOrientation = (orientation: MapOrientationInput) => ({ ...makeMapInput([5, 9, 0, 12]), orientation });

const iso: MapOrientationInput = { kind: 'isometric', staggerAxis: 'y', staggerIndex: 'odd', hexSideLength: 0 };
const staggered: MapOrientationInput = { kind: 'staggered', staggerAxis: 'x', staggerIndex: 'even', hexSideLength: 0 };
const hex: MapOrientationInput = { kind: 'hexagonal', staggerAxis: 'y', staggerIndex: 'odd', hexSideLength: 4 };

describe('map orientation in the Tiled JSON', () => {
  it('stays orthogonal without an orientation', () => {
    const map = parseTiled(writeTiledJson(makeMapInput([5, 9, 0, 12])));
    expect(map.orientation).toBe('orthogonal');
    expect(map).not.toHaveProperty('staggeraxis');
  });

  it('writes isometric with no stagger fields', () => {
    const map = parseTiled(writeTiledJson(withOrientation(iso)));
    expect(map.orientation).toBe('isometric');
    expect(map).not.toHaveProperty('staggeraxis');
  });

  it('writes the stagger axis and index for staggered maps', () => {
    expect(parseTiled(writeTiledJson(withOrientation(staggered)))).toMatchObject({ orientation: 'staggered', staggeraxis: 'x', staggerindex: 'even' });
  });

  it('adds the hexagon side length for hexagonal maps', () => {
    expect(parseTiled(writeTiledJson(withOrientation(hex)))).toMatchObject({ orientation: 'hexagonal', hexsidelength: 4, staggeraxis: 'y', staggerindex: 'odd' });
  });
});

describe('map orientation in the Bxel map JSON', () => {
  it('lists the orientation only when the map has one', () => {
    expect(parseMap(writeTilemapJson(withOrientation(hex)))).toMatchObject({ orientation: hex });
    expect(parseMap(writeTilemapJson(makeMapInput([5, 9, 0, 12])))).not.toHaveProperty('orientation');
  });
});
