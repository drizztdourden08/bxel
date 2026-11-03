/* @layer renderer-app @kind types */
import type { SlotGroupId, ToolMember } from './tool-catalogue.type';

type Held = { id: string; group: SlotGroupId; members: ToolMember[] };

export type { Held };
