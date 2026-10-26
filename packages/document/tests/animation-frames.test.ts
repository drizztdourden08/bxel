/* @layer core @kind test */
import { composeAnimationFrame } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { animationNamed, apply, buildAnimWorld, createdAnimation, refuse } from './anim-engine';
import type { AnimWorld } from './anim-engine';
import { step } from './tile-engine';

const FRAME_ADD = 'animation.frame.add';

const started = (): AnimWorld & { readonly id: string } => {
  const world = buildAnimWorld();
  const id = createdAnimation(world.engine, [
    step('animation.create', { name: 'spin', source: { kind: 'sprite', sprite: world.a } }, 'anim'),
  ]);
  return { ...world, id };
};

const addStrip = (world: ReturnType<typeof started>) =>
  step(FRAME_ADD, { animation: world.id, source: { kind: 'strip', sprite: world.strip, grid: { columns: 4, rows: 1 } } });

describe('animation.frame.add', () => {
  it('adds four strip frames with clips', () => {
    const world = started();
    const done = apply(world.engine, [addStrip(world)]);
    const spin = animationNamed(world.engine, 'spin');
    expect(spin.frames).toHaveLength(5);
    expect(spin.frames.slice(1).map((frame) => frame.clip)).toEqual([0, 4, 8, 12].map((x) => ({ x, y: 0, width: 4, height: 4 })));
    expect(spin.frames.slice(1).every((frame) => frame.spriteId === world.strip)).toBe(true);
    expect(done.report['frames']).toBe(4);
  });

  it('inserts at a position, with a duration and an offset', () => {
    const world = started();
    apply(world.engine, [
      step(FRAME_ADD, { animation: world.id, at: 0, source: { kind: 'sprite', sprite: world.b }, durationMs: 200, offset: { x: 1, y: 2 } }),
    ]);
    const first = animationNamed(world.engine, 'spin').frames[0];
    expect([first?.spriteId, first?.durationMs, first?.offset]).toEqual([world.b, 200, { x: 1, y: 2 }]);
  });

  it('copies a sprite as a frame the animation owns, and duplicates an owned frame', () => {
    const world = started();
    apply(world.engine, [step(FRAME_ADD, { animation: world.id, source: { kind: 'sprite', sprite: world.b, mode: 'copy' } })]);
    apply(world.engine, [step(FRAME_ADD, { animation: world.id, source: { kind: 'duplicate', frame: { by: 'index', index: 1 } } })]);
    const spin = animationNamed(world.engine, 'spin');
    const [, one, two] = spin.frames;
    expect(one?.spriteId).not.toBe(two?.spriteId);
    const owned = world.engine.state().artwork.sprites.filter((sprite) => sprite.role === 'frame');
    expect(owned.map((sprite) => sprite.id)).toEqual([one?.spriteId, two?.spriteId]);
  });

  it('refuses another palette, a clip outside the sprite and a position past the end', () => {
    const world = started();
    const sprite = { kind: 'sprite', sprite: world.other };
    expect(refuse(world.engine, [step(FRAME_ADD, { animation: world.id, source: sprite })]).code).toBe('PALETTE_MISMATCH');
    const clip = { x: 2, y: 2, width: 4, height: 4 };
    expect(refuse(world.engine, [step(FRAME_ADD, { animation: world.id, source: { kind: 'sprite', sprite: world.b, clip } })]).code).toBe('OUT_OF_BOUNDS');
    expect(refuse(world.engine, [step(FRAME_ADD, { animation: world.id, at: 9, source: { kind: 'empty' } })]).code).toBe('INDEX_OUT_OF_RANGE');
  });
});

