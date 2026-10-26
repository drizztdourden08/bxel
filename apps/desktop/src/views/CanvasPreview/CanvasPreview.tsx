/* @layer renderer-app @kind component */
import { useSettings } from '@drizztdourden08/brock-react';
import { Canvas } from '@drizztdourden08/tessera';
import { useCallback, useEffect, useRef } from 'react';
import { paintPreview } from '../../canvas-look/paint-preview';
import { useCanvasLook } from '../../canvas-look/useCanvasLook';
import { useResizeRedraw } from '../../hooks/useResizeRedraw';
import type { AppSettings } from '../../settings.type';
import { PREVIEW_LABEL } from './CanvasPreview.constants';
import type { CanvasPreviewProps } from './CanvasPreview.type';
import './CanvasPreview.css';

const CanvasPreview = ({ kind }: CanvasPreviewProps) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const look = useCanvasLook();
  const { settings } = useSettings<AppSettings>();
  const { gridPixel: pixel, gridMajor: major, gridTile: tile } = settings;
  const paint = useCallback(() => {
    const canvas = ref.current;
    if (!canvas) return;
    paintPreview(canvas, kind, look, { pixel, major, tile });
  }, [kind, look, pixel, major, tile]);
  useEffect(paint, [paint]);
  useResizeRedraw(ref, paint);
  return <Canvas ref={ref} className="canvas-preview" role="img" aria-label={PREVIEW_LABEL[kind]} />;
};

export { CanvasPreview };
