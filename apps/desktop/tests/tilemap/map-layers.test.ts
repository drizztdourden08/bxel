/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { addMapLayer } from '../../src/tilemap/add-map-layer';
import { currentMap } from '../../src/tilemap/current-map';
import { deleteMapLayer } from '../../src/tilemap/delete-map-layer';
import { mapLayerActions } from '../../src/tilemap/map-layer-actions';
import { moveMapLayer } from '../../src/tilemap/move-map-layer';
import { placeStampAt } from '../../src/tilemap/place-stamp-at';
import { stepMapLayer } from '../../src/tilemap/step-map-layer';
import { strokePlace } from '../../src/tilemap/stroke-place';
import { lastNotice, revision } from '../sheet/sheet-harness';
import { cellsNow, mapNow, openMapFile, picture } from './map-harness';

beforeEach(openMapFile);

const names = (): string[] => mapNow().layers.map((layer) => layer.name);

describe('map layers', () => {
  it('adds a layer above the current one and makes it the target', () => {
    const before = revision();
    expect(addMapLayer()).toBe(true);
    expect(revision() - before).toBe(1);
    expect(mapNow().layers).toHaveLength(2);
    expect(currentMap()?.layer.id).toBe(mapNow().layers[1]?.id);
    placeStampAt([{ x: 0, y: 0 }]);
    expect(cellsNow(1)[0]).toBe(2);
    expect(cellsNow(0)[0]).toBe(0);
  });

  it('draws a visible upper layer over the lower one', () => {
    placeStampAt([{ x: 0, y: 0 }]);
    addMapLayer();
    useTilemapStore.getState().setStamp({ columns: 1, rows: 1, keys: [1] });
    placeStampAt([{ x: 0, y: 0 }]);
    expect(picture()[0]?.slice(0, 2)).toEqual([1, 1]);
    mapLayerActions.setFlag([mapNow().layers[1]?.id ?? ''], 'visible', false);
    expect(picture()[0]?.slice(0, 2)).toEqual([2, 3]);
  });

  it('refuses a hidden or a locked layer with the reason and changes nothing', () => {
    const id = mapNow().layers[0]?.id ?? ('' as never);
    mapLayerActions.setFlag([id], 'visible', false);
    expect(strokePlace([{ x: 0, y: 0 }])).toBe(false);
    expect(lastNotice()).toContain('hidden');
    mapLayerActions.setFlag([id], 'visible', true);
    mapLayerActions.setFlag([id], 'locked', true);
    expect(strokePlace([{ x: 0, y: 0 }])).toBe(false);
    expect(lastNotice()).toContain('locked');
    expect(cellsNow().every((cell) => cell === 0)).toBe(true);
  });

  it('renames, reorders and deletes a layer, and undoes each in one step', () => {
    addMapLayer();
    const [first, second] = mapNow().layers;
    expect(mapLayerActions.rename(second?.id ?? '', 'Top')).toBeNull();
    expect(names()[1]).toBe('Top');
    expect(moveMapLayer(-1)).toBe(true);
    expect(mapNow().layers[0]?.id).toBe(second?.id);
    expect(deleteMapLayer()).toBe(true);
    expect(mapNow().layers.map((layer) => layer.id)).toEqual([first?.id]);
    stepHistory('undo');
    expect(mapNow().layers).toHaveLength(2);
    stepHistory('undo');
    stepHistory('undo');
    expect(names()[1]).not.toBe('Top');
  });

});

describe('map layer limits', () => {
  it('keeps at least one layer and refuses a name that is taken', () => {
    expect(deleteMapLayer()).toBe(false);
    expect(lastNotice()).toContain('at least one');
    addMapLayer();
    expect(mapLayerActions.rename(mapNow().layers[1]?.id ?? '', mapNow().layers[0]?.name ?? '')).not.toBeNull();
  });

  it('steps the target up and down and stops at the ends', () => {
    addMapLayer();
    stepMapLayer(-1);
    expect(currentMap()?.layer.id).toBe(mapNow().layers[0]?.id);
    stepMapLayer(-1);
    expect(currentMap()?.layer.id).toBe(mapNow().layers[0]?.id);
    stepMapLayer(1);
    expect(currentMap()?.layer.id).toBe(mapNow().layers[1]?.id);
  });
});
