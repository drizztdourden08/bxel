/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/document';
import { SLICE_HANDLE_REACH } from './slice.constants';
import { LETTERS } from './slice-handle-at.constants';
import type { SliceHandle } from './slice-handle.type';

const edgeAt = (value: number, low: number, high: number, reach: number): 'low' | 'high' | null => {
  if (value < low - reach || value > high + reach) return null;
  if (Math.abs(value - low) <= reach) return 'low';
  return Math.abs(value - high) <= reach ? 'high' : null;
};

const letter = (axis: 'vertical' | 'horizontal', side: 'low' | 'high' | null): string => (side === null ? '' : LETTERS[axis][side]);

const sliceHandleAt = (rect: Rect, raw: { x: number; y: number }, zoom: number): SliceHandle | null => {
  const reach = SLICE_HANDLE_REACH / zoom;
  const across = edgeAt(raw.x, rect.x, rect.x + rect.width, reach);
  const down = edgeAt(raw.y, rect.y, rect.y + rect.height, reach);
  const name = `${letter('vertical', down)}${letter('horizontal', across)}`;
  return name === '' ? null : (name as SliceHandle);
};

export { sliceHandleAt };
