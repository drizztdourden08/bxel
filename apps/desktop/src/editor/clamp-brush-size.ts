/* @layer renderer-app @kind logic */
import { BRUSH_SIZE } from '../stores/tool-store.constants';

const clampBrushSize = (size: number): number => {
  const whole = Math.trunc(size);
  if (!Number.isFinite(whole)) return BRUSH_SIZE.min;
  return Math.min(BRUSH_SIZE.max, Math.max(BRUSH_SIZE.min, whole));
};

export { clampBrushSize };
