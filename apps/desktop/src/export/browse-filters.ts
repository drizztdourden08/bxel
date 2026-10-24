/* @layer renderer-app @kind logic */
import type { DocumentDialogOptions } from '@drizztdourden08/brock-core';
import { PNG_FILTERS } from '../files/files.constants';
import { ANIMATION_BROWSE_FILTERS } from './export.constants';
import type { ExportSettings } from './export.type';

const browseFilters = (settings: ExportSettings): NonNullable<DocumentDialogOptions['filters']> =>
  settings.kind === 'animation' ? ANIMATION_BROWSE_FILTERS[settings.animation] : PNG_FILTERS;

export { browseFilters };
