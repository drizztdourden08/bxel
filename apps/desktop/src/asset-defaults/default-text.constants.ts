/* @layer renderer-app @kind constants */
import type { AssetDefaults } from '@bxel/project';
import { PALETTE_PRESETS } from '../palette-source/palette-source.constants';
import { presetById } from '../platform-preset/preset-by-id';
import { DEFAULTS_TEXT } from './asset-defaults.constants';

const switchText = (on: boolean): string => (on ? DEFAULTS_TEXT.on : DEFAULTS_TEXT.off);

const paletteText = (defaults: AssetDefaults): string => {
  const { palette } = defaults;
  if (palette.kind === 'file') return DEFAULTS_TEXT.paletteFile(palette.path);
  return DEFAULTS_TEXT.palettePreset(PALETTE_PRESETS.find((preset) => preset.id === palette.presetId)?.name ?? palette.presetId);
};

const DEFAULT_TEXT_OF: { readonly [K in keyof AssetDefaults]: (defaults: AssetDefaults) => string } = {
  size: (defaults) => DEFAULTS_TEXT.size(defaults.size.width, defaults.size.height),
  colorLimit: (defaults) => DEFAULTS_TEXT.colours(defaults.colorLimit),
  palette: paletteText,
  platformId: (defaults) => presetById(defaults.platformId)?.name ?? DEFAULTS_TEXT.none,
  platformStrict: (defaults) => switchText(defaults.platformStrict),
  transparent: (defaults) => switchText(defaults.transparent),
  frameDurationMs: (defaults) => DEFAULTS_TEXT.frame(defaults.frameDurationMs),
  pixelGrid: (defaults) => DEFAULTS_TEXT.size(defaults.pixelGrid.width, defaults.pixelGrid.height),
};

export { DEFAULT_TEXT_OF };
