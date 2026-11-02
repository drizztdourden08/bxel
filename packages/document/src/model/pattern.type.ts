/* @layer core @kind types */
import type { PatternId } from './ids.type';

type SavedPattern = {
  readonly id: PatternId;
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly pixels: string;
};

export type { SavedPattern };
