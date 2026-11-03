/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { useViewStore } from '../../src/stores/useViewStore';
import { clipRect } from '../../src/views/Navigator/behavior/clip-rect';
import { fitThumb } from '../../src/views/Navigator/behavior/fit-thumb';
import { describeView } from '../../src/views/Navigator/behavior/describe-view';
import { navigatorKey } from '../../src/views/Navigator/behavior/navigator-key';
import { navigatorOverlays } from '../../src/views/Navigator/behavior/navigator-overlays';
import { panOfViewport } from '../../src/views/Navigator/behavior/pan-of-viewport';
import { shownPercent } from '../../src/views/Navigator/behavior/shown-percent';
import { visibleRect } from '../../src/views/Navigator/behavior/visible-rect';
import { wheelZoom } from '../../src/views/Navigator/behavior/wheel-zoom';
import type { PixelView } from '../../src/views/PixelViewport';

const view = (zoom: number, pan: { x: number; y: number }): PixelView => ({
  zoom, pan, originX: 0, originY: 0, width: 400, height: 200, dpr: 1, imageWidth: 64, imageHeight: 32,
});

describe('K1 the navigator geometry', { tags: ['critical'] }, () => {
  it('fits the whole image in the box and keeps its shape', () => {
    const thumb = fitThumb({ width: 64, height: 32 }, { width: 200, height: 152 });
    expect(thumb).toEqual({ width: 200, height: 100, scale: 3.125 });
    expect(fitThumb({ width: 512, height: 512 }, { width: 200, height: 152 }).height).toBe(152);
  });

  it('shows the visible part of the image as a rectangle around the pan', () => {
    expect(visibleRect(view(8, { x: 32, y: 16 }))).toEqual({ x: 7, y: 3.5, width: 50, height: 25 });
  });

  it('cuts the rectangle to the image when the view reaches past an edge', () => {
    const rect = visibleRect(view(2, { x: 10, y: 10 }));
    expect(clipRect(rect, { width: 64, height: 32 })).toEqual({ x: 0, y: 0, width: 64, height: 32 });
  });

  it('reads one short caption share and clamps the spoken range to the image', () => {
    const wide = view(2, { x: 10, y: 10 });
    expect(shownPercent(wide)).toBe(100);
    expect(describeView(wide)).toContain('x 0 to 64 and y 0 to 32 of an image 64 by 32 pixels');
    const near = view(8, { x: 32, y: 16 });
    expect(shownPercent(near)).toBe(Math.round(((50 * 25) / (64 * 32)) * 100));
    expect(describeView(view(8, { x: 60, y: 16 }))).toContain('to 64');
  });
});

describe('K1 the navigator on the Tessera map', { tags: ['critical'] }, () => {
  it('moves the pan by the distance the frame was dragged, so the grab point stays under the pointer', () => {
    const start = view(8, { x: 32, y: 16 });
    const frame = visibleRect(start);
    expect(panOfViewport(start, frame)).toEqual({ x: 32, y: 16 });
    expect(panOfViewport(start, { ...frame, x: frame.x + 5, y: frame.y - 2 })).toEqual({ x: 37, y: 14 });
  });

  it('keeps the pan on an axis where the view shows the whole image', () => {
    const wide = view(2, { x: 10, y: 10 });
    expect(panOfViewport(wide, { x: 0, y: 0, width: 200, height: 100 })).toEqual({ x: 10, y: 10 });
  });

  it('draws the selection as a selection mark and the other view as a view mark, and nothing without them', () => {
    expect(navigatorOverlays(null, null)).toEqual([]);
    const marks = navigatorOverlays({ x: 1, y: 2, width: 3, height: 4 }, { x: 5, y: 6, width: 7, height: 8 });
    expect(marks.map((mark) => mark.kind)).toEqual(['selection', 'view']);
    expect(marks[1]?.rect).toEqual({ x: 5, y: 6, width: 7, height: 8 });
    expect(marks.some((mark) => mark.interactive)).toBe(false);
  });

  it('zooms at the point under the wheel and takes only Plus, Minus and Home as its own keys', () => {
    const viewport = { pixelToScreen: (x: number, y: number) => ({ x: x * 2, y: y * 2 }), zoomIn: vi.fn(), zoomOut: vi.fn(), fit: vi.fn() };
    useViewStore.setState({ viewport: viewport as never });
    wheelZoom(1, { x: 4, y: 5 });
    wheelZoom(-1, { x: 1, y: 1 });
    expect(viewport.zoomIn).toHaveBeenCalledWith({ x: 8, y: 10 });
    expect(viewport.zoomOut).toHaveBeenCalledWith({ x: 2, y: 2 });
    expect(navigatorKey('+')).toBe(true);
    expect(navigatorKey('Home')).toBe(true);
    expect(viewport.fit).toHaveBeenCalledTimes(1);
    expect(navigatorKey('ArrowLeft')).toBe(false);
    useViewStore.setState({ viewport: null });
    expect(navigatorKey('+')).toBe(false);
  });
});
