/* @layer core @kind test */
import type { AnimMirrorTag, AnimSpanTag, AnimTag } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { animationNamed, apply, buildAnimWorld, createdAnimation, refuse } from './anim-engine';
import type { AnimWorld } from './anim-engine';
import { step } from './tile-engine';

const TAG_ADD = 'animation.tag.add';
const at = (index: number) => ({ by: 'index', index }) as const;

const walking = (): AnimWorld & { readonly id: string } => {
  const world = buildAnimWorld();
  const id = createdAnimation(world.engine, [
    step('animation.create', { name: 'walk', source: { kind: 'blank', width: 4, height: 4, frames: 4 } }, 'anim'),
  ]);
  return { ...world, id };
};

const span = (id: string, name: string, [from, to]: readonly [number, number], facing?: string) =>
  step(TAG_ADD, { animation: id, kind: 'span', name, from: at(from), to: at(to), ...(facing ? { facing } : {}) });

const spans = (tags: readonly AnimTag[]): AnimSpanTag[] => tags.filter((tag): tag is AnimSpanTag => tag.kind === 'span');
const mirrors = (tags: readonly AnimTag[]): AnimMirrorTag[] => tags.filter((tag): tag is AnimMirrorTag => tag.kind === 'mirror');

describe('animation.tag.add', () => {
  it('adds span tags with a facing and a mirror tag', () => {
    const world = walking();
    apply(world.engine, [step('animation.update', { animation: world.id, directions: 'eight' })]);
    apply(world.engine, [span(world.id, 'walk', [0, 1], 'e'), span(world.id, 'walk', [2, 3], 'n')]);
    apply(world.engine, [step(TAG_ADD, { animation: world.id, kind: 'mirror', of: { by: 'name', name: 'walk', facing: 'e' }, facing: 'w' })]);
    const walk = animationNamed(world.engine, 'walk');
    const [east, north] = spans(walk.tags);
    expect([east?.facing, east?.direction, east?.repeat]).toEqual(['e', 'forward', 0]);
    expect(north?.facing).toBe('n');
    expect(mirrors(walk.tags).map((tag) => [tag.of, tag.flip, tag.facing])).toEqual([[east?.id, 'x', 'w']]);
  });

  it('refuses a facing outside the direction set and a repeated name with the same facing', () => {
    const world = walking();
    expect(refuse(world.engine, [span(world.id, 'walk', [0, 1], 'e')]).code).toBe('REFERENCE_BROKEN');
    apply(world.engine, [step('animation.update', { animation: world.id, directions: 'four' })]);
    expect(refuse(world.engine, [span(world.id, 'walk', [0, 1], 'ne')]).code).toBe('REFERENCE_BROKEN');
    apply(world.engine, [span(world.id, 'walk', [0, 1], 'e')]);
    expect(refuse(world.engine, [span(world.id, 'Walk', [2, 3], 'e')]).code).toBe('NAME_TAKEN');
    apply(world.engine, [span(world.id, 'walk', [2, 3], 's')]);
  });

  it('refuses a span that runs backwards and a mirror of a mirror', () => {
    const world = walking();
    expect(refuse(world.engine, [span(world.id, 'back', [2, 1])]).code).toBe('INVALID_OPTION');
    apply(world.engine, [step('animation.update', { animation: world.id, directions: 'four' })]);
    apply(world.engine, [span(world.id, 'walk', [0, 1], 'e')]);
    apply(world.engine, [step(TAG_ADD, { animation: world.id, kind: 'mirror', of: { by: 'name', name: 'walk' }, facing: 'w' }, 'mirror')]);
    const mirror = mirrors(animationNamed(world.engine, 'walk').tags)[0];
    const again = step(TAG_ADD, { animation: world.id, kind: 'mirror', of: { by: 'id', id: mirror?.id }, facing: 's' });
    expect(refuse(world.engine, [again]).code).toBe('INVALID_OPTION');
  });
});

