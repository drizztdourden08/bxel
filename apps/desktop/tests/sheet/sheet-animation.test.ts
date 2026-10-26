/* @layer renderer-app @kind test */
import { COMMAND_NAME, paletteRgba } from '@bxel/document';
import type { AnimationId, SheetId } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { sheetPreviewImage } from '../../src/asset-overview/sheet-preview-image';
import { renderSheet } from '../../src/sheet/render-sheet';
import { runDocument } from '../../src/sheet/run-document';
import { sheetModel } from '../../src/sheet/sheet-model';
import { atlasModel } from '../../src/sheet-manager/atlas-model';
import { artwork, idOf, openFile, patch } from './sheet-harness';

const SIZE = 4;

const build = (): { sheet: SheetId; animation: AnimationId } => {
  const done = runDocument('Build', [
    { name: COMMAND_NAME.animationCreate, targets: null, options: { name: 'walk', source: { kind: 'sprites', sprites: [idOf('a'), idOf('b')] } }, ref: 'anim' },
    { name: COMMAND_NAME.sheetCreate, targets: null, options: { name: 'live' }, ref: 'sheet' },
    { name: COMMAND_NAME.sheetAnimationAdd, targets: null, options: { sheet: { ref: 'sheet' }, animation: { ref: 'anim' } } },
  ]);
  if (!done) throw new Error('the build failed');
  return { sheet: done.created['sheet'] as SheetId, animation: done.created['anim'] as AnimationId };
};

const colourAt = (rgba: Uint8ClampedArray, width: number, x: number, y: number): number[] => Array.from(rgba.subarray((y * width + x) * 4, (y * width + x) * 4 + 4));

beforeEach(() => openFile(['a', 'b'], SIZE));

describe('a sheet that places an animation', () => {
  it('draws the frames in a row, live, and follows an edit of a frame sprite', () => {
    patch('a', { x: 0, y: 0, width: 1, height: 1 }, 2);
    patch('b', { x: 0, y: 0, width: 1, height: 1 }, 3);
    const { sheet } = build();
    const art = artwork();
    const bank = art.banks[0];
    if (!bank) throw new Error('no palette');
    const palette = paletteRgba(bank);
    const model = sheetModel({ artwork: art, activeId: null, sheetId: sheet });
    expect(model.animations).toHaveLength(1);
    expect(model.extent.width).toBeGreaterThanOrEqual(SIZE * 2);
    const image = renderSheet(art, model, new Map());
    expect(colourAt(image.rgba, image.width, 0, 0)).toEqual(Array.from(palette.subarray(8, 12)));
    expect(colourAt(image.rgba, image.width, SIZE, 0)).toEqual(Array.from(palette.subarray(12, 16)));
    patch('a', { x: 0, y: 0, width: 1, height: 1 }, 4);
    const later = renderSheet(artwork(), sheetModel({ artwork: artwork(), activeId: null, sheetId: sheet }), new Map());
    expect(colourAt(later.rgba, later.width, 0, 0)).toEqual(Array.from(palette.subarray(16, 20)));
  });

  it('shows the animation in the atlas manager preview and in the overview image', () => {
    const { sheet } = build();
    const art = artwork();
    const found = art.sheets.find((each) => each.id === sheet);
    if (!found) throw new Error('no sheet');
    const atlas = atlasModel({ sheet: found, artwork: art, extrude: 0, trim: false, powerOfTwo: false, rotate: false, pageSide: 0, page: 0 });
    expect(atlas.items).toHaveLength(0);
    expect(atlas.animations).toHaveLength(1);
    expect([atlas.width, atlas.height]).toEqual([SIZE * 2, SIZE]);
    const preview = sheetPreviewImage(art, sheet);
    expect(preview.kind).toBe('image');
  });
});
