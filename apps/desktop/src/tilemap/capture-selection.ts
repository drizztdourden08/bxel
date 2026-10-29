/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../stores/useNoticeStore';
import { useToolStore } from '../stores/useToolStore';
import { captureCells } from './capture-cells';
import { pickAt } from './pick-at';
import { selectedMap } from './selected-map';
import { CELL_CLIP_TEXT } from './tilemap.constants';

const captureSelection = (): boolean => {
  const picked = selectedMap();
  if (!picked) return false;
  const { rect, mask } = picked.selection;
  const one = rect.width === 1 && rect.height === 1;
  const taken = one ? pickAt({ x: rect.x, y: rect.y }) : captureCells(rect, mask);
  if (!taken) {
    useNoticeStore.getState().post(CELL_CLIP_TEXT.noStamp);
    return false;
  }
  useToolStore.getState().setTool('pencil');
  return true;
};

export { captureSelection };
