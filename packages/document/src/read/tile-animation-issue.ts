/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { Tile, Tileset } from '../model/tilemap.type';
import { findAnimation } from './find-animation';

const tileAnimationIssue = (artwork: Artwork, tileset: Tileset, tile: Tile): string | null => {
  const link = tile.animation;
  if (!link) return null;
  const animation = findAnimation(artwork, link.animationId);
  if (!animation) return 'its animation does not exist.';
  if (animation.width !== tileset.tileWidth || animation.height !== tileset.tileHeight) {
    return `animation "${animation.name}" is ${animation.width} by ${animation.height}, not the tile size.`;
  }
  if (animation.bankId !== tileset.bankId) return `animation "${animation.name}" uses another palette.`;
  const tag = link.tagId === null ? null : animation.tags.find((item) => item.id === link.tagId);
  if (link.tagId !== null && tag?.kind !== 'span') return `animation "${animation.name}" has no such span tag.`;
  return null;
};

export { tileAnimationIssue };
