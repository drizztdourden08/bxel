/* @layer renderer-app @kind test */
import type { MenuGroup, VirtualGridCellBind } from '@drizztdourden08/tessera';
import * as React from 'react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addToSheet } from '../../src/sheet-manager/add-to-sheet';
import { allFacts } from '../../src/sheet-manager/all-facts';
import { atlasModel } from '../../src/sheet-manager/atlas-model';
import { folderGroups } from '../../src/sheet-manager/folder-groups';
import { planRenames } from '../../src/sheet-manager/plan-renames';
import { actionGroups } from '../../src/views/SpritesPanel/behavior/action-groups';
import { listRows } from '../../src/views/SpritesPanel/behavior/list-rows';
import { rowStateOf } from '../../src/views/SpritesPanel/behavior/row-state';
import { LayoutControls } from '../../src/views/SpritesPanel/sub-components/LayoutSection/sub-components/LayoutControls';
import { RenamePreview } from '../../src/views/SpritesPanel/sub-components/ManagerDialogs/sub-components/RenamePreview';
import { ResizeFields } from '../../src/views/SpritesPanel/sub-components/ManagerDialogs/sub-components/ResizeFields';
import { EntryTile } from '../../src/views/EntryTile';
import type { ManagerModel, SpriteHandlers } from '../../src/views/SpritesPanel/SpritesPanel.type';
import { artwork, idOf, openFile } from '../sheet/sheet-harness';
import { idsOf, modelFor, PLAIN_ATLAS } from './manager-harness';

vi.mock('../../src/export/open-export', () => ({ openExport: () => undefined }));

Object.assign(globalThis, { React });

const none = (): void => undefined;

const handlers: SpriteHandlers = { onPick: none, onEdit: none, onRename: none, onMenu: none };

const drag = { onDragStart: none, onDragOver: none, onDrop: none };

const itemIds = (groups: readonly MenuGroup[]): string[] =>
  groups.flatMap((group) => group.items.flatMap((item) => ('id' in item ? [item.id] : [])));

const hasItem =(group: MenuGroup | undefined, id: string): boolean => group?.items.some((item) => 'id' in item && item.id === id) ?? false;

const modelOf = (): ManagerModel => {
  const art = artwork();
  return modelFor(art, art.sheets[0] ?? null, idsOf('walk_1', 'walk_2'));
};

beforeEach(() => {
  openFile(['walk_1', 'walk_2'], 8);
  addToSheet(artwork().sprites.map((sprite) => sprite.id), null);
});

const cell: VirtualGridCellBind = {
  role: 'gridcell',
  className: 'virtual-grid__cell virtual-grid__cell--bare',
  tabIndex: 0,
  'aria-colindex': 1,
  'data-vg-index': 0,
  'data-vg-kind': 'tile',
  'data-marquee-key': 'a',
  onFocus: vi.fn(),
  onKeyDown: vi.fn(),
};

describe('the sprite tile', () => {
  it('names the sprite and its size and marks a picked sprite', () => {
    const art = artwork();
    const fact = allFacts(art, art.sheets[0] ?? null).find((each) => each.sprite.name === 'walk_1');
    if (!fact) throw new Error('no fact');
    const state = { mark: null, selected: true, active: true, affected: false, loose: true, twin: false };
    const tile = renderToString(createElement(EntryTile, { fact, artwork: artwork(), box: 48, state, drag, handlers, cell }));
    expect(tile).toContain('aria-label="walk_1"');
    expect(tile).toContain('sprite, 8 by 8, Not on this sheet');
    expect(tile).toContain('aria-describedby=');
    expect(tile).toContain('aria-selected="true"');
    expect(tile).toContain('role="gridcell"');
    expect(tile).toContain('entry-tile--loose');
    expect(tile).toContain(`data-sprite-id="${idOf('walk_1')}"`);
  });
});

