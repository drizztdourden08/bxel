/* @layer renderer-app @kind test */
import type { MenuEntry, MenuItem } from '@drizztdourden08/brock-react';
import { describe, expect, it } from 'vitest';
import { fileMenu } from '../../src/files/file-menu';
import { recentMenuItem } from '../../src/files/recent-menu-item';
import { editorMenu } from '../../src/menu/editor-menu';
import type { EditorMenuState } from '../../src/menu/editor-menu.type';
import { layerMenu } from '../../src/menu/layer-menu';
import type { Surface } from '../../src/surface/surface.type';

const state: EditorMenuState = {
  hasDocument: true,
  canUndo: true,
  canRedo: true,
  grid: true,
  gridMajor: false,
  gridTile: false,
  rulers: false,
  tiled: 'off',
  symmetryX: false,
  symmetryY: false,
  surface: 'sprite',
  kind: 'sprite',
  isolated: false,
  settings: 'Sprite settings...',
  tileMode: 'place',
  collision: false,
  terrainBrush: false,
};

const keysOf = (item: MenuEntry | undefined): string[] =>
  item === undefined || item === 'separator' ? [] : (item.children ?? []).map((child) => (child === 'separator' ? child : child.key));

const topLabels = (given: Partial<EditorMenuState>): string[] =>
  editorMenu({ ...state, ...given }).map((entry) => (entry === 'separator' ? entry : entry.label));

const childLabels = (entries: readonly MenuEntry[], label: string): string[] => {
  const found = entries.find((entry): entry is MenuItem => entry !== 'separator' && entry.label === label);
  return (found?.children ?? []).map((child) => (child === 'separator' ? child : child.label));
};

describe('the file menu', () => {
  it('leads with New, Open and Open recent, then Save, Save as and Save all, then Export and Import', () => {
    const [file] = fileMenu(recentMenuItem([], { open: () => undefined, clear: () => undefined }));
    expect(keysOf(file)).toEqual([
      'file-new', 'file-open', 'file-open-recent', 'separator', 'file-save', 'file-save-as', 'file-save-all', 'separator', 'file-export', 'file-import',
    ]);
  });

  it('keeps the settings entry out of the file menu', () => {
    const [file] = fileMenu(recentMenuItem([], { open: () => undefined, clear: () => undefined }));
    expect(keysOf(file)).not.toContain('file-settings');
  });
});

describe('the menus of the open asset', () => {
  it('puts Edit, the menu of the open asset and View in that order', () => {
    expect(topLabels({})).toEqual(['Edit', 'Sprite', 'View']);
    expect(topLabels({ surface: 'sheet', kind: 'sheet' })).toEqual(['Edit', 'Sheet', 'View']);
    expect(topLabels({ surface: 'map', kind: 'tilemap' })).toEqual(['Edit', 'Tilemap', 'View']);
    expect(topLabels({ kind: 'palette' })).toEqual(['Edit', 'Palette', 'View']);
  });

  it('shows no menu of an asset when nothing is open', () => {
    expect(topLabels({ hasDocument: false, surface: 'none', kind: null })).toEqual(['Edit', 'View']);
  });

  it('holds the layer and palette menus only for a sprite', () => {
    const sprite = editorMenu(state);
    expect(childLabels(sprite, 'Sprite')).toEqual(['Layer', 'Palette', 'Duplicate frame', 'separator', 'Sprite settings...']);
    const sheet = editorMenu({ ...state, surface: 'sheet', kind: 'sheet', settings: 'Sheet settings...' });
    expect(childLabels(sheet, 'Sheet')).not.toContain('Layer');
    expect(childLabels(sheet, 'Sheet')).toContain('Isolate sprite');
    const map = editorMenu({ ...state, surface: 'map', kind: 'tilemap', settings: 'Tilemap settings...' });
    expect(childLabels(map, 'Tilemap')).not.toContain('Palette');
    expect(childLabels(map, 'Tilemap')).toContain('Place Tile');
  });

  it('shows the sprite tools of the tile and of an isolated sprite inside their asset menu', () => {
    const tile = editorMenu({ ...state, surface: 'tile', kind: 'tileset' });
    expect(childLabels(tile, 'Tilemap')).toEqual(expect.arrayContaining(['Edit Tile', 'Layer', 'Palette']));
    const isolated = editorMenu({ ...state, isolated: true, kind: 'sheet' });
    expect(childLabels(isolated, 'Sheet')).toEqual(expect.arrayContaining(['Back to sheet', 'Layer', 'Palette']));
    expect(childLabels(isolated, 'Sheet')).not.toContain('Isolate sprite');
  });

  it('offers no mode entry in any asset menu', () => {
    const surfaces: readonly Surface[] = ['sprite', 'sheet', 'map', 'tile'];
    for (const surface of surfaces) {
      const labels = editorMenu({ ...state, surface }).flatMap((entry) => (entry === 'separator' ? [] : childLabels([entry], entry.label)));
      expect(labels.filter((label) => /mode$/i.test(label))).toEqual([]);
    }
  });
});

describe('the view menu', () => {
  it('lists only what the open asset can use', () => {
    expect(childLabels(editorMenu({ ...state, surface: 'sheet', kind: 'sheet' }), 'View')).toEqual(['Zoom']);
    expect(childLabels(editorMenu({ ...state, surface: 'map', kind: 'tilemap' }), 'View')).toEqual(['Zoom', 'Grid', 'Rulers']);
    expect(childLabels(editorMenu(state), 'View')).toEqual(['Zoom', 'Grid', 'Rulers', 'Symmetry', 'Tiled preview']);
  });
});

describe('the layer menu', () => {
  it('puts add, duplicate and delete before the rarer merge and flatten', () => {
    const menu: MenuItem = layerMenu(state);
    const commands = (menu.children ?? []).map((child) => (child === 'separator' ? child : child.command));
    expect(commands.slice(0, 3)).toEqual(['layer.add', 'layer.duplicate', 'layer.delete']);
    expect(commands.slice(3)).toEqual(['separator', 'layer.merge', 'layer.flatten', 'separator', 'layer.select_above', 'layer.select_below']);
  });
});
