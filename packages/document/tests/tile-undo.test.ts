/* @layer core @kind test */
import type { CommandStep } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { canonicalArtwork } from './canonical-artwork';
import { applySteps, buildWorld, onGround, step } from './tile-engine';

type World = ReturnType<typeof buildWorld>;

const populated = (): World => {
  const world = buildWorld();
  const cells = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 1 }];
  applySteps(world.engine, [step('map.paint', onGround(world, { tile: 2, flags: { flipX: true }, cells }))]);
  applySteps(world.engine, [step('map.layer.add', { tilemap: world.map, name: 'Top' })]);
  return world;
};

const top = { by: 'name', name: 'Top' };

const commands = (world: World): Record<string, CommandStep> => ({
  'tileset.create': step('tileset.create', { name: 'walls', tileWidth: 4, tileHeight: 4 }),
  'tileset.update': step('tileset.update', { tileset: world.tileset, name: 'terrain' }),
  'tile.add': step('tile.add', { tileset: world.tileset }),
  'tile.delete': step('tile.delete', { tileset: world.tileset, key: 2, replacement: 1 }),
  'tile.unique': step('tile.unique', onGround(world, { cells: [{ x: 0, y: 0 }, { x: 1, y: 0 }] })),
  'tilemap.create': step('tilemap.create', { name: 'second', tileset: world.tileset, columns: 3, rows: 3 }),
  'tilemap.update': step('tilemap.update', { tilemap: world.map, name: 'overworld' }),
  'tilemap.resize': step('tilemap.resize', { tilemap: world.map, columns: 6, rows: 5, offset: { x: 1, y: 1 } }),
  'map.layer.add': step('map.layer.add', { tilemap: world.map }),
  'map.layer.update': step('map.layer.update', { tilemap: world.map, layer: top, name: 'Sky', locked: true }),
  'map.layer.reorder': step('map.layer.reorder', { tilemap: world.map, layer: top, to: 0 }),
  'map.layer.delete': step('map.layer.delete', { tilemap: world.map, layer: top }),
  'map.paint': step('map.paint', onGround(world, { tile: 1, points: [{ x: 0, y: 2 }, { x: 3, y: 2 }] })),
  'map.erase': step('map.erase', onGround(world, { cells: [{ x: 0, y: 0 }] })),
  'map.fill': step('map.fill', onGround(world, { at: { x: 3, y: 0 }, tile: 1 })),
  'map.rect': step('map.rect', onGround(world, { tile: 1, rect: { x: 1, y: 1, width: 2, height: 2 } })),
  'map.replace': step('map.replace', onGround(world, { from: 2, to: 1 })),
});

describe('tile and map commands are one undo step each', () => {
  const names = Object.keys(commands(populated()));

  it.each(names)('%s undoes and redoes as one step', (name) => {
    const world = populated();
    const { engine } = world;
    const before = canonicalArtwork(engine.state().artwork);
    const revision = engine.state().revision;
    applySteps(engine, [commands(world)[name] ?? step('none', {})]);
    expect(engine.state().revision).toBe(revision + 1);
    const after = canonicalArtwork(engine.state().artwork);
    expect(after).not.toBe(before);
    const request = { documentId: engine.documentId, expectedRevision: engine.state().revision };
    expect(engine.undo(request).ok).toBe(true);
    expect(canonicalArtwork(engine.state().artwork)).toBe(before);
    expect(engine.redo({ ...request, expectedRevision: engine.state().revision }).ok).toBe(true);
    expect(canonicalArtwork(engine.state().artwork)).toBe(after);
  });

  it('deletes a map and then its tileset as two undo steps', () => {
    const world = populated();
    const { engine } = world;
    const start = canonicalArtwork(engine.state().artwork);
    applySteps(engine, [step('tilemap.delete', { tilemap: world.map })]);
    const middle = canonicalArtwork(engine.state().artwork);
    applySteps(engine, [step('tileset.delete', { tileset: world.tileset })]);
    const undo = () => engine.undo({ documentId: engine.documentId, expectedRevision: engine.state().revision });
    expect(undo().ok).toBe(true);
    expect(canonicalArtwork(engine.state().artwork)).toBe(middle);
    expect(undo().ok).toBe(true);
    expect(canonicalArtwork(engine.state().artwork)).toBe(start);
  });
});
