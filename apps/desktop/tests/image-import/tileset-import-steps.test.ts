/* @layer renderer-app @kind test */
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { describe, expect, it } from 'vitest';
import { FORM_BASE, TILESET_REF } from '../../src/image-import/image-import.constants';
import type { ImportRun } from '../../src/image-import/image-import.type';
import { stepsOf } from '../../src/image-import/steps-of';
import { tilesetImportSteps } from '../../src/image-import/tileset-import-steps';

const image = { fileName: 'tiles.png', width: 4, height: 2, data: new Uint8ClampedArray(4 * 2 * 4).fill(255) };

const run: ImportRun = {
  form: { ...FORM_BASE, kind: 'tileset', name: ' ground ' },
  image,
  plan: { palette: [], transparent: true, limit: 16, bank: null, bankId: null, dropped: 0 },
  rects: [
    { index: 0, x: 0, y: 0, width: 2, height: 2 },
    { index: 1, x: 2, y: 0, width: 2, height: 2 },
  ],
  names: ['ground'],
  context: { documentId: null, bank: null, taken: [], animationNames: [], sheetNames: [], tilesetNames: [], tilemapNames: [], spriteCount: 0 },
  tiled: null,
};

describe('H1 the tileset kind of the image import', { tags: ['standard'] }, () => {
  it('walks the source, colours and slicing steps', () => {
    expect(stepsOf('tileset')).toEqual(['source', 'colors', 'slicing']);
  });

  it('makes one tileset step with a tile for each cell, at its place in the picture', () => {
    const [step] = tilesetImportSteps(run, { ref: 'bank' });
    expect(step?.name).toBe(PALETTE_COMMAND_NAME.tilesetImport);
    expect(step?.ref).toBe(TILESET_REF);
    const options = step?.options as { name: string; tileWidth: number; tileHeight: number; tiles: { originX: number; image: { width: number } }[] };
    expect(options).toMatchObject({ name: 'ground', tileWidth: 2, tileHeight: 2 });
    expect(options.tiles.map((tile) => tile.originX)).toEqual([0, 2]);
  });

  it('makes no step when the slicing found no cells', () => {
    expect(tilesetImportSteps({ ...run, rects: [] }, { ref: 'bank' })).toEqual([]);
  });
});
