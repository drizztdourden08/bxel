/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { useViewState } from '../../src/views/PixelViewport/behavior/useViewState';
import { viewportKey } from '../../src/views/PixelViewport/behavior/viewport-key';
import type { KeyLike, ViewBox, ViewStateParams } from '../../src/views/PixelViewport/behavior/viewport.type';
import { zoomLevels } from '../../src/views/PixelViewport/behavior/zoom-levels';
import { PIXEL_ZOOM_STEPS } from '../../src/views/PixelViewport/PixelViewport.constants';
import { mountHook } from './hook-harness';

vi.mock('react', async (importOriginal) => ({ ...(await importOriginal<Record<string, unknown>>()), ...(await import('./hook-harness')).hooks }));

const box: ViewBox = { width: 800, height: 600, dpr: 1, margin: 32, step: 32 };
const image = { width: 64, height: 48 };
const levels = zoomLevels(PIXEL_ZOOM_STEPS, 12);

const mount = (extra: Partial<ViewStateParams> = {}) => mountHook(() => useViewState({ image, box, levels, ...extra }));

const key = (name: string, extra: Partial<KeyLike> = {}): KeyLike => ({ key: name, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false, ...extra });

type Mounted = ReturnType<typeof mount>;

const press = (view: Mounted, name: string, extra?: Partial<KeyLike>) => view.act((state) => viewportKey(key(name, extra), state, box)?.());

describe('the keys of a pixel viewport', () => {
  it('fits on mount, then steps the zoom with plus and minus around the centre', () => {
    const view = mount();
    expect(view.current.target).toEqual({ zoom: 12, pan: { x: 32, y: 24 } });
    press(view, '+');
    expect(view.current.target.zoom).toBe(16);
    press(view, '=');
    expect(view.current.target.zoom).toBe(24);
    press(view, '-');
    press(view, '-');
    press(view, '_');
    expect(view.current.target.zoom).toBe(8);
    expect(view.current.target.pan).toEqual({ x: 32, y: 24 });
  });

  it('shows 100% on 1 and fits again on 0', () => {
    const view = mount();
    press(view, '1');
    expect(view.current.target.zoom).toBe(1);
    press(view, '0');
    expect(view.current.target.zoom).toBe(12);
  });

  it('pans by a step in screen pixels with the arrows, four steps with Shift', () => {
    const view = mount({ zoom: 4 });
    press(view, 'ArrowRight');
    expect(view.current.target.pan).toEqual({ x: 40, y: 24 });
    press(view, 'ArrowDown', { shiftKey: true });
    expect(view.current.target.pan).toEqual({ x: 40, y: 56 });
    press(view, 'ArrowLeft');
    press(view, 'ArrowUp');
    expect(view.current.target.pan).toEqual({ x: 32, y: 48 });
  });

  it('leaves keys with Ctrl, Alt or Meta, and keys it does not use, to the app', () => {
    const view = mount();
    expect(viewportKey(key('+', { ctrlKey: true }), view.current, box)).toBeNull();
    expect(viewportKey(key('0', { metaKey: true }), view.current, box)).toBeNull();
    expect(viewportKey(key('b'), view.current, box)).toBeNull();
  });

  it('reports zoom and pan changes when they are driven by the app', () => {
    const onZoomChange = vi.fn();
    const onPanChange = vi.fn();
    const view = mount({ zoom: 2, pan: { x: 10, y: 10 }, onZoomChange, onPanChange });
    press(view, '+');
    expect(onZoomChange).toHaveBeenCalledWith(3);
    expect(view.current.target.zoom).toBe(2);
    press(view, 'ArrowRight');
    expect(onPanChange).toHaveBeenLastCalledWith({ x: 10 + 32 / 2, y: 10 });
    expect(view.current.target.pan).toEqual({ x: 10, y: 10 });
  });
});
