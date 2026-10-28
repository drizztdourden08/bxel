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

interface LayerSource {
  layers: readonly { id: string; visible: boolean; locked: boolean; lockTransparency?: boolean }[];
  active: string;
  actions: LayerActions;
}

export type { CommandLayers, LayerSource };
