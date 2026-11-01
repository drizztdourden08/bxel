/* @layer renderer-app @kind logic */
import { RANGES } from './canvas-look.constants';
import type { CanvasSettings, GridLine } from './canvas-look.type';
import { clampSetting } from './clamp-setting';

const shiftOf = (value: unknown): number => Math.round(clampSetting(value, RANGES.offset, 0));

const gridOffsetOf = (line: GridLine, settings: Pick<CanvasSettings, 'gridOffsetX' | 'gridOffsetY'>): GridLine => ({
  ...line,
  offsetX: shiftOf(settings.gridOffsetX),
  offsetY: shiftOf(settings.gridOffsetY),
});

export { gridOffsetOf };
