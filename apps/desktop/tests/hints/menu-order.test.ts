/* @layer renderer-app @kind test */
import type { MenuEntry, MenuItem } from '@drizztdourden08/brock-react';
import { describe, expect, it } from 'vitest';
import { fileMenu } from '../../src/files/file-menu';
import { recentMenuItem } from '../../src/files/recent-menu-item';
import { editorMenu } from '../../src/menu/editor-menu';
import type { EditorMenuState } from '../../src/menu/editor-menu.type';
import { layerMenu } from '../../src/menu/layer-menu';
import { COLUMN_NAMES, columnContext } from '../ui-context/columns';
import type { Column } from '../ui-context/columns';

const stateOf = (column: Column, given: Partial<EditorMenuState> = {}): EditorMenuState => ({
  context: columnContext(column, { canUndo: true, canRedo: true }),
  grid: true,
  gridMajor: false,
  gridTile: false,
  guides: true,
  rulers: false,
  snap: false,
  tiled: 'off',
  symmetryX: false,
  symmetryY: false,
  settings: 'Settings...',
  collision: false,
  terrainBrush: false,
  animateTiles: false,
  ...given,
});

const recent = recentMenuItem([], { open: () => undefined, clear: () => undefined });

const keysOf = (item: MenuEntry | undefined): string[] =>
  item === undefined || item === 'separator' ? [] : (item.children ?? []).map((child) => (child === 'separator' ? child : child.key));

const topLabels = (column: Column): string[] => editorMenu(stateOf(column)).map((entry) => (entry === 'separator' ? entry : entry.label));

const childLabels = (entries: readonly MenuEntry[], label: string): string[] => {
  const found = entries.find((entry): entry is MenuItem => entry !== 'separator' && entry.label === label);
  return (found?.children ?? []).map((child) => (child === 'separator' ? child : child.label));
};

describe('the file menu', () => {
  it('leads with New, Open and Open recent, then Save, Save as and Save all, then Export and Import', () => {
    const [file] = fileMenu(recent, columnContext('Sp'));
    expect(keysOf(file)).toEqual([
      'file-new', 'file-open', 'file-open-recent', 'separator', 'file-save', 'file-save-as', 'file-save-all', 'separator', 'file-export', 'file-import',
    ]);
  });

  it('keeps Save and Save as at the top level beside File', () => {
    const entries = fileMenu(recent, columnContext('Sp'));
    expect(entries.map((entry) => (entry === 'separator' ? entry : entry.label))).toEqual(['File', 'Save', 'Save as...']);
  });

  it('keeps the settings entry out of the file menu', () => {
    const [file] = fileMenu(recent, columnContext('Sp'));
    expect(keysOf(file)).not.toContain('file-settings');
  });

  it('dims Save, Save as and Save all with nothing open and says why', () => {
    const [file] = fileMenu(recent, columnContext('N'));
    const save = (file !== 'separator' ? file?.children : [])?.find((child): child is MenuItem => child !== 'separator' && child.key === 'file-save');
    expect(save).toMatchObject({ disabled: true, description: 'Open or create an asset first.' });
  });

  it('dims Save on a read only file and keeps Save as live', () => {
    const [file] = fileMenu(recent, columnContext('Ro'));
    const items = (file !== 'separator' ? file?.children : []) ?? [];
    const byKey = (key: string) => items.find((child): child is MenuItem => child !== 'separator' && child.key === key);
    expect(byKey('file-save')).toMatchObject({ disabled: true });
    expect(byKey('file-save-as')?.disabled).not.toBe(true);
  });

  it('hides Export on an image preview', () => {
    const [file] = fileMenu(recent, columnContext('Im'));
    expect(keysOf(file)).not.toContain('file-export');
  });
});

