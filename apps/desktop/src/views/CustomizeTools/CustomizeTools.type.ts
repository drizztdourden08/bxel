/* @layer renderer-app @kind types */
import type { SlotMove } from '../../editor/tool-catalogue/slot-layout.type';
import type { SlotGroup, ToolSlot } from '../../editor/tool-catalogue/tool-catalogue.type';

interface SlotDragPayload {
  readonly id: string;
}

interface SlotRowProps {
  slot: ToolSlot;
  hidden: readonly string[];
  onToggle: (memberId: string) => void;
  onMove: (move: SlotMove) => void;
  onStep: (id: string, step: 1 | -1) => void;
}

interface GroupBlockProps extends Omit<SlotRowProps, 'slot'> {
  group: SlotGroup;
  slots: readonly ToolSlot[];
}

export type { GroupBlockProps, SlotDragPayload, SlotRowProps };
