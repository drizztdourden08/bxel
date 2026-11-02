/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { prefersReducedMotion } from '../assistant-presence/prefers-reduced-motion';
import type { BrowserItem } from '../panel-browser/project-browser.type';
import type { HoverFrame } from './hover-frame.type';
import { hoverFrameDelay } from './hover-frame-delay';
import { hoverFramesOf } from './hover-frames-of';
import { thumbStore } from './thumb-store';

const animationIdOf = (item: BrowserItem): string | null => (item.row?.kind === 'animation' && item.row.loaded ? item.row.assetId : null);

const useHoverFrames = (ref: RefObject<HTMLElement | null>, item: BrowserItem): string | null => {
  const [url, setUrl] = useState<string | null>(null);
  const id = animationIdOf(item);
  useEffect(() => {
    const node = ref.current;
    if (node === null || id === null) return undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const stop = (): void => {
      clearTimeout(timer);
      setUrl(null);
    };
    const step = (frames: readonly HoverFrame[], index: number): void => {
      const frame = frames[index % frames.length];
      if (frame === undefined) return;
      setUrl(frame.url);
      timer = setTimeout(() => step(frames, index + 1), hoverFrameDelay(frame.durationMs));
    };
    const start = (): void => {
      const artwork = thumbStore.artwork();
      if (prefersReducedMotion() || artwork === undefined) return;
      const frames = hoverFramesOf(artwork, id);
      if (frames.length > 1) step(frames, 0);
    };
    node.addEventListener('pointerenter', start);
    node.addEventListener('pointerleave', stop);
    return () => {
      node.removeEventListener('pointerenter', start);
      node.removeEventListener('pointerleave', stop);
      clearTimeout(timer);
    };
  }, [ref, id]);
  return url;
};

export { useHoverFrames };