describe('the menus of the open file', () => {
  it('puts Edit, the menu of the open file and View in that order', () => {
    expect(topLabels('Sp')).toEqual(['Edit', 'Sprite', 'View']);
    expect(topLabels('An')).toEqual(['Edit', 'Animation', 'View']);
    expect(topLabels('Sh')).toEqual(['Edit', 'Sheet', 'View']);
    expect(topLabels('Si')).toEqual(['Edit', 'Sheet', 'View']);
    expect(topLabels('Ts')).toEqual(['Edit', 'Tileset', 'View']);
    expect(topLabels('Tm')).toEqual(['Edit', 'Tilemap', 'View']);
    expect(topLabels('Te')).toEqual(['Edit', 'Tilemap', 'View']);
    expect(topLabels('Im')).toEqual(['Edit', 'Image', 'View']);
  });

  it('keeps Edit and View with a palette open but hides the View menu, which has nothing to show', () => {
    expect(topLabels('Pa')).toEqual(['Edit', 'Palette']);
  });

  it('shows no kind menu when nothing is open and keeps Edit and a disabled View', () => {
    expect(topLabels('N')).toEqual(['Edit', 'View']);
    expect(childLabels(editorMenu(stateOf('N')), 'View')).toEqual(['Zoom']);
  });

  it('holds the layer and palette menus for sprites, animations and tiles but not sheets or maps', () => {
    for (const column of ['Sp', 'An', 'Ts', 'Te', 'Si'] as const) {
      const labels = editorMenu(stateOf(column)).flatMap((entry) => (entry === 'separator' ? [] : childLabels([entry], entry.label)));
      expect(labels).toEqual(expect.arrayContaining(['Layer', 'Palette']));
    }
    expect(childLabels(editorMenu(stateOf('Sh')), 'Sheet')).not.toContain('Layer');
    expect(childLabels(editorMenu(stateOf('Tm')), 'Tilemap')).not.toContain('Palette');
    expect(childLabels(editorMenu(stateOf('Tm')), 'Tilemap')).toContain('Map layer');
  });

  it('keeps the old Duplicate frame entry out of every menu', () => {
    for (const column of COLUMN_NAMES) {
      const labels = editorMenu(stateOf(column)).flatMap((entry) => (entry === 'separator' ? [] : childLabels([entry], entry.label)));
      expect(labels).not.toContain('Duplicate frame');
    }
  });

  it('offers frames and tags in the Animation menu only', () => {
    expect(childLabels(editorMenu(stateOf('An')), 'Animation')).toEqual(expect.arrayContaining(['Add frame', 'Duplicate frames']));
    expect(childLabels(editorMenu(stateOf('Sp')), 'Sprite')).not.toContain('Add frame');
  });

  it('offers Make an animation in the Sprite menu and the sheet menu entries on a sheet', () => {
    expect(childLabels(editorMenu(stateOf('Sp')), 'Sprite')).toContain('Make an animation...');
    expect(childLabels(editorMenu(stateOf('Sh')), 'Sheet')).toContain('Isolate sprite');
  });

  it('shows Place Tile and Edit Tile for a tilemap only and the tile entries for a tileset', () => {
    expect(childLabels(editorMenu(stateOf('Tm')), 'Tilemap')).toEqual(expect.arrayContaining(['Place Tile', 'Edit Tile']));
    expect(childLabels(editorMenu(stateOf('Ts')), 'Tileset')).not.toContain('Place Tile');
    expect(childLabels(editorMenu(stateOf('Ts')), 'Tileset')).toEqual(expect.arrayContaining(['New tileset...', 'Add tile']));
  });

  it('shows the sprite tools of an isolated sprite inside the Sheet menu', () => {
    const isolated = editorMenu(stateOf('Si'));
    expect(childLabels(isolated, 'Sheet')).toEqual(expect.arrayContaining(['Back to sheet', 'Layer', 'Palette']));
    expect(childLabels(isolated, 'Sheet')).not.toContain('Isolate sprite');
  });

  it('offers no mode entry in any menu', () => {
    for (const column of COLUMN_NAMES) {
      const labels = editorMenu(stateOf(column)).flatMap((entry) => (entry === 'separator' ? [] : childLabels([entry], entry.label)));
      expect(labels.filter((label) => /mode$/i.test(label))).toEqual([]);
    }
  });
});

