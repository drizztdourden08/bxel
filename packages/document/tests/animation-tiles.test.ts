/* @layer core @kind test */
import type { TagId, Tile } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { animationNamed, apply, buildAnimWorld, checkOneUndoStep, createdAnimation, refuse } from './anim-engine';
import type { AnimWorld } from './anim-engine';
import { step } from './tile-engine';

const at = (index: number) => ({ by: 'index', index }) as const;

const SET = 'tile.animation';

const water = (): AnimWorld & { readonly id: string; readonly tileset: string; readonly flow: TagId } => {
  const world = buildAnimWorld();
  const id = createdAnimation(world.engine, [
    step('animation.create', { name: 'water', source: { kind: 'blank', width: 4, height: 4, frames: 3 } }, 'anim'),
  ]);
  apply(world.engine, [step('animation.tag.add', { animation: id, kind: 'span', name: 'flow', from: at(0), to: at(1) })]);
  const done = apply(world.engine, [
    step('tileset.create', { name: 'ground', tileWidth: 4, tileHeight: 4 }, 'ts'),
    step('tile.add', { tileset: { ref: 'ts' }, name: 'sea' }),
  ]);
  const flow = animationNamed(world.engine, 'water').tags[0]?.id as TagId;
  return { ...world, id, tileset: done.created['ts'] ?? '', flow };
};

const tileOf = (world: ReturnType<typeof water>): Tile => {
  const found = world.engine.state().artwork.tilesets[0]?.tiles[0];
  if (!found) throw new Error('no tile');
  return found;
};

describe('tile.animation', () => {
  it('sets and clears the animation a tile plays', () => {
    const world = water();
    apply(world.engine, [step(SET, { tileset: world.tileset, key: 1, change: { kind: 'set', animation: world.id, tag: world.flow, start: 'random' } })]);
    expect(tileOf(world).animation).toEqual({ animationId: world.id, tagId: world.flow, start: 'random' });
    apply(world.engine, [step(SET, { tileset: world.tileset, key: 1, change: { kind: 'clear' } })]);
    expect('animation' in tileOf(world)).toBe(false);
  });

  it('defaults to the whole animation, started together', () => {
    const world = water();
    apply(world.engine, [step(SET, { tileset: world.tileset, key: 1, change: { kind: 'set', animation: world.id } })]);
    expect(tileOf(world).animation).toEqual({ animationId: world.id, tagId: null, start: 'together' });
  });

  it('refuses another size, another palette and a tag that is not a span tag of the animation', () => {
    const world = water();
    const big = createdAnimation(world.engine, [step('animation.create', { name: 'big', source: { kind: 'blank', width: 8, height: 8 } }, 'anim')]);
    const set = (animation: string, extra: Record<string, unknown> = {}) =>
      step(SET, { tileset: world.tileset, key: 1, change: { kind: 'set', animation, ...extra } });
    expect(refuse(world.engine, [set(big)]).code).toBe('INVALID_OPTION');
    const other = createdAnimation(world.engine, [
      step('animation.create', { name: 'other', source: { kind: 'blank', width: 4, height: 4, bankId: world.otherBank } }, 'anim'),
    ]);
    expect(refuse(world.engine, [set(other)]).code).toBe('INVALID_OPTION');
    expect(refuse(world.engine, [set(world.id, { tag: 'tag_zzzzzz' })]).code).toBe('INVALID_OPTION');
  });

  it('keeps the link valid: the animation cannot change size under a tile', () => {
    const world = water();
    apply(world.engine, [step(SET, { tileset: world.tileset, key: 1, change: { kind: 'set', animation: world.id } })]);
    expect(refuse(world.engine, [step('animation.update', { animation: world.id, width: 5 })]).code).toBe('REFERENCE_BROKEN');
  });

  it('detaches tiles when the animation or its tag is deleted', () => {
    const world = water();
    const link = step(SET, { tileset: world.tileset, key: 1, change: { kind: 'set', animation: world.id, tag: world.flow } });
    apply(world.engine, [link]);
    apply(world.engine, [step('animation.tag.delete', { animation: world.id, tag: { by: 'id', id: world.flow } })]);
    expect(tileOf(world).animation).toEqual({ animationId: world.id, tagId: null, start: 'together' });
    const done = apply(world.engine, [step('animation.delete', { animation: world.id })]);
    expect('animation' in tileOf(world)).toBe(false);
    expect(done.warnings.map((warning) => warning.code)).toEqual(['TILES_DETACHED']);
  });

  it('keeps the animation on a duplicated tileset and through a collision edit', () => {
    const world = water();
    apply(world.engine, [step(SET, { tileset: world.tileset, key: 1, change: { kind: 'set', animation: world.id } })]);
    apply(world.engine, [step('tile.collision', { tileset: world.tileset, key: 1, shape: { kind: 'full' } })]);
    expect(tileOf(world).animation?.animationId).toBe(world.id);
    apply(world.engine, [step('tileset.duplicate', { tileset: world.tileset })]);
    expect(world.engine.state().artwork.tilesets[1]?.tiles[0]?.animation?.animationId).toBe(world.id);
  });

  it('is one undo step', () => {
    const world = water();
    checkOneUndoStep(world.engine, () => {
      apply(world.engine, [step(SET, { tileset: world.tileset, key: 1, change: { kind: 'set', animation: world.id } })]);
    });
  });
});
