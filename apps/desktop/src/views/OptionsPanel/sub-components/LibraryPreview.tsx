/* @layer renderer-app @kind component */
import { decodeBrushPixels } from '@bxel/document';
import { Canvas } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import type { LibraryItem } from '../OptionsPanel.type';

const LibraryPreview = ({ item }: { item: LibraryItem }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!element || !context) return;
    element.width = item.width;
    element.height = item.height;
    context.clearRect(0, 0, item.width, item.height);
    context.fillStyle = getComputedStyle(element).color;
    decodeBrushPixels(item.pixels).forEach((value, index) => {
      if (value !== 0) context.fillRect(index % item.width, Math.floor(index / item.width), 1, 1);
    });
  }, [item]);
  return <Canvas ref={canvas} className="options-library__preview" role="img" aria-label={item.name} />;
};

export { LibraryPreview };
