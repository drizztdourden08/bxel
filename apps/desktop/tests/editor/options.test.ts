/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { brushOptions } from '../../src/editor/brush-options';
import { changedAxes } from '../../src/editor/changed-axes';
import { commitSession } from '../../src/editor/commit-session';
import { useDrawingStore } from '../../src/stores/useDrawingStore';
import { symmetryOf } from '../../src/editor/symmetry-of';
import { flat, penStroke, resetEditor, tools } from './option-harness';

beforeEach(resetEditor);

describe('the tool keys', () => {
  it('selects a tool, then toggles filled on a second press of the rectangle key', () => {
    tools().selectTool('rect');
    expect(tools().tool).toBe('rect');
    expect(useDrawingStore.getState().filled.rect).toBe(false);
    tools().selectTool('rect');
    expect(useDrawingStore.getState().filled.rect).toBe(true);
    tools().selectTool('rect');
    expect(useDrawingStore.getState().filled.rect).toBe(false);
    tools().selectTool('line');
    tools().selectTool('line');
    expect(tools().tool).toBe('line');
  });

  it('cycles the fill area and leaves the other tools alone', () => {
    tools().selectTool('fill');
    tools().selectTool('fill');
    expect(tools()).toMatchObject({ tool: 'fill', fillMode: 'global' });
    tools().selectTool('fill');
    expect(tools().fillMode).toBe('contiguous');
    tools().selectTool('hand');
    tools().selectTool('hand');
    expect(tools().tool).toBe('hand');
  });
});

describe('the brush size', () => {
  it('steps by one and stays between 1 and 64', () => {
    tools().stepBrushSize(-1);
    expect(tools().brushSize).toBe(1);
    tools().stepBrushSize(1);
    tools().stepBrushSize(1);
    expect(tools().brushSize).toBe(3);
    tools().setBrushSize(500);
    expect(tools().brushSize).toBe(64);
    tools().stepBrushSize(1);
    expect(tools().brushSize).toBe(64);
    tools().setBrushSize(0);
    expect(tools().brushSize).toBe(1);
    tools().setBrushSize(Number.NaN);
    expect(tools().brushSize).toBe(1);
  });
});

describe('symmetry', () => {
  it('puts the axes at the centre of the sprite until they are dragged', () => {
    const size = { width: 32, height: 24 };
    expect(symmetryOf(tools(), size)).toEqual({});
    tools().toggleSymmetry('x');
    expect(symmetryOf(tools(), size)).toEqual({ x2: 32 });
    tools().toggleSymmetry('y');
    expect(symmetryOf(tools(), size)).toEqual({ x2: 32, y2: 24 });
    tools().setAxis('x', 17);
    tools().setAxis('y', 900);
    expect(symmetryOf(tools(), size)).toEqual({ x2: 17, y2: 48 });
    tools().setAxis('x', null);
    expect(symmetryOf(tools(), size).x2).toBe(32);
  });

  it('adds the crossing for the diagonal and the 4 way turn', () => {
    const size = { width: 32, height: 24 };
    useDrawingStore.getState().toggleSymmetryMode('diagonal');
    expect(symmetryOf(tools(), size)).toEqual({ x2: 32, y2: 24, mirrorX: false, mirrorY: false, diagonal: true });
    tools().toggleSymmetry('x');
    useDrawingStore.getState().toggleSymmetryMode('turn');
    expect(symmetryOf(tools(), size)).toEqual({ x2: 32, y2: 24, mirrorY: false, diagonal: true, turn4: true });
  });

  it('names the axes a toggle group changed', () => {
    expect(changedAxes([], ['x'])).toEqual(['x']);
    expect(changedAxes(['x', 'y'], ['y'])).toEqual(['x']);
    expect(changedAxes(['x'], ['y'])).toEqual(['x', 'y']);
    expect(changedAxes(['x'], ['x'])).toEqual([]);
  });

  it('mirrors a stroke on the overlay and in the commit', () => {
    tools().toggleSymmetry('x');
    tools().setForeground(5);
    const session = penStroke({ x: 3, y: 5 }, { x: 6, y: 5 });
    expect(session.indices[5 * 32 + 3]).toBe(5);
    expect(session.indices[5 * 32 + 28]).toBe(5);
    expect(session.indices[5 * 32 + 25]).toBe(5);
    expect(commitSession(session)?.ok).toBe(true);
    expect(flat()).toEqual(session.indices);
  });
});

describe('pixel perfect', () => {
  it('drops the corner pixel of an L step on the overlay and in the commit', () => {
    tools().setPixelPerfect(true);
    tools().setForeground(4);
    const session = penStroke({ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 });
    expect(session.indices[1 * 32 + 1]).toBe(4);
    expect(session.indices[1 * 32 + 2]).toBe(0);
    expect(session.indices[2 * 32 + 2]).toBe(4);
    expect(commitSession(session)?.ok).toBe(true);
    expect(flat()).toEqual(session.indices);
  });

  it('keeps the corner when the option is off', () => {
    const session = penStroke({ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 });
    expect(session.indices[1 * 32 + 2]).toBe(1);
  });
});

describe('the brush options', () => {
  it('collects the size, the shape, pixel perfect and symmetry for a stroke', () => {
    tools().setBrushSize(5);
    tools().setBrushShape('circle');
    tools().setPixelPerfect(true);
    tools().toggleSymmetry('y');
    expect(brushOptions(tools(), { width: 32, height: 32 })).toEqual({
      brush: { shape: 'circle', size: 5 },
      pixelPerfect: false,
      symmetry: { y2: 32 },
    });
  });

  it('keeps pixel perfect only at brush size 1', () => {
    tools().setPixelPerfect(true);
    expect(brushOptions(tools(), { width: 32, height: 32 }).pixelPerfect).toBe(true);
    tools().setBrushSize(2);
    expect(brushOptions(tools(), { width: 32, height: 32 }).pixelPerfect).toBe(false);
    expect(tools().pixelPerfect).toBe(true);
  });
});
