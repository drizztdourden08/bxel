/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { canonicalArtwork } from './canonical-artwork';
import { animationNamed, apply, buildAnimWorld, checkOneUndoStep, refuse } from './anim-engine';
import { step } from './tile-engine';

const create = (name: string, source: unknown, anchor?: unknown) =>
  step('animation.create', { name, source, ...(anchor === undefined ? {} : { anchor }) }, 'anim');

describe('animation.create', () => {
  it('builds an animation from three sprites that stay project sprites', () => {
    const { engine, a, b, c } = buildAnimWorld();
    apply(engine, [create('walk', { kind: 'sprites', sprites: [a, b, c], durationMs: 80 })]);
    const walk = animationNamed(engine, 'walk');
    expect(walk.frames.map((frame) => frame.spriteId)).toEqual([a, b, c]);
    expect(walk.frames.map((frame) => frame.durationMs)).toEqual([80, 80, 80]);
    expect([walk.width, walk.height]).toEqual([4, 4]);
    expect(walk.anchor).toEqual({ x2: 4, y2: 4 });
    expect(walk.tags).toEqual([]);
    expect(walk.directions).toBe('none');
    const roles = engine.state().artwork.sprites.map((sprite) => sprite.role);
    expect(new Set(roles)).toEqual(new Set(['sprite']));
  });

  it('copies the sprites into frame sprites the animation owns', () => {
    const { engine, a, b } = buildAnimWorld();
    apply(engine, [create('walk', { kind: 'sprites', sprites: [a, b], mode: 'copy' })]);
    const walk = animationNamed(engine, 'walk');
    const owned = engine.state().artwork.sprites.filter((sprite) => sprite.role === 'frame');
    expect(owned).toHaveLength(2);
    expect(walk.frames.map((frame) => frame.spriteId)).toEqual(owned.map((sprite) => sprite.id));
    expect(owned.map((sprite) => sprite.name)).toEqual(['walk frame', 'walk frame 2']);
  });

  it('starts blank with empty frames', () => {
    const { engine } = buildAnimWorld();
    apply(engine, [create('idle', { kind: 'blank', width: 8, height: 6, frames: 3 })]);
    const idle = animationNamed(engine, 'idle');
    expect(idle.frames).toHaveLength(3);
    expect(idle.frames.every((frame) => frame.spriteId === null && frame.clip === null)).toBe(true);
    expect([idle.width, idle.height, idle.anchor]).toEqual([8, 6, { x2: 8, y2: 6 }]);
  });

  it('makes one frame from a single sprite', () => {
    const { engine, a } = buildAnimWorld();
    apply(engine, [create('still', { kind: 'sprite', sprite: a }, { x2: 2, y2: 8 })]);
    const still = animationNamed(engine, 'still');
    expect(still.frames).toHaveLength(1);
    expect(still.anchor).toEqual({ x2: 2, y2: 8 });
  });

});

describe('animation.create from a strip, and its refusals', () => {
  it('cuts a strip into clipped frames of one sprite', () => {
    const { engine, strip } = buildAnimWorld();
    apply(engine, [create('spin', { kind: 'strip', sprite: strip, grid: { columns: 4, rows: 1 } })]);
    const spin = animationNamed(engine, 'spin');
    expect(spin.frames.map((frame) => frame.clip)).toEqual([0, 4, 8, 12].map((x) => ({ x, y: 0, width: 4, height: 4 })));
    expect(spin.frames.every((frame) => frame.spriteId === strip)).toBe(true);
    expect([spin.width, spin.height]).toEqual([4, 4]);
  });

  it('refuses a sprite from another palette', () => {
    const { engine, a, other } = buildAnimWorld();
    const error = refuse(engine, [create('mixed', { kind: 'sprites', sprites: [a, other] })]);
    expect(error.code).toBe('PALETTE_MISMATCH');
    expect(engine.state().artwork.animations).toHaveLength(0);
  });

  it('refuses a name that is taken and a strip that does not divide', () => {
    const { engine, a, strip } = buildAnimWorld();
    apply(engine, [create('walk', { kind: 'sprite', sprite: a })]);
    expect(refuse(engine, [create('Walk', { kind: 'sprite', sprite: a })]).code).toBe('NAME_TAKEN');
    expect(refuse(engine, [create('bad', { kind: 'strip', sprite: strip, grid: { columns: 3, rows: 1 } })]).code).toBe('INVALID_OPTION');
  });

  it('undoes and redoes in one step', () => {
    const { engine, a, b, c } = buildAnimWorld();
    const before = canonicalArtwork(engine.state().artwork);
    checkOneUndoStep(engine, () => {
      apply(engine, [create('walk', { kind: 'sprites', sprites: [a, b, c], mode: 'copy' })]);
    });
    expect(canonicalArtwork(engine.state().artwork)).not.toBe(before);
  });
});
