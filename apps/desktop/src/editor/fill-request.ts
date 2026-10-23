/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TransactionRequest } from '@bxel/document';
import type { Point } from '@bxel/raster';
import { commitRequest } from './commit-request';
import type { EditorTarget } from './editor.type';
import { FILL_LABEL } from './stroke.constants';

const fillRequest = (target: EditorTarget, at: Point, index: number): TransactionRequest =>
  commitRequest(target, FILL_LABEL, {
    name: COMMAND_NAME.pixelsFill,
    options: { x: at.x, y: at.y, index, mode: 'contiguous', connectivity: 4 },
  });

export { fillRequest };
