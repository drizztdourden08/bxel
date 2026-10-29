/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { applyClick } from '../../src/panel-browser/apply-click';
import { buildStatuses } from '../../src/panel-browser/build-statuses';
import { filterTree } from '../../src/panel-browser/filter-tree';
import { flattenView } from '../../src/panel-browser/flatten-view';
import { listRows } from '../../src/panel-browser/list-rows';
import { listNest } from '../../src/panel-browser/list-nest';
import { treeNest } from '../../src/panel-browser/tree-nest';
import { hasToken } from '../../src/panel-browser/has-token';
import { toggledToken } from '../../src/panel-browser/toggled-token';
import { withoutToken } from '../../src/panel-browser/without-token';
import { parseQuery } from '../../src/project-browser/parse-query';
import { LINKED, ROOT, row, treeOf, BASE_ROWS } from './browser-fixture';

const heroRow = row('sprite', `${ROOT}/sprites/hero.bxsprite`, { dirty: true });
const sheetRow = row('sheet', `${ROOT}/sheets/all.bxsheet`);
const ghostRow = row('sprite', `${ROOT}/sprites/gone.bxsprite`);
const referrers = new Map<string, readonly string[]>([
  [heroRow.assetId ?? '', [sheetRow.assetId ?? '']],
  [ghostRow.assetId ?? '', [sheetRow.assetId ?? '']],
]);

const LOADED = [...BASE_ROWS.filter((each) => each.path !== heroRow.path && each.path !== sheetRow.path), heroRow, sheetRow, ghostRow];

const statusesOf = () => {
  const tree = treeOf(LOADED);
  return { tree, statuses: buildStatuses({ tree, referrers, openKeys: new Set([`sprite:${heroRow.assetId}`]), activeKey: `sprite:${heroRow.assetId}` }) };
};

const search = (text: string, missing = false) => ({ text, missing, query: parseQuery(text) });

const context = (statuses: ReturnType<typeof statusesOf>['statuses']) => ({ statuses, facts: new Map(), keys: new Map() });

describe('the project tree', () => {
  test('puts the main folder first, folders before files, natural order, linked roots after', () => {
    const tree = treeOf();
    const rows = flattenView(treeNest(tree, null), new Set([`${ROOT}/sprites`]), null);
    expect(rows.map((each) => each.item.name)).toEqual(['palettes', 'sheets', 'sprites', '2', '10', 'boss', 'hero', 'notes.txt', 'shared']);
    expect(rows.find((each) => each.item.name === 'shared')?.item.role).toBe('linked');
    expect(rows.find((each) => each.item.name === 'hero')?.depth).toBe(1);
  });

  test('gives every row its position in the set for the screen reader', () => {
    const rows = flattenView(treeNest(treeOf(), null), new Set([`${ROOT}/sprites`]), null);
    const kids = rows.filter((each) => each.depth === 1);
    expect(kids.map((each) => each.posinset)).toEqual([1, 2, 3, 4]);
    expect(new Set(kids.map((each) => each.setsize))).toEqual(new Set([4]));
  });

  test('keeps a file that is gone from disk as a ghost in its folder and marks the sheet and folders', () => {
    const { tree, statuses } = statusesOf();
    expect(tree.items.get(`${ROOT}/sprites/gone.bxsprite`)?.role).toBe('ghost');
    expect(statuses.get(`${ROOT}/sheets/all.bxsheet`)?.missing).toEqual(['gone']);
    expect(statuses.get(`${ROOT}/sheets`)?.missingBelow).toBe(1);
    expect(statuses.get(`${ROOT}/sprites`)?.missingBelow).toBe(1);
    expect(statuses.get(`${ROOT}/sprites`)?.unsavedBelow).toBe(1);
    expect(statuses.get(`${ROOT}/palettes`)?.missingBelow).toBe(0);
  });

  test('marks unsaved, open, active and counts the users of an asset', () => {
    const { statuses } = statusesOf();
    expect(statuses.get(`${ROOT}/sprites/hero.bxsprite`)).toMatchObject({ unsaved: true, open: true, active: true, usedBy: 1, unused: false });
    expect(statuses.get(`${ROOT}/sheets/all.bxsheet`)?.open).toBe(false);
  });

  test('puts assets with no file yet in a group of their own', () => {
    const tree = treeOf([...BASE_ROWS, row('sprite', '', { dirty: true })]);
    const nested = treeNest(tree, null);
    expect(nested.top.at(-1)?.role).toBe('group');
    const group = nested.top.find((each) => each.role === 'group');
    expect(group && nested.childrenOf(group)?.length).toBe(1);
  });

  test('puts a copy that has a planned path but no file yet in the unsaved group', () => {
    const copy = row('sprite', `${ROOT}/sprites/hero copy.bxsprite`, { dirty: true });
    const tree = treeOf([...BASE_ROWS, copy]);
    const group = treeNest(tree, null).top.find((each) => each.role === 'group');
    expect(group && treeNest(tree, null).childrenOf(group)?.map((each) => each.name)).toEqual(['hero copy']);
    expect(tree.items.get(copy.id)?.path).toBe('');
  });

  test('offers a new sprite row first inside the folder it is made in', () => {
    const tree = treeOf();
    const nested = treeNest(tree, { parentKey: `${ROOT}/sprites`, create: 'sprite' });
    const sprites = nested.top.find((each) => each.name === 'sprites');
    expect(sprites && nested.childrenOf(sprites)?.[0]?.key).toBe('new:file');
  });
});

