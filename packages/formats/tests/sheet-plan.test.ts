/* @layer tests @kind test */
import { exportSheet, exportSheetPages, planAtlas } from '@bxel/formats';
import type { ExportPagesInput, ExportedSheet, PackedItem, PackSettings } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { makeExportSprite } from './make-export-sprite';

const SPRITES = [
  makeExportSprite({ name: 'hero', width: 12, height: 10, frames: 3 }),
  makeExportSprite({ name: 'coin', width: 8, height: 8, frames: 2 }),
  makeExportSprite({ name: 'tall', width: 4, height: 14, frames: 1 }),
];

const SETTINGS: PackSettings = { layout: { kind: 'packed', maxWidth: 40, padding: 1 }, margin: 2, extrude: 1, powerOfTwo: true, rotate: true };

const PAGED: PackSettings = { layout: { kind: 'packed', maxWidth: 22, padding: 1 }, margin: 0, extrude: 1, rotate: true };

const input = (pageSide: number, settings = SETTINGS, trim = true): ExportPagesInput => ({
  sprites: SPRITES,
  settings,
  trim,
  scale: 1,
  flavour: 'bxel',
  pageSide,
  imageName: (page, count) => (count === 1 ? 'atlas.png' : `atlas_${page + 1}.png`),
});

const must = (result: ReturnType<typeof exportSheetPages>): readonly ExportedSheet[] => {
  if (!result.ok) throw new Error(result.message);
  return result.pages;
};

const plannedBoxes = (items: readonly PackedItem[]): unknown[] =>
  items.map((item) => [{ x: item.x, y: item.y, width: item.width, height: item.height }, item.rotated]);

const boxesOf = (page: ExportedSheet): unknown[] => page.metadata.sprites.flatMap((sprite) => sprite.frames.map((frame) => [frame.box, frame.rotated]));

describe('one plan for the preview and the export', () => {
  it('keeps one page and the same layout as exportSheet when the page side is 0', () => {
    const pages = must(exportSheetPages(input(0)));
    expect(pages).toHaveLength(1);
    const single = exportSheet({ ...input(0), imageName: 'atlas.png' });
    if (!single.ok) throw new Error(single.message);
    expect(boxesOf(pages[0] as ExportedSheet)).toEqual(boxesOf(single));
    expect(Array.from((pages[0] as ExportedSheet).png)).toEqual(Array.from(single.png));
  });

  it('plans the same boxes and sizes as the pages it exports', () => {
    for (const pageSide of [0, 24]) {
      const settings = pageSide === 0 ? SETTINGS : PAGED;
      const plan = planAtlas({ sprites: SPRITES, settings, trim: true, pageSide });
      if (!plan.ok) throw new Error(plan.message);
      const pages = must(exportSheetPages(input(pageSide, settings)));
      expect(plan.pages).toHaveLength(pages.length);
      if (pageSide > 0) expect(pages.length).toBeGreaterThan(1);
      for (const [at, planned] of plan.pages.entries()) {
        const exported = pages[at] as ExportedSheet;
        expect([planned.packed.width, planned.packed.height]).toEqual([exported.image.width, exported.image.height]);
        expect(plannedBoxes(planned.packed.items)).toEqual(boxesOf(exported));
      }
    }
  });

  it('gives each frame a key, a sprite and a frame number', () => {
    const plan = planAtlas({ sprites: SPRITES, settings: SETTINGS, trim: false, pageSide: 0 });
    if (!plan.ok) throw new Error(plan.message);
    expect(plan.cells.map((cell) => [cell.spriteIndex, cell.frameIndex, cell.key])).toEqual([
      [0, 0, 'hero_0'],
      [0, 1, 'hero_1'],
      [0, 2, 'hero_2'],
      [1, 0, 'coin_0'],
      [1, 1, 'coin_1'],
      [2, 0, 'tall'],
    ]);
  });

  it('reports a sprite name used twice and an empty list the way the export does', () => {
    const [first] = SPRITES;
    if (!first) throw new Error('missing sprite');
    expect(planAtlas({ sprites: [first, first], settings: SETTINGS, trim: true, pageSide: 0 }).ok).toBe(false);
    expect(planAtlas({ sprites: [], settings: SETTINGS, trim: true, pageSide: 0 }).ok).toBe(false);
  });

  it('splits over pages the same way with the margin of the settings', () => {
    const none = must(exportSheetPages(input(64, { ...SETTINGS, margin: 0, rotate: false })));
    const margin = must(exportSheetPages(input(64, { ...SETTINGS, margin: 5, rotate: false })));
    const first = none[0]?.metadata.sprites[0]?.frames[0]?.box;
    const moved = margin[0]?.metadata.sprites[0]?.frames[0]?.box;
    if (!first || !moved) throw new Error('missing frame');
    expect([moved.x - first.x, moved.y - first.y]).toEqual([5, 5]);
  });
});
