/* @layer core @kind types */
import type { BrushId } from './ids.type';

type CustomBrush = {
  readonly id: BrushId;
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly pixels: string;
};

export type { CustomBrush };
