/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import { pickAnimation } from '../animation/pick-animation';
import { pickSheet } from './pick-sheet';
import type { PickedSheetAnimation, SheetAnimationRefs } from './sheet-pick.type';

const pickSheetAnimation = (draft: Draft, refs: SheetAnimationRefs): PickedSheetAnimation => ({
  sheet: pickSheet(draft, refs.sheet),
  animation: pickAnimation(draft, refs.animation),
});

export { pickSheetAnimation };
