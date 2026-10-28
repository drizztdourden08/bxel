/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { LayerThumbSource } from '../LayerStack.type';
import { THUMB_THROTTLE_MS } from '../LayerStack.constants';
import { useLivePaintStore } from '../../../stores/useLivePaintStore';
import { layerThumbDeps } from './layer-thumb-deps';
import { layerThumbImageOf } from './layer-thumb-image-of';
import { useLivePaintTick } from './useLivePaintTick';

const useLayerThumb = (source: LayerThumbSource, follow: boolean): RefObject<HTMLCanvasElement | null> => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const drawn = useRef(0);
  const latest = useRef(source);
  useEffect(() => {
    latest.current = source;
  });
  const stroke = useLivePaintTick(follow);
  const { pixels, bank, width, height } = layerThumbDeps(source);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return undefined;
    let frame = 0;
    const timer = window.setTimeout(() => {
      frame = window.requestAnimationFrame(() => {
        const image = layerThumbImageOf(latest.current, follow ? useLivePaintStore.getState().session : null);
        element.width = image.width;
        element.height = image.height;
        element.getContext('2d')?.putImageData(new ImageData(image.rgba, image.width, image.height), 0, 0);
        drawn.current = performance.now();
      });
    }, Math.max(0, THUMB_THROTTLE_MS - (performance.now() - drawn.current)));
    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
    };
  }, [pixels, bank, width, height, stroke, follow]);
  return canvas;
};

export { useLayerThumb };
