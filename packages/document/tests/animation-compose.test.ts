/* @layer core @kind test */
import { animationSequence, animationUsers, composeAnimationFrame, frameAt } from '@bxel/document';
import type { AnimFlip, TagId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { animationNamed, apply, buildAnimWorld, createdAnimation } from './anim-engine';
import type { AnimWorld } from './anim-engine';
import { step } from './tile-engine';

const rowsOf = (pixels: Uint8Array, width: number): number[][] =>
  Array.from({ length: pixels.length / width }, (_, row) => Array.from(pixels.subarray(row * width, (row + 1) * width)));

const sixBySix = (): AnimWorld & { readonly id: string } => {
  const world = buildAnimWorld();
  const id = createdAnimation(world.engine, [
    step('animation.create', { name: 'g', source: { kind: 'blank', width: 6, height: 6 } }, 'anim'),
  ]);
  return { ...world, id };
};

const composed = (world: AnimWorld & { readonly id: string }, edit: Record<string, unknown>, flip: AnimFlip | null = null): number[][] => {
  apply(world.engine, [
    step('animation.frame.update', { animation: world.id, frame: { by: 'index', index: 0 }, sprite: world.a, clip: null, pivot: null, offset: { x: 0, y: 0 }, ...edit }),
  ]);
  const { artwork } = world.engine.state();
  const animation = animationNamed(world.engine, 'g');
  const frame = animation.frames[0];
  return rowsOf(composeAnimationFrame(artwork, animation, frame?.id as never, flip), 6);
};

const Z = [0, 0, 0, 0, 0, 0];

describe('composeAnimationFrame golden indices', () => {
  it('places a frame by anchor, sprite pivot and offset', () => {
    const rows = composed(sixBySix(), { offset: { x: 1, y: 0 } });
    expect(rows).toEqual([Z, [0, 0, 1, 2, 3, 4], [0, 0, 5, 6, 7, 8], [0, 0, 9, 10, 11, 12], [0, 0, 13, 14, 15, 0], Z]);
  });

  it('centres a clip on the anchor', () => {
    const rows = composed(sixBySix(), { clip: { x: 1, y: 1, width: 2, height: 2 } });
    expect(rows).toEqual([Z, Z, [0, 0, 6, 7, 0, 0], [0, 0, 10, 11, 0, 0], Z, Z]);
  });

  it('moves the pivot to the top left and cuts at the canvas edge', () => {
    const rows = composed(sixBySix(), { pivot: { x2: 0, y2: 0 } });
    expect(rows).toEqual([Z, Z, Z, [0, 0, 0, 1, 2, 3], [0, 0, 0, 5, 6, 7], [0, 0, 0, 9, 10, 11]]);
  });

  it('moves a frame past the top left corner with a far pivot and a negative offset', () => {
    const rows = composed(sixBySix(), { pivot: { x2: 8, y2: 8 }, offset: { x: -1, y: -1 } });
    expect(rows).toEqual([[11, 12, 0, 0, 0, 0], [15, 0, 0, 0, 0, 0], Z, Z, Z, Z]);
  });

  it('mirrors about the anchor', () => {
    const edit = { offset: { x: 1, y: 0 } };
    expect(composed(sixBySix(), edit, 'x')).toEqual([Z, [4, 3, 2, 1, 0, 0], [8, 7, 6, 5, 0, 0], [12, 11, 10, 9, 0, 0], [0, 15, 14, 13, 0, 0], Z]);
    expect(composed(sixBySix(), edit, 'y')).toEqual([Z, [0, 0, 13, 14, 15, 0], [0, 0, 9, 10, 11, 12], [0, 0, 5, 6, 7, 8], [0, 0, 1, 2, 3, 4], Z]);
  });

  it('draws nothing for an empty frame', () => {
    const world = sixBySix();
    const animation = animationNamed(world.engine, 'g');
    const pixels = composeAnimationFrame(world.engine.state().artwork, animation, animation.frames[0]?.id as never);
    expect(Array.from(pixels).every((value) => value === 0)).toBe(true);
  });
});

const timed = () => {
  const world = buildAnimWorld();
  const id = createdAnimation(world.engine, [
    step('animation.create', { name: 'seq', source: { kind: 'blank', width: 4, height: 4, frames: 4 } }, 'anim'),
  ]);
  [10, 20, 30, 40].forEach((durationMs, index) => {
    apply(world.engine, [step('animation.frame.update', { animation: id, frame: { by: 'index', index }, durationMs })]);
  });
  apply(world.engine, [step('animation.update', { animation: id, directions: 'four' })]);
  const tag = (direction: string, repeat = 0) =>
    apply(world.engine, [
      step('animation.tag.add', { animation: id, kind: 'span', name: direction, from: { by: 'index', index: 1 }, to: { by: 'index', index: 3 }, direction, repeat }),
    ]);
  return { world, id, tag };
};

const indexes = (sequence: ReturnType<typeof animationSequence>): number[] => sequence.steps.map((entry) => entry.index);

describe('animationSequence and frameAt', () => {
  it('expands every direction of a span tag', () => {
    const { world, tag } = timed();
    for (const direction of ['forward', 'reverse', 'pingpong', 'pingpongReverse']) tag(direction);
    const seq = animationNamed(world.engine, 'seq');
    const of = (name: string) => animationSequence(seq, seq.tags.find((item) => item.kind === 'span' && item.name === name)?.id);
    expect(indexes(of('forward'))).toEqual([1, 2, 3]);
    expect(indexes(of('reverse'))).toEqual([3, 2, 1]);
    expect(indexes(of('pingpong'))).toEqual([1, 2, 3, 2]);
    expect(indexes(of('pingpongReverse'))).toEqual([3, 2, 1, 2]);
    expect(of('pingpong').cycleMs).toBe(120);
    expect(indexes(animationSequence(seq))).toEqual([0, 1, 2, 3]);
  });

  it('finds the frame at a time and holds the last after the repeats', () => {
    const { world, tag } = timed();
    tag('pingpong', 2);
    const seq = animationNamed(world.engine, 'seq');
    const sequence = animationSequence(seq, seq.tags[0]?.id);
    const at = (time: number) => frameAt(sequence, time)?.index;
    expect([0, 19, 20, 50, 89, 90, 119, 120, 130].map(at)).toEqual([1, 1, 2, 3, 3, 2, 2, 1, 1]);
    expect(at(239)).toBe(2);
    expect(at(240)).toBe(2);
    expect(at(1000)).toBe(2);
  });

  it('plays a mirror tag with its flip', () => {
    const { world, id, tag } = timed();
    tag('forward');
    apply(world.engine, [step('animation.tag.add', { animation: id, kind: 'mirror', of: { by: 'name', name: 'forward' }, flip: 'y', facing: 's' })]);
    const seq = animationNamed(world.engine, 'seq');
    const mirror = seq.tags.find((item) => item.kind === 'mirror');
    const sequence = animationSequence(seq, mirror?.id);
    expect(indexes(sequence)).toEqual([1, 2, 3]);
    expect(sequence.steps.every((entry) => entry.flip === 'y')).toBe(true);
    expect(animationSequence(seq, 'tag_zzzzzz' as TagId).steps).toEqual([]);
  });
});

describe('animationUsers', () => {
  it('lists the animations that use a sprite', () => {
    const world = sixBySix();
    apply(world.engine, [step('animation.frame.update', { animation: world.id, frame: { by: 'index', index: 0 }, sprite: world.a })]);
    const users = animationUsers(world.engine.state().artwork, world.a);
    expect(users).toEqual([{ animationId: world.id, name: 'g', frames: 1 }]);
    expect(animationUsers(world.engine.state().artwork, world.b)).toEqual([]);
  });
});
