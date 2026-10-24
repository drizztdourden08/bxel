/* @layer core @kind test */
import type {
  CommandStep,
  Engine,
  MapLayer,
  SpriteId,
  Tilemap,
  TilemapId,
  TilesetId,
  TransactionOk,
  TransactionResult,
  Tileset,
} from '@bxel/document';
import { expect } from 'vitest';
import { canonicalArtwork } from './canonical-artwork';
import { heartEngine, request } from './heart-engine';

type World = {
  readonly engine: Engine;
  readonly tileset: TilesetId;
  readonly map: TilemapId;
  readonly grass: number;
  readonly rock: number;
};

const step = (name: string, options: unknown, ref?: string): CommandStep => ({
  name,
  targets: null,
  options,
  ...(ref === undefined ? {} : { ref }),
});

const spriteStep = (name: string, options: unknown, sprite: string | SpriteId): CommandStep => ({
  name,
  targets: {
    sprites: [typeof sprite === 'string' && sprite.startsWith('spr_') ? (sprite as SpriteId) : { ref: sprite }],
    layers: { by: 'all' },
    frames: { by: 'all' },
  },
  options,
});

const run = (engine: Engine, steps: readonly CommandStep[], mode: 'commit' | 'preview' = 'commit'): TransactionResult =>
  engine.execute(request(steps, { baseRevision: engine.state().revision, mode, previewPixels: 64 }));

const applySteps = (engine: Engine, steps: readonly CommandStep[]): TransactionOk => {
  const result = run(engine, steps);
  if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`);
  return result;
};

const failure = (engine: Engine, steps: readonly CommandStep[]) => {
  const result = run(engine, steps);
  if (result.ok) throw new Error('the request was accepted');
  return result.error;
};

const patch = (width: number, pixels: readonly number[]) => ({
  rect: { x: 0, y: 0, width, height: pixels.length / width },
  pixels: Uint8Array.from(pixels),
});

const buildWorld = (): World => {
  const engine = heartEngine().engine;
  const done = applySteps(engine, [
    step('tileset.create', { name: 'ground', tileWidth: 2, tileHeight: 2 }, 'ts'),
    step('tile.add', { tileset: { ref: 'ts' }, name: 'grass tile' }, 'grass'),
    step('tile.add', { tileset: { ref: 'ts' }, name: 'rock tile' }, 'rock'),
    spriteStep('pixels.patch', patch(2, [1, 1, 1, 1]), 'grass'),
    spriteStep('pixels.patch', patch(2, [2, 3, 4, 5]), 'rock'),
    step('tilemap.create', { name: 'level', tileset: { ref: 'ts' }, columns: 4, rows: 3, layerName: 'Ground' }, 'map'),
  ]);
  return {
    engine,
    tileset: done.created['ts'] as TilesetId,
    map: done.created['map'] as TilemapId,
    grass: 1,
    rock: 2,
  };
};

const tilesetOf = (engine: Engine): Tileset => {
  const found = engine.state().artwork.tilesets[0];
  if (!found) throw new Error('no tileset');
  return found;
};

const mapOf = (engine: Engine): Tilemap => {
  const found = engine.state().artwork.tilemaps[0];
  if (!found) throw new Error('no tilemap');
  return found;
};

const layerOf = (engine: Engine, name = 'Ground'): MapLayer => {
  const found = mapOf(engine).layers.find((layer) => layer.name === name);
  if (!found) throw new Error(`no map layer ${name}`);
  return found;
};

const cellsOf = (engine: Engine, name = 'Ground'): number[] => Array.from(layerOf(engine, name).cells);

const onGround = (world: World, options: Record<string, unknown>) => ({
  tilemap: world.map,
  layer: { by: 'name', name: 'Ground' },
  ...options,
});

const checkOneUndoStep = (engine: Engine, edit: () => void): void => {
  const before = canonicalArtwork(engine.state().artwork);
  const revision = engine.state().revision;
  edit();
  expect(engine.state().revision).toBe(revision + 1);
  const after = canonicalArtwork(engine.state().artwork);
  const ask = () => ({ documentId: engine.documentId, expectedRevision: engine.state().revision });
  expect(engine.undo(ask()).ok).toBe(true);
  expect(canonicalArtwork(engine.state().artwork)).toBe(before);
  expect(engine.redo(ask()).ok).toBe(true);
  expect(canonicalArtwork(engine.state().artwork)).toBe(after);
};

export { applySteps, checkOneUndoStep, buildWorld, cellsOf, failure, layerOf, mapOf, onGround, patch, run, spriteStep, step, tilesetOf };
