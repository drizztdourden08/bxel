/* @layer renderer-app @kind logic */
import { MODE_LABELS } from '../../../editor/selection/selection.constants';
import type { ToolSlot } from '../../../editor/tool-catalogue/tool-catalogue.type';
import type { SlotBadge } from '../../SlotIcon';
import { MODE_BADGES, TOOL_RAIL_TEXT } from '../ToolRail.constants';
import type { BadgeState } from './slot-badge.type';

const pencilBadge = (state: BadgeState): SlotBadge | null => (state.tiled === 'off' ? null : { glyph: 'T', text: TOOL_RAIL_TEXT.tiledBadge(state.tiled) });

const fillBadge = (state: BadgeState): SlotBadge | null => (state.fillMode === 'global' ? { glyph: 'G', text: TOOL_RAIL_TEXT.globalBadge } : null);

const filledBadge = (state: BadgeState): SlotBadge | null => (state.filled ? { glyph: 'F', text: TOOL_RAIL_TEXT.filledBadge } : null);

const selectBadge = (state: BadgeState): SlotBadge | null =>
  state.mode === 'replace' ? null : { glyph: MODE_BADGES[state.mode], text: TOOL_RAIL_TEXT.modeBadge(MODE_LABELS[state.mode]) };

const slotBadge = (slot: ToolSlot, state: BadgeState): SlotBadge | null => {
  if (slot.surfaces.includes('map')) return null;
  switch (slot.tool) {
    case 'pencil':
      return pencilBadge(state);
    case 'fill':
      return fillBadge(state);
    case 'rect':
    case 'ellipse':
      return filledBadge(state);
    case 'select':
      return selectBadge(state);
    case 'contour':
    case 'curve':
    case 'eraser':
    case 'gradient':
    case 'hand':
    case 'line':
    case 'move':
    case 'picker':
    case 'polygon':
    case 'shade':
    case 'slice':
    case 'spray':
    case 'zoom':
      return null;
  }
};

export { slotBadge };
