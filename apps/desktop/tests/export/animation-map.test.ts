/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import type { TilemapId } from '@bxel/document';
import { decodePng } from '@bxel/formats';
import type { PlannedFile } from '../../src/export/export.type';
import { planExport } from '../../src/export/plan-export';
import { grid, run, spriteStep, stepOf } from './animation-harness';
import { bytesOf, frozenOf, harness, settingsOf, textOf } from './export-harness';
import type { ExportHarness } from './export-harness';
import { expectGolden } from './golden';

type Water = ExportHarness & { readonly tileset: string; readonly map: TilemapId };

const waterWorld = (): Water => {
  const h = harness();
  const first = run(h, [
    stepOf('tileset.create', { name: 'ground', tileWidth: 2, tileHeight: 2 }, 'ts'),
    stepOf('tile.add', { tileset: { ref: 'ts' }, name: 'grass' }, 'grass'),
    stepOf('tile.add', { tileset: { ref: 'ts' }, name: 'sea' }, 'sea'),
    spriteStep('pixels.patch', grid(2, 2, [[0, 0, 2], [1, 0, 2], [0, 1, 2], [1, 1, 2]]), 'grass'),
    spriteStep('pixels.patch', grid(2, 2, [[0, 0, 4], [1, 0, 4], [0, 1, 4], [1, 1, 4]]), 'sea'),
    ...[0, 1, 2].flatMap((i) => [
      stepOf('sprite.create', { name: `wave${i}`, width: 2, height: 2 }, `w${i}`),
      spriteStep('pixels.patch', grid(2, 2, [[i % 2, 0, 5], [0, 1, 6 + i], [1, 1, 4]]), `w${i}`),
    ]),
    stepOf('animation.create', { name: 'water', source: { kind: 'blank', width: 2, height: 2, frames: 3 } }, 'anim'),
    stepOf('tilemap.create', { name: 'level', tileset: { ref: 'ts' }, columns: 3, rows: 2, layerName: 'Ground' }, 'map'),
  ]);
  const animation = first['anim'] ?? '';
  const waves = [0, 1, 2].map((i) => first[`w${i}`]);
  run(h, [
    ...waves.map((sprite, index) =>
      stepOf('animation.frame.update', { animation, frame: { by: 'index', index }, sprite, durationMs: 200 + index * 100 }),
    ),
    stepOf('map.paint', {
      tilemap: first['map'],
      layer: { by: 'name', name: 'Ground' },
      tile: 2,
      flags: {},
      cells: [{ x: 0, y: 0 }, { x: 2, y: 1 }],
    }),
    stepOf('map.paint', { tilemap: first['map'], layer: { by: 'name', name: 'Ground' }, tile: 1, flags: {}, cells: [{ x: 1, y: 0 }] }),
    stepOf('tile.animation', { tileset: first['ts'], key: 2, change: { kind: 'set', animation, start: 'random' } }),
  ]);
  return { ...h, tileset: first['ts'] ?? '', map: (first['map'] ?? '') as TilemapId };
};

const exportMap = (world: Water, mapFormat: 'tiled' | 'bxel') =>
  planExport({
    frozen: frozenOf(world),
    settings: settingsOf({ kind: 'map', mapFormat }),
    selectedIds: [],
    current: { spriteId: null, frameId: null, tilemapId: world.map },
  });

type TiledMap = {
  layers: { data: number[] }[];
  tilesets: { tilecount: number; tiles?: { id: number; animation?: { tileid: number; duration: number }[]; properties?: { name: string }[] }[] }[];
};

const fileAt = (plan: ReturnType<typeof exportMap>, at: number): PlannedFile => {
  const file = plan.files[at];
  if (!file) throw new Error('the plan has no such file');
  return file;
};

const parsed = (world: Water): TiledMap => {
  const plan = exportMap(world, 'tiled');
  expect(plan.problem).toBeNull();
  return JSON.parse(textOf(fileAt(plan, 1))) as TiledMap;
};

describe('Tiled map with an animated tile', () => {
  it('keeps the gids and appends the composed frames after the normal tiles', () => {
    const world = waterWorld();
    const map = parsed(world);
    expect(map.layers[0]?.data).toEqual([2, 1, 0, 0, 0, 2]);
    expect(map.tilesets[0]?.tilecount).toBe(5);
    expect(map.tilesets[0]?.tiles).toEqual([
      {
        id: 1,
        animation: [
          { tileid: 2, duration: 200 },
          { tileid: 3, duration: 300 },
          { tileid: 4, duration: 400 },
        ],
        properties: [{ name: 'bxelStart', type: 'string', value: 'random' }],
      },
    ]);
    expectGolden('water/level.tmj', textOf(fileAt(exportMap(world, 'tiled'), 1)));
  });

  it('gives the same gids as the map without the animation', () => {
    const world = waterWorld();
    const withAnimation = parsed(world);
    run(world, [stepOf('tile.animation', { tileset: world.tileset, key: 2, change: { kind: 'clear' } })]);
    const still = parsed(world);
    expect(withAnimation.layers).toEqual(still.layers);
    expect(still.tilesets[0]?.tilecount).toBe(2);
    expect(still.tilesets[0]?.tiles).toBeUndefined();
  });

  it('draws the frames into the tileset image and notes the random start', () => {
    const world = waterWorld();
    const plan = exportMap(world, 'tiled');
    const image = decodePng(bytesOf(fileAt(plan, 0)));
    if (!image.ok) throw new Error('the image cannot be read');
    expect([image.width, image.height]).toEqual([10, 2]);
    expect(plan.notes.some((note) => note.includes('no random start'))).toBe(true);
    expect(plan.notes.some((note) => note.includes('3 animation frames are added'))).toBe(true);
  });

  it('keeps the start in the Bxel map JSON', () => {
    const plan = exportMap(waterWorld(), 'bxel');
    const json = JSON.parse(textOf(fileAt(plan, 1))) as { tileset: { animations: { key: number; start: string; frames: unknown[] }[] } };
    expect(json.tileset.animations).toMatchObject([{ key: 2, start: 'random' }]);
    expect(json.tileset.animations[0]?.frames).toHaveLength(3);
  });
});
