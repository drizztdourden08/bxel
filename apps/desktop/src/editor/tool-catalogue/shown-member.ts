/* @layer renderer-app @kind logic */
import type { MemberChoice, ToolMember, ToolSlot } from './tool-catalogue.type';

const matches = (member: ToolMember, choice: MemberChoice): boolean => member.variant === undefined || member.variant.value === choice.variant;

const shownMember = (slot: ToolSlot, choice: MemberChoice): ToolMember => {
  const [first] = slot.members;
  return slot.members.find((member) => matches(member, choice)) ?? (first as ToolMember);
};

export { shownMember };
