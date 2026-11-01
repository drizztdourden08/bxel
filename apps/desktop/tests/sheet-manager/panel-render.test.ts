/* @layer renderer-app @kind test */
import type { MenuGroup } from '@drizztdourden08/tessera';
import * as React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addToSheet } from '../../src/sheet-manager/add-to-sheet';
import { allFacts } from '../../src/sheet-manager/all-facts';
import { folderGroups } from '../../src/sheet-manager/folder-groups';
import { actionGroups } from '../../src/views/SpritesPanel/behavior/action-groups';
import { listRows } from '../../src/views/SpritesPanel/behavior/list-rows';
import { rowStateOf } from '../../src/views/SpritesPanel/behavior/row-state';
import type { ManagerModel } from '../../src/views/SpritesPanel/SpritesPanel.type';
import { artwork, idOf, openFile } from '../sheet/sheet-harness';
import { idsOf, modelFor } from './manager-harness';

vi.mock('../../src/export/open-export', () => ({ openExport: () => undefined }));

Object.assign(globalThis, { React });

const none = (): void => undefined;

const hasItem =(group: MenuGroup | undefined, id: string): boolean => group?.items.some((item) => 'id' in item && item.id === id) ?? false;

const modelOf = (): ManagerModel => {
  const art = artwork();
  return modelFor(art, art.sheets[0] ?? null, idsOf('walk_1', 'walk_2'));
};

beforeEach(() => {
  openFile(['walk_1', 'walk_2'], 8);
  addToSheet(artwork().sprites.map((sprite) => sprite.id), null);
});

describe('S2 the list rows', { tags: ['standard'] }, () => {
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

describe('S2 the action menu', { tags: ['standard'] }, () => {
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
