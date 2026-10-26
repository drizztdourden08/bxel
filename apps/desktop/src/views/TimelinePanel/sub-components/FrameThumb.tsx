/* @layer renderer-app @kind component */
import { useEffect, useRef } from 'react';
import { Canvas } from '@drizztdourden08/tessera';
import { composedImage } from '../../../timeline/composed-image';
import type { FrameThumbProps } from '../TimelinePanel.type';

const FrameThumb = ({ focus, cell }: FrameThumbProps) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { artwork, animation } = focus;
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!element || !context) return;
    context.clearRect(0, 0, element.width, element.height);
    const image = composedImage(artwork, animation, cell.id);
    if (image) context.putImageData(image, 0, 0);
  }, [artwork, animation, cell.id]);
  return <Canvas ref={canvas} className="frame-cell__thumb" width={animation.width} height={animation.height} aria-hidden="true" />;
};

export { FrameThumb };
