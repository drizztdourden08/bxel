/* @layer renderer-app @kind types */
import type { ToolMember, ToolSlot } from './tool-catalogue.type';

interface FoundMember {
  slot: ToolSlot;
  member: ToolMember;
}

export type { FoundMember };
