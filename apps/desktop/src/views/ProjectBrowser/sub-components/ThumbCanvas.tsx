/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import type { ThumbCanvasProps } from '../ProjectBrowser.type';

const ThumbCanvas = ({ image, label }: ThumbCanvasProps) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = ref.current;
    const context = element?.getContext('2d');
    if (!element || !context) return;
    element.width = image.width;
    element.height = image.height;
    context.putImageData(new ImageData(new Uint8ClampedArray(image.data), image.width, image.height), 0, 0);
  }, [image]);
  return <Canvas ref={ref} className="browser-thumb__canvas" role="img" aria-label={label} />;
};

export { ThumbCanvas };
