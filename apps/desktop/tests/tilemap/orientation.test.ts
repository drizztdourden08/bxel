/* @layer renderer-app @kind test */
import type { AssetKey, Point } from '@bxel/document';
import { mapGeometry } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { TILEMAP_FIELDS } from '../../src/asset-config/map-fields.constants';
import type { AssetFocus } from '../../src/asset-config/asset-config.type';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { currentMap } from '../../src/tilemap/current-map';
import { setMapOrientation } from './orientation-harness';
import { strokePlace } from '../../src/tilemap/stroke-place';
import { cellNearest } from '../../src/views/TilemapCanvas/behavior/cell-nearest';
import { cellOf } from '../../src/views/TilemapCanvas/behavior/cell-of';
import { artworkNow, cellsNow, mapNow, openMapFile } from './map-harness';

const focusOnMap = (): AssetFocus => {
  const { activeId } = useDocumentStore.getState();
  if (activeId === null) throw new Error('no document');
  const key: AssetKey = { kind: 'tilemap', id: mapNow().id };
  return { documentId: activeId, key, artwork: artworkNow(), readOnly: false };
};

const target = () => {
  const found = currentMap();
  if (!found) throw new Error('no map target');
  return found;
};

const centreOf = (cell: Point): Point => {
  const { tilemap, tileset } = target();
  const geometry = mapGeometry({
    columns: tilemap.columns,
    rows: tilemap.rows,
    tile: { width: tileset.tileWidth, height: tileset.tileHeight },
    orientation: tilemap.orientation,
  });
  const origin = geometry.originOf(cell.x, cell.y);
  return { x: origin.x + tileset.tileWidth / 2, y: origin.y + tileset.tileHeight / 2 };
};

describe('an isometric map under the pointer', () => {
  beforeEach(() => {
    openMapFile();
    setMapOrientation({ kind: 'isometric' });
  });

  it('turns a pixel into the cell whose diamond holds it', () => {
    for (const cell of [{ x: 0, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 2 }]) expect(cellOf(centreOf(cell), target())).toEqual(cell);
  });

  it('puts a stroke on the cell under the pointer, not on the cell of the box grid', () => {
    const cell = cellOf(centreOf({ x: 2, y: 1 }), target());
    expect(strokePlace([cell])).toBe(true);
    expect(cellsNow()[1 * 4 + 2]).toBe(2);
    expect(cellsNow().filter((each) => each !== 0)).toHaveLength(1);
  });

  it('gives an out of map cell outside the map and the nearest cell for a drag past the edge', () => {
    expect(cellOf({ x: 500, y: 500 }, target()).x).toBeLessThan(0);
    const near = cellNearest({ x: 500, y: 500 }, target());
    expect([near.x, near.y >= 0 && near.y < 3]).toEqual([3, true]);
  });
});

describe('the orientation settings of a map', () => {
  beforeEach(() => openMapFile());

  it('read as orthogonal and change to hexagonal with a side length in one step each', () => {
    const field = TILEMAP_FIELDS['tilemap.orientation'];
    if (!field) throw new Error('no orientation field');
    expect(field.read(focusOnMap())).toBe('orthogonal');
    expect(field.write?.(focusOnMap(), 'isometric')).toBeNull();
    expect(mapNow().orientation?.kind).toBe('isometric');
    expect(TILEMAP_FIELDS['tilemap.staggerIndex']?.write?.(focusOnMap(), 'even')).toBeNull();
    expect(mapNow().orientation).toMatchObject({ kind: 'isometric', staggerIndex: 'even' });
    expect(field.write?.(focusOnMap(), 'orthogonal')).toBeNull();
    expect(mapNow().orientation).toBeUndefined();
  });

  it('says why a tile size cannot be laid out as hexagons', () => {
    const field = TILEMAP_FIELDS['tilemap.orientation'];
    const message = field?.write?.(focusOnMap(), 'hexagonal');
    expect(typeof message).toBe('string');
    expect(mapNow().orientation).toBeUndefined();
  });
});
