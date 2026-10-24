/* @layer core @kind types */
import type { ExportPreset } from '../../model/export-preset.type';
import type { Sheet } from '../../model/sheet.type';

type SheetFileJson = { readonly sheet: Sheet; readonly presets: readonly ExportPreset[] };

export type { SheetFileJson };
