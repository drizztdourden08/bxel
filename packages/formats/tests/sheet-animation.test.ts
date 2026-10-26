/* @layer tests @kind test */
import { exportSheet, readBxelSheetJson, tagPlayOrder } from '@bxel/formats';
import type { ExportSheetInput, ExportSprite, PackSettings, SheetTagEntry } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { makeRgbaPalette } from './make-rgba-palette';

const SIZE = 4;

const solid = (index: number): Uint8Array => new Uint8Array(SIZE * SIZE).fill(index);

const TAGS: readonly SheetTagEntry[] = [
  { name: 'walk_e', from: 0, to: 2, direction: 'pingpongReverse', repeat: 0, facing: 'e' },
  { name: 'walk_w', from: 3, to: 5, direction: 'pingpongReverse', repeat: 0, facing: 'w', mirrorOf: 'walk_e', flip: 'x' },
];

const walk = (): ExportSprite => ({
  name: 'walk',
  width: SIZE,
  height: SIZE,
  pivot: { x2: SIZE, y2: SIZE * 2 },
  palette: makeRgbaPalette(6, 0),
  frames: [1, 2, 1, 1, 2, 1].map((index, at) => ({
    layers: [solid(index)],
    durationMs: 50 + at,
    label: `${at < 3 ? 'walk_e' : 'walk_w'}_${at % 3}`,
  })),
  tags: TAGS,
  slices: [],
});

const GRID: PackSettings = {
  layout: { kind: 'grid', columns: 3, cellWidth: SIZE, cellHeight: SIZE, spacingX: 1, spacingY: 1, order: 'rows' },
  margin: 0,
  extrude: 0,
};

const request = (extra: Partial<ExportSheetInput> = {}): ExportSheetInput => ({
  imageName: 'walk.png',
  sprites: [walk()],
  settings: GRID,
  trim: false,
  scale: 1,
  flavour: 'bxel',
  ...extra,
});

const must = (input: ExportSheetInput) => {
  const result = exportSheet(input);
  if (!result.ok) throw new Error(result.message);
  return result;
};

describe('tagPlayOrder', () => {
  it('expands every direction', () => {
    expect(tagPlayOrder(2, 5, 'forward')).toEqual([2, 3, 4, 5]);
    expect(tagPlayOrder(2, 5, 'reverse')).toEqual([5, 4, 3, 2]);
    expect(tagPlayOrder(2, 5, 'pingpong')).toEqual([2, 3, 4, 5, 4, 3]);
    expect(tagPlayOrder(2, 5, 'pingpongReverse')).toEqual([5, 4, 3, 2, 3, 4]);
    expect(tagPlayOrder(1, 2, 'pingpong')).toEqual([1, 2]);
  });
});

describe('merge identical frames', () => {
  it('packs one rectangle for each distinct picture and keeps every frame entry', () => {
    const plain = must(request());
    const merged = must(request({ mergeIdentical: true }));
    const frames = merged.metadata.sprites[0]?.frames ?? [];
    expect(plain.metadata.sprites[0]?.frames).toHaveLength(6);
    expect(frames).toHaveLength(6);
    expect(new Set(frames.map((frame) => `${frame.box.x},${frame.box.y}`)).size).toBe(2);
    expect(frames[2]?.box).toEqual(frames[0]?.box);
    expect(frames.map((frame) => frame.durationMs)).toEqual([50, 51, 52, 53, 54, 55]);
    expect(merged.image.width * merged.image.height).toBeLessThan(plain.image.width * plain.image.height);
  });
});

describe('sheet flavours', () => {
  it('writes the Aseprite hash with pingpong_reverse tags', () => {
    const sheet = must(request({ flavour: 'hash' }));
    const json = JSON.parse(sheet.json) as { frames: Record<string, unknown>; meta: { frameTags: { name: string; direction: string; from: number; to: number }[] } };
    expect(Object.keys(json.frames)).toEqual(['walk_0', 'walk_1', 'walk_2', 'walk_3', 'walk_4', 'walk_5']);
    expect(json.meta.frameTags.map((tag) => [tag.name, tag.direction, tag.from, tag.to])).toEqual([
      ['walk_e', 'pingpong_reverse', 0, 2],
      ['walk_w', 'pingpong_reverse', 3, 5],
    ]);
  });

  it('writes the TexturePacker array with tag and facing names', () => {
    const sheet = must(request({ flavour: 'array' }));
    const json = JSON.parse(sheet.json) as { frames: { filename: string; duration: number; frame: object }[]; meta: { image: string } };
    expect(json.frames.map((frame) => frame.filename)).toEqual([
      'walk_e_0',
      'walk_e_1',
      'walk_e_2',
      'walk_w_0',
      'walk_w_1',
      'walk_w_2',
    ]);
    expect(json.frames[1]?.duration).toBe(51);
    expect(json.meta.image).toBe('walk.png');
  });

  it('writes Bxel JSON version 2 when tags carry facings and reads it back', () => {
    const sheet = must(request());
    expect(JSON.parse(sheet.json)).toMatchObject({ version: 2 });
    const back = readBxelSheetJson(sheet.json);
    expect(back.ok && back.metadata.sprites[0]?.tags).toEqual(TAGS);
  });

  it('keeps Bxel JSON version 1 for plain tags', () => {
    const plain = { ...walk(), tags: [{ name: 'loop', from: 0, to: 2, direction: 'forward', repeat: 0 } as const] };
    expect(JSON.parse(must(request({ sprites: [plain] })).json)).toMatchObject({ version: 1 });
  });

  it('writes a Tiled tileset with an animation for each tag', () => {
    const sheet = must(request({ flavour: 'tiled', mergeIdentical: true }));
    expect(sheet.metadata.sprites[0]?.frames.map((frame) => frame.box.x)).toEqual([0, 5, 10, 0, 5, 10]);
    const tsj = JSON.parse(sheet.json) as {
      type: string;
      columns: number;
      tilewidth: number;
      spacing: number;
      tiles: { id: number; animation: { tileid: number; duration: number }[]; properties: { name: string; value: unknown }[] }[];
    };
    expect([tsj.type, tsj.tilewidth, tsj.spacing]).toEqual(['tileset', SIZE, 1]);
    expect(tsj.tiles).toHaveLength(2);
    const [east, west] = tsj.tiles;
    expect(east?.animation.map((step) => step.tileid)).toEqual([2, 1, 0, 1]);
    expect(west?.animation.map((step) => step.tileid)).toEqual([5, 4, 3, 4]);
    expect([east?.id, west?.id]).toEqual([2, 5]);
    expect(east?.properties.find((property) => property.name === 'bxelTag')?.value).toBe('walk_e');
  });

  it('refuses a Tiled tileset from a packed layout', () => {
    const packed: PackSettings = { layout: { kind: 'packed', maxWidth: 64, padding: 1 }, margin: 0, extrude: 0 };
    const result = exportSheet(request({ flavour: 'tiled', settings: packed }));
    expect(result.ok).toBe(false);
  });
});
