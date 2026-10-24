/* @layer core @kind logic */
import type { PlatformPreset } from '../model/preset.type';
import { PRESET_ERROR_CODE } from '../results/preset-error.constants';
import { presetFail } from '../results/preset-fail';
import { presetOk } from '../results/preset-ok';
import type { PresetResult } from '../results/preset-result.type';
import { snapColor } from './snap-color';
import type { SnapReport } from './snap.type';

const snapPalette = (
  preset: PlatformPreset,
  hexes: readonly string[],
): PresetResult<SnapReport> => {
  const results = hexes.map((hex) => snapColor(preset, hex));
  const bad = hexes.filter((_hex, index) => results[index]?.ok !== true);
  if (bad.length > 0) {
    return presetFail(PRESET_ERROR_CODE.COLOUR_INVALID, 'The palette holds invalid colours', bad);
  }
  const colours = results.flatMap((result) => (result.ok ? [result.value] : []));
  const moved = colours.filter((colour, index) => colour !== hexes[index]?.toLowerCase()).length;
  return presetOk({ colours, moved });
};

export { snapPalette };
