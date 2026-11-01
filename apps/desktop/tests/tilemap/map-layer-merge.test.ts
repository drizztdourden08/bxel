/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { duplicateMapLayer } from '../../src/tilemap/duplicate-map-layer';
import { mergeMapLayerDown } from '../../src/tilemap/merge-map-layer-down';
import { placeStampAt } from '../../src/tilemap/place-stamp-at';
import { cellsNow, mapNow, openMapFile, twoLayers } from './map-harness';

beforeEach(openMapFile);

describe('S2 map layer duplicate and merge', { tags: ['standard'] }, () => {
  it('duplicates the current layer and undoes it in one step', () => {
    placeStampAt([{ x: 0, y: 0 }]);
    expect(duplicateMapLayer()).toBe(true);
    expect(mapNow().layers).toHaveLength(2);
    expect(cellsNow(1)[0]).toBe(2);
    stepHistory('undo');
    expect(mapNow().layers).toHaveLength(1);
  });

  it('merges a layer down with the top cell winning, and undoes it in one step', () => {
    twoLayers();
    expect(mergeMapLayerDown()).toBe(true);
    expect(mapNow().layers).toHaveLength(1);
    expect(cellsNow(0)[0]).toBe(1);
    stepHistory('undo');
    expect(mapNow().layers).toHaveLength(2);
    expect(cellsNow(0)[0]).toBe(2);
  });
});
