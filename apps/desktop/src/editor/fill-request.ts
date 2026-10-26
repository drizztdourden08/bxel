/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TransactionRequest } from '@bxel/document';
import type { MaskView, Point } from '@bxel/raster';
import { paintScope } from '../sheet/paint-scope';
import { commitRequest } from './commit-request';
import type { EditorTarget, FillChoice } from './editor.type';
import { editMask } from './edit-mask';
import { FILL_LABEL } from './stroke.constants';

const maskPart = (target: EditorTarget): { mask?: MaskView } => {
  const mask = editMask(target);
  return mask ? { mask } : {};
};

const fillRequest = (target: EditorTarget, at: Point, choice: FillChoice): TransactionRequest =>
  commitRequest(
    target,
    FILL_LABEL,
    {
      name: COMMAND_NAME.pixelsFill,
      options: { x: at.x, y: at.y, index: choice.index, mode: choice.mode, connectivity: choice.connectivity, wrap: choice.wrap, ...maskPart(target) },
    },
    paintScope(target),
  );

export { fillRequest };
