/* @layer renderer-app @kind hook */
import { useMemo, useRef } from 'react';
import { CANVAS_DEFAULTS } from '../../../canvas-look/canvas-look.constants';
import { lookOf } from '../../../canvas-look/look-of';
import { NO_TILING, PIXEL_GRID_FROM, PIXEL_ZOOM_STEPS } from '../PixelViewport.constants';
import type { PixelViewportProps } from '../PixelViewport.type';
import type { ViewportModel } from './viewport.type';
import { fitZoom } from './fit-zoom';
import { useBoxSize } from './useBoxSize';
import { useFrame } from './useFrame';
import { useViewportHandle } from './useViewportHandle';
import { useViewportInput } from './useViewportInput';
import { useViewState } from './useViewState';
import { useWheel } from './useWheel';
import { useZoomAnnounce } from './useZoomAnnounce';
import { zoomLevels } from './zoom-levels';

const usePixelViewport = (props: PixelViewportProps): ViewportModel => {
  const { width, height, zoomSteps = PIXEL_ZOOM_STEPS, grid = true, gridMajor = false, gridTile = false, gridFrom = PIXEL_GRID_FROM } = props;
  const { wheel = 'zoom', tiled = NO_TILING } = props;
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const box = useBoxSize(rootRef);
  const image = useMemo(() => ({ width: Math.max(1, width), height: Math.max(1, height) }), [width, height]);
  const fit = fitZoom(image, box);
  const levels = useMemo(() => zoomLevels(zoomSteps, fit), [zoomSteps, fit]);
  const view = useViewState({ image, box, levels, zoom: props.zoom, pan: props.pan, onZoomChange: props.onZoomChange, onPanChange: props.onPanChange });
  const look = useMemo(() => props.look ?? lookOf(CANVAS_DEFAULTS), [props.look]);
  const grids = useMemo(() => ({ pixel: grid, major: gridMajor, tile: gridTile }), [grid, gridMajor, gridTile]);
  const parts = { rootRef, canvasRef, view, box, image };
  const frame = { target: view.target, box, image, draw: props.draw, guides: props.guides, source: props.source, gridFrom, grids, look, tiled };
  const redraw = useFrame(rootRef, canvasRef, frame);
  useWheel(rootRef, view, box, wheel);
  useViewportHandle(props.ref, parts, redraw);
  return {
    rootRef,
    canvasRef,
    handlers: useViewportInput(parts, props),
    announcement: useZoomAnnounce(rootRef, view.target.zoom),
  };
};

export { usePixelViewport };
