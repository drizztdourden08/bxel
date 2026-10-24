/* @layer renderer-app @kind logic */
import { DEFAULT_EXPORT_SETTINGS } from './export.constants';
import type { ExportSettings } from './export.type';

const startSettings = (last: ExportSettings | undefined, folder: string): ExportSettings => {
  const saved = { ...DEFAULT_EXPORT_SETTINGS, ...last, approved: false };
  const sprites = saved.sprites === 'sheet' ? 'all' : saved.sprites;
  return { ...saved, sprites, sheetId: '', folder: saved.folder === '' ? folder : saved.folder };
};

export { startSettings };
