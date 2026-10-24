/* @layer tests @kind helper */
import { exportSheet } from '@bxel/formats';
import type { ExportedSheet, ExportSheetInput, ExportSprite, PackSettings } from '@bxel/formats';
import { makeExportSprite } from './make-export-sprite';

const PACKED: PackSettings = {
  layout: { kind: 'packed', maxWidth: 64, padding: 2 },
  margin: 1,
  extrude: 1,
};

const SPRITES: readonly ExportSprite[] = [
  makeExportSprite({ name: 'hero', width: 12, height: 10, frames: 3 }),
  makeExportSprite({ name: 'coin', width: 8, height: 8, frames: 1 }),
];

const request = (extra: Partial<ExportSheetInput> = {}): ExportSheetInput => ({
  imageName: 'sheet.png',
  sprites: SPRITES,
  settings: PACKED,
  trim: true,
  scale: 1,
  flavour: 'bxel',
  ...extra,
});

const mustExport = (input: ExportSheetInput): ExportedSheet => {
  const result = exportSheet(input);
  if (!result.ok) throw new Error(result.message);
  return result;
};

export { mustExport, PACKED, request, SPRITES };
