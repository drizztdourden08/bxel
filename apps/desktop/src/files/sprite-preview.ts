/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Artwork, FrameId, Sprite } from '@bxel/document';
import { encodePngRgba, thumbnailRgba } from '@bxel/formats';
import { frameImage } from './frame-image';

const spritePreview = (artwork: Artwork, sprite: Sprite | undefined, frameId: FrameId | null = null): Uint8Array | null => {
  const frame = sprite ? (sprite.frames.find((each) => each.id === frameId) ?? sprite.frames[0]) : undefined;
  const bank = sprite ? findBank(artwork, sprite.bankId) : undefined;
  if (!sprite || !frame || !bank) return null;
  const encoded = encodePngRgba(thumbnailRgba(frameImage(sprite, bank, frame.id)));
  return encoded.ok ? encoded.bytes : null;
};

export { spritePreview };
