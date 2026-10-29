/* @layer renderer-app @kind test */
import { NO_FLAGS } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { mapSelectionReply } from '../../src/assistant/tools/map-selection-reply';
import { mapSelectionStep } from '../../src/assistant/tools/map-selection-step';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { captureSelection } from '../../src/tilemap/capture-selection';
import { copyCells } from '../../src/tilemap/copy-cells';
import { cutCells } from '../../src/tilemap/cut-cells';
import { decodeCellClip } from '../../src/tilemap/decode-cell-clip';
import { encodeCellClip } from '../../src/tilemap/encode-cell-clip';
import { invertCells } from '../../src/tilemap/invert-cells';
import { moveCells } from '../../src/tilemap/move-cells';
import { orientStamp } from '../../src/tilemap/orient-stamp';
import { pasteCells } from '../../src/tilemap/paste-cells';
import { placeClip } from '../../src/tilemap/place-clip';
import { placeStampAt } from '../../src/tilemap/place-stamp-at';
import { selectAtCell } from '../../src/tilemap/select-at-cell';
import { selectCells } from '../../src/tilemap/select-cells';
import { selectSameTile } from '../../src/tilemap/select-same-tile';
import { selectionCells } from '../../src/tilemap/selection-cells';
import { selectionCount } from '../../src/tilemap/selection-count';
import { cellInSelection } from '../../src/views/TilemapCanvas/behavior/cell-in-selection';
import { revision } from '../sheet/sheet-harness';
import { cellsNow, mapNow, openMapFile } from './map-harness';

const FLIP_X = 0x80000000;
const FLIP_Y = 0x40000000;
const TURN = 0x20000000;

const store = () => useTilemapStore.getState();

const stampAt = (stamp: { columns: number; rows: number; keys: number[]; bits?: number[] }, at: { x: number; y: number }): void => {
  store().setStamp(stamp);
  placeStampAt([at]);
};

const chosen = (): string[] => (store().selection ? selectionCells(store().selection!, mapNow()).map((cell) => `${cell.x},${cell.y}`) : []);

beforeEach(() => {
  openMapFile();
  store().setSelectVariant('rect');
  store().setSelectMode('replace');
  store().setClip(null);
  store().setPaste(null);
});

describe('selecting cells by wand and same tile', () => {
  const layout = (): void => {
    stampAt({ columns: 3, rows: 1, keys: [2, 2, 1] }, { x: 0, y: 0 });
    stampAt({ columns: 1, rows: 1, keys: [2] }, { x: 3, y: 2 });
    stampAt({ columns: 1, rows: 1, keys: [2] }, { x: 0, y: 1 });
  };

  it('takes the connected cells of the same tile with the wand', () => {
    layout();
    store().setSelectVariant('wand');
    expect(selectAtCell({ x: 1, y: 0 }, 'replace')).toBe(true);
    expect(chosen().sort()).toEqual(['0,0', '0,1', '1,0']);
    expect(store().selection?.mask).not.toBeNull();
    expect(cellInSelection({ x: 0, y: 1 }, store().selection)).toBe(true);
    expect(cellInSelection({ x: 3, y: 2 }, store().selection)).toBe(false);
  });

  it('takes every cell of the tile with same tile, wherever it is', () => {
    layout();
    store().setSelectVariant('same');
    selectAtCell({ x: 0, y: 0 }, 'replace');
    expect(chosen().sort()).toEqual(['0,0', '0,1', '1,0', '3,2']);
    expect(selectionCount(store().selection!)).toBe(4);
  });

  it('adds, subtracts and intersects with the same rules as pixel selection', () => {
    layout();
    selectCells({ by: 'rect', rect: { x: 0, y: 0, width: 2, height: 2 } }, 'replace');
    expect(chosen()).toHaveLength(4);
    selectCells({ by: 'rect', rect: { x: 1, y: 1, width: 2, height: 2 } }, 'add');
    expect(chosen()).toHaveLength(7);
    selectCells({ by: 'tile', key: 2 }, 'intersect');
    expect(chosen().sort()).toEqual(['0,0', '0,1', '1,0']);
    selectCells({ by: 'wand', x: 0, y: 0, connectivity: 4 }, 'subtract');
    expect(store().selection).toBeNull();
  });

  it('keeps a plain rectangle as a rectangle and selects same tile from the selection', () => {
    layout();
    selectCells({ by: 'rect', rect: { x: 0, y: 0, width: 2, height: 1 } }, 'replace');
    expect(store().selection?.mask).toBeNull();
    expect(store().selection?.from).toBe(2);
    expect(selectSameTile()).toBe(true);
    expect(chosen()).toHaveLength(4);
  });

  it('inverts the selection inside the map', () => {
    layout();
    selectCells({ by: 'rect', rect: { x: 0, y: 0, width: 4, height: 2 } }, 'replace');
    expect(invertCells()).toBe(true);
    expect(chosen().sort()).toEqual(['0,2', '1,2', '2,2', '3,2']);
  });
});

