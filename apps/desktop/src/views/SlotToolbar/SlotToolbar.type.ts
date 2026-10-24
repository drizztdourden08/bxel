/* @layer renderer-app @kind types */
import type { ToolbarItem, ToolbarSlot } from '@drizztdourden08/tessera';

interface SlotToolbarProps {
  label: string;
  items: readonly ToolbarItem[];
  slot: ToolbarSlot;
}

export type { SlotToolbarProps };
