/* @layer renderer-app @kind test */
import type { Artwork, DocumentId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { activeRects } from '../../src/image-import/active-rects';
import { colorsView } from '../../src/image-import/colors-view';
import { importContext } from '../../src/image-import/import-context';
import { importErrors } from '../../src/image-import/import-errors';
import { importNames } from '../../src/image-import/import-names';
import type { ImportContext, ImportRun, SourceImage } from '../../src/image-import/image-import.type';
import { initialImportForm } from '../../src/image-import/initial-import-form';
import { runImport } from '../../src/image-import/run-import';
import { NEW_MEMORY_DEFAULT } from '../../src/new-sprite/new-sprite.constants';
import { readTiledFiles } from '../../src/tiled-import/read-tiled-files';
import type { TiledImportData } from '../../src/tiled-import/tiled-import.type';
import { hostWithFile, newHost } from '../dialogs/dialog-harness';
import { files, stubFiles } from './tiled-rig';

const NONE: ImportContext = { documentId: null, bank: null, taken: [], sheetNames: [], tilesetNames: [], tilemapNames: [], spriteCount: 0 };

const readOk = async (store = files()): Promise<{ image: SourceImage; tiled: TiledImportData }> => {
  const read = await readTiledFiles(stubFiles(store), 'C:/maps/level.tmx');
  if (!read.ok) throw new Error(read.message);
  return read;
};

const runOf = (image: SourceImage, tiled: TiledImportData, context: ImportContext): ImportRun => {
  const form = { ...initialImportForm(image, context, NEW_MEMORY_DEFAULT, 'tiled'), reduce: 'extract' as const };
  const plan = colorsView(form, image, context).plan;
  if (!plan) throw new Error('no plan');
  const rects = activeRects(form, image);
  return { form, image, plan, rects, names: importNames(form, rects), context, tiled };
};

const artworkOf = (host: ReturnType<typeof newHost>, id: DocumentId): Artwork => {
  const view = host.view(id);
  if (!view) throw new Error('no document');
  return view.state.artwork;
};

describe('reading a Tiled map with its tileset and image', () => {
  it('follows the relative paths and builds a tile atlas', async () => {
    const { image, tiled } = await readOk();
    expect(tiled.plan).toMatchObject({ columns: 3, rows: 2, tileWidth: 4, tileHeight: 4 });
    expect(tiled.plan.tiles).toHaveLength(4);
    expect([image.width, image.height]).toEqual([16, 4]);
    expect(image.fileName).toBe('level.tmx');
    expect(tiled.plan.warnings.join(' ')).toContain('object or image layer');
  });

  it('says what is missing when the image cannot be read', async () => {
    const store = files();
    store.delete('C:/maps/tiles/img/ground.png');
    const read = await readTiledFiles(stubFiles(store), 'C:/maps/level.tmx');
    expect(read).toMatchObject({ ok: false });
    expect(read.ok ? '' : read.message).toContain('ground.png');
  });

  it('refuses a map that is not orthogonal', async () => {
    const store = files(files().get('C:/maps/level.tmx')?.toString().replace('orthogonal', 'isometric'));
    const read = await readTiledFiles(stubFiles(store), 'C:/maps/level.tmx');
    expect(read.ok).toBe(false);
  });
});

const importedNew = async (): Promise<{ host: ReturnType<typeof newHost>; id: DocumentId; artwork: Artwork }> => {
  const { image, tiled } = await readOk();
  const host = newHost();
  const outcome = runImport(host, runOf(image, tiled, NONE));
  if (!outcome.ok) throw new Error(outcome.message);
  return { host, id: outcome.documentId, artwork: artworkOf(host, outcome.documentId) };
};

describe('importing the map', () => {
  it('creates the tileset with one keyed tile per Tiled tile', async () => {
    const { artwork } = await importedNew();
    expect(artwork.tilesets[0]).toMatchObject({ name: 'ground', tileWidth: 4, tileHeight: 4 });
    expect(artwork.tilesets[0]?.tiles.map((tile) => tile.key)).toEqual([1, 2, 3, 4]);
    expect(artwork.banks[0]?.slots.length).toBeGreaterThan(4);
  });

  it('creates the tilemap with the layers, visibility, cells and flip flags', async () => {
    const map = (await importedNew()).artwork.tilemaps[0];
    expect(map).toMatchObject({ name: 'level', columns: 3, rows: 2 });
    expect(map?.layers.map((layer) => [layer.name, layer.visible])).toEqual([
      ['Ground', true],
      ['Top', false],
    ]);
    expect(Array.from(map?.layers[0]?.cells ?? [])).toEqual([1, 2, 3, 4, 1, 2]);
    expect(map?.layers[1]?.cells[4]).toBe(0x80000004);
  });

  it('is one undo step', async () => {
    const { host, id } = await importedNew();
    const before = host.view(id)?.state.revision ?? 0;
    expect(host.undo(id).ok).toBe(true);
    expect(artworkOf(host, id).tilemaps).toHaveLength(0);
    expect(artworkOf(host, id).tilesets).toHaveLength(0);
    expect(host.view(id)?.state.revision).toBe(before + 1);
  });

  it('keeps every tile pixel on a palette index of the extracted palette', async () => {
    const { artwork } = await importedNew();
    const tileSprites = artwork.sprites.filter((sprite) => sprite.role === 'tile');
    const first = tileSprites.map((sprite) => Object.values(sprite.cels)[0]?.pixels[0] ?? 0);
    expect(new Set(first).size).toBe(4);
    expect(first.every((index) => index > 0)).toBe(true);
  });

  it('imports into an open file and a repeat gets free names', async () => {
    const { image, tiled } = await readOk();
    const { host, documentId } = hostWithFile();
    const context = importContext(host.view(documentId));
    const run = runOf(image, tiled, context);
    expect(run.form.target).toBe('file');
    expect(runImport(host, run).ok).toBe(true);
    const again = importContext(host.view(documentId));
    const second = runOf(image, tiled, again);
    expect(importErrors({ form: second.form, image, context: again, rects: second.rects, names: second.names }).name).toBeNull();
    expect(second.form.name).toBe('level_2');
    expect(runImport(host, second).ok).toBe(true);
    const artwork = artworkOf(host, documentId);
    expect(artwork.tilesets.map((tileset) => tileset.name)).toEqual(['ground', 'ground 2']);
    expect(artwork.tilemaps.map((tilemap) => tilemap.name)).toEqual(['level', 'level_2']);
  });
});
