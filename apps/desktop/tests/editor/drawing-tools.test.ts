/* @layer renderer-app @kind test */
import { drawPath, gradientFill } from '@bxel/raster';
import { beforeEach, describe, expect, it } from 'vitest';
import { allowPress } from '../../src/editor/allow-press';
import { commitRequest } from '../../src/editor/commit-request';
import { beginPath } from '../../src/editor/begin-path';
import { commitSession } from '../../src/editor/commit-session';
import { inkOf } from '../../src/editor/ink-of';
import { addVertex, endCurveDrag, hoverPath, pathReady } from '../../src/editor/path-session';
import { pathSpec } from '../../src/editor/path-spec';
import { ratioSnap } from '../../src/editor/ratio-snap';
import { spraySession } from '../../src/editor/start-spray';
import { startSession } from '../../src/editor/start-session';
import { tickSpray } from '../../src/editor/spray-session';
import { stepHistory } from '../../src/editor/step-history';
import { updateGradient } from '../../src/editor/update-gradient';
import { useDrawingStore } from '../../src/stores/useDrawingStore';
import { useLinkedPromptStore } from '../../src/stores/useLinkedPromptStore';
import { flat, live, resetEditor, tools } from './option-harness';

beforeEach(resetEditor);

const drawing = () => useDrawingStore.getState();

describe('the clean ratio snap', () => {
  it('snaps to the nearest of the clean ratios and names it', () => {
    const origin = { x: 0, y: 0 };
    expect(ratioSnap(origin, { x: 10, y: 5 })).toEqual({ to: { x: 10, y: 5 }, label: '2:1' });
    expect(ratioSnap(origin, { x: 3, y: 10 })).toEqual({ to: { x: 3, y: 9 }, label: '1:3' });
    expect(ratioSnap(origin, { x: 9, y: 1 })).toEqual({ to: { x: 9, y: 0 }, label: 'Horizontal' });
    expect(ratioSnap(origin, { x: -6, y: 6 })).toEqual({ to: { x: -6, y: 6 }, label: '1:1' });
    expect(ratioSnap(origin, { x: 0, y: 8 }).label).toBe('Vertical');
  });

  it('leaves a zero length drag alone', () => {
    expect(ratioSnap({ x: 4, y: 4 }, { x: 4, y: 4 })).toEqual({ to: { x: 4, y: 4 }, label: '' });
  });
});

describe('the ink of a press', () => {
  it('swaps the roles of the two colours for the right button', () => {
    tools().setForeground(5);
    tools().setBackground(9);
    drawing().patch({ inkKind: 'onlyColour' });
    expect(inkOf('foreground', tools(), drawing())).toEqual({ index: 5, ink: { kind: 'onlyColour', index: 9 } });
    expect(inkOf('background', tools(), drawing())).toEqual({ index: 9, ink: { kind: 'onlyColour', index: 5 } });
    drawing().patch({ inkKind: 'dither' });
    expect(inkOf('background', tools(), drawing()).ink).toMatchObject({ kind: 'dither', second: 5 });
  });

  it('shades up with the left button and down with the right', () => {
    drawing().patch({ inkKind: 'shade', shadeSteps: 2 });
    expect(inkOf('foreground', tools(), drawing()).ink).toEqual({ kind: 'shade', direction: 'up', steps: 2 });
    expect(inkOf('background', tools(), drawing()).ink).toEqual({ kind: 'shade', direction: 'down', steps: 2 });
    drawing().patch({ inkKind: 'lighten' });
    expect(inkOf('fourth', tools(), drawing()).ink).toEqual({ kind: 'darken', steps: 2 });
  });
});

describe('the eraser right button', () => {
  it('paints the back colour over the front colour and leaves other pixels alone', () => {
    tools().setForeground(5);
    tools().setBackground(9);
    commitSession(startSession({ kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false }, live(), { x: 3, y: 3 }));
    tools().setForeground(7);
    commitSession(startSession({ kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false }, live(), { x: 4, y: 3 }));
    tools().setForeground(5);
    const session = startSession({ kind: 'stroke', tool: 'eraser', slot: 'background', line: false }, live(), { x: 3, y: 3 });
    if (session.kind !== 'stroke') throw new Error('expected a stroke');
    session.points.push({ x: 4, y: 3 });
    commitSession(session);
    expect(flat()[3 * 32 + 3]).toBe(9);
    expect(flat()[3 * 32 + 4]).toBe(7);
  });

  it('still erases to transparent with the left button', () => {
    commitSession(startSession({ kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false }, live(), { x: 2, y: 2 }));
    commitSession(startSession({ kind: 'stroke', tool: 'eraser', slot: 'foreground', line: false }, live(), { x: 2, y: 2 }));
    expect(flat()[2 * 32 + 2]).toBe(0);
  });
});

