/* @layer core @kind logic */
import type { PlatformPreset } from '../model/preset.type';
import { PRESET_ERROR_CODE } from '../results/preset-error.constants';
import { presetFail } from '../results/preset-fail';
import { presetOk } from '../results/preset-ok';
import type { PresetResult } from '../results/preset-result.type';
import { presetCatalog } from './preset-catalog';

const findPreset = (id: string): PresetResult<PlatformPreset> => {
  const found = presetCatalog().find((preset) => preset.id === id);
  if (found === undefined) {
    return presetFail(PRESET_ERROR_CODE.PRESET_UNKNOWN, `No preset has the id ${id}`, [id]);
  }
  return presetOk(found);
};

export { findPreset };