describe('the list rows', () => {
  it('has one row for every sprite with its size, pivot, palette and folder', () => {
    const art = artwork();
    const rows = listRows(art, folderGroups(allFacts(art, art.sheets[0] ?? null), new Set()), [], art.sheets[0] ?? null);
    const walk = rows.find((row) => row.name === 'walk_1');
    expect(rows).toHaveLength(art.sprites.length);
    expect(rows.every((row) => row.kind === 'sprite')).toBe(true);
    expect(walk).toMatchObject({ width: 8, height: 8, pivot: '4, 4', folder: 'No folder' });
  });

  it('marks the pending sprite, the active sprite and a sprite that is not on the sheet', () => {
    const model = modelOf();
    const walk = listRows(model.artwork, model.groups, [], model.sheet).find((row) => row.name === 'walk_1');
    if (!walk) throw new Error('no row');
    const other = { ...walk, id: String(idOf('walk_2')), loose: false };
    expect(rowStateOf(model, [idOf('walk_1')])(walk)).toBe('pending');
    expect(rowStateOf(model, [])(walk)).toBe('active');
    expect(rowStateOf(model, [])(other)).toBeUndefined();
    expect(rowStateOf(model, [])({ ...other, loose: true })).toBe('muted');
  });
});

describe('the dialog pieces', () => {
  it('draw the nine anchors with one checked', () => {
    const fields = renderToString(createElement(ResizeFields, { spec: { width: 8, height: 8, anchor: 'center' }, update: none }));
    expect(fields.match(/role="radio"/g)).toHaveLength(9);
    expect(fields.match(/aria-checked="true"/g)).toHaveLength(1);
    expect(fields).toContain('Width');
    expect(fields).toContain('Anchor');
  });

  it('list the renames and say which names cannot be used', () => {
    const art = artwork();
    const targets = art.sprites.filter((sprite) => sprite.name.startsWith('walk'));
    const plan = planRenames({ pattern: 'sprite', find: '', replace: '', start: 1 }, targets, ['sprite']);
    const page = renderToString(createElement(RenamePreview, { plan }));
    expect(page).toContain('Preview');
    expect(page).toContain('2 names cannot be used.');
  });
});

describe('the layout pieces', () => {
  it('draw the layout controls of a sheet', () => {
    addToSheet(idsOf('walk_1', 'walk_2'), null);
    const sheet = artwork().sheets[0];
    if (!sheet) throw new Error('no sheet');
    const controls = renderToString(createElement(LayoutControls, { sheet }));
    expect(controls).toContain('Layout');
    expect(controls).toContain('Spacing');
    expect(controls).toContain('Allow rotation');
    const atlas = atlasModel({ sheet, artwork: artwork(), extrude: 0, ...PLAIN_ATLAS });
    expect(atlas.items.length).toBeGreaterThanOrEqual(2);
  });
});

describe('the action menu', () => {
  it('has the groups for editing, combining, ordering, the sheet, transforms and selecting', () => {
    const groups = actionGroups({ model: modelOf(), sortKey: 'manual', rename: none, open: none, selections: [] });
    expect(groups.map((group) => group.id)).toEqual(['edit', 'combine', 'order', 'sheet', 'layout', 'transform', 'select', 'find', 'saved']);
    expect(itemIds(groups)).toEqual(expect.arrayContaining(['rename', 'rename-many', 'duplicate', 'delete', 'animate', 'strip', 'slice', 'sort-name', 'add-to-sheet', 'pivot', 'trim', 'flip-h', 'turn-half', 'select-invert', 'select-duplicates', 'compare']));
  });

  it('turns the item off when nothing is picked and offers the view order only when sorted', () => {
    const base = modelOf();
    const empty = { ...base, ids: [], scene: { ...base.scene, selected: [], active: null } };
    const edit = actionGroups({ model: empty, sortKey: 'manual', rename: none, open: none, selections: [] })[0];
    const duplicate = edit?.items.find((item) => 'id' in item && item.id === 'duplicate');
    expect(duplicate && 'disabled' in duplicate ? duplicate.disabled : false).toBe(true);
    expect(hasItem(actionGroups({ model: base, sortKey: 'manual', rename: none, open: none, selections: [] })[2], 'use-order')).toBe(false);
    expect(hasItem(actionGroups({ model: base, sortKey: 'name', rename: none, open: none, selections: [] })[2], 'use-order')).toBe(true);
  });
});
