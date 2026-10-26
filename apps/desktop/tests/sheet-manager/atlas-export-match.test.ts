/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { decodePng, readBxelSheetJson } from '@bxel/formats';
import type { SheetMetadata } from '@bxel/formats';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_EXPORT_SETTINGS } from '../../src/export/export.constants';
import { planExport } from '../../src/export/plan-export';
import { addToSheet } from '../../src/sheet-manager/add-to-sheet';
import { atlasExportSettings } from '../../src/sheet-manager/atlas-export-settings';
import { atlasModel } from '../../src/sheet-manager/atlas-model';
import { resizeSprites } from '../../src/sheet-manager/resize-sprites';
import { styleSheet } from '../../src/sheet-manager/style-sheet';
import { runDocument } from '../../src/sheet/run-document';
import { spritesTarget } from '../../src/sheet/sprites-target';
import { artwork, openFile, patch } from '../sheet/sheet-harness';
import { idsOf, PLAIN_ATLAS } from './manager-harness';

vi.mock('../../src/documents/document-host.constants', async () => (await import('../legacy/legacy-app-commands')).legacyAppCommands());

type Pack = typeof PLAIN_ATLAS & { extrude: number };

const sheet = () => {
  const found = artwork().sheets[0];
  if (!found) throw new Error('no sheet');
  return found;
};

const exported = (pack: Pack): { metadata: SheetMetadata; width: number; height: number }[] => {
  const settings = { ...DEFAULT_EXPORT_SETTINGS, ...atlasExportSettings(sheet(), pack) };
  const planned = planExport({ frozen: { revision: 1, artwork: artwork() }, settings, selectedIds: [] });
  if (planned.problem !== null) throw new Error(planned.problem);
  const images = planned.files.filter((file) => file.name.endsWith('.png'));
  const texts = planned.files.filter((file) => file.name.endsWith('.json'));
  return images.map((image, at) => {
    const made = image.make();
    const json = texts[at]?.make();
    if (made.ok !== true || made.data.kind !== 'bytes' || json?.ok !== true || json.data.kind !== 'text') throw new Error('no files');
    const png = decodePng(made.data.bytes);
    const read = readBxelSheetJson(json.data.text);
    if (!png.ok || !read.ok) throw new Error('unreadable files');
    return { metadata: read.metadata, width: png.width, height: png.height };
  });
};

const boxesOf = (metadata: SheetMetadata) =>
  metadata.sprites.flatMap((sprite) => sprite.frames.map((frame, at) => ({ key: `${sprite.name}#${at}`, box: frame.box, rotated: frame.rotated })));

const previewed = (pack: Pack, page: number) => {
  const atlas = atlasModel({ sheet: sheet(), artwork: artwork(), ...pack, page });
  const items = atlas.items.map((item) => ({
    key: `${item.name}#${item.frame}`,
    box: { x: item.x, y: item.y, width: item.width, height: item.height },
    rotated: item.rotated,
  }));
  return { atlas, items };
};

const expectSame = (pack: Pack): number => {
  const pages = exported(pack);
  expect(previewed(pack, 0).atlas.pageCount).toBe(pages.length);
  for (const [page, file] of pages.entries()) {
    const { atlas, items } = previewed(pack, page);
    expect([atlas.width, atlas.height]).toEqual([file.width, file.height]);
    expect(items).toEqual(boxesOf(file.metadata));
  }
  return pages.length;
};

const PACK: Pack = { ...PLAIN_ATLAS, extrude: 0 };

beforeEach(() => {
  openFile(['a', 'b', 'c', 'd', 'e'], 8);
  patch('a', { x: 2, y: 3, width: 2, height: 1 }, 1);
  patch('c', { x: 1, y: 1, width: 5, height: 3 }, 1);
  runDocument('Add frames', [
    { name: COMMAND_NAME.frameAdd, targets: spritesTarget(idsOf('c', 'd')), options: {} },
    { name: COMMAND_NAME.frameAdd, targets: spritesTarget(idsOf('d')), options: {} },
  ]);
  addToSheet(idsOf('a', 'b', 'c', 'd', 'e'), null);
});

