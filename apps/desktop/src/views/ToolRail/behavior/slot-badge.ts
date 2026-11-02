/* @layer renderer-app @kind logic */
import type { ToolSlot } from '../../../editor/tool-catalogue/tool-catalogue.type';
import type { SlotBadge } from '../../SlotIcon';
import { TOOL_BADGES } from './slot-badge.constants';
import type { BadgeState } from './slot-badge.type';

const slotBadge = (slot: ToolSlot, state: BadgeState): SlotBadge | null => (slot.surfaces.includes('map') ? null : TOOL_BADGES[slot.tool](state));

export { slotBadge };
