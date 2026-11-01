/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { symmetryCell } from '../../src/editor/symmetry-cell';
import { symmetryOf } from '../../src/editor/symmetry-of';
import { tileCellOf } from '../../src/editor/tile-cell-of';
import { DRAWING_DEFAULTS } from '../../src/stores/drawing-store.constants';
import { TILEMAP_DEFAULTS } from '../../src/stores/tilemap-store.constants';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { useDrawingStore } from '../../src/stores/useDrawingStore';
import { useSnapGridStore } from '../../src/stores/useSnapGridStore';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { useViewStore } from '../../src/stores/useViewStore';

const SIZE = { width: 32, height: 24 };

beforeEach(() => {
  useToolStore.setState({ ...TOOL_DEFAULTS });
  useDrawingStore.setState({ ...DRAWING_DEFAULTS });
  useTilemapStore.setState({ ...TILEMAP_DEFAULTS });
  useViewStore.setState({ gridTile: true });
  useSnapGridStore.setState({ grid: { width: 8, height: 8 } });
  useToolStore.getState().toggleSymmetry('x');
});

describe('S2 symmetry inside each tile', { tags: ['standard'] }, () => {
  it('mirrors about the middle of the tile under the pointer', () => {
    useDrawingStore.getState().toggleSymmetryMode('tile');
    expect(symmetryOf(useToolStore.getState(), SIZE, { x: 10, y: 3 })).toEqual({ x2: 24 });
    expect(symmetryOf(useToolStore.getState(), SIZE, { x: 0, y: 0 })).toEqual({ x2: 8 });
    expect(symmetryOf(useToolStore.getState(), SIZE, { x: 31, y: 23 })).toEqual({ x2: 56 });
  });

  it('ignores a dragged axis and shifts the vertical axis the same way', () => {
    useToolStore.getState().toggleSymmetry('y');
    useToolStore.getState().setAxis('x', 3);
    useDrawingStore.getState().toggleSymmetryMode('tile');
    expect(symmetryOf(useToolStore.getState(), SIZE, { x: 9, y: 17 })).toEqual({ x2: 24, y2: 40 });
  });

  it('keeps the partial last tile on the edge of the canvas', () => {
    useDrawingStore.getState().toggleSymmetryMode('tile');
    expect(symmetryCell({ width: 20, height: 8 }, { x: 18, y: 2 })).toEqual({ x: 16, y: 0, width: 4, height: 8 });
    expect(symmetryOf(useToolStore.getState(), { width: 20, height: 8 }, { x: 18, y: 2 })).toEqual({ x2: 36 });
  });

  it('stays whole canvas when the mode is off, there is no pointer or there is no tile grid', () => {
    expect(symmetryOf(useToolStore.getState(), SIZE, { x: 10, y: 3 })).toEqual({ x2: 32 });
    useDrawingStore.getState().toggleSymmetryMode('tile');
    expect(symmetryOf(useToolStore.getState(), SIZE)).toEqual({ x2: 32 });
    useSnapGridStore.setState({ grid: null });
    expect(symmetryOf(useToolStore.getState(), SIZE, { x: 10, y: 3 })).toEqual({ x2: 32 });
  });

  it('needs the tile grid on or a tile being edited', () => {
    useDrawingStore.getState().toggleSymmetryMode('tile');
    useViewStore.setState({ gridTile: false });
    expect(tileCellOf()).toBeNull();
    useTilemapStore.setState({ editMode: 'edit' });
    expect(tileCellOf()).toEqual({ width: 8, height: 8 });
  });

  it('toggles apart from the diagonal and four way modes', () => {
    useDrawingStore.getState().toggleSymmetryMode('tile');
    expect(useDrawingStore.getState()).toMatchObject({ symmetryTile: true, symmetryDiagonal: false, symmetryTurn: false });
    useDrawingStore.getState().toggleSymmetryMode('tile');
    expect(useDrawingStore.getState().symmetryTile).toBe(false);
  });
});
