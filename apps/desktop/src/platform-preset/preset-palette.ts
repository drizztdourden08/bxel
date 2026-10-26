/* @layer renderer-app @kind logic */
import type { PlatformPreset } from '@bxel/presets';

const presetPalette = (preset: PlatformPreset): readonly string[] => {
  if (preset.startPalette !== null) return preset.startPalette;
  return preset.colour.kind === 'fixedSet' ? preset.colour.colours : [];
};

export { presetPalette };
