/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

const useThumbCanvas = (box: number): RefObject<HTMLCanvasElement | null> => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const element = canvas.current;
    if (element) {
      element.width = box;
      element.height = box;
    }
  }, [box]);
  return canvas;
};

export { useThumbCanvas };
