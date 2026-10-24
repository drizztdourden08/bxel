/* @layer renderer-app @kind logic */
import type { TransactionOk } from '@bxel/document';
import type { MaskView } from '@bxel/raster';
import type { EditorTarget } from '../editor.type';
import { clippingText } from './clipping-text';
import { PENDING_TEXT } from './pending.constants';
import type { PendingOutcome } from './pending.type';
import { previewImage } from './preview-image';

const resultOutcome = (target: EditorTarget, result: TransactionOk, landing: MaskView | null): PendingOutcome => {
  const frame = previewImage(target, result);
  const size = frame ?? target.sprite;
  const resized = size.width !== target.sprite.width || size.height !== target.sprite.height;
  return {
    width: size.width,
    height: size.height,
    frame,
    clipping: clippingText(result, resized ? size : null),
    error: frame ? null : PENDING_TEXT.noPreview,
    landing,
  };
};

export { resultOutcome };
