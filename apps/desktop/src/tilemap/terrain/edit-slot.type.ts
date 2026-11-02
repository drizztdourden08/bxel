/* @layer renderer-app @kind types */
type SlotAction = 'use' | 'add' | 'clear';

interface SlotEdit {
  readonly slot: number;
  readonly action: SlotAction;
  readonly key?: number;
  readonly set?: string;
}

export type { SlotAction, SlotEdit };
