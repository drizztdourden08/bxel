/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { clearCells } from '../../src/tilemap/clear-cells';
import { copyCells } from '../../src/tilemap/copy-cells';
import { cutCells } from '../../src/tilemap/cut-cells';
import { moveCells } from '../../src/tilemap/move-cells';
import { pasteCells } from '../../src/tilemap/paste-cells';
import { placeClip } from '../../src/tilemap/place-clip';
import { selectCells } from '../../src/tilemap/select-cells';
import { selectionCount } from '../../src/tilemap/selection-count';
import { revision } from '../sheet/sheet-harness';
import { cellsNow } from './map-harness';
import { chosen, FLIP_X, FLIP_Y, freshMap, selectionNow, stampAt, store, TURN } from './map-selection-harness';

beforeEach(freshMap);

const block = (): void => {
  stampAt({ columns: 3, rows: 2, keys: [1, 2, 1, 2, 1, 2], bits: [1, 0, 4, 0, 2, 6] }, { x: 0, y: 0 });
  selectCells({ by: 'rect', rect: { x: 0, y: 0, width: 3, height: 2 } }, 'replace');
};

describe('copy, cut and paste of cells', () => {
  it('copies 3 x 2 cells and pastes them elsewhere with their keys and turns, in one undo step', async () => {
    block();
    const before = cellsNow();
    expect(copyCells()).toBe(true);
    expect(await pasteCells(false)).toBe(true);
    const floating = store().paste;
    if (!floating) throw new Error('nothing is floating');
    const base = revision();
    expect(placeClip(floating, { x: 1, y: 1 })).toBe(true);
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
    clearCells();
    expect(cellsNow()[0]).toBe(0);
    expect(await pasteCells(true)).toBe(true);
    expect(cellsNow()[6]).toBe((FLIP_Y | TURN | 2) >>> 0);
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
    const clip = store().clip;
    if (!clip) throw new Error('nothing was copied');
    store().setClip({ ...clip, tilesetId: 'tls_other' as never });
    expect(await pasteCells(false)).toBe(false);
    expect(store().paste).toBeNull();
  });
});

describe('moving cells', () => {
  it('moves the selected cells as one undo step and the selection follows', () => {
    block();
    const base = revision();
    expect(moveCells({ x: 1, y: 1 }, false)).toBe(true);
    expect(revision() - base).toBe(1);
    const cells = cellsNow();
    expect(cells.slice(0, 4)).toEqual([0, 0, 0, 0]);
    expect(cells[4 + 1]).toBe((FLIP_X | 1) >>> 0);
    expect(selectionNow().rect).toMatchObject({ x: 1, y: 1 });
  });

  it('duplicates with copy and clamps the move to the map', () => {
    block();
    expect(moveCells({ x: 5, y: 0 }, true)).toBe(true);
    expect(selectionNow().rect).toMatchObject({ x: 1, y: 0 });
    expect(cellsNow()[0]).toBe((FLIP_X | 1) >>> 0);
    expect(cellsNow()[1]).toBe((FLIP_X | 1) >>> 0);
  });

  it('moves only the cells of a masked selection', () => {
    block();
    selectCells({ by: 'tile', key: 2 }, 'replace');
    expect(selectionCount(selectionNow())).toBe(3);
    moveCells({ x: 0, y: 1 }, false);
    const cells = cellsNow();
    expect(cells[1]).toBe(0);
    expect(cells[4 + 1]).toBe(2);
    expect(cells[0]).toBe((FLIP_X | 1) >>> 0);
  });
});
