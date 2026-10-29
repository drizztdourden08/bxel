/* @layer core @kind types */
type TransferPlan = {
  readonly mask: Uint8Array;
  readonly moved: readonly { readonly at: number; readonly value: number }[];
};

export type { TransferPlan };
