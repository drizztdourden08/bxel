/* @layer renderer-app @kind test */
import type { MenuGroup, MenuNode } from '@drizztdourden08/tessera';
import { describe, expect, it, vi } from 'vitest';
import { NO_FACTS } from '../../src/project-browser/project-browser.constants';
import type { FileEntry } from '../../src/project-browser/project-browser.type';
import { tagsInUse } from '../../src/project-browser/tags-in-use';
import type { BrowserActions } from '../../src/views/ProjectBrowser/ProjectBrowser.type';
import { entryMenuGroups } from '../../src/views/ProjectBrowser/behavior/entry-menu-groups';
import { row } from '../panel-browser/browser-fixture';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const fileEntry = (name: string, tags: readonly string[]): FileEntry => ({
  kind: 'file',
  id: name,
  row: row('sprite', `/p/demo/${name}.bxsprite`),
  facts: { ...NO_FACTS, tags },
  pinned: false,
  key: null,
});

const tagsNode = (groups: readonly MenuGroup[]): MenuNode | undefined => groups.flatMap((group) => group.items).find((item) => 'id' in item && item.id === 'tags');

const childrenOf = (node: MenuNode | undefined): readonly MenuNode[] => (node !== undefined && 'children' in node ? (node.children ?? []) : []);

describe('W10 the Tags entry of the Browse entry menu', { tags: ['standard'] }, () => {
  it('lists the tags in use, sorted and once each', () => {
    expect(tagsInUse({ tags: { a: ['hero', 'ui'], b: ['hero'] }, collections: [], smart: [], pinned: [] })).toEqual(['hero', 'ui']);
  });

  it('ticks a tag only when every picked file holds it, and adds or removes it on select', () => {
    const tag = vi.fn();
    const untag = vi.fn();
    const hero = fileEntry('hero', ['boss', 'ui']);
    const coin = fileEntry('coin', ['ui']);
    const groups = entryMenuGroups({ entry: hero, picked: [hero, coin], actions: { tag, untag } as unknown as BrowserActions, editable: true, collections: [], tags: ['boss', 'ui'] });
    const [boss, ui] = childrenOf(tagsNode(groups)) as readonly { checked: boolean; onSelect: () => void }[];
    expect(boss?.checked).toBe(false);
    expect(ui?.checked).toBe(true);
    boss?.onSelect();
    expect(tag).toHaveBeenCalledWith([hero, coin], 'boss');
    ui?.onSelect();
    expect(untag).toHaveBeenCalledWith([hero, coin], 'ui');
  });

  it('is absent when read only or when no tag exists', () => {
    const hero = fileEntry('hero', []);
    const input = { entry: hero, picked: [hero], actions: {} as BrowserActions, collections: [] };
    expect(tagsNode(entryMenuGroups({ ...input, editable: false, tags: ['ui'] }))).toBeUndefined();
    expect(tagsNode(entryMenuGroups({ ...input, editable: true, tags: [] }))).toBeUndefined();
  });
});
