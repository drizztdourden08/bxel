/* @layer tests @kind test */
import { FORMAT_ERROR_CODE, exportSheetPages, packPages, packSheet } from '@bxel/formats';
import type { PackSettings } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { makeExportSprite } from './make-export-sprite';
import { makePackItems } from './make-pack-items';

const SHELF: PackSettings = { layout: { kind: 'packed', maxWidth: 32, padding: 0 }, margin: 0, extrude: 0 };

const square = (key: string, side: number) => ({ key, width: side, height: side });

describe('power of two sheets', () => {
  it('rounds the width and the height up and keeps the places of the items', () => {
    const items = makePackItems(3, 1).map((item, at) => ({ ...item, key: `i${at}`, width: 10, height: 10 }));
    const loose = packSheet(items, { layout: { kind: 'packed', maxWidth: 64, padding: 0 }, margin: 0, extrude: 0 });
    const round = packSheet(items, { layout: { kind: 'packed', maxWidth: 64, padding: 0 }, margin: 0, extrude: 0, powerOfTwo: true });
    if (!loose.ok || !round.ok) throw new Error('the pack failed');
    expect([loose.width, loose.height]).toEqual([30, 10]);
    expect([round.width, round.height]).toEqual([32, 16]);
    expect(round.items).toEqual(loose.items);
  });

  it('keeps a size that is a power already', () => {
    const grid: PackSettings = { layout: { kind: 'grid', columns: 2, cellWidth: 8, cellHeight: 8, spacingX: 0, spacingY: 0, order: 'rows' }, margin: 0, extrude: 0, powerOfTwo: true };
    const packed = packSheet([square('a', 8), square('b', 8)], grid);
    expect(packed).toMatchObject({ ok: true, width: 16, height: 8 });
  });
});

describe('packPages', () => {
  it('starts a new page when the next entry would not fit and keeps a group on one page', () => {
    const groups = [[square('a', 16)], [square('b', 16)], [square('c0', 16), square('c1', 16), square('c2', 16)], [square('d', 16)], [square('e', 16)]];
    const result = packPages(groups, SHELF, 32);
    if (!result.ok) throw new Error(result.message);
    expect(result.pages.map((page) => page.groups)).toEqual([[0, 1], [2, 3], [4]]);
    expect(result.pages.every((page) => page.packed.width <= 32 && page.packed.height <= 32)).toBe(true);
  });

  it('puts everything on one page when it fits', () => {
    const result = packPages([[square('a', 8)], [square('b', 8)]], SHELF, 64);
    expect(result).toMatchObject({ ok: true });
    if (result.ok) expect(result.pages).toHaveLength(1);
  });

  it('reports an entry that is larger than a page', () => {
    const result = packPages([[square('a', 8)], [square('big', 40)]], { ...SHELF, layout: { kind: 'packed', maxWidth: 64, padding: 0 } }, 32);
    expect(result).toMatchObject({ ok: false, code: FORMAT_ERROR_CODE.SHEET_TOO_LARGE });
  });
});

describe('exportSheetPages', () => {
  const sprites = [
    makeExportSprite({ name: 'hero', width: 12, height: 10, frames: 2 }),
    makeExportSprite({ name: 'coin', width: 16, height: 16, frames: 1 }),
    makeExportSprite({ name: 'gem', width: 16, height: 16, frames: 1 }),
  ];
  const input = {
    sprites,
    settings: { layout: { kind: 'packed', maxWidth: 32, padding: 1 }, margin: 0, extrude: 0, powerOfTwo: true } as PackSettings,
    trim: false,
    scale: 1,
    flavour: 'bxel' as const,
    pageSide: 32,
    imageName: (page: number, count: number) => `sheet_${page + 1}_of_${count}.png`,
  };

  it('makes a whole sheet for each page and keeps every sprite on one page', () => {
    const result = exportSheetPages(input);
    if (!result.ok) throw new Error(result.message);
    expect(result.pages.length).toBeGreaterThan(1);
    const names: string[] = [];
    for (const page of result.pages) names.push(...page.metadata.sprites.map((sprite) => sprite.name));
    expect(names.sort()).toEqual(['coin', 'gem', 'hero']);
    const count = result.pages.length;
    expect(result.pages.map((page) => page.metadata.image)).toEqual(Array.from({ length: count }, (_page, at) => `sheet_${at + 1}_of_${count}.png`));
    for (const page of result.pages) {
      expect(Math.max(page.image.width, page.image.height)).toBeLessThanOrEqual(32);
      expect(Math.log2(page.image.width) % 1).toBe(0);
    }
  });

  it('refuses a page smaller than a sprite', () => {
    expect(exportSheetPages({ ...input, pageSide: 8 })).toMatchObject({ ok: false });
  });
});
