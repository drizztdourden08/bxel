/* @layer core @kind test */
import type { CommandStep } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { apply, buildAnimWorld, checkOneUndoStep, createdAnimation } from './anim-engine';
import type { AnimWorld } from './anim-engine';
import { step } from './tile-engine';

const at = (index: number) => ({ by: 'index', index }) as const;

const populated = (): AnimWorld & { readonly id: string } => {
  const world = buildAnimWorld();
  const id = createdAnimation(world.engine, [
    step('animation.create', { name: 'spin', source: { kind: 'strip', sprite: world.strip, grid: { columns: 4, rows: 1 } } }, 'anim'),
  ]);
  apply(world.engine, [
    step('animation.update', { animation: id, directions: 'four' }),
    step('animation.tag.add', { animation: id, kind: 'span', name: 'run', from: at(0), to: at(1), facing: 'e' }),
    step('animation.frame.add', { animation: id, source: { kind: 'sprite', sprite: world.b, mode: 'copy' } }),
  ]);
  return { ...world, id };
};

const commands = (world: AnimWorld & { readonly id: string }): Record<string, CommandStep> => {
  const { id } = world;
  return {
    'animation.create': step('animation.create', { name: 'idle', source: { kind: 'sprites', sprites: [world.a, world.b], mode: 'copy' } }),
    'animation.update': step('animation.update', { animation: id, name: 'twirl', width: 8, loopDirection: 'pingpong' }),
    'animation.delete': step('animation.delete', { animation: id }),
    'animation.duplicate': step('animation.duplicate', { animation: id }),
    'animation.frame.add': step('animation.frame.add', { animation: id, source: { kind: 'strip', sprite: world.strip, grid: { columns: 4, rows: 1 }, count: 2 } }),
    'animation.frame.update': step('animation.frame.update', { animation: id, frame: at(1), durationMs: 300, offset: { x: 1, y: 1 } }),
    'animation.frame.delete': step('animation.frame.delete', { animation: id, frames: [at(0), at(4)] }),
    'animation.frame.reorder': step('animation.frame.reorder', { animation: id, frame: at(3), to: 0 }),
    'animation.frame.own': step('animation.frame.own', { animation: id, frame: at(2) }),
    'animation.frame.release': step('animation.frame.release', { animation: id, frame: at(4) }),
    'animation.tag.add': step('animation.tag.add', { animation: id, kind: 'span', name: 'idle', from: at(2), to: at(3), facing: 's' }),
    'animation.tag.update': step('animation.tag.update', { animation: id, tag: { by: 'name', name: 'run' }, repeat: 2, to: at(2) }),
    'animation.tag.delete': step('animation.tag.delete', { animation: id, tag: { by: 'name', name: 'run' } }),
    'animation.directions': step('animation.directions', { animation: id, mode: 'four', tag: 'turn', mirrored: ['w'] }),
    'animation.split': step('animation.split', { animation: id }),
    'sprite.delete': step('sprite.delete', { detachAnimations: true }),
  };
};

describe('animation commands are one undo step each', () => {
  const names = Object.keys(commands(populated()));

  it.each(names)('%s undoes and redoes as one step', (name) => {
    const world = populated();
    const chosen = commands(world)[name] ?? step('none', {});
    const request = name === 'sprite.delete' ? { ...chosen, targets: { sprites: [world.strip], layers: { by: 'all' }, frames: { by: 'all' } } } : chosen;
    checkOneUndoStep(world.engine, () => {
      apply(world.engine, [request as CommandStep]);
    });
  });

  it('keeps one undo step for a transaction of several animation steps', () => {
    const world = populated();
    checkOneUndoStep(world.engine, () => {
      apply(world.engine, [
        step('animation.frame.add', { animation: world.id, source: { kind: 'empty', count: 2 } }),
        step('animation.tag.add', { animation: world.id, kind: 'span', name: 'tail', from: at(5), to: at(6) }),
        step('animation.frame.own', { animation: world.id, frame: at(5) }),
      ]);
    });
    expect(world.engine.state().artwork.animations).toHaveLength(1);
  });
});