describe('copy, cut, paste and move of cells', () => {
  const block = (): void => {
    stampAt({ columns: 3, rows: 2, keys: [1, 2, 1, 2, 1, 2], bits: [1, 0, 4, 0, 2, 6] }, { x: 0, y: 0 });
    selectCells({ by: 'rect', rect: { x: 0, y: 0, width: 3, height: 2 } }, 'replace');
  };

  it('copies 3 x 2 cells and pastes them elsewhere with their keys and turns, in one undo step', async () => {
    block();
    const before = cellsNow();
    expect(copyCells()).toBe(true);
    expect(await pasteCells(false)).toBe(true);
    expect(store().paste).not.toBeNull();
    const base = revision();
    const placed = store().paste;
    expect(placed).not.toBeNull();
    expect(placeClip(placed!, { x: 1, y: 1 })).toBe(true);
    expect(revision() - base).toBe(1);
    const after = cellsNow();
    for (let row = 0; row < 2; row += 1) {
      for (let column = 0; column < 3; column += 1) expect(after[(row + 1) * 4 + column + 1]).toBe(before[row * 4 + column]);
    }
    expect(after[4 + 1]).toBe((FLIP_X | 1) >>> 0);
    expect(after[4 + 3]).toBe((TURN | 1) >>> 0);
    expect(after[2 * 4 + 3]).toBe((FLIP_Y | TURN | 2) >>> 0);
    expect(chosen()).toHaveLength(6);
  });

  it('pastes in place at the copied position', async () => {
    block();
    copyCells();
    stampAt({ columns: 1, rows: 1, keys: [0] }, { x: 0, y: 0 });
    store().setStamp({ columns: 1, rows: 1, keys: [2] });
    selectCells({ by: 'rect', rect: { x: 0, y: 0, width: 1, height: 1 } }, 'replace');
    expect(await pasteCells(true)).toBe(true);
    expect(cellsNow()[0]).toBe((FLIP_X | 1) >>> 0);
  });

  it('cuts the cells and keeps them for a later paste', async () => {
    block();
    expect(cutCells()).toBe(true);
    expect(cellsNow().slice(0, 3)).toEqual([0, 0, 0]);
    expect(store().clip?.stamp.keys).toEqual([1, 2, 1, 2, 1, 2]);
    expect(await pasteCells(true)).toBe(true);
    expect(cellsNow()[0]).toBe((FLIP_X | 1) >>> 0);
  });

  it('refuses to paste cells of another tileset', async () => {
    block();
    copyCells();
    const clip = store().clip!;
    store().setClip({ ...clip, tilesetId: 'tls_other' as never });
    expect(await pasteCells(false)).toBe(false);
    expect(store().paste).toBeNull();
  });

  it('moves the selected cells as one undo step and the selection follows', () => {
    block();
    const base = revision();
    expect(moveCells({ x: 1, y: 1 }, false)).toBe(true);
    expect(revision() - base).toBe(1);
    const cells = cellsNow();
    expect(cells.slice(0, 4)).toEqual([0, 0, 0, 0]);
    expect(cells[4 + 1]).toBe((FLIP_X | 1) >>> 0);
    expect(store().selection?.rect).toMatchObject({ x: 1, y: 1 });
  });

  it('duplicates with copy and clamps the move to the map', () => {
    block();
    expect(moveCells({ x: 5, y: 0 }, true)).toBe(true);
    expect(store().selection?.rect).toMatchObject({ x: 1, y: 0 });
    expect(cellsNow()[0]).toBe((FLIP_X | 1) >>> 0);
    expect(cellsNow()[1]).toBe((FLIP_X | 1) >>> 0);
  });

  it('moves only the cells of a masked selection', () => {
    block();
    selectCells({ by: 'tile', key: 2 }, 'replace');
    expect(selectionCount(store().selection!)).toBe(3);
    moveCells({ x: 0, y: 1 }, false);
    const cells = cellsNow();
    expect(cells[1]).toBe(0);
    expect(cells[4 + 1]).toBe(2);
    expect(cells[0]).toBe((FLIP_X | 1) >>> 0);
  });
});

