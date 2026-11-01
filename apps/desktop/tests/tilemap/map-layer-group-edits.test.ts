/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { useLayerViewStore } from '../../src/stores/useLayerViewStore';
import { currentMap } from '../../src/tilemap/current-map';
import { mapLayerActions } from '../../src/tilemap/map-layer-actions';
import { revision } from '../sheet/sheet-harness';
import { cellsNow, groupOf, mapNow, openMapFile, twoLayers } from './map-harness';

beforeEach(openMapFile);

describe('S2 map layer group edits', { tags: ['standard'] }, () => {
  it('moves a child out of its group to just above it', () => {
    const { low, high } = twoLayers();
    mapLayerActions.group([low, high]);
    mapLayerActions.moveOut([low]);
    const moved = mapNow().layers.find((layer) => layer.id === low);
    expect(moved?.parentId).toBeUndefined();
    expect(mapNow().layers.find((layer) => layer.id === high)?.parentId).toBe(groupOf()?.id);
    expect(mapNow().layers.findIndex((layer) => layer.id === low)).toBeGreaterThan(mapNow().layers.findIndex((layer) => layer.id === groupOf()?.id));
  });

  it('selects every child of a group', () => {
    const { low, high } = twoLayers();
    mapLayerActions.group([low, high]);
    mapLayerActions.selectChildren(groupOf()?.id ?? '');
    expect([...useLayerViewStore.getState().selected].sort()).toEqual([low, high].sort());
  });

  it('flattens a group into one layer where the top layer wins, and undoes it in one step', () => {
    const { low, high } = twoLayers();
    mapLayerActions.group([low, high]);
    const before = revision();
    mapLayerActions.flattenGroup(groupOf()?.id ?? '');
    expect(revision() - before).toBe(1);
    expect(mapNow().layers).toHaveLength(1);
    expect(mapNow().layers[0]?.id).toBe(low);
    expect(cellsNow(0)[0]).toBe(1);
    expect(currentMap()?.layer.id).toBe(low);
    stepHistory('undo');
    expect(mapNow().layers).toHaveLength(3);
    expect(groupOf()).toBeDefined();
  });
});
