/* @layer renderer-app @kind test */
import { drawPath } from '@bxel/raster';
import { beforeEach, describe, expect, it } from 'vitest';
import { addVertex } from '../../src/editor/add-vertex';
import { allowPress } from '../../src/editor/allow-press';
import { beginPath } from '../../src/editor/begin-path';
import { commitRequest } from '../../src/editor/commit-request';
import { commitSession } from '../../src/editor/commit-session';
import { endCurveDrag } from '../../src/editor/end-curve-drag';
import { hoverPath } from '../../src/editor/hover-path';
import { pathReady } from '../../src/editor/path-ready';
import { pathSpec } from '../../src/editor/path-spec';
import { startSession } from '../../src/editor/start-session';
import { useDrawingStore } from '../../src/stores/useDrawingStore';
import { useLinkedPromptStore } from '../../src/stores/useLinkedPromptStore';
import { flat, live, resetEditor, tools } from './option-harness';

beforeEach(resetEditor);

const drawing = () => useDrawingStore.getState();

describe('S2 the path tools', { tags: ['standard'] }, () => {
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

describe('S2 the rectangle with separate colours', { tags: ['standard'] }, () => {
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

describe('S2 painting on a linked cel', { tags: ['standard'] }, () => {
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
