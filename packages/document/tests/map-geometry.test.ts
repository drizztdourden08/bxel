/* @layer core @kind test */
import { mapGeometry } from '@bxel/document';
import type { GeometryRequest, MapOrientation } from '@bxel/document';
import { describe, expect, it } from 'vitest';

const TILE = { width: 8, height: 4 };

const ISO: MapOrientation = { kind: 'isometric', staggerAxis: 'y', staggerIndex: 'odd', hexSideLength: 0 };
const STAGGERED: MapOrientation = { kind: 'staggered', staggerAxis: 'y', staggerIndex: 'odd', hexSideLength: 0 };
const HEX_Y: MapOrientation = { kind: 'hexagonal', staggerAxis: 'y', staggerIndex: 'odd', hexSideLength: 4 };
const HEX_X: MapOrientation = { kind: 'hexagonal', staggerAxis: 'x', staggerIndex: 'even', hexSideLength: 4 };

const geometry = (orientation: MapOrientation | undefined, columns = 4, rows = 3, tile = TILE) =>
  mapGeometry({ columns, rows, tile, orientation } satisfies GeometryRequest);

const centre = (kind: MapOrientation | undefined, column: number, row: number, tile = TILE) => {
  const shape = geometry(kind, 4, 3, tile);
  const origin = shape.originOf(column, row);
  return { x: origin.x + tile.width / 2, y: origin.y + tile.height / 2 };
};

describe('orthogonal map geometry', () => {
  it('lays cells on a plain grid and finds them by pixel', () => {
    const shape = geometry(undefined);
    expect([shape.width, shape.height]).toEqual([32, 12]);
    expect(shape.originOf(2, 1)).toEqual({ x: 16, y: 4 });
    expect(shape.cellAt(17, 5)).toEqual({ x: 2, y: 1 });
    expect(shape.cellAt(-1, 0).x).toBe(-1);
    expect(shape.cellNear(500, 500)).toEqual({ x: 3, y: 2 });
  });
});

describe('isometric map geometry', () => {
  it('sizes the map as a diamond of cells and puts cell (0,0) at the top corner', () => {
    const shape = geometry(ISO);
    expect([shape.width, shape.height]).toEqual([28, 14]);
    expect(shape.originOf(0, 0)).toEqual({ x: 8, y: 0 });
    expect(shape.originOf(3, 0)).toEqual({ x: 20, y: 6 });
    expect(shape.originOf(0, 2)).toEqual({ x: 0, y: 4 });
  });

  it('finds the cell under the centre of every diamond and none outside the map', () => {
    const shape = geometry(ISO);
    for (let row = 0; row < 3; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        const at = centre(ISO, column, row);
        expect(shape.cellAt(at.x, at.y)).toEqual({ x: column, y: row });
      }
    }
    expect(shape.cellAt(0, 0).x).toBe(-1);
    expect(shape.cellAt(100, 100).x).toBe(-1);
  });

  it('picks by the diamond and not by the box around it', () => {
    const shape = geometry(ISO);
    const origin = shape.originOf(1, 1);
    const corner = shape.cellAt(origin.x + 0.5, origin.y + 0.5);
    expect(corner).not.toEqual({ x: 1, y: 1 });
    expect(shape.cellNear(1000, 1000)).toEqual({ x: 3, y: 2 });
  });
});

describe('staggered map geometry', () => {
  it('shifts the odd rows half a tile right and stacks rows at half the tile height', () => {
    const shape = geometry(STAGGERED);
    expect(shape.originOf(1, 0)).toEqual({ x: 8, y: 0 });
    expect(shape.originOf(1, 1)).toEqual({ x: 12, y: 2 });
    expect([shape.width, shape.height]).toEqual([36, 8]);
  });

  it('shifts the even rows instead when asked', () => {
    const shape = geometry({ ...STAGGERED, staggerIndex: 'even' });
    expect(shape.originOf(0, 0)).toEqual({ x: 4, y: 0 });
    expect(shape.originOf(0, 1)).toEqual({ x: 0, y: 2 });
  });

  it('finds every cell by its centre', () => {
    const shape = geometry(STAGGERED);
    for (let row = 0; row < 3; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        const at = centre(STAGGERED, column, row);
        expect(shape.cellAt(at.x, at.y)).toEqual({ x: column, y: row });
      }
    }
  });
});

describe('hexagonal map geometry', () => {
  it('steps rows by half the height plus half the side for a pointy hexagon', () => {
    const shape = geometry(HEX_Y, 4, 3, { width: 8, height: 12 });
    expect(shape.originOf(0, 1)).toEqual({ x: 4, y: 8 });
    expect(shape.originOf(0, 2)).toEqual({ x: 0, y: 16 });
  });

  it('steps columns by half the width plus half the side for a flat hexagon', () => {
    const shape = geometry(HEX_X, 4, 3, { width: 12, height: 8 });
    expect(shape.originOf(1, 0)).toEqual({ x: 8, y: 0 });
    expect(shape.originOf(1, 1)).toEqual({ x: 8, y: 8 });
    expect(shape.originOf(0, 0)).toEqual({ x: 0, y: 4 });
  });

  it('finds the hexagon under the centre of every cell and the neighbour across a shared edge', () => {
    for (const [kind, tile] of [[HEX_Y, { width: 8, height: 12 }], [HEX_X, { width: 12, height: 8 }]] as const) {
      const shape = geometry(kind, 4, 3, tile);
      for (let row = 0; row < 3; row += 1) {
        for (let column = 0; column < 4; column += 1) {
          const at = centre(kind, column, row, tile);
          expect(shape.cellAt(at.x, at.y)).toEqual({ x: column, y: row });
          expect(shape.cellNear(at.x + 0.2, at.y - 0.2)).toEqual({ x: column, y: row });
        }
      }
    }
  });
});
