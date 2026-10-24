/* @layer core @kind types */
import type { FormatFailure } from '../failure/format.type';
import type { Box } from '../pixels/box.type';
import type { RgbaImage } from '../png.type';

type PackItem = {
  readonly key: string;
  readonly width: number;
  readonly height: number;
};

type PackedItem = Box & { readonly key: string; readonly rotated: boolean };

type RotateMode = 'none' | 'fit' | 'landscape';

type Oriented = { readonly width: number; readonly height: number; readonly rotated: boolean };

type GridLayout = {
  readonly kind: 'grid';
  readonly columns: number;
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly spacingX: number;
  readonly spacingY: number;
  readonly order: 'rows' | 'columns';
};

type PackedLayout = {
  readonly kind: 'packed';
  readonly maxWidth: number;
  readonly padding: number;
};

type SheetLayoutSpec = GridLayout | PackedLayout;

type PackSettings = {
  readonly layout: SheetLayoutSpec;
  readonly margin: number;
  readonly extrude: number;
  readonly powerOfTwo?: boolean;
  readonly rotate?: boolean;
};

type PackOptions = {
  readonly margin: number;
  readonly extrude: number;
  readonly powerOfTwo: boolean;
  readonly rotate: boolean;
};

type PackedPage = {
  readonly groups: readonly number[];
  readonly packed: PackedSheet;
};

type PackPagesResult = { readonly ok: true; readonly pages: readonly PackedPage[] } | FormatFailure;

type PackedSheet = {
  readonly ok: true;
  readonly width: number;
  readonly height: number;
  readonly items: readonly PackedItem[];
};

type PackResult = PackedSheet | FormatFailure;

type Shelf = {
  readonly y: number;
  readonly height: number;
  used: number;
};

type ShelfSlot = {
  readonly x: number;
  readonly shelf: Shelf;
};

type SheetPlacement = {
  readonly box: Box;
  readonly image: RgbaImage;
};

type TrimmedImage = {
  readonly image: RgbaImage;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly sourceWidth: number;
  readonly sourceHeight: number;
};

export type {
  GridLayout,
  Oriented,
  PackedItem,
  PackedLayout,
  PackedPage,
  PackedSheet,
  PackItem,
  PackOptions,
  PackPagesResult,
  PackResult,
  PackSettings,
  RotateMode,
  Shelf,
  ShelfSlot,
  SheetLayoutSpec,
  SheetPlacement,
  TrimmedImage,
};
