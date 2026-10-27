/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { animationNamed, apply, buildAnimWorld, createdAnimation, refuse } from './anim-engine';
import { step } from './tile-engine';

const started = () => {
  const world = buildAnimWorld();
  const id = createdAnimation(world.engine, [step('animation.create', { name: 'spin', source: { kind: 'sprite', sprite: world.a } }, 'anim')]);
  return { ...world, id };
};

describe('animation.split on a frame the animation does not own', () => {
  it('changes nothing without strict, as the Split to sprites button does', () => {
    const world = started();
    const done = apply(world.engine, [step('animation.split', { animation: world.id })]);
    expect(done.report['sprites'] ?? 0).toBe(0);
    expect(animationNamed(world.engine, 'spin').frames[0]?.spriteId).toBe(world.a);
  });

  it('fails with a clear INVALID_OPTION when strict is set', () => {
    const world = started();
    const error = refuse(world.engine, [step('animation.split', { animation: world.id, frames: [{ by: 'index', index: 0 }], strict: true })]);
    expect(error).toMatchObject({ code: 'INVALID_OPTION', step: 0, path: 'options.frames' });
    expect(error.message).toContain('Nothing to split');
  });

  it('still splits an owned frame when strict is set', () => {
    const world = started();
    apply(world.engine, [step('animation.frame.own', { animation: world.id, frame: { by: 'index', index: 0 } })]);
    const done = apply(world.engine, [step('animation.split', { animation: world.id, strict: true })]);
    expect(done.report['sprites']).toBe(1);
  });
});
