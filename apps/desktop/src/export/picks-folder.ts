/* @layer renderer-app @kind logic */
import { FOLDER_KINDS } from './export.constants';
import type { ExportSettings } from './export.type';

const picksFolder = (settings: ExportSettings): boolean =>
  FOLDER_KINDS.includes(settings.kind) || (settings.kind === 'animation' && settings.animationId !== '');

export { picksFolder };
