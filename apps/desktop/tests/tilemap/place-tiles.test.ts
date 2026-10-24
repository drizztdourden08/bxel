/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { fillAt } from '../../src/tilemap/fill-at';
import { pickAt } from '../../src/tilemap/pick-at';
import { placeStampAt } from '../../src/tilemap/place-stamp-at';
import { rectPlace } from '../../src/tilemap/rect-place';
import { strokeErase } from '../../src/tilemap/stroke-erase';
import { strokePlace } from '../../src/tilemap/stroke-place';
import { lastNotice, revision } from '../sheet/sheet-harness';
import { cellsNow, openMapFile, picture, tileSprite } from './map-harness';

beforeEach(openMapFile);

const stamp = (columns: number, rows: number, keys: number[]): void => useTilemapStore.getState().setStamp({ columns, rows, keys });

describe('placing tiles on the map', () => {
  it('paints a stroke of one tile as a single undo step', () => {
    const before = revision();
    expect(strokePlace([{ x: 0, y: 0 }, { x: 3, y: 0 }])).toBe(true);
    expect(cellsNow().slice(0, 4)).toEqual([2, 2, 2, 2]);
    expect(revision() - before).toBe(1);
    stepHistory('undo');
    expect(cellsNow().every((cell) => cell === 0)).toBe(true);
  });

  it('places a stamp of several tiles with one undo step and clips it at the edge', () => {
    stamp(2, 2, [1, 2, 2, 1]);
    const before = revision();
    expect(placeStampAt([{ x: 3, y: 2 }, { x: 0, y: 0 }])).toBe(true);
    expect(revision() - before).toBe(1);
    expect(cellsNow().slice(0, 2)).toEqual([1, 2]);
    expect(cellsNow().slice(4, 6)).toEqual([2, 1]);
    expect(cellsNow()[11]).toBe(1);
    stepHistory('undo');
    expect(cellsNow().every((cell) => cell === 0)).toBe(true);
  });

  it('erases a stroke, fills an area and draws a rectangle', () => {
    expect(rectPlace({ x: 0, y: 0, width: 4, height: 3 })).toBe(true);
    expect(cellsNow().every((cell) => cell === 2)).toBe(true);
    expect(strokeErase([{ x: 1, y: 1 }, { x: 2, y: 1 }])).toBe(true);
    expect(cellsNow().filter((cell) => cell === 0)).toHaveLength(2);
    stamp(1, 1, [1]);
    expect(fillAt({ x: 1, y: 1 })).toBe(true);
    expect(cellsNow().filter((cell) => cell === 1)).toHaveLength(2);
    expect(cellsNow().filter((cell) => cell === 2)).toHaveLength(10);
  });

  it('draws an outline and repeats a stamp pattern across a rectangle', () => {
    useTilemapStore.getState().setFilled(false);
    expect(rectPlace({ x: 0, y: 0, width: 3, height: 3 })).toBe(true);
    expect(cellsNow().filter((cell) => cell !== 0)).toHaveLength(8);
    stamp(2, 1, [1, 2]);
    useTilemapStore.getState().setFilled(true);
    expect(rectPlace({ x: 0, y: 0, width: 4, height: 1 })).toBe(true);
    expect(cellsNow().slice(0, 4)).toEqual([1, 2, 1, 2]);
  });

});

describe('picking, turning and keeping tiles', () => {
  it('picks the tile and its turn from a cell', () => {
    useTilemapStore.getState().setFlags({ flipX: true, flipY: false, diagonal: true });
    expect(placeStampAt([{ x: 1, y: 1 }])).toBe(true);
    stamp(1, 1, [1]);
    useTilemapStore.getState().setFlags({ flipX: false, flipY: false, diagonal: false });
    expect(pickAt({ x: 1, y: 1 })).toBe(true);
    expect(useTilemapStore.getState().stamp.keys).toEqual([2]);
    expect(useTilemapStore.getState().flags).toEqual({ flipX: true, flipY: false, diagonal: true });
    expect(pickAt({ x: 3, y: 2 })).toBe(false);
  });

  it('stores the turn of each placed cell and draws it', () => {
    useTilemapStore.getState().setFlags({ flipX: true, flipY: false, diagonal: false });
    placeStampAt([{ x: 0, y: 0 }]);
    expect(cellsNow()[0]).toBe((0x80000000 | 2) >>> 0);
    expect(picture()[0]?.slice(0, 2)).toEqual([3, 2]);
    expect(picture()[1]?.slice(0, 2)).toEqual([5, 4]);
  });

  it('refuses a stamp with no tile and leaves the map alone', () => {
    stamp(1, 1, [0]);
    expect(strokePlace([{ x: 0, y: 0 }])).toBe(false);
    expect(lastNotice()).toContain('tile');
    expect(cellsNow().every((cell) => cell === 0)).toBe(true);
  });

  it('leaves the pixels of the tiles alone while the map changes', () => {
    const before = tileSprite(2);
    const first = tileSprite(1);
    rectPlace({ x: 0, y: 0, width: 4, height: 3 });
    strokeErase([{ x: 0, y: 0 }]);
    stamp(1, 1, [1]);
    fillAt({ x: 1, y: 1 });
    expect(tileSprite(2)).toBe(before);
    expect(tileSprite(1)).toBe(first);
  });
});
