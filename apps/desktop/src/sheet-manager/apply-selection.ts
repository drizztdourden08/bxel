/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { listSprites } from '../sheet/list-sprites';
import { useNoticeStore } from '../stores/useNoticeStore';
import type { SavedSelection } from './folders.type';
import { SELECTION_TEXT } from './selection-text.constants';
import { selectIds } from './select-ids';

const applySelection = (artwork: Artwork, selection: SavedSelection): boolean => {
  const alive = new Set(listSprites(artwork).map((sprite) => sprite.id));
  const ids = selection.ids.filter((id) => alive.has(id));
  if (ids.length === 0) {
    useNoticeStore.getState().post(SELECTION_TEXT.gone);
    return false;
  }
  selectIds(ids);
  return true;
};

export { applySelection };
