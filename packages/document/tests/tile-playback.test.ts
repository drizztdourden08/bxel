/* @layer core @kind test */
import { cellKey, composeMapCell, flattenTilemap, tilePlayback, tileStartOffset, tileStepAt } from '@bxel/document';
import type { MapLayerId, Tile, TilemapId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { animationNamed, apply, buildAnimWorld, createdAnimation } from './anim-engine';
import { step } from './tile-engine';

const SLOTS = Array.from({ length: 16 }, (_, at) => at + 1);

const PAINTED = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 3, y: 2 },
];

const waterMap = (start: 'together' | 'random') => {
  const world = buildAnimWorld();
  const id = createdAnimation(world.engine, [
    step('animation.create', { name: 'water', source: { kind: 'sprites', sprites: [world.a, world.b, world.c], durationMs: 100 } }, 'anim'),
  ]);
  const made = apply(world.engine, [
    step('tileset.create', { name: 'ground', tileWidth: 4, tileHeight: 4 }, 'ts'),
    ...SLOTS.map(() => step('tile.add', { tileset: { ref: 'ts' } })),
    step('tilemap.create', { name: 'sea', tileset: { ref: 'ts' }, columns: 4, rows: 3, layerName: 'Ground' }, 'map'),
  ]);
  const tileset = made.created['ts'] ?? '';
  const tilemap = (made.created['map'] ?? '') as TilemapId;
  apply(world.engine, [
    step('tileset.terrain', { tileset, rules: { kind: 'blob16', keys: SLOTS } }),
    ...SLOTS.map((key) => step('tile.animation', { tileset, key, change: { kind: 'set', animation: id, start } })),
    step('map.terrain', { tilemap, layer: { by: 'name', name: 'Ground' }, mode: 'paint', cells: PAINTED }),
  ]);
  const artwork = world.engine.state().artwork;
  const map = artwork.tilemaps.find((item) => item.id === tilemap);
  const set = artwork.tilesets[0];
  if (!map || !set) throw new Error('no map');
  return { world, artwork, map, set, layer: map.layers[0]?.id as MapLayerId };
};

const placed = (map: ReturnType<typeof waterMap>) =>
  Array.from(map.map.layers[0]?.cells ?? []).flatMap((cell, index) => (cellKey(cell) === 0 ? [] : [{ index, key: cellKey(cell) }]));

const stepOf = (map: ReturnType<typeof waterMap>, index: number, key: number, now: number): number => {
  const tile = map.set.tiles.find((item: Tile) => item.key === key);
  const playback = tile ? tilePlayback(map.artwork, map.set, tile) : null;
  if (!playback) throw new Error('the tile does not play');
  return tileStepAt(playback, now, { map: map.map.id, layer: map.layer, cell: index });
};

describe('animated tiles on a map', () => {
  it('plays terrain-placed water in step, whichever terrain tile each cell took', () => {
    const map = waterMap('together');
    const cells = placed(map);
    expect(cells).toHaveLength(PAINTED.length);
    expect(new Set(cells.map((cell) => cell.key)).size).toBeGreaterThan(1);
    for (const now of [0, 99, 100, 250, 299, 300, 1050]) {
      const steps = new Set(cells.map((cell) => stepOf(map, cell.index, cell.key, now)));
      expect(steps.size).toBe(1);
    }
    expect([0, 100, 250, 300].map((now) => stepOf(map, cells[0]?.index ?? 0, cells[0]?.key ?? 0, now))).toEqual([0, 1, 2, 0]);
  });

  it('starts at a repeatable random point per cell, the same for the same map, layer and cell', () => {
    const map = waterMap('random');
    const cells = placed(map);
    const again = cells.map((cell) => stepOf(map, cell.index, cell.key, 40));
    expect(again).toEqual(cells.map((cell) => stepOf(map, cell.index, cell.key, 40)));
    expect(new Set(again).size).toBeGreaterThan(1);
    const seed = { map: map.map.id, layer: map.layer, cell: 5 };
    expect(tileStartOffset(seed, 300)).toBe(tileStartOffset({ ...seed }, 300));
    expect(tileStartOffset(seed, 300)).toBeLessThan(300);
    expect(tileStartOffset({ ...seed, map: 'tlm_zzzzzz' as TilemapId }, 300)).not.toBe(tileStartOffset(seed, 300));
  });

  it('draws the chosen frame under every flip and keeps the still as frame one', () => {
    const map = waterMap('together');
    const first = placed(map)[0];
    const tile = map.set.tiles.find((item) => item.key === first?.key);
    const playback = tile ? tilePlayback(map.artwork, map.set, tile) : null;
    expect(playback?.frames).toHaveLength(3);
    expect(playback?.cycleMs).toBe(300);
    const still = flattenTilemap(map.artwork, map.map.id);
    const frame = playback?.frames[1] ?? new Uint8Array();
    const second = flattenTilemap(map.artwork, map.map.id, (_layer, index) => (index === first?.index ? frame : null));
    expect(second.pixels).not.toEqual(still.pixels);
    const cell = composeMapCell(map.artwork, map.map, first?.index ?? 0, (_layer, index) => (index === first?.index ? frame : null));
    expect(Array.from(cell)).toEqual(Array.from(frame));
    expect(animationNamed(map.world.engine, 'water').frames).toHaveLength(3);
  });
});
