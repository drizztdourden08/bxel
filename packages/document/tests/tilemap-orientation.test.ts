/* @layer core @kind test */
import { flattenTilemap } from '@bxel/document';
import { decodeArtwork, encodeArtwork } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { fixedClock, heartPreview } from './native-fixture';
import { applySteps, buildWorld, checkOneUndoStep, failure, mapOf, onGround, step } from './tile-engine';

type World = ReturnType<typeof buildWorld>;

const orient = (world: World, orientation: unknown) => step('tilemap.orient', { tilemap: world.map, orientation });

describe('tilemap.orient', () => {
  it('sets an orientation, fills the Tiled defaults and goes back to orthogonal', () => {
    const world = buildWorld();
    applySteps(world.engine, [orient(world, { kind: 'staggered', staggerIndex: 'even' })]);
    expect(mapOf(world.engine).orientation).toEqual({ kind: 'staggered', staggerAxis: 'y', staggerIndex: 'even', hexSideLength: 0 });
    applySteps(world.engine, [orient(world, { kind: 'orthogonal' })]);
    expect('orientation' in mapOf(world.engine)).toBe(false);
  });

  it('is one undo step', () => {
    const world = buildWorld();
    checkOneUndoStep(world.engine, () => applySteps(world.engine, [orient(world, { kind: 'isometric' })]));
  });

  it('refuses odd tile sizes and a hexagon side that does not fit, and changes nothing', () => {
    const world = buildWorld();
    applySteps(world.engine, [
      step('tileset.create', { name: 'odd', tileWidth: 5, tileHeight: 4 }, 'odd'),
      step('tilemap.create', { name: 'oddmap', tileset: { ref: 'odd' }, columns: 2, rows: 2 }),
    ]);
    const revision = world.engine.state().revision;
    const oddMap = world.engine.state().artwork.tilemaps.find((map) => map.name === 'oddmap');
    expect(failure(world.engine, [step('tilemap.orient', { tilemap: oddMap?.id, orientation: { kind: 'isometric' } })]).code).toBe('INVALID_OPTION');
    expect(failure(world.engine, [orient(world, { kind: 'hexagonal', hexSideLength: 2 })]).code).toBe('INVALID_OPTION');
    expect(world.engine.state().revision).toBe(revision);
  });

  it('can be given when a map is created', () => {
    const world = buildWorld();
    applySteps(world.engine, [
      step('tilemap.create', { name: 'iso', tileset: world.tileset, columns: 3, rows: 3, orientation: { kind: 'isometric' } }),
    ]);
    expect(world.engine.state().artwork.tilemaps.find((map) => map.name === 'iso')?.orientation?.kind).toBe('isometric');
  });
});

describe('drawing and saving oriented maps', () => {
  it('lays the tiles of an isometric map on the diamond grid when it is flattened', () => {
    const world = buildWorld();
    applySteps(world.engine, [orient(world, { kind: 'isometric' })]);
    applySteps(world.engine, [step('map.paint', onGround(world, { tile: 1, cells: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }))]);
    const flat = flattenTilemap(world.engine.state().artwork, world.map);
    expect([flat.width, flat.height]).toEqual([7, 7]);
    const painted = Array.from(flat.pixels).filter((index) => index !== 0).length;
    expect(painted).toBe(7);
    expect(flat.pixels[2]).toBe(1);
    expect(flat.pixels[2 * 7 + 4]).toBe(1);
  });

  it('keeps the orientation through save and reopen', () => {
    const world = buildWorld();
    applySteps(world.engine, [
      step('tileset.create', { name: 'big', tileWidth: 4, tileHeight: 4 }, 'big'),
      step('tile.add', { tileset: { ref: 'big' } }),
      step('tilemap.create', { name: 'hex', tileset: { ref: 'big' }, columns: 2, rows: 2, orientation: { kind: 'hexagonal', hexSideLength: 2 } }),
    ]);
    const report = decodeArtwork(encodeArtwork(world.engine.state(), heartPreview, fixedClock));
    expect(report.outcome).toBe('ok');
    const hex = report.artwork?.tilemaps.find((map) => map.name === 'hex');
    expect(hex?.orientation).toEqual({ kind: 'hexagonal', staggerAxis: 'y', staggerIndex: 'odd', hexSideLength: 2 });
    expect(report.artwork).toEqual(world.engine.state().artwork);
  });
});
