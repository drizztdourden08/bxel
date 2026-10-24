/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import type { Artwork, AssetKey, SpriteId } from '@bxel/document';
import { spritePreview } from '../files/sprite-preview';

const assetPreview = (artwork: Artwork, key: AssetKey): Uint8Array | null =>
  key.kind === 'sprite' ? spritePreview(artwork, findSprite(artwork, key.id as SpriteId)) : null;

export { assetPreview };
