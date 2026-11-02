/* @layer renderer-app @kind logic */
import { findAnimation } from '@bxel/document';
import type { Animation, AnimationId, Artwork } from '@bxel/document';
import { animationPreviewFrames } from '../asset-overview/animation-preview-frames';
import type { HoverFrame } from './hover-frame.type';
import { thumbUrl } from './thumb-url';

const cache = new WeakMap<Animation, readonly HoverFrame[]>();

const build = (artwork: Artwork, id: string): readonly HoverFrame[] => {
  const preview = animationPreviewFrames(artwork, id);
  if (preview.kind !== 'frames') return [];
  return preview.frames.flatMap((frame): HoverFrame[] => {
    const url = thumbUrl(frame.image);
    return url === null ? [] : [{ url, durationMs: frame.durationMs }];
  });
};

const hoverFramesOf = (artwork: Artwork, id: string): readonly HoverFrame[] => {
  const animation = findAnimation(artwork, id as AnimationId);
  if (!animation) return [];
  const known = cache.get(animation);
  if (known !== undefined) return known;
  const frames = build(artwork, id);
  cache.set(animation, frames);
  return frames;
};

export { hoverFramesOf };
