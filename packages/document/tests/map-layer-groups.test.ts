/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { applySteps, buildWorld, failure, layerOf, mapOf, step, undoLast } from './tile-engine';

const named = (name: string) => ({ by: 'name', name }) as const;

const withTop = () => {
  const world = buildWorld();
  applySteps(world.engine, [step('map.layer.add', { tilemap: world.map, name: 'Top' })]);
  return world;
};

describe('K1 map layer groups and opacity', { tags: ['critical'] }, () => {
  it('groups and ungroups map layers in one undo step each', () => {
    const { engine, map } = withTop();
    applySteps(engine, [step('map.layer.group', { tilemap: map, layers: [named('Ground'), named('Top')], name: 'Level' })]);
    const level = layerOf(engine, 'Level');
    expect(level.kind).toBe('group');
    expect(mapOf(engine).layers.map((layer) => layer.name)).toEqual(['Ground', 'Top', 'Level']);
    expect(layerOf(engine, 'Top').parentId).toBe(level.id);
    expect(undoLast(engine).ok).toBe(true);
    expect(mapOf(engine).layers.map((layer) => layer.name)).toEqual(['Ground', 'Top']);
    applySteps(engine, [step('map.layer.group', { tilemap: map, layers: [named('Top')], name: 'Level' })]);
    applySteps(engine, [step('map.layer.ungroup', { tilemap: map, layer: named('Level') })]);
    expect(layerOf(engine, 'Top').parentId).toBeUndefined();
  });

  it('refuses to paint a group or a layer of a hidden group, and keeps one tile layer', () => {
    const { engine, map } = withTop();
    applySteps(engine, [step('map.layer.group', { tilemap: map, layers: [named('Top')], name: 'Level' })]);
    const paint = (layer: string) => step('map.paint', { tilemap: map, layer: named(layer), tile: 2, cells: [{ x: 0, y: 0 }] });
    expect(failure(engine, [paint('Level')]).code).toBe('LAYER_KIND');
    applySteps(engine, [step('map.layer.update', { tilemap: map, layer: named('Level'), visible: false })]);
    expect(failure(engine, [paint('Top')]).code).toBe('LAYER_HIDDEN');
    applySteps(engine, [step('map.layer.delete', { tilemap: map, layer: named('Ground') })]);
    expect(failure(engine, [step('map.layer.delete', { tilemap: map, layer: named('Level') })]).code).toBe('LAST_LAYER');
  });

  it('stores an opacity below 100 and drops it at 100', () => {
    const { engine, map } = withTop();
    applySteps(engine, [step('map.layer.update', { tilemap: map, layer: named('Top'), opacity: 40 })]);
    expect(layerOf(engine, 'Top').opacity).toBe(40);
    applySteps(engine, [step('map.layer.update', { tilemap: map, layer: named('Top'), opacity: 100 })]);
    expect(Object.keys(layerOf(engine, 'Top'))).not.toContain('opacity');
  });
});
