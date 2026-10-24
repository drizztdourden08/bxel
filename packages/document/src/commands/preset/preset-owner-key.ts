/* @layer core @kind logic */
import type { ExportPreset } from '../../model/export-preset.type';
import { PROJECT_OWNER_KEY } from './preset.constants';

const presetOwnerKey = (preset: Pick<ExportPreset, 'sheetId' | 'scope'>): string => {
  if (preset.sheetId !== null) return preset.sheetId;
  const [only, ...rest] = preset.scope.sprites;
  return typeof only === 'string' && rest.length === 0 ? only : PROJECT_OWNER_KEY;
};

export { presetOwnerKey };
