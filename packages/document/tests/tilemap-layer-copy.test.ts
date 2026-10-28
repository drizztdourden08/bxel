/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { canonicalArtwork } from './canonical-artwork';
import { applySteps, buildWorld, cellsOf, failure, layerOf, mapOf, onGround, step } from './tile-engine';

const undo = (engine: ReturnType<typeof buildWorld>['engine']) =>
  engine.undo({ documentId: engine.documentId, expectedRevision: engine.state().revision });

const ground = { by: 'name', name: 'Ground' } as const;
const top = { by: 'name', name: 'Top' } as const;

describe('map.layer.update colour tags', () => {
  it('sets and clears a colour tag', () => {
    const { engine, map } = buildWorld();
    applySteps(engine, [step('map.layer.update', { tilemap: map, layer: ground, colour: '#E8B84A' })]);
    expect(layerOf(engine).colour).toBe('#e8b84a');
    applySteps(engine, [step('map.layer.update', { tilemap: map, layer: ground, colour: null })]);
    expect(Object.keys(layerOf(engine))).not.toContain('colour');
  });
});

describe('map.layer.duplicate', () => {
  it('copies the cells and the tag above the source, unlocked, in one undo step', () => {
    const world = buildWorld();
    const { engine, map } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 1, cells: [{ x: 1, y: 1 }, { x: 2, y: 0 }] }))]);
    applySteps(engine, [step('map.layer.update', { tilemap: map, layer: ground, colour: '#4cc5b8', locked: true })]);
    const before = canonicalArtwork(engine.state().artwork);
    const done = applySteps(engine, [step('map.layer.duplicate', { tilemap: map, layer: ground }, 'copy')]);
    expect(mapOf(engine).layers.map((layer) => layer.name)).toEqual(['Ground', 'Ground copy']);
    const copy = layerOf(engine, 'Ground copy');
    expect(done.created['copy']).toBe(copy.id);
    expect(Array.from(copy.cells)).toEqual(cellsOf(engine));
    expect(copy).toMatchObject({ colour: '#4cc5b8', locked: false, visible: true });
    expect(copy.cells).not.toBe(layerOf(engine).cells);
    expect(undo(engine).ok).toBe(true);
    expect(canonicalArtwork(engine.state().artwork)).toBe(before);
  });
});

describe('map.layer.merge', () => {
  it('joins a layer into the one below, where the top layer wins a set cell', () => {
    const world = buildWorld();
    const { engine, map } = world;
    applySteps(engine, [step('map.paint', onGround(world, { tile: 1, cells: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }))]);
    applySteps(engine, [step('map.layer.add', { tilemap: map, name: 'Top' })]);
    applySteps(engine, [step('map.paint', { tilemap: map, layer: top, tile: 2, cells: [{ x: 1, y: 0 }, { x: 3, y: 2 }] })]);
    applySteps(engine, [step('map.layer.merge', { tilemap: map, layer: top })]);
    expect(mapOf(engine).layers.map((layer) => layer.name)).toEqual(['Ground']);
    const cells = cellsOf(engine);
    expect(cells[0]).toBe(1);
    expect(cells[1]).toBe(2);
    expect(cells[11]).toBe(2);
    expect(undo(engine).ok).toBe(true);
    expect(mapOf(engine).layers).toHaveLength(2);
  });

  it('refuses the bottom layer and a locked layer unless asked', () => {
    const { engine, map } = buildWorld();
    expect(failure(engine, [step('map.layer.merge', { tilemap: map, layer: ground })]).code).toBe('NO_LAYER_BELOW');
    applySteps(engine, [step('map.layer.add', { tilemap: map, name: 'Top' })]);
    applySteps(engine, [step('map.layer.update', { tilemap: map, layer: top, locked: true })]);
    expect(failure(engine, [step('map.layer.merge', { tilemap: map, layer: top })]).code).toBe('LAYER_LOCKED');
    applySteps(engine, [step('map.layer.merge', { tilemap: map, layer: top, allowLocked: true })]);
    expect(mapOf(engine).layers).toHaveLength(1);
  });
});
