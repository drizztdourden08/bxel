/* @layer renderer-app @kind logic */
import type { Artwork, Sheet } from '@bxel/document';
import { animationCellImages } from './animation-cell-images';
import type { SheetAnimationItem } from './sheet.type';

const sheetAnimationItems = (artwork: Artwork, sheet: Sheet | null): SheetAnimationItem[] =>
  (sheet?.animationEntries ?? []).flatMap((entry) => {
    const animation = artwork.animations.find((each) => each.id === entry.animationId);
    if (!animation) return [];
    const tag = animation.tags.find((each) => each.id === entry.tagId);
    const name = tag?.kind === 'span' ? `${animation.name} ${tag.name}` : animation.name;
    return [{ animationId: animation.id, tagId: entry.tagId, name, at: entry.at, spacing: sheet?.spacing.x ?? 0, images: animationCellImages(artwork, animation, entry.tagId) }];
  });

export { sheetAnimationItems };
