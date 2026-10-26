/* @layer renderer-app @kind logic */
import { findBank, findSprite } from '@bxel/document';
import type { Artwork, SpriteId } from '@bxel/document';
import { frameImage } from '../files/frame-image';
import type { OverviewPreview } from './asset-overview.type';

const spritePreviewImage = (artwork: Artwork, id: string): OverviewPreview => {
  const sprite = findSprite(artwork, id as SpriteId);
  const bank = sprite ? findBank(artwork, sprite.bankId) : undefined;
  const first = sprite?.frames[0];
  if (!sprite || !bank || !first) return { kind: 'none' };
  return { kind: 'image', image: frameImage(sprite, bank, first.id) };
};

export { spritePreviewImage };
