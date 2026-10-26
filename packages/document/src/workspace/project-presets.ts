/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { ExportPreset } from '../model/export-preset.type';
import { presetHome } from './preset-home';
import { spriteOwners } from './sprite-owners';

const projectPresets = (artwork: Artwork): readonly ExportPreset[] => {
  const owners = spriteOwners(artwork);
  return artwork.presets.filter((preset) => presetHome(artwork, preset, owners) === null);
};

export { projectPresets };