describe('animation.tag.update and delete', () => {
  it('updates a span tag and a mirror tag', () => {
    const world = walking();
    apply(world.engine, [step('animation.update', { animation: world.id, directions: 'four' })]);
    apply(world.engine, [span(world.id, 'walk', [0, 1], 'e')]);
    apply(world.engine, [step(TAG_ADD, { animation: world.id, kind: 'mirror', of: { by: 'name', name: 'walk' }, facing: 'w' })]);
    const tag = { by: 'name', name: 'walk', facing: 'e' };
    apply(world.engine, [step('animation.tag.update', { animation: world.id, tag, name: 'run', direction: 'pingpong', repeat: 3, colour: '#FF0000', to: at(2) })]);
    const [run] = spans(animationNamed(world.engine, 'walk').tags);
    expect([run?.name, run?.direction, run?.repeat, run?.colour]).toEqual(['run', 'pingpong', 3, '#ff0000']);
    const mirror = mirrors(animationNamed(world.engine, 'walk').tags)[0];
    apply(world.engine, [step('animation.tag.update', { animation: world.id, tag: { by: 'id', id: mirror?.id }, flip: 'y', facing: 'n' })]);
    expect(mirrors(animationNamed(world.engine, 'walk').tags)[0]).toMatchObject({ flip: 'y', facing: 'n' });
    const wrong = step('animation.tag.update', { animation: world.id, tag: { by: 'id', id: mirror?.id }, name: 'oops' });
    expect(refuse(world.engine, [wrong]).code).toBe('INVALID_OPTION');
  });

  it('deletes a span tag together with its mirrors', () => {
    const world = walking();
    apply(world.engine, [step('animation.update', { animation: world.id, directions: 'four' })]);
    apply(world.engine, [span(world.id, 'walk', [0, 1], 'e'), span(world.id, 'idle', [2, 3])]);
    apply(world.engine, [step(TAG_ADD, { animation: world.id, kind: 'mirror', of: { by: 'name', name: 'walk' }, facing: 'w' })]);
    apply(world.engine, [step('animation.tag.delete', { animation: world.id, tag: { by: 'name', name: 'walk' } })]);
    expect(animationNamed(world.engine, 'walk').tags.map((tag) => tag.kind === 'span' && tag.name)).toEqual(['idle']);
  });
});

describe('animation.directions', () => {
  it('scaffolds an eight direction set with three mirrored facings', () => {
    const world = buildAnimWorld();
    const id = createdAnimation(world.engine, [
      step('animation.create', { name: 'walk', source: { kind: 'blank', width: 4, height: 4 } }, 'anim'),
    ]);
    const done = apply(world.engine, [
      step('animation.directions', { animation: id, mode: 'eight', framesPerFacing: 2, mirrored: ['w', 'nw', 'sw'] }),
    ]);
    const walk = animationNamed(world.engine, 'walk');
    expect(walk.directions).toBe('eight');
    expect(walk.frames).toHaveLength(10);
    expect(done.report).toMatchObject({ frames: 10, tags: 8 });
    expect(spans(walk.tags).map((tag) => tag.facing)).toEqual(['n', 'ne', 'e', 'se', 's']);
    expect(mirrors(walk.tags).map((tag) => tag.facing)).toEqual(['w', 'nw', 'sw']);
    const east = spans(walk.tags).find((tag) => tag.facing === 'e');
    expect(mirrors(walk.tags).find((tag) => tag.facing === 'w')?.of).toBe(east?.id);
  });

  it('refuses a mirror that has no partner and keeps existing frames', () => {
    const world = walking();
    const bad = step('animation.directions', { animation: world.id, mode: 'four', mirrored: ['n'] });
    expect(refuse(world.engine, [bad]).code).toBe('INVALID_OPTION');
    apply(world.engine, [step('animation.frame.update', { animation: world.id, frame: at(0), durationMs: 50 })]);
    apply(world.engine, [step('animation.directions', { animation: world.id, mode: 'four' })]);
    expect(animationNamed(world.engine, 'walk').frames).toHaveLength(8);
  });
});
