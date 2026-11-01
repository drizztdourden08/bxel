/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, Sheet } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { useNoticeStore } from '../stores/useNoticeStore';
import { ANIMATION_ENTRY_TEXT } from './animation-entry-text.constants';
import { animationKey } from './animation-key';
import type { AnimationFacts, CurrentManager } from './manager.type';
import { pickedAnimations } from './picked-animations';

const tagSteps = (sheet: Sheet, fact: AnimationFacts): CommandStep[] => {
  const placed = new Set((sheet.animationEntries ?? []).map((entry) => animationKey(entry.animationId, entry.tagId)));
  const tags = fact.animation.tags.filter((tag) => tag.kind === 'span' && !placed.has(animationKey(fact.animation.id, tag.id)));
  if (fact.tagId !== null || tags.length === 0) return [];
  const remove: CommandStep = { name: COMMAND_NAME.sheetAnimationRemove, targets: null, options: { sheet: sheet.id, animation: fact.animation.id, tag: null } };
  const add = tags.map((tag): CommandStep => ({ name: COMMAND_NAME.sheetAnimationAdd, targets: null, options: { sheet: sheet.id, animation: fact.animation.id, tag: { by: 'id', id: tag.id } } }));
  return [remove, ...add];
};

const rowsPerTag = (manager: Pick<CurrentManager, 'animations' | 'picked' | 'sheet'>): boolean => {
  const { sheet } = manager;
  const facts = pickedAnimations(manager);
  if (!sheet || facts.length === 0) {
    useNoticeStore.getState().post(sheet ? ANIMATION_ENTRY_TEXT.needAnimation : ANIMATION_ENTRY_TEXT.needSheet);
    return false;
  }
  const steps = facts.flatMap((fact) => tagSteps(sheet, fact));
  if (steps.length === 0) {
    useNoticeStore.getState().post(ANIMATION_ENTRY_TEXT.needTags);
    return false;
  }
  return runDocument(ANIMATION_ENTRY_TEXT.rowsLabel(facts.length), steps) !== null;
};

export { rowsPerTag };
