/* @layer core @kind types */
type BrushShape = 'square' | 'circle' | 'line';
type BrushAngle = 0 | 45 | 90 | 135;
type Brush = { readonly shape: BrushShape; readonly size: number; readonly angle?: BrushAngle };
type BrushStamp = { readonly size: number; readonly offset: number; readonly cells: Uint8Array };

export type { Brush, BrushAngle, BrushShape, BrushStamp };
