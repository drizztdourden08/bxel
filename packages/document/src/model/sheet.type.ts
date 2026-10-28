/* @layer core @kind types */
import type { Point, Rect } from './geometry.type';
import type { AnimationId, SheetId, SpriteId, TagId } from './ids.type';
import type { Guides } from './sprite.type';

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

type SheetAnimationEntry = {
  readonly animationId: AnimationId;
  readonly tagId: TagId | null;
  readonly at: Point;
};

type Sheet = {
  readonly id: SheetId;
  readonly name: string;
  readonly created?: number;
  readonly layout: SheetLayout;
  readonly spacing: Point;
  readonly margin: number;
  readonly entries: readonly SheetEntry[];
  readonly animationEntries?: readonly SheetAnimationEntry[];
  readonly guides?: Guides;
};

export type { Sheet, SheetAnimationEntry, SheetEntry, SheetLayout };
