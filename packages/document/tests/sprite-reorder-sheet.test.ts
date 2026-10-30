/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import type { Engine, SpriteId } from '@bxel/document';
import { HEART, HEART_B, SHEET, apply, expectUndoRedo, onSprites, sheetOf, spotsOf, spriteNames, worldWithExtras } from './sheet-engine';

const onSheet = (engine: Engine): string[] => {
  const names = new Map(engine.state().artwork.sprites.map((sprite) => [sprite.id, sprite.name] as const));
  return sheetOf(engine).entries.map((entry) => names.get(entry.spriteId) ?? entry.spriteId);
};

const withBoth = (): { engine: Engine; tiny: SpriteId; wide: SpriteId } => {
  const world = worldWithExtras();
  apply(world.engine, onSprites('sheet.add', { sheet: SHEET }, [world.tiny, world.wide]));
  return world;
};

describe('sprite.reorder inside a sheet', () => {
  it('moves only the entry on the sheet and leaves the order of the file alone', () => {
    const { engine, wide } = withBoth();
    expect(onSheet(engine)).toEqual(['heart', 'heart-b', 'tiny', 'wide']);
    expectUndoRedo(engine, onSprites('sprite.reorder', { to: 0, sheet: SHEET }, [wide]));
    expect(onSheet(engine)).toEqual(['wide', 'heart', 'heart-b', 'tiny']);
    expect(spriteNames(engine)).toEqual(['heart', 'heart-b', 'tiny', 'wide']);
  });

  it('keeps the other entries in the order the sheet already has', () => {
    const { engine, wide } = withBoth();
    apply(engine, onSprites('sprite.reorder', { to: 0, sheet: SHEET }, [wide]));
    apply(engine, onSprites('sprite.reorder', { to: 1, sheet: SHEET }, [HEART_B]));
    expect(onSheet(engine)).toEqual(['wide', 'heart-b', 'heart', 'tiny']);
    expect(spriteNames(engine)).toEqual(['heart', 'heart-b', 'tiny', 'wide']);
  });

  it('steps an entry with by inside the sheet', () => {
    const { engine, tiny } = withBoth();
    apply(engine, onSprites('sprite.reorder', { by: -1, sheet: SHEET }, [tiny]));
    expect(onSheet(engine)).toEqual(['heart', 'tiny', 'heart-b', 'wide']);
    expect(spriteNames(engine)).toEqual(['heart', 'heart-b', 'tiny', 'wide']);
  });

  it('packs a grid sheet again in the new order', () => {
    const { engine, tiny } = withBoth();
    const before = spotsOf(engine);
    apply(engine, onSprites('sprite.reorder', { to: 0, sheet: SHEET }, [tiny]));
    expect(spotsOf(engine)['tiny']).toBe(before['heart']);
    expect(spotsOf(engine)['heart']).not.toBe(before['heart']);
  });

  it('does nothing when the entry stays where it is or is not on the sheet', () => {
    const { engine, tiny } = worldWithExtras();
    const revision = engine.state().revision;
    expect(apply(engine, onSprites('sprite.reorder', { to: 0, sheet: SHEET }, [HEART])).noop).toBe(true);
    expect(apply(engine, onSprites('sprite.reorder', { to: 0, sheet: SHEET }, [tiny])).noop).toBe(true);
    expect(engine.state().revision).toBe(revision);
  });
});

describe('sprite.reorder without a sheet', () => {
  it('still moves the order of the file and the sheets follow it', () => {
    const { engine, wide } = withBoth();
    apply(engine, onSprites('sprite.reorder', { to: 0, sheet: SHEET }, [wide]));
    apply(engine, onSprites('sprite.reorder', { to: 0 }, [HEART_B]));
    expect(spriteNames(engine)).toEqual(['heart-b', 'heart', 'tiny', 'wide']);
    expect(onSheet(engine)).toEqual(['heart-b', 'heart', 'tiny', 'wide']);
  });
});
