/* @layer renderer-app @kind types */
import type { ShapeKind } from '@bxel/raster';
import type { PixelIconName } from '../../icons/pixel-icon.type';
import type { Surface } from './surface.type';
import type { SelectVariant } from '../selection/selection.type';
import type { ToolId } from '../tool.type';

type DrawSurface = Exclude<Surface, 'none'>;

type SlotGroupId = 'draw' | 'shape' | 'select' | 'view';

type MemberVariant = { kind: 'shape'; value: ShapeKind } | { kind: 'select'; value: SelectVariant };

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
  shape: ShapeKind;
  variant: SelectVariant;
}

export type { DrawSurface, MemberChoice, SlotGroup, ToolMember, ToolSlot };