describe('search tokens and filters', () => {
  test('reads kind, is, uses and in tokens with the shared parser', () => {
    const query = parseQuery('hero kind:sprite is:unsaved uses:hero in:sprites/');
    expect(query).toMatchObject({ words: ['hero'], kinds: ['sprite'], is: ['unsaved'], uses: ['hero'], inFolder: 'sprites' });
  });

  test('two kinds OR together and a kind and a state AND together', () => {
    const { tree, statuses } = statusesOf();
    const both = filterTree(tree, search('kind:sprite kind:sheet'), context(statuses));
    expect(both?.matches.has(`${ROOT}/sheets/all.bxsheet`)).toBe(true);
    expect(both?.matches.has(`${ROOT}/sprites/hero.bxsprite`)).toBe(true);
    const narrow = filterTree(tree, search('kind:sprite is:unsaved'), context(statuses));
    expect([...(narrow?.matches ?? [])]).toEqual([`${ROOT}/sprites/hero.bxsprite`]);
  });

  test('keeps the ancestors of a match', () => {
    const { tree, statuses } = statusesOf();
    const found = filterTree(tree, search('grass'), context(statuses));
    const rows = flattenView(treeNest(tree, null), new Set(), found?.visible ?? null);
    expect(rows.map((each) => each.item.name)).toEqual(['shared', 'tiles', 'grass']);
    expect(found?.visible.has(LINKED)).toBe(true);
  });

  test('finds what has a missing link', () => {
    const { tree, statuses } = statusesOf();
    const found = filterTree(tree, search('', true), context(statuses));
    expect([...(found?.matches ?? [])].sort()).toEqual([`${ROOT}/sheets/all.bxsheet`, `${ROOT}/sprites/gone.bxsprite`].sort());
  });

  test('has no filter for an empty query', () => {
    const { tree, statuses } = statusesOf();
    expect(filterTree(tree, search(''), context(statuses))).toBeNull();
  });

  test('toggles and removes tokens in the search text', () => {
    expect(toggledToken('', 'kind:sprite').trim()).toBe('kind:sprite');
    expect(toggledToken('kind:sprite is:open', 'kind:sprite')).toBe('is:open');
    expect(hasToken('a kind:Sheet', 'kind:sheet')).toBe(true);
    expect(withoutToken('uses:"my hero" b', 'uses:"my hero"')).toBe('b');
  });
});

describe('list mode', () => {
  test('groups the assets by kind with a section header for each and sorts inside', () => {
    const rows = listRows({ tree: treeOf(), matches: null, collapsed: new Set(), view: { group: 'kind', sort: 'name' } });
    expect(rows.filter((each) => each.depth === 0).map((each) => each.item.name)).toEqual(['Sprites', 'Sheets', 'Palettes', 'Other files']);
    expect(rows.filter((each) => each.item.kind === 'sprite').map((each) => each.item.name)).toEqual(['2', '10', 'boss', 'grass', 'hero']);
  });

  test('nests each section under its header and can drop the sections', () => {
    const rows = listRows({ tree: treeOf(), matches: null, collapsed: new Set(), view: { group: 'kind', sort: 'name' } });
    const nested = listNest(rows);
    expect(nested.top.map((each) => each.name)).toEqual(['Sprites', 'Sheets', 'Palettes', 'Other files']);
    const first = nested.top[0];
    expect(first && nested.childrenOf(first)?.length).toBe(5);
    const flat = listNest(listRows({ tree: treeOf(), matches: null, collapsed: new Set(), view: { group: 'none', sort: 'name' } }));
    expect(flat.top.every((each) => flat.childrenOf(each) === undefined)).toBe(true);
  });

  test('hides the rows of a collapsed section', () => {
    const rows = listRows({ tree: treeOf(), matches: null, collapsed: new Set(['group:kind:sprite']), view: { group: 'kind', sort: 'name' } });
    expect(rows.some((each) => each.item.kind === 'sprite')).toBe(false);
  });
});

describe('selection', () => {
  const rows = flattenView(treeNest(treeOf(), null), new Set([`${ROOT}/sprites`]), null);
  const key = (name: string): string => rows.find((each) => each.item.name === name)?.item.key ?? '';

  test('a click selects one, Ctrl toggles and Shift extends a range from the anchor', () => {
    const start = { keys: new Set<string>(), anchor: null, focus: null };
    const first = applyClick({ selection: start, rows, key: key('2'), shift: false, toggle: false });
    expect([...first.keys]).toEqual([key('2')]);
    const range = applyClick({ selection: first, rows, key: key('boss'), shift: true, toggle: false });
    expect([...range.keys]).toEqual([key('2'), key('10'), key('boss')]);
    const toggled = applyClick({ selection: range, rows, key: key('10'), shift: false, toggle: true });
    expect([...toggled.keys]).toEqual([key('2'), key('boss')]);
  });
});
