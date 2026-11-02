/* @layer renderer-app @kind test */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { describe, expect, it, vi } from 'vitest';
import type { FolderEntry } from '../../src/project-browser/project-browser.type';
import { roleFolderEntry } from '../../src/project-config/role-folder-entry';
import { roleFolderMenuNode } from '../../src/project-config/role-folder-menu-node';
import { rolesOfFolder } from '../../src/project-config/roles-of-folder';
import type { BrowserActions, MenuInput } from '../../src/views/ProjectBrowser/ProjectBrowser.type';
import { entryMenuGroups } from '../../src/views/ProjectBrowser/behavior/entry-menu-groups';
import { folderEntries } from '../../src/views/ProjectPanel/behavior/folder-entries';
import { ROOT, row, treeOf } from './browser-fixture';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

vi.mock('../../src/project-config/focused-project', () => ({
  focusedProject: () => ({
    project: {
      folders: [{ folderId: 'main', path: '/p/demo' }],
      manifest: { folders: [{ folderId: 'main', roles: { sprites: 'sprites', exports: 'out/' } }] },
    },
  }),
}));

const folderEntry = (path: string): FolderEntry => ({ kind: 'folder', id: path, path, name: path.split('/').at(-1) ?? path, count: 0, root: false, linked: false });

const inputOf = (entry: FolderEntry, editable: boolean): MenuInput => ({ entry, picked: [entry], actions: {} as BrowserActions, editable, collections: [] });

const checkedLabels = (entry: ContextMenuEntry): string[] => {
  if (typeof entry !== 'object' || !('items' in entry)) return [];
  return entry.items.flatMap((each) => (typeof each === 'object' && 'checked' in each && each.checked === true && 'label' in each ? [each.label ?? ''] : []));
};

describe('W7 role folders in the folder menus', { tags: ['standard'] }, () => {
  it('finds the roles a folder holds, ignoring slashes and case', () => {
    expect(rolesOfFolder('/p/demo/sprites')).toEqual(['sprites']);
    expect(rolesOfFolder('/p/demo/Out')).toEqual(['exports']);
    expect(rolesOfFolder('/p/demo/other')).toEqual([]);
  });

  it('builds one check node per role and ticks the held ones', () => {
    const node = roleFolderMenuNode('/p/demo/sprites');
    const children = 'children' in node ? (node.children ?? []) : [];
    expect(children).toHaveLength(6);
    const ticked = children.filter((each) => 'checked' in each && each.checked === true);
    expect(ticked.map((each) => ('label' in each ? each.label : ''))).toEqual(['Sprites']);
  });

  it('puts the role submenu in the project widget folder menu, hidden when read only', () => {
    const folder = treeOf([row('sprite', `${ROOT}/sprites/hero.bxsprite`)]).items.get(`${ROOT}/sprites`);
    if (folder === undefined) throw new Error('no folder item');
    const entry = folderEntries(folder).find((each) => typeof each === 'object' && 'items' in each && 'icon' in each && each.label === 'Set as role folder for...');
    expect(entry).toBeDefined();
    expect(entry && checkedLabels(entry)).toEqual(['Sprites']);
    expect(roleFolderEntry('/p/demo/sprites', true)).toMatchObject({ hidden: true });
  });

  it('puts the role group in the browser folder menu only for one editable folder', () => {
    const ids = (editable: boolean): string[] => entryMenuGroups(inputOf(folderEntry('/p/demo/sprites'), editable)).map((group) => group.id);
    expect(ids(true)).toContain('role');
    expect(ids(false)).not.toContain('role');
  });
});
