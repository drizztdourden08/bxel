/* @layer renderer-app @kind logic */
import type { Sheet } from '@bxel/document';
import { useNoticeStore } from '../stores/useNoticeStore';
import { ANIMATION_ENTRY_TEXT } from './animation-entry-text.constants';
import type { AnimationFacts, CurrentManager } from './manager.type';
import { pickedAnimations } from './picked-animations';

type PickedOnSheet = { readonly sheet: Sheet; readonly facts: AnimationFacts[] };

const pickedOnSheet = (manager: Pick<CurrentManager, 'animations' | 'picked' | 'sheet'>): PickedOnSheet | null => {
  const { sheet } = manager;
  const facts = pickedAnimations(manager);
  if (sheet && facts.length > 0) return { sheet, facts };
  useNoticeStore.getState().post(sheet ? ANIMATION_ENTRY_TEXT.needAnimation : ANIMATION_ENTRY_TEXT.needSheet);
  return null;
};

export { pickedOnSheet };
