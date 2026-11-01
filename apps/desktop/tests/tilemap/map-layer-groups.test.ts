/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { currentMap } from '../../src/tilemap/current-map';
import { mapLayerActions } from '../../src/tilemap/map-layer-actions';
import { mapLayerRows } from '../../src/tilemap/map-layer-rows';
import { revision } from '../sheet/sheet-harness';
import { groupOf, mapNow, openMapFile, twoLayers } from './map-harness';

beforeEach(openMapFile);

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
});
