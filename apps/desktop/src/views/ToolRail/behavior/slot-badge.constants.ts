/* @layer renderer-app @kind constants */
import { MODE_LABELS } from '../../../editor/selection/selection.constants';
import type { SlotBadge } from '../../SlotIcon';
import { MODE_BADGES, TOOL_RAIL_TEXT } from '../ToolRail.constants';
import type { BadgeOf, ToolBadges } from './slot-badge.type';

const NO_BADGE: BadgeOf = () => null;

const TOOL_BADGES: ToolBadges = {
  pencil: (state): SlotBadge | null => (state.tiled === 'off' ? null : { glyph: 'T', text: TOOL_RAIL_TEXT.tiledBadge(state.tiled) }),
  fill: (state): SlotBadge | null => (state.fillMode === 'global' ? { glyph: 'G', text: TOOL_RAIL_TEXT.globalBadge } : null),
  rect: (state): SlotBadge | null => (state.filled ? { glyph: 'F', text: TOOL_RAIL_TEXT.filledBadge } : null),
  ellipse: (state): SlotBadge | null => (state.filled ? { glyph: 'F', text: TOOL_RAIL_TEXT.filledBadge } : null),
  select: (state): SlotBadge | null =>
    state.mode === 'replace' ? null : { glyph: MODE_BADGES[state.mode], text: TOOL_RAIL_TEXT.modeBadge(MODE_LABELS[state.mode]) },
  contour: NO_BADGE,
  curve: NO_BADGE,
  eraser: NO_BADGE,
  gradient: NO_BADGE,
  hand: NO_BADGE,
  line: NO_BADGE,
  move: NO_BADGE,
  picker: NO_BADGE,
  polygon: NO_BADGE,
  shade: NO_BADGE,
  slice: NO_BADGE,
  spray: NO_BADGE,
  zoom: NO_BADGE,
};

export { TOOL_BADGES };
