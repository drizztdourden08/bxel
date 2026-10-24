/* @layer tests @kind test */
import { FORMAT_ERROR_CODE, packSheet } from '@bxel/formats';
import type { PackedItem, PackedLayout, PackedSheet, PackSettings } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { makePackItems } from './make-pack-items';
import { separationGap } from './separation-gap';

const mustPack = (...args: Parameters<typeof packSheet>): PackedSheet => {
  const result = packSheet(...args);
  if (!result.ok) throw new Error(result.message);
  return result;
};

const inflate = (item: PackedItem, extrude: number): PackedItem => ({
  ...item,
  x: item.x - extrude,
  y: item.y - extrude,
  width: item.width + 2 * extrude,
  height: item.height + 2 * extrude,
});

const SHELF = (padding: number, maxWidth = 64): PackedLayout => ({ kind: 'packed', maxWidth, padding });

describe('packSheet grid', () => {
  const settings = (order: 'rows' | 'columns'): PackSettings => ({
    layout: { kind: 'grid', columns: 4, cellWidth: 16, cellHeight: 16, spacingX: 2, spacingY: 3, order },
    margin: 5,
    extrude: 1,
  });
  const items = makePackItems(10, 12);

  it('places by rows into spaced cells with a margin', () => {
    const packed = mustPack(items, settings('rows'));
    expect(packed.width).toBe(2 * 5 + 4 * 16 + 3 * 2);
    expect(packed.height).toBe(2 * 5 + 3 * 16 + 2 * 3);
    expect(packed.items.map((item) => [item.x, item.y])).toEqual(
      items.map((_, i) => [5 + (i % 4) * 18 + 1, 5 + Math.floor(i / 4) * 19 + 1]),
    );
  });

  it('places by columns', () => {
    const packed = mustPack(items, settings('columns'));
    expect(packed.items.slice(0, 4).map((item) => [item.x, item.y])).toEqual([
      [6, 6],
      [6, 25],
      [6, 44],
      [24, 6],
    ]);
    expect(packed.width).toBe(2 * 5 + 4 * 16 + 3 * 2);
  });

  it('keeps sizes, keys and input order', () => {
    const packed = mustPack(items, settings('rows'));
    expect(packed.items.map((item) => [item.key, item.width, item.height])).toEqual(
      items.map((item) => [item.key, item.width, item.height]),
    );
  });

  it('rejects an item that does not fit its cell', () => {
    const big = [{ key: 'big', width: 15, height: 4 }];
    expect(packSheet(big, settings('rows'))).toMatchObject({ code: FORMAT_ERROR_CODE.SHEET_ITEM_TOO_LARGE });
  });
});

describe('packSheet shelf', () => {
  const items = makePackItems(60, 20);

  it.each([
    [0, 0, 0],
    [2, 3, 1],
    [1, 0, 2],
  ])('never overlaps with padding %i, margin %i and extrusion %i', (padding, margin, extrude) => {
    const settings: PackSettings = { layout: SHELF(padding, 96), margin, extrude };
    const packed = mustPack(items, settings);
    const boxes = packed.items.map((item) => inflate(item, extrude));
    boxes.forEach((box, i) => {
      expect(box.x).toBeGreaterThanOrEqual(margin);
      expect(box.y).toBeGreaterThanOrEqual(margin);
      expect(box.x + box.width).toBeLessThanOrEqual(packed.width - margin);
      expect(box.y + box.height).toBeLessThanOrEqual(packed.height - margin);
      for (const other of boxes.slice(i + 1)) expect(separationGap(box, other)).toBeGreaterThanOrEqual(padding);
    });
    expect(packed.width).toBeLessThanOrEqual(96);
  });

  it('is deterministic and keeps input order', () => {
    const settings: PackSettings = { layout: SHELF(1), margin: 2, extrude: 1 };
    const first = mustPack(items, settings);
    const second = mustPack(items, settings);
    expect(second).toEqual(first);
    expect(first.items.map((item) => item.key)).toEqual(items.map((item) => item.key));
    first.items.forEach((item, i) => {
      expect([item.width, item.height]).toEqual([items[i]?.width, items[i]?.height]);
    });
  });

  it('packs equal squares in a tight block', () => {
    const squares = Array.from({ length: 8 }, (_, i) => ({ key: `s${i}`, width: 8, height: 8 }));
    const packed = mustPack(squares, { layout: SHELF(0, 32), margin: 0, extrude: 0 });
    expect([packed.width, packed.height]).toEqual([32, 16]);
  });

  it('reports items wider than the sheet and oversize sheets', () => {
    const wide = [{ key: 'w', width: 70, height: 2 }];
    const settings: PackSettings = { layout: SHELF(0), margin: 0, extrude: 0 };
    expect(packSheet(wide, settings)).toMatchObject({ code: FORMAT_ERROR_CODE.SHEET_ITEM_TOO_LARGE });
    const tall = Array.from({ length: 3 }, (_, i) => ({ key: `t${i}`, width: 8, height: 9000 }));
    expect(packSheet(tall, { ...settings, layout: SHELF(0, 16) })).toMatchObject({
      code: FORMAT_ERROR_CODE.SHEET_TOO_LARGE,
    });
  });

  it('rejects invalid input without throwing', () => {
    const settings: PackSettings = { layout: SHELF(0), margin: 0, extrude: 0 };
    const codes = [
      packSheet([], settings),
      packSheet([{ key: 'a', width: 0, height: 1 }], settings),
      packSheet(items, { ...settings, margin: -1 }),
      packSheet(items, { ...settings, layout: SHELF(-1) }),
      packSheet(items, { ...settings, layout: { ...SHELF(0), maxWidth: 0 } }),
    ].map((result) => (result.ok ? 'OK' : result.code));
    expect(new Set(codes)).toEqual(new Set([FORMAT_ERROR_CODE.SHEET_INVALID_INPUT]));
  });
});
