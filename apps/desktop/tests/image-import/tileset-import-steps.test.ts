/* @layer renderer-app @kind test */
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { describe, expect, it } from 'vitest';
import { FORM_BASE, TILESET_REF } from '../../src/image-import/image-import.constants';
import { stepsOf } from '../../src/image-import/steps-of';
import { tilesetImportSteps } from '../../src/image-import/tileset-import-steps';
import { importRun } from './import-run';

const run = importRun('tiles.png', { ...FORM_BASE, kind: 'tileset', name: ' ground ' }, null, ['ground']);

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
