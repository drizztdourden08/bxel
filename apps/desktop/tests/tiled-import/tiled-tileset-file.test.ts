/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { activeRects } from '../../src/image-import/active-rects';
import type { ImportContext } from '../../src/image-import/image-import.type';
import { initialImportForm } from '../../src/image-import/initial-import-form';
import { NEW_MEMORY_DEFAULT } from '../../src/new-sprite/new-sprite.constants';
import { readTiledTilesetFile } from '../../src/tiled-import/read-tiled-tileset-file';
import { TILESET_FILE } from '../../src/tiled-import/tiled-import.constants';
import { files, stubFiles } from './tiled-rig';

const NONE: ImportContext = { documentId: null, bank: null, taken: [], animationNames: [], sheetNames: [], tilemapNames: [], tilesetNames: [], spriteCount: 0 };

describe('W10 importing a Tiled tileset on its own', { tags: ['standard'] }, () => {
  it('knows a tileset file by its ending', () => {
    expect(TILESET_FILE.test('C:/maps/tiles/ground.tsx')).toBe(true);
    expect(TILESET_FILE.test('C:/maps/tiles/ground.TSJ')).toBe(true);
    expect(TILESET_FILE.test('C:/maps/level.tmx')).toBe(false);
  });

  it('reads the picture of the tileset and carries its tile grid', async () => {
    const read = await readTiledTilesetFile(stubFiles(files()), 'C:/maps/tiles/ground.tsx');
    if (!read.ok) throw new Error(read.message);
    expect(read.tiled).toBeNull();
    expect([read.image.width, read.image.height]).toEqual([8, 8]);
    expect(read.image.fileName).toBe('ground.tsx');
    expect(read.image.grid).toMatchObject({ cellWidth: 4, cellHeight: 4, offsetX: 0, spacingX: 0 });
  });

  it('opens the tileset wizard on that grid, so the tiles slice as the tileset describes them', async () => {
    const read = await readTiledTilesetFile(stubFiles(files()), 'C:/maps/tiles/ground.tsx');
    if (!read.ok) throw new Error(read.message);
    const form = initialImportForm(read.image, NONE, NEW_MEMORY_DEFAULT, 'tileset');
    expect(form.slice).toMatchObject({ cellWidth: 4, cellHeight: 4 });
    expect(activeRects(form, read.image)).toHaveLength(4);
  });

  it('names the tileset file when its picture cannot be read', async () => {
    const store = files();
    store.delete('C:/maps/tiles/img/ground.png');
    const read = await readTiledTilesetFile(stubFiles(store), 'C:/maps/tiles/ground.tsx');
    expect(read.ok).toBe(false);
    expect(read.ok ? '' : read.message).toContain('ground.png');
  });
});
