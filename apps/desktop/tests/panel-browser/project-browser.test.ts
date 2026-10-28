/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { buildStatuses } from '../../src/panel-browser/build-statuses';
import { filterTree } from '../../src/panel-browser/filter-tree';
import { listRows } from '../../src/panel-browser/list-rows';
import { mergeQueries } from '../../src/panel-browser/merge-queries';
import { moveFocus } from '../../src/panel-browser/move-focus';
import { parseSearch } from '../../src/panel-browser/parse-search';
import { EMPTY_QUERY } from '../../src/panel-browser/project-browser.constants';
import { typeAhead } from '../../src/panel-browser/type-ahead';
import { usersOf } from '../../src/panel-browser/users-of';
import { visibleRows } from '../../src/panel-browser/visible-rows';
import { applyClick } from '../../src/panel-browser/apply-click';
import { LINKED, ROOT, row, treeOf } from './browser-fixture';

const heroRow = row('sprite', `${ROOT}/sprites/hero.bxsprite`, { dirty: true });
const sheetRow = row('sheet', `${ROOT}/sheets/all.bxsheet`);
const ghostRow = row('sprite', `${ROOT}/sprites/gone.bxsprite`);
const referrers = new Map<string, readonly string[]>([
  [heroRow.assetId ?? '', [sheetRow.assetId ?? '']],
  [ghostRow.assetId ?? '', [sheetRow.assetId ?? '']],
]);

const statusesOf = (rows = [heroRow, sheetRow, ghostRow]) => {
  const tree = treeOf(rows);
  return { tree, statuses: buildStatuses({ tree, referrers, openKeys: new Set([`sprite:${heroRow.assetId}`]), activeKey: `sprite:${heroRow.assetId}` }) };
};

describe('the project tree', () => {
  test('puts the main folder first, folders before files, natural order, linked roots after', () => {
    const rows = visibleRows({ tree: treeOf([]), expanded: new Set([`${ROOT}/sprites`]), visible: null });
    expect(rows.map((each) => each.item.name)).toEqual(['palettes', 'sheets', 'sprites', '2', '10', 'boss', 'hero', 'notes.txt', 'shared']);
    expect(rows.find((each) => each.item.name === 'shared')?.item.role).toBe('linked');
    expect(rows.find((each) => each.item.name === 'hero')?.depth).toBe(1);
    expect(rows.find((each) => each.item.name === 'sprites')?.expanded).toBe(true);
  });

  test('gives every row its position in the set for the screen reader', () => {
    const rows = visibleRows({ tree: treeOf([]), expanded: new Set([`${ROOT}/sprites`]), visible: null });
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
    const hero = statuses.get(`${ROOT}/sprites/hero.bxsprite`);
    expect(hero).toMatchObject({ unsaved: true, open: true, active: true, usedBy: 1, unused: false });
    expect(statuses.get(`${ROOT}/sheets/all.bxsheet`)?.open).toBe(false);
  });

  test('puts assets with no file yet in a group of their own', () => {
    const tree = treeOf([row('sprite', '', { dirty: true })]);
    const rows = visibleRows({ tree, expanded: new Set(['group:unsaved']), visible: null });
    expect(rows.at(-2)?.item.role).toBe('group');
    expect(rows.at(-1)?.depth).toBe(1);
  });
});

