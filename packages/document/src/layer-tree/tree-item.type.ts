/* @layer core @kind types */
type TreeItem = {
  readonly id: string;
  readonly parentId?: string;
  readonly kind?: string;
  readonly visible: boolean;
};

type BlockMove<T> = {
  readonly id: string;
  readonly to: number;
  readonly parentId: string | null | undefined;
  readonly reparent: (item: T, parentId: string | undefined) => T;
};

export type { BlockMove, TreeItem };
