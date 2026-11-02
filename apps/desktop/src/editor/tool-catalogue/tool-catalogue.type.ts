/* @layer renderer-app @kind types */
import type { PixelIconName } from '../../icons/pixel-icon.type';
import type { Surface } from './surface.type';
import type { SelectVariant } from '../selection/selection.type';
import type { ToolId } from '../tool.type';

type DrawSurface = Exclude<Surface, 'none'>;

type SlotGroupId = 'draw' | 'shape' | 'select' | 'view';

type MemberVariant = { kind: 'select'; value: SelectVariant };

interface ToolMember {
  id: string;
  tool: ToolId;
  variant?: MemberVariant;
  label: string;
  description: string;
  icon: PixelIconName;
  filledIcon?: PixelIconName;
}

interface ToolSlot {
  id: string;
  group: SlotGroupId;
  label: string;
  key: string;
  tool: ToolId;
  surfaces: readonly DrawSurface[];
  members: readonly ToolMember[];
}

interface SlotGroup {
  id: SlotGroupId;
  label: string;
}

interface MemberChoice {
  variant: SelectVariant;
}

export type { DrawSurface, MemberChoice, SlotGroup, SlotGroupId, ToolMember, ToolSlot };
