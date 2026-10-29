/* @layer renderer-app @kind logic */
import { sheetAnimationBox } from '@bxel/document';
import type { Sheet } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { animationKey } from './animation-key';
import type { AlignBox } from './align.type';

const animationBoxes = (sheet: Sheet, keys: ReadonlySet<string> | null): AlignBox<string>[] => {
  const animations = currentArtwork()?.animations ?? [];
  return (sheet.animationEntries ?? []).flatMap((entry) => {
    const key = animationKey(entry.animationId, entry.tagId);
    const animation = animations.find((each) => each.id === entry.animationId);
    if (!animation || (keys !== null && !keys.has(key))) return [];
    const size = sheetAnimationBox(animation, entry, sheet.spacing);
    return size.width === 0 ? [] : [{ id: key, x: entry.at.x, y: entry.at.y, width: size.width, height: size.height }];
  });
};

export { animationBoxes };
