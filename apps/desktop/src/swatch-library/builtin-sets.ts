/* @layer renderer-app @kind logic */
import { listPresets, presetDefaults } from '@bxel/presets';
import type { PlatformPreset } from '@bxel/presets';
import type { SourceColor } from '../palette-source/palette-source.type';
import { setKey } from './set-key';
import type { LibrarySet } from './swatch-library.type';

const presetColors = (preset: PlatformPreset): SourceColor[] =>
  presetDefaults(preset).palette.flatMap((slot): SourceColor[] => (slot.kind === 'color' ? [{ rgb: slot.rgb, name: slot.rgb }] : []));

const presetSet = (preset: PlatformPreset): LibrarySet => ({
  key: setKey('builtin', preset.id),
  origin: 'builtin',
  name: preset.name,
  colors: presetColors(preset),
  setId: null,
});

const builtinSets = (): readonly LibrarySet[] => listPresets().flatMap((family) => family.presets.map(presetSet));

export { builtinSets };