describe('animation.frame.update, delete and reorder', () => {
  it('retargets a frame, clears its clip and drops the sprite it no longer uses', () => {
    const world = started();
    apply(world.engine, [step(FRAME_ADD, { animation: world.id, source: { kind: 'sprite', sprite: world.b, mode: 'copy' } })]);
    const frame = { by: 'index', index: 1 };
    const done = apply(world.engine, [step('animation.frame.update', { animation: world.id, frame, sprite: world.c, pivot: { x2: 2, y2: 2 } })]);
    const updated = animationNamed(world.engine, 'spin').frames[1];
    expect([updated?.spriteId, updated?.clip, updated?.pivot]).toEqual([world.c, null, { x2: 2, y2: 2 }]);
    expect(done.report['sprites']).toBe(1);
    expect(world.engine.state().artwork.sprites.some((sprite) => sprite.role === 'frame')).toBe(false);
  });

  it('empties a frame and refuses a mismatch', () => {
    const world = started();
    const frame = { by: 'index', index: 0 };
    apply(world.engine, [step('animation.frame.update', { animation: world.id, frame, sprite: null })]);
    expect(animationNamed(world.engine, 'spin').frames[0]?.spriteId).toBeNull();
    const error = refuse(world.engine, [step('animation.frame.update', { animation: world.id, frame, sprite: world.other })]);
    expect(error.code).toBe('PALETTE_MISMATCH');
  });

  it('deletes frames, shrinks tags and keeps the last frame', () => {
    const world = started();
    apply(world.engine, [addStrip(world)]);
    apply(world.engine, [
      step('animation.tag.add', { animation: world.id, kind: 'span', name: 'all', from: { by: 'index', index: 0 }, to: { by: 'index', index: 4 } }),
      step('animation.tag.add', { animation: world.id, kind: 'span', name: 'tail', from: { by: 'index', index: 3 }, to: { by: 'index', index: 4 } }),
    ]);
    apply(world.engine, [
      step('animation.frame.delete', { animation: world.id, frames: [{ by: 'index', index: 0 }, { by: 'index', index: 3 }, { by: 'index', index: 4 }] }),
    ]);
    const spin = animationNamed(world.engine, 'spin');
    expect(spin.frames).toHaveLength(2);
    expect(spin.tags.map((tag) => tag.kind === 'span' && tag.name)).toEqual(['all']);
    const [all] = spin.tags;
    expect(all?.kind === 'span' && [all.from, all.to]).toEqual(spin.frames.map((frame) => frame.id));
    const everything = [0, 1].map((index) => ({ by: 'index', index }));
    expect(refuse(world.engine, [step('animation.frame.delete', { animation: world.id, frames: everything })]).code).toBe('LAST_FRAME');
  });

  it('reorders a frame and keeps spans in order', () => {
    const world = started();
    apply(world.engine, [addStrip(world)]);
    apply(world.engine, [step('animation.tag.add', { animation: world.id, kind: 'span', name: 'run', from: { by: 'index', index: 1 }, to: { by: 'index', index: 2 } })]);
    const ids = animationNamed(world.engine, 'spin').frames.map((frame) => frame.id);
    apply(world.engine, [step('animation.frame.reorder', { animation: world.id, frame: { by: 'index', index: 2 }, to: 0 })]);
    const spin = animationNamed(world.engine, 'spin');
    expect(spin.frames.map((frame) => frame.id)).toEqual([ids[2], ids[0], ids[1], ids[3], ids[4]]);
    const [run] = spin.tags;
    expect(run?.kind === 'span' && [run.from, run.to]).toEqual([ids[2], ids[1]]);
  });
});

describe('animation.frame.own, release and animation.split', () => {
  it('owns a shared frame, then releases it as a project sprite', () => {
    const world = started();
    const frame = { by: 'index', index: 0 };
    apply(world.engine, [step('animation.frame.own', { animation: world.id, frame })]);
    const owned = animationNamed(world.engine, 'spin').frames[0]?.spriteId;
    const sprites = () => world.engine.state().artwork.sprites;
    expect(sprites().find((sprite) => sprite.id === owned)?.role).toBe('frame');
    expect(sprites().find((sprite) => sprite.id === world.a)?.role).toBe('sprite');
    apply(world.engine, [step('animation.frame.release', { animation: world.id, frame })]);
    expect(sprites().find((sprite) => sprite.id === owned)?.role).toBe('sprite');
    expect(refuse(world.engine, [step('animation.frame.release', { animation: world.id, frame })]).code).toBe('INVALID_OPTION');
  });

  it('owns an empty frame as a blank sprite of the canvas size', () => {
    const world = buildAnimWorld();
    const id = createdAnimation(world.engine, [step('animation.create', { name: 'blank', source: { kind: 'blank', width: 6, height: 5 } }, 'anim')]);
    apply(world.engine, [step('animation.frame.own', { animation: id, frame: { by: 'index', index: 0 } })]);
    const sprite = world.engine.state().artwork.sprites.find((item) => item.role === 'frame');
    expect([sprite?.width, sprite?.height]).toEqual([6, 5]);
  });

  it('splits a strip by reference into sprites that compose the same frames', () => {
    const world = started();
    apply(world.engine, [addStrip(world)]);
    const compose = () => {
      const artwork = world.engine.state().artwork;
      const spin = animationNamed(world.engine, 'spin');
      return spin.frames.map((frame) => Array.from(composeAnimationFrame(artwork, spin, frame.id)).join(','));
    };
    const before = compose();
    const done = apply(world.engine, [step('animation.split', { animation: world.id })]);
    expect(compose()).toEqual(before);
    expect(done.report['sprites']).toBe(4);
    const spin = animationNamed(world.engine, 'spin');
    expect(spin.frames.slice(1).every((frame) => frame.clip === null && frame.spriteId !== world.strip)).toBe(true);
    expect(world.engine.state().artwork.sprites.filter((sprite) => sprite.name.startsWith('spin part'))).toHaveLength(4);
  });
});
