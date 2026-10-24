/* @layer tests @kind test */
import { decodePng } from '@bxel/formats';
import type { PackSettings } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { expectExtruded } from './expect-extruded';
import { expectSpriteFrames } from './expect-sprite-frames';
import { frameEntry } from './frame-entry';
import { mustExport, request, SPRITES } from './sheet-fixture';
import { spriteEntry } from './sprite-entry';
import { uncoveredPixels } from './uncovered-pixels';

describe('exportSheet pixels and rectangles', () => {
  it('writes a PNG that decodes to the rendered sheet', () => {
    const sheet = mustExport(request());
    const png = decodePng(sheet.png);
    expect(png.ok && [png.width, png.height]).toEqual([sheet.image.width, sheet.image.height]);
    expect(png.ok && Array.from(png.data)).toEqual(Array.from(sheet.image.data));
    expect([sheet.metadata.width, sheet.metadata.height]).toEqual([sheet.image.width, sheet.image.height]);
  });

  it('puts every trimmed frame at its rectangle and untrims to the source', () => {
    const sheet = mustExport(request());
    SPRITES.forEach((sprite, i) => {
      expectSpriteFrames(sheet.image, sprite, spriteEntry(sheet.metadata, i));
    });
  });

  it('extrudes edges and leaves every uncovered pixel transparent', () => {
    const sheet = mustExport(request());
    const boxes = sheet.metadata.sprites.flatMap((sprite) => sprite.frames).map((frame) => frame.box);
    for (const box of boxes) expectExtruded(sheet.image, box);
    const rest = uncoveredPixels(sheet.image, boxes, 1);
    expect(rest.length).toBeGreaterThan(0);
    expect(rest.flat().every((value) => value === 0)).toBe(true);
  });

  it('is deterministic', () => {
    const a = mustExport(request());
    const b = mustExport(request());
    expect(Array.from(a.png)).toEqual(Array.from(b.png));
    expect(a.json).toBe(b.json);
  });
});

describe('exportSheet trim, scale and grid', () => {
  it('keeps whole frames when trim is off and scales by an integer', () => {
    const plain = mustExport(request({ trim: false }));
    const hero = spriteEntry(plain.metadata, 0);
    expect(hero.frames.every((frame) => !frame.trimmed && frame.sourceX === 0)).toBe(true);
    const doubled = mustExport(request({ trim: false, scale: 2 }));
    expect([doubled.image.width, doubled.image.height]).toEqual([
      plain.image.width * 2,
      plain.image.height * 2,
    ]);
    expect(doubled.metadata.scale).toBe(2);
    const second = frameEntry(spriteEntry(doubled.metadata, 0), 1);
    expect(second.box.x).toBe(frameEntry(hero, 1).box.x * 2);
    expect(spriteEntry(doubled.metadata, 0).pivot).toEqual({ x2: 24, y2: 38 });
  });

  it('lays out a fixed grid', () => {
    const grid: PackSettings = {
      layout: { kind: 'grid', columns: 2, cellWidth: 14, cellHeight: 12, spacingX: 1, spacingY: 1, order: 'rows' },
      margin: 0,
      extrude: 1,
    };
    const sheet = mustExport(request({ settings: grid, trim: false }));
    expect([sheet.image.width, sheet.image.height]).toEqual([29, 25]);
    expect(frameEntry(spriteEntry(sheet.metadata, 0), 1).box).toEqual({ x: 16, y: 1, width: 12, height: 10 });
    expect(frameEntry(spriteEntry(sheet.metadata, 1), 0).box).toEqual({ x: 16, y: 14, width: 8, height: 8 });
  });
});
