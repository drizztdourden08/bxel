/* @layer renderer-app @kind types */
import type { ShortcutKey } from '@drizztdourden08/tessera';
import type { MemberChoice, SlotGroup, ToolMember, ToolSlot } from '../../editor/tool-catalogue/tool-catalogue.type';
import type { ToolId } from '../../editor/tool.type';
import type { Surface } from '../../editor/tool-catalogue/surface.type';

interface ToolRowProps {
  slot: ToolSlot;
  member: ToolMember;
  active: boolean;
  hidden: boolean;
  disabled: boolean;
  keys: readonly ShortcutKey[] | undefined;
  nested: boolean;
}

interface SlotBlockProps {
  slot: ToolSlot;
  shown: ToolMember;
  active: boolean;
  disabled: boolean;
  surface: Surface;
  keys: readonly ShortcutKey[] | undefined;
}

interface ToolGroupProps {
  group: SlotGroup;
  slots: readonly ToolSlot[];
  surface: Surface;
  active: ToolId;
  choice: MemberChoice;
  keysOf: (tool: ToolId) => ShortcutKey[] | undefined;
}

export type { SlotBlockProps, ToolGroupProps, ToolRowProps };
