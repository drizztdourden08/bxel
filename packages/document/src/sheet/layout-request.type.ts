/* @layer core @kind types */
type LayoutRequest =
  | { readonly kind: 'manual' }
  | {
      readonly kind: 'grid';
      readonly columns?: number | undefined;
      readonly cellWidth?: number | undefined;
      readonly cellHeight?: number | undefined;
      readonly order?: 'rows' | 'columns' | undefined;
    }
  | { readonly kind: 'packed'; readonly maxWidth?: number | undefined };

export type { LayoutRequest };
