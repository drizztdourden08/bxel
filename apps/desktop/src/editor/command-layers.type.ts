/* @layer renderer-app @kind types */
import type { LayerActions } from './layer-actions.type';
import type { LockKind, LockSource } from './layer-lock.type';

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
  layers: readonly (LockSource & { id: string; visible: boolean; kind?: string; parentId?: string })[];
  active: string;
  actions: LayerActions;
}

export type { CommandLayers, LayerSource };
