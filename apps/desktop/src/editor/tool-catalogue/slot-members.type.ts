/* @layer renderer-app @kind types */
import type { SlotPlace } from './slot-layout.type';
import type { ToolMember } from './tool-catalogue.type';

interface SlotMembersInput {
  placeId: string;
  own: readonly ToolMember[];
  place: SlotPlace | undefined;
  claims: ReadonlyMap<string, string>;
  found: ReadonlyMap<string, ToolMember>;
}

export type { SlotMembersInput };
