/* @layer core @kind logic */
import type { Artwork } from '../../model/artwork.type';
import type { ExportPreset } from '../../model/export-preset.type';
import { assertNameFree } from '../../validate/assert-name-free';
import { presetOwnerKey } from './preset-owner-key';

const assertPresetNameFree = (artwork: Artwork, owner: Pick<ExportPreset, 'sheetId' | 'scope'>, name: string, own?: string): void => {
  const key = presetOwnerKey(owner);
  assertNameFree(
    artwork.presets.filter((preset) => preset.id !== own && presetOwnerKey(preset) === key).map((preset) => preset.name),
    name,
  );
};

export { assertPresetNameFree };
