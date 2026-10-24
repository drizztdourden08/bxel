/* @layer tests @kind test */
import { exportSheet, FORMAT_ERROR_CODE, readBxelSheetJson } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { frameEntry } from './frame-entry';
import { mustExport, PACKED, request, SPRITES } from './sheet-fixture';
import { spriteEntry } from './sprite-entry';

type JsonObject = Record<string, unknown>;

const parseObject = (text: string): JsonObject => {
  const value: unknown = JSON.parse(text);
  if (typeof value !== 'object' || value === null) throw new Error('not an object');
  return { ...value };
};

describe('Bxel sheet JSON', () => {
  it('reconstructs names, pivots, durations, tags and slices', () => {
    const sheet = mustExport(request());
    const read = readBxelSheetJson(sheet.json);
    if (!read.ok) throw new Error(read.message);
    expect(read.metadata).toEqual(sheet.metadata);
    const hero = spriteEntry(read.metadata, 0);
    const source = SPRITES[0];
    expect(hero.name).toBe('hero');
    expect(hero.pivot).toEqual(source?.pivot);
    expect(hero.frames.map((frame) => frame.durationMs)).toEqual([40, 65, 90]);
    expect(hero.tags).toEqual(source?.tags);
    expect(hero.slices).toEqual(source?.slices);
  });

  it('rejects foreign or damaged files', () => {
    const sheet = mustExport(request());
    const codes = [
      readBxelSheetJson('{'),
      readBxelSheetJson('[]'),
      readBxelSheetJson(sheet.json.replace('"bxel-sheet"', '"other"')),
      readBxelSheetJson(sheet.json.replace('"version": 1', '"version": 9')),
      readBxelSheetJson(sheet.json.replace('"durationMs": 40', '"durationMs": 0')),
      readBxelSheetJson(sheet.json.replace('"from": 0', '"from": 7')),
    ].map((result) => (result.ok ? 'OK' : result.code));
    expect(new Set(codes)).toEqual(new Set([FORMAT_ERROR_CODE.SHEET_INVALID_JSON]));
  });
});

describe('hash sheet JSON', () => {
  it('lists frames by name with the common engine fields', () => {
    const sheet = mustExport(request({ flavour: 'hash' }));
    const root = parseObject(sheet.json);
    const frames = parseObject(JSON.stringify(root['frames']));
    expect(Object.keys(frames)).toEqual(['hero_0', 'hero_1', 'hero_2', 'coin']);
    const second = frameEntry(spriteEntry(sheet.metadata, 0), 1);
    expect(frames['hero_1']).toMatchObject({
      frame: { x: second.box.x, y: second.box.y, w: second.box.width, h: second.box.height },
      rotated: false,
      trimmed: second.trimmed,
      spriteSourceSize: { x: second.sourceX, y: second.sourceY, w: second.box.width, h: second.box.height },
      sourceSize: { w: 12, h: 10 },
      duration: 65,
    });
  });

  it('describes the image, tags and slices in meta', () => {
    const sheet = mustExport(request({ flavour: 'hash' }));
    expect(parseObject(sheet.json)['meta']).toMatchObject({
      image: 'sheet.png',
      size: { w: sheet.image.width, h: sheet.image.height },
      scale: '1',
      frameTags: [{ name: 'loop', from: 0, to: 2, direction: 'pingpong', repeat: '2' }],
      slices: [
        { name: 'hero-hit', keys: [{ frame: 0, bounds: { x: 1, y: 1, w: 10, h: 8 }, pivot: { x: 1.5, y: 2.5 } }] },
        { name: 'coin-hit', keys: [{ frame: 3, bounds: { x: 1, y: 1, w: 6, h: 6 } }] },
      ],
    });
  });
});

describe('exportSheet errors', () => {
  it('returns codes for invalid requests', () => {
    const hero = SPRITES[0];
    if (!hero) throw new Error('missing fixture');
    const badIndex = { ...hero, frames: [{ layers: [new Uint8Array(120).fill(9)], durationMs: 10 }] };
    const narrow = { ...PACKED, layout: { kind: 'packed', maxWidth: 5, padding: 0 } } as const;
    const results = [
      exportSheet(request({ sprites: [] })),
      exportSheet(request({ scale: 0 })),
      exportSheet(request({ scale: 17 })),
      exportSheet(request({ imageName: '' })),
      exportSheet(request({ sprites: [hero, hero] })),
      exportSheet(request({ sprites: [badIndex] })),
      exportSheet(request({ settings: narrow })),
    ].map((result) => (result.ok ? 'OK' : result.code));
    expect(results).toEqual([
      FORMAT_ERROR_CODE.SHEET_INVALID_INPUT,
      FORMAT_ERROR_CODE.SHEET_INVALID_INPUT,
      FORMAT_ERROR_CODE.SHEET_INVALID_INPUT,
      FORMAT_ERROR_CODE.SHEET_INVALID_INPUT,
      FORMAT_ERROR_CODE.SHEET_DUPLICATE_NAME,
      FORMAT_ERROR_CODE.SHEET_INVALID_INPUT,
      FORMAT_ERROR_CODE.SHEET_ITEM_TOO_LARGE,
    ]);
  });
});
