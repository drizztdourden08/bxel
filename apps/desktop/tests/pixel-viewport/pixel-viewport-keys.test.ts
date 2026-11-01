/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { viewportKey } from '../../src/views/PixelViewport/behavior/viewport-key';
import type { KeyLike } from '../../src/views/PixelViewport/behavior/viewport.type';
import { box, mountView } from './view-fixture';

vi.mock('react', async (importOriginal) => ({ ...(await importOriginal<Record<string, unknown>>()), ...(await import('./hook-harness')).hooks }));

const key = (name: string, extra: Partial<KeyLike> = {}): KeyLike => ({ key: name, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false, ...extra });

type Mounted = ReturnType<typeof mountView>;

const press = (view: Mounted, name: string, extra?: Partial<KeyLike>) => view.act((state) => viewportKey(key(name, extra), state, box)?.());

describe('S2 the keys of a pixel viewport', { tags: ['standard'] }, () => {
  it('fits on mount, then steps the zoom around the centre for the zoom commands', () => {
    const view = mountView();
    expect(view.current.target).toEqual({ zoom: 12, pan: { x: 32, y: 24 } });
    view.act((state) => state.zoomStep(1));
    expect(view.current.target.zoom).toBe(16);
    view.act((state) => state.zoomStep(1));
    expect(view.current.target.zoom).toBe(24);
    view.act((state) => state.zoomStep(-1));
    view.act((state) => state.zoomStep(-1));
    view.act((state) => state.zoomStep(-1));
    expect(view.current.target.zoom).toBe(8);
    expect(view.current.target.pan).toEqual({ x: 32, y: 24 });
  });

  it('shows 100% and fits again for the actual size and fit commands', () => {
    const view = mountView();
    view.act((state) => state.zoomTo(1));
    expect(view.current.target.zoom).toBe(1);
    view.act((state) => state.fit());
    expect(view.current.target.zoom).toBe(12);
  });

  it('pans by a step in screen pixels with the arrows, four steps with Shift', () => {
    const view = mountView({ zoom: 4 });
    press(view, 'ArrowRight');
    expect(view.current.target.pan).toEqual({ x: 40, y: 24 });
    press(view, 'ArrowDown', { shiftKey: true });
    expect(view.current.target.pan).toEqual({ x: 40, y: 56 });
    press(view, 'ArrowLeft');
    press(view, 'ArrowUp');
    expect(view.current.target.pan).toEqual({ x: 32, y: 48 });
  });

  it('leaves keys with Ctrl, Alt or Meta, and keys it does not use, to the app keymap', () => {
    const view = mountView();
    expect(viewportKey(key('+'), view.current, box)).toBeNull();
    expect(viewportKey(key('-'), view.current, box)).toBeNull();
    expect(viewportKey(key('1'), view.current, box)).toBeNull();
    expect(viewportKey(key('+', { ctrlKey: true }), view.current, box)).toBeNull();
    expect(viewportKey(key('0', { metaKey: true }), view.current, box)).toBeNull();
    expect(viewportKey(key('b'), view.current, box)).toBeNull();
  });

  it('reports zoom and pan changes when they are driven by the app', () => {
    const onZoomChange = vi.fn();
    const onPanChange = vi.fn();
    const view = mountView({ zoom: 2, pan: { x: 10, y: 10 }, onZoomChange, onPanChange });
    view.act((state) => state.zoomStep(1));
    expect(onZoomChange).toHaveBeenCalledWith(3);
    expect(view.current.target.zoom).toBe(2);
    press(view, 'ArrowRight');
    expect(onPanChange).toHaveBeenLastCalledWith({ x: 10 + 32 / 2, y: 10 });
    expect(view.current.target.pan).toEqual({ x: 10, y: 10 });
  });
});
