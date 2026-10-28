/* @layer renderer-app @kind test */
import { commands, defineContextMenu, listContextMenus } from '@drizztdourden08/brock-react';
import type { ContextMenuContext, ListedContextMenu } from '@drizztdourden08/brock-react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { spriteLayerActions } from '../../src/editor/layer-actions';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';
import { LAYER_RENAME_KEY, PROJECT_RENAME_KEY, PROJECT_TRASH_KEY, SPRITE_SELECT_ALL_KEY } from '../../src/keymap/zone-key.constants';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { tabMenuEntries } from '../../src/views/AssetTabs/behavior/tab-menu-entries';
import { rulerMenuEntries } from '../../src/views/CanvasRuler/behavior/ruler-menu-entries';
import { canvasMenuEntries } from '../../src/views/EditorCanvas/behavior/canvas-menu-entries';
import { statusMenuEntries } from '../../src/views/EditorStatus/behavior/status-menu-entries';
import { layerMenuEntries } from '../../src/views/LayerStack/behavior/layer-menu-entries';
import type { LayerRowModel, LayerStackModel } from '../../src/views/LayerStack/LayerStack.type';
import { paletteMenuEntries } from '../../src/views/PalettePanel/behavior/palette-menu-entries';
import { sheetMenuEntries } from '../../src/views/SheetCanvas/behavior/sheet-menu-entries';
import { spriteMenuEntries } from '../../src/views/SpritesPanel/behavior/sprite-menu-entries';
import { tileMenuEntries } from '../../src/views/TilesetPanel/behavior/tile-menu-entries';

const PANEL_KEYS = [LAYER_RENAME_KEY, PROJECT_RENAME_KEY, PROJECT_TRASH_KEY, SPRITE_SELECT_ALL_KEY];

const row = (id: string): LayerRowModel => ({ id, name: id, visible: true, mixedVisible: false, lock: 'none', mixedLock: false, colour: null, note: null, thumb: null });

const stackOf = (kind: LayerStackModel['kind']): LayerStackModel => ({
  kind,
  owner: 'test',
  ownerMeta: null,
  empty: null,
  rows: [row('top'), row('bottom')],
  activeId: 'top',
  locks: kind === 'map' ? ['none', 'pixels'] : ['none', 'transparency', 'pixels'],
  maps: [],
  mapId: null,
  onMap: () => undefined,
  frames: 0,
  actions: spriteLayerActions,
});

const NO_ELEMENTS: readonly Element[] = [];

class FakeElement {}

const MENUS: readonly [string, (context: ContextMenuContext) => ReturnType<typeof tabMenuEntries>][] = [
  ['test.tab', tabMenuEntries],
  ['test.ruler.x', (context) => rulerMenuEntries({ ...context, data: { axis: 'x' } })],
  ['test.ruler.y', (context) => rulerMenuEntries({ ...context, data: { axis: 'y' } })],
  ['test.canvas', (context) => canvasMenuEntries(context, null)],
  ['test.status', statusMenuEntries],
  ['test.layers', () => layerMenuEntries(stackOf('sprite'), 'top')],
  ['test.map-layers', () => layerMenuEntries(stackOf('map'), 'top')],
  ['test.palette', paletteMenuEntries],
  ['test.sheet', (context) => sheetMenuEntries(context, null, [])],
  ['test.sprites', spriteMenuEntries],
  ['test.tiles', tileMenuEntries],
];

const missingOf = (menu: ListedContextMenu): string[] => menu.missing.map((id) => `${menu.zone}: ${id}`);

describe('the context menus of the app', () => {
  let drop: (() => void) | null = null;

  beforeAll(() => {
    vi.stubGlobal('document', { querySelectorAll: () => NO_ELEMENTS, querySelector: () => null, body: {} });
    vi.stubGlobal('Element', FakeElement);
    createDefaultArtwork(useDocumentStore.getState().host);
    const panelKeys = PANEL_KEYS.map((key) => ({ id: key.id, label: key.label, group: key.group, run: () => undefined }));
    drop = commands.register([...APP_COMMANDS, ...panelKeys]);
    for (const [zone, entries] of MENUS) defineContextMenu(zone, { entries });
  });

  afterAll(() => {
    drop?.();
    vi.unstubAllGlobals();
  });

  it('lists every menu it defines, unmounted, with entries to show', () => {
    const listed = listContextMenus().filter((menu) => menu.zone.startsWith('test.'));
    expect(listed.map((menu) => menu.zone).sort()).toEqual(MENUS.map(([zone]) => zone).sort());
    for (const menu of listed) {
      expect(menu.mounted).toBe(false);
      expect(menu.commands.length, menu.zone).toBeGreaterThan(0);
    }
  });

  it('names only commands that exist', () => {
    const missing = listContextMenus().flatMap((menu) => (menu.zone.startsWith('test.') ? missingOf(menu) : []));
    expect(missing).toEqual([]);
  });
});
