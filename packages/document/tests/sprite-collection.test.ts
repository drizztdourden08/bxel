/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { heartEngine } from './heart-engine';
import { heartPairFixture } from './heart-pair-fixture';
import { HEART, HEART_B, SHEET, apply, engineAltered, expectUndoRedo, onSprites, plain, rejection, sheetOf, spotsOf, spriteNames, worldWithExtras } from './sheet-engine';

describe('sprite.delete', () => {
  it('removes the sprite, its sheet entry and its preset reference as one undo step', () => {
    const { engine } = heartEngine();
    expectUndoRedo(engine, onSprites('sprite.delete', {}, [HEART_B]));
    expect(spriteNames(engine)).toEqual(['heart']);
    expect(sheetOf(engine).entries.map((entry) => entry.spriteId)).toEqual([HEART]);
    expect(engine.state().artwork.presets[0]?.scope.sprites).toEqual([HEART]);
  });

  it('closes the gap in a grid sheet and clears a cover sprite that is gone', () => {
    const { engine } = heartEngine();
    apply(engine, onSprites('sprite.delete', {}, [HEART]));
    expect(spotsOf(engine)).toEqual({ 'heart-b': '0,0' });
    expect(engine.state().artwork.coverSpriteId).toBeNull();
  });

  it('deletes several sprites at once', () => {
    const { engine, tiny, wide } = worldWithExtras();
    apply(engine, onSprites('sprite.delete', {}, [HEART_B, tiny, wide]));
    expect(spriteNames(engine)).toEqual(['heart']);
  });

  it('keeps one sprite in the file', () => {
    const { engine } = heartEngine();
    expect(rejection(engine, onSprites('sprite.delete', {}, [HEART, HEART_B])).code).toBe('LAST_SPRITE');
  });

  it('refuses to delete a sprite a tileset uses', () => {
    const { engine } = heartEngine();
    apply(
      engine,
      plain('tileset.create', { name: 'ground', tileWidth: 8, tileHeight: 8 }, 'ts'),
      plain('tile.add', { tileset: { ref: 'ts' }, name: 'grass' }, 'grass'),
    );
    const tile = engine.state().artwork.tilesets[0]?.tiles[0]?.spriteId;
    if (!tile) throw new Error('no tile');
    expect(rejection(engine, onSprites('sprite.delete', {}, [tile])).code).toBe('TILE_IN_USE');
  });
});

