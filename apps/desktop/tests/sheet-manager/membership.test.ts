/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { addToSheet } from '../../src/sheet-manager/add-to-sheet';
import { atlasHit } from '../../src/sheet-manager/atlas-hit';
import { atlasModel } from '../../src/sheet-manager/atlas-model';
import { atlasScale } from '../../src/sheet-manager/atlas-scale';
import { createSheet } from '../../src/sheet-manager/create-sheet';
import { moveToSheet } from '../../src/sheet-manager/move-to-sheet';
import { removeFromSheet } from '../../src/sheet-manager/remove-from-sheet';
import { resizeSprites } from '../../src/sheet-manager/resize-sprites';
import { sheetStyleOptions } from '../../src/sheet-manager/sheet-style-options';
import { styleSheet } from '../../src/sheet-manager/style-sheet';
import { artwork, openFile, revision } from '../sheet/sheet-harness';
import { idsOf, PLAIN_ATLAS } from './manager-harness';

const sheetNamed = (name: string) => {
  const found = artwork().sheets.find((sheet) => sheet.name === name);
  if (!found) throw new Error(`no sheet ${name}`);
  return found;
};

const held = (name: string): string[] => {
  const names = new Map(artwork().sprites.map((sprite) => [sprite.id, sprite.name] as const));
  return sheetNamed(name).entries.map((entry) => names.get(entry.spriteId) ?? '');
};

beforeEach(() => openFile(['a', 'b', 'c'], 8));

describe('adding sprites to a sheet', () => {
  it('makes the first sheet when there is none, in one undo step', () => {
    const before = revision();
    expect(addToSheet(idsOf('a', 'b'), null)).toBe(true);
    expect(revision()).toBe(before + 1);
    expect(held('Sheet')).toEqual(['a', 'b']);
    stepHistory('undo');
    expect(artwork().sheets).toEqual([]);
  });

  it('skips the sprites that are already on the sheet', () => {
    addToSheet(idsOf('a'), null);
    const sheet = sheetNamed('Sheet');
    expect(addToSheet(idsOf('a'), sheet.id)).toBe(false);
    expect(addToSheet(idsOf('a', 'c'), sheet.id)).toBe(true);
    expect(held('Sheet')).toEqual(['a', 'c']);
  });
});

describe('removing sprites from a sheet', () => {
  it('keeps the sprites in the file', () => {
    addToSheet(idsOf('a', 'b', 'c'), null);
    const id = sheetNamed('Sheet').id;
    expect(removeFromSheet(idsOf('b'), id)).toBe(true);
    expect(held('Sheet')).toEqual(['a', 'c']);
    expect(artwork().sprites.map((sprite) => sprite.name)).toContain('b');
    expect(removeFromSheet(idsOf('b'), id)).toBe(false);
    expect(removeFromSheet(idsOf('a'), null)).toBe(false);
  });
});

describe('moving sprites to another sheet', () => {
  it('takes them off the old sheet and puts them on the new one in one step', () => {
    addToSheet(idsOf('a', 'b'), null);
    const second = createSheet();
    expect(second).not.toBeNull();
    const before = revision();
    expect(moveToSheet(idsOf('b'), second ?? sheetNamed('Sheet').id)).toBe(true);
    expect(revision()).toBe(before + 1);
    expect(held('Sheet')).toEqual(['a']);
    expect(held('Sheet 2')).toEqual(['b']);
    stepHistory('undo');
    expect(held('Sheet')).toEqual(['a', 'b']);
  });

  it('numbers a new sheet so that its name is free', () => {
    createSheet();
    createSheet();
    expect(artwork().sheets.map((sheet) => sheet.name)).toEqual(['Sheet', 'Sheet 2']);
  });
});

