/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSurface } from '../../../hooks/useSurface';
import { useResizeRedraw } from '../../../hooks/useResizeRedraw';
import { paintRuler } from '../../../ruler/paint-ruler';
import type { RulerSpan } from '../../../ruler/ruler.type';
import { clampAxis } from '../../../editor/clamp-axis';
import { unitScale } from '../../../ruler/unit-scale';
import { useRulerUnitStore } from '../../../stores/useRulerUnitStore';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useRulerStore } from '../../../stores/useRulerStore';
import { useToolStore } from '../../../stores/useToolStore';
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
  const span = useMemo<RulerSpan>(() => ({ origin, zoom, length, count, unit: unitScale(unit, count, tile) }), [origin, zoom, length, count, unit, tile]);
  const surface = useSurface();
  const handle = on && (surface === 'sprite' || surface === 'tile') ? clampAxis(placed, count) : null;
  const paint = useCallback(() => {
    if (canvasRef.current) paintRuler(canvasRef.current, { axis, span, cursor, handle });
  }, [axis, span, cursor, handle]);
  useEffect(paint, [paint]);
  useResizeRedraw(boxRef, paint);
  return { canvasRef, boxRef, ...useRulerDrag({ axis, span, handle }) };
};

export { useCanvasRuler };
