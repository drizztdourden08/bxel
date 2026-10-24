/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { heartEngine } from './heart-engine';
import { heartPairFixture } from './heart-pair-fixture';
import { HEART, HEART_B, SHEET, apply, engineAltered, expectUndoRedo, onSprites, plain, rejection, sheetOf, spotsOf, undo, worldWithExtras } from './sheet-engine';

describe('sheet.create', () => {
  it('adds an empty manual sheet as one undo step and reports it by ref', () => {
    const { engine } = heartEngine();
    const done = expectUndoRedo(engine, plain('sheet.create', { name: 'Atlas' }, 'atlas'));
    const made = engine.state().artwork.sheets.at(-1);
    expect(made).toMatchObject({ name: 'Atlas', layout: { kind: 'manual' }, spacing: { x: 0, y: 0 }, margin: 0, entries: [] });
    expect(made?.id).toBe(done.created['atlas']);
  });

  it('keeps the layout, spacing and margin it was given', () => {
    const { engine } = heartEngine();
    apply(engine, plain('sheet.create', { name: 'Grid', layout: { kind: 'grid', columns: 3, cellWidth: 16, cellHeight: 12 }, spacing: { x: 2, y: 3 }, margin: 4 }));
    expect(engine.state().artwork.sheets.at(-1)).toMatchObject({
      layout: { kind: 'grid', columns: 3, cellWidth: 16, cellHeight: 12, order: 'rows' },
      spacing: { x: 2, y: 3 },
      margin: 4,
    });
  });

  it('refuses a taken name in any letter case and a blank name', () => {
    const { engine } = heartEngine();
    expect(rejection(engine, plain('sheet.create', { name: 'HEARTS' })).code).toBe('NAME_TAKEN');
    expect(rejection(engine, plain('sheet.create', { name: ' ' })).code).toBe('NAME_INVALID');
  });
});

describe('sheet.add', () => {
  it('puts a new sprite to the right of a manual sheet', () => {
    const { engine, tiny } = worldWithExtras();
    apply(engine, plain('sheet.create', { name: 'Free' }, 'free'));
    const free = engine.state().artwork.sheets.at(-1)?.id;
    if (!free) throw new Error('no sheet');
    apply(engine, onSprites('sheet.add', { sheet: free }, [HEART, tiny]));
    expect(spotsOf(engine, free)).toEqual({ heart: '0,0', tiny: '8,0' });
  });

  it('places a sprite on the next cell of a grid sheet', () => {
    const { engine, tiny } = worldWithExtras();
    expectUndoRedo(engine, onSprites('sheet.add', { sheet: SHEET }, [tiny]));
    expect(spotsOf(engine)).toEqual({ heart: '0,0', 'heart-b': '9,0', tiny: '0,9' });
  });

  it('keeps the places and the source rectangles it was given', () => {
    const { engine, tiny } = worldWithExtras();
    const source = { x: 3, y: 4, width: 4, height: 6 };
    apply(engine, onSprites('sheet.add', { sheet: SHEET, places: [{ at: { x: 40, y: 2 }, source }] }, [tiny]));
    expect(sheetOf(engine).entries.at(-1)).toEqual({ spriteId: tiny, at: { x: 40, y: 2 }, source });
  });

  it('refuses a sprite that is already on the sheet and a wrong number of places', () => {
    const { engine, tiny } = worldWithExtras();
    expect(rejection(engine, onSprites('sheet.add', { sheet: SHEET }, [HEART])).code).toBe('INVALID_OPTION');
    const places = [{ at: { x: 0, y: 0 } }];
    expect(rejection(engine, onSprites('sheet.add', { sheet: SHEET, places }, [tiny, HEART_B])).code).toBe('INVALID_OPTION');
  });

  it('warns about overlapping sprites in a manual placement', () => {
    const { engine, tiny } = worldWithExtras();
    const done = apply(engine, onSprites('sheet.add', { sheet: SHEET, places: [{ at: { x: 2, y: 2 } }] }, [tiny]));
    const overlaps = done.warnings.filter((warning) => warning.code === 'SHEET_OVERLAP');
    expect(overlaps.length).toBe(1);
    expect(overlaps[0]?.message).toContain('overlap');
  });
});

