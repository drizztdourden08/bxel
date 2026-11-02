/* @layer renderer-app @kind test */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { describe, expect, it, vi } from 'vitest';
import type { BrowserItem } from '../../src/panel-browser/project-browser.type';
import { descendantFolders } from '../../src/views/ProjectPanel/behavior/descendant-folders';
import { folderEntries } from '../../src/views/ProjectPanel/behavior/folder-entries';
import { manyEntries } from '../../src/views/ProjectPanel/behavior/many-entries';
import { fromSelectionEntries, newKindEntries } from '../../src/views/ProjectPanel/behavior/new-kind-entries';
import { pasteFolderOf } from '../../src/views/ProjectPanel/behavior/paste-folder-of';
import { spriteIdsOf } from '../../src/views/ProjectPanel/behavior/sprite-ids-of';
import { ROOT, row, treeOf } from './browser-fixture';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const commandOf = (entry: ContextMenuEntry): string | undefined => (typeof entry === 'object' && 'command' in entry ? entry.command : undefined);

const hiddenOf = (entry: ContextMenuEntry): boolean => typeof entry === 'object' && 'hidden' in entry && entry.hidden === true;

const itemAt = (path: string, rows = [row('sprite', `${ROOT}/sprites/hero.bxsprite`)]): BrowserItem => {
  const found = treeOf(rows).items.get(path);
  if (found === undefined) throw new Error(`no item at ${path}`);
  return found;
};

describe('S2 the project widget menus and helpers', { tags: ['standard'] }, () => {
  it('offers Move to folder and the from these items for many rows', () => {
    const hero = itemAt(`${ROOT}/sprites/hero.bxsprite`);
    const entries = manyEntries([hero, hero]);
    expect(entries.map(commandOf)).toContain('asset.move_to');
    const sheet = entries.find((entry) => commandOf(entry) === 'project.new_sheet_from');
    expect(sheet && hiddenOf(sheet)).toBe(false);
  });

  it('hides the from these items when no sprite is loaded', () => {
    const notes = itemAt(`${ROOT}/notes.txt`, [row('other', `${ROOT}/notes.txt`, { loaded: false })]);
    const entries = manyEntries([notes, notes]);
    const animation = entries.find((entry) => commandOf(entry) === 'project.new_animation_from');
    expect(animation && hiddenOf(animation)).toBe(true);
  });

  it('puts Collapse below in the folder menu', () => {
    const folder = itemAt(`${ROOT}/sprites`);
    expect(folderEntries(folder).map(commandOf)).toContain('project.collapse_below');
  });

  it('collects every folder under a folder, and none for a leaf folder', () => {
    const tree = treeOf();
    const below = descendantFolders(tree, tree.mainKey ?? '');
    expect(below).toContain(`${ROOT}/sprites`);
    expect(below).not.toContain(`${ROOT}/sprites/hero.bxsprite`);
    expect(descendantFolders(tree, `${ROOT}/sprites`)).toEqual([]);
  });

  it('adds a letter to each kind in the New menu and none in the submenu', () => {
    const hinted = newKindEntries(undefined, true).map((entry) => (typeof entry === 'object' && 'label' in entry ? entry.label : ''));
    expect(hinted.every((label) => /\([A-Z]\)$/.test(label ?? ''))).toBe(true);
    const plain = newKindEntries().map((entry) => (typeof entry === 'object' && 'label' in entry ? entry.label : ''));
    expect(plain.some((label) => /\([A-Z]\)$/.test(label ?? ''))).toBe(false);
  });

  it('adds the from selection items only when sprites are selected', () => {
    expect(fromSelectionEntries(0)).toEqual([]);
    expect(fromSelectionEntries(2).map(commandOf)).toEqual([undefined, 'project.new_sheet_from', 'project.new_animation_from']);
  });

  it('pastes into the folder of the focused file and skips read only folders', () => {
    const tree = treeOf();
    const hero = itemAt(`${ROOT}/sprites/hero.bxsprite`);
    expect(pasteFolderOf([hero], tree)?.path).toBe(`${ROOT}/sprites`);
    expect(pasteFolderOf([], tree)?.key).toBe(tree.mainKey);
  });

  it('lists loaded sprite ids only', () => {
    const loaded = itemAt(`${ROOT}/sprites/hero.bxsprite`);
    const unloaded = itemAt(`${ROOT}/sprites/hero.bxsprite`, [row('sprite', `${ROOT}/sprites/hero.bxsprite`, { loaded: false })]);
    expect(spriteIdsOf([loaded, unloaded])).toEqual([loaded.row?.assetId]);
  });
});
