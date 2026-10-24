/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import type { ExportPlan } from '../../src/export/export.type';
import { setCollision } from '../../src/tilemap/set-collision';
import { artworkNow, openMapFile } from './map-harness';
import { planMapExport } from './plan-map-export';

const jsonOf = (plan: ExportPlan): Record<string, unknown> => {
  const made = plan.files[1]?.make();
  if (!made?.ok || made.data.kind !== 'text') throw new Error('no map file');
  return JSON.parse(made.data.text) as Record<string, unknown>;
};

beforeEach(() => {
  openMapFile();
  setCollision(1, { kind: 'full' });
  setCollision(2, { kind: 'polygon', points: [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }] });
});

describe('exporting tile collision', () => {
  it('writes each shape into the Bxel map JSON beside its tile', () => {
    const tileset = jsonOf(planMapExport(artworkNow(), { mapFormat: 'bxel' })).tileset as { tiles: { key: number; collision?: { kind: string } }[] };
    expect(tileset.tiles.map((tile) => [tile.key, tile.collision?.kind])).toEqual([
      [1, 'full'],
      [2, 'polygon'],
    ]);
  });

  it('writes tile object groups into the Tiled JSON', () => {
    const map = jsonOf(planMapExport(artworkNow(), { mapFormat: 'tiled' })) as { tilesets: { tiles: { id: number; objectgroup: { objects: unknown[] } }[] }[] };
    const tiles = map.tilesets[0]?.tiles ?? [];
    expect(tiles.map((tile) => tile.id)).toEqual([0, 1]);
    expect(tiles.every((tile) => tile.objectgroup.objects.length === 1)).toBe(true);
  });
});
