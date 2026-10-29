/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { beginPath } from '../../src/editor/begin-path';
import { brushOf } from '../../src/editor/brush-of';
import { commitSession } from '../../src/editor/commit-session';
import { endCurveDrag } from '../../src/editor/end-curve-drag';
import { hoverPath } from '../../src/editor/hover-path';
import { inkOf } from '../../src/editor/ink-of';
import { leash } from '../../src/editor/leash';
import { pathPoints } from '../../src/editor/path-points';
import { pathSpec } from '../../src/editor/path-spec';
import { startSession } from '../../src/editor/start-session';
import { useDrawingStore } from '../../src/stores/useDrawingStore';
import { inkFor } from '../../src/stores/ink-for';
import { flat, live, resetEditor, tools } from './option-harness';

beforeEach(resetEditor);

const drawing = () => useDrawingStore.getState();

describe('the stabiliser leash', () => {
  it('stays put while the pointer is inside the leash and follows when it pulls tight', () => {
    expect(leash(null, { x: 5, y: 5 }, 8)).toEqual({ x: 5, y: 5 });
    expect(leash({ x: 0, y: 0 }, { x: 6, y: 0 }, 8)).toEqual({ x: 0, y: 0 });
    expect(leash({ x: 0, y: 0 }, { x: 20, y: 0 }, 8)).toEqual({ x: 12, y: 0 });
  });

  it('trails along the line to the pointer, not past it', () => {
    const held = leash({ x: 0, y: 0 }, { x: 30, y: 40 }, 10);
    expect(held.x).toBeCloseTo(24);
    expect(held.y).toBeCloseTo(32);
  });
});

describe('an ink for each tool', () => {
  it('remembers the ink of every tool on its own', () => {
    drawing().setInk('pencil', 'behind');
    drawing().setInk('line', 'dither');
    expect(inkFor(drawing(), 'pencil')).toBe('behind');
    expect(inkFor(drawing(), 'line')).toBe('dither');
    expect(inkFor(drawing(), 'rect')).toBe('normal');
  });

  it('paints with the ink of the tool that is selected', () => {
    drawing().setInk('pencil', 'behind');
    tools().selectTool('pencil');
    expect(inkOf('foreground', tools(), drawing()).ink).toEqual({ kind: 'behind' });
    tools().selectTool('line');
    expect(inkOf('foreground', tools(), drawing()).ink).toBeUndefined();
  });
});

describe('the line brush', () => {
  it('carries its angle only when the tip is the line', () => {
    tools().setBrushSize(5);
    tools().setBrushAngle(45);
    tools().setBrushShape('square');
    expect(brushOf(tools())).toEqual({ shape: 'square', size: 5 });
    tools().setBrushShape('line');
    expect(brushOf(tools())).toEqual({ shape: 'line', size: 5, angle: 45 });
  });

  it('paints a one pixel line at the angle and commits it', () => {
    tools().setForeground(5);
    tools().setBrushSize(3);
    tools().setBrushShape('line');
    tools().setBrushAngle(90);
    commitSessionAt({ x: 10, y: 10 });
    expect([flat()[9 * 32 + 10], flat()[10 * 32 + 10], flat()[11 * 32 + 10]]).toEqual([5, 5, 5]);
    expect([flat()[10 * 32 + 9], flat()[10 * 32 + 11]]).toEqual([0, 0]);
  });
});

const commitSessionAt = (at: { x: number; y: number }): void => {
  expect(commitSession(startSession({ kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false }, live(), at))?.ok).toBe(true);
};

describe('a cubic curve', () => {
  const begin = () => {
    const spec = pathSpec({ tools: tools(), drawing: drawing(), target: live(), size: live().sprite, tool: 'curve', slot: 'foreground' });
    return beginPath({ target: live(), tool: 'curve', spec, at: { x: 2, y: 20 } });
  };

  it('takes one handle by default and two with the option on', () => {
    expect(begin().spec.cubic).toBeUndefined();
    drawing().patch({ curveCubic: true });
    expect(begin().spec.cubic).toBe(true);
  });

  it('hands the engine both handles and paints the same pixels as the engine does', () => {
    tools().setForeground(5);
    drawing().patch({ curveCubic: true });
    const session = begin();
    hoverPath(session, { x: 26, y: 20 }, false);
    endCurveDrag(session);
    hoverPath(session, { x: 2, y: 4 }, false);
    session.handle = session.hover;
    hoverPath(session, { x: 26, y: 4 }, false);
    expect(pathPoints(session)).toEqual([{ x: 2, y: 20 }, { x: 2, y: 4 }, { x: 26, y: 4 }, { x: 26, y: 20 }]);
    expect(commitSession(session)?.ok).toBe(true);
    expect(flat()[20 * 32 + 2]).toBe(5);
    expect(flat()[20 * 32 + 26]).toBe(5);
    expect(flat().filter((value) => value === 5).length).toBeGreaterThan(25);
  });
});
