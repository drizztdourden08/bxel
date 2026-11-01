/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { useNoticeStore } from '../stores/useNoticeStore';
import { ANIMATION_ENTRY_TEXT, COPY_REF } from './animation-entry-text.constants';
import type { AnimationFacts, CurrentManager } from './manager.type';
import { pickedAnimations } from './picked-animations';
import { idRef, nameRef } from './tag-ref-of';

const copySteps = (sheetId: string, fact: AnimationFacts, index: number): CommandStep[] => {
  const tag = nameRef(fact.animation, fact.tagId);
  if (tag === undefined) return [];
  const ref = `${COPY_REF}${index}`;
  return [
    { name: COMMAND_NAME.animationDuplicate, targets: null, options: { animation: fact.animation.id }, ref },
    { name: COMMAND_NAME.sheetAnimationRemove, targets: null, options: { sheet: sheetId, animation: fact.animation.id, tag: idRef(fact.tagId) } },
    { name: COMMAND_NAME.sheetAnimationAdd, targets: null, options: { sheet: sheetId, animation: { ref }, tag, at: fact.at } },
  ];
};

const copyAnimationsForSheet = (manager: Pick<CurrentManager, 'animations' | 'picked' | 'sheet'>): boolean => {
  const { sheet } = manager;
  const facts = pickedAnimations(manager);
  if (!sheet || facts.length === 0) {
    useNoticeStore.getState().post(sheet ? ANIMATION_ENTRY_TEXT.needAnimation : ANIMATION_ENTRY_TEXT.needSheet);
    return false;
  }
  const steps = facts.flatMap((fact, index) => copySteps(sheet.id, fact, index));
  return steps.length > 0 && runDocument(ANIMATION_ENTRY_TEXT.copyLabel(facts.length), steps) !== null;
};

export { copyAnimationsForSheet };
