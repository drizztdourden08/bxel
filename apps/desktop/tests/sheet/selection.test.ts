/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import type { SpriteId } from '@bxel/document';
import { pickSprite } from '../../src/sheet/pick-sprite';
import { pickSpriteById } from '../../src/sheet/pick-sprite-by-id';
import { selectAllSprites } from '../../src/sheet/select-all-sprites';
import { clearSpriteSelection } from '../../src/sheet/clear-selection';
import { isolateSprite } from '../../src/sheet/isolate-sprite';
import { backToSheet } from '../../src/sheet/back-to-sheet';
import { switchMode } from '../../src/sheet/switch-mode';
import { toggleBroadcast } from '../../src/sheet/toggle-broadcast';
import { currentTarget } from '../../src/editor/current-target';
import { beginPending } from '../../src/editor/pending/begin-pending';
import { cancelPending } from '../../src/editor/pending/cancel-pending';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { idOf, lastNotice, openFile } from './sheet-harness';

const order = (names: readonly string[]): SpriteId[] => names.map((name) => name as SpriteId);

describe('the pick reducer', () => {
  const list = order(['a', 'b', 'c', 'd', 'e']);
  const base = { order: list, selected: [], anchor: null, active: null } as const;

  it('replaces the pick with the clicked sprite', () => {
    const result = pickSprite({ ...base, selected: order(['a', 'b']), id: 'd' as SpriteId, how: 'replace' });
    expect(result).toEqual({ selected: ['d'], anchor: 'd', active: 'd' });
  });

  it('adds with Ctrl and drops a sprite that was picked', () => {
    const added = pickSprite({ ...base, selected: order(['a']), anchor: 'a' as SpriteId, active: 'a' as SpriteId, id: 'c' as SpriteId, how: 'toggle' });
    expect(added.selected).toEqual(['a', 'c']);
    expect(added.active).toBe('c');
    const dropped = pickSprite({ ...base, selected: added.selected, anchor: added.anchor, active: added.active, id: 'c' as SpriteId, how: 'toggle' });
    expect(dropped.selected).toEqual(['a']);
    expect(dropped.active).toBe('a');
  });

  it('picks a range from the anchor in list order with Shift', () => {
    const result = pickSprite({ ...base, selected: order(['b']), anchor: 'b' as SpriteId, active: 'b' as SpriteId, id: 'e' as SpriteId, how: 'range' });
    expect(result.selected).toEqual(['b', 'c', 'd', 'e']);
    expect(result.anchor).toBe('b');
    const back = pickSprite({ ...base, selected: result.selected, anchor: result.anchor, active: result.active, id: 'a' as SpriteId, how: 'range' });
    expect(back.selected).toEqual(['a', 'b']);
  });
});

describe('picking sprites in the open file', () => {
  beforeEach(() => openFile(['cap_red', 'cap_pink', 'cap_violet']));

  it('lists the first sprite as the active one and edits the picked sprite', () => {
    expect(currentTarget()?.sprite.name).toBe('sprite');
    pickSpriteById(idOf('cap_pink'), 'replace');
    expect(currentTarget()?.sprite.name).toBe('cap_pink');
    expect(useSpriteStore.getState().activeId).toBe(idOf('cap_pink'));
  });

  it('picks three sprites by click, Ctrl+click and Shift+click', () => {
    pickSpriteById(idOf('cap_red'), 'replace');
    pickSpriteById(idOf('cap_violet'), 'toggle');
    expect(useSpriteStore.getState().selected).toEqual([idOf('cap_red'), idOf('cap_violet')]);
    pickSpriteById(idOf('sprite'), 'replace');
    pickSpriteById(idOf('cap_pink'), 'range');
    expect(useSpriteStore.getState().selected).toEqual([idOf('sprite'), idOf('cap_red'), idOf('cap_pink')]);
  });

  it('turns Paint all selected off when the pick changes', () => {
    pickSpriteById(idOf('cap_red'), 'replace');
    pickSpriteById(idOf('cap_pink'), 'toggle');
    toggleBroadcast();
    expect(useSpriteStore.getState().broadcast).toBe(true);
    pickSpriteById(idOf('cap_violet'), 'toggle');
    expect(useSpriteStore.getState().broadcast).toBe(false);
  });

  it('refuses Paint all selected with one sprite picked', () => {
    pickSpriteById(idOf('cap_red'), 'replace');
    toggleBroadcast();
    expect(useSpriteStore.getState().broadcast).toBe(false);
    expect(lastNotice()).toBe('Select two or more sprites first.');
  });

  it('selects all sprites and clears the pick', () => {
    selectAllSprites();
    expect(useSpriteStore.getState().selected).toHaveLength(4);
    clearSpriteSelection();
    expect(useSpriteStore.getState().selected).toEqual([]);
  });

  it('keeps the pick while a preview is open', () => {
    pickSpriteById(idOf('cap_red'), 'replace');
    expect(beginPending({ kind: 'flip', axis: 'horizontal' })).toBe(true);
    pickSpriteById(idOf('cap_pink'), 'replace');
    expect(useSpriteStore.getState().selected).toEqual([idOf('cap_red')]);
    expect(lastNotice()).toBe('Finish the preview first.');
    cancelPending();
  });
});

describe('the modes', () => {
  it('disables Sheet mode with one sprite and says why', () => {
    openFile([]);
    expect(switchMode('sheet')).toBe(false);
    expect(lastNotice()).toBe('Add a second sprite to use Sheet mode.');
    expect(useSpriteStore.getState().mode).toBe('sprite');
  });

  it('switches to Sheet mode and keeps the current sprite', () => {
    openFile(['b']);
    pickSpriteById(idOf('b'), 'replace');
    useSpriteStore.getState().setSelection([], null);
    expect(switchMode('sheet')).toBe(true);
    expect(useSpriteStore.getState()).toMatchObject({ mode: 'sheet', activeId: idOf('b'), selected: [idOf('b')] });
    expect(switchMode('sprite')).toBe(true);
    expect(currentTarget()?.sprite.name).toBe('b');
  });

  it('refuses a mode switch while a preview is open', () => {
    openFile(['b']);
    expect(beginPending({ kind: 'flip', axis: 'horizontal' })).toBe(true);
    expect(switchMode('sheet')).toBe(false);
    expect(lastNotice()).toBe('Finish the preview first.');
    cancelPending();
  });

  it('isolates a sprite into Sprite mode and returns to the sheet', () => {
    openFile(['b', 'c']);
    switchMode('sheet');
    isolateSprite(idOf('c'));
    expect(useSpriteStore.getState()).toMatchObject({ mode: 'sprite', isolated: true, activeId: idOf('c'), selected: [idOf('c')] });
    backToSheet();
    expect(useSpriteStore.getState()).toMatchObject({ mode: 'sheet', isolated: false });
  });
});
