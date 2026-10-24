/* @layer renderer-app @kind logic */
import type { ProjectExport } from '@bxel/project';
import { DEFAULT_EXPORT_SETTINGS } from './export.constants';
import type { ExportSettings } from './export.type';

const startSettings = (last: ExportSettings | undefined, folder: string, project?: ProjectExport): ExportSettings => {
  const own = { pathTemplate: project?.pathTemplate ?? '', ...(project?.scale === undefined ? {} : { scale: project.scale }) };
  const saved = { ...DEFAULT_EXPORT_SETTINGS, ...last, approved: false, ...own };
  const sprites = saved.sprites === 'sheet' ? 'all' : saved.sprites;
  return { ...saved, sprites, sheetId: '', folder: saved.folder === '' ? folder : saved.folder };
};

export { startSettings };
