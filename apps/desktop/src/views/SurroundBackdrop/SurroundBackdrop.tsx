/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { useCallback } from 'react';
import { paintSurround } from '../../canvas-look/paint-surround';
import { useCanvasLook } from '../../canvas-look/useCanvasLook';
import { usePaintedCanvas } from '../../hooks/usePaintedCanvas';
import './SurroundBackdrop.css';

const SurroundBackdrop = () => {
  const look = useCanvasLook();
  const draw = useCallback((canvas: HTMLCanvasElement) => paintSurround(canvas, look), [look]);
  const ref = usePaintedCanvas(draw);
  return <Canvas ref={ref} className="surround-backdrop" aria-hidden="true" />;
};

export { SurroundBackdrop };