describe('sheet.remove', () => {
  it('removes a sprite and closes the gap of a grid sheet', () => {
    const { engine } = heartEngine();
    expectUndoRedo(engine, onSprites('sheet.remove', { sheet: SHEET }, [HEART]));
    expect(spotsOf(engine)).toEqual({ 'heart-b': '0,0' });
    expect(engine.state().artwork.sprites.map((sprite) => sprite.name)).toEqual(['heart', 'heart-b']);
  });

  it('refuses a sprite that is not on the sheet', () => {
    const { engine, tiny } = worldWithExtras();
    const error = rejection(engine, onSprites('sheet.remove', { sheet: SHEET }, [tiny]));
    expect(error.code).toBe('TARGET_NOT_FOUND');
    expect(error.details.map((detail) => detail.spriteId)).toEqual([tiny]);
  });
});

describe('sheet.place', () => {
  it('moves one sprite, switches to manual layout and never touches its pixels', () => {
    const { engine } = heartEngine();
    const before = engine.state().artwork.sprites.find((sprite) => sprite.id === HEART);
    expectUndoRedo(engine, onSprites('sheet.place', { sheet: SHEET, at: { x: 30, y: 12 } }, [HEART]));
    expect(sheetOf(engine).layout).toEqual({ kind: 'manual' });
    expect(spotsOf(engine).heart).toBe('30,12');
    expect(engine.state().artwork.sprites.find((sprite) => sprite.id === HEART)).toBe(before);
  });

  it('moves a group by an offset', () => {
    const { engine } = heartEngine();
    apply(engine, onSprites('sheet.place', { sheet: SHEET, by: { x: 5, y: 3 } }, [HEART, HEART_B]));
    expect(spotsOf(engine)).toEqual({ heart: '5,3', 'heart-b': '14,3' });
  });

  it('warns when sprites overlap and says nothing when they do not', () => {
    const { engine } = heartEngine();
    const touching = apply(engine, onSprites('sheet.place', { sheet: SHEET, at: { x: 8, y: 0 } }, [HEART_B]));
    expect(touching.warnings).toEqual([]);
    const crossing = apply(engine, onSprites('sheet.place', { sheet: SHEET, at: { x: 7, y: 7 } }, [HEART_B]));
    expect(crossing.warnings.map((warning) => warning.code)).toEqual(['SHEET_OVERLAP']);
  });

  it('refuses at for a group, a move off the sheet and a sprite that is not on it', () => {
    const { engine, tiny } = worldWithExtras();
    expect(rejection(engine, onSprites('sheet.place', { sheet: SHEET, at: { x: 1, y: 1 } }, [HEART, HEART_B])).code).toBe('INVALID_OPTION');
    expect(rejection(engine, onSprites('sheet.place', { sheet: SHEET, by: { x: -1, y: 0 } }, [HEART])).code).toBe('OUT_OF_BOUNDS');
    expect(rejection(engine, onSprites('sheet.place', { sheet: SHEET, at: { x: 1, y: 1 } }, [tiny])).code).toBe('TARGET_NOT_FOUND');
    expect(rejection(engine, onSprites('sheet.place', { sheet: SHEET }, [HEART])).code).toBe('INVALID_OPTION');
  });
});

