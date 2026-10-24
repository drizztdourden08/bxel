/* @layer core @kind types */
type EntityRef<T extends string> = T | { readonly ref: string };

export type { EntityRef };