describe('an ink on a stroke', () => {
  it('lock alpha recolours only what is already painted, on the overlay and in the commit', () => {
    tools().setForeground(4);
    commitSession(startSession({ kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false }, live(), { x: 5, y: 5 }));
    tools().setForeground(6);
    drawing().patch({ inkKind: 'lockAlpha' });
    const session = startSession({ kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false }, live(), { x: 4, y: 5 });
    if (session.kind !== 'stroke') throw new Error('expected a stroke');
    session.points.push({ x: 5, y: 5 });
    expect(commitSession(session)?.ok).toBe(true);
    expect(flat()[5 * 32 + 4]).toBe(0);
    expect(flat()[5 * 32 + 5]).toBe(6);
  });
});

describe('the gradient tool', () => {
  it('shows on the overlay what the commit paints', () => {
    tools().setForeground(2);
    tools().setBackground(6);
    const session = startSession({ kind: 'gradient', slot: 'foreground' }, live(), { x: 0, y: 0 });
    if (session.kind !== 'gradient') throw new Error('expected a gradient');
    updateGradient(session, { x: 31, y: 0 }, false);
    expect(session.indices[0]).toBe(2);
    expect(session.indices[31]).toBe(6);
    expect(commitSession(session)?.ok).toBe(true);
    expect(flat()).toEqual(session.indices);
  });

  it('equals the same colours sent to pixels.gradient directly', () => {
    tools().setForeground(2);
    tools().setBackground(6);
    drawing().patch({ gradientMode: 'dither', gradientKind: 'radial' });
    const session = startSession({ kind: 'gradient', slot: 'foreground' }, live(), { x: 16, y: 16 });
    if (session.kind !== 'gradient') throw new Error('expected a gradient');
    updateGradient(session, { x: 28, y: 16 }, false);
    const direct = new Uint8Array(32 * 32);
    gradientFill({ target: { pixels: direct, width: 32, height: 32 }, colors: [2, 6], line: session.spec.line, bayer: 4, origin: { x: 0, y: 0 }, kind: 'radial', reflect: false, pattern: 'bayer', wrap: { x: false, y: false } });
    expect(session.indices).toEqual(direct);
  });

  it('runs the other way with the right button', () => {
    tools().setForeground(2);
    tools().setBackground(6);
    const session = startSession({ kind: 'gradient', slot: 'background' }, live(), { x: 0, y: 0 });
    if (session.kind !== 'gradient') throw new Error('expected a gradient');
    expect(session.spec.colors).toEqual([6, 2]);
  });
});

describe('the spray tool', () => {
  it('replays the same dots after undo and redo', () => {
    drawing().patch({ spraySeed: 7, spraySize: 10, sprayDensity: 12 });
    tools().setForeground(3);
    const session = spraySession({ kind: 'spray', slot: 'foreground' }, live(), { x: 16, y: 16 });
    for (let tick = 0; tick < 5; tick++) tickSpray(session);
    expect(session.dots.length).toBe(72);
    expect(commitSession(session)?.ok).toBe(true);
    const painted = Array.from(flat());
    expect(painted.filter((value) => value === 3).length).toBeGreaterThan(10);
    stepHistory('undo');
    expect(flat().every((value) => value === 0)).toBe(true);
    stepHistory('redo');
    expect(Array.from(flat())).toEqual(painted);
  });

  it('draws the same scatter for the same seed', () => {
    drawing().patch({ spraySeed: 99 });
    const first = spraySession({ kind: 'spray', slot: 'foreground' }, live(), { x: 10, y: 10 });
    const second = spraySession({ kind: 'spray', slot: 'foreground' }, live(), { x: 10, y: 10 });
    expect(first.dots).toEqual(second.dots);
  });
});

