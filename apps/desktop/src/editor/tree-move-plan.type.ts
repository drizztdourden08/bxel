/* @layer renderer-app @kind types */
interface TreeMoveItem {
  readonly id: string;
  readonly parentId?: string;
  readonly kind?: string;
  readonly visible: boolean;
}

interface TreeMoveStep {
  id: string;
  to: number;
  parentId: string | null;
}

interface TreeMoveWish {
  keys: readonly string[];
  parentKey: string | null;
  index: number;
}

export type { TreeMoveItem, TreeMoveStep, TreeMoveWish };
