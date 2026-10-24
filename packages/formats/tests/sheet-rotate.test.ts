/* @layer tests @kind test */
import { compositeIndexed, exportSheet, packSheet, readBxelSheetJson } from '@bxel/formats';
import type { PackedItem, PackItem, PackSettings, SheetFrameEntry, SheetMetadata } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { FORMAT_ERROR_CODE } from '../src/failure/format-error.constants';
import { makeExportSprite } from './make-export-sprite';
import { pixelAt } from './pixel-at';
import { mustExport, request } from './sheet-fixture';

const SHELF = (maxWidth: number, rotate: boolean): PackSettings => ({
  layout: { kind: 'packed', maxWidth, padding: 0 },
  margin: 0,
  extrude: 0,
  rotate,
});

const GRID = (rotate: boolean): PackSettings => ({
  layout: { kind: 'grid', columns: 2, cellWidth: 8, cellHeight: 16, spacingX: 0, spacingY: 0, order: 'rows' },
  margin: 0,
  extrude: 0,
  rotate,
});

const mustPack = (items: readonly PackItem[], settings: PackSettings) => {
  const result = packSheet(items, settings);
  if (!result.ok) throw new Error(result.message);
  return result;
};

type JsonSheet = { size: { w: number; h: number }; sprites: { frames: Record<string, unknown>[] }[] };

const framesOf = (metadata: SheetMetadata): SheetFrameEntry[] => metadata.sprites.flatMap((sprite) => sprite.frames);

const itemOf = (items: readonly PackedItem[], key: string): PackedItem => {
  const found = items.find((item) => item.key === key);
  if (!found) throw new Error(`No item ${key}`);
  return found;
};

describe('packing with rotation', () => {
  const tall = { key: 'tall', width: 4, height: 12 };
  const wide = { key: 'wide', width: 12, height: 4 };

  it('never rotates when rotation is off', () => {
    const packed = mustPack([tall, wide], SHELF(12, false));
    expect(packed.items.every((item) => !item.rotated)).toBe(true);
    expect([packed.width, packed.height]).toEqual([12, 16]);
  });

  it('turns a tall sprite on its side when that makes the sheet smaller', () => {
    const packed = mustPack([tall, wide], SHELF(12, true));
    expect([packed.width, packed.height]).toEqual([12, 8]);
    expect(itemOf(packed.items, 'tall')).toMatchObject({ rotated: true, width: 4, height: 12 });
    expect(itemOf(packed.items, 'wide').rotated).toBe(false);
  });

  it('keeps the plain layout when turning does not help', () => {
    const items = [{ key: 'a', width: 8, height: 8 }, { key: 'b', width: 8, height: 8 }];
    const turned = mustPack(items, SHELF(16, true));
    expect(turned).toEqual(mustPack(items, SHELF(16, false)));
  });

  it('turns a sprite that is wider than the sheet when the turned sprite fits', () => {
    const items = [{ key: 'long', width: 30, height: 4 }];
    expect(packSheet(items, SHELF(8, false)).ok).toBe(false);
    const packed = mustPack(items, SHELF(8, true));
    expect(packed.items[0]).toMatchObject({ rotated: true, x: 0, y: 0 });
    expect([packed.width, packed.height]).toEqual([4, 30]);
  });

  it('still refuses a sprite that fits neither way', () => {
    const result = packSheet([{ key: 'huge', width: 30, height: 20 }], SHELF(8, true));
    expect(!result.ok && result.code).toBe(FORMAT_ERROR_CODE.SHEET_ITEM_TOO_LARGE);
  });

  it('turns a sprite to fit a grid cell and only then', () => {
    const items = [{ key: 'flat', width: 16, height: 8 }, { key: 'ok', width: 8, height: 16 }];
    expect(packSheet(items, GRID(false)).ok).toBe(false);
    const packed = mustPack(items, GRID(true));
    expect(packed.items.map((item) => item.rotated)).toEqual([true, false]);
    expect(packed.items.map((item) => [item.x, item.y])).toEqual([[0, 0], [8, 0]]);
  });

  it('keeps the margin, the padding and the extrusion around a turned sprite', () => {
    const settings: PackSettings = { layout: { kind: 'packed', maxWidth: 40, padding: 2 }, margin: 3, extrude: 1, rotate: true };
    const packed = mustPack([{ key: 'tall', width: 4, height: 30 }, { key: 'wide', width: 30, height: 4 }], settings);
    const boxes = packed.items.map((item) => ({
      x: item.x - 1,
      y: item.y - 1,
      width: (item.rotated ? item.height : item.width) + 2,
      height: (item.rotated ? item.width : item.height) + 2,
    }));
    for (const box of boxes) {
      expect(box.x).toBeGreaterThanOrEqual(3);
      expect(box.y).toBeGreaterThanOrEqual(3);
      expect(box.x + box.width).toBeLessThanOrEqual(packed.width - 3);
      expect(box.y + box.height).toBeLessThanOrEqual(packed.height - 3);
    }
  });
});

