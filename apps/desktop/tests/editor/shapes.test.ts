/* @layer renderer-app @kind test */
import type { ShapeKind } from '@bxel/raster';
import { describe, expect, it } from 'vitest';
import { beginShape } from '../../src/editor/begin-shape';
import { constrainCorner } from '../../src/editor/constrain-corner';
import type { ShapeSpec } from '../../src/editor/editor.type';
import { shapeRequest } from '../../src/editor/shape-request';
import { updateShape } from '../../src/editor/update-shape';
import { openEditor } from './editor-harness';

const spec = (extra: Partial<ShapeSpec> = {}): ShapeSpec => ({
  shape: 'rect',
  filled: false,
  index: 5,
  brush: { shape: 'square', size: 1 },
  symmetry: {},
  from: { x: 4, y: 5 },
  to: { x: 4, y: 5 },
  ...extra,
});

const KINDS: readonly ShapeKind[] = ['line', 'rect', 'ellipse'];

describe('a shape', () => {
  it.each(KINDS.flatMap((shape) => [true, false].map((filled) => ({ shape, filled }))))(
    'draws the same pixels on the overlay and in the commit for $shape, filled $filled',
    ({ shape, filled }) => {
      const { host, target, pixels } = openEditor();
      const session = beginShape({ target: target(), spec: spec({ shape, filled }) });
      updateShape(session, { x: 20, y: 13 }, false);
      updateShape(session, { x: 14, y: 11 }, false);
      const drawn = session.indices.filter((value) => value === 5).length;
      expect(drawn).toBeGreaterThan(1);
      expect(host.execute(shapeRequest(target(), session)).ok).toBe(true);
      expect(pixels()).toEqual(session.indices);
    },
  );

  it('matches the commit with symmetry on both axes and a thick circle brush', () => {
    const { host, target, pixels } = openEditor();
    const brush = { shape: 'circle', size: 3 } as const;
    const session = beginShape({ target: target(), spec: spec({ shape: 'ellipse', brush, symmetry: { x2: 32, y2: 32 }, from: { x: 3, y: 3 }, to: { x: 3, y: 3 } }) });
    updateShape(session, { x: 9, y: 7 }, false);
    expect(session.indices[5 * 32 + 3]).toBe(5);
    expect(session.indices[5 * 32 + 28]).toBe(5);
    expect(session.indices[26 * 32 + 3]).toBe(5);
    expect(session.indices[26 * 32 + 28]).toBe(5);
    host.execute(shapeRequest(target(), session));
    expect(pixels()).toEqual(session.indices);
  });

  it('leaves no trace of an earlier corner when the pointer moves back', () => {
    const { target } = openEditor();
    const wandered = beginShape({ target: target(), spec: spec({ shape: 'line' }) });
    updateShape(wandered, { x: 25, y: 25 }, false);
    updateShape(wandered, { x: 9, y: 5 }, false);
    const direct = beginShape({ target: target(), spec: spec({ shape: 'line', to: { x: 9, y: 5 } }) });
    expect(wandered.indices).toEqual(direct.indices);
    expect(wandered.rgba).toEqual(direct.rgba);
  });

  it('is one undo step labelled with the shape', () => {
    const { host, documentId, target, pixels } = openEditor();
    const session = beginShape({ target: target(), spec: spec({ shape: 'ellipse' }) });
    updateShape(session, { x: 12, y: 12 }, false);
    host.execute(shapeRequest(target(), session));
    expect(host.view(documentId)?.lastEvent.label).toBe('Ellipse');
    expect(host.undo(documentId).ok).toBe(true);
    expect(pixels().every((value) => value === 0)).toBe(true);
  });
});

describe('Shift on a shape', () => {
  it('snaps a line to the nearest of eight directions', () => {
    const from = { x: 10, y: 10 };
    expect(constrainCorner('line', from, { x: 20, y: 12 })).toEqual({ x: 20, y: 10 });
    expect(constrainCorner('line', from, { x: 11, y: 3 })).toEqual({ x: 10, y: 3 });
    expect(constrainCorner('line', from, { x: 16, y: 14 })).toEqual({ x: 16, y: 16 });
    expect(constrainCorner('line', from, { x: 4, y: 15 })).toEqual({ x: 4, y: 16 });
  });

  it('makes a rectangle a square and an ellipse a circle', () => {
    const from = { x: 10, y: 10 };
    expect(constrainCorner('rect', from, { x: 18, y: 12 })).toEqual({ x: 18, y: 18 });
    expect(constrainCorner('ellipse', from, { x: 6, y: 9 })).toEqual({ x: 6, y: 6 });
    expect(constrainCorner('ellipse', from, { x: 10, y: 10 })).toEqual({ x: 10, y: 10 });
  });

  it('draws the constrained shape on the overlay', () => {
    const { target } = openEditor();
    const constrained = beginShape({ target: target(), spec: spec({ shape: 'line', from: { x: 2, y: 2 }, to: { x: 2, y: 2 } }) });
    updateShape(constrained, { x: 12, y: 4 }, true);
    expect(constrained.spec.to).toEqual({ x: 12, y: 2 });
    expect(constrained.indices[2 * 32 + 12]).toBe(5);
    expect(constrained.indices[4 * 32 + 12]).toBe(0);
  });
});
