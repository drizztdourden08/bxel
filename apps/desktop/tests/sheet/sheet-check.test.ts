/* @layer renderer-app @kind test */
import { findOverlaps, sheetSizes } from '@bxel/document';
import type { Artwork, DocumentState, Sprite } from '@bxel/document';
import { decodeArtwork, encodeArtwork } from '@bxel/document/native';
import { beforeAll, describe, expect, it } from 'vitest';
import { beginStroke } from '../../src/editor/begin-stroke';
import { commitSession } from '../../src/editor/commit-session';
import { currentTarget } from '../../src/editor/current-target';
import { beginPending } from '../../src/editor/pending/begin-pending';
import { commitPending } from '../../src/editor/pending/commit-pending';
import { stepHistory } from '../../src/editor/step-history';
import { activeRects } from '../../src/image-import/active-rects';
import { colorsView } from '../../src/image-import/colors-view';
import { importContext } from '../../src/image-import/import-context';
import { importNames } from '../../src/image-import/import-names';
import type { ImportContext, ImportRun, SourceImage } from '../../src/image-import/image-import.type';
import { initialImportForm } from '../../src/image-import/initial-import-form';
import { runImport } from '../../src/image-import/run-import';
import { NEW_MEMORY_DEFAULT } from '../../src/new-sprite/new-sprite.constants';
import { pickSpriteById } from '../../src/sheet/pick-sprite-by-id';
import { renameSprite } from '../../src/sheet/rename-sprite';
import { toggleBroadcast } from '../../src/sheet/toggle-broadcast';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { plainOptions } from '../editor/editor-harness';
import { sourceImage } from '../dialogs/dialog-harness';
import { artwork, idOf, pixelsOf, spriteOf } from './sheet-harness';

const CELL = 4;
const STEP = 5;
const NONE: ImportContext = importContext(null);
const CLEAR: readonly [number, number, number, number] = [0, 0, 0, 0];

const PALETTE: readonly (readonly [number, number, number, number])[] = [
  [224, 36, 94, 255],
  [63, 208, 168, 255],
  [123, 63, 228, 255],
  [255, 214, 107, 255],
  [138, 209, 255, 255],
  [255, 122, 138, 255],
];

const cellColor = (x: number, y: number): readonly [number, number, number, number] => {
  const column = Math.floor((x - 1) / STEP);
  const row = Math.floor((y - 1) / STEP);
  const inside = x >= 1 && y >= 1 && (x - 1) % STEP < CELL && (y - 1) % STEP < CELL && column < 3 && row < 2;
  return inside ? (PALETTE[row * 3 + column] ?? CLEAR) : CLEAR;
};

const runOf = (image: SourceImage): ImportRun => {
  const form = {
    ...initialImportForm(image, NONE, NEW_MEMORY_DEFAULT),
    kind: 'sheet' as const,
    slice: { cellWidth: CELL, cellHeight: CELL, offsetX: 1, offsetY: 1, spacingX: 1, spacingY: 1, order: 'rows' as const, names: 'tile_{n}' },
  };
  const plan = colorsView(form, image, NONE).plan;
  if (!plan) throw new Error('no plan');
  const rects = activeRects(form, image);
  return { form, image, plan, rects, names: importNames(form, rects), context: NONE, tiled: null };
};

const pixel = (name: string, x: number, y: number): number => pixelsOf(name)[y * spriteOf(name).width + x] ?? 0;

const rectsOf = (art: Artwork): string[] => {
  const sizes = sheetSizes(art);
  return (art.sheets[0]?.entries ?? []).map((entry) => {
    const size = sizes.get(entry.spriteId);
    return `${entry.at.x},${entry.at.y},${size?.width},${size?.height}`;
  });
};

const pivotsOf = (sprites: readonly Sprite[]): string[] => sprites.map((sprite) => `${sprite.name}:${sprite.pivot.x2},${sprite.pivot.y2}`);

const trio = (): number[][] => [pixelsOf('hero'), pixelsOf('ally'), pixelsOf('foe')];

const stateOf = () => {
  const { host, activeId } = useDocumentStore.getState();
  const state = activeId === null ? null : host.view(activeId)?.state;
  if (!state) throw new Error('no state');
  return state;
};

