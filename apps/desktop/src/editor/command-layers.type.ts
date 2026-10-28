/* @layer renderer-app @kind types */
import type { LayerActions } from './layer-actions.type';
import type { LockKind } from './layer-lock.type';

interface CommandLayers {
  actions: LayerActions;
  id: string;
  ids: readonly string[];
  others: readonly string[];
  all: readonly string[];
  visible: boolean;
  lock: LockKind;
  count: number;
}

export type { CommandLayers };
