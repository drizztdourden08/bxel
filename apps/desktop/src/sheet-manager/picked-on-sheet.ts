/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../stores/useNoticeStore';
import { ANIMATION_ENTRY_TEXT } from './animation-entry-text.constants';
import type { CurrentManager } from './manager.type';
import { pickedAnimations } from './picked-animations';
import type { PickedOnSheet } from './picked-on-sheet.type';

const pickedOnSheet = (manager: Pick<CurrentManager, 'animations' | 'picked' | 'sheet'>): PickedOnSheet | null => {
  const { sheet } = manager;
  const facts = pickedAnimations(manager);
  if (sheet && facts.length > 0) return { sheet, facts };
  useNoticeStore.getState().post(sheet ? ANIMATION_ENTRY_TEXT.needAnimation : ANIMATION_ENTRY_TEXT.needSheet);
  return null;
};

export { pickedOnSheet };
