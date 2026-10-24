/* @layer renderer-app @kind logic */
import { clearSpriteSelection } from '../../../sheet/clear-selection';
import { isolateSprite } from '../../../sheet/isolate-sprite';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { DOUBLE_CLICK_MS } from '../SheetCanvas.constants';
import type { DownInput } from '../SheetCanvas.type';
import { hitSprite } from './hit-sprite';
import { pressSprite } from './press-sprite';
import { startSlice } from './start-slice';

const sheetDown = (input: DownInput): void => {
  const { event, at, items, drag, memo } = input;
  const hit = hitSprite(items, at);
  if (useSpriteStore.getState().sliceDraw) {
    drag.current = hit ? startSlice(hit, at) : null;
    return;
  }
  if (!hit) {
    clearSpriteSelection();
    return;
  }
  const id = hit.sprite.id;
  const twice = memo.current.id === id && event.timeStamp - memo.current.at < DOUBLE_CLICK_MS;
  memo.current = { id: twice ? null : id, at: event.timeStamp };
  if (twice) isolateSprite(id);
  else drag.current = pressSprite({ event, id, at });
};

export { sheetDown };
