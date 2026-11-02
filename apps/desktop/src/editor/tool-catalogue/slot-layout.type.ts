/* @layer renderer-app @kind types */
import type { SlotGroupId } from './tool-catalogue.type';

interface SlotPlace {
  id: string;
  group: SlotGroupId;
}

type SurfaceLayout = readonly SlotPlace[];

interface SlotMove {
  id: string;
  group: SlotGroupId;
  before: string | null;
}

export type { SlotMove, SlotPlace, SurfaceLayout };
