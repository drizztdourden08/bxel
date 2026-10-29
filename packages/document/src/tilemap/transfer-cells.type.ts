/* @layer core @kind types */
import type { CellView } from './cell-mask.type';

type Transfer = {
  readonly view: CellView;
  readonly mask: Uint8Array;
  readonly by: { readonly x: number; readonly y: number };
  readonly skipEmpty: boolean;
};

type Moved = { readonly at: number; readonly value: number };

type Transferred = { readonly moved: readonly Moved[]; readonly outside: number };

export type { Moved, Transfer, Transferred };
