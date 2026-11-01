/* @layer renderer-app @kind test */
import { useViewState } from '../../src/views/PixelViewport/behavior/useViewState';
import type { ViewBox, ViewStateParams } from '../../src/views/PixelViewport/behavior/viewport.type';
import { zoomLevels } from '../../src/views/PixelViewport/behavior/zoom-levels';
import { PIXEL_ZOOM_STEPS } from '../../src/views/PixelViewport/PixelViewport.constants';
import { mountHook } from './hook-harness';

const box: ViewBox = { width: 800, height: 600, dpr: 1, margin: 32, step: 32 };
const image = { width: 64, height: 48 };
const levels = zoomLevels(PIXEL_ZOOM_STEPS, 12);

const mountView = (extra: Partial<ViewStateParams> = {}) => mountHook(() => useViewState({ image, box, levels, ...extra }));

export { box, mountView };
