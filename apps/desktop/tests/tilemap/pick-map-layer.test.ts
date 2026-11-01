/* @layer renderer-app @kind test */
import type { MapLayerId } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { addMapLayer } from '../../src/tilemap/add-map-layer';
import { pickMapLayer } from '../../src/tilemap/pick-map-layer';
import { placeStampAt } from '../../src/tilemap/place-stamp-at';
import { topLayerAt } from '../../src/tilemap/top-layer-at';
import { highlightedMapRgba } from '../../src/views/TilemapCanvas/behavior/highlighted-map-rgba';
import { artworkNow, mapNow, openMapFile } from './map-harness';

const CHANNELS = 4;
const MAP_WIDTH = 8;

const alphaAt = (rgba: Uint8ClampedArray, x: number, y: number): number => rgba[(y * MAP_WIDTH + x) * CHANNELS + 3] ?? 0;

const layered = (): { low: MapLayerId; high: MapLayerId } => {
  useTilemapStore.getState().setStamp({ columns: 1, rows: 1, keys: [2] });
  placeStampAt([{ x: 1, y: 0 }]);
  addMapLayer();
  useTilemapStore.getState().setStamp({ columns: 1, rows: 1, keys: [1] });
  placeStampAt([{ x: 0, y: 0 }, { x: 1, y: 2 }]);
  const [low, high] = mapNow().layers;
  return { low: low?.id as MapLayerId, high: high?.id as MapLayerId };
};

beforeEach(openMapFile);

describe('K3 picking the layer under the pointer', { tags: ['critical'] }, () => {
  it('makes the topmost layer with a tile there the current layer', () => {
    const { low, high } = layered();
    useTilemapStore.getState().setLayer(low);
    expect(pickMapLayer({ x: 0, y: 0 })).toBe(true);
    expect(useTilemapStore.getState().layerId).toBe(high);
    expect(pickMapLayer({ x: 1, y: 0 })).toBe(true);
    expect(useTilemapStore.getState().layerId).toBe(low);
  });

  it('changes nothing over an empty cell or outside the map', () => {
    const { high } = layered();
    useTilemapStore.getState().setLayer(high);
    expect(pickMapLayer({ x: 3, y: 2 })).toBe(false);
    expect(pickMapLayer({ x: 40, y: 40 })).toBe(false);
    expect(useTilemapStore.getState().layerId).toBe(high);
  });

  it('skips a layer that is hidden', () => {
    const { low, high } = layered();
    const hidden = { ...mapNow(), layers: mapNow().layers.map((layer) => (layer.id === high ? { ...layer, visible: false } : layer)) };
    expect(topLayerAt(hidden, { x: 0, y: 0 })).toBeNull();
    expect(topLayerAt(mapNow(), { x: 0, y: 0 })?.id).toBe(high);
    expect(topLayerAt(mapNow(), { x: 1, y: 0 })?.id).toBe(low);
  });
});

describe('S2 highlighting the current layer on the map', { tags: ['standard'] }, () => {
  it('draws the other layers faded and the current layer in full', () => {
    layered();
    const onLow = highlightedMapRgba(artworkNow(), mapNow().id, 0);
    const onHigh = highlightedMapRgba(artworkNow(), mapNow().id, 1);
    if (!onLow || !onHigh) throw new Error('no picture');
    expect(alphaAt(onLow.rgba, 2, 0)).toBe(255);
    expect(alphaAt(onLow.rgba, 0, 0)).toBeGreaterThan(55);
    expect(alphaAt(onLow.rgba, 0, 0)).toBeLessThan(75);
    expect(alphaAt(onHigh.rgba, 0, 0)).toBe(255);
    expect(alphaAt(onHigh.rgba, 2, 0)).toBeGreaterThan(55);
    expect(alphaAt(onHigh.rgba, 2, 0)).toBeLessThan(75);
  });
});
