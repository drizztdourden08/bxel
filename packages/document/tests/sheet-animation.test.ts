/* @layer core @kind test */
import { animationCells, sheetExtent, sheetSizes } from '@bxel/document';
import type { Animation, Sheet } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { animationNamed, apply, buildAnimWorld, checkOneUndoStep, createdAnimation, refuse } from './anim-engine';
import type { AnimWorld } from './anim-engine';
import { spriteStep, step } from './tile-engine';

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

const spots = (world: AnimWorld & { readonly sheet: string }): { sprites: string[]; strips: string[] } => ({
  sprites: sheetOf(world).entries.map((entry) => `${entry.at.x},${entry.at.y}`),
  strips: (sheetOf(world).animationEntries ?? []).map((entry) => `${entry.at.x},${entry.at.y}`),
});

const withSprites = (): AnimWorld & { readonly id: string; readonly sheet: string } => {
  const world = started();
  apply(world.engine, [
    spriteStep('sheet.add', { sheet: world.sheet }, world.a),
    spriteStep('sheet.add', { sheet: world.sheet }, world.b),
    spriteStep('sheet.add', { sheet: world.sheet }, world.c),
    step('animation.directions', { animation: world.id, mode: 'four', tag: 'walk', framesPerFacing: 2, mirrored: ['w'] }),
  ]);
  return world;
};

const north = { by: 'name', name: 'walk', facing: 'n' } as const;

describe('animation entries in an arranged sheet', () => {
  it('flows the strips under the cells of a grid and closes the gap when one goes', () => {
    const world = withSprites();
    apply(world.engine, [
      step('sheet.arrange', { sheet: world.sheet, layout: { kind: 'grid', columns: 2, cellWidth: 4, cellHeight: 4 } }),
      step('sheet.animation.add', { sheet: world.sheet, animation: world.id }),
      step('sheet.animation.add', { sheet: world.sheet, animation: world.id, tag: north }),
    ]);
    expect(spots(world)).toEqual({ sprites: ['0,0', '4,0', '0,4'], strips: ['0,8', '0,12'] });
    apply(world.engine, [step('sheet.animation.remove', { sheet: world.sheet, animation: world.id, tag: null })]);
    expect(spots(world).strips).toEqual(['0,8']);
  });

  it('puts two narrow strips side by side on a wide grid', () => {
    const world = withSprites();
    apply(world.engine, [
      step('sheet.arrange', { sheet: world.sheet, layout: { kind: 'grid', columns: 6, cellWidth: 4, cellHeight: 4 } }),
      step('sheet.animation.add', { sheet: world.sheet, animation: world.id, tag: north }),
      step('sheet.animation.add', { sheet: world.sheet, animation: world.id, tag: { by: 'name', name: 'walk', facing: 's' } }),
    ]);
    expect(spots(world).strips).toEqual(['0,4', '8,4']);
  });

  it('shelf-packs the strips with the sprites and never fails on a strip wider than the sheet', () => {
    const world = withSprites();
    apply(world.engine, [
      step('sheet.animation.add', { sheet: world.sheet, animation: world.id }),
      step('sheet.arrange', { sheet: world.sheet, layout: { kind: 'packed', maxWidth: 16 } }),
    ]);
    expect(spots(world)).toEqual({ sprites: ['0,4', '4,4', '8,4'], strips: ['0,0'] });
    apply(world.engine, [step('sheet.arrange', { sheet: world.sheet, layout: { kind: 'packed', maxWidth: 8 } })]);
    expect(spots(world).strips).toEqual(['0,0']);
    expect(refuse(world.engine, [step('sheet.arrange', { sheet: world.sheet, layout: { kind: 'packed', maxWidth: 2 } })]).code).toBe('SIZE_OUT_OF_RANGE');
  });

  it('lets a packed sheet size itself to hold its strips', () => {
    const world = withSprites();
    apply(world.engine, [step('sheet.animation.add', { sheet: world.sheet, animation: world.id }), step('sheet.arrange', { sheet: world.sheet, layout: { kind: 'packed' } })]);
    const layout = sheetOf(world).layout;
    expect(layout.kind === 'packed' && layout.maxWidth >= 16).toBe(true);
  });

  it('keeps a manual sheet as it is and warns about a strip over a sprite', () => {
    const world = started();
    apply(world.engine, [spriteStep('sheet.add', { sheet: world.sheet, places: [{ at: { x: 2, y: 0 } }] }, world.a)]);
    const done = apply(world.engine, [step('sheet.animation.add', { sheet: world.sheet, animation: world.id, at: { x: 0, y: 0 } })]);
    expect(spots(world)).toEqual({ sprites: ['2,0'], strips: ['0,0'] });
    const messages = done.warnings.filter((warning) => warning.code === 'SHEET_OVERLAP').map((warning) => warning.message);
    expect(messages).toEqual(['Sprite "a" and animation "walk" overlap on sheet "sheet".']);
  });

  it('warns about two strips on top of each other', () => {
    const world = withSprites();
    const done = apply(world.engine, [
      step('sheet.animation.add', { sheet: world.sheet, animation: world.id, at: { x: 40, y: 0 } }),
      step('sheet.animation.add', { sheet: world.sheet, animation: world.id, tag: north, at: { x: 44, y: 0 } }),
    ]);
    expect(done.warnings.filter((warning) => warning.code === 'SHEET_OVERLAP').map((warning) => warning.message)).toContain(
      'Animation "walk" and animation "walk walk" overlap on sheet "sheet".',
    );
  });

  it('closes the gap when the animation of a strip is deleted', () => {
    const world = withSprites();
    apply(world.engine, [
      step('sheet.arrange', { sheet: world.sheet, layout: { kind: 'grid', columns: 2, cellWidth: 4, cellHeight: 4 } }),
      step('sheet.animation.add', { sheet: world.sheet, animation: world.id, tag: north }),
    ]);
    expect(spots(world).strips).toEqual(['0,8']);
    apply(world.engine, [step('animation.delete', { animation: world.id })]);
    expect(spots(world)).toEqual({ sprites: ['0,0', '4,0', '0,4'], strips: [] });
  });
});
