/* @layer core @kind test */
import { pickMapCell } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { canonicalArtwork } from './canonical-artwork';
import { applySteps, buildWorld, cellsOf, failure, layerOf, mapOf, onGround, run, step } from './tile-engine';

const FLIP_X = 0x80000000;
const FLIP_Y = 0x40000000;
const DIAGONAL = 0x20000000;

const undo = (engine: ReturnType<typeof buildWorld>['engine']) =>
  engine.undo({ documentId: engine.documentId, expectedRevision: engine.state().revision });

const grid = (engine: ReturnType<typeof buildWorld>['engine']): string[] => {
  const cells = cellsOf(engine);
  return [0, 1, 2].map((row) => cells.slice(row * 4, row * 4 + 4).join(','));
};

describe('map.paint', () => {
  it('places a key with flip flags on exact cells', () => {
    const world = buildWorld();
    const { engine } = world;
    const flags = { flipX: true, flipY: true, diagonal: true };
    applySteps(engine, [step('map.paint', onGround(world, { tile: 2, flags, cells: [{ x: 1, y: 1 }, { x: 3, y: 2 }] }))]);
    const value = ((FLIP_X | FLIP_Y | DIAGONAL | 2) >>> 0);
    expect(cellsOf(engine)[5]).toBe(value);
    expect(cellsOf(engine)[11]).toBe(value);
    expect(cellsOf(engine).filter((cell) => cell !== 0)).toHaveLength(2);
  });

  it('fills the cells between stroke points and clips what leaves the map', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 1, points: [{ x: -2, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 5 }] }))]);
    expect(grid(engine)).toEqual(['1,1,1,0', '0,0,1,0', '0,0,1,0']);
  });

  it('is one undo step per command', () => {
    const world = buildWorld();
    const { engine } = world;
    const before = canonicalArtwork(engine.state().artwork);
    applySteps(engine, [step('map.paint', onGround(world, { tile: 1, points: [{ x: 0, y: 0 }, { x: 3, y: 0 }] }))]);
    expect(undo(engine).ok).toBe(true);
    expect(canonicalArtwork(engine.state().artwork)).toBe(before);
  });

  it('previews exactly what a commit then does', () => {
    const world = buildWorld();
    const { engine } = world;
    const steps = [step('map.paint', onGround(world, { tile: 2, flags: { flipX: true }, points: [{ x: 0, y: 0 }, { x: 2, y: 2 }] }))];
    const preview = run(engine, steps, 'preview');
    expect(preview.ok && preview.noop).toBe(false);
    expect(preview.ok && preview.changes.tilemaps).toEqual([{ id: world.map, kind: 'updated' }]);
    expect(cellsOf(engine).every((cell) => cell === 0)).toBe(true);
    const before = engine.state().revision;
    const done = run(engine, steps);
    expect(done.ok && done.changes).toEqual(preview.ok ? preview.changes : null);
    expect(engine.state().revision).toBe(before + 1);
    expect(cellsOf(engine).filter((cell) => cell !== 0)).toHaveLength(3);
  });

});

describe('map.paint guards', () => {
  it('refuses a tile key the tileset lacks and a diagonal flip on a non square tileset', () => {
    const world = buildWorld();
    const { engine } = world;
    expect(failure(engine, [step('map.paint', onGround(world, { tile: 7, cells: [{ x: 0, y: 0 }] }))]).code).toBe('TARGET_NOT_FOUND');
    applySteps(engine, [
      step('tileset.create', { name: 'wide', tileWidth: 4, tileHeight: 2 }, 'wide'),
      step('tile.add', { tileset: { ref: 'wide' } }),
      step('tilemap.create', { name: 'wide map', tileset: { ref: 'wide' }, columns: 2, rows: 2 }, 'wideMap'),
    ]);
    const wideMap = engine.state().artwork.tilemaps[1];
    const options = { tilemap: wideMap?.id, layer: { by: 'name', name: 'Layer 1' }, tile: 1, flags: { diagonal: true }, cells: [{ x: 0, y: 0 }] };
    expect(failure(engine, [step('map.paint', options)]).code).toBe('INVALID_OPTION');
  });

  it('refuses a locked or hidden layer and cells outside the map', () => {
    const world = buildWorld();
    const { engine, map } = world;
    const paint = onGround(world, { tile: 1, cells: [{ x: 0, y: 0 }] });
    expect(failure(engine, [step('map.paint', onGround(world, { tile: 1, cells: [{ x: 4, y: 0 }] }))]).code).toBe('OUT_OF_BOUNDS');
    const layer = { by: 'name', name: 'Ground' };
    applySteps(engine, [step('map.layer.update', { tilemap: map, layer, locked: true })]);
    expect(failure(engine, [step('map.paint', paint)]).code).toBe('LAYER_LOCKED');
    applySteps(engine, [step('map.layer.update', { tilemap: map, layer, locked: false, visible: false })]);
    expect(failure(engine, [step('map.paint', paint)]).code).toBe('LAYER_HIDDEN');
  });

  it('needs points or cells but not both', () => {
    const world = buildWorld();
    const both = onGround(world, { tile: 1, cells: [{ x: 0, y: 0 }], points: [{ x: 0, y: 0 }] });
    expect(failure(world.engine, [step('map.paint', both)]).code).toBe('INVALID_OPTION');
    expect(failure(world.engine, [step('map.paint', onGround(world, { tile: 1 }))]).code).toBe('INVALID_OPTION');
  });

  it('paints a tile created earlier in the same transaction by ref', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [
      step('tile.add', { tileset: world.tileset }, 'fresh'),
      step('map.paint', onGround(world, { tile: { ref: 'fresh' }, cells: [{ x: 2, y: 1 }] })),
    ]);
    expect(cellsOf(engine)[6]).toBe(3);
  });
});

