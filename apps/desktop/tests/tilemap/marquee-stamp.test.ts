/* @layer renderer-app @kind test */
import type { Tile, TileLayout } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { marqueeStamp } from '../../src/views/TilesetPanel/behavior/marquee-stamp';

const tile = (key: number): Tile => ({ key }) as Tile;

const layout = (): TileLayout => ({
  columns: 3,
  rows: 2,
  slots: [tile(1), tile(2), tile(3), tile(4), null, tile(6)],
  indexOf: new Map(),
});

describe('S2 the stamp a marquee over the tile grid makes', { tags: ['standard'] }, () => {
  it('clears the stamp when the box holds no tile', () => {
    expect(marqueeStamp(layout(), [])).toEqual({ columns: 1, rows: 1, keys: [0] });
    expect(marqueeStamp(layout(), [4])).toEqual({ columns: 1, rows: 1, keys: [0] });
  });

  it('makes a block of the tiles under a box that covers a whole rectangle', () => {
    expect(marqueeStamp(layout(), [0, 1, 3])).toMatchObject({ columns: 2, rows: 2 });
    expect(marqueeStamp(layout(), [1, 2])).toEqual({ columns: 2, rows: 1, keys: [2, 3] });
  });

  it('makes a scatter of the picked tiles when they do not fill their rectangle', () => {
    const stamp = marqueeStamp(layout(), [0, 5]);
    expect(stamp.scatter).toBe(true);
    expect(stamp.keys).toEqual([1, 6]);
  });
});