describe('sheet.arrange', () => {
  it('lays a grid out by rows with defaults taken from the sprites', () => {
    const { engine, tiny, wide } = worldWithExtras();
    apply(engine, onSprites('sheet.add', { sheet: SHEET }, [tiny, wide]));
    expectUndoRedo(engine, plain('sheet.arrange', { sheet: SHEET, layout: { kind: 'grid' } }));
    expect(sheetOf(engine).layout).toEqual({ kind: 'grid', columns: 2, cellWidth: 20, cellHeight: 8, order: 'rows' });
    expect(spotsOf(engine)).toEqual({ heart: '0,0', 'heart-b': '21,0', tiny: '0,9', wide: '21,9' });
  });

  it('lays a grid out by columns with margin and spacing', () => {
    const { engine } = heartEngine();
    apply(engine, plain('sheet.arrange', { sheet: SHEET, layout: { kind: 'grid', columns: 1, order: 'columns' }, spacing: { x: 2, y: 2 }, margin: 3 }));
    expect(spotsOf(engine)).toEqual({ heart: '3,3', 'heart-b': '3,13' });
  });

  it('packs sprites in shelves, tallest first', () => {
    const { engine, tiny, wide } = worldWithExtras();
    apply(engine, onSprites('sheet.add', { sheet: SHEET }, [tiny, wide]));
    apply(engine, plain('sheet.arrange', { sheet: SHEET, layout: { kind: 'packed', maxWidth: 24 }, spacing: { x: 1, y: 1 } }));
    expect(sheetOf(engine).layout).toEqual({ kind: 'packed', maxWidth: 24 });
    expect(spotsOf(engine)).toEqual({ heart: '0,0', 'heart-b': '9,0', tiny: '18,0', wide: '0,9' });
  });

  it('picks a width for a packed sheet that fits the widest sprite', () => {
    const { engine, wide } = worldWithExtras();
    apply(engine, onSprites('sheet.add', { sheet: SHEET }, [wide]));
    apply(engine, plain('sheet.arrange', { sheet: SHEET, layout: { kind: 'packed' }, margin: 1 }));
    const layout = sheetOf(engine).layout;
    expect(layout.kind === 'packed' && layout.maxWidth >= 22).toBe(true);
  });

  it('refuses a packed width narrower than a sprite', () => {
    const { engine, wide } = worldWithExtras();
    apply(engine, onSprites('sheet.add', { sheet: SHEET }, [wide]));
    expect(rejection(engine, plain('sheet.arrange', { sheet: SHEET, layout: { kind: 'packed', maxWidth: 10 } })).code).toBe('SIZE_OUT_OF_RANGE');
  });

  it('keeps every sprite buffer, pivot and size when the layout changes', () => {
    const { engine } = heartEngine();
    const before = engine.state().artwork.sprites;
    apply(engine, plain('sheet.arrange', { sheet: SHEET, layout: { kind: 'packed', maxWidth: 32 } }));
    expect(engine.state().artwork.sprites).toBe(before);
  });

  it('warns when a grid cell is smaller than a sprite', () => {
    const { engine } = heartEngine();
    const done = apply(engine, plain('sheet.arrange', { sheet: SHEET, layout: { kind: 'grid', columns: 2, cellWidth: 4, cellHeight: 4 } }));
    expect(done.warnings.map((warning) => warning.code)).toEqual(['SHEET_OVERLAP']);
  });

  it('turns a layout into manual without moving anything', () => {
    const { engine } = heartEngine();
    const before = spotsOf(engine);
    apply(engine, plain('sheet.arrange', { sheet: SHEET, layout: { kind: 'manual' } }));
    expect(sheetOf(engine).layout).toEqual({ kind: 'manual' });
    expect(spotsOf(engine)).toEqual(before);
  });
});

describe('sheet.update and sheet.delete', () => {
  it('renames a sheet and refuses a name that is taken', () => {
    const { engine } = heartEngine();
    apply(engine, plain('sheet.create', { name: 'Other' }));
    expectUndoRedo(engine, plain('sheet.update', { sheet: SHEET, name: 'Renamed' }));
    expect(rejection(engine, plain('sheet.update', { sheet: SHEET, name: 'other' })).code).toBe('NAME_TAKEN');
    expect(rejection(engine, plain('sheet.update', { sheet: SHEET })).code).toBe('INVALID_OPTION');
  });

  it('lays out again when the spacing changes', () => {
    const { engine } = heartEngine();
    apply(engine, plain('sheet.update', { sheet: SHEET, spacing: { x: 4, y: 0 } }));
    expect(spotsOf(engine)).toEqual({ heart: '0,0', 'heart-b': '12,0' });
  });

  it('deletes a sheet that no preset uses and keeps the sprites', () => {
    const { engine } = heartEngine();
    expectUndoRedo(engine, plain('sheet.delete', { sheet: SHEET }));
    expect(engine.state().artwork.sheets).toEqual([]);
    expect(engine.state().artwork.sprites.length).toBe(2);
    undo(engine);
    expect(engine.state().artwork.sheets.length).toBe(1);
  });

  it('refuses to delete a sheet an export preset uses', () => {
    const engine = engineAltered({ presets: heartPairFixture.presets.map((preset) => ({ ...preset, sheetId: SHEET })) });
    expect(rejection(engine, plain('sheet.delete', { sheet: SHEET })).code).toBe('SHEET_IN_USE');
  });
});
