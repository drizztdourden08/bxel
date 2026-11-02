/* @layer renderer-app @kind types */
import type { CombineMode, FillMode } from '@bxel/raster';
import type { ToolId } from '../../../editor/tool.type';
import type { TileMode } from '../../../stores/view-store.type';
import type { SlotBadge } from '../../SlotIcon';

interface BadgeState {
  fillMode: FillMode;
  filled: boolean;
  mode: CombineMode;
  tiled: TileMode;
}

type BadgeOf = (state: BadgeState) => SlotBadge | null;

type ToolBadges = Record<ToolId, BadgeOf>;

export type { BadgeOf, BadgeState, ToolBadges };
