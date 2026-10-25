/* @layer tests @kind test */
import { ASSET_KIND } from '@bxel/document';
import type { AssetSlice, MapLayerId, Tilemap, TilemapId, TilesetId } from '@bxel/document';
import { assetDigest, encodeTilemap } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';

const CLOCK = (): number => 0;
const tilesetId = 'tls_000001' as TilesetId;

const layerOf = (row: number, cells: Uint32Array) => ({ id: `tml_00000${row + 1}` as MapLayerId, name: `Layer ${row + 1}`, visible: true, locked: false, cells });
const cellsOf = (row: number): Uint32Array => Uint32Array.from({ length: 64 }, (_, at) => (at * 3 + row) % 5);

const sliceOf = (layers: Tilemap['layers']): AssetSlice => ({
  kind: ASSET_KIND.tilemap,
  id: 'tlm_000001',
  name: 'Map',
  artwork: { tilemaps: [{ id: 'tlm_000001' as TilemapId, name: 'Map', tilesetId, columns: 8, rows: 8, layers }] },
  links: [{ id: tilesetId, path: '../tiles/map.bxtileset' }],
});

describe('tilemap layer bytes are cached by the cells buffer', () => {
  it('gives the same digest and file bytes on a repeat and for an equal copy', () => {
    const cells = [cellsOf(0), cellsOf(1)];
    const slice = sliceOf(cells.map((each, row) => layerOf(row, each)));
    const first = assetDigest(slice);
    expect(assetDigest(slice)).toBe(first);
    const copy = sliceOf(cells.map((each, row) => layerOf(row, each.slice())));
    expect(assetDigest(copy)).toBe(first);
    expect(encodeTilemap(copy, null, CLOCK)).toEqual(encodeTilemap(slice, null, CLOCK));
  });

  it('sees an edit made on a new buffer and leaves the old one as it was', () => {
    const original = cellsOf(0);
    const before = assetDigest(sliceOf([layerOf(0, original)]));
    const edited = original.slice();
    edited[7] = (edited[7] ?? 0) + 1;
    const after = assetDigest(sliceOf([layerOf(0, edited)]));
    expect(after).not.toBe(before);
    expect(assetDigest(sliceOf([layerOf(0, original)]))).toBe(before);
    const undone = edited.slice();
    undone[7] = original[7] ?? 0;
    expect(assetDigest(sliceOf([layerOf(0, undone)]))).toBe(before);
  });
});
