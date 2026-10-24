/* @layer core @kind logic */
import { formatHex, parseHex } from '@bxel/palette';
import type { PlatformPreset } from '../model/preset.type';
import { PRESET_ERROR_CODE } from '../results/preset-error.constants';
import { presetFail } from '../results/preset-fail';
import { presetOk } from '../results/preset-ok';
import type { PresetResult } from '../results/preset-result.type';
import { makeSnapper } from './make-snapper';

const snapColor = (preset: PlatformPreset, hex: string): PresetResult<string> => {
  const rgb = parseHex(hex);
  if (rgb === null) {
    return presetFail(PRESET_ERROR_CODE.COLOUR_INVALID, `Not a #rrggbb colour: ${hex}`, [hex]);
  }
  return presetOk(formatHex(makeSnapper(preset.colour)(rgb)));
};

export { snapColor };
