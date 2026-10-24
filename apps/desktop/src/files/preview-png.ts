/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import type { Artwork, Sprite } from '@bxel/document';
import { NO_CURRENT } from '../editor/current-pick.constants';
import type { CurrentPick } from '../editor/current-pick.type';
import { spritePreview } from './sprite-preview';

const coverSprite = (artwork: Artwork): Sprite | undefined => {
  const cover = artwork.coverSpriteId === null ? undefined : findSprite(artwork, artwork.coverSpriteId);
  return cover ?? artwork.sprites[0];
};

const previewPng = (artwork: Artwork, current: CurrentPick = NO_CURRENT): Uint8Array | null =>
  spritePreview(artwork, coverSprite(artwork), current.frameId);

export { previewPng };
