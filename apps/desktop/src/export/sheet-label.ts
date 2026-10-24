/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import type { ExportSettings } from './export.type';

const sheetLabel = (artwork: Artwork, settings: ExportSettings): string | null =>
  settings.sprites === 'sheet' ? (artwork.sheets.find((sheet) => sheet.id === settings.sheetId)?.name ?? null) : null;

export { sheetLabel };
