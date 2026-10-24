/* @layer core @kind logic */
import type { ExportPreset } from '../model/export-preset.type';
import type { AssetKey } from './asset-key.type';
import { presetHome } from './preset-home';
import type { SliceContext } from './slice-context.type';

const homedPresets = ({ artwork, owners }: SliceContext, key: AssetKey): readonly ExportPreset[] =>
  artwork.presets.filter((preset) => {
    const home = presetHome(artwork, preset, owners);
    return home?.kind === key.kind && home.id === key.id;
  });

export { homedPresets };