describe('the layout of a sheet', () => {
  it('turns a style into one update with only the asked fields', () => {
    addToSheet(idsOf('a', 'b', 'c'), null);
    const sheet = sheetNamed('Sheet');
    expect(sheetStyleOptions(sheet, { margin: 3 })).toEqual({ sheet: sheet.id, margin: 3 });
    expect(sheetStyleOptions(sheet, { spacing: 2 })).toEqual({ sheet: sheet.id, spacing: { x: 2, y: 2 } });
    expect(sheetStyleOptions(sheet, { layout: 'manual' })).toEqual({ sheet: sheet.id, layout: { kind: 'manual' } });
  });

  it('arranges as a grid with columns and places the sprites by the grid', () => {
    addToSheet(idsOf('a', 'b', 'c'), null);
    const id = sheetNamed('Sheet').id;
    expect(styleSheet(id, { layout: 'grid', columns: 2 })).toBe(true);
    expect(sheetNamed('Sheet').layout).toMatchObject({ kind: 'grid', columns: 2 });
    expect(sheetNamed('Sheet').entries.map((entry) => `${entry.at.x},${entry.at.y}`)).toEqual(['0,0', '8,0', '0,8']);
    expect(styleSheet(id, { columns: 3, spacing: 2, margin: 1 })).toBe(true);
    expect(sheetNamed('Sheet')).toMatchObject({ margin: 1, spacing: { x: 2, y: 2 } });
    expect(sheetNamed('Sheet').layout).toMatchObject({ kind: 'grid', columns: 3 });
    expect(styleSheet(null, { margin: 1 })).toBe(false);
  });
});

describe('the atlas preview', () => {
  it('packs the sheet with the export packer and counts the empty space', () => {
    addToSheet(idsOf('a', 'b', 'c'), null);
    styleSheet(sheetNamed('Sheet').id, { layout: 'grid', columns: 2 });
    const atlas = atlasModel({ sheet: sheetNamed('Sheet'), sprites: artwork().sprites, extrude: 0, ...PLAIN_ATLAS });
    expect(atlas.failure).toBeNull();
    expect(atlas).toMatchObject({ width: 16, height: 16 });
    expect(atlas.items.map((item) => `${item.x},${item.y}`)).toEqual(['0,0', '8,0', '0,8']);
    expect(atlas.empty).toBeCloseTo(0.25);
    const padded = atlasModel({ sheet: sheetNamed('Sheet'), sprites: artwork().sprites, extrude: 2, ...PLAIN_ATLAS });
    expect(padded.items[0]).toMatchObject({ x: 2, y: 2 });
    expect(padded.width).toBeGreaterThan(atlas.width);
  });

  it('shows a hand layout where the sprites are and an empty sheet as nothing', () => {
    addToSheet(idsOf('a', 'b'), null);
    const manual = atlasModel({ sheet: sheetNamed('Sheet'), sprites: artwork().sprites, extrude: 0, ...PLAIN_ATLAS });
    expect(manual.items).toHaveLength(2);
    expect(manual.failure).toBeNull();
    const empty = atlasModel({ sheet: { ...sheetNamed('Sheet'), entries: [] }, sprites: artwork().sprites, extrude: 0, ...PLAIN_ATLAS });
    expect(empty.items).toEqual([]);
  });

  it('reports a pack that is too large instead of drawing it', () => {
    resizeSprites(idsOf('a'), { width: 2048, height: 2048, anchor: 'top-left' });
    addToSheet(idsOf('a'), null);
    styleSheet(sheetNamed('Sheet').id, { layout: 'grid', columns: 1 });
    const sheet = sheetNamed('Sheet');
    const entry = sheet.entries[0];
    if (!entry) throw new Error('no entry');
    const tall = { ...sheet, entries: Array.from({ length: 9 }, () => entry) };
    const atlas = atlasModel({ sheet: tall, sprites: artwork().sprites, extrude: 0, ...PLAIN_ATLAS });
    expect(atlas.failure).not.toBeNull();
    expect(atlas.items).toEqual([]);
  });

  it('grows a packed width when a sprite is wider than the sheet', () => {
    addToSheet(idsOf('a'), null);
    styleSheet(sheetNamed('Sheet').id, { layout: 'packed', maxWidth: 4 });
    const atlas = atlasModel({ sheet: sheetNamed('Sheet'), sprites: artwork().sprites, extrude: 0, ...PLAIN_ATLAS });
    expect(atlas.failure).toBeNull();
    expect(atlas.width).toBe(8);
  });

  it('finds the sprite under a point and keeps the picture inside the canvas limit', () => {
    addToSheet(idsOf('a', 'b'), null);
    styleSheet(sheetNamed('Sheet').id, { layout: 'grid', columns: 2 });
    const atlas = atlasModel({ sheet: sheetNamed('Sheet'), sprites: artwork().sprites, extrude: 0, ...PLAIN_ATLAS });
    expect(atlasHit(atlas.items, { x: 9, y: 1 })).toBe(atlas.items[1]?.id);
    expect(atlasHit(atlas.items, { x: 30, y: 30 })).toBeNull();
    expect(atlasScale(8, 100, 100)).toBe(8);
    expect(atlasScale(8, 2000, 100)).toBe(2);
    expect(atlasScale(8, 9000, 100)).toBe(1);
  });
});
