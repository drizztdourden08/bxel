/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { AnimationThumbProps } from '../EntryTile.type';
import { PLAY_MIN_MS, REDUCED_MOTION } from '../EntryTile.constants';
import { animationClip } from './animation-clip';
import { drawThumbnail } from './draw-thumbnail';
import { useThumbCanvas } from './useThumbCanvas';

const reducedMotion = (): boolean => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION).matches;

const useAnimationThumb = ({ artwork, animation, tagId, box, playing }: AnimationThumbProps): RefObject<HTMLCanvasElement | null> => {
  const canvas = useThumbCanvas(box);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return undefined;
    const clip = animationClip(artwork, animation, tagId);
    const show = (index: number): void => drawThumbnail(element, clip.images[index] ?? null, box);
    show(0);
    if (!playing || reducedMotion() || clip.images.length < 2) return undefined;
    let index = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const next = (): void => {
      index = (index + 1) % clip.images.length;
      show(index);
      timer = setTimeout(next, Math.max(PLAY_MIN_MS, clip.durations[index] ?? PLAY_MIN_MS));
    };
    timer = setTimeout(next, Math.max(PLAY_MIN_MS, clip.durations[0] ?? PLAY_MIN_MS));
    return () => {
      if (timer !== undefined) clearTimeout(timer);
      show(0);
    };
  }, [artwork, animation, tagId, box, playing]);
  return canvas;
};

export { useAnimationThumb };
