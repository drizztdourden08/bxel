/* @layer renderer-app @kind test */
import type { MenuEntry, MenuItem } from '@drizztdourden08/brock-react';
import { describe, expect, it } from 'vitest';
import { fileMenu } from '../../src/files/file-menu';
import { recentMenuItem } from '../../src/files/recent-menu-item';
import { layerMenu } from '../../src/menu/layer-menu';
import type { EditorMenuState } from '../../src/menu/editor-menu.type';

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
  mode: 'sprite',
  tileMode: 'place',
};

const keysOf = (item: MenuEntry | undefined): string[] =>
  item === undefined || item === 'separator' ? [] : (item.children ?? []).map((child) => (child === 'separator' ? child : child.key));

describe('the file menu', () => {
  it('leads with New, Open, Open recent, Save, Save as, Save all and Export', () => {
    const [file] = fileMenu(recentMenuItem([], { open: () => undefined, clear: () => undefined }), 'Sprite settings...');
    expect(keysOf(file).slice(0, 7)).toEqual(['file-new', 'file-open', 'file-open-recent', 'file-save', 'file-save-as', 'file-save-all', 'file-export']);
  });

  it('puts the settings entry before the separator that keeps the less used sprite and import entries', () => {
    const [file] = fileMenu(recentMenuItem([], { open: () => undefined, clear: () => undefined }), 'Sprite settings...');
    expect(keysOf(file).slice(7)).toEqual(['file-settings', 'separator', 'file-new-sprite', 'file-import']);
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
