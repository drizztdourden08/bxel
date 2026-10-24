/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { DEFAULT_QUERY } from '../../src/asset-list/asset-list.constants';
import type { AssetQuery, AssetRow, RowKind } from '../../src/asset-list/asset-list.type';
import { chipCounts } from '../../src/asset-list/chip-counts';
import { queryRows } from '../../src/asset-list/query-rows';

const FOLDERS = ['sprites', 'sheets', 'palettes', 'tilemaps', 'art', 'notes'];

const row = (kind: RowKind, index: number, extra: Partial<AssetRow> = {}): AssetRow => ({
  id: `/p/${FOLDERS[index % FOLDERS.length]}/${kind}-${index}`,
  kind,
  assetId: `${kind}_${index}`,
  name: `${kind}-${String(index).padStart(3, '0')}`,
  path: `/p/${FOLDERS[index % FOLDERS.length]}/${kind}-${index}`,
  folder: FOLDERS[index % FOLDERS.length] ?? '',
  modified: 1000 + index,
  dirty: false,
  loaded: true,
  usedBy: [],
  preview: null,
  ...extra,
});

const many = (kind: RowKind, count: number, extra: (index: number) => Partial<AssetRow> = () => ({})): AssetRow[] =>
  Array.from({ length: count }, (_unused, index) => row(kind, index, extra(index)));

const usersOfSprite = (index: number): string[] => {
  if (index < 6) return ['sheet_0', 'sheet_1'];
  return index < 12 ? ['sheet_2'] : [];
};

const fixture = (): AssetRow[] => [
  ...many('sprite', 40, (index) => ({ usedBy: usersOfSprite(index) })),
  ...many('sheet', 20),
  ...many('palette', 10),
  ...many('tileset', 5),
  ...many('tilemap', 5),
  ...many('image', 10),
  ...many('other', 10),
];

const ask = (patch: Partial<AssetQuery>): AssetRow[] => [...queryRows(fixture(), { ...DEFAULT_QUERY, ...patch })];

describe('asset list model on a 100 asset fixture', () => {
  test('All keeps every row and the chips count the kinds', () => {
    expect(ask({})).toHaveLength(100);
    const counts = Object.fromEntries(chipCounts(fixture(), '').map((each) => [each.chip, each.count]));
    expect(counts).toEqual({ all: 100, sprite: 40, sheet: 20, palette: 10, tilemap: 10, image: 10, other: 10 });
  });

  test('each chip narrows to its kinds, and Tilemaps holds tilesets and maps', () => {
    expect(new Set(ask({ chip: 'sprite' }).map((each) => each.kind))).toEqual(new Set(['sprite']));
    expect(ask({ chip: 'sheet' })).toHaveLength(20);
    expect(ask({ chip: 'palette' })).toHaveLength(10);
    expect(new Set(ask({ chip: 'tilemap' }).map((each) => each.kind))).toEqual(new Set(['tileset', 'tilemap']));
    expect(ask({ chip: 'image' })).toHaveLength(10);
    expect(ask({ chip: 'other' })).toHaveLength(10);
  });

  test('search matches the name, the folder and the kind, and combines with a chip', () => {
    expect(ask({ search: 'sprite-007' }).map((each) => each.name)).toEqual(['sprite-007']);
    expect(ask({ search: 'PALETTES', chip: 'palette' }).every((each) => each.folder === 'palettes')).toBe(true);
    expect(ask({ search: 'tileset' }).map((each) => each.kind)).toEqual(Array(5).fill('tileset'));
    expect(ask({ search: 'nothing like this' })).toEqual([]);
  });

  test('chip counts follow the search', () => {
    const counts = Object.fromEntries(chipCounts(fixture(), 'sheet-00').map((each) => [each.chip, each.count]));
    expect(counts.all).toBe(10);
    expect(counts.sheet).toBe(10);
    expect(counts.sprite).toBe(0);
  });

  test('used by shows only the sheets that hold the sprite', () => {
    const shown = ask({ usedBySprite: 'sprite_1' });
    expect(shown.map((each) => each.assetId).sort()).toEqual(['sheet_0', 'sheet_1']);
    expect(ask({ usedBySprite: 'sprite_20' })).toEqual([]);
    expect(ask({ usedBySprite: 'sprite_7' }).map((each) => each.assetId)).toEqual(['sheet_2']);
  });

  test('sorts by name, kind, modified and folder', () => {
    const names = ask({ chip: 'sprite' }).map((each) => each.name);
    expect(names).toEqual([...names].sort());
    expect(ask({ sort: 'kind' }).slice(0, 40).every((each) => each.kind === 'sprite')).toBe(true);
    expect(ask({ sort: 'kind' }).at(-1)?.kind).toBe('other');
    const stamps = ask({ sort: 'modified' }).map((each) => each.modified);
    expect(stamps).toEqual([...stamps].sort((left, right) => right - left));
    const folders = ask({ sort: 'folder' }).map((each) => each.folder);
    expect(folders).toEqual([...folders].sort((left, right) => left.localeCompare(right)));
  });
});
