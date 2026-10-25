/* @layer renderer-app @kind test */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { commitSession } from '../../src/editor/commit-session';
import { insidePaintArea } from '../../src/editor/inside-paint-area';
import { runInstant } from '../../src/editor/run-instant';
import { shapeSpec } from '../../src/editor/shape-spec';
import { beginShape } from '../../src/editor/begin-shape';
import { useViewStore } from '../../src/stores/useViewStore';
import { flat, live, penStroke, resetEditor, tools } from './option-harness';

const WIDTH = 32;

const pixelAt = (x: number, y: number): number => flat()[y * WIDTH + x] ?? 0;

beforeEach(resetEditor);
afterEach(() => useViewStore.getState().setTiled('off'));

describe('painting with the tiled preview on', () => {
  it('accepts a press in a repeated copy only on the tiled axis', () => {
    expect(insidePaintArea(live(), { x: 35, y: 4 })).toBe(false);
    useViewStore.getState().setTiled('x');
    expect(insidePaintArea(live(), { x: 35, y: 4 })).toBe(true);
    expect(insidePaintArea(live(), { x: 35, y: 40 })).toBe(false);
  });

  it('continues a stroke that leaves the right edge from the left edge as one step', () => {
    useViewStore.getState().setTiled('x');
    const before = live().revision;
    expect(commitSession(penStroke({ x: 29, y: 5 }, { x: 34, y: 5 }))?.ok).toBe(true);
    expect([29, 30, 31, 0, 1, 2].map((x) => pixelAt(x, 5))).toEqual([1, 1, 1, 1, 1, 1]);
    expect(pixelAt(3, 5)).toBe(0);
    expect(live().revision).toBe(before + 1);
  });

  it('clips the same stroke when the preview is off', () => {
    commitSession(penStroke({ x: 29, y: 5 }, { x: 34, y: 5 }));
    expect(pixelAt(0, 5)).toBe(0);
    expect(pixelAt(31, 5)).toBe(1);
  });

  it('wraps a line drawn with the shape tool over the bottom edge', () => {
    useViewStore.getState().setTiled('y');
    const spec = { ...shapeSpec(tools(), live().sprite, 2, { x: 4, y: 30 }), wrap: { x: false, y: true } };
    const session = beginShape({ target: live(), spec: { ...spec, shape: 'line', to: { x: 4, y: 34 } } });
    expect(commitSession(session)?.ok).toBe(true);
    expect([30, 31, 0, 1, 2].map((y) => pixelAt(4, y))).toEqual([2, 2, 2, 2, 2]);
  });

  it('folds a fill seed from a repeated copy and fills across the edge', () => {
    useViewStore.getState().setTiled('both');
    tools().setForeground(9);
    commitSession(penStroke({ x: 10, y: 0 }, { x: 10, y: 31 }));
    tools().setForeground(3);
    runInstant('fill', live(), { x: 12, y: 0 }, 'foreground');
    expect(pixelAt(31, 7)).toBe(3);
    expect(pixelAt(0, 7)).toBe(3);
    expect(pixelAt(10, 7)).toBe(9);
    expect(pixelAt(9, 7)).toBe(3);
  });
});
