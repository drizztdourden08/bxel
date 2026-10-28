/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { usePaintImage } from '../../../asset-preview/usePaintImage';
import type { ThumbCanvasProps } from '../ProjectBrowser.type';

const ThumbCanvas = ({ image, label }: ThumbCanvasProps) => {
  const ref = useRef<HTMLCanvasElement>(null);
  usePaintImage(ref, image);
  return <Canvas ref={ref} className="browser-thumb__canvas" role="img" aria-label={label} />;
};

export { ThumbCanvas };
