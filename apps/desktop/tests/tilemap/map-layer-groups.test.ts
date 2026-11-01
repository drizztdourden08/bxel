/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { useLayerViewStore } from '../../src/stores/useLayerViewStore';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { addMapLayer } from '../../src/tilemap/add-map-layer';
import { currentMap } from '../../src/tilemap/current-map';
import { duplicateMapLayer } from '../../src/tilemap/duplicate-map-layer';
import { mapLayerActions } from '../../src/tilemap/map-layer-actions';
import { mapLayerRows } from '../../src/tilemap/map-layer-rows';
import { mergeMapLayerDown } from '../../src/tilemap/merge-map-layer-down';
import { placeStampAt } from '../../src/tilemap/place-stamp-at';
import { revision } from '../sheet/sheet-harness';
import { cellsNow, mapNow, openMapFile } from './map-harness';

beforeEach(openMapFile);

const twoLayers = (): { low: string; high: string } => {
  placeStampAt([{ x: 0, y: 0 }]);
  addMapLayer();
  useTilemapStore.getState().setStamp({ columns: 1, rows: 1, keys: [1] });
  placeStampAt([{ x: 0, y: 0 }]);
  const [low, high] = mapNow().layers;
  return { low: low?.id ?? '', high: high?.id ?? '' };
};

const groupOf = () => mapNow().layers.find((layer) => layer.kind === 'group');

describe('S2 map layer groups', { tags: ['standard'] }, () => {
  it('groups the picked layers, lists the group above them and keeps drawing on a tile layer', () => {
    const { low, high } = twoLayers();
    const before = revision();
    mapLayerActions.group([low, high]);
    expect(revision() - before).toBe(1);
    const group = groupOf();
    expect(group).toBeDefined();
    expect(mapNow().layers.filter((layer) => layer.parentId === group?.id)).toHaveLength(2);
    const rows = mapLayerRows(mapNow());
    const row = rows.find((each) => each.id === group?.id);
    expect(row).toMatchObject({ kind: 'group', depth: 0, childCount: 2, thumb: null });
    expect(rows.filter((each) => each.parentId === group?.id).every((each) => each.depth === 1 && each.kind === 'pixel')).toBe(true);
    expect(currentMap()?.layer.kind).not.toBe('group');
  });

  it('makes a group row activate its top tile layer', () => {
    const { low, high } = twoLayers();
    mapLayerActions.group([low, high]);
    mapLayerActions.activate(groupOf()?.id ?? '');
    expect(currentMap()?.layer.id).toBe(high);
    mapLayerActions.activate(low);
    expect(currentMap()?.layer.id).toBe(low);
  });

  it('takes a group apart and puts it back with one undo each', () => {
    const { low, high } = twoLayers();
    mapLayerActions.group([low, high]);
    mapLayerActions.ungroup(groupOf()?.id ?? '');
    expect(groupOf()).toBeUndefined();
    expect(mapNow().layers.every((layer) => layer.parentId === undefined)).toBe(true);
    stepHistory('undo');
    expect(groupOf()).toBeDefined();
  });

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
