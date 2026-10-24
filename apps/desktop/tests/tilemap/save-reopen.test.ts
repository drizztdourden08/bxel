/* @layer renderer-app @kind test */
import { findBrokenCells, flattenTilemap } from '@bxel/document';
import { decodeArtwork, encodeArtwork } from '@bxel/document/native';
import { beforeEach, describe, expect, it } from 'vitest';
import { artworkBytes } from '../../src/files/artwork-bytes';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { addMapLayer } from '../../src/tilemap/add-map-layer';
import { makeUnique } from '../../src/tilemap/make-unique';
import { placeStampAt } from '../../src/tilemap/place-stamp-at';
import { artworkNow, cellsNow, mapNow, openMapFile, paintTile, tilesetNow } from './map-harness';

const reopened = () => {
  const { host, activeId } = useDocumentStore.getState();
  const state = activeId === null ? null : host.view(activeId)?.state;
  if (!state) throw new Error('no document');
  const report = decodeArtwork(artworkBytes(state, () => 0));
  if (!report.artwork) throw new Error('could not reopen');
  return report;
};

beforeEach(() => {
  openMapFile();
  useTilemapStore.getState().setFlags({ flipX: true, flipY: true, diagonal: false });
  placeStampAt([{ x: 0, y: 0 }, { x: 2, y: 1 }]);
  useTilemapStore.getState().setFlags({ flipX: false, flipY: false, diagonal: true });
  useTilemapStore.getState().setStamp({ columns: 1, rows: 1, keys: [1] });
  placeStampAt([{ x: 3, y: 2 }]);
  addMapLayer();
});

describe('saving and reopening a map', () => {
  it('keeps the ids, the tile keys and the turn of every cell', () => {
    const report = reopened();
    expect(report.outcome).toBe('ok');
    expect(report.mapDamage).toEqual([]);
    const map = report.artwork?.tilemaps[0];
    expect(map?.id).toBe(mapNow().id);
    expect(map?.tilesetId).toBe(tilesetNow().id);
    expect(map?.layers.map((layer) => layer.id)).toEqual(mapNow().layers.map((layer) => layer.id));
    expect(Array.from(map?.layers[0]?.cells ?? [])).toEqual(cellsNow());
    expect(cellsNow()[0]).toBe(0xc0000002);
    expect(cellsNow()[11]).toBe(0x20000001);
  });

  it('keeps the tile sprites and the pixels they draw', () => {
    paintTile(2, [6, 6, 6, 6]);
    const before = flattenTilemap(artworkNow(), mapNow().id);
    const report = reopened();
    const map = report.artwork?.tilemaps[0];
    const after = report.artwork && map ? flattenTilemap(report.artwork, map.id) : null;
    expect(after?.pixels).toEqual(before.pixels);
    expect(report.artwork?.tilesets[0]?.tiles).toEqual(tilesetNow().tiles);
  });

  it('keeps a made-unique tile and leaves no dangling reference', () => {
    useTilemapStore.getState().setLayer(mapNow().layers[0]?.id ?? null);
    useTilemapStore.getState().setSelection({ rect: { x: 0, y: 0, width: 1, height: 1 }, from: 2 });
    makeUnique();
    const report = reopened();
    expect(report.artwork?.tilesets[0]?.tiles.map((tile) => tile.key)).toEqual([1, 2, 3]);
    expect(report.artwork && findBrokenCells(report.artwork, 10)).toEqual([]);
    expect(report.artwork?.tilemaps[0]?.layers[0]?.cells[0]).toBe(0xc0000003);
  });

  it('writes the same bytes twice', () => {
    const state = useDocumentStore.getState().host.view(useDocumentStore.getState().activeId ?? ('' as never))?.state;
    if (!state) throw new Error('no document');
    expect(encodeArtwork(state, null, () => 0)).toEqual(encodeArtwork(state, null, () => 0));
  });
});
