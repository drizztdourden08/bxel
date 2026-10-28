/* @layer renderer-app @kind logic */
import type { Artwork, Sheet } from '@bxel/document';
import { decodePng } from '@bxel/formats';
import { DEFAULT_EXPORT_SETTINGS } from '../export/export.constants';
import { planExport } from '../export/plan-export';
import { atlasExportSettings } from './atlas-export-settings';
import type { AtlasPack } from './manager.type';

const EXPORT_NONE = 'The sheet has nothing to export yet.';

interface ExportResult {
  width: number;
  height: number;
  rgba: Uint8ClampedArray<ArrayBuffer>;
  pageCount: number;
}

type ExportOutcome = { readonly ok: true; readonly result: ExportResult } | { readonly ok: false; readonly message: string };

/** The sheet as the exporter writes it, read back from the PNG itself, so the canvas can never drift from the file. */
const exportResult = (artwork: Artwork, revision: number, sheet: Sheet, pack: AtlasPack, page: number): ExportOutcome => {
  const settings = { ...DEFAULT_EXPORT_SETTINGS, ...atlasExportSettings(sheet, pack) };
  const plan = planExport({ frozen: { revision, artwork }, settings, selectedIds: [] });
  if (plan.problem !== null) return { ok: false, message: plan.problem };
  const images = plan.files.filter((file) => file.name.toLowerCase().endsWith('.png'));
  const file = images[Math.min(Math.max(0, page), images.length - 1)];
  if (!file) return { ok: false, message: EXPORT_NONE };
  const made = file.make();
  if (made.ok !== true || made.data.kind !== 'bytes') return { ok: false, message: made.ok === true ? '' : made.message };
  const png = decodePng(made.data.bytes);
  if (!png.ok) return { ok: false, message: png.message };
  return { ok: true, result: { width: png.width, height: png.height, rgba: Uint8ClampedArray.from(png.data), pageCount: images.length } };
};

export type { ExportOutcome, ExportResult };
export { exportResult };
