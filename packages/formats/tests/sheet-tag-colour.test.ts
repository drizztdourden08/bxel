/* @layer tests @kind test */
import { readBxelSheetJson } from '@bxel/formats';
import type { ExportSprite } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { mustExport, request, SPRITES } from './sheet-fixture';
import { spriteEntry } from './sprite-entry';

type JsonObject = Record<string, unknown>;

const coloured = (colour: string | undefined): ExportSprite[] =>
  SPRITES.map((sprite, index) => ({
    ...sprite,
    tags: sprite.tags.map((tag) => (index === 0 && colour !== undefined ? { ...tag, colour } : tag)),
  }));

const parse = (text: string): JsonObject => JSON.parse(text) as JsonObject;

const frameTag = (json: string): JsonObject => {
  const meta = parse(json)['meta'] as JsonObject;
  return (meta['frameTags'] as JsonObject[])[0] ?? {};
};

describe('sheet tag colour', () => {
  it('writes the colour into the Aseprite style frameTags with full alpha', () => {
    const sheet = mustExport(request({ flavour: 'hash', sprites: coloured('#3b82f6') }));
    expect(frameTag(sheet.json)['color']).toBe('#3b82f6ff');
  });

  it('keeps the old default colour for a tag with none', () => {
    const sheet = mustExport(request({ flavour: 'hash', sprites: coloured(undefined) }));
    expect(frameTag(sheet.json)['color']).toBe('#000000ff');
  });

  it('round trips the colour through the Bxel sheet JSON', () => {
    const sheet = mustExport(request({ sprites: coloured('#22c55e') }));
    const read = readBxelSheetJson(sheet.json);
    if (!read.ok) throw new Error(read.message);
    expect(spriteEntry(read.metadata, 0).tags[0]?.colour).toBe('#22c55e');
    expect(read.metadata).toEqual(sheet.metadata);
  });

  it('writes no colour key for a tag with none, so old output is unchanged', () => {
    const sheet = mustExport(request({ sprites: coloured(undefined) }));
    expect(sheet.json).not.toContain('colour');
  });

  it('ignores a damaged colour when reading', () => {
    const sheet = mustExport(request({ sprites: coloured('#22c55e') }));
    const read = readBxelSheetJson(sheet.json.replace('#22c55e', 'green'));
    if (!read.ok) throw new Error(read.message);
    expect(spriteEntry(read.metadata, 0).tags[0]?.colour).toBeUndefined();
  });
});
