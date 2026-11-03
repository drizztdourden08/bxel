/* @layer renderer-app @kind logic */
import type { SlotPlace } from './slot-layout.type';
import type { ToolMember } from './tool-catalogue.type';

const slotMembers = (placeId: string, own: readonly ToolMember[], place: SlotPlace | undefined, claims: ReadonlyMap<string, string>, found: ReadonlyMap<string, ToolMember>): ToolMember[] => {
  const listed = (place?.members ?? []).filter((id) => claims.get(id) === placeId).flatMap((id) => found.get(id) ?? []);
  const rest = own.filter((member) => !claims.has(member.id) && !listed.includes(member));
  return [...listed, ...rest];
};

export { slotMembers };
