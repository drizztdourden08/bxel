/* @layer core @kind types */
import type { BrushId } from './ids.type';

type SavedBrush = {
  readonly id: BrushId;
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly pixels: string;
};

export type { SavedBrush };
