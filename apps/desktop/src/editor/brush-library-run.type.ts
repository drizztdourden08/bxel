/* @layer renderer-app @kind types */
type LibraryAction =
  | { readonly kind: 'brush' | 'pattern'; readonly action: 'rename'; readonly id: string; readonly name: string }
  | { readonly kind: 'brush' | 'pattern'; readonly action: 'remove'; readonly id: string };

export type { LibraryAction };
