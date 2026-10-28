/* @layer renderer-app @kind logic */
import type { FoundMember } from './member-by-id.type';
import { TOOL_SLOTS } from './tool-catalogue.constants';

const memberById = (id: string): FoundMember | undefined => {
  for (const slot of TOOL_SLOTS) {
    const member = slot.members.find((each) => each.id === id);
    if (member) return { slot, member };
  }
  return undefined;
};

export { memberById };
