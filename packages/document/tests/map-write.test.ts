/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { applySteps, buildWorld, cellsOf, checkOneUndoStep, failure, onGround, step } from './tile-engine';

type World = ReturnType<typeof buildWorld>;

const write = (world: World, options: Record<string, unknown>) =>
  step('map.write', onGround(world, { rect: { x: 1, y: 1, width: 2, height: 2 }, keys: [1, 2, 0, 2], ...options }));

describe('map.write', () => {
  it('writes a rectangle of tile keys and flip bits row by row', () => {
    const world = buildWorld();
    applySteps(world.engine, [write(world, { flags: [0, 1, 0, 6] })]);
    const cells = cellsOf(world.engine);
    expect(cells[5]).toBe(1);
    expect(cells[6]).toBe((0x80000000 | 2) >>> 0);
    expect(cells[9]).toBe(0);
    expect(cells[10]).toBe((0x40000000 | 0x20000000 | 2) >>> 0);
    expect(cells.filter((cell) => cell !== 0)).toHaveLength(3);
  });

  it('clears cells with key 0 and is one undo step', () => {
    const world = buildWorld();
    applySteps(world.engine, [write(world, {})]);
    checkOneUndoStep(world.engine, () => applySteps(world.engine, [write(world, { keys: [0, 0, 0, 0] })]));
    expect(cellsOf(world.engine).every((cell) => cell === 0)).toBe(true);
  });

  it('refuses a rectangle off the map, a missing tile, a wrong count and a locked layer', () => {
    const world = buildWorld();
    const revision = world.engine.state().revision;
    expect(failure(world.engine, [write(world, { rect: { x: 3, y: 2, width: 2, height: 2 } })]).code).toBe('OUT_OF_BOUNDS');
    expect(failure(world.engine, [write(world, { keys: [1, 2, 9, 2] })]).code).toBe('TARGET_NOT_FOUND');
    expect(failure(world.engine, [write(world, { keys: [1, 2] })]).code).toBe('INVALID_OPTION');
    expect(failure(world.engine, [write(world, { flags: [0, 0] })]).code).toBe('INVALID_OPTION');
    applySteps(world.engine, [step('map.layer.update', { tilemap: world.map, layer: { by: 'name', name: 'Ground' }, locked: true })]);
    expect(failure(world.engine, [write(world, {})]).code).toBe('LAYER_LOCKED');
    expect(world.engine.state().revision).toBe(revision + 1);
  });
});
