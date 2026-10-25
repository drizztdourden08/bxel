/* @layer renderer-app @kind constants */
import type { ManagerFilter, PivotPreset, SortKey } from './manager.type';

const NAME_COLLATOR = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

const ZOOM = { min: 24, max: 128, step: 8, start: 48 } as const;

const NO_FILTER: ManagerFilter = { animated: false, unplaced: false, size: null, identical: 'off', tag: null, bank: null };

const SORT_KEYS: readonly SortKey[] = ['manual', 'name', 'size', 'area', 'frames', 'tags', 'bank', 'created'];

const TEMP_NAME = 'rename_tmp';

const FIRST_NUMBER = 1;

const DEFAULT_PATTERN = '{name}';

const PIVOT_PRESETS: readonly PivotPreset[] = [
  { id: 'center', label: 'Center', fx: 0.5, fy: 0.5 },
  { id: 'bottom-center', label: 'Bottom center', fx: 0.5, fy: 1 },
  { id: 'top-center', label: 'Top center', fx: 0.5, fy: 0 },
  { id: 'top-left', label: 'Top left', fx: 0, fy: 0 },
  { id: 'top-right', label: 'Top right', fx: 1, fy: 0 },
  { id: 'bottom-left', label: 'Bottom left', fx: 0, fy: 1 },
  { id: 'bottom-right', label: 'Bottom right', fx: 1, fy: 1 },
  { id: 'left', label: 'Middle left', fx: 0, fy: 0.5 },
  { id: 'right', label: 'Middle right', fx: 1, fy: 0.5 },
];

const ATLAS_LIMITS = { extrudeMax: 8, spacingMax: 64, marginMax: 256, columnsMax: 64, zoomMax: 8, widthMax: 4096, pageMax: 8192 } as const;

const ATLAS_SIDE_LIMIT = 8192;

const ATLAS_CANVAS_SIDE = 4096;

const SHEET_PICKER_NEW = 'new';

export {
  ATLAS_CANVAS_SIDE,
  ATLAS_LIMITS,
  ATLAS_SIDE_LIMIT,
  DEFAULT_PATTERN,
  FIRST_NUMBER,
  NAME_COLLATOR,
  NO_FILTER,
  PIVOT_PRESETS,
  SHEET_PICKER_NEW,
  SORT_KEYS,
  TEMP_NAME,
  ZOOM,
};
