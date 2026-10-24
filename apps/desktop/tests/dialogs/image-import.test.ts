/* @layer renderer-app @kind test */
import { findBank } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { activeRects } from '../../src/image-import/active-rects';
import { alphaThreshold } from '../../src/image-import/alpha-threshold';
import { colorsView } from '../../src/image-import/colors-view';
import { importContext } from '../../src/image-import/import-context';
import { importErrors } from '../../src/image-import/import-errors';
import { importNames } from '../../src/image-import/import-names';
import type { ImportContext, ImportForm, ImportRun, SourceImage } from '../../src/image-import/image-import.type';
import { initialImportForm } from '../../src/image-import/initial-import-form';
import { runImport } from '../../src/image-import/run-import';
import { sliceRects } from '../../src/image-import/slice-rects';
import { slicingLine } from '../../src/image-import/slicing-line';
import { stepIssue } from '../../src/image-import/step-issue';
import { NEW_MEMORY_DEFAULT } from '../../src/new-sprite/new-sprite.constants';
import { useImportStore } from '../../src/stores/useImportStore';
import { hostWithFile, newHost, revisionOf, sourceImage, sprites } from './dialog-harness';

const NONE: ImportContext = { documentId: null, bank: null, taken: [], sheetNames: [], spriteCount: 0 };

const noise = (side: number): SourceImage => sourceImage(side, side, (x, y) => [x * 9 + 3, y * 11 + 5, (x + y) * 5 + 1, 255]);

const RED: readonly [number, number, number, number] = [224, 36, 94, 255];
const GREEN: readonly [number, number, number, number] = [63, 208, 168, 255];
const CLEAR: readonly [number, number, number, number] = [0, 0, 0, 0];

const quad = (): SourceImage =>
  sourceImage(34, 16, (x) => {
    if (x % 18 >= 16) return CLEAR;
    return x >= 18 ? GREEN : RED;
  });

const formFor = (image: SourceImage, context: ImportContext, patch: Partial<ImportForm>): ImportForm => ({
  ...initialImportForm(image, context, NEW_MEMORY_DEFAULT),
  ...patch,
});

const runOf = (form: ImportForm, image: SourceImage, context: ImportContext): ImportRun => {
  const plan = colorsView(form, image, context).plan;
  if (!plan) throw new Error('no plan');
  const rects = activeRects(form, image);
  return { form, image, plan, rects, names: importNames(form, rects), context };
};

describe('slicing rectangles', () => {
  const grid = { cellWidth: 16, cellHeight: 16, offsetX: 1, offsetY: 0, spacingX: 2, spacingY: 2, order: 'rows', names: '' } as const;

  it('places cells with the offset and the spacing', () => {
    const rects = sliceRects({ width: 56, height: 34 }, grid);
    expect(rects).toHaveLength(6);
    expect(rects.map((rect) => [rect.x, rect.y])).toEqual([
      [1, 0],
      [19, 0],
      [37, 0],
      [1, 18],
      [19, 18],
      [37, 18],
    ]);
  });

  it('numbers by columns when asked to', () => {
    const rects = sliceRects({ width: 56, height: 34 }, { ...grid, order: 'columns' });
    expect(rects.map((rect) => [rect.x, rect.y]).slice(0, 3)).toEqual([
      [1, 0],
      [1, 18],
      [19, 0],
    ]);
  });

  it('leaves out cells that do not fit and returns none for a bad grid', () => {
    expect(sliceRects({ width: 20, height: 16 }, { ...grid, offsetX: 0 })).toHaveLength(1);
    expect(sliceRects({ width: 10, height: 10 }, grid)).toEqual([]);
    expect(sliceRects({ width: 64, height: 64 }, { ...grid, cellWidth: 0 })).toEqual([]);
    expect(sliceRects({ width: 64, height: 64 }, { ...grid, spacingX: -1 })).toEqual([]);
  });

  it('names the sprites and counts them in the slicing line', () => {
    const image = sourceImage(56, 34, () => [1, 2, 3, 255]);
    const form = formFor(image, NONE, { kind: 'sheet', slice: { ...grid, names: 'cap_{n}' } });
    const names = importNames(form, activeRects(form, image));
    expect(names).toEqual(['cap_01', 'cap_02', 'cap_03', 'cap_04', 'cap_05', 'cap_06']);
    expect(slicingLine(names)).toBe('6 sprites will be created: cap_01 to cap_06');
    expect(slicingLine(['solo'])).toBe('1 sprite will be created: solo');
  });
});

