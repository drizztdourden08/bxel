/* @layer renderer-app @kind logic */
import { findAnimation } from '@bxel/document';
import type { AnimationId, Artwork } from '@bxel/document';
import { composedImage } from '../timeline/composed-image';
import { PREVIEW_FRAME_LIMIT } from './asset-overview.constants';
import type { OverviewPreview, PreviewFrame } from './asset-overview.type';

const animationPreviewFrames = (artwork: Artwork, id: string): OverviewPreview => {
  const animation = findAnimation(artwork, id as AnimationId);
  if (!animation) return { kind: 'none' };
  const frames = animation.frames.slice(0, PREVIEW_FRAME_LIMIT).flatMap((frame): PreviewFrame[] => {
    const image = composedImage(artwork, animation, frame.id);
    return image ? [{ id: frame.id, durationMs: frame.durationMs, image: { data: image.data, width: image.width, height: image.height } }] : [];
  });
  return frames.length === 0 ? { kind: 'none' } : { kind: 'frames', frames };
};

export { animationPreviewFrames };
