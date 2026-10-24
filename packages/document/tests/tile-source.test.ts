/* @layer core @kind test */
import {
  counterIdSource,
  createEngine,
  defineCommand,
  documentCommands,
  findBrokenCells,
  flattenTilemap,
  tileUseCounts,
  updateTileset,
} from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { documentId } from './heart-engine';
import { applySteps, buildWorld, cellsOf, failure, mapOf, onGround, patch, spriteStep, step, tilesetOf } from './tile-engine';

const flat = (engine: ReturnType<typeof buildWorld>['engine']): number[][] => {
  const picture = flattenTilemap(engine.state().artwork, mapOf(engine).id);
  const rows: number[][] = [];
  for (let y = 0; y < picture.height; y += 1) rows.push(Array.from(picture.pixels.subarray(y * picture.width, (y + 1) * picture.width)));
  return rows;
};

const rockSprite = (engine: ReturnType<typeof buildWorld>['engine']) =>
  engine.state().artwork.sprites.find((sprite) => sprite.name === 'rock tile');

describe('tile source versus placement', () => {
  it('shows a tile in every placement of the flattened map', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 2, cells: [{ x: 0, y: 0 }, { x: 3, y: 2 }] }))]);
    const rows = flat(engine);
    expect(rows[0]?.slice(0, 2)).toEqual([2, 3]);
    expect(rows[1]?.slice(0, 2)).toEqual([4, 5]);
    expect(rows[4]?.slice(6, 8)).toEqual([2, 3]);
    expect(rows[5]?.slice(6, 8)).toEqual([4, 5]);
    expect(rows[0]?.slice(2, 4)).toEqual([0, 0]);
  });

  it('updates every placement when the tile pixels change', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 2, cells: [{ x: 0, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 2 }] }))]);
    const sprite = rockSprite(engine);
    applySteps(engine, [spriteStep('pixels.patch', patch(2, [6, 6, 6, 6]), sprite?.id ?? '')]);
    const rows = flat(engine);
    for (const [column, row] of [[0, 0], [2, 1], [3, 2]] as const) {
      expect(rows[row * 2]?.slice(column * 2, column * 2 + 2)).toEqual([6, 6]);
      expect(rows[row * 2 + 1]?.slice(column * 2, column * 2 + 2)).toEqual([6, 6]);
    }
    expect(cellsOf(engine).filter((cell) => cell === 2)).toHaveLength(3);
  });

  it('leaves the tile pixels alone while the map is painted, filled, replaced and resized', () => {
    const world = buildWorld();
    const { engine } = world;
    const before = rockSprite(engine);
    applySteps(engine, [step('map.paint', onGround(world, { tile: 2, flags: { flipX: true }, points: [{ x: 0, y: 0 }, { x: 3, y: 0 }] }))]);
    applySteps(engine, [step('map.fill', onGround(world, { at: { x: 0, y: 2 }, tile: 1 }))]);
    applySteps(engine, [step('map.replace', onGround(world, { from: 2, to: 1 }))]);
    applySteps(engine, [step('tilemap.resize', { tilemap: world.map, columns: 6, rows: 6 })]);
    const after = rockSprite(engine);
    expect(after).toBe(before);
    expect(Object.values(after?.cels ?? {}).map((cel) => Array.from(cel.pixels))).toEqual([[2, 3, 4, 5]]);
    expect(tilesetOf(engine).tiles).toHaveLength(2);
  });

});

