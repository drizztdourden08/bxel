/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { animationCellImages } from '../sheet/animation-cell-images';
import type { FrameImage, SheetAnimationItem } from '../sheet/sheet.type';

const stripImages = (artwork: Artwork, item: SheetAnimationItem): readonly FrameImage[] => {
  const animation = artwork.animations.find((each) => each.id === item.animationId);
  if (item.tagId !== null || !animation) return item.images;
  const mirrors = animation.tags.filter((tag) => tag.kind === 'mirror').flatMap((tag) => animationCellImages(artwork, animation, tag.id));
  return [...item.images, ...mirrors];
};

export { stripImages };
