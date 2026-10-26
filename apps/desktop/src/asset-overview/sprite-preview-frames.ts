/* @layer renderer-app @kind logic */
import { findBank, findSprite } from '@bxel/document';
import type { Artwork, SpriteId } from '@bxel/document';
import { frameImage } from '../files/frame-image';
import { PREVIEW_FRAME_LIMIT } from './asset-overview.constants';
import type { OverviewPreview } from './asset-overview.type';

const spritePreviewFrames = (artwork: Artwork, id: string): OverviewPreview => {
  const sprite = findSprite(artwork, id as SpriteId);
  const bank = sprite ? findBank(artwork, sprite.bankId) : undefined;
  if (!sprite || !bank) return { kind: 'none' };
  const frames = sprite.frames.slice(0, PREVIEW_FRAME_LIMIT).map((frame) => ({
    id: frame.id,
    durationMs: frame.durationMs,
    image: frameImage(sprite, bank, frame.id),
  }));
  return frames.length === 0 ? { kind: 'none' } : { kind: 'frames', frames };
};

export { spritePreviewFrames };
