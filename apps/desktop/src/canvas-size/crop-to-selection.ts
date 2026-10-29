/* @layer renderer-app @kind logic */
import { TRANSFORM_COMMAND } from '@bxel/raster';
import { currentTarget } from '../editor/current-target';
import { clearSelection } from '../editor/selection/clear-selection';
import { selectionBounds } from '../editor/selection/selection-bounds';
import { runDocument } from '../sheet/run-document';
import { spriteSteps } from '../sheet-manager/sprite-steps';
import { useNoticeStore } from '../stores/useNoticeStore';
import { CANVAS_SIZE_LABEL, CANVAS_SIZE_TEXT } from './canvas-size.constants';

const cropToSelection = (): boolean => {
  const target = currentTarget();
  const box = target ? selectionBounds(target) : null;
  if (!target || !box) {
    useNoticeStore.getState().post(CANVAS_SIZE_TEXT.noSelection);
    return false;
  }
  const frame = { x: box.x, y: box.y, width: box.width, height: box.height };
  const done = runDocument(CANVAS_SIZE_LABEL.crop, spriteSteps(TRANSFORM_COMMAND.spriteCrop, [target.sprite.id], frame)) !== null;
  if (done) clearSelection();
  return done;
};

export { cropToSelection };
