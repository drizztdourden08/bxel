/* @layer renderer-app @kind logic */
import { findBank, findSprite } from '@bxel/document';
import type { Artwork, AssetKey, SpriteId } from '@bxel/document';
import { encodePngRgba, thumbnailRgba } from '@bxel/formats';
import { frameImage } from '../files/frame-image';

const assetPreview = (artwork: Artwork, key: AssetKey): Uint8Array | null => {
  if (key.kind !== 'sprite') return null;
  const sprite = findSprite(artwork, key.id as SpriteId);
  const frame = sprite?.frames[0];
  const bank = sprite ? findBank(artwork, sprite.bankId) : undefined;
  if (!sprite || !frame || !bank) return null;
  const encoded = encodePngRgba(thumbnailRgba(frameImage(sprite, bank, frame.id)));
  return encoded.ok ? encoded.bytes : null;
};

export { assetPreview };
