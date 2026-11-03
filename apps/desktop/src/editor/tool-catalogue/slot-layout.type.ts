/* @layer renderer-app @kind types */
import type { SlotGroupId } from './tool-catalogue.type';

interface SlotPlace {
  id: string;
  group: SlotGroupId;
  members?: readonly string[];
}

type SurfaceLayout = readonly SlotPlace[];

interface SlotMove {
  id: string;
  group: SlotGroupId;
  before: string | null;
}

interface MemberMove {
  member: string;
  to: string | null;
  group?: SlotGroupId;
}

export type { MemberMove, SlotMove, SlotPlace, SurfaceLayout };
