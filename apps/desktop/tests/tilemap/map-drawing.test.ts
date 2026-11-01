/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { DRAWING_DEFAULTS } from '../../src/stores/drawing-store.constants';
import { useDrawingStore } from '../../src/stores/useDrawingStore';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { linePlace } from '../../src/tilemap/line-place';
import { rectPlace } from '../../src/tilemap/rect-place';
import { scatterPlace } from '../../src/tilemap/scatter-place';
import { strokePlace } from '../../src/tilemap/stroke-place';
import { revision } from '../sheet/sheet-harness';
import { cellsNow, openMapFile } from './map-harness';

beforeEach(() => {
  openMapFile();
  useToolStore.setState({ symmetryX: false, symmetryY: false });
  useDrawingStore.setState({ ...DRAWING_DEFAULTS });
});

const FLIP_X = 0x80000000;
const FLIP_Y = 0x40000000;

const unsigned = (cell: number | undefined): number => (cell ?? 0) >>> 0;

describe('S2 the map line', { tags: ['standard'] }, () => {
  it('places a line of cells as one undo step', () => {
    const before = revision();
    expect(linePlace({ x: 0, y: 0 }, { x: 3, y: 2 })).toBe(true);
    expect(cellsNow().filter((cell) => cell === 2)).toHaveLength(4);
    expect(revision() - before).toBe(1);
    stepHistory('undo');
    expect(cellsNow().every((cell) => cell === 0)).toBe(true);
  });
});

describe('S2 random place', { tags: ['standard'] }, () => {
  it('places tiles from the selection and repeats the scatter for the same seed', () => {
    useTilemapStore.getState().setStamp({ columns: 2, rows: 1, keys: [1, 2] });
    useDrawingStore.getState().patch({ spraySeed: 5 });
    const cells = Array.from({ length: 12 }, (_, at) => ({ x: at % 4, y: Math.floor(at / 4) }));
    expect(scatterPlace(cells)).toBe(true);
    const first = cellsNow();
    expect(first.every((cell) => cell === 1 || cell === 2)).toBe(true);
    expect(new Set(first).size).toBe(2);
    stepHistory('undo');
    expect(scatterPlace(cells)).toBe(true);
    expect(cellsNow()).toEqual(first);
  });
});

describe('S2 symmetry on the map', { tags: ['standard'] }, () => {
  it('mirrors a placement across the map and sets the flip flag on the mirrored cell', () => {
    useToolStore.getState().toggleSymmetry('x');
    const before = revision();
    expect(strokePlace([{ x: 0, y: 0 }])).toBe(true);
    expect(revision() - before).toBe(1);
    expect(unsigned(cellsNow()[0])).toBe(2);
    expect(unsigned(cellsNow()[3])).toBe((2 | FLIP_X) >>> 0);
  });

  it('flips both ways for the corner opposite across both axes', () => {
    useToolStore.getState().toggleSymmetry('x');
    useToolStore.getState().toggleSymmetry('y');
    expect(strokePlace([{ x: 0, y: 0 }])).toBe(true);
    expect(unsigned(cellsNow()[0])).toBe(2);
    expect(unsigned(cellsNow()[3])).toBe((2 | FLIP_X) >>> 0);
    expect(unsigned(cellsNow()[8])).toBe((2 | FLIP_Y) >>> 0);
    expect(unsigned(cellsNow()[11])).toBe((2 | FLIP_X | FLIP_Y) >>> 0);
  });

  it('mirrors a rectangle too', () => {
    useToolStore.getState().toggleSymmetry('x');
    expect(rectPlace({ x: 0, y: 0, width: 1, height: 3 })).toBe(true);
    expect(cellsNow().filter((cell) => cell !== 0)).toHaveLength(6);
  });
});
