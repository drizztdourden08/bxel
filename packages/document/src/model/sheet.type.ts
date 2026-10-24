/* @layer core @kind types */
import type { Point, Rect } from './geometry.type';
import type { SheetId, SpriteId } from './ids.type';

type SheetLayout =
  | { readonly kind: 'manual' }
  | {
      readonly kind: 'grid';
      readonly columns: number;
      readonly cellWidth: number;
      readonly cellHeight: number;
      readonly order: 'rows' | 'columns';
    }
  | { readonly kind: 'packed'; readonly maxWidth: number };

type SheetEntry = { readonly spriteId: SpriteId; readonly at: Point; readonly source: Rect | null };

type Sheet = {
  readonly id: SheetId;
  readonly name: string;
  readonly created?: number;
  readonly layout: SheetLayout;
  readonly spacing: Point;
  readonly margin: number;
  readonly entries: readonly SheetEntry[];
};

export type { Sheet, SheetEntry, SheetLayout };
