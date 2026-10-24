/* @layer renderer-app @kind test */
import { cellKey } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { decodePng } from '@bxel/formats';
import { beforeEach, describe, expect, it } from 'vitest';
import type { ExportPlan } from '../../src/export/export.type';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { deleteTile } from '../../src/tilemap/delete-tile';
import { placeStampAt } from '../../src/tilemap/place-stamp-at';
import { artworkNow, mapNow, openMapFile, tilesetNow } from './map-harness';
import { planMapExport } from './plan-map-export';

type Json = Record<string, unknown>;

const textOf = (plan: ExportPlan, at: number): string => {
  const made = plan.files[at]?.make();
  if (!made?.ok || made.data.kind !== 'text') throw new Error('no text file');
  return made.data.text;
};

beforeEach(() => {
  openMapFile();
  useTilemapStore.getState().setFlags({ flipX: true, flipY: false, diagonal: false });
  placeStampAt([{ x: 0, y: 0 }, { x: 3, y: 2 }]);
  useTilemapStore.getState().setFlags({ flipX: false, flipY: false, diagonal: false });
  useTilemapStore.getState().setStamp({ columns: 1, rows: 1, keys: [1] });
  placeStampAt([{ x: 1, y: 1 }]);
});

describe('exporting a map as Bxel map JSON', () => {
  it('writes a tileset image and a map file named after the map', () => {
    const plan = planMapExport(artworkNow(), {});
    expect(plan.problem).toBeNull();
    expect(plan.files.map((file) => file.name)).toEqual(['level-tiles.png', 'level.json']);
    expect(plan.files[0]).toMatchObject({ width: 4, height: 2 });
    const made = plan.files[0]?.make();
    const image = made?.ok && made.data.kind === 'bytes' ? decodePng(made.data.bytes) : null;
    expect(image).toMatchObject({ ok: true, width: 4, height: 2 });
  });

  it('lists the key and the turn of every cell and names only tiles of the tileset', () => {
    const json = JSON.parse(textOf(planMapExport(artworkNow(), {}), 1)) as Json;
    expect(json['format']).toBe('bxel-tilemap');
    const layers = json['layers'] as { keys: number[]; flags: number[] }[];
    const tiles = (json['tileset'] as { tiles: { key: number }[] }).tiles.map((tile) => tile.key);
    expect(layers[0]?.keys.slice(0, 1)).toEqual([2]);
    expect(layers[0]?.flags[0]).toBe(1);
    for (const key of layers.flatMap((layer) => layer.keys)) expect(key === 0 || tiles.includes(key)).toBe(true);
    expect(tiles).toEqual(tilesetNow().tiles.map((tile) => tile.key));
  });

  it('keeps every exported key in the tileset after a tile is deleted with its cells cleared', () => {
    expect(deleteTile(2, 0)).toBe(true);
    const json = JSON.parse(textOf(planMapExport(artworkNow(), {}), 1)) as Json;
    const layers = json['layers'] as { keys: number[] }[];
    expect(layers[0]?.keys.filter((key) => key !== 0)).toEqual([1]);
  });

  it('blocks the export when a cell names a tile the tileset does not have', () => {
    const map = mapNow();
    const layer = map.layers[0];
    const cells = Uint32Array.from(layer?.cells ?? []);
    cells[5] = 9;
    const broken: Artwork = { ...artworkNow(), tilemaps: [{ ...map, layers: [{ ...(layer as NonNullable<typeof layer>), cells }] }] };
    const plan = planMapExport(broken, {});
    expect(plan.files).toEqual([]);
    expect(plan.problem).toContain('key 9');
  });

  it('blocks the export of a file without a map or without tiles', () => {
    expect(planMapExport({ ...artworkNow(), tilemaps: [] }, {}).problem).toContain('no tilemap');
    expect(planMapExport({ ...artworkNow(), tilesets: artworkNow().tilesets.map((set) => ({ ...set, tiles: [] })) }, {}).problem).toContain('no tiles');
  });
});

describe('exporting a map as Tiled JSON', () => {
  it('writes global tile ids with the flip bits in the top bits', () => {
    const plan = planMapExport(artworkNow(), { mapFormat: 'tiled' });
    expect(plan.files.map((file) => file.name)).toEqual(['level-tiles.png', 'level.tmj']);
    const json = JSON.parse(textOf(plan, 1)) as { orientation: string; layers: { data: number[] }[]; tilesets: { firstgid: number; tilecount: number }[] };
    expect(json.orientation).toBe('orthogonal');
    expect(json.tilesets[0]).toMatchObject({ firstgid: 1, tilecount: 2 });
    const data = json.layers[0]?.data ?? [];
    expect(data[0]).toBe((0x80000000 | 2) >>> 0);
    expect(data[5]).toBe(1);
    expect(data.every((gid) => cellKey(gid) <= 2)).toBe(true);
  });
});