describe('the colors step', () => {
  it('reads 50 percent as the byte 128', () => {
    expect(alphaThreshold(50)).toBe(128);
    expect(alphaThreshold(0)).toBe(0);
    expect(alphaThreshold(100)).toBe(255);
  });

  it('warns and blocks when the image has more colors than the limit and no reduction is chosen', () => {
    const image = noise(8);
    const form = formFor(image, NONE, {});
    const view = colorsView(form, image, NONE);
    expect(form.reduce).toBeNull();
    expect(view.warning).toBe('This image has 64 colors. The limit is 16. Choose how to reduce them before importing.');
    const errors = importErrors({ form, image, context: NONE, rects: activeRects(form, image), names: ['caps'] });
    expect(stepIssue('colors', errors, view)).toBe(view.warning);
  });

  it('shows the reduced image and never adds colors silently', () => {
    const image = noise(8);
    const form = formFor(image, NONE, { reduce: 'extract' });
    const view = colorsView(form, image, NONE);
    expect(view.warning).toBeNull();
    expect(view.plan?.bank?.colors.length).toBeLessThanOrEqual(15);
    expect(view.mapped?.used).toBeLessThanOrEqual(15);
    expect(view.mapped?.changed).toBeGreaterThan(0);
    expect(stepIssue('colors', importErrors({ form, image, context: NONE, rects: [], names: [] }), view)).toBeNull();
  });

  it('extracts the exact colors when the image fits the limit', () => {
    const image = quad();
    const form = formFor(image, NONE, {});
    expect(form.reduce).toBe('extract');
    const view = colorsView(form, image, NONE);
    expect(view.count).toBe(2);
    expect(view.mapped?.changed).toBe(0);
  });

  it('refuses a sprite import larger than 2048 pixels', () => {
    const image = sourceImage(2049, 1, () => [1, 1, 1, 255]);
    const form = formFor(image, NONE, {});
    expect(importErrors({ form, image, context: NONE, rects: [], names: [] }).size).toBe(
      'This image is 2049 x 1. The largest sprite is 2048 x 2048.',
    );
  });
});

describe('the import transaction', () => {
  it('imports a sheet into a new file in one undo step', () => {
    const host = newHost();
    const image = quad();
    const form = formFor(image, NONE, {
      kind: 'sheet',
      slice: { cellWidth: 16, cellHeight: 16, offsetX: 0, offsetY: 0, spacingX: 2, spacingY: 0, order: 'rows', names: 'cap_{n}' },
    });
    const outcome = runImport(host, runOf(form, image, NONE));
    expect(outcome.ok && outcome.names).toEqual(['cap_01', 'cap_02']);
    if (!outcome.ok) return;
    const { documentId } = outcome;
    expect(sprites(host, documentId).map((sprite) => sprite.name)).toEqual(['cap_01', 'cap_02']);
    const before = revisionOf(host, documentId);
    expect(host.undo(documentId).ok).toBe(true);
    expect(sprites(host, documentId)).toHaveLength(0);
    expect(revisionOf(host, documentId)).toBe(before + 1);
    expect(host.redo(documentId).ok).toBe(true);
    expect(sprites(host, documentId)).toHaveLength(2);
  });

  it('imports into an open file with an extracted palette and one undo removes the sprites and the palette', () => {
    const { host, documentId } = hostWithFile();
    const context = importContext(host.view(documentId));
    const image = quad();
    const form = formFor(image, context, { reduce: 'extract', kind: 'sprite', name: 'caps' });
    const before = host.view(documentId)?.state.artwork;
    const outcome = runImport(host, runOf(form, image, context));
    expect(outcome.ok).toBe(true);
    const after = host.view(documentId)?.state.artwork;
    expect(after?.banks).toHaveLength(2);
    expect(after?.sprites.map((sprite) => sprite.name)).toEqual(['sprite', 'caps']);
    expect(host.undo(documentId).ok).toBe(true);
    const undone = host.view(documentId)?.state.artwork;
    expect(undone?.banks).toHaveLength(1);
    expect(undone?.sprites.map((sprite) => sprite.name)).toEqual(['sprite']);
    expect(undone?.banks[0]).toEqual(before?.banks[0]);
  });

  it('maps to the palette of the open file and adds no color', () => {
    const { host, documentId } = hostWithFile();
    const context = importContext(host.view(documentId));
    const image = noise(8);
    const form = formFor(image, context, { name: 'photo' });
    expect(form.reduce).toBe('map');
    const outcome = runImport(host, runOf(form, image, context));
    expect(outcome.ok).toBe(true);
    const artwork = host.view(documentId)?.state.artwork;
    const bank = artwork ? findBank(artwork, artwork.defaultBankId) : undefined;
    expect(artwork?.banks).toHaveLength(1);
    expect(bank?.slots).toHaveLength(16);
    const photo = artwork?.sprites.find((sprite) => sprite.name === 'photo');
    const pixels = photo ? Object.values(photo.cels)[0]?.pixels : undefined;
    expect(pixels ? Math.max(...pixels) : 99).toBeLessThan(16);
  });
});

describe('failing and cancelling', () => {
  it('fails as a whole and changes nothing when a name is taken', () => {
    const { host, documentId } = hostWithFile();
    const context = importContext(host.view(documentId));
    const image = quad();
    const form = formFor(image, context, { name: 'sprite' });
    const before = revisionOf(host, documentId);
    const outcome = runImport(host, runOf(form, image, context));
    expect(outcome.ok).toBe(false);
    expect(revisionOf(host, documentId)).toBe(before);
    expect(sprites(host, documentId)).toHaveLength(1);
  });

  it('leaves a failed import into a new file without a stray file', () => {
    const host = newHost();
    const image = quad();
    const form = formFor(image, NONE, { name: '   ' });
    const outcome = runImport(host, runOf(form, image, NONE));
    expect(outcome.ok).toBe(false);
    expect(host.list()).toHaveLength(0);
  });

  it('cancel changes nothing', () => {
    const { host, documentId } = hostWithFile();
    const before = revisionOf(host, documentId);
    useImportStore.getState().show(quad());
    useImportStore.getState().hide();
    expect(useImportStore.getState().image).toBeNull();
    expect(revisionOf(host, documentId)).toBe(before);
    expect(host.list()).toEqual([documentId]);
  });
});
