/* @layer renderer-app @kind constants */
import { DRAW_SLOTS } from './slots/draw.slots.constants';
import { MAP_SLOTS } from './slots/map.slots.constants';
import { SELECT_SLOTS } from './slots/select.slots.constants';
import { SHAPE_SLOTS } from './slots/shape.slots.constants';
import { VIEW_SLOTS } from './slots/view.slots.constants';
import type { SlotGroup, ToolSlot } from './tool-catalogue.type';

const SLOT_GROUPS: readonly SlotGroup[] = [
  { id: 'draw', label: 'Draw' },
  { id: 'shape', label: 'Shape' },
  { id: 'select', label: 'Select' },
  { id: 'view', label: 'View' },
];

const TOOL_SLOTS: readonly ToolSlot[] = [...DRAW_SLOTS, ...SHAPE_SLOTS, ...SELECT_SLOTS, ...MAP_SLOTS, ...VIEW_SLOTS];

const CATALOGUE_TEXT = {
  group: (label: string): string => `${label} tools`,
  disabled: 'Open or create an asset to draw',
  sheetNote: 'Isolate a sprite to paint',
  hiddenTitle: 'More tools',
  cycleHint: (label: string, key: string): string => `${label}, ${key.toUpperCase()} to cycle`,
  keyHint: (label: string, key: string): string => `${label}: press ${key.toUpperCase()}`,
} as const;

export { CATALOGUE_TEXT, SLOT_GROUPS, TOOL_SLOTS };
