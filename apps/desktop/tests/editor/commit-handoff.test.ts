/* @layer renderer-app @kind test */
import { frameToRgba } from '@bxel/document';
import type { Point } from '@bxel/raster';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { takeDirty } from '../../src/canvas-dirty/take-dirty';
import { addLayer } from '../../src/editor/add-layer';
import { beginStroke } from '../../src/editor/begin-stroke';
import { commitHandoff } from '../../src/editor/commit-handoff';
import { commitSession } from '../../src/editor/commit-session';
import { committedImage } from '../../src/editor/committed-image';
import { currentTarget } from '../../src/editor/current-target';
import type { EditorTarget } from '../../src/editor/editor.type';
import { extendStroke } from '../../src/editor/extend-stroke';
import { handOffImage } from '../../src/editor/hand-off-image';
import { takeRepaint } from '../../src/editor/take-repaint';
import { useToolStore } from '../../src/stores/useToolStore';
import { plainOptions } from './editor-harness';
import { resetEditor } from './option-harness';

class FakeImageData {
  constructor(
    readonly data: Uint8ClampedArray,
    readonly width: number,
    readonly height: number,
  ) {}
}

const live = (): EditorTarget => {
  const target = currentTarget();
  if (!target) throw new Error('the store holds no document');
  return target;
};

const truth = (): number[] => {
  const { sprite, bank, frameId } = live();
  return Array.from(frameToRgba(sprite, bank, frameId));
};

const strokeWithHandoff = (index: number, from: Point, to: Point): ImageData => {
  const session = beginStroke({ target: live(), tool: 'pencil', index, options: plainOptions, at: from });
  extendStroke(session, to);
  const image = new ImageData(session.rgba, session.width, session.height);
  takeDirty(session.rgba);
  handOffImage(session, image, commitSession(session));
  return image;
};

beforeAll(() => {
  vi.stubGlobal('ImageData', FakeImageData);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

beforeEach(() => {
  resetEditor();
  commitHandoff.current = null;
  takeRepaint();
});

describe('the committed image after a stroke', () => {
  it('reuses the live image and leaves nothing to upload when the overlay was right', () => {
    const first = committedImage(live());
    const image = strokeWithHandoff(3, { x: 1, y: 1 }, { x: 6, y: 1 });
    const after = committedImage(live());
    expect(after).toBe(image);
    expect(after).not.toBe(first);
    expect(Array.from(after.data)).toEqual(truth());
    expect(takeDirty(after.data)).toBeNull();
    expect(takeRepaint()).toBe(false);
    expect(commitHandoff.current).toBeNull();
  });

  it('gives the same image again while the document has not moved', () => {
    committedImage(live());
    const image = strokeWithHandoff(3, { x: 1, y: 1 }, { x: 4, y: 1 });
    expect(committedImage(live())).toBe(image);
    expect(committedImage(live())).toBe(image);
  });

  it('patches the pixels that a layer above hides, and asks for a repaint', () => {
    const bottom = live().layerId;
    addLayer();
    const top = beginStroke({ target: live(), tool: 'pencil', index: 2, options: plainOptions, at: { x: 3, y: 1 } });
    expect(commitSession(top)?.ok).toBe(true);
    useToolStore.getState().setLayer(bottom);
    committedImage(live());
    const image = strokeWithHandoff(5, { x: 1, y: 1 }, { x: 6, y: 1 });
    const after = committedImage(live());
    expect(after).toBe(image);
    expect(Array.from(after.data)).toEqual(truth());
    expect(takeDirty(after.data)).toEqual({ x: 3, y: 1, width: 1, height: 1 });
    expect(takeRepaint()).toBe(true);
  });

  it('rebuilds in full when the document moved on after the stroke', () => {
    committedImage(live());
    const image = strokeWithHandoff(3, { x: 1, y: 1 }, { x: 6, y: 1 });
    const other = beginStroke({ target: live(), tool: 'pencil', index: 4, options: plainOptions, at: { x: 9, y: 9 } });
    expect(commitSession(other)?.ok).toBe(true);
    const after = committedImage(live());
    expect(after).not.toBe(image);
    expect(Array.from(after.data)).toEqual(truth());
  });

  it('rebuilds in full when no handoff was made', () => {
    committedImage(live());
    const session = beginStroke({ target: live(), tool: 'pencil', index: 3, options: plainOptions, at: { x: 2, y: 2 } });
    expect(commitSession(session)?.ok).toBe(true);
    const after = committedImage(live());
    expect(Array.from(after.data)).toEqual(truth());
  });
});
