/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { LOUPE } from '../CanvasOverlays.constants';
import { useLoupe } from '../behavior/useLoupe';
import type { LoupeProps } from '../CanvasOverlays.type';

const Loupe = ({ host, viewport, source }: LoupeProps) => {
  const canvas = useLoupe(host, viewport, source);
  return <Canvas ref={canvas} className="canvas-overlays__loupe" width={LOUPE.size} height={LOUPE.size} aria-hidden="true" hidden />;
};

export { Loupe };
