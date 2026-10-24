/* @layer core @kind types */
import type { FormatFailure } from '../failure/format.type';
import type { ExportedSheet, ExportSheetInput } from './export-sheet.type';

type ExportPagesInput = Omit<ExportSheetInput, 'imageName'> & {
  readonly pageSide: number;
  readonly imageName: (page: number, count: number) => string;
};

type ExportPagesResult =
  | { readonly ok: true; readonly pages: readonly ExportedSheet[] }
  | FormatFailure;

export type { ExportPagesInput, ExportPagesResult };
