/* @layer renderer-app @kind logic */
import { findBank, findSprite } from '@bxel/document';
import type { Artwork, Frame, Sprite } from '@bxel/document';
import { encodePngRgba, thumbnailRgba } from '@bxel/formats';
import { NO_CURRENT } from '../editor/current-pick.constants';
import type { CurrentPick } from '../editor/current-pick.type';
import { frameImage } from './frame-image';

const coverSprite = (artwork: Artwork): Sprite | undefined => {
  const cover = artwork.coverSpriteId === null ? undefined : findSprite(artwork, artwork.coverSpriteId);
  return cover ?? artwork.sprites[0];
};

const shownFrame = (sprite: Sprite, current: CurrentPick): Frame | undefined =>
  sprite.frames.find((each) => each.id === current.frameId) ?? sprite.frames[0];

const previewPng = (artwork: Artwork, current: CurrentPick = NO_CURRENT): Uint8Array | null => {
  const sprite = coverSprite(artwork);
  const frame = sprite ? shownFrame(sprite, current) : undefined;
  const bank = sprite ? findBank(artwork, sprite.bankId) : undefined;
  if (!sprite || !frame || !bank) return null;
  const encoded = encodePngRgba(thumbnailRgba(frameImage(sprite, bank, frame.id)));
  return encoded.ok ? encoded.bytes : null;
};

export { previewPng };
