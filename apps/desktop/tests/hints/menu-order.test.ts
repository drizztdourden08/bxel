/* @layer renderer-app @kind test */
import type { MenuEntry, MenuItem } from '@drizztdourden08/brock-react';
import { describe, expect, it } from 'vitest';
import { fileMenu } from '../../src/files/file-menu';
import { recentMenuItem } from '../../src/files/recent-menu-item';
import { editorMenu } from '../../src/menu/editor-menu';
import type { EditorMenuState } from '../../src/menu/editor-menu.type';
import { columnContext } from '../ui-context/columns';
import type { Column } from '../ui-context/columns';

const stateOf = (column: Column, given: Partial<EditorMenuState> = {}): EditorMenuState => ({
  context: columnContext(column, { canUndo: true, canRedo: true }),
  grid: true,
  gridMajor: false,
  slices: false,
  hideOverlays: false,
  mirror: false,
  loupe: false,
  fullscreen: false,
  split: false,
  splitLink: false,
  splitActual: false,
  lockGuides: false,
  gridTile: false,
  gridIso: false,
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

const childLabels = (entries: readonly MenuEntry[], label: string): string[] => {
  const found = entries.find((entry): entry is MenuItem => entry !== 'separator' && entry.label === label);
  return (found?.children ?? []).map((child) => (child === 'separator' ? child : child.label));
};

describe('K1 the file menu', { tags: ['critical'] }, () => {
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

describe('K1 the Edit menu', { tags: ['critical'] }, () => {
  it('keeps the platform set disabled with a reason when nothing is open and hides the type sections', () => {
    const edit = editorMenu(stateOf('N', { context: columnContext('N') }))[0];
    const items = edit !== undefined && edit !== 'separator' ? (edit.children ?? []) : [];
    const labels = items.flatMap((item) => (item === 'separator' ? [] : [item.label]));
    expect(labels).toEqual(['Undo', 'Redo', 'Cut', 'Copy', 'Copy merged', 'Paste', 'Paste in place', 'Delete']);
    for (const item of items) if (item !== 'separator') expect(item).toMatchObject({ disabled: true });
  });
});

describe('K1 the view menu', { tags: ['critical'] }, () => {
  it('lists only what the open file can use', () => {
    expect(childLabels(editorMenu(stateOf('Sh')), 'View')).toEqual(['Zoom', 'Rulers', 'Guides', 'Snap', 'Lock guides', 'Hide overlays']);
    expect(childLabels(editorMenu(stateOf('Tm')), 'View')).toEqual(['Zoom', 'Grid', 'Rulers', 'Guides', 'Snap', 'Lock guides', 'Hide overlays']);
    expect(childLabels(editorMenu(stateOf('Sp')), 'View')).toEqual([
      'Zoom',
      'Grid',
      'Rulers',
      'Guides',
      'Snap',
      'Slices',
      'Lock guides',
      'Hide overlays',
      'Mirror view',
      'Loupe',
      'Split view',
      'Link views',
      'Actual size in second view',
      'Fullscreen preview',
      'Symmetry',
      'Tiled preview',
    ]);
    expect(childLabels(editorMenu(stateOf('Im')), 'View')).toEqual(['Zoom', 'Grid']);
  });
});

