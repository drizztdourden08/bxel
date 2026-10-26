/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import type { PixelCanvasProps } from '../AssetOverview.type';

const PixelCanvas = ({ image, label, small = false }: PixelCanvasProps) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    canvas.width = image.width;
    canvas.height = image.height;
    context.putImageData(new ImageData(new Uint8ClampedArray(image.data), image.width, image.height), 0, 0);
  }, [image]);

  return <Canvas ref={ref} className={small ? 'asset-overview__thumb' : 'asset-overview__canvas'} role="img" aria-label={label} />;
};

export { PixelCanvas };
