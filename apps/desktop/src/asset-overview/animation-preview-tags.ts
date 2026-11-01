/* @layer renderer-app @kind logic */
import { findAnimation } from '@bxel/document';
import type { AnimationId, Artwork } from '@bxel/document';
import { PREVIEW_FRAME_LIMIT } from './asset-overview.constants';
import type { PreviewTag } from './asset-overview.type';

const animationPreviewTags = (artwork: Artwork, id: string): readonly PreviewTag[] => {
  const animation = findAnimation(artwork, id as AnimationId);
  if (!animation) return [];
  const at = new Map(animation.frames.slice(0, PREVIEW_FRAME_LIMIT).map((frame, index) => [frame.id, index] as const));
  return animation.tags.flatMap((tag): PreviewTag[] => {
    if (tag.kind !== 'span') return [];
    const from = at.get(tag.from);
    const to = at.get(tag.to);
    if (from === undefined || to === undefined) return [];
    return [{ id: tag.id, name: tag.name, from: Math.min(from, to), to: Math.max(from, to), direction: tag.direction, repeat: tag.repeat }];
  });
};

export { animationPreviewTags };
