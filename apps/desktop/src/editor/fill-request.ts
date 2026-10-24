/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TransactionRequest } from '@bxel/document';
import type { Point } from '@bxel/raster';
import { commitRequest } from './commit-request';
import type { EditorTarget, FillChoice } from './editor.type';
import { FILL_LABEL } from './stroke.constants';

const fillRequest = (target: EditorTarget, at: Point, choice: FillChoice): TransactionRequest =>
  commitRequest(target, FILL_LABEL, {
    name: COMMAND_NAME.pixelsFill,
    options: { x: at.x, y: at.y, index: choice.index, mode: choice.mode, connectivity: choice.connectivity },
  });

export { fillRequest };
