/* @layer renderer-app @kind test */
import { decodePng, readBxelSheetJson, writeHashSheetJson } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import type { ExportSettings } from '../../src/export/export.type';
import { planExport } from '../../src/export/plan-export';
import { addFrame, bytesOf, frozenOf, harness, paint, settingsOf, textOf } from './export-harness';
import type { ExportHarness } from './export-harness';

const PALETTE = [
  [0x4b, 0x1f, 0xa0],
  [0x7b, 0x3f, 0xe4],
  [0xb0, 0x2a, 0x9c],
];

const threeFrames = (): ExportHarness => {
  const h = harness();
  addFrame(h, 100);
  addFrame(h, 100);
  paint(h, 0, 1, 2);
  paint(h, 1, 2, 3);
  paint(h, 2, 3, 4);
  return h;
};

const sheetOf = (h: ExportHarness, patch: Partial<ExportSettings>) => {
  const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({ kind: 'sheet', frames: 'all', ...patch }), selectedIds: [] });
  const [image, json] = plan.files;
  if (!image || !json) throw new Error(plan.problem ?? 'the sheet has no files');
  const decoded = decodePng(bytesOf(image));
  const metadata = readBxelSheetJson(textOf(json));
  if (!decoded.ok || !metadata.ok) throw new Error('the sheet cannot be read');
  return { decoded, metadata: metadata.metadata };
};

const pixelAt = (sheet: ReturnType<typeof sheetOf>, x: number, y: number): number[] => {
  const at = (y * sheet.decoded.width + x) * 4;
  return Array.from(sheet.decoded.data.slice(at, at + 4));
};

const checkFrames = (sheet: ReturnType<typeof sheetOf>, scale: number): void => {
  const sprite = sheet.metadata.sprites[0];
  expect(sprite?.frames).toHaveLength(3);
  sprite?.frames.forEach((frame, index) => {
    const dotX = (frame.box.x - frame.sourceX) + (index + 1) * scale;
    const dotY = frame.box.y - frame.sourceY;
    expect(pixelAt(sheet, dotX, dotY)).toEqual([...(PALETTE[index] ?? []), 255]);
    expect(frame.box.x + frame.box.width).toBeLessThanOrEqual(sheet.decoded.width);
    expect(frame.box.y + frame.box.height).toBeLessThanOrEqual(sheet.decoded.height);
  });
};

describe('sheet export', () => {
  it('places every frame of a grid at the rectangle its JSON names', () => {
    const sheet = sheetOf(threeFrames(), { layout: 'grid', columns: 2, padding: 1 });
    expect([sheet.decoded.width, sheet.decoded.height]).toEqual([65, 65]);
    checkFrames(sheet, 1);
  });

  it('places every frame of a packed sheet at the rectangle its JSON names', () => {
    const sheet = sheetOf(threeFrames(), { layout: 'packed', padding: 2 });
    expect([sheet.metadata.width, sheet.metadata.height]).toEqual([sheet.decoded.width, sheet.decoded.height]);
    checkFrames(sheet, 1);
  });

  it('keeps the rectangles right with trim, extrusion and scale', () => {
    const sheet = sheetOf(threeFrames(), { layout: 'packed', trim: true, extrusion: 1, padding: 1, scale: 2 });
    expect(sheet.metadata.scale).toBe(2);
    expect(sheet.metadata.sprites[0]?.frames.every((frame) => frame.trimmed)).toBe(true);
    checkFrames(sheet, 2);
  });

  it('writes the hash flavour with the same rectangles', () => {
    const h = threeFrames();
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({ kind: 'sheet', frames: 'all', flavour: 'hash' }), selectedIds: [] });
    const json = plan.files[1];
    const native = sheetOf(h, {}).metadata;
    const hash = json ? textOf(json) : '';
    expect(hash).toBe(writeHashSheetJson(native));
  });

  it('scales a one-cell sheet and names its size', () => {
    const h = harness();
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({ kind: 'sheet', layout: 'grid', columns: 1, scale: 8, padding: 64 }), selectedIds: [] });
    expect(plan.problem).toBeNull();
    expect(plan.files[0]?.width).toBe(256);
  });
});
