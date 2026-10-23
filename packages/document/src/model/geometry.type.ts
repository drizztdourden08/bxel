/* @layer core @kind types */
type Point = { readonly x: number; readonly y: number };
type Size = { readonly width: number; readonly height: number };
type Rect = Point & Size;
type Pivot2 = { readonly x2: number; readonly y2: number };
type FlipAxis = 'horizontal' | 'vertical';
type TurnDirection = 'clockwise' | 'counter-clockwise' | 'half';

export type { FlipAxis, Pivot2, Point, Rect, Size, TurnDirection };
