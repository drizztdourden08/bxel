/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import { useNoticeStore } from '../stores/useNoticeStore';
import { findIdentical } from './find-identical';
import { IDENTICAL_TEXT } from './identical-text.constants';
import { selectIds } from './select-ids';

const selectDuplicates = (sprites: readonly Sprite[], flips: boolean): boolean => {
  const extra = findIdentical(sprites, flips).flatMap((group) => group.slice(1));
  if (extra.length === 0) {
    useNoticeStore.getState().post(IDENTICAL_TEXT.none);
    return false;
  }
  selectIds(extra);
  return true;
};

export { selectDuplicates };
