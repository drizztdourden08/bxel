/* @layer core @kind types */
import type { FormatFailure } from '../failure/format.type';
import type { ExportSprite, SheetCell } from './export-sheet.type';
import type { PackedPage, PackSettings } from './sheet.type';

type AtlasPlanInput = {
  readonly sprites: readonly ExportSprite[];
  readonly settings: PackSettings;
  readonly trim: boolean;
  readonly pageSide: number;
};

type AtlasPlan = {
  readonly ok: true;
  readonly cells: readonly SheetCell[];
  readonly pages: readonly PackedPage[];
};

type AtlasPlanResult = AtlasPlan | FormatFailure;

export type { AtlasPlan, AtlasPlanInput, AtlasPlanResult };
