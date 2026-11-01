/* @layer renderer-app @kind test */
import type { Slice } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { centreEdgeAt } from '../../src/slice/centre-edge-at';
import { moveCentreEdge } from '../../src/slice/move-centre-edge';

const RECT = { x: 10, y: 10, width: 8, height: 8 };
const CENTRE = { x: 2, y: 2, width: 4, height: 4 };
const SLICE = { id: 'slice' as Slice['id'], name: '', rect: RECT, pivot: null, center: CENTRE } satisfies Slice;

describe('S2 the nine slice centre dragged on the canvas', { tags: ['standard'] }, () => {
  it('finds the centre edge under the pointer and nothing away from it', () => {
    expect(centreEdgeAt(SLICE, { x: 12, y: 13 }, 10)).toBe('left');
    expect(centreEdgeAt(SLICE, { x: 16, y: 13 }, 10)).toBe('right');
    expect(centreEdgeAt(SLICE, { x: 14, y: 12 }, 10)).toBe('top');
    expect(centreEdgeAt(SLICE, { x: 14, y: 16 }, 10)).toBe('bottom');
    expect(centreEdgeAt(SLICE, { x: 14, y: 14 }, 10)).toBeNull();
    expect(centreEdgeAt({ ...SLICE, center: null }, { x: 12, y: 13 }, 10)).toBeNull();
  });

  it('moves one edge and keeps the opposite edge where it was', () => {
    expect(moveCentreEdge(CENTRE, 'left', { x: 11, y: 0 }, RECT)).toEqual({ x: 1, y: 2, width: 5, height: 4 });
    expect(moveCentreEdge(CENTRE, 'right', { x: 17, y: 0 }, RECT)).toEqual({ x: 2, y: 2, width: 5, height: 4 });
    expect(moveCentreEdge(CENTRE, 'top', { x: 0, y: 11 }, RECT)).toEqual({ x: 2, y: 1, width: 4, height: 5 });
    expect(moveCentreEdge(CENTRE, 'bottom', { x: 0, y: 15 }, RECT)).toEqual({ x: 2, y: 2, width: 4, height: 3 });
  });

  it('never crosses the opposite edge or leaves the slice', () => {
    expect(moveCentreEdge(CENTRE, 'left', { x: 99, y: 0 }, RECT)).toEqual({ x: 5, y: 2, width: 1, height: 4 });
    expect(moveCentreEdge(CENTRE, 'right', { x: 99, y: 0 }, RECT)).toEqual({ x: 2, y: 2, width: 6, height: 4 });
    expect(moveCentreEdge(CENTRE, 'top', { x: 0, y: -99 }, RECT)).toEqual({ x: 2, y: 0, width: 4, height: 6 });
  });
});
