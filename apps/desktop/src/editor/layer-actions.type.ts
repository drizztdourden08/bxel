/* @layer renderer-app @kind types */
import type { LayerFlag } from './layer-flag.type';
import type { LayerFields, LockKind } from './layer-lock.type';
import type { TreeMoveWish } from './tree-move-plan.type';

type ViewFields = Pick<LayerFields, 'viewOpacity' | 'clip' | 'exported'>;

interface LayerActions {
  activate: (id: string) => void;
  setFlag: (ids: readonly string[], flag: LayerFlag, value: boolean) => void;
  setLock: (ids: readonly string[], kind: LockKind) => void;
  setColour: (ids: readonly string[], colour: string | null) => void;
  solo: (id: string) => void;
  others: (id: string, flag: LayerFlag) => void;
  rename: (id: string, name: string) => string | null;
  move: (from: number, to: number) => void;
  moveTo: (wish: TreeMoveWish) => void;
  setView: (ids: readonly string[], fields: ViewFields) => void;
  group: (ids: readonly string[]) => void;
  ungroup: (id: string) => void;
  flattenGroup: (id: string) => void;
  moveOut: (ids: readonly string[]) => void;
  selectChildren: (id: string) => void;
  mergeSelected: (ids: readonly string[]) => void;
  toLayer: (cut: boolean) => void;
  addReference: () => void;
  relink: (id: string) => void;
  add: () => void;
  addMissing?: (id: string) => void;
  duplicate: () => void;
  merge: () => void;
  flatten: () => void;
  remove: () => void;
}

export type { LayerActions, ViewFields };
