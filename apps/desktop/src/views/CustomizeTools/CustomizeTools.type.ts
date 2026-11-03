/* @layer renderer-app @kind types */
import type { MemberMove, SlotMove } from '../../editor/tool-catalogue/slot-layout.type';
import type { SlotGroup, ToolMember, ToolSlot } from '../../editor/tool-catalogue/tool-catalogue.type';

interface SlotDragPayload {
  readonly id: string;
}

interface MemberDragPayload {
  readonly member: string;
}

interface SlotRowProps {
  slot: ToolSlot;
  hidden: readonly string[];
  onToggle: (memberId: string) => void;
  onMove: (move: SlotMove) => void;
  onMoveMember: (move: MemberMove) => void;
  onStep: (id: string, step: 1 | -1) => void;
}

interface GroupBlockProps extends Omit<SlotRowProps, 'slot'> {
  group: SlotGroup;
  slots: readonly ToolSlot[];
}

interface MemberRowProps {
  member: ToolMember;
  slot: ToolSlot;
  hidden: boolean;
  onToggle: (memberId: string) => void;
  onMoveMember: (move: MemberMove) => void;
}

export type { GroupBlockProps, MemberDragPayload, MemberRowProps, SlotDragPayload, SlotRowProps };
