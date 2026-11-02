/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useCanvasSurface } from '../../../canvas-surface/useCanvasSurface';
import { useResizeRedraw } from '../../../hooks/useResizeRedraw';
import { paintRuler } from '../../../ruler/paint-ruler';
import type { RulerSpan } from '../../../ruler/ruler.type';
import { clampAxis } from '../../../editor/clamp-axis';
import { spanReversed } from '../../../ruler/span-reversed';
import { unitScale } from '../../../ruler/unit-scale';
import { useRulerUnitStore } from '../../../stores/useRulerUnitStore';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useRulerStore } from '../../../stores/useRulerStore';
import { useToolStore } from '../../../stores/useToolStore';
import { useViewStore } from '../../../stores/useViewStore';
import type { CanvasRulerModel, CanvasRulerProps } from '../CanvasRuler.type';
import { useRulerDrag } from './useRulerDrag';

const useCanvasRuler = ({ axis }: CanvasRulerProps): CanvasRulerModel => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLElement>(null);
  const horizontal = axis === 'x';
  const origin = useRulerStore((state) => (horizontal ? state.originX : state.originY));
  const length = useRulerStore((state) => (horizontal ? state.width : state.height));
  const count = useRulerStore((state) => (horizontal ? state.imageWidth : state.imageHeight));
  const zoom = useRulerStore((state) => state.zoom);
  const cursor = useReadoutStore((state) => (horizontal ? state.pointer?.x : state.pointer?.y) ?? null);
  const on = useToolStore((state) => (horizontal ? state.symmetryX : state.symmetryY));
  const placed = useToolStore((state) => (horizontal ? state.axisX : state.axisY));
  const unit = useRulerUnitStore((state) => state.unit);
  const tile = useRulerUnitStore((state) => state.tile);
  const surface = useCanvasSurface();
  const mirror = useViewStore((state) => state.mirror);
  const reversed = spanReversed(axis, mirror, surface);
  const span = useMemo<RulerSpan>(() => ({ origin, zoom, length, count, unit: unitScale(unit, count, tile), reversed }), [origin, zoom, length, count, unit, tile, reversed]);
  const handle = on && (surface === 'sprite' || surface === 'tile') ? clampAxis(placed, count) : null;
  const paint = useCallback(() => {
    if (canvasRef.current) paintRuler(canvasRef.current, { axis, span, cursor, handle });
  }, [axis, span, cursor, handle]);
  useEffect(paint, [paint]);
  useResizeRedraw(boxRef, paint);
  return { canvasRef, boxRef, ...useRulerDrag({ axis, span, handle }) };
};

export { useCanvasRuler };