describe('tile placement rendering', () => {
  it('turns and flips a placed tile the way Tiled does', () => {
    const world = buildWorld();
    const { engine } = world;
    const place = (x: number, flags: Record<string, boolean>) =>
      applySteps(engine, [step('map.paint', onGround(world, { tile: 2, flags, cells: [{ x, y: 0 }] }))]);
    place(0, {});
    place(1, { flipX: true });
    place(2, { flipY: true });
    place(3, { diagonal: true });
    const rows = flat(engine);
    expect(rows[0]).toEqual([2, 3, 3, 2, 4, 5, 2, 4]);
    expect(rows[1]).toEqual([4, 5, 5, 4, 2, 3, 3, 5]);
    place(0, { flipX: true, diagonal: true });
    expect(flat(engine)[0]?.slice(0, 2)).toEqual([4, 2]);
    expect(flat(engine)[1]?.slice(0, 2)).toEqual([5, 3]);
  });

  it('hides a hidden layer from the flattened map and stacks layers bottom to top', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.layer.add', { tilemap: world.map, name: 'Top' })]);
    applySteps(engine, [step('map.paint', onGround(world, { tile: 1, cells: [{ x: 0, y: 0 }] }))]);
    const top = { tilemap: world.map, layer: { by: 'name', name: 'Top' }, tile: 2, cells: [{ x: 0, y: 0 }] };
    applySteps(engine, [step('map.paint', top)]);
    expect(flat(engine)[0]?.slice(0, 2)).toEqual([2, 3]);
    const layer = { by: 'name', name: 'Top' };
    applySteps(engine, [step('map.layer.update', { tilemap: world.map, layer, visible: false })]);
    expect(flat(engine)[0]?.slice(0, 2)).toEqual([1, 1]);
  });

  it('counts how many cells use each tile', () => {
    const world = buildWorld();
    const { engine } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 2, cells: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }))]);
    applySteps(engine, [step('map.paint', onGround(world, { tile: 1, cells: [{ x: 2, y: 0 }] }))]);
    const counts = tileUseCounts(engine.state().artwork, world.tileset);
    expect([counts.get(1), counts.get(2)]).toEqual([1, 2]);
  });
});

describe('broken references', () => {
  const sabotage = defineCommand({
    name: 'test.sabotage',
    scope: 'none',
    schema: z.strictObject({ key: z.number() }),
    run: (draft, input) => {
      updateTileset(draft, draft.artwork.tilesets[0]?.id ?? ('' as never), (tileset) => ({
        ...tileset,
        tiles: tileset.tiles.filter((tile) => tile.key !== input.options.key),
      }));
    },
  });

  it('rejects a transaction that leaves a cell with no tile and changes nothing', () => {
    const world = buildWorld();
    applySteps(world.engine, [step('map.paint', onGround(world, { tile: 2, cells: [{ x: 0, y: 0 }] }))]);
    const state = world.engine.state();
    const engine = createEngine({ state, ids: counterIdSource(900), commands: [...documentCommands, sabotage] });
    const result = engine.execute({
      documentId,
      baseRevision: state.revision,
      mode: 'commit',
      origin: 'mcp',
      label: 'Sabotage',
      previewPixels: 0,
      steps: [{ name: 'test.sabotage', targets: null, options: { key: 2 } }],
    });
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error.code).toBe('REFERENCE_BROKEN');
    expect(engine.state().revision).toBe(state.revision);
    expect(failure(world.engine, [step('tile.delete', { tileset: world.tileset, key: 2 })]).code).toBe('TILE_IN_USE');
  });

  it('lists the cells whose key has no tile', () => {
    const world = buildWorld();
    applySteps(world.engine, [step('map.paint', onGround(world, { tile: 2, cells: [{ x: 1, y: 2 }, { x: 3, y: 0 }] }))]);
    const artwork = world.engine.state().artwork;
    expect(findBrokenCells(artwork, 10)).toEqual([]);
    const [tileset] = artwork.tilesets;
    const trimmed = { ...artwork, tilesets: tileset ? [{ ...tileset, tiles: tileset.tiles.slice(0, 1) }] : [] };
    const broken = findBrokenCells(trimmed, 10);
    expect(broken.map((cell) => [cell.x, cell.y, cell.key])).toEqual([[3, 0, 2], [1, 2, 2]]);
    expect(findBrokenCells(trimmed, 1)).toHaveLength(1);
  });
});
