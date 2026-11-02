/* @layer renderer-app @kind test */
import type { DroppedFile } from '@drizztdourden08/brock-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DragAsset } from '../../src/asset-drag/asset-drag.type';
import { canDropOnMap } from '../../src/tile-drag/can-drop-on-map';
import { dropOnMap } from '../../src/tile-drag/drop-on-map';

const held = vi.hoisted(() => ({ files: vi.fn(), assets: vi.fn(), place: vi.fn(), pick: vi.fn() }));

vi.mock('../../src/tile-drag/drop-files-on-tileset', () => ({ dropFilesOnTileset: held.files }));
vi.mock('../../src/tile-drag/drop-on-tileset', () => ({ dropAssetsOnTileset: held.assets }));
vi.mock('../../src/tilemap/place-stamp-at', () => ({ placeStampAt: held.place }));
vi.mock('../../src/tilemap/pick-tile', () => ({ pickTile: held.pick }));

const file = (name: string, type = ''): DroppedFile => ({ file: new File([], name, { type }), name, path: null, kind: 'file' });

const sprite: DragAsset = { id: 's', kind: 'sprite', assetId: 'spr-1', path: 'hero.bxel' };

beforeEach(() => {
  for (const each of Object.values(held)) each.mockClear();
});

describe('W7 the map canvas as a drop target', { tags: ['standard'] }, () => {
  it('takes a tile only over a cell, and a picture or a sprite anywhere', () => {
    expect(canDropOnMap({ key: 3, index: 0 }, true)).toBe(true);
    expect(canDropOnMap({ key: 3, index: 0 }, false)).toBe(false);
    expect(canDropOnMap({ files: [file('tiles.png', 'image/png')], rejected: [] }, false)).toBe(true);
    expect(canDropOnMap({ files: [file('notes.txt')], rejected: [] }, true)).toBe(false);
    expect(canDropOnMap([sprite], false)).toBe(true);
  });

  it('sends a dropped picture or sprite to the tileset', () => {
    dropOnMap({ files: [file('tiles.png', 'image/png')], rejected: [] }, null);
    expect(held.files).toHaveBeenCalledTimes(1);
    dropOnMap([sprite], null);
    expect(held.assets).toHaveBeenCalledTimes(1);
  });

  it('places a dragged tile on the cell it is dropped on', () => {
    dropOnMap({ key: 3, index: 0 }, { x: 1, y: 2 });
    expect(held.place).toHaveBeenCalledWith([{ x: 1, y: 2 }]);
    dropOnMap({ key: 3, index: 0 }, null);
    expect(held.place).toHaveBeenCalledTimes(1);
  });
});
