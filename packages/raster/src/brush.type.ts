/* @layer core @kind types */
type BrushShape = 'square' | 'circle';
type Brush = { readonly shape: BrushShape; readonly size: number };
type BrushStamp = { readonly size: number; readonly offset: number; readonly cells: Uint8Array };

export type { Brush, BrushShape, BrushStamp };
