/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { apply, buildAnimWorld, checkOneUndoStep, createdAnimation, refuse } from './anim-engine';
import { step } from './tile-engine';

const started = () => {
  const world = buildAnimWorld();
  const walk = createdAnimation(world.engine, [step('animation.create', { name: 'walk', source: { kind: 'strip', sprite: world.strip, grid: { columns: 4, rows: 1 } } }, 'anim')]);
  const run = createdAnimation(world.engine, [step('animation.create', { name: 'run', source: { kind: 'strip', sprite: world.strip, grid: { columns: 4, rows: 1 } } }, 'anim')]);
  const made = apply(world.engine, [step('sheet.create', { name: 'sheet' }, 'sheet')]);
  const sheet = made.created['sheet'] ?? '';
  apply(world.engine, [step('sheet.animation.add', { sheet, animation: walk }), step('sheet.animation.add', { sheet, animation: run })]);
  return { world, walk, run, sheet };
};

const order = (world: ReturnType<typeof buildAnimWorld>): string[] => (world.engine.state().artwork.sheets[0]?.animationEntries ?? []).map((entry) => entry.animationId);

describe('sheet.animation.move', () => {
  it('moves an animation entry to a place and is one undo step', () => {
    const { world, walk, run, sheet } = started();
    expect(order(world)).toEqual([walk, run]);
    checkOneUndoStep(world.engine, () => {
      apply(world.engine, [step('sheet.animation.move', { sheet, animation: run, to: 0 })]);
    });
    apply(world.engine, [step('sheet.animation.move', { sheet, animation: run, to: 0 })]);
    expect(order(world)).toEqual([run, walk]);
  });

  it('clamps a place past the end and refuses an animation that is not on the sheet', () => {
    const { world, walk, run, sheet } = started();
    apply(world.engine, [step('sheet.animation.move', { sheet, animation: walk, to: 99 })]);
    expect(order(world)).toEqual([run, walk]);
    apply(world.engine, [step('sheet.animation.remove', { sheet, animation: walk })]);
    expect(refuse(world.engine, [step('sheet.animation.move', { sheet, animation: walk, to: 0 })]).code).toBe('TARGET_NOT_FOUND');
  });
});

describe('sheet.animation.place', () => {
  it('puts an animation entry at a point, goes by hand and is one undo step', () => {
    const { world, walk, sheet } = started();
    checkOneUndoStep(world.engine, () => {
      apply(world.engine, [step('sheet.animation.place', { sheet, animation: walk, at: { x: 5, y: 7 } })]);
    });
    apply(world.engine, [step('sheet.animation.place', { sheet, animation: walk, at: { x: 5, y: 7 } })]);
    const placed = world.engine.state().artwork.sheets[0];
    expect(placed?.layout.kind).toBe('manual');
    expect(placed?.animationEntries?.find((entry) => entry.animationId === walk)?.at).toEqual({ x: 5, y: 7 });
  });

  it('refuses an animation that is not on the sheet', () => {
    const { world, walk, sheet } = started();
    apply(world.engine, [step('sheet.animation.remove', { sheet, animation: walk })]);
    expect(refuse(world.engine, [step('sheet.animation.place', { sheet, animation: walk, at: { x: 0, y: 0 } })]).code).toBe('TARGET_NOT_FOUND');
  });
});
