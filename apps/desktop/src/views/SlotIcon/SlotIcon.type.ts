/* @layer renderer-app @kind types */
import type { ToolMember } from '../../editor/tool-catalogue/tool-catalogue.type';

type SlotMark = 'corner' | 'dot' | null;

interface SlotBadge {
  glyph: string;
  text: string;
}

interface SlotIconProps {
  member: ToolMember;
  filled: boolean;
  mark: SlotMark;
  badge: SlotBadge | null;
  assistant?: boolean;
}

export type { SlotBadge, SlotIconProps };
