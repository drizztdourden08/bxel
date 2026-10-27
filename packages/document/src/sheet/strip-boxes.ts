/* @layer core @kind logic */
import type { Animation } from '../model/animation.type';
import type { Size } from '../model/geometry.type';
import type { Sheet } from '../model/sheet.type';
import { sheetAnimationBox } from './sheet-animation-box';
import { EMPTY_SIZE } from './sheet.constants';

const stripBoxes = (sheet: Sheet, animations: readonly Animation[]): Size[] =>
  (sheet.animationEntries ?? []).map((entry) => {
    const animation = animations.find((item) => item.id === entry.animationId);
    return animation ? sheetAnimationBox(animation, entry, sheet.spacing) : EMPTY_SIZE;
  });

export { stripBoxes };