describe('the atlas preview and the export of the same sheet', () => {
  it('lay out every frame of every sprite the same way on a grid', () => {
    styleSheet(sheet().id, { layout: 'grid', columns: 3 });
    expect(expectSame(PACK)).toBe(1);
    const atlas = previewed(PACK, 0).atlas;
    expect(atlas.items).toHaveLength(8);
  });

  it('agree on the margin, the spacing, the edge copy, the trim and the power of two size', () => {
    styleSheet(sheet().id, { layout: 'packed', maxWidth: 40, spacing: 2, margin: 3 });
    expectSame({ ...PACK, extrude: 1, trim: true, powerOfTwo: true });
    const first = previewed({ ...PACK, extrude: 1, trim: true }, 0).items[0];
    expect(first?.box.x).toBeGreaterThanOrEqual(4);
    expect(first?.box.y).toBeGreaterThanOrEqual(4);
  });

  it('agree on a packed width the export used to choose for itself', () => {
    styleSheet(sheet().id, { layout: 'packed', maxWidth: 16 });
    expectSame(PACK);
    expect(previewed(PACK, 0).atlas.width).toBeLessThanOrEqual(16);
  });

  it('agree on the pages', () => {
    styleSheet(sheet().id, { layout: 'grid', columns: 2, spacing: 0 });
    expect(expectSame({ ...PACK, pageSide: 16 })).toBeGreaterThan(1);
  });

  it('agree on the sprites that are turned', () => {
    resizeSprites(idsOf('b'), { width: 4, height: 20, anchor: 'top-left' });
    resizeSprites(idsOf('e'), { width: 20, height: 4, anchor: 'top-left' });
    styleSheet(sheet().id, { layout: 'packed', maxWidth: 24, spacing: 0 });
    const plain = previewed(PACK, 0).atlas;
    expect(plain.items.some((item) => item.rotated)).toBe(false);
    expectSame({ ...PACK, rotate: true });
    const turned = previewed({ ...PACK, rotate: true }, 0).atlas;
    expect(turned.items.some((item) => item.rotated)).toBe(true);
    expect(turned.width * turned.height).toBeLessThan(plain.width * plain.height);
  });

  it('never turns a sprite on a grid or when rotation is off', () => {
    resizeSprites(idsOf('b'), { width: 4, height: 20, anchor: 'top-left' });
    styleSheet(sheet().id, { layout: 'grid', columns: 2 });
    expect(previewed({ ...PACK, rotate: true }, 0).items.every((item) => !item.rotated)).toBe(true);
    styleSheet(sheet().id, { layout: 'packed', maxWidth: 24 });
    expect(previewed(PACK, 0).items.every((item) => !item.rotated)).toBe(true);
  });
});

describe('a sheet that places an animation', () => {
  it('keeps every sprite where the export puts it, whatever the layout does with the animation entry', () => {
    runDocument('Build', [
      { name: COMMAND_NAME.animationCreate, targets: null, options: { name: 'walk', source: { kind: 'sprites', sprites: idsOf('a', 'b') } }, ref: 'anim' },
      { name: COMMAND_NAME.sheetAnimationAdd, targets: null, options: { sheet: sheet().id, animation: { ref: 'anim' } } },
    ]);
    styleSheet(sheet().id, { layout: 'grid', columns: 3 });
    const file = exported(PACK)[0];
    if (!file) throw new Error('no export');
    const { atlas, items } = previewed(PACK, 0);
    expect(items).toEqual(boxesOf(file.metadata).filter((each) => !each.key.startsWith('walk#')));
    expect(atlas.animations).toHaveLength(1);
    expect(sheet().animationEntries?.[0]?.at).toEqual({ x: 0, y: 16 });
  });
});