describe('capturing a stamp from cells', () => {
  it('takes the selected cells with their turns and places them identically', () => {
    stampAt({ columns: 2, rows: 2, keys: [1, 2, 2, 1], bits: [2, 5, 0, 4] }, { x: 0, y: 0 });
    selectCells({ by: 'rect', rect: { x: 0, y: 0, width: 2, height: 2 } }, 'replace');
    const before = cellsNow().filter((cell) => cell !== 0);
    expect(captureSelection()).toBe(true);
    expect(store().stamp).toMatchObject({ columns: 2, rows: 2, keys: [1, 2, 2, 1], bits: [2, 5, 0, 4] });
    expect(store().flags).toEqual(NO_FLAGS);
    placeStampAt([{ x: 2, y: 1 }]);
    const cells = cellsNow();
    expect([cells[4 + 2], cells[4 + 3], cells[8 + 2], cells[8 + 3]]).toEqual([cells[0], cells[1], cells[4], cells[5]]);
    expect(cells.filter((cell) => cell !== 0)).toHaveLength(before.length * 2);
  });

  it('turns the turns of a captured stamp with the stamp', () => {
    const stamp = { columns: 2, rows: 1, keys: [1, 2], bits: [0, 1] };
    const flipped = orientStamp(stamp, { flipX: true, flipY: false, diagonal: false });
    expect(flipped).toEqual({ columns: 2, rows: 1, keys: [2, 1], bits: [0, 1] });
    const turned = orientStamp({ columns: 2, rows: 1, keys: [1, 2], bits: [0, 0] }, { flipX: false, flipY: false, diagonal: true });
    expect(turned.columns).toBe(1);
    expect(turned.rows).toBe(2);
    expect(turned.bits).toEqual([4, 4]);
  });
});

describe('selecting cells for the assistant', () => {
  const step = (mapSelection: unknown) => mapSelectionStep({ mapSelection } as never, undefined as never);

  it('selects described cells with the combine rules and replies with row runs', () => {
    stampAt({ columns: 2, rows: 1, keys: [2, 2] }, { x: 0, y: 0 });
    expect(step({ op: 'replace', cells: { by: 'rect', rect: { x: 0, y: 0, width: 2, height: 2 } } })).toBeNull();
    expect(mapSelectionReply(store().selection, mapNow())).toMatchObject({ empty: false, cells: 4, bounds: { x: 0, y: 0, width: 2, height: 2 }, runs: [[0, 0, 1], [1, 0, 1]] });
    step({ op: 'subtract', cells: { by: 'tile', key: 2 } });
    expect(mapSelectionReply(store().selection, mapNow())).toMatchObject({ cells: 2, runs: [[1, 0, 1]] });
    step({ op: 'add', cells: { by: 'wand', x: 3, y: 2 } });
    expect(selectionCount(store().selection!)).toBeGreaterThan(2);
    step({ op: 'replace', cells: 'none' });
    expect(mapSelectionReply(store().selection, mapNow())).toEqual({ empty: true, bounds: null, cells: 0, runs: null });
  });
});

describe('the cell clip on the system clipboard', () => {
  it('survives a round trip and refuses damaged data', () => {
    const clip = { stamp: { columns: 2, rows: 1, keys: [1, 2], bits: [0, 5] }, origin: { x: 3, y: 4 }, tilesetId: 'tls_x' as never };
    expect(decodeCellClip(encodeCellClip(clip))).toEqual(clip);
    expect(decodeCellClip(new TextEncoder().encode('{"v":1}'))).toBeNull();
    expect(decodeCellClip(new TextEncoder().encode('not json'))).toBeNull();
    expect(decodeCellClip(new TextEncoder().encode(JSON.stringify({ v: 1, tileset: 'a', columns: 2, rows: 1, x: 0, y: 0, keys: [1] })))).toBeNull();
  });
});
