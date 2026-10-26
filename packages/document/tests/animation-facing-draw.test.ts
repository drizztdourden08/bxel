/* @layer core @kind test */
import { composeAnimationFrame } from '@bxel/document';
import type { AnimSpanTag } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { animationNamed, apply, buildAnimWorld, checkOneUndoStep, createdAnimation, refuse } from './anim-engine';
import { step } from './tile-engine';

const MIRRORED = ['nw', 'w', 'sw'];

const eightWays = () => {
  const world = buildAnimWorld();
  const id = createdAnimation(world.engine, [step('animation.create', { name: 'walk', source: { kind: 'blank', width: 4, height: 4 } }, 'anim')]);
  apply(world.engine, [
    step('animation.directions', { animation: id, mode: 'eight', tag: 'walk', mirrored: MIRRORED }),
    step('animation.frame.own', { animation: id, frame: { by: 'index', index: 2 } }),
  ]);
  const east = animationNamed(world.engine, 'walk').frames[2];
  apply(world.engine, [
    {
      name: 'pixels.patch',
      targets: { sprites: [east?.spriteId as never], layers: { by: 'all' }, frames: { by: 'all' } },
      options: { rect: { x: 0, y: 1, width: 2, height: 1 }, pixels: Uint8Array.from([5, 6]) },
    },
  ]);
  return { world, id };
};

describe('animation.facing.draw', () => {
  it('turns a mirrored facing into frames of its own that look the same', () => {
    const { world, id } = eightWays();
    const before = animationNamed(world.engine, 'walk');
    const mirror = before.tags.find((tag) => tag.kind === 'mirror' && tag.facing === 'w');
    const base = before.frames[2];
    const flipped = composeAnimationFrame(world.engine.state().artwork, before, base?.id as never, 'x');
    expect(flipped.some((value) => value !== 0)).toBe(true);
    apply(world.engine, [step('animation.facing.draw', { animation: id, facing: 'w' })]);
    const after = animationNamed(world.engine, 'walk');
    const drawn = after.tags.find((tag): tag is AnimSpanTag => tag.kind === 'span' && tag.facing === 'w');
    expect(drawn?.id).toBe(mirror?.id);
    expect(after.tags.filter((tag) => tag.kind === 'mirror').map((tag) => tag.facing)).toEqual(['nw', 'sw']);
    expect(after.frames).toHaveLength(before.frames.length + 1);
    const made = after.frames[after.frames.length - 1];
    expect([drawn?.from, drawn?.to]).toEqual([made?.id, made?.id]);
    expect(composeAnimationFrame(world.engine.state().artwork, after, made?.id as never)).toEqual(flipped);
    expect(world.engine.state().artwork.sprites.find((sprite) => sprite.id === made?.spriteId)?.role).toBe('frame');
  });

  it('refuses a facing that is drawn already and is one undo step', () => {
    const { world, id } = eightWays();
    expect(refuse(world.engine, [step('animation.facing.draw', { animation: id, facing: 'e' })]).code).toBe('INVALID_OPTION');
    checkOneUndoStep(world.engine, () => {
      apply(world.engine, [step('animation.facing.draw', { animation: id, facing: 'nw' })]);
    });
  });
});
