/* @layer renderer-app @kind test */
import { tileUseCounts } from '@bxel/document';
import type { Rect } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { currentTarget } from '../../src/editor/current-target';
import { stepHistory } from '../../src/editor/step-history';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { addTile } from '../../src/tilemap/add-tile';
import { clearCells } from '../../src/tilemap/clear-cells';
import { deleteTile } from '../../src/tilemap/delete-tile';
import { duplicateTile } from '../../src/tilemap/duplicate-tile';
import { editTile } from '../../src/tilemap/edit-tile';
import { makeUnique } from '../../src/tilemap/make-unique';
import { placeStampAt } from '../../src/tilemap/place-stamp-at';
import { replaceCells } from '../../src/tilemap/replace-cells';
import { lastNotice, revision } from '../sheet/sheet-harness';
import { artworkNow, cellsNow, openMapFile, paintTile, picture, ROCK, tilePixels, tilesetNow } from './map-harness';

beforeEach(openMapFile);

const rockAt = (...cells: number[][]): void => {
  placeStampAt(cells.map(([x, y]) => ({ x: x ?? 0, y: y ?? 0 })));
};

const select = (rect: Rect, from: number): void => useTilemapStore.getState().setSelection({ rect, from });

describe('editing a tile', () => {
  it('changes every placement when the pixels of the tile change', () => {
    rockAt([0, 0], [2, 1], [3, 2]);
    paintTile(2, [6, 6, 6, 6]);
    const rows = picture();
    const block = (column: number, row: number): number[][] => [0, 1].map((dy) => (rows[row * 2 + dy] ?? []).slice(column * 2, column * 2 + 2));
    expect([block(0, 0), block(2, 1), block(3, 2)]).toEqual(Array.from({ length: 3 }, () => [[6, 6], [6, 6]]));
    expect(cellsNow().filter((cell) => cell === 2)).toHaveLength(3);
  });

  it('aims the editor at the tile in Edit Tile and back at the sprite in Place Tile', () => {
    expect(currentTarget()?.sprite.role).toBe('sprite');
    expect(editTile(2)).toBe(true);
    expect(useSpriteStore.getState().mode).toBe('tilemap');
    expect(currentTarget()?.sprite.role).toBe('tile');
    expect(currentTarget()?.sprite.id).toBe(useTilemapStore.getState().editSpriteId);
    useTilemapStore.getState().placeTiles();
    expect(currentTarget()?.sprite.role).toBe('sprite');
  });

  it('refuses Edit Tile without a tile', () => {
    expect(editTile(9)).toBe(false);
    expect(lastNotice()).toContain('tile');
    expect(useTilemapStore.getState().editMode).toBe('place');
  });
});

describe('making a tile unique', () => {
  it('gives the selected cells their own copy and leaves the other cells on the original', () => {
    rockAt([0, 0], [2, 1]);
    select({ x: 0, y: 0, width: 1, height: 1 }, 2);
    const before = revision();
    expect(makeUnique()).toBe(true);
    expect(revision() - before).toBe(1);
    expect(cellsNow()[0]).toBe(3);
    expect(cellsNow()[6]).toBe(2);
    expect(tilePixels(3)).toEqual(ROCK);
    paintTile(3, [7, 7, 7, 7]);
    expect(picture()[0]?.slice(0, 2)).toEqual([7, 7]);
    expect(picture()[2]?.slice(4, 6)).toEqual([2, 3]);
    stepHistory('undo');
    stepHistory('undo');
    expect(cellsNow()[0]).toBe(2);
    expect(tilesetNow().tiles).toHaveLength(2);
  });

  it('asks for a selection first', () => {
    expect(makeUnique()).toBe(false);
    expect(lastNotice()).toContain('Select');
  });
});

describe('adding, copying and deleting tiles', () => {
  it('adds an empty tile and picks it', () => {
    expect(addTile()).toBe(3);
    expect(tilePixels(3).every((pixel) => pixel === 0)).toBe(true);
    expect(useTilemapStore.getState().stamp.keys).toEqual([3]);
  });

  it('copies the pixels of a tile into a new tile in one undo step', () => {
    const before = revision();
    expect(duplicateTile(2)).toBe(true);
    expect(revision() - before).toBe(1);
    expect(tilePixels(3)).toEqual(ROCK);
    expect(useTilemapStore.getState().stamp.keys).toEqual([3]);
    stepHistory('undo');
    expect(tilesetNow().tiles).toHaveLength(2);
  });

  it('warns about a placed tile instead of leaving dangling cells', () => {
    rockAt([0, 0], [1, 0]);
    expect(tileUseCounts(artworkNow(), tilesetNow().id).get(2)).toBe(2);
    expect(deleteTile(2, undefined)).toBe(false);
    expect(lastNotice()).toContain('2 map cells');
    expect(cellsNow().slice(0, 2)).toEqual([2, 2]);
  });

  it('clears or replaces the cells of a deleted tile', () => {
    rockAt([0, 0], [1, 0]);
    expect(deleteTile(2, 1)).toBe(true);
    expect(cellsNow().slice(0, 2)).toEqual([1, 1]);
    expect(tilesetNow().tiles.map((tile) => tile.key)).toEqual([1]);
    stepHistory('undo');
    expect(cellsNow().slice(0, 2)).toEqual([2, 2]);
    expect(deleteTile(2, 0)).toBe(true);
    expect(cellsNow().slice(0, 2)).toEqual([0, 0]);
  });
});

describe('replacing and clearing cells', () => {
  it('replaces a tile inside the selection and then on the whole layer', () => {
    rockAt([0, 0], [1, 0], [3, 2]);
    select({ x: 0, y: 0, width: 2, height: 1 }, 2);
    useTilemapStore.getState().setStamp({ columns: 1, rows: 1, keys: [1] });
    expect(replaceCells(false)).toBe(true);
    expect(cellsNow().filter((cell) => cell === 1)).toHaveLength(2);
    expect(cellsNow()[11]).toBe(2);
    select({ x: 3, y: 2, width: 1, height: 1 }, 2);
    expect(replaceCells(true)).toBe(true);
    expect(cellsNow()[11]).toBe(1);
    expect(tilePixels(2)).toEqual(ROCK);
  });

  it('clears the selected cells and keeps the tiles', () => {
    rockAt([0, 0], [1, 0], [3, 2]);
    select({ x: 0, y: 0, width: 4, height: 1 }, 2);
    expect(clearCells()).toBe(true);
    expect(cellsNow().filter((cell) => cell !== 0)).toEqual([2]);
    expect(tilesetNow().tiles).toHaveLength(2);
  });
});