describe('search tokens and filters', () => {
  test('turns kind, is, used and in tokens into a query and leaves the rest as text', () => {
    const split = parseSearch('hero kind:sprite is:unsaved used:hero in:sprites/ extra kind:nonsense');
    expect(split.query).toMatchObject({ kinds: ['sprite'], states: ['unsaved'], usedBy: 'hero', inside: 'sprites', text: 'hero extra kind:nonsense' });
    expect(split.rest).toBe('hero extra kind:nonsense');
  });

  test('two kinds OR together and a kind and a state AND together', () => {
    const { tree, statuses } = statusesOf();
    const both = filterTree(tree, { ...EMPTY_QUERY, kinds: ['sprite', 'sheet'] }, { statuses, users: null });
    expect([...(both?.matches ?? [])].sort()).toContain(`${ROOT}/sheets/all.bxsheet`);
    expect(both?.matches.has(`${ROOT}/sprites/hero.bxsprite`)).toBe(true);
    const narrow = filterTree(tree, { ...EMPTY_QUERY, kinds: ['sprite'], states: ['unsaved'] }, { statuses, users: null });
    expect([...(narrow?.matches ?? [])]).toEqual([`${ROOT}/sprites/hero.bxsprite`]);
  });

  test('keeps the ancestors of a match and opens them while a filter is on', () => {
    const { tree, statuses } = statusesOf();
    const found = filterTree(tree, { ...EMPTY_QUERY, text: 'grass' }, { statuses, users: null });
    const rows = visibleRows({ tree, expanded: new Set(), visible: found?.visible ?? null });
    expect(rows.map((each) => each.item.name)).toEqual(['shared', 'tiles', 'grass']);
    expect(found?.visible.has(LINKED)).toBe(true);
  });

  test('finds the users of a named asset', () => {
    const { tree, statuses } = statusesOf();
    const users = usersOf(tree, referrers, 'hero');
    expect([...(users ?? [])]).toEqual([sheetRow.assetId]);
    const found = filterTree(tree, { ...EMPTY_QUERY, usedBy: 'hero' }, { statuses, users });
    expect([...(found?.matches ?? [])]).toEqual([`${ROOT}/sheets/all.bxsheet`]);
  });

  test('has no filter for an empty query and merges chips with typed tokens', () => {
    const { tree, statuses } = statusesOf();
    expect(filterTree(tree, EMPTY_QUERY, { statuses, users: null })).toBeNull();
    const merged = mergeQueries({ ...EMPTY_QUERY, kinds: ['sheet'] }, parseSearch('kind:sprite x').query);
    expect(merged).toMatchObject({ kinds: ['sheet', 'sprite'], text: 'x' });
  });
});

describe('list mode', () => {
  test('groups the assets by kind with a section header for each and sorts inside', () => {
    const rows = listRows({ tree: treeOf([]), matches: null, collapsed: new Set(), view: { group: 'kind', sort: 'name' } });
    const heads = rows.filter((each) => each.depth === 0).map((each) => each.item.name);
    expect(heads).toEqual(['Sprites', 'Sheets', 'Palettes', 'Other files']);
    expect(rows.filter((each) => each.item.kind === 'sprite').map((each) => each.item.name)).toEqual(['2', '10', 'boss', 'grass', 'hero']);
  });

  test('hides the rows of a collapsed section and can drop the sections', () => {
    const rows = listRows({ tree: treeOf([]), matches: null, collapsed: new Set(['group:kind:sprite']), view: { group: 'kind', sort: 'name' } });
    expect(rows.some((each) => each.item.kind === 'sprite')).toBe(false);
    const flat = listRows({ tree: treeOf([]), matches: null, collapsed: new Set(), view: { group: 'none', sort: 'name' } });
    expect(flat.every((each) => each.depth === 0)).toBe(true);
  });
});

describe('keyboard and selection', () => {
  const rows = visibleRows({ tree: treeOf([]), expanded: new Set([`${ROOT}/sprites`]), visible: null });
  const key = (name: string): string => rows.find((each) => each.item.name === name)?.item.key ?? '';

  test('moves with the arrows, Home and End', () => {
    expect(moveFocus(rows, key('palettes'), 'ArrowDown')).toEqual({ kind: 'focus', key: key('sheets') });
    expect(moveFocus(rows, key('palettes'), 'ArrowUp')).toEqual({ kind: 'none' });
    expect(moveFocus(rows, key('palettes'), 'End')).toEqual({ kind: 'focus', key: key('shared') });
  });

  test('Right opens a closed folder or enters an open one, Left closes it or goes to the parent', () => {
    expect(moveFocus(rows, key('sheets'), 'ArrowRight')).toEqual({ kind: 'expand', key: key('sheets') });
    expect(moveFocus(rows, key('sprites'), 'ArrowRight')).toEqual({ kind: 'focus', key: key('2') });
    expect(moveFocus(rows, key('sprites'), 'ArrowLeft')).toEqual({ kind: 'collapse', key: key('sprites') });
    expect(moveFocus(rows, key('hero'), 'ArrowLeft')).toEqual({ kind: 'focus', key: key('sprites') });
  });

  test('type ahead jumps to the next name that starts with the letters', () => {
    expect(typeAhead(rows, key('palettes'), 'h')).toBe(key('hero'));
    expect(typeAhead(rows, key('palettes'), 'zz')).toBeNull();
  });

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
