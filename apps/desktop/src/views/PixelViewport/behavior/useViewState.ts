/* @layer renderer-app @kind hook */
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { PixelPoint } from '../PixelViewport.type';
import type { ViewState, ViewStateParams, ViewTarget } from './viewport.type';
import { clampPan } from './clamp-pan';
import { clampZoom } from './clamp-zoom';
import { fitZoom } from './fit-zoom';
import { stepZoom } from './step-zoom';
import { zoomAt } from './zoom-at';

const samePoint = (a: PixelPoint, b: PixelPoint): boolean => a.x === b.x && a.y === b.y;

const useViewState = (params: ViewStateParams): ViewState => {
  const { image, box, levels, onZoomChange, onPanChange } = params;
  const [ownZoom, setOwnZoom] = useState<number | null>(null);
  const [ownPan, setOwnPan] = useState<PixelPoint | null>(null);
  const centre = { x: image.width / 2, y: image.height / 2 };
  const zoom = clampZoom(levels, params.zoom ?? ownZoom ?? fitZoom(image, box));
  const pan = clampPan(params.pan ?? ownPan ?? centre, zoom, image, box);
  const target = useMemo<ViewTarget>(() => ({ zoom, pan: { x: pan.x, y: pan.y } }), [zoom, pan.x, pan.y]);
  const latest = useRef<ViewTarget>(target);
  useLayoutEffect(() => {
    latest.current = target;
  });

  const apply = (next: ViewTarget) => {
    const before = latest.current;
    const nextZoom = clampZoom(levels, next.zoom);
    const settled = { zoom: nextZoom, pan: clampPan(next.pan, nextZoom, image, box) };
    latest.current = settled;
    if (settled.zoom !== before.zoom) {
      setOwnZoom(settled.zoom);
      onZoomChange?.(settled.zoom);
    }
    if (!samePoint(settled.pan, before.pan)) {
      setOwnPan(settled.pan);
      onPanChange?.(settled.pan);
    }
  };
  const anchorOr = (anchor?: PixelPoint): PixelPoint => anchor ?? { x: box.width / 2, y: box.height / 2 };
  const zoomTo = (next: number, anchor?: PixelPoint) => apply(zoomAt(latest.current, clampZoom(levels, next), anchorOr(anchor), box));

  return {
    target,
    latest,
    apply,
    zoomTo,
    zoomStep: (direction, anchor) => zoomTo(stepZoom(levels, latest.current.zoom, direction), anchor),
    panBy: (dx, dy) => apply({ zoom: latest.current.zoom, pan: { x: latest.current.pan.x + dx, y: latest.current.pan.y + dy } }),
    fit: () => {
      apply({ zoom: fitZoom(image, box), pan: centre });
      setOwnZoom(null);
      setOwnPan(null);
    },
  };
};

export { useViewState };
