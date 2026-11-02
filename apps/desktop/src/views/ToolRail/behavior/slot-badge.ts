/* @layer renderer-app @kind logic */
import { MODE_LABELS } from '../../../editor/selection/selection.constants';
import type { ToolSlot } from '../../../editor/tool-catalogue/tool-catalogue.type';
import type { SlotBadge } from '../../SlotIcon';
import { MODE_BADGES, TOOL_RAIL_TEXT } from '../ToolRail.constants';
import type { BadgeState } from './slot-badge.type';

const slotBadge = (slot: ToolSlot, state: BadgeState): SlotBadge | null => {
  if (slot.surfaces.includes('map')) return null;
  if (slot.tool === 'pencil' && state.tiled !== 'off') return { glyph: 'T', text: TOOL_RAIL_TEXT.tiledBadge(state.tiled) };
  if (slot.tool === 'fill' && state.fillMode === 'global') return { glyph: 'G', text: TOOL_RAIL_TEXT.globalBadge };
  if ((slot.tool === 'rect' || slot.tool === 'ellipse') && state.filled) return { glyph: 'F', text: TOOL_RAIL_TEXT.filledBadge };
  if (slot.tool === 'select' && state.mode !== 'replace') return { glyph: MODE_BADGES[state.mode], text: TOOL_RAIL_TEXT.modeBadge(MODE_LABELS[state.mode]) };
  return null;
};

export { slotBadge };
