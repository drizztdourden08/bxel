/* @layer core @kind types */
type Merged<T> = { readonly items: readonly T[]; readonly divergent: readonly string[] };

export type { Merged };
