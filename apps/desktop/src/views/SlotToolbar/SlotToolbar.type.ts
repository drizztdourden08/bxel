/* @layer renderer-app @kind types */
import type { ToolbarColumns, ToolbarItem, ToolbarSlot } from '@drizztdourden08/tessera';

interface SlotToolbarProps {
  label: string;
  items: readonly ToolbarItem[];
  slot: ToolbarSlot;
  columns?: ToolbarColumns;
}

export type { SlotToolbarProps };
