/* @layer renderer-app @kind logic */
import type { TransactionOk } from '@bxel/document';
import { REPORT_KEY } from '@bxel/raster';
import type { Size } from '@bxel/raster';
import { PENDING_TEXT } from './pending.constants';

const clippingText = (result: TransactionOk, resized: Size | null): string => {
  const clipped = result.report[REPORT_KEY.pixelsClipped] ?? 0;
  if (clipped > 0) return PENDING_TEXT.clipped(clipped);
  return resized ? PENDING_TEXT.resized(resized.width, resized.height) : PENDING_TEXT.noClipping;
};

export { clippingText };