const expectReopened = (state: DocumentState): void => {
  const report = decodeArtwork(encodeArtwork(state, null, () => 0));
  expect(report.outcome).toBe('ok');
  const reopened = report.artwork;
  if (!reopened) throw new Error('did not reopen');
  expect(rectsOf(reopened)).toEqual(rectsOf(state.artwork));
  expect(reopened.sheets[0]?.layout).toEqual(state.artwork.sheets[0]?.layout);
  expect(reopened.sheets[0]?.entries.map((entry) => entry.source)).toEqual(state.artwork.sheets[0]?.entries.map((entry) => entry.source));
  expect(pivotsOf(reopened.sprites)).toEqual(pivotsOf(state.artwork.sprites));
  const flipped = Object.values(reopened.sprites.find((sprite) => sprite.name === 'hero')?.cels ?? {})[0]?.pixels;
  expect(Array.from(flipped ?? [])).toEqual(pixelsOf('hero'));
};

let base: number[] = [];
let stroked: number[][] = [];

describe('release check 5 at the model level', () => {
  beforeAll(() => {
    const { host, setActive } = useDocumentStore.getState();
    const outcome = runImport(host, runOf(sourceImage(16, 11, cellColor, 'hero_sheet.png')));
    if (!outcome.ok) throw new Error(outcome.message);
    setActive(outcome.documentId);
  });

  it('imports a padded grid sheet with every rectangle at its place', () => {
    const art = artwork();
    expect(art.sprites.map((sprite) => sprite.name)).toEqual(['tile_01', 'tile_02', 'tile_03', 'tile_04', 'tile_05', 'tile_06']);
    expect(art.sheets[0]?.layout).toEqual({ kind: 'grid', columns: 3, cellWidth: CELL, cellHeight: CELL, order: 'rows' });
    expect(rectsOf(art)).toEqual(['1,1,4,4', '6,1,4,4', '11,1,4,4', '1,6,4,4', '6,6,4,4', '11,6,4,4']);
    expect(art.sheets[0]?.entries.map((entry) => entry.source?.x)).toEqual([1, 6, 11, 1, 6, 11]);
    const sheet = art.sheets[0];
    expect(sheet ? findOverlaps(sheet, sheetSizes(art)) : null).toEqual([]);
  });

  it('names and picks three sprites', () => {
    expect(renameSprite(idOf('tile_01'), 'hero')).toBe(true);
    expect(renameSprite(idOf('tile_02'), 'ally')).toBe(true);
    expect(renameSprite(idOf('tile_03'), 'foe')).toBe(true);
    pickSpriteById(idOf('hero'), 'replace');
    pickSpriteById(idOf('foe'), 'range');
    useSpriteStore.getState().setActive(idOf('hero'));
    expect(useSpriteStore.getState().selected).toHaveLength(3);
  });

  it('paints one shared local stroke on the three picked sprites only', () => {
    const target = currentTarget();
    if (!target) throw new Error('no target');
    toggleBroadcast();
    base = [pixel('hero', 2, 1), pixel('ally', 2, 1), pixel('foe', 2, 1), pixel('tile_04', 2, 1)];
    expect(commitSession(beginStroke({ target, tool: 'pencil', index: 2, options: plainOptions, at: { x: 2, y: 1 } }))?.ok).toBe(true);
    expect([pixel('hero', 2, 1), pixel('ally', 2, 1), pixel('foe', 2, 1), pixel('tile_04', 2, 1)]).toEqual([2, 2, 2, base[3]]);
    stroked = trio();
  });

  it('flips the picked sprites as one batch', () => {
    expect(beginPending({ kind: 'flip', axis: 'horizontal' })).toBe(true);
    expect(commitPending()).toBe(true);
    expect(pixel('hero', 1, 1)).toBe(2);
    expect(pixel('hero', 2, 1)).toBe(base[0]);
  });

  it('undoes each batch on its own and redoes both', () => {
    stepHistory('undo');
    expect(trio()).toEqual(stroked);
    stepHistory('undo');
    expect([pixel('hero', 2, 1), pixel('ally', 2, 1), pixel('foe', 2, 1)]).toEqual(base.slice(0, 3));
    stepHistory('redo');
    stepHistory('redo');
    expect(pixel('hero', 1, 1)).toBe(2);
  });

  it('saves and reopens with the sheet rectangles and the pivots intact', () => {
    expectReopened(stateOf());
  });
});
