/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { clampOrigin } from '../../src/editor/clamp-origin';
import { gradientOriginHit } from '../../src/editor/gradient-origin-hit';
import { gradientOriginShown } from '../../src/editor/gradient-origin-shown';
import { ORIGIN_MAX, ORIGIN_REACH } from '../../src/editor/gradient-origin.constants';
import { moveGradientOrigin } from '../../src/editor/move-gradient-origin';
import { useDrawingStore } from '../../src/stores/useDrawingStore';
import { resetEditor, tools } from './option-harness';

beforeEach(resetEditor);

const drawing = () => useDrawingStore.getState();

describe('S2 the gradient origin marker', () => {
  it('shows only for the gradient tool in dither mode', { tags: ['standard'] }, () => {
    tools().setTool('gradient');
    drawing().patch({ gradientMode: 'bands' });
    expect(gradientOriginShown()).toBe(false);
    drawing().patch({ gradientMode: 'dither' });
    expect(gradientOriginShown()).toBe(true);
    tools().setTool('pencil');
    expect(gradientOriginShown()).toBe(false);
  });

  it('hits within the reach in screen pixels and misses outside it', { tags: ['standard'] }, () => {
    const origin = { x: 4, y: 6 };
    expect(gradientOriginHit(origin, { x: 4, y: 6 }, 8)).toBe(true);
    expect(gradientOriginHit(origin, { x: 4 + ORIGIN_REACH / 8, y: 6 }, 8)).toBe(true);
    expect(gradientOriginHit(origin, { x: 4 + (ORIGIN_REACH + 1) / 8, y: 6 }, 8)).toBe(false);
    expect(gradientOriginHit(origin, { x: 5, y: 6 }, 2)).toBe(true);
    expect(gradientOriginHit(origin, { x: 5, y: 6 }, 16)).toBe(false);
  });

  it('maps a drag to whole pixel settings', { tags: ['standard'] }, () => {
    moveGradientOrigin({ x: 10.4, y: 3.6 });
    expect(drawing().gradientOriginX).toBe(10);
    expect(drawing().gradientOriginY).toBe(4);
  });

  it('keeps a drag inside the same range as the panel options', { tags: ['standard'] }, () => {
    moveGradientOrigin({ x: -5, y: ORIGIN_MAX + 30 });
    expect(drawing().gradientOriginX).toBe(0);
    expect(drawing().gradientOriginY).toBe(clampOrigin(ORIGIN_MAX + 30));
    expect(drawing().gradientOriginY).toBe(ORIGIN_MAX);
  });
});
