/* @layer renderer-app @kind logic */
import { CANVAS_DEFAULTS, RANGES } from '../canvas-look/canvas-look.constants';
import { clampSetting } from '../canvas-look/clamp-setting';

const tileSizeOf = (value: unknown): number => Math.round(clampSetting(value, RANGES.tile, CANVAS_DEFAULTS.gridTileSize));

export { tileSizeOf };
