/* @layer renderer-app @kind test */
import { COMMAND_NAME, findBank, flattenTilemap, NO_FLAGS } from '@bxel/document';
import type { Rect } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { takeDirty } from '../../src/canvas-dirty/take-dirty';
import { trackPixels } from '../../src/canvas-dirty/track-pixels';
import { bankRgba } from '../../src/export/bank-rgba';
import { runDocument } from '../../src/sheet/run-document';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { createAnimator } from '../../src/tile-animation/create-animator';
import { animationFromTile } from '../../src/tile-animation/tile-animation-actions';
import { tilePlan } from '../../src/tile-animation/tile-plan';
import { strokePlace } from '../../src/tilemap/stroke-place';
import { artworkNow, mapNow, openMapFile, tilesetNow } from './map-harness';

const CHANNELS = 4;
const DEAD = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 2 }];

const lit = (): void => {
  openMapFile();
  expect(animationFromTile(artworkNow(), tilesetNow(), tilesetNow().tiles[1]!)).toBe(true);
  const id = artworkNow().animations[0]!.id;
  const more = runDocument('Second frame', [
    { name: COMMAND_NAME.animationFrameAdd, targets: null, options: { animation: id, source: { kind: 'empty', count: 1 }, durationMs: 100 } },
    { name: COMMAND_NAME.animationFrameOwn, targets: null, options: { animation: id, frame: { by: 'index', index: 1 } }, ref: 'own' },
    {
      name: COMMAND_NAME.pixelsPatch,
      targets: { sprites: [{ ref: 'own' }], layers: { by: 'all' }, frames: { by: 'all' } },
      options: { rect: { x: 0, y: 0, width: 2, height: 2 }, pixels: Uint8Array.from([5, 5, 5, 5]), skipZero: false },
    },
    { name: COMMAND_NAME.animationFrameUpdate, targets: null, options: { animation: id, frame: { by: 'index', index: 0 }, durationMs: 100 } },
  ]);
  expect(more).not.toBeNull();
  for (const point of DEAD) expect(strokePlace([point])).toBe(true);
  useTilemapStore.getState().setFlags({ ...NO_FLAGS, flipX: true });
  expect(strokePlace([{ x: 3, y: 0 }])).toBe(true);
};

const world = () => {
  lit();
  const artwork = artworkNow();
  const tilemap = mapNow();
  const flat = flattenTilemap(artwork, tilemap.id);
  const bank = findBank(artwork, flat.bankId);
  if (!bank) throw new Error('no palette');
  const table = bankRgba(bank);
  const data = new Uint8ClampedArray(flat.pixels.length * CHANNELS);
  flat.pixels.forEach((index, at) => data.set(table.subarray(index * CHANNELS, (index + 1) * CHANNELS), at * CHANNELS));
  trackPixels(data);
  const image = { data, width: flat.width, height: flat.height };
  const colour = (x: number, y: number): number[] => Array.from(data.subarray((y * flat.width + x) * CHANNELS, (y * flat.width + x + 1) * CHANNELS));
  const paletteOf = (index: number): number[] => Array.from(table.subarray(index * CHANNELS, (index + 1) * CHANNELS));
  return { artwork, tilemap, plan: tilePlan(artwork, tilemap), image, colour, paletteOf, table, still: Uint8ClampedArray.from(data) };
};

describe('animated tiles on the map', () => {
  it('plans only the placed cells whose tile plays an animation', () => {
    const { plan } = world();
    expect(plan.cells.map((cell) => cell.index).sort((left, right) => left - right)).toEqual([0, 1, 3, 10]);
    expect(plan.cells.every((cell) => cell.playback.cycleMs === 200)).toBe(true);
  });

  it('draws frames by the clock, redraws only the animated cells and only when the frame changes', () => {
    const { plan, image, colour, paletteOf, table } = world();
    const animator = createAnimator(plan, image, table);
    expect(animator.advance(0)).toBe(true);
    expect(colour(0, 0)).toEqual(paletteOf(2));
    expect(colour(6, 0)).toEqual(paletteOf(3));
    expect(colour(7, 0)).toEqual(paletteOf(2));
    expect(takeDirty(image.data)).toEqual<Rect>({ x: 0, y: 0, width: 8, height: 6 });
    expect(animator.advance(50)).toBe(false);
    expect(animator.advance(120)).toBe(true);
    expect(colour(0, 0)).toEqual(paletteOf(5));
    expect(colour(6, 0)).toEqual(paletteOf(5));
    expect(colour(4, 4)).toEqual(paletteOf(5));
    expect(colour(4, 2)).toEqual(paletteOf(0));
    expect(animator.advance(215)).toBe(true);
    expect(colour(0, 0)).toEqual(paletteOf(2));
  });

  it('puts the still back when the animation stops', () => {
    const { plan, image, table, still } = world();
    const animator = createAnimator(plan, image, table);
    animator.advance(120);
    expect(Array.from(image.data)).not.toEqual(Array.from(still));
    animator.restore();
    expect(Array.from(image.data)).toEqual(Array.from(still));
  });

  it('starts a random cell at its own point, the same every time', () => {
    const { artwork, tilemap, image, table } = world();
    const id = artwork.animations[0]!.id;
    expect(runDocument('Random start', [{ name: COMMAND_NAME.tileAnimation, targets: null, options: { tileset: tilesetNow().id, key: 2, change: { kind: 'set', animation: id, start: 'random' } } }])).not.toBeNull();
    const next = artworkNow();
    const plan = tilePlan(next, mapNow());
    expect(plan.cells[0]?.playback.start).toBe('random');
    const sample = (): string[] => {
      const fresh = { ...image, data: Uint8ClampedArray.from(image.data) };
      trackPixels(fresh.data);
      createAnimator(plan, fresh, table).advance(0);
      return DEAD.map((cell) => Array.from(fresh.data.subarray((cell.y * 2 * fresh.width + cell.x * 2) * CHANNELS, (cell.y * 2 * fresh.width + cell.x * 2 + 1) * CHANNELS)).join());
    };
    expect(sample()).toEqual(sample());
    expect(tilemap.id).toBe(mapNow().id);
  });
});
