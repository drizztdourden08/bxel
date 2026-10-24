/* @layer core @kind types */
import type { LayoutRequest, Point, Rect } from '@bxel/document';
import type { ImportBank, ImportImage, ImportMapping } from './sprite-import.type';

type SheetImportCell = {
  readonly name: string;
  readonly image: ImportImage;
  readonly source: Rect;
  readonly mapping?: Partial<ImportMapping> | undefined;
};

type SheetImportRequest = {
  readonly sheetName: string;
  readonly layout: LayoutRequest;
  readonly spacing: Point;
  readonly margin: number;
  readonly bank: ImportBank;
  readonly cells: readonly SheetImportCell[];
};

export type { SheetImportCell, SheetImportRequest };
