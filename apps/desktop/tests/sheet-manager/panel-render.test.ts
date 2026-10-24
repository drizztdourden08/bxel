/* @layer renderer-app @kind test */
import type { MenuGroup } from '@drizztdourden08/tessera';
import * as React from 'react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addToSheet } from '../../src/sheet-manager/add-to-sheet';
import { allFacts } from '../../src/sheet-manager/all-facts';
import { atlasModel } from '../../src/sheet-manager/atlas-model';
import { planRenames } from '../../src/sheet-manager/plan-renames';
import { selectionIds } from '../../src/sheet/selection-ids';
import { spriteScene } from '../../src/sheet/sprite-scene';
import { actionGroups } from '../../src/views/SpritesPanel/behavior/action-groups';
import { AtlasCanvas } from '../../src/views/SpritesPanel/sub-components/AtlasView/sub-components/AtlasCanvas';
import { AtlasControls } from '../../src/views/SpritesPanel/sub-components/AtlasView/sub-components/AtlasControls';
import { RenamePreview } from '../../src/views/SpritesPanel/sub-components/ManagerDialogs/sub-components/RenamePreview';
import { ResizeFields } from '../../src/views/SpritesPanel/sub-components/ManagerDialogs/sub-components/ResizeFields';
import { SpriteRow } from '../../src/views/SpritesPanel/sub-components/SpriteRow';
import { SpriteTile } from '../../src/views/SpritesPanel/sub-components/SpriteTile';
import type { ManagerModel, SpriteHandlers } from '../../src/views/SpritesPanel/SpritesPanel.type';
import { artwork, idOf, openFile } from '../sheet/sheet-harness';
import { idsOf } from './manager-harness';

vi.mock('../../src/export/open-export', () => ({ openExport: () => undefined }));

Object.assign(globalThis, { React });

const none = (): void => undefined;

const handlers: SpriteHandlers = { onPick: none, onRename: none, onMenu: none };

const drag = { onDragStart: none, onDragOver: none, onDrop: none };

const itemIds = (groups: readonly MenuGroup[]): string[] =>
  groups.flatMap((group) => group.items.flatMap((item) => ('id' in item ? [item.id] : [])));

const hasItem =(group: MenuGroup | undefined, id: string): boolean => group?.items.some((item) => 'id' in item && item.id === id) ?? false;

const modelOf = (): ManagerModel => {
  const art = artwork();
  const scene = spriteScene(art, { activeId: idOf('walk_1'), selected: idsOf('walk_1', 'walk_2') });
  const facts = allFacts(art, art.sheets[0] ?? null);
  return { artwork: art, scene, sheet: art.sheets[0] ?? null, facts, shown: facts, order: facts.map((fact) => fact.sprite.id), sizes: ['8x8'], ids: selectionIds(scene) };
};

beforeEach(() => openFile(['walk_1', 'walk_2'], 8));

describe('the sprite tile and row', () => {
  it('names the sprite and its size and marks a picked sprite', () => {
    const fact = allFacts(artwork(), null).find((each) => each.sprite.name === 'walk_1');
    if (!fact) throw new Error('no fact');
    const state = { selected: true, active: true, affected: false, loose: true };
    const tile = renderToString(createElement(SpriteTile, { fact, artwork: artwork(), box: 48, state, drag, handlers }));
    expect(tile).toContain('aria-label="walk_1, 8 by 8"');
    expect(tile).toContain('aria-pressed="true"');
    expect(tile).toContain('sprites-panel__tile--loose');
    expect(tile).toContain(`data-sprite-id="${idOf('walk_1')}"`);
    const row = renderToString(createElement(SpriteRow, { fact, artwork: artwork(), state, drag, handlers }));
    expect(row).toContain('sprites-panel__row');
    expect(row).toContain('8x8');
    expect(row).toContain('4, 4');
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

describe('the atlas pieces', () => {
  it('draw the layout controls of a sheet and a canvas for its sprites', () => {
    addToSheet(idsOf('walk_1', 'walk_2'), null);
    const model = modelOf();
    const sheet = artwork().sheets[0];
    if (!sheet) throw new Error('no sheet');
    const controls = renderToString(createElement(AtlasControls, { sheet }));
    expect(controls).toContain('Layout');
    expect(controls).toContain('Spacing');
    const atlas = atlasModel({ sheet, sprites: model.artwork.sprites, extrude: 0 });
    const canvas = renderToString(createElement(AtlasCanvas, { model, atlas }));
    expect(canvas).toContain('sprites-panel__atlas-canvas');
  });
});

describe('the action menu', () => {
  it('has the groups for editing, ordering, the sheet, transforms and selecting', () => {
    const groups = actionGroups({ model: modelOf(), sortKey: 'manual', rename: none, open: none });
    expect(groups.map((group) => group.id)).toEqual(['edit', 'order', 'sheet', 'transform', 'select']);
    expect(itemIds(groups)).toEqual(expect.arrayContaining(['rename', 'rename-many', 'duplicate', 'delete', 'sort-name', 'add-to-sheet', 'pivot', 'trim', 'flip-h', 'turn-half', 'select-invert']));
  });

  it('turns the item off when nothing is picked and offers the view order only when sorted', () => {
    const base = modelOf();
    const empty = { ...base, ids: [], scene: { ...base.scene, selected: [], active: null } };
    const edit = actionGroups({ model: empty, sortKey: 'manual', rename: none, open: none })[0];
    const duplicate = edit?.items.find((item) => 'id' in item && item.id === 'duplicate');
    expect(duplicate && 'disabled' in duplicate ? duplicate.disabled : false).toBe(true);
    expect(hasItem(actionGroups({ model: base, sortKey: 'manual', rename: none, open: none })[1], 'use-order')).toBe(false);
    expect(hasItem(actionGroups({ model: base, sortKey: 'name', rename: none, open: none })[1], 'use-order')).toBe(true);
  });
});
