/* @layer renderer-app @kind types */
import type { LayerFlag } from './layer-flag.type';
import type { LockKind } from './layer-lock.type';

/** What the layer list and the layer commands can do to a sprite, a map or a sheet, by layer id. */
interface LayerActions {
  activate: (id: string) => void;
  setFlag: (ids: readonly string[], flag: LayerFlag, value: boolean) => void;
  setLock: (ids: readonly string[], kind: LockKind) => void;
  setColour: (ids: readonly string[], colour: string | null) => void;
  solo: (id: string) => void;
  others: (id: string, flag: LayerFlag) => void;
  rename: (id: string, name: string) => string | null;
  move: (from: number, to: number) => void;
  add: () => void;
  duplicate: () => void;
  merge: () => void;
  flatten: () => void;
  remove: () => void;
}

export type { LayerActions };
