/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { SheetAnimationEntry } from '../../model/sheet.type';
import { pickAnimTag } from '../animation/pick-anim-tag';
import { pickSheetAnimation } from './pick-sheet-animation';
import type { PickedSheetEntries, SheetEntryRefs } from './sheet-pick.type';

const pickSheetEntries = (draft: Draft, refs: SheetEntryRefs): PickedSheetEntries => {
  const { sheet, animation } = pickSheetAnimation(draft, refs);
  const tagId = refs.tag === undefined || refs.tag === null ? refs.tag : pickAnimTag(animation, refs.tag, 'options.tag').id;
  const hit = (entry: SheetAnimationEntry): boolean => entry.animationId === animation.id && (tagId === undefined || entry.tagId === tagId);
  return { sheet, animation, entries: sheet.animationEntries ?? [], hit };
};

export { pickSheetEntries };
