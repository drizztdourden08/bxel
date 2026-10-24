/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { allFacts } from '../../src/sheet-manager/all-facts';
import { applySelection } from '../../src/sheet-manager/apply-selection';
import { baseName } from '../../src/sheet-manager/base-name';
import { folderGroups } from '../../src/sheet-manager/folder-groups';
import { folderPath } from '../../src/sheet-manager/folder-path';
import { listItems } from '../../src/sheet-manager/list-items';
import { managerSheet } from '../../src/sheet-manager/manager-sheet';
import { normalizeFolder } from '../../src/sheet-manager/normalize-folder';
import { planFolder } from '../../src/sheet-manager/plan-folder';
import { renameSprites } from '../../src/sheet-manager/rename-sprites';
import { visibleOrder } from '../../src/sheet-manager/visible-order';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useManagerStore } from '../../src/stores/useManagerStore';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { artwork, idOf, lastNotice, namesOf, openFile, revision } from '../sheet/sheet-harness';
import { idsOf } from './manager-harness';

const NAMES = ['hero/walk_1', 'hero/walk_2', 'hero/idle', 'fx/spark', 'solo', 'a/y', 'a/b/x'];

const groupsOf = (collapsed: string[]) => {
  const art = artwork();
  const facts = allFacts(art, managerSheet(art, null, null)).filter((fact) => fact.sprite.name !== 'sprite');
  return folderGroups(facts, new Set(collapsed));
};

const sprites = (...names: string[]) => artwork().sprites.filter((sprite) => names.includes(sprite.name));

beforeEach(() => {
  openFile(NAMES, 8);
  useManagerStore.getState().reset();
});

describe('name paths', () => {
  it('splits a name into a folder and a base', () => {
    expect(folderPath('hero/walk_1')).toBe('hero');
    expect(folderPath('a/b/x')).toBe('a/b');
    expect(folderPath('solo')).toBe('');
    expect(baseName('a/b/x')).toBe('x');
    expect(normalizeFolder(' /hero// walk /')).toBe('hero/walk');
  });

  it('groups sprites by folder with the sprites that have none first', () => {
    const groups = groupsOf([]);
    expect(groups.map((group) => group.path)).toEqual(['', 'a', 'a/b', 'fx', 'hero']);
    expect(groups.map((group) => group.depth)).toEqual([0, 1, 2, 1, 1]);
    expect(groups.find((group) => group.path === 'hero')?.facts.map((fact) => fact.sprite.name)).toEqual(['hero/walk_1', 'hero/walk_2', 'hero/idle']);
  });

  it('hides the sprites of a closed folder and the folders inside it', () => {
    const groups = groupsOf(['hero', 'a']);
    expect(groups.find((group) => group.path === 'hero')).toMatchObject({ closed: true, hidden: false });
    expect(groups.find((group) => group.path === 'a/b')).toMatchObject({ closed: false, hidden: true });
    expect(visibleOrder(groups)).toEqual(idsOf('solo', 'fx/spark'));
    expect(listItems(groups).map((item) => item.key)).toEqual([idOf('solo'), 'folder:a', 'folder:fx', idOf('fx/spark'), 'folder:hero']);
  });

  it('remembers which folders are closed', () => {
    useManagerStore.getState().toggleFolder('hero');
    useManagerStore.getState().toggleFolder('fx');
    useManagerStore.getState().toggleFolder('hero');
    expect(useManagerStore.getState().collapsed).toEqual(['fx']);
  });
});

describe('moving sprites to a folder', () => {
  it('plans the new names, takes sprites out of a folder and flags a clash', () => {
    const moved = planFolder('crew/', sprites('solo', 'hero/idle'), namesOf());
    expect(moved.entries.map((entry) => entry.to)).toEqual(['crew/idle', 'crew/solo']);
    expect(moved.ok).toBe(true);
    const out = planFolder('', sprites('hero/idle'), namesOf());
    expect(out.entries.map((entry) => entry.to)).toEqual(['idle']);
    const clash = planFolder('hero', sprites('a/y'), [...namesOf(), 'hero/y']);
    expect(clash.ok).toBe(false);
  });

  it('renames them in one undo step', () => {
    const before = revision();
    expect(renameSprites(planFolder('crew', sprites('solo', 'hero/idle'), namesOf()), 'Move to folder')).toBe(true);
    expect(revision()).toBe(before + 1);
    expect(namesOf()).toContain('crew/idle');
    stepHistory('undo');
    expect(namesOf()).toContain('hero/idle');
  });
});

describe('saved selections', () => {
  it('saves a selection under a name and replaces one with the same name', () => {
    const { saveSelection } = useManagerStore.getState();
    saveSelection({ name: 'walkers', ids: idsOf('hero/walk_1') });
    saveSelection({ name: 'walkers', ids: idsOf('hero/walk_1', 'hero/walk_2') });
    saveSelection({ name: 'other', ids: idsOf('solo') });
    expect(useManagerStore.getState().selections.map((each) => [each.name, each.ids.length])).toEqual([['walkers', 2], ['other', 1]]);
    useManagerStore.getState().dropSelection('other');
    expect(useManagerStore.getState().selections.map((each) => each.name)).toEqual(['walkers']);
  });

  it('picks the sprites again and skips the ones that are gone', () => {
    expect(applySelection(artwork(), { name: 'x', ids: idsOf('solo', 'fx/spark') })).toBe(true);
    expect(useSpriteStore.getState().selected).toEqual(idsOf('solo', 'fx/spark'));
    expect(applySelection(artwork(), { name: 'gone', ids: ['spr_missing' as never] })).toBe(false);
    expect(lastNotice()).toContain('no longer in the file');
  });
});

describe('view settings kept for each file', () => {
  it('gives a new file the defaults and brings back the settings of the first one', () => {
    const first = useDocumentStore.getState().activeId;
    useManagerStore.getState().patch({ view: 'list', zoom: 80, sortKey: 'name' });
    useManagerStore.getState().toggleFolder('hero');
    createDefaultArtwork(useDocumentStore.getState().host);
    expect(useDocumentStore.getState().activeId).not.toBe(first);
    expect(useManagerStore.getState()).toMatchObject({ view: 'grid', sortKey: 'manual', collapsed: [] });
    if (first === null) throw new Error('no first file');
    useDocumentStore.getState().setActive(first);
    expect(useManagerStore.getState()).toMatchObject({ view: 'list', zoom: 80, sortKey: 'name', collapsed: ['hero'] });
  });
});
