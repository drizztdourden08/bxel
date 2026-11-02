/* @layer renderer-app @kind logic */
import { TRANSFORM_COMMAND } from '@bxel/raster';
import { currentTarget } from '../editor/current-target';
import { commitSelection } from '../editor/selection/commit-selection';
import { selectionBounds } from '../editor/selection/selection-bounds';
import { selectionMask } from '../editor/selection/selection-mask';
import { runDocument } from '../sheet/run-document';
import { spriteSteps } from '../sheet-manager/sprite-steps';
import { useNoticeStore } from '../stores/useNoticeStore';
import { CANVAS_SIZE_LABEL, CANVAS_SIZE_TEXT } from './canvas-size.constants';
import { cropMask } from './crop-mask';

const cropToSelection = (): boolean => {
  const target = currentTarget();
  const box = target ? selectionBounds(target) : null;
  if (!target || !box) {
    useNoticeStore.getState().post(CANVAS_SIZE_TEXT.noSelection);
    return false;
  }
  const frame = { x: box.x, y: box.y, width: box.width, height: box.height };
  const mask = selectionMask(target);
  const done = runDocument(CANVAS_SIZE_LABEL.crop, spriteSteps(TRANSFORM_COMMAND.spriteCrop, [target.sprite.id], frame)) !== null;
  const cropped = currentTarget();
  if (done && mask && cropped) commitSelection(cropped, cropMask(mask, frame));
  return done;
};

export { cropToSelection };
