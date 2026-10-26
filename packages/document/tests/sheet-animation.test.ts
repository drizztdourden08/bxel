/* @layer core @kind test */
import { animationCells, sheetExtent, sheetSizes } from '@bxel/document';
import type { Animation, Sheet } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { animationNamed, apply, buildAnimWorld, checkOneUndoStep, createdAnimation, refuse } from './anim-engine';
import type { AnimWorld } from './anim-engine';
import { step } from './tile-engine';

const started = (): AnimWorld & { readonly id: string; readonly sheet: string } => {
  const world = buildAnimWorld();
  const id = createdAnimation(world.engine, [
    step('animation.create', { name: 'walk', source: { kind: 'strip', sprite: world.strip, grid: { columns: 4, rows: 1 } } }, 'anim'),
  ]);
  const made = apply(world.engine, [step('sheet.create', { name: 'sheet' }, 'sheet')]);
  return { ...world, id, sheet: made.created['sheet'] ?? '' };
};

const sheetOf = (world: AnimWorld): Sheet => {
  const found = world.engine.state().artwork.sheets[0];
  if (!found) throw new Error('no sheet');
  return found;
};

const animationOf = (world: AnimWorld): Animation => animationNamed(world.engine, 'walk');

describe('sheet.animation.add and sheet.animation.remove', () => {
  it('places a whole animation at the corner and the next one below it', () => {
    const world = started();
    apply(world.engine, [step('sheet.animation.add', { sheet: world.sheet, animation: world.id })]);
    expect(sheetOf(world).animationEntries).toEqual([{ animationId: world.id, tagId: null, at: { x: 0, y: 0 } }]);
    apply(world.engine, [
      step('animation.directions', { animation: world.id, mode: 'four', tag: 'walk', framesPerFacing: 2, mirrored: ['w'] }),
      step('sheet.animation.add', { sheet: world.sheet, animation: world.id, tag: { by: 'name', name: 'walk', facing: 'n' } }),
    ]);
    const [, second] = sheetOf(world).animationEntries ?? [];
    expect(second?.at).toEqual({ x: 0, y: 4 });
    expect(second?.tagId).toBe(animationOf(world).tags.find((tag) => tag.kind === 'span' && tag.facing === 'n')?.id);
  });

  it('measures a whole animation and a mirrored tag as rows of frames', () => {
    const world = started();
    apply(world.engine, [
      step('animation.directions', { animation: world.id, mode: 'four', tag: 'walk', framesPerFacing: 3, mirrored: ['w'] }),
      step('sheet.animation.add', { sheet: world.sheet, animation: world.id }),
    ]);
    const animation = animationOf(world);
    const mirror = animation.tags.find((tag) => tag.kind === 'mirror');
    expect(animationCells(animation, mirror?.id ?? null)).toHaveLength(3);
    expect(animationCells(animation, mirror?.id ?? null).every((cell) => cell.flip === 'x')).toBe(true);
    const extent = sheetExtent(sheetOf(world), sheetSizes(world.engine.state().artwork), world.engine.state().artwork.animations);
    expect(extent).toEqual({ width: animation.frames.length * animation.width, height: animation.height });
  });

  it('refuses the same entry twice and a tag of another animation, and removes entries', () => {
    const world = started();
    const sheet = world.sheet;
    apply(world.engine, [step('sheet.animation.add', { sheet, animation: world.id })]);
    expect(refuse(world.engine, [step('sheet.animation.add', { sheet, animation: world.id })]).code).toBe('INVALID_OPTION');
    expect(refuse(world.engine, [step('sheet.animation.add', { sheet, animation: world.id, tag: { by: 'name', name: 'nope' } })]).code).toBe('TARGET_NOT_FOUND');
    apply(world.engine, [step('sheet.animation.remove', { sheet, animation: world.id })]);
    expect(sheetOf(world).animationEntries).toEqual([]);
    expect(refuse(world.engine, [step('sheet.animation.remove', { sheet, animation: world.id })]).code).toBe('TARGET_NOT_FOUND');
  });

  it('drops the entries of a deleted tag and of a deleted animation', () => {
    const world = started();
    const sheet = world.sheet;
    apply(world.engine, [
      step('animation.directions', { animation: world.id, mode: 'four', tag: 'walk', mirrored: [] }),
      step('sheet.animation.add', { sheet, animation: world.id, tag: { by: 'name', name: 'walk', facing: 's' } }),
      step('sheet.animation.add', { sheet, animation: world.id }),
    ]);
    apply(world.engine, [step('animation.tag.delete', { animation: world.id, tag: { by: 'name', name: 'walk', facing: 's' } })]);
    expect(sheetOf(world).animationEntries?.map((entry) => entry.tagId)).toEqual([null]);
    apply(world.engine, [step('animation.delete', { animation: world.id })]);
    expect(sheetOf(world).animationEntries).toEqual([]);
  });

  it('is one undo step', () => {
    const world = started();
    checkOneUndoStep(world.engine, () => {
      apply(world.engine, [step('sheet.animation.add', { sheet: world.sheet, animation: world.id })]);
    });
  });
});
