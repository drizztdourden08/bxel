/* @layer core @kind types */
type Point = { readonly x: number; readonly y: number };
type Rect = { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
type Span = { readonly y: number; readonly x0: number; readonly x1: number };
type Corners = { readonly from: Point; readonly to: Point };
type Extent = { readonly x0: number; readonly y0: number; readonly x1: number; readonly y1: number };

export type { Corners, Extent, Point, Rect, Span };
