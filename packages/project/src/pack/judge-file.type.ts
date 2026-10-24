/* @layer core @kind types */
type Verdict = { readonly kind: 'add' } | { readonly kind: 'ignore' } | { readonly kind: 'skip'; readonly reason: string };

export type { Verdict };
