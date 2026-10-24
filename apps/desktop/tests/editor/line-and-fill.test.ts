/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { commitSession } from '../../src/editor/commit-session';
import { runInstant } from '../../src/editor/run-instant';
import { startSession } from '../../src/editor/start-session';
import { flat, live, penStroke, resetEditor, tools } from './option-harness';

beforeEach(resetEditor);

describe('Shift and click', () => {
  it('draws a straight line from the last point of the previous stroke', () => {
    const plan = { kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false } as const;
    const first = startSession(plan, live(), { x: 2, y: 2 });
    expect(commitSession(first)?.ok).toBe(true);
    expect(tools().lastPoint).toEqual({ x: 2, y: 2 });
    const second = startSession({ ...plan, line: true }, live(), { x: 10, y: 2 });
    if (second.kind !== 'stroke') throw new Error('expected a stroke');
    expect(second.points).toEqual([{ x: 2, y: 2 }, { x: 10, y: 2 }]);
    expect(commitSession(second)?.ok).toBe(true);
    expect(Array.from(flat().subarray(2 * 32 + 2, 2 * 32 + 11)).every((value) => value === 1)).toBe(true);
    expect(tools().lastPoint).toEqual({ x: 10, y: 2 });
  });

  it('starts a plain stroke when there is no last point', () => {
    const plan = { kind: 'stroke', tool: 'pencil', slot: 'foreground', line: true } as const;
    const session = startSession(plan, live(), { x: 7, y: 7 });
    if (session.kind !== 'stroke') throw new Error('expected a stroke');
    expect(session.points).toEqual([{ x: 7, y: 7 }]);
  });
});

describe('the fill options', () => {
  const wall = () => {
    tools().setForeground(9);
    commitSession(penStroke({ x: 5, y: 0 }, { x: 5, y: 31 }));
    tools().setForeground(3);
  };

  it('fills only the area that touches the click when contiguous', () => {
    wall();
    runInstant('fill', live(), { x: 0, y: 0 }, 'foreground');
    expect(flat()[0]).toBe(3);
    expect(flat()[10]).toBe(0);
  });

  it('fills every pixel of the same index when global', () => {
    wall();
    tools().setFillMode('global');
    runInstant('fill', live(), { x: 0, y: 0 }, 'foreground');
    expect(flat()[0]).toBe(3);
    expect(flat()[10]).toBe(3);
    expect(flat()[5]).toBe(9);
  });

  const corner = () => {
    tools().setForeground(9);
    [{ x: 1, y: 0 }, { x: 0, y: 1 }].forEach((at) => commitSession(penStroke(at)));
    tools().setForeground(3);
  };

  it('stops at a diagonal gap with four neighbours', () => {
    corner();
    runInstant('fill', live(), { x: 0, y: 0 }, 'foreground');
    expect(flat()[0]).toBe(3);
    expect(flat()[1 * 32 + 1]).toBe(0);
  });

  it('crosses a diagonal gap with eight neighbours', () => {
    corner();
    tools().setConnectivity(8);
    runInstant('fill', live(), { x: 0, y: 0 }, 'foreground');
    expect(flat()[0]).toBe(3);
    expect(flat()[1 * 32 + 1]).toBe(3);
  });
});
