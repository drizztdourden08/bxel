/* @layer core @kind test */
import { cellMaskSchema, resolveCellMask } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { applySteps, buildWorld, cellsOf, checkOneUndoStep, failure, onGround, step } from './tile-engine';

type World = ReturnType<typeof buildWorld>;

const FLIP_X = 0x80000000;

const seed = (world: World): void => {
  applySteps(world.engine, [
    step('map.write', onGround(world, { rect: { x: 0, y: 0, width: 4, height: 2 }, keys: [1, 1, 2, 0, 1, 2, 2, 0], flags: [1, 0, 0, 0, 0, 0, 0, 0] })),
  ]);
};

const view = (world: World) => ({ columns: 4, rows: 3, cells: Uint32Array.from(cellsOf(world.engine)) });

const count = (mask: Uint8Array): number => mask.reduce((total, bit) => total + bit, 0);

describe('K1 cell mask descriptors', { tags: ['critical'] }, () => {
  it('resolves a rect, a list and the tile and same descriptors', () => {
    const world = buildWorld();
    seed(world);
    const parse = (value: unknown) => cellMaskSchema.parse(value);
    expect(count(resolveCellMask(parse({ by: 'rect', rect: { x: 1, y: 0, width: 2, height: 2 } }), view(world)))).toBe(4);
    expect(count(resolveCellMask(parse({ by: 'cells', cells: [{ x: 0, y: 0 }, { x: 3, y: 2 }, { x: 9, y: 9 }] }), view(world)))).toBe(2);
    expect(count(resolveCellMask(parse({ by: 'tile', key: 2 }), view(world)))).toBe(3);
    expect(count(resolveCellMask(parse({ by: 'same', x: 0, y: 0 }), view(world)))).toBe(3);
  });

  it('wand follows equal cells and stops at a different turn', () => {
    const world = buildWorld();
    seed(world);
    const wand = (x: number, y: number) => resolveCellMask(cellMaskSchema.parse({ by: 'wand', x, y }), view(world));
    expect(Array.from(wand(1, 0)).slice(0, 8)).toEqual([0, 1, 0, 0, 0, 0, 0, 0]);
    expect(count(wand(0, 0))).toBe(1);
    expect(count(wand(3, 0))).toBe(6);
  });

  it('combines parts with add, subtract and intersect', () => {
    const world = buildWorld();
    seed(world);
    const rect = (x: number) => ({ by: 'rect', rect: { x, y: 0, width: 2, height: 1 } });
    const of = [rect(0), rect(1)];
    const resolve = (op: string) => count(resolveCellMask(cellMaskSchema.parse({ by: 'combine', op, of }), view(world)));
    expect(resolve('add')).toBe(3);
    expect(resolve('subtract')).toBe(1);
    expect(resolve('intersect')).toBe(1);
  });
});

describe('K1 map.copy', { tags: ['critical'] }, () => {
  it('copies a 3 x 2 block with its keys and turn bits and leaves the source', () => {
    const world = buildWorld();
    seed(world);
    applySteps(world.engine, [step('map.copy', onGround(world, { from: { by: 'rect', rect: { x: 0, y: 0, width: 3, height: 2 } }, to: { x: 1, y: 1 } }))]);
    const cells = cellsOf(world.engine);
    expect(cells.slice(0, 8)).toEqual([(FLIP_X | 1) >>> 0, 1, 2, 0, 1, (FLIP_X | 1) >>> 0, 1, 2]);
    expect(cells.slice(8)).toEqual([0, 1, 2, 2]);
  });

  it('skips empty cells by default and clears with empty copy', () => {
    const world = buildWorld();
    seed(world);
    const from = { by: 'rect', rect: { x: 2, y: 0, width: 2, height: 1 } };
    applySteps(world.engine, [step('map.copy', onGround(world, { from, to: { x: 0, y: 1 } }))]);
    expect(cellsOf(world.engine).slice(4, 6)).toEqual([2, 2]);
    applySteps(world.engine, [step('map.copy', onGround(world, { from, to: { x: 1, y: 1 }, empty: 'copy' }))]);
    expect(cellsOf(world.engine).slice(4, 8)).toEqual([2, 2, 0, 0]);
  });

  it('copies into another layer of the same map', () => {
    const world = buildWorld();
    seed(world);
    applySteps(world.engine, [step('map.layer.add', { tilemap: world.map, name: 'Top' })]);
    applySteps(world.engine, [step('map.copy', onGround(world, { from: { by: 'tile', key: 2 }, to: { x: 0, y: 1 }, intoLayer: { by: 'name', name: 'Top' } }))]);
    expect(cellsOf(world.engine, 'Top').filter((cell) => cell === 2)).toHaveLength(3);
    expect(cellsOf(world.engine).filter((cell) => cell === 2)).toHaveLength(3);
  });

  it('refuses cells that would leave the map, an empty selection and a locked layer', () => {
    const world = buildWorld();
    seed(world);
    const copy = (options: Record<string, unknown>) => step('map.copy', onGround(world, { from: { by: 'rect', rect: { x: 0, y: 0, width: 2, height: 1 } }, to: { x: 0, y: 0 }, ...options }));
    expect(failure(world.engine, [copy({ to: { x: 3, y: 0 } })]).code).toBe('OUT_OF_BOUNDS');
    expect(failure(world.engine, [copy({ from: { by: 'tile', key: 9 }, to: { x: 0, y: 0 } })]).code).toBe('INVALID_OPTION');
    applySteps(world.engine, [step('map.layer.update', { tilemap: world.map, layer: { by: 'name', name: 'Ground' }, locked: true })]);
    expect(failure(world.engine, [copy({})]).code).toBe('LAYER_LOCKED');
  });
});

describe('K1 map.move', { tags: ['critical'] }, () => {
  it('moves the described cells and clears where they were, in one undo step', () => {
    const world = buildWorld();
    seed(world);
    checkOneUndoStep(world.engine, () => {
      applySteps(world.engine, [step('map.move', onGround(world, { from: { by: 'tile', key: 2 }, to: { x: 0, y: 1 } }))]);
    });
    const cells = cellsOf(world.engine);
    expect(cells.slice(0, 4)).toEqual([(FLIP_X | 1) >>> 0, 1, 0, 0]);
  });

  it('moves a block over itself without losing cells', () => {
    const world = buildWorld();
    seed(world);
    applySteps(world.engine, [step('map.move', onGround(world, { from: { by: 'rect', rect: { x: 0, y: 0, width: 3, height: 2 } }, to: { x: 1, y: 1 } }))]);
    const cells = cellsOf(world.engine);
    expect(cells.slice(0, 4)).toEqual([0, 0, 0, 0]);
    expect(cells.slice(4, 8)).toEqual([0, (FLIP_X | 1) >>> 0, 1, 2]);
    expect(cells.slice(8)).toEqual([0, 1, 2, 2]);
  });
});
