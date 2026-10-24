/* @layer renderer-app @kind test */
import { decodePng } from '@bxel/formats';
import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_EXPORT_SETTINGS } from '../../src/export/export.constants';
import type { ExportSettings } from '../../src/export/export.type';
import { openSettings } from '../../src/export/open-settings';
import { planExport } from '../../src/export/plan-export';
import { addToSheet } from '../../src/sheet-manager/add-to-sheet';
import { atlasExportSettings } from '../../src/sheet-manager/atlas-export-settings';
import { atlasModel } from '../../src/sheet-manager/atlas-model';
import { styleSheet } from '../../src/sheet-manager/style-sheet';
import { artwork, openFile, patch } from '../sheet/sheet-harness';
import { idsOf, PLAIN_ATLAS } from './manager-harness';

const sheet = () => {
  const found = artwork().sheets[0];
  if (!found) throw new Error('no sheet');
  return found;
};

const model = (change: Partial<typeof PLAIN_ATLAS> = {}) =>
  atlasModel({ sheet: sheet(), artwork: artwork(), extrude: 0, ...PLAIN_ATLAS, ...change });

beforeEach(() => {
  openFile(['a', 'b', 'c', 'd', 'e'], 8);
  patch('a', { x: 2, y: 3, width: 2, height: 1 }, 1);
  addToSheet(idsOf('a', 'b', 'c', 'd', 'e'), null);
  styleSheet(sheet().id, { layout: 'grid', columns: 2 });
});

describe('the trim of the atlas preview', () => {
  it('finds the filled part of a sprite and keeps one pixel for a blank sprite', () => {
    const trimmed = model({ trim: true });
    expect(trimmed.items[0]?.source).toEqual({ x: 2, y: 3, width: 2, height: 1 });
    expect(trimmed.items[1]?.source).toEqual({ x: 0, y: 0, width: 1, height: 1 });
  });

  it('packs the trimmed size and remembers where the part came from', () => {
    const plain = model();
    const trimmed = model({ trim: true });
    expect(plain.items[0]).toMatchObject({ width: 8, height: 8, source: { x: 0, y: 0, width: 8, height: 8 } });
    expect(trimmed.items[0]).toMatchObject({ width: 2, height: 1, source: { x: 2, y: 3, width: 2, height: 1 } });
    expect(trimmed.used).toBeLessThan(plain.used);
  });

  it('brings the full size back when trim is turned off and ignores trim on a sheet made by hand', () => {
    expect(model({ trim: true }).items[0]?.width).toBe(2);
    expect(model({ trim: false }).items[0]?.width).toBe(8);
    styleSheet(sheet().id, { layout: 'manual' });
    expect(model({ trim: true }).items[0]?.width).toBe(8);
  });
});

describe('the power of two size and the pages of the atlas preview', () => {
  it('rounds the size of a packed sheet and of a sheet made by hand', () => {
    styleSheet(sheet().id, { layout: 'packed', maxWidth: 48 });
    const loose = model();
    const round = model({ powerOfTwo: true });
    expect([loose.width, loose.height]).toEqual([40, 8]);
    expect([round.width, round.height]).toEqual([64, 8]);
    styleSheet(sheet().id, { layout: 'manual' });
    expect(Math.log2(model({ powerOfTwo: true }).width) % 1).toBe(0);
  });

  it('splits the sprites over pages and clamps the page number', () => {
    const first = model({ pageSide: 16 });
    expect(first).toMatchObject({ pageCount: 2, page: 0 });
    expect(first.items).toHaveLength(4);
    const second = model({ pageSide: 16, page: 1 });
    expect(second.items.map((item) => item.name)).toEqual(['e']);
    expect(model({ pageSide: 16, page: 9 }).page).toBe(1);
    expect(model({ pageSide: 4 }).failure).not.toBeNull();
  });
});

