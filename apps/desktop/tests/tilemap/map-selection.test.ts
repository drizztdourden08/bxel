/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { mapSelectionReply } from '../../src/assistant/tools/map-selection-reply';
import { mapSelectionStep } from '../../src/assistant/tools/map-selection-step';
import { stepHistory } from '../../src/editor/step-history';
import { invertCells } from '../../src/tilemap/invert-cells';
import { commitMapSelection } from '../../src/tilemap/commit-map-selection';
import { moveCells } from '../../src/tilemap/move-cells';
import { selectAtCell } from '../../src/tilemap/select-at-cell';
import { selectCells } from '../../src/tilemap/select-cells';
import { selectSameTile } from '../../src/tilemap/select-same-tile';
import { selectionCount } from '../../src/tilemap/selection-count';
import { cellInSelection } from '../../src/views/TilemapCanvas/behavior/cell-in-selection';
import { mapNow } from './map-harness';
import { chosen, freshMap, selectionNow, stampAt, store } from './map-selection-harness';

beforeEach(freshMap);

const layout = (): void => {
  stampAt({ columns: 3, rows: 1, keys: [2, 2, 1] }, { x: 0, y: 0 });
  stampAt({ columns: 1, rows: 1, keys: [2] }, { x: 3, y: 2 });
  stampAt({ columns: 1, rows: 1, keys: [2] }, { x: 0, y: 1 });
};

describe('S2 selecting cells by wand and same tile', { tags: ['standard'] }, () => {
  it('takes the connected cells of the same tile with the wand', () => {
    layout();
    store().setSelectVariant('wand');
    expect(selectAtCell({ x: 1, y: 0 }, 'replace')).toBe(true);
    expect(chosen().sort()).toEqual(['0,0', '0,1', '1,0']);
    expect(selectionNow().mask).not.toBeNull();
    expect(cellInSelection({ x: 0, y: 1 }, store().selection)).toBe(true);
    expect(cellInSelection({ x: 3, y: 2 }, store().selection)).toBe(false);
  });

  it('takes every cell of the tile with same tile, wherever it is', () => {
    layout();
    store().setSelectVariant('same');
    selectAtCell({ x: 0, y: 0 }, 'replace');
    expect(chosen().sort()).toEqual(['0,0', '0,1', '1,0', '3,2']);
    expect(selectionCount(selectionNow())).toBe(4);
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
    expect(selectionNow().mask).toBeNull();
    expect(selectionNow().from).toBe(2);
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

describe('S2 cell selection in step history', { tags: ['standard'] }, () => {
  it('undoes and redoes selection changes one at a time, before any document step', () => {
    layout();
    selectCells({ by: 'rect', rect: { x: 0, y: 0, width: 2, height: 1 } }, 'replace');
    selectCells({ by: 'tile', key: 2 }, 'replace');
    expect(chosen()).toHaveLength(4);
    stepHistory('undo');
    expect(chosen().sort()).toEqual(['0,0', '1,0']);
    stepHistory('undo');
    expect(store().selection).toBeNull();
    stepHistory('redo');
    stepHistory('redo');
    expect(chosen()).toHaveLength(4);
  });

  it('records Deselect and a move, and the next undo after the selection steps is the move', () => {
    layout();
    selectCells({ by: 'rect', rect: { x: 0, y: 0, width: 2, height: 1 } }, 'replace');
    moveCells({ x: 0, y: 2 }, false);
    expect(chosen().sort()).toEqual(['0,2', '1,2']);
    stepHistory('undo');
    expect(chosen().sort()).toEqual(['0,0', '1,0']);
    commitMapSelection(null);
    expect(store().selection).toBeNull();
    stepHistory('undo');
    expect(chosen().sort()).toEqual(['0,0', '1,0']);
  });
});

describe('S2 selecting cells for the assistant', { tags: ['standard'] }, () => {
  const step = (mapSelection: unknown) => mapSelectionStep({ mapSelection } as never, undefined as never);

  it('selects described cells with the combine rules and replies with row runs', () => {
    stampAt({ columns: 2, rows: 1, keys: [2, 2] }, { x: 0, y: 0 });
    expect(step({ op: 'replace', cells: { by: 'rect', rect: { x: 0, y: 0, width: 2, height: 2 } } })).toBeNull();
    expect(mapSelectionReply(store().selection, mapNow())).toMatchObject({ empty: false, cells: 4, bounds: { x: 0, y: 0, width: 2, height: 2 }, runs: [[0, 0, 1], [1, 0, 1]] });
    step({ op: 'subtract', cells: { by: 'tile', key: 2 } });
    expect(mapSelectionReply(store().selection, mapNow())).toMatchObject({ cells: 2, runs: [[1, 0, 1]] });
    step({ op: 'add', cells: { by: 'wand', x: 3, y: 2 } });
    expect(selectionCount(selectionNow())).toBeGreaterThan(2);
    step({ op: 'replace', cells: 'none' });
    expect(mapSelectionReply(store().selection, mapNow())).toEqual({ empty: true, bounds: null, cells: 0, runs: null });
  });
});
