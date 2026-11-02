/* @layer renderer-app @kind test */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { describe, expect, it, vi } from 'vitest';
import { exportLabel } from '../../src/asset-list/export-label';
import { KIND_MENU } from '../../src/asset-list/kind-menu.constants';
import { entryItem } from '../../src/panel-browser/entry-item';
import type { BrowserItem, ItemKind } from '../../src/panel-browser/project-browser.type';
import { kindGroupEntries } from '../../src/views/ProjectPanel/behavior/kind-group-entries';
import { parentOf } from '../../src/workspace/parent-of';
import { ROOT, file, row } from './browser-fixture';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const shownCommands = (item: BrowserItem): readonly string[] =>
  kindGroupEntries(item).flatMap((entry: ContextMenuEntry) => (typeof entry === 'object' && 'command' in entry && entry.hidden !== true ? [entry.command] : []));

const itemOf = (path: string, rows: ReturnType<typeof row>[], kind?: ItemKind): BrowserItem => {
  const [only] = rows;
  if (only === undefined) throw new Error(`no row for ${path}`);
  const found = entryItem(file(path), parentOf(path), ROOT, only);
  return kind === undefined ? found : { ...found, kind };
};

describe('S2 the kind group of the Project widget menu', { tags: ['standard'] }, () => {
  it('offers a loaded tileset a new tilemap and a loaded sheet its sprites', () => {
    const tiles = `${ROOT}/tiles.bxtiles`;
    const sheet = `${ROOT}/sheets/all.bxsheet`;
    expect(shownCommands(itemOf(tiles, [row('tileset', tiles)]))).toEqual(['asset.new_tilemap_from']);
    expect(shownCommands(itemOf(sheet, [row('sheet', sheet)]))).toEqual(['asset.open_sprites']);
  });

  it('hides Apply to the open asset while no sprite is open', () => {
    const palette = `${ROOT}/palettes/main.bxpalette`;
    expect(shownCommands(itemOf(palette, [row('palette', palette)]))).toEqual([]);
  });

  it('gives a legacy file Split, a project file Unpack and Open in hub, and an image the import entries', () => {
    const legacy = `${ROOT}/old.bxel`;
    const packed = `${ROOT}/demo.bxproject`;
    const image = `${ROOT}/art.png`;
    expect(shownCommands(itemOf(legacy, [row('other', legacy, { loaded: false })], 'legacy'))).toEqual(['asset.split_legacy']);
    expect(shownCommands(itemOf(packed, [row('other', packed, { loaded: false })], 'project'))).toEqual(['asset.unpack_project', 'asset.open_in_hub']);
    expect(shownCommands(itemOf(image, [row('image', image, { loaded: false })]))).toEqual(['asset.import_as_sprite']);
  });

  it('names Export by what it exports', () => {
    expect(exportLabel(row('animation', `${ROOT}/a.bxanim`), 'Export...')).toBe(KIND_MENU.exportFrames);
    expect(exportLabel(row('sheet', `${ROOT}/a.bxsheet`), 'Export...')).toBe(KIND_MENU.exportSheet);
    expect(exportLabel(row('tilemap', `${ROOT}/a.bxmap`), 'Export...')).toBe(KIND_MENU.exportMap);
    expect(exportLabel(row('sprite', `${ROOT}/a.bxsprite`), 'Export...')).toBe('Export...');
    expect(exportLabel(null, 'Export...')).toBe('Export...');
  });
});