describe('opening the export for the sheet', () => {
  it('turns the atlas settings into export settings for the sprites of the sheet', () => {
    const settings = atlasExportSettings(sheet(), { ...PLAIN_ATLAS, trim: true, powerOfTwo: true, pageSide: 64, extrude: 1 });
    expect(settings).toMatchObject({ sprites: 'sheet', sheetId: sheet().id, layout: 'grid', columns: 2, extrusion: 1, trim: true, powerOfTwo: true, pageSide: 64 });
  });

  it('carries the margin, the largest width and the rotation of a packed sheet', () => {
    styleSheet(sheet().id, { layout: 'packed', maxWidth: 96, margin: 3, spacing: 2 });
    const asked = atlasExportSettings(sheet(), { ...PLAIN_ATLAS, rotate: true, extrude: 0 });
    expect(asked).toMatchObject({ layout: 'packed', maxWidth: 96, margin: 3, padding: 2, rotate: true });
    styleSheet(sheet().id, { layout: 'grid', columns: 2 });
    expect(atlasExportSettings(sheet(), { ...PLAIN_ATLAS, rotate: true, extrude: 0 })).toMatchObject({ layout: 'grid', maxWidth: 0, rotate: false });
  });

  it('keeps the margin and the largest width within range and forgets the largest width for the next open', () => {
    const asked = openSettings(undefined, '', { kind: 'sheet', settings: { margin: 500, maxWidth: 99999 } });
    expect(asked).toMatchObject({ margin: 64, maxWidth: 16384 });
    expect(openSettings(asked, '', null)).toMatchObject({ margin: 64, maxWidth: 0 });
  });

  it('opens with the sheet kind chosen and the asked settings, and forgets them for the next open', () => {
    const asked = openSettings(undefined, '', { kind: 'sheet', settings: { sprites: 'sheet', sheetId: 'sht_x', pageSide: 99999 } });
    expect(asked).toMatchObject({ kind: 'sheet', frames: 'all', sprites: 'sheet', sheetId: 'sht_x', pageSide: 16384 });
    const next = openSettings(asked, '', null);
    expect(next).toMatchObject({ sprites: 'all', sheetId: '' });
    expect(openSettings(undefined, '', null).kind).toBe(DEFAULT_EXPORT_SETTINGS.kind);
  });

  const plan = (change: Partial<ExportSettings>) =>
    planExport({ frozen: { revision: 1, artwork: artwork() }, settings: { ...DEFAULT_EXPORT_SETTINGS, kind: 'sheet', frames: 'all', sprites: 'sheet', sheetId: sheet().id, ...change }, selectedIds: [] });

  it('exports the sprites of the sheet to one image and one file of data', () => {
    const planned = plan({ layout: 'grid', columns: 2 });
    expect(planned.problem).toBeNull();
    expect(planned.files.map((file) => file.name)).toHaveLength(2);
    expect(planned.spriteCount).toBe(5);
  });

  it('writes a power of two image, and several pages when asked', () => {
    const single = plan({ layout: 'grid', columns: 2, powerOfTwo: true });
    const made = single.files[0]?.make();
    if (made?.ok !== true || made.data.kind !== 'bytes') throw new Error('no image');
    const decoded = decodePng(made.data.bytes);
    if (!decoded.ok) throw new Error('bad image');
    expect([Math.log2(decoded.width) % 1, Math.log2(decoded.height) % 1]).toEqual([0, 0]);
    const paged = plan({ layout: 'grid', columns: 2, padding: 0, powerOfTwo: true, pageSide: 16 });
    expect(paged.problem).toBeNull();
    expect(paged.files.map((file) => file.name)).toEqual(expect.arrayContaining([expect.stringMatching(/_1\.png$/), expect.stringMatching(/_2\.json$/)]));
    expect(paged.files).toHaveLength(4);
  });

  it('says so when the sheet is gone or empty', () => {
    expect(plan({ sheetId: 'sht_missing' }).problem).toContain('no sprites');
  });
});
