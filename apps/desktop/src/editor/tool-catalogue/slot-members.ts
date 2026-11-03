/* @layer renderer-app @kind logic */
import type { SlotMembersInput } from './slot-members.type';
import type { ToolMember } from './tool-catalogue.type';

const slotMembers = ({ placeId, own, place, claims, found }: SlotMembersInput): ToolMember[] => {
  const listed = (place?.members ?? []).filter((id) => claims.get(id) === placeId).flatMap((id) => found.get(id) ?? []);
  const rest = own.filter((member) => !claims.has(member.id) && !listed.includes(member));
  return [...listed, ...rest];
};

export { slotMembers };
