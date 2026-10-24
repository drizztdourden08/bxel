/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TransactionRequest } from '@bxel/document';
import type { MaskView, Point } from '@bxel/raster';
import { commitRequest } from './commit-request';
import type { EditorTarget, FillChoice } from './editor.type';
import { selectionMask } from './selection/selection-mask';
import { FILL_LABEL } from './stroke.constants';

const maskPart = (target: EditorTarget): { mask?: MaskView } => {
  const mask = selectionMask(target);
  return mask ? { mask } : {};
};

const fillRequest = (target: EditorTarget, at: Point, choice: FillChoice): TransactionRequest =>
  commitRequest(target, FILL_LABEL, {
    name: COMMAND_NAME.pixelsFill,
    options: { x: at.x, y: at.y, index: choice.index, mode: choice.mode, connectivity: choice.connectivity, ...maskPart(target) },
  });

export { fillRequest };
