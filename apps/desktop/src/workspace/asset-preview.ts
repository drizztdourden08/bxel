/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import type { Artwork, AssetKey, SpriteId } from '@bxel/document';
import { animationPreview } from '../files/animation-preview';
import { spritePreview } from '../files/sprite-preview';

const assetPreview = (artwork: Artwork, key: AssetKey): Uint8Array | null => {
  if (key.kind === 'sprite') return spritePreview(artwork, findSprite(artwork, key.id as SpriteId));
  return key.kind === 'animation' ? animationPreview(artwork, artwork.animations.find((each) => each.id === key.id)) : null;
};

export { assetPreview };
