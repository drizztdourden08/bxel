/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import { composedImage } from '../../../timeline/composed-image';
import type { GhostThumbProps } from './GhostThumb.type';

const GhostThumb = ({ focus, frameId }: GhostThumbProps) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { artwork, animation } = focus;
  useEffect(() => {
    const context = canvas.current?.getContext('2d');
    const image = composedImage(artwork, animation, frameId);
    if (image) context?.putImageData(image, 0, 0);
  }, [artwork, animation, frameId]);
  return <Canvas ref={canvas} className="frame-ghost__thumb" width={animation.width} height={animation.height} aria-hidden="true" />;
};

export { GhostThumb };
