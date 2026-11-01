/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addToSheet } from '../../src/sheet-manager/add-to-sheet';
import { allFacts } from '../../src/sheet-manager/all-facts';
import { resizeSprites } from '../../src/sheet-manager/resize-sprites';
import { managerSheet } from '../../src/sheet-manager/manager-sheet';
import { removeEntries } from '../../src/sheet-manager/remove-entries';
import { nameMatches } from '../../src/sheet-manager/name-matches';
import { sizeOptions } from '../../src/sheet-manager/size-options';
import { visibleFacts } from '../../src/sheet-manager/visible-facts';
import { NO_FILTER } from '../../src/sheet-manager/manager.constants';
import type { ListQuery } from '../../src/sheet-manager/manager.type';
import { artwork, openFile } from '../sheet/sheet-harness';
import { BASE_QUERY, idsOf } from './manager-harness';
import { libraryFacts } from '../../src/sheet-manager/library-facts';

vi.mock('../../src/documents/document-host.constants', async () => (await import('../legacy/legacy-app-commands')).legacyAppCommands());

const shown = (change: Partial<ListQuery>): string[] => {
  const art = artwork();
  const facts = allFacts(art, managerSheet(art, null, null));
  return visibleFacts(facts, { ...BASE_QUERY, ...change }).map((fact) => fact.sprite.name);
};

beforeEach(() => {
  openFile(['walk_10', 'walk_2', 'idle', 'Walk_1'], 8);
  addToSheet(artwork().sprites.map((sprite) => sprite.id), null);
});

describe('S2 name search', { tags: ['standard'] }, () => {
  it('matches a part of a name without caring for case', () => {
    expect(nameMatches('Walk_1', 'walk')).toBe(true);
    expect(nameMatches('idle', 'walk')).toBe(false);
    expect(nameMatches('idle', '  ')).toBe(true);
  });

  it('treats a star and a question mark as a pattern over the whole name', () => {
    expect(nameMatches('walk_10', 'walk_*')).toBe(true);
    expect(nameMatches('walk_10', 'walk_?')).toBe(false);
    expect(nameMatches('walk_1', 'walk_?')).toBe(true);
    expect(nameMatches('a.b', 'a.b*')).toBe(true);
    expect(nameMatches('axb', 'a.b*')).toBe(false);
  });
});

describe('S2 the shown list', { tags: ['standard'] }, () => {
  it('keeps the sheet order by default and reverses it on request', () => {
    expect(shown({})).toEqual(['sprite', 'walk_10', 'walk_2', 'idle', 'Walk_1']);
    expect(shown({ sortDown: true })).toEqual(['Walk_1', 'idle', 'walk_2', 'walk_10', 'sprite']);
  });

  it('sorts names so that walk_2 comes before walk_10', () => {
    expect(shown({ sortKey: 'name' })).toEqual(['idle', 'sprite', 'Walk_1', 'walk_2', 'walk_10']);
    expect(shown({ sortKey: 'name', sortDown: true }).at(0)).toBe('walk_10');
  });

  it('filters by a search and keeps the order', () => {
    expect(shown({ query: 'walk' })).toEqual(['walk_10', 'walk_2', 'Walk_1']);
    expect(shown({ query: 'walk_?' })).toEqual(['walk_2', 'Walk_1']);
    expect(shown({ query: 'nothing' })).toEqual([]);
  });

  it('sorts by size and area and breaks ties by name', () => {
    resizeSprites(idsOf('idle'), { width: 4, height: 16, anchor: 'top-left' });
    resizeSprites(idsOf('walk_2'), { width: 20, height: 2, anchor: 'top-left' });
    expect(shown({ sortKey: 'area' })).toEqual(['walk_2', 'idle', 'Walk_1', 'walk_10', 'sprite']);
    expect(shown({ sortKey: 'size' }).at(0)).toBe('idle');
    expect(shown({ sortKey: 'size' }).at(-1)).toBe('sprite');
    expect(sizeOptions(artwork().sprites)).toEqual(['20x2', '4x16', '8x8', '32x32']);
    expect(shown({ filter: { ...NO_FILTER, size: '8x8' } })).toEqual(['walk_10', 'Walk_1']);
  });

  it('sorts by the date created and keeps the sprites with an unknown date last', () => {
    const art = artwork();
    const stamps: Record<string, number> = { walk_2: 30, idle: 10, walk_10: 20 };
    const stamped = { ...art, sprites: art.sprites.map((sprite) => ({ ...sprite, created: stamps[sprite.name] })) };
    const facts = allFacts(stamped, managerSheet(stamped, null, null));
    const names = (sortDown: boolean): string[] => visibleFacts(facts, { ...BASE_QUERY, sortKey: 'created', sortDown }).map((fact) => fact.sprite.name);
    expect(names(false)).toEqual(['idle', 'walk_10', 'walk_2', 'sprite', 'Walk_1']);
    expect(names(true)).toEqual(['walk_2', 'walk_10', 'idle', 'sprite', 'Walk_1']);
  });

  it('lists only the entries of the sheet, in the order the sheet holds them, and keeps the rest for the library', () => {
    const art = artwork();
    const sheet = art.sheets[0] ?? null;
    expect(allFacts(art, sheet).map((fact) => fact.sprite.name)).toEqual(['sprite', 'walk_10', 'walk_2', 'idle', 'Walk_1']);
    removeEntries(idsOf('idle', 'Walk_1'), [], sheet?.id ?? null);
    const after = artwork();
    const next = after.sheets[0] ?? null;
    expect(allFacts(after, next).map((fact) => fact.sprite.name)).toEqual(['sprite', 'walk_10', 'walk_2']);
    expect(libraryFacts(after, next).map((fact) => fact.sprite.name)).toEqual(['idle', 'Walk_1']);
    expect(allFacts(after, null)).toEqual([]);
  });

  it('filters by kind and by slices, and an animation chip hides every sprite', () => {
    expect(shown({ filter: { ...NO_FILTER, kind: 'animations' } })).toEqual([]);
    expect(shown({ filter: { ...NO_FILTER, kind: 'sprites' } })).toHaveLength(5);
    expect(shown({ filter: { ...NO_FILTER, slices: true } })).toEqual([]);
    expect(allFacts(artwork(), artwork().sheets[0] ?? null).find((fact) => fact.sprite.name === 'idle')?.sheets).toEqual(['Sheet']);
  });

  it('sorts names naturally in the name sort', () => {
    expect(shown({ sortKey: 'name' }).indexOf('walk_2')).toBeLessThan(shown({ sortKey: 'name' }).indexOf('walk_10'));
  });
});