describe('sprite.duplicate', () => {
  it('inserts a copy after the original and puts it on the same sheet', () => {
    const { engine } = heartEngine();
    const done = expectUndoRedo(engine, onSprites('sprite.duplicate', {}, [HEART], 'copy'));
    expect(spriteNames(engine)).toEqual(['heart', 'heart copy', 'heart-b']);
    const copy = engine.state().artwork.sprites[1];
    expect(copy?.id).toBe(done.created['copy']);
    expect(copy?.id).not.toBe(HEART);
    expect(spotsOf(engine)).toEqual({ heart: '0,0', 'heart-b': '9,0', 'heart copy': '0,9' });
  });

  it('copies pixels, layers, frames, tags and pivot with new ids', () => {
    const { engine } = heartEngine();
    apply(engine, onSprites('sprite.duplicate', {}, [HEART]));
    const [original, copy] = engine.state().artwork.sprites;
    if (!original || !copy) throw new Error('missing sprites');
    expect(copy.pivot).toEqual(original.pivot);
    expect(copy.layers.map((layer) => layer.name)).toEqual(original.layers.map((layer) => layer.name));
    expect(copy.layers[0]?.id).not.toBe(original.layers[0]?.id);
    expect(copy.frames.map((frame) => frame.durationMs)).toEqual(original.frames.map((frame) => frame.durationMs));
    expect(copy.tags[0]?.name).toBe('pulse');
    expect(copy.tags[0]?.from).toBe(copy.frames[0]?.id);
    const cels = (sprite: typeof original): string[] => Object.values(sprite.cels).map((cel) => Array.from(cel.pixels).join(''));
    expect(cels(copy)).toEqual(cels(original));
  });

  it('numbers copies of several sprites and keeps the names free', () => {
    const { engine } = heartEngine();
    apply(engine, onSprites('sprite.duplicate', {}, [HEART]));
    apply(engine, onSprites('sprite.duplicate', {}, [HEART, HEART_B]));
    expect(spriteNames(engine)).toEqual(['heart', 'heart copy 2', 'heart copy', 'heart-b', 'heart-b copy']);
  });

  it('takes a name for one sprite and refuses a taken or shared name', () => {
    const { engine } = heartEngine();
    apply(engine, onSprites('sprite.duplicate', { name: 'twin' }, [HEART]));
    expect(spriteNames(engine)).toContain('twin');
    expect(rejection(engine, onSprites('sprite.duplicate', { name: 'TWIN' }, [HEART])).code).toBe('NAME_TAKEN');
    expect(rejection(engine, onSprites('sprite.duplicate', { name: 'both' }, [HEART, HEART_B])).code).toBe('INVALID_OPTION');
  });

  it('does not put the copy on a sheet that lacks the original', () => {
    const engine = engineAltered({ sheets: heartPairFixture.sheets.map((sheet) => ({ ...sheet, entries: sheet.entries.slice(1) })) });
    apply(engine, onSprites('sprite.duplicate', {}, [HEART]));
    expect(sheetOf(engine, SHEET).entries.length).toBe(1);
  });
});

describe('sprite.reorder', () => {
  it('moves a sprite to a position and the sheet follows the new order', () => {
    const { engine, tiny } = worldWithExtras();
    apply(engine, onSprites('sheet.add', { sheet: SHEET }, [tiny]));
    expectUndoRedo(engine, onSprites('sprite.reorder', { to: 0 }, [tiny]));
    expect(spriteNames(engine)).toEqual(['tiny', 'heart', 'heart-b', 'wide']);
    expect(spotsOf(engine)).toEqual({ tiny: '0,0', heart: '9,0', 'heart-b': '0,9' });
  });

  it('steps a sprite one place with by', () => {
    const { engine } = worldWithExtras();
    apply(engine, onSprites('sprite.reorder', { by: 1 }, [HEART]));
    expect(spriteNames(engine)).toEqual(['heart-b', 'heart', 'tiny', 'wide']);
    apply(engine, onSprites('sprite.reorder', { by: -1 }, [HEART]));
    expect(spriteNames(engine)).toEqual(['heart', 'heart-b', 'tiny', 'wide']);
  });

  it('moves a group together and keeps its inner order', () => {
    const { engine, wide } = worldWithExtras();
    apply(engine, onSprites('sprite.reorder', { to: 0 }, [wide, HEART_B]));
    expect(spriteNames(engine)).toEqual(['heart-b', 'wide', 'heart', 'tiny']);
    apply(engine, onSprites('sprite.reorder', { to: 99 }, [HEART_B]));
    expect(spriteNames(engine)).toEqual(['wide', 'heart', 'tiny', 'heart-b']);
  });

  it('does nothing when the order stays', () => {
    const { engine } = worldWithExtras();
    const revision = engine.state().revision;
    const done = apply(engine, onSprites('sprite.reorder', { by: -1 }, [HEART]));
    expect(done.noop).toBe(true);
    expect(engine.state().revision).toBe(revision);
  });

  it('refuses both to and by, and neither', () => {
    const { engine } = heartEngine();
    expect(rejection(engine, onSprites('sprite.reorder', { to: 0, by: 1 }, [HEART])).code).toBe('INVALID_OPTION');
    expect(rejection(engine, onSprites('sprite.reorder', {}, [HEART])).code).toBe('INVALID_OPTION');
  });
});
