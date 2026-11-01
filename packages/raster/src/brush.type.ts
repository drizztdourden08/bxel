/* @layer core @kind types */
type BrushShape = 'square' | 'circle' | 'line' | 'custom';
type BrushAngle = 0 | 45 | 90 | 135;
type BrushStamp = { readonly size: number; readonly offset: number; readonly cells: Uint8Array };
/**
 * A brush tip. A custom tip names a saved brush in brushId; the commands resolve it into a stencil of its drawn pixels before painting.
 * spacing is the number of pixels along the stroke between two stamps.
 */
type Brush = {
  readonly shape: BrushShape;
  readonly size: number;
  readonly angle?: BrushAngle;
  readonly brushId?: string;
  readonly spacing?: number;
  readonly stencil?: BrushStamp;
};

export type { Brush, BrushAngle, BrushShape, BrushStamp };
