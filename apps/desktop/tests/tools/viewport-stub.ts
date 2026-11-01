/* @layer renderer-app @kind test */
import { vi } from 'vitest';

const viewportStub = (setZoom = vi.fn(), panTo = vi.fn()) => ({
  screenToPixel: vi.fn(),
  pixelToScreen: vi.fn(),
  fit: vi.fn(),
  setZoom,
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  redraw: vi.fn(),
  reveal: vi.fn(),
  panTo,
  zoomToRect: vi.fn(),
  view: () => ({ zoom: 4, pan: { x: 8, y: 8 }, originX: 0, originY: 0, width: 128, height: 128, dpr: 1, imageWidth: 16, imageHeight: 16 }),
});

export { viewportStub };
