/* @layer renderer-app @kind logic */
import { findBank, findSprite } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { encodePngRgba, thumbnailRgba } from '@bxel/formats';
import { frameImage } from './frame-image';

const previewPng = (artwork: Artwork): Uint8Array | null => {
  const cover = artwork.coverSpriteId === null ? undefined : findSprite(artwork, artwork.coverSpriteId);
  const sprite = cover ?? artwork.sprites[0];
  const frame = sprite?.frames[0];
  const bank = sprite ? findBank(artwork, sprite.bankId) : undefined;
  if (!sprite || !frame || !bank) return null;
  const encoded = encodePngRgba(thumbnailRgba(frameImage(sprite, bank, frame.id)));
  return encoded.ok ? encoded.bytes : null;
};

export { previewPng };
