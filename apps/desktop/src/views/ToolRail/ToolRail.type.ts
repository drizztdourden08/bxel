/* @layer renderer-app @kind types */
import type { MenuGroup, ShortcutKey, ToolbarSlot } from '@drizztdourden08/tessera';
import type { ToolMember, ToolSlot } from '../../editor/tool-catalogue/tool-catalogue.type';
import type { ToolId } from '../../editor/tool.type';
import type { Surface } from '../../surface/surface.type';
import type { SlotBadge } from '../SlotIcon';

interface ToolRailProps {
  slot: ToolbarSlot;
}

interface SlotItemContext {
  surface: Surface;
  active: ToolId;
  shown: ToolMember;
  filled: boolean;
  badge: SlotBadge | null;
  keys: readonly ShortcutKey[] | undefined;
  disabled: boolean;
  groups: readonly MenuGroup[] | undefined;
  hasFlyout: boolean;
  pick: (slot: ToolSlot) => void;
}

export type { SlotItemContext, ToolRailProps };
