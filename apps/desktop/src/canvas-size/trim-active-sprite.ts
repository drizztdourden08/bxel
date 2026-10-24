/* @layer renderer-app @kind logic */
import { trimmedFrame } from '@bxel/raster';
import { currentTarget } from '../editor/current-target';
import { trimSprites } from '../sheet-manager/trim-sprites';
import { useNoticeStore } from '../stores/useNoticeStore';
import { CANVAS_SIZE_TEXT } from './canvas-size.constants';

const trimActiveSprite = (): boolean => {
  const target = currentTarget();
  if (!target) return false;
  if (trimmedFrame(target.sprite) === null) {
    useNoticeStore.getState().post(CANVAS_SIZE_TEXT.nothingToTrim);
    return false;
  }
  return trimSprites([target.sprite.id]);
};

export { trimActiveSprite };
