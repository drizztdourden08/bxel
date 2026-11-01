/* @layer core @kind types */
type BrushShape = 'square' | 'circle' | 'line' | 'custom';
type BrushAngle = 0 | 45 | 90 | 135;
type BrushStamp = { readonly size: number; readonly offset: number; readonly cells: Uint8Array };
type Brush = {
  readonly shape: BrushShape;
  readonly size: number;
  readonly angle?: BrushAngle;
  readonly brushId?: string;
  readonly spacing?: number;
  readonly stencil?: BrushStamp;
};

export type { Brush, BrushAngle, BrushShape, BrushStamp };