describe('the Edit menu', () => {
  it('keeps the platform set disabled with a reason when nothing is open and hides the type sections', () => {
    const edit = editorMenu(stateOf('N', { context: columnContext('N') }))[0];
    const items = edit !== undefined && edit !== 'separator' ? (edit.children ?? []) : [];
    const labels = items.flatMap((item) => (item === 'separator' ? [] : [item.label]));
    expect(labels).toEqual(['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Delete', 'Select all', 'Deselect']);
    for (const item of items) if (item !== 'separator') expect(item).toMatchObject({ disabled: true });
  });

  it('hides Cut, Copy and Paste on a map and keeps Delete for the cells', () => {
    const edit = editorMenu(stateOf('Tm'))[0];
    const labels = edit !== undefined && edit !== 'separator' ? (edit.children ?? []).flatMap((item) => (item === 'separator' ? [] : [item.label])) : [];
    expect(labels).not.toContain('Cut');
    expect(labels).toContain('Delete');
    expect(labels).toContain('Select all');
  });

  it('hides the whole selection and transform group on a palette, a sheet and an image', () => {
    for (const column of ['Pa', 'Sh', 'Im'] as const) {
      const edit = editorMenu(stateOf(column))[0];
      const labels = edit !== undefined && edit !== 'separator' ? (edit.children ?? []).flatMap((item) => (item === 'separator' ? [] : [item.label])) : [];
      expect(labels).toEqual(['Undo', 'Redo']);
    }
  });
});

describe('the tilemap menu overlays', () => {
  it('puts Animate tiles after Show collision and Terrain brush and reflects its state', () => {
    const labels = childLabels(editorMenu(stateOf('Tm')), 'Tilemap');
    expect(labels.slice(labels.indexOf('Show collision'), labels.indexOf('Show collision') + 3)).toEqual(['Show collision', 'Terrain brush', 'Animate tiles']);
    const tilemap = editorMenu(stateOf('Tm', { animateTiles: true })).find((entry): entry is MenuItem => entry !== 'separator' && entry.label === 'Tilemap');
    const animate = (tilemap?.children ?? []).find((child): child is MenuItem => child !== 'separator' && child.label === 'Animate tiles');
    expect(animate?.command).toBe('animation.toggle_tiles');
    expect(animate?.checked).toBe(true);
  });
});

describe('the view menu', () => {
  it('lists only what the open file can use', () => {
    expect(childLabels(editorMenu(stateOf('Sh')), 'View')).toEqual(['Zoom', 'Rulers', 'Guides', 'Snap']);
    expect(childLabels(editorMenu(stateOf('Tm')), 'View')).toEqual(['Zoom', 'Grid', 'Rulers', 'Guides', 'Snap']);
    expect(childLabels(editorMenu(stateOf('Sp')), 'View')).toEqual(['Zoom', 'Grid', 'Rulers', 'Guides', 'Snap', 'Symmetry', 'Tiled preview']);
    expect(childLabels(editorMenu(stateOf('Im')), 'View')).toEqual(['Zoom', 'Grid']);
  });
});

describe('the layer menu', () => {
  it('puts add, duplicate and delete before the rarer merge and flatten', () => {
    const menu: MenuItem = layerMenu(stateOf('Sp'));
    const commands = (menu.children ?? []).map((child) => (child === 'separator' ? child : child.command));
    expect(commands.slice(0, 3)).toEqual(['layer.add', 'layer.duplicate', 'layer.delete']);
    expect(commands.slice(3)).toEqual(['separator', 'layer.merge', 'layer.flatten', 'separator', 'layer.select_above', 'layer.select_below']);
  });
});
