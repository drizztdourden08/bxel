/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import { composedImage } from '../../../timeline/composed-image';

const TileThumb = ({ artwork, animation, frameId }: { artwork: Parameters<typeof composedImage>[0]; animation: Parameters<typeof composedImage>[1]; frameId: string }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const context = canvas.current?.getContext('2d');
    const image = composedImage(artwork, animation, frameId as never);
    context?.clearRect(0, 0, animation.width, animation.height);
    if (image) context?.putImageData(image, 0, 0);
  }, [artwork, animation, frameId]);
  return <Canvas ref={canvas} className="tile-timeline__thumb" width={animation.width} height={animation.height} aria-hidden="true" />;
};

export { TileThumb };