describe('rendering and writing a turned sprite', () => {
  const sprites = [
    makeExportSprite({ name: 'tall', width: 4, height: 12, frames: 1 }),
    makeExportSprite({ name: 'wide', width: 12, height: 4, frames: 1 }),
  ];
  const turned = () => mustExport(request({ sprites, trim: false, settings: SHELF(12, true) }));

  it('lays the turned pixels out a quarter turn clockwise', () => {
    const sheet = turned();
    const frame = sheet.metadata.sprites[0]?.frames[0];
    const sprite = sprites[0];
    const layers = sprite?.frames[0]?.layers;
    if (!frame || !sprite || !layers) throw new Error('missing frame');
    expect(frame.rotated).toBe(true);
    const flat = compositeIndexed(layers, sprite.palette, sprite);
    for (let y = 0; y < sprite.height; y += 1) {
      for (let x = 0; x < sprite.width; x += 1) {
        const at = pixelAt(sheet.image, frame.box.x + (sprite.height - 1 - y), frame.box.y + x);
        expect(at).toEqual(Array.from(flat.data.subarray((y * sprite.width + x) * 4, (y * sprite.width + x) * 4 + 4)));
      }
    }
  });

  it('writes the flag in the Bxel JSON and reads it back', () => {
    const sheet = turned();
    const written = JSON.parse(sheet.json) as { sprites: { frames: { rotated: boolean; frame: { w: number; h: number } }[] }[] };
    expect(written.sprites[0]?.frames[0]).toMatchObject({ rotated: true, frame: { w: 4, h: 12 } });
    expect(written.sprites[1]?.frames[0]?.rotated).toBe(false);
    const read = readBxelSheetJson(sheet.json);
    expect(read.ok && read.metadata).toEqual(sheet.metadata);
  });

  it('writes the flag and the plain sprite size in the hash JSON', () => {
    const sheet = mustExport(request({ sprites, trim: false, settings: SHELF(12, true), flavour: 'hash' }));
    const written = JSON.parse(sheet.json) as { frames: Record<string, { rotated: boolean; frame: { w: number; h: number }; sourceSize: { w: number; h: number } }> };
    expect(written.frames['tall']).toMatchObject({ rotated: true, frame: { w: 4, h: 12 }, sourceSize: { w: 4, h: 12 } });
    expect(written.frames['wide']?.rotated).toBe(false);
  });

  it('reads a file from before turned sprites as not turned', () => {
    const sheet = mustExport(request({ trim: false }));
    const parsed = JSON.parse(sheet.json) as JsonSheet;
    for (const frame of parsed.sprites.flatMap((sprite) => sprite.frames)) delete frame['rotated'];
    const read = readBxelSheetJson(JSON.stringify(parsed));
    expect(read.ok && framesOf(read.metadata).every((frame) => !frame.rotated)).toBe(true);
  });

  it('refuses a flag that is not a boolean', () => {
    const parsed = JSON.parse(turned().json) as JsonSheet;
    const frame = parsed.sprites[0]?.frames[0];
    if (!frame) throw new Error('missing frame');
    frame['rotated'] = 'yes';
    expect(readBxelSheetJson(JSON.stringify(parsed)).ok).toBe(false);
  });

  it('refuses a turned frame that leaves the sheet', () => {
    const parsed = JSON.parse(turned().json) as JsonSheet;
    parsed.size = { w: parsed.size.w, h: 6 };
    expect(readBxelSheetJson(JSON.stringify(parsed)).ok).toBe(false);
  });
});

describe('exportSheet without rotation', () => {
  it('writes the flag as false on every frame', () => {
    const sheet = mustExport(request());
    expect(framesOf(sheet.metadata).every((frame) => !frame.rotated)).toBe(true);
    expect(exportSheet(request()).ok).toBe(true);
  });
});
