/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Artwork, Sprite } from '@bxel/document';
import { spritePreview } from '../files/sprite-preview';
import type { Thumb } from './sprite-thumb.type';

const cache = new WeakMap<Sprite, Thumb>();

const dataUrl = (bytes: Uint8Array): string => {
  let text = '';
  for (const byte of bytes) text += String.fromCharCode(byte);
  return `data:image/png;base64,${btoa(text)}`;
};

const spriteThumb = (artwork: Artwork, sprite: Sprite): string | null => {
  const bank = findBank(artwork, sprite.bankId);
  const known = cache.get(sprite);
  if (known && known.bank === bank) return known.url;
  const bytes = spritePreview(artwork, sprite);
  const url = bytes === null ? null : dataUrl(bytes);
  cache.set(sprite, { bank, url });
  return url;
};

export { spriteThumb };