describe('map.erase and map.fill', () => {
  it('erases cells and leaves the rest', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.rect', onGround(world, { tile: 1, rect: { x: 0, y: 0, width: 4, height: 3 } }))]);
    applySteps(engine, [step('map.erase', onGround(world, { points: [{ x: 0, y: 1 }, { x: 3, y: 1 }] }))]);
    expect(grid(engine)).toEqual(['1,1,1,1', '0,0,0,0', '1,1,1,1']);
  });

  it('fills a contiguous region of one key with 4 neighbours', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 1, cells: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }] }))]);
    applySteps(engine, [step('map.fill', onGround(world, { at: { x: 0, y: 0 }, tile: 2 }))]);
    expect(grid(engine)).toEqual(['2,1,0,0', '2,1,0,0', '1,1,0,0']);
  });

  it('does not leak a fill across a diagonal gap', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 1, cells: [{ x: 1, y: 0 }, { x: 0, y: 1 }] }))]);
    applySteps(engine, [step('map.fill', onGround(world, { at: { x: 0, y: 0 }, tile: 2 }))]);
    expect(grid(engine)).toEqual(['2,1,0,0', '1,0,0,0', '0,0,0,0']);
  });

  it('fills a region with flags and treats flipped cells of the same key as one region', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 1, flags: { flipX: true }, cells: [{ x: 0, y: 0 }] }))]);
    applySteps(engine, [step('map.paint', onGround(world, { tile: 1, cells: [{ x: 1, y: 0 }] }))]);
    applySteps(engine, [step('map.fill', onGround(world, { at: { x: 0, y: 0 }, tile: 2, flags: { flipY: true } }))]);
    expect(cellsOf(engine).slice(0, 2)).toEqual([0x40000002, 0x40000002]);
  });

});

describe('map.rect and map.replace', () => {
  it('draws filled and outline rectangles and clips them to the map', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.rect', onGround(world, { tile: 1, filled: false, rect: { x: 0, y: 0, width: 4, height: 3 } }))]);
    expect(grid(engine)).toEqual(['1,1,1,1', '1,0,0,1', '1,1,1,1']);
    applySteps(engine, [step('map.rect', onGround(world, { tile: 2, rect: { x: 2, y: 1, width: 9, height: 9 } }))]);
    expect(grid(engine)).toEqual(['1,1,1,1', '1,0,2,2', '1,1,2,2']);
    expect(applySteps(engine, [step('map.rect', onGround(world, { tile: 2, rect: { x: 8, y: 8, width: 2, height: 2 } }))]).noop).toBe(true);
  });

  it('replaces one key with another and keeps the flags', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 1, flags: { flipX: true }, cells: [{ x: 0, y: 0 }] }))]);
    applySteps(engine, [step('map.paint', onGround(world, { tile: 1, cells: [{ x: 1, y: 0 }, { x: 2, y: 0 }] }))]);
    applySteps(engine, [step('map.replace', onGround(world, { from: 1, to: 2 }))]);
    expect(cellsOf(engine).slice(0, 4)).toEqual([(FLIP_X | 2) >>> 0, 2, 2, 0]);
  });

  it('limits a replace to a rectangle and can clear with 0 or fill the empty cells', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 1, cells: [{ x: 0, y: 0 }, { x: 3, y: 0 }] }))]);
    applySteps(engine, [step('map.replace', onGround(world, { from: 1, to: 0, rect: { x: 0, y: 0, width: 2, height: 3 } }))]);
    expect(cellsOf(engine).slice(0, 4)).toEqual([0, 0, 0, 1]);
    applySteps(engine, [step('map.replace', onGround(world, { from: 0, to: 2 }))]);
    expect(cellsOf(engine).filter((cell) => cell === 2)).toHaveLength(11);
    expect(failure(engine, [step('map.replace', onGround(world, { from: 1, to: 9 }))]).code).toBe('TARGET_NOT_FOUND');
  });

  it('reports a no-op when nothing changes', () => {
    const world = buildWorld();
    const result = applySteps(world.engine, [step('map.replace', onGround(world, { from: 1, to: 2 }))]);
    expect(result.noop).toBe(true);
  });
});

describe('map.pick', () => {
  it('reads the key, flags and tile of a cell', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 2, flags: { flipY: true }, cells: [{ x: 2, y: 1 }] }))]);
    const query = { tilemapId: world.map, layerId: layerOf(engine).id, at: { x: 2, y: 1 } };
    const picked = pickMapCell(engine.state().artwork, query);
    expect(picked?.key).toBe(2);
    expect(picked?.flags).toEqual({ flipX: false, flipY: true, diagonal: false });
    expect(picked?.tile?.key).toBe(2);
    expect(pickMapCell(engine.state().artwork, { ...query, at: { x: 0, y: 0 } })?.tile).toBeNull();
    expect(pickMapCell(engine.state().artwork, { ...query, at: { x: 9, y: 0 } })).toBeNull();
    expect(mapOf(engine).columns).toBe(4);
  });
});