describe('the path tools', () => {
  const start = (tool: 'polygon' | 'curve' | 'contour', at = { x: 4, y: 4 }) => {
    const spec = pathSpec({ tools: tools(), drawing: drawing(), target: live(), size: live().sprite, tool, slot: 'foreground' });
    return beginPath({ target: live(), tool, spec, at });
  };

  it('closes a polygon from clicked corners and commits one step', () => {
    tools().setForeground(5);
    const session = start('polygon');
    addVertex(session, { x: 20, y: 4 }, false);
    addVertex(session, { x: 20, y: 20 }, false);
    hoverPath(session, { x: 20, y: 20 }, false);
    expect(pathReady(session)).toBe(true);
    expect(commitSession(session)?.ok).toBe(true);
    expect(flat()[4 * 32 + 12]).toBe(5);
    expect(flat()[12 * 32 + 12]).toBe(5);
    expect(flat()[20 * 32 + 20]).toBe(5);
    expect(flat()[8 * 32 + 6]).toBe(0);
  });

  it('is not ready with fewer than three corners', () => {
    const session = start('polygon');
    addVertex(session, { x: 10, y: 4 }, false);
    expect(pathReady(session)).toBe(false);
  });

  it('draws a curve in two phases and matches the engine', () => {
    tools().setForeground(5);
    const session = start('curve', { x: 2, y: 20 });
    hoverPath(session, { x: 28, y: 20 }, false);
    endCurveDrag(session);
    hoverPath(session, { x: 15, y: 4 }, false);
    expect(pathReady(session)).toBe(true);
    const direct = new Uint8Array(32 * 32);
    drawPath({ target: { pixels: direct, width: 32, height: 32 }, index: 5, kind: 'curve', points: [{ x: 2, y: 20 }, { x: 15, y: 4 }, { x: 28, y: 20 }], pixelPerfect: true });
    expect(session.indices).toEqual(direct);
    expect(commitSession(session)?.ok).toBe(true);
    expect(flat()).toEqual(direct);
  });

  it('fills a contour by default', () => {
    tools().setForeground(5);
    const session = start('contour', { x: 4, y: 4 });
    for (const at of [{ x: 20, y: 4 }, { x: 20, y: 20 }, { x: 4, y: 20 }]) hoverPath(session, at, false);
    expect(pathReady(session)).toBe(true);
    commitSession(session);
    expect(flat()[12 * 32 + 12]).toBe(5);
  });

  it('keeps the outline in the front colour and fills with the back colour when asked', () => {
    tools().setForeground(5);
    tools().setBackground(9);
    drawing().patch({ fillColour: 'back' });
    const session = start('contour', { x: 4, y: 4 });
    for (const at of [{ x: 20, y: 4 }, { x: 20, y: 20 }, { x: 4, y: 20 }]) hoverPath(session, at, false);
    commitSession(session);
    expect(flat()[4 * 32 + 10]).toBe(5);
    expect(flat()[12 * 32 + 12]).toBe(9);
  });
});

describe('the rectangle with separate colours', () => {
  it('outlines in the front colour and fills in the back colour in one step', () => {
    tools().setForeground(5);
    tools().setBackground(9);
    drawing().patch({ filled: { ...drawing().filled, rect: true }, fillColour: 'back', cornerRadius: 0 });
    const session = startSession({ kind: 'shape', shape: 'rect', slot: 'foreground' }, live(), { x: 2, y: 2 });
    if (session.kind !== 'shape') throw new Error('expected a shape');
    session.spec = { ...session.spec, to: { x: 9, y: 7 } };
    expect(commitSession(session)?.ok).toBe(true);
    expect(flat()[2 * 32 + 5]).toBe(5);
    expect(flat()[4 * 32 + 5]).toBe(9);
  });
});

describe('painting on a linked cel', () => {
  const linked = () => {
    const target = live();
    const celId = 'cel_000001' as never;
    const layer = { ...target.layer, cels: { [target.frameId]: celId, frm_other: celId } as never };
    return { ...target, layer, sprite: { ...target.sprite, layers: [layer] } };
  };
  const press = { kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false } as const;

  it('asks once instead of painting, then paints with the answer', () => {
    expect(allowPress(press, linked())).toBe(false);
    expect(useLinkedPromptStore.getState().open).toBe(true);
    drawing().patch({ linkedChoice: 'all' });
    expect(allowPress(press, linked())).toBe(true);
  });

  it('never asks about a cel that is not shared', () => {
    expect(allowPress(press, live())).toBe(true);
  });

  it('sends allUses for all uses and unlinks first for this use only', () => {
    const stepsOf = (choice: 'all' | 'unlink') => {
      drawing().patch({ linkedChoice: choice });
      const session = startSession(press, live(), { x: 1, y: 1 });
      return session.kind === 'stroke' ? commitRequest(linked(), 'Pencil stroke', { name: 'pixels.paint', options: { index: 1 } }).steps : [];
    };
    expect(stepsOf('all').map((step) => step.name)).toEqual(['pixels.paint']);
    expect(stepsOf('all')[0]?.options).toMatchObject({ allUses: true });
    expect(stepsOf('unlink').map((step) => step.name)).toEqual(['cel.unlink', 'pixels.paint']);
  });
});
